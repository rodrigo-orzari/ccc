import axios from 'axios';
import { BaseAdapter, PricingRecord } from './pricing_pipeline';

/**
 * AWS Lambda Live API Adapter
 * Fetches pricing from AWS Pricing API (public endpoint, no auth required)
 *
 * API: https://pricing.us-east-1.amazonaws.com/pricing
 * Data: All AWS services and regions with on-demand pricing
 *
 * Normalizes Lambda pricing to:
 * - Instance type: Lambda-{memory}MB-{arch}
 * - Price unit: GB-Hour (converted from GB-second)
 * - Memory: 128 MB to 10,240 MB (stores max for comparison)
 */
export class AWSLambdaLiveAdapter extends BaseAdapter {
  providerSlug = 'aws';
  private lambdaServiceCode = 'AWSLambda';

  // AWS Lambda supported languages
  private readonly AWS_LAMBDA_LANGUAGES = ['Python', 'Node', 'Java', 'Go', 'Ruby', 'C#'];

  /**
   * Fetch AWS Lambda pricing from live API
   *
   * API Response structure:
   * {
   *   products: {
   *     [sku]: {
   *       attributes: {
   *         memory: "1024",
   *         execDurationSeconds: "1",
   *         location: "US East (N. Virginia)",
   *         architecture: "ARM64" | "x86",
   *         ...
   *       }
   *     }
   *   },
   *   terms: {
   *     OnDemand: {
   *       [sku]: {
   *         [termCode]: {
   *           priceDimensions: {
   *             [dimensionKey]: {
   *               pricePerUnit: { USD: "0.00001667" }
   *             }
   *           }
   *         }
   *       }
   *     }
   *   }
   * }
   */
  async fetchPricing(): Promise<PricingRecord[]> {
    try {
      console.log('📥 Fetching AWS Lambda pricing from live API...');

      // Download AWS pricing data
      // Note: This is a large file (~50MB), consider caching in production
      const pricingUrl = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSLambda/current/index.json';
      const response = await axios.get(pricingUrl, {
        timeout: 30000,
        headers: {
          'User-Agent': 'CompareCCLoudCosts/1.0',
        },
      });

      const { products, terms } = response.data;
      const records: PricingRecord[] = [];

      // Filter for Lambda products only
      const lambdaProducts = Object.entries(products)
        .filter(([_, product]: any) => product.productFamily === 'AWSLambda')
        .map(([sku, product]: any) => ({ sku, ...product }));

      console.log(`Found ${lambdaProducts.length} Lambda SKUs, processing...`);

      // Track unique instance types to avoid duplicates
      const seenInstanceTypes = new Set<string>();

      for (const product of lambdaProducts) {
        try {
          const attrs = product.attributes;

          // Skip if not on-demand pricing
          if (attrs.purchaseType && attrs.purchaseType !== 'On Demand') continue;

          // Skip non-vCPU-second pricing dimensions (like invocations)
          if (!attrs.memory) continue;

          // Extract pricing information
          const memory = parseInt(attrs.memory); // MB
          const region = attrs.location; // e.g., "US East (N. Virginia)"
          const architecture = attrs.architecture || 'x86'; // ARM64 or x86

          // Skip unsupported architectures
          if (!['ARM64', 'x86', 'ARM', 'x86_64'].includes(architecture)) continue;

          // Map AWS location to region slug
          const regionSlug = this.mapAWSLocationToRegion(region);
          const geography = this.getGeography(regionSlug);

          // Get pricing from terms
          const onDemandTerms = terms.OnDemand[product.sku];
          if (!onDemandTerms) continue;

          // Extract GB-second price from the first term
          const termCode = Object.keys(onDemandTerms)[0];
          const pricingTerm = onDemandTerms[termCode];
          if (!pricingTerm) continue;

          // Find the GB-second pricing dimension
          let gbSecondPrice = 0;
          for (const priceDimension of Object.values(pricingTerm.priceDimensions)) {
            const dim = priceDimension as any;
            // Look for vCPU-seconds dimension
            if (dim.description?.includes('vCPU-seconds') || dim.description?.includes('GB-seconds')) {
              const usdPrice = dim.pricePerUnit?.USD;
              if (usdPrice) {
                gbSecondPrice = parseFloat(usdPrice);
                break;
              }
            }
          }

          // Skip if no price found
          if (gbSecondPrice === 0) continue;

          // Normalize architecture
          const normalizedArch = architecture === 'ARM64' ? 'ARM' : 'x86 64';
          const cpuVendor = architecture === 'ARM64' ? 'AWS' : 'Intel';

          // Create instance type key
          const instanceType = `Lambda-${memory}MB-${architecture}`;

          // Skip duplicate instance types (keep lowest price)
          if (seenInstanceTypes.has(instanceType)) continue;
          seenInstanceTypes.add(instanceType);

          // Convert GB-second to GB-hour (multiply by 3600 seconds)
          const gbHourPrice = gbSecondPrice * 3600;

          // Create pricing record
          const record: PricingRecord = {
            provider: 'aws',
            service: 'Lambda',
            region: regionSlug,
            instanceType: instanceType,
            vcpus: 1, // Normalized vCPU (Lambda scales automatically)
            memoryGb: memory / 1024, // Convert MB to GB
            arch: normalizedArch,
            os: 'Linux',
            cpuVendor: cpuVendor,
            gpuCount: 0,
            geography: geography,
            category: 'Serverless Compute',
            price: gbHourPrice,
            unit: 'GB-Hour',
            dataSource: 'live_api' as const,
            supportedLanguages: this.AWS_LAMBDA_LANGUAGES,
            attributes: {
              deployment_type: 'Serverless',
              memory_mb: memory,
              cpu_architecture: architecture,
              execution_unit: 'GB-Second',
              execution_price: gbSecondPrice,
              invocation_price: 0.0000002, // $0.20 per 1M invocations
              free_invocations_per_month: 1000000,
              timeout_seconds: 900, // Max 15 minutes
              ephemeral_storage_gb: 10, // Max 10GB
              cold_start_overhead_ms: 100, // Approximate
            },
          };

          records.push(record);
        } catch (error) {
          // Log errors but continue processing
          console.warn(`⚠️  Error processing Lambda SKU ${product.sku}:`, (error as Error).message);
        }
      }

      console.log(`✅ Fetched ${records.length} AWS Lambda pricing records`);
      return records;
    } catch (error) {
      console.error('❌ Failed to fetch AWS Lambda pricing from live API:', error);
      throw error;
    }
  }

  /**
   * Map AWS location names to region slugs
   * Examples:
   * - "US East (N. Virginia)" → "us-east-1"
   * - "Europe (Ireland)" → "eu-west-1"
   * - "Asia Pacific (Tokyo)" → "ap-northeast-1"
   */
  private mapAWSLocationToRegion(location: string): string {
    const locationMap: Record<string, string> = {
      // US regions
      'US East (N. Virginia)': 'us-east-1',
      'US East (Ohio)': 'us-east-2',
      'US West (N. California)': 'us-west-1',
      'US West (Oregon)': 'us-west-2',

      // Europe
      'Europe (Ireland)': 'eu-west-1',
      'Europe (London)': 'eu-west-2',
      'Europe (Paris)': 'eu-west-3',
      'Europe (Frankfurt)': 'eu-central-1',
      'Europe (Stockholm)': 'eu-north-1',
      'Europe (Milan)': 'eu-south-1',

      // Asia Pacific
      'Asia Pacific (Tokyo)': 'ap-northeast-1',
      'Asia Pacific (Seoul)': 'ap-northeast-2',
      'Asia Pacific (Osaka)': 'ap-northeast-3',
      'Asia Pacific (Singapore)': 'ap-southeast-1',
      'Asia Pacific (Sydney)': 'ap-southeast-2',
      'Asia Pacific (Mumbai)': 'ap-south-1',
      'Asia Pacific (Hong Kong)': 'ap-east-1',

      // South America
      'South America (São Paulo)': 'sa-east-1',

      // Africa
      'Africa (Cape Town)': 'af-south-1',

      // Middle East
      'Middle East (Bahrain)': 'me-south-1',

      // Canada
      'Canada (Central)': 'ca-central-1',

      // China (special handling)
      'China (Beijing)': 'cn-north-1',
      'China (Ningxia)': 'cn-northwest-1',

      // Any region
      'Any': 'us-east-1', // Default to us-east-1 for "Any"
    };

    return locationMap[location] || 'us-east-1';
  }
}

/**
 * GCP Cloud Run Live Adapter
 * Fetches Cloud Run pricing from the GCP Cloud Billing Catalog API
 * (cloudbilling.googleapis.com). Unlike Azure's Retail Prices API this one
 * requires a simple API key (no OAuth/service-account token) but the calling
 * project must have the Cloud Billing API enabled first — see
 * GCP_BILLING_API_KEY below. Gracefully returns [] (triggering the pipeline's
 * static-config fallback) if the key isn't set, matching the DigitalOcean
 * live adapter's pattern for an optional/missing credential.
 *
 * NOTE: this integration has not been exercised against a real GCP project —
 * we don't have a GCP_BILLING_API_KEY in this environment to verify against.
 * The request/response shapes below follow Google's documented Billing
 * Catalog API contract (services.list / services.skus.list); if Google has
 * changed field names since, the try/catch + empty-result path will surface
 * as "falls back to static config" rather than a hard failure.
 */
export class GCPCloudRunLiveAdapter extends BaseAdapter {
  providerSlug = 'gcp';
  private static readonly REGION = 'us-central1';
  private readonly GCP_CLOUD_RUN_LANGUAGES = ['Python', 'Node', 'Go', 'Java', 'C#', 'PHP', 'Ruby', 'Any'];

  // Same (vCPU, memoryGB) combinations as the static config (gcp_serverless.ts).
  private readonly CONFIGS: { vcpus: number; memoryGb: number }[] = [
    { vcpus: 1, memoryGb: 0.512 },
    { vcpus: 1, memoryGb: 1 },
    { vcpus: 1, memoryGb: 2 },
    { vcpus: 2, memoryGb: 1 },
    { vcpus: 2, memoryGb: 2 },
    { vcpus: 2, memoryGb: 4 },
    { vcpus: 4, memoryGb: 2 },
    { vcpus: 4, memoryGb: 4 },
    { vcpus: 4, memoryGb: 8 },
  ];

  async fetchPricing(): Promise<PricingRecord[]> {
    const apiKey = process.env.GCP_BILLING_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  GCP_BILLING_API_KEY not set — Cloud Run live pricing unavailable, using static config.');
      return [];
    }

    try {
      const serviceName = await this.findCloudRunServiceName(apiKey);
      const skus = await this.fetchAllSkus(serviceName, apiKey);

      const cpuRate = this.findRatePerUnit(skus, 'CPU Allocation Time');
      const memRate = this.findRatePerUnit(skus, 'Memory Allocation Time');
      if (cpuRate == null || memRate == null) {
        throw new Error(`Could not find both CPU and Memory Allocation Time SKUs (cpuRate=${cpuRate}, memRate=${memRate})`);
      }

      const records: PricingRecord[] = this.CONFIGS.map(({ vcpus, memoryGb }) => ({
        provider: 'gcp',
        service: 'Cloud Run',
        region: GCPCloudRunLiveAdapter.REGION,
        instanceType: `CloudRun-${vcpus}vCPU-${memoryGb < 1 ? `${memoryGb * 1024}MB` : `${memoryGb}GB`}`,
        vcpus,
        memoryGb,
        arch: 'x86 64',
        os: 'Linux',
        cpuVendor: 'Intel',
        gpuCount: 0,
        geography: this.getGeography(GCPCloudRunLiveAdapter.REGION),
        category: 'Serverless Compute',
        price: (cpuRate * vcpus * 3600) + (memRate * memoryGb * 3600),
        unit: 'GB-Hour',
        dataSource: 'live_api' as const,
        supportedLanguages: this.GCP_CLOUD_RUN_LANGUAGES,
        attributes: {
          service_type: 'Compute',
          deployment_type: 'Serverless',
          tier: 'Serverless',
          cold_start_overhead_ms: 150,
          timeout_seconds: 3600,
          memory_configuration: 'user-configurable',
          invocation_price: 0.0000004,
          invocation_price_per_1m: 0.40,
          free_vcpu_seconds_per_month: 180000,
          free_memory_gb_seconds_per_month: 360000,
          max_memory_gb: 8,
          billing_granularity_ms: 100,
          execution_model: 'Container Image',
          provisioned_concurrency_support: 'Yes',
          max_ephemeral_storage_gb: 32,
        },
      }));

      console.log(`✅ Fetched ${records.length} GCP Cloud Run pricing records (CPU: $${cpuRate}/vCPU-s, Mem: $${memRate}/GiB-s)`);
      return records;
    } catch (err: any) {
      console.warn(`⚠️  GCP Cloud Run live pricing fetch failed (${err.message}), falling back to static config.`);
      return [];
    }
  }

  private async findCloudRunServiceName(apiKey: string): Promise<string> {
    let pageToken: string | undefined;
    for (let page = 0; page < 20; page++) {
      const url = `https://cloudbilling.googleapis.com/v1/services?key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
      const response = await axios.get(url, { timeout: 30000 });
      const services: any[] = response.data?.services ?? [];
      const match = services.find(s => s.displayName === 'Cloud Run');
      if (match) return match.name; // e.g. "services/6F81-5844-456A"
      pageToken = response.data?.nextPageToken;
      if (!pageToken) break;
    }
    throw new Error('Cloud Run service not found in Billing Catalog services.list');
  }

  private async fetchAllSkus(serviceName: string, apiKey: string): Promise<any[]> {
    const skus: any[] = [];
    let pageToken: string | undefined;
    for (let page = 0; page < 20; page++) {
      const url = `https://cloudbilling.googleapis.com/v1/${serviceName}/skus?key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
      const response = await axios.get(url, { timeout: 30000 });
      skus.push(...(response.data?.skus ?? []));
      pageToken = response.data?.nextPageToken;
      if (!pageToken) break;
    }
    return skus;
  }

  // Finds the on-demand (non-free-tier) unit price for a SKU whose
  // description contains `descriptionSubstr`, scoped to our reference region.
  private findRatePerUnit(skus: any[], descriptionSubstr: string): number | null {
    const sku = skus.find(s =>
      (s.description ?? '').includes(descriptionSubstr) &&
      !(s.description ?? '').toLowerCase().includes('free') &&
      (s.serviceRegions ?? []).some((r: string) => r === GCPCloudRunLiveAdapter.REGION || r === 'global')
    );
    if (!sku) return null;

    const tiers = sku.pricingInfo?.[0]?.pricingExpression?.tieredRates ?? [];
    // Take the highest-usage (last) tier — the first tier is often the free allotment at $0.
    const rate = tiers[tiers.length - 1]?.unitPrice;
    if (!rate) return null;

    const units = parseInt(rate.units ?? '0', 10);
    const nanos = rate.nanos ?? 0;
    const price = units + nanos / 1e9;
    return price > 0 ? price : null;
  }
}

/**
 * Azure Functions Live Adapter
 * Fetches Consumption-plan pricing from the Azure Retail Prices API — a
 * genuinely public, keyless REST API (no auth, no subscription needed):
 * https://prices.azure.com/api/retail/prices
 *
 * The Consumption plan bills two meters (execution time in GB-seconds,
 * invocation count) rather than a distinct SKU per memory size, so — like
 * the static config it replaces — we generate a handful of representative
 * memory tiers (128MB up to the 1.75GB Consumption-plan ceiling) and derive
 * each tier's GB-hour price from the live per-GB-second rate.
 */
export class AzureFunctionsLiveAdapter extends BaseAdapter {
  providerSlug = 'azure';
  private static readonly REGION = 'eastus';
  private readonly AZURE_FUNCTIONS_LANGUAGES = ['C#', 'JavaScript', 'Python', 'Java', 'PowerShell', 'Go', 'Rust'];

  // Same memory tiers and instance-type names as the static config
  // (azure_serverless.ts) so a live fetch produces identical comparison rows,
  // just with live prices. Names are explicit (not derived from memoryGb *
  // 1024) since 0.128 GB rounds to 131MB, not the conventional "128MB".
  private readonly MEMORY_TIERS: { type: string; memoryGb: number }[] = [
    { type: 'Functions-128MB-Consumption', memoryGb: 0.128 },
    { type: 'Functions-256MB-Consumption', memoryGb: 0.256 },
    { type: 'Functions-512MB-Consumption', memoryGb: 0.512 },
    { type: 'Functions-1GB-Consumption', memoryGb: 1 },
    { type: 'Functions-1536MB-Consumption', memoryGb: 1.5 },
    { type: 'Functions-1792MB-Consumption', memoryGb: 1.75 },
  ];

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('📥 Fetching Azure Functions pricing from live Retail Prices API...');
    const filter = encodeURIComponent(
      `serviceName eq 'Functions' and priceType eq 'Consumption' and armRegionName eq '${AzureFunctionsLiveAdapter.REGION}'`
    );
    const url = `https://prices.azure.com/api/retail/prices?api-version=2023-01-01-preview&$filter=${filter}`;
    const response = await axios.get(url, { timeout: 30000 });
    const items: any[] = response.data?.Items ?? [];

    // "Standard" is the classic Consumption-plan SKU (as opposed to "Flex
    // Consumption"/"Premium"). Each meter has a $0 free-tier row and a
    // non-zero paid-tier row for the same meterName — take the paid one.
    const executionItem = items.find(i => i.skuName === 'Standard' && i.meterName === 'Standard Execution Time' && i.retailPrice > 0);
    const invocationItem = items.find(i => i.skuName === 'Standard' && i.meterName === 'Standard Total Executions' && i.retailPrice > 0);

    if (!executionItem) throw new Error('Azure Retail Prices API: no non-zero Standard Execution Time meter found for Functions');

    const gbSecondPrice = executionItem.retailPrice; // $ per GB-second
    // unitOfMeasure for "Total Executions" meters is "10" (i.e. price is per 10 executions).
    const invocationPricePerMillion = invocationItem
      ? (invocationItem.retailPrice / 10) * 1_000_000
      : 0.20; // fall back to the well-known $0.20/1M rate if the meter is missing

    const records: PricingRecord[] = this.MEMORY_TIERS.map(({ type, memoryGb }) => ({
      provider: 'azure',
      service: 'Azure Functions',
      region: AzureFunctionsLiveAdapter.REGION,
      instanceType: type,
      vcpus: 1,
      memoryGb,
      arch: 'x86 64',
      os: 'Linux',
      cpuVendor: 'Intel',
      gpuCount: 0,
      geography: this.getGeography(AzureFunctionsLiveAdapter.REGION),
      category: 'Serverless Compute',
      price: gbSecondPrice * 3600 * memoryGb,
      unit: 'GB-Hour',
      dataSource: 'live_api' as const,
      supportedLanguages: this.AZURE_FUNCTIONS_LANGUAGES,
      attributes: {
        service_type: 'Compute',
        deployment_type: 'Serverless',
        tier: 'Serverless',
        cold_start_overhead_ms: 350,
        timeout_seconds: 300,
        memory_configuration: 'fixed-tiers',
        invocation_price: invocationPricePerMillion / 1_000_000,
        invocation_price_per_1m: invocationPricePerMillion,
        free_invocations_per_month: 1000000,
        free_gb_seconds_per_month: 400000,
        max_memory_gb: 1.75,
        billing_granularity_ms: 1,
        execution_model: 'Both',
        provisioned_concurrency_support: 'Yes',
        max_ephemeral_storage_gb: 1.5,
      },
    }));

    console.log(`✅ Fetched ${records.length} Azure Functions pricing records (execution rate: $${gbSecondPrice}/GB-s)`);
    return records;
  }
}
