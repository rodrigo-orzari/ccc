import axios from 'axios';
import { BaseAdapter, PricingRecord } from './pricing_pipeline.js';

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
  private readonly AWS_LAMBDA_LANGUAGES = ['Python', 'Node.js', 'Java', 'Go', 'Ruby', 'C#'];

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
      const pricingUrl = 'https://pricing.us-east-1.amazonaws.com/pricing';
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
 * GCP Cloud Run Live Adapter (Placeholder)
 * To be implemented in Phase 2
 */
export class GCPCloudRunLiveAdapter extends BaseAdapter {
  providerSlug = 'gcp';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('⏳ GCP Cloud Run adapter not yet implemented (Phase 2)');
    return [];
  }
}

/**
 * Azure Functions Live Adapter (Placeholder)
 * To be implemented in Phase 3
 */
export class AzureFunctionsLiveAdapter extends BaseAdapter {
  providerSlug = 'azure';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('⏳ Azure Functions adapter not yet implemented (Phase 3)');
    return [];
  }
}
