import axios from 'axios';
import type { Sql } from 'postgres';
import { ORACLE_INSTANCES, ORACLE_REGION, ORACLE_GEOGRAPHY } from '../config/oracle_instances';
import { DIGITALOCEAN_INSTANCES, DIGITALOCEAN_REGION, DIGITALOCEAN_GEOGRAPHY } from '../config/digitalocean_instances.ts';
import { ALIBABA_INSTANCES, ALIBABA_REGION, ALIBABA_GEOGRAPHY } from '../config/alibaba_instances.ts';
import { DigitalOceanDropletsScraper } from '../scrapers/digitalocean_droplets.ts';
import { GCP_INSTANCES, GCP_REGION, GCP_GEOGRAPHY } from '../config/gcp_instances.ts';
import { PROVIDERS } from '../config/index.ts';
import { DatabasePricingPipeline } from './database_pipeline';

export interface PricingRecord {
  provider: string;
  service: string;
  region: string;
  instanceType: string;
  vcpus: number;
  memoryGb: number;
  arch: string;
  os: string;
  cpuVendor: string;
  gpuCount: number;
  geography: string;
  category: string;
  price: number;
  unit: string;
  attributes?: Record<string, any>;
  dataSource?: 'live_api' | 'static_config';
  supportedLanguages?: string[];
}

async function fetchWithRetry(url: string, config: any = {}, retries = 3, timeout = 60000): Promise<any> {
  const mergedConfig = { timeout, ...config };
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url, mergedConfig);
    } catch (err: any) {
      console.warn(`Fetch failed for ${url.substring(0, 100)}... (attempt ${i + 1}/${retries}): ${err.message}`);
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // Exponential backoff
    }
  }
}

export interface PriceDriftResult {
  provider: string;
  service: string;
  instanceType: string;
  oldPrice: number;
  newPrice: number;
  pctChange: number;
}

export abstract class BaseAdapter {
  abstract providerSlug: string;
  abstract fetchPricing(): Promise<PricingRecord[]>;

  protected getGeography(region: string): string {
    const r = region.toLowerCase();
    if (r.includes('us-') || r.includes('us') || r.includes('america') || r.includes('canada') || r.includes('centralus') || r.includes('eastus') || r.includes('westus')) return 'N. America';
    if (r.includes('brazil') || r.includes('southamerica') || r.includes('sao') || r.includes('chile')) return 'S. America';
    if (r.includes('europe') || r.includes('uk-') || r.includes('france') || r.includes('germany') || r.includes('westcore') || r.includes('switzerland') || r.includes('northeurope') || r.includes('westeurope')) return 'W. Europe';
    if (r.includes('asia') || r.includes('japan') || r.includes('korea') || r.includes('india') || r.includes('singapore') || r.includes('tokyo')) return 'Asia Pacific';
    if (r.includes('australia')) return 'Australia';
    if (r.includes('me-') || r.includes('africa') || r.includes('uae') || r.includes('dubai')) return 'Mid East & Africa';
    return 'N. America';
  }

  protected getCpuVendor(sku: string): string {
    const s = sku.toLowerCase();

    if (s.includes('graviton')) return 'AWS';
    if (s.includes('ampere') || s.includes('altra')) return 'Ampere';
    if (s.includes('epyc') || s.includes('amd') || s.includes('_a') || s.includes('tau')) return 'AMD';
    if (s.includes('intel') || s.includes('xeon')) return 'Intel';

    if (s.match(/[a-z]\d+g/)) return 'AWS'; // Graviton
    if (s.match(/[a-z]\d+a/)) return 'AMD'; // e.g., t3a, m5a

    return 'Intel';
  }

  protected getGpuCount(sku: string): number {
    const s = sku.toUpperCase();
    if (s.startsWith('NC') || s.startsWith('ND') || s.startsWith('NV')) return 1;
    return 0;
  }

  protected categoryByRatio(vcpus: number, memoryGb: number): string {
    const ratio = vcpus > 0 ? memoryGb / vcpus : 4;
    if (ratio <= 2.1) return 'Compute optimized';
    if (ratio >= 7.5) return 'Memory optimized';
    return 'General purpose';
  }

  // AWS instance family → category. Source: AWS EC2 instance type families.
  protected classifyAws(instanceType: string, vcpus: number, memoryGb: number): string {
    const family = instanceType.split('.')[0].toLowerCase();
    const letter = family.replace(/[0-9].*$/, '');

    if (family.startsWith('hpc')) return 'HPC';
    if (family.startsWith('mac')) return 'General purpose';

    switch (letter) {
      case 't': return 'Burstable';
      case 'm': return 'General purpose';
      case 'c': return 'Compute optimized';
      case 'r': case 'x': case 'u': case 'z': return 'Memory optimized';
      case 'i': case 'd': case 'h': return 'Storage optimized';
      // GPU/accelerator families: g, p, inf, trn, dl, vt, f — fall back to ratio for the underlying CPU profile
      case 'g': case 'p': case 'inf': case 'trn': case 'dl': case 'vt': case 'f':
        return this.categoryByRatio(vcpus, memoryGb);
      default: return this.categoryByRatio(vcpus, memoryGb);
    }
  }

  // Azure VM series → category. Source: Azure VM size families (B/D/E/F/G/H/L/M/N).
  protected classifyAzure(instanceType: string, vcpus: number, memoryGb: number): string {
    const s = instanceType.toLowerCase();
    if (s.startsWith('standard_b') || s.startsWith('b')) return 'Burstable';
    if (s.startsWith('standard_h') || s.startsWith('h')) return 'HPC';
    if (s.startsWith('standard_l') || s.startsWith('l')) return 'Storage optimized';
    if (s.startsWith('standard_e') || s.startsWith('standard_m') || s.startsWith('standard_g') || /^[emg]\d/.test(s)) return 'Memory optimized';
    if (s.startsWith('standard_f') || /^f\d/.test(s)) return 'Compute optimized';
    if (s.startsWith('standard_d') || /^d\d/.test(s)) return 'General purpose';
    // N-series (NC/ND/NV) are GPU instances — fall back to ratio for the underlying CPU profile
    if (s.startsWith('standard_n') || /^n[cdv]/.test(s)) return this.categoryByRatio(vcpus, memoryGb);
    return this.categoryByRatio(vcpus, memoryGb);
  }

  // GCP machine series → category. Source: GCP Compute Engine machine families.
  protected classifyGcp(instanceType: string, vcpus: number, memoryGb: number): string {
    const s = instanceType.toLowerCase();
    if (s.startsWith('c2') || s.startsWith('c3') || s.startsWith('c4')) return 'Compute optimized';
    if (s.startsWith('m1') || s.startsWith('m2') || s.startsWith('m3') || s.includes('highmem')) return 'Memory optimized';
    if (s.startsWith('a2') || s.startsWith('a3') || s.startsWith('g2')) return this.categoryByRatio(vcpus, memoryGb);
    if (s.startsWith('e2') || s.startsWith('n1') || s.startsWith('n2') || s.startsWith('n4') || s.startsWith('t2')) return 'General purpose';
    return this.categoryByRatio(vcpus, memoryGb);
  }

  protected getCategory(sku: string, vcpus: number, memoryGb: number): string {
    return this.categoryByRatio(vcpus, memoryGb);
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

export class AzureAdapter extends BaseAdapter {
  providerSlug = 'azure';

  // Single canonical region — consistent with all other providers using one
  // reference region (AWS→us-east-1, GCP→us-central1, DO→nyc1).
  private static readonly REGION = 'eastus';

  // Extract vCPU count from Azure VM SKU name.
  // Standard_D4s_v3→4, Standard_B2ms→2, Standard_NC6→6, Standard_M64s→64
  private vcpuFromSku(sku: string): number {
    let m = sku.match(/Standard_[A-Za-z]+(\d+)/);
    if (m) return parseInt(m[1]);
    // Newer GPU SKU names omit the "Standard_" prefix entirely (e.g. "NC8dsxlRTX6Kv6").
    m = sku.match(/^[A-Za-z]+(\d+)/);
    return m ? parseInt(m[1]) : 0;
  }

  // Estimate memory based on Azure VM family ratios since Retail API omits it.
  private memoryFromSku(sku: string, vcpus: number): number {
    const s = sku.toLowerCase();
    if (s.startsWith('standard_e') || s.startsWith('standard_m') || s.startsWith('standard_g') || /^[emg]\d/.test(s)) return vcpus * 8;
    if (s.startsWith('standard_f') || /^f\d/.test(s)) return vcpus * 2;
    if (s.startsWith('standard_d') || /^d\d/.test(s)) return vcpus * 4;
    if (s.startsWith('standard_l') || /^l\d/.test(s)) return vcpus * 8;
    if (s.startsWith('standard_h') || /^h\d/.test(s)) return vcpus * 7;
    return vcpus * 4; // Default fallback (e.g. B-series, A-series)
  }

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Azure VM pricing (${AzureAdapter.REGION} only)...`);
    const filter = encodeURIComponent(
      `serviceName eq 'Virtual Machines' and priceType eq 'Consumption' and armRegionName eq '${AzureAdapter.REGION}'`
    );
    let url: string | null = `https://prices.azure.com/api/retail/prices?$filter=${filter}`;
    const allItems: any[] = [];

    let pages = 0;
    while (url && pages < 10) {
      const response = await fetchWithRetry(url);
      allItems.push(...(response.data.Items ?? []));
      url = response.data.NextPageLink ?? null;
      pages++;
    }

    const records: PricingRecord[] = [];
    // Deduplicate by SKU + OS — the API occasionally returns the same SKU
    // under multiple meter names (spot, dev/test, etc.) within one region.
    const seen = new Set<string>();

    for (const item of allItems) {
      if (!item.retailPrice || item.retailPrice <= 0) continue;

      const sku: string = (item.armSkuName ?? '').trim();
      if (!sku) continue;

      const productName: string = (item.productName ?? '').toLowerCase();
      const os = productName.includes('windows') ? 'Windows' : 'Linux';

      // Skip dev-test pricing
      if (productName.includes('dev/test')) continue;

      const isSpot = productName.includes('spot') || productName.includes('low priority');
      const purchaseOption = isSpot ? 'Spot' : 'OnDemand';

      const key = `${sku}::${os}::${purchaseOption}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const vcpus = this.vcpuFromSku(sku);
      const memoryGb = this.memoryFromSku(sku, vcpus);

      records.push({
        provider: 'azure',
        service: 'Virtual Machines',
        region: AzureAdapter.REGION,
        instanceType: sku,
        vcpus,
        memoryGb,
        arch: sku.toLowerCase().includes('arm64') ? 'ARM' : 'x86 64',
        os,
        cpuVendor: this.getCpuVendor(sku),
        gpuCount: this.getGpuCount(sku),
        geography: 'N. America',
        category: this.classifyAzure(sku, vcpus, memoryGb),
        price: item.retailPrice,
        unit: '1 Hour',
        dataSource: 'live_api' as const,
        attributes: {
          purchaseOption
        }
      });
    }

    console.log(`✅ Fetched ${records.length} Azure VM records`);
    return records;
  }
}

export class AWSAdapter extends BaseAdapter {
  providerSlug = 'aws';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('Fetching AWS pricing (us-east-1)...');
    const url = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.json';
    const response = await fetchWithRetry(url);
    const products = response.data.products;
    const terms = response.data.terms.OnDemand;

    // Deduplicate: one record per (instanceType, OS) — standard on-demand only.
    const seen = new Set<string>();
    const records: PricingRecord[] = [];

    for (const sku of Object.keys(products)) {
      const product = products[sku];
      if (product.productFamily !== 'Compute Instance') continue;

      const attr = product.attributes;

      // Standard on-demand only — skip Dedicated/Host tenancy, capacity
      // reservations, and instances with pre-installed SQL Server licences.
      if (attr.tenancy !== 'Shared') continue;
      if (attr.capacitystatus !== 'Used') continue;
      if (attr.preInstalledSw !== 'NA') continue;

      const term = terms[sku];
      if (!term) continue;

      const offerKey = Object.keys(term)[0];
      const priceDimKey = Object.keys(term[offerKey].priceDimensions)[0];
      const priceDim = term[offerKey].priceDimensions[priceDimKey];
      const price = parseFloat(priceDim.pricePerUnit.USD);
      if (isNaN(price) || price <= 0) continue;

      const os = attr.operatingSystem === 'Windows' ? 'Windows' : 'Linux';
      const dedupeKey = `${attr.instanceType}::${os}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      const vcpus = parseInt(attr.vcpu) || 2;
      let memoryGb = attr.memory ? parseFloat(attr.memory.replace(/,/g, '').split(' ')[0]) : 4;
      if (isNaN(memoryGb)) memoryGb = 4;
      records.push({
        provider: 'aws',
        service: 'EC2',
        region: attr.regionCode || 'us-east-1',
        instanceType: attr.instanceType,
        vcpus,
        memoryGb,
        arch: attr.architecture === 'arm64' ? 'ARM' : 'x86 64',
        os,
        cpuVendor: this.getCpuVendor(attr.physicalProcessor || ''),
        gpuCount: attr.gpu ? parseInt(attr.gpu) : 0,
        geography: this.getGeography(attr.location || ''),
        category: this.classifyAws(attr.instanceType, vcpus, memoryGb),
        price,
        unit: priceDim.unit,
        dataSource: 'live_api' as const,
      });
    }
    return records;
  }
}

export class GCPAdapter extends BaseAdapter {
  providerSlug = 'gcp';

  async fetchPricing(): Promise<PricingRecord[]> {
    try {
      return await this.fetchFromPricingApi();
    } catch (err: any) {
      console.warn(`⚠️  GCP live pricing fetch failed (${err.message}), falling back to static config.`);
      return this.fetchFromStaticConfig();
    }
  }

  private async fetchFromPricingApi(): Promise<PricingRecord[]> {
    console.log('Fetching GCP pricing from Cloud Pricing Calculator...');
    const response = await fetchWithRetry(
      'https://cloudpricingcalculator.appspot.com/static/data/pricelist.json'
    );

    const priceList: Record<string, any> = response.data?.gcp_price_list ?? {};
    const records: PricingRecord[] = [];
    const seen = new Set<string>();
    const PREFIX = 'CP-COMPUTEENGINE-VMIMAGE-';

    for (const [key, val] of Object.entries(priceList)) {
      if (!key.startsWith(PREFIX)) continue;

      // Prefer region-specific price over the generic 'us' bucket
      const price: number = Number(val['us-central1'] ?? val['us'] ?? 0);
      const cores: number = parseInt(String(val['cores'] ?? '0'), 10);
      const memGb: number = parseFloat(String(val['memory'] ?? '0'));

      if (!price || price <= 0 || cores <= 0 || memGb <= 0) continue;

      // CP-COMPUTEENGINE-VMIMAGE-N2-STANDARD-4 → n2-standard-4
      let instanceType = key.slice(PREFIX.length).toLowerCase();
      if (instanceType.length < 3) continue;

      let purchaseOption = 'OnDemand';
      if (instanceType.endsWith('-preemptible') || instanceType.endsWith('-spot')) {
        purchaseOption = 'Spot';
        instanceType = instanceType.replace(/-preemptible$/, '').replace(/-spot$/, '');
      }

      const dedupeKey = `${instanceType}::${purchaseOption}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      const cpuVendor = this.gcpCpuVendor(instanceType);
      records.push({
        provider: 'gcp',
        service: 'Compute Engine',
        region: GCP_REGION,
        instanceType,
        vcpus: cores,
        memoryGb: memGb,
        arch: cpuVendor === 'Ampere' ? 'ARM' : 'x86 64',
        os: 'Linux',
        cpuVendor,
        gpuCount: (instanceType.startsWith('a2-') || instanceType.startsWith('a3-') || instanceType.startsWith('g2-')) ? 1 : 0,
        geography: GCP_GEOGRAPHY,
        category: this.classifyGcp(instanceType, cores, memGb),
        price,
        unit: '1 Hour',
        dataSource: 'live_api' as const,
        attributes: { purchaseOption },
      });
    }

    if (records.length === 0) throw new Error('No GCP VM records parsed from pricing API response');
    console.log(`✅ Fetched ${records.length} GCP Compute Engine records from Cloud Pricing Calculator`);
    return records;
  }

  private fetchFromStaticConfig(): PricingRecord[] {
    console.log(`Fetching GCP pricing (static config fallback, ${GCP_INSTANCES.length} entries)...`);
    return GCP_INSTANCES.map(inst => ({
      provider: 'gcp',
      service: 'Compute Engine',
      region: GCP_REGION,
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: inst.cpuVendor === 'Ampere' ? 'ARM' : 'x86 64',
      os: 'Linux',
      cpuVendor: inst.cpuVendor,
      gpuCount: inst.gpuCount ?? 0,
      geography: GCP_GEOGRAPHY,
      category: this.classifyGcp(inst.type, inst.vcpus, inst.memory),
      price: inst.price,
      unit: 'Hour',
      dataSource: 'static_config' as const,
    }));
  }

  private gcpCpuVendor(instanceType: string): string {
    if (instanceType.startsWith('t2a')) return 'Ampere';
    if (instanceType.startsWith('n2d') || instanceType.startsWith('c2d') || instanceType.startsWith('t2d')) return 'AMD';
    return 'Intel';
  }
}

export class OracleAdapter extends BaseAdapter {
  providerSlug = 'oracle';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Oracle pricing (from src/config/oracle_instances.ts, ${ORACLE_INSTANCES.length} entries)...`);
    return ORACLE_INSTANCES.map(inst => {
      const gpuCount = inst.gpuCount ?? 0;
      const isHpc = inst.type.toLowerCase().includes('hpc');
      return {
        provider: 'oracle',
        service: 'OCI Compute',
        region: ORACLE_REGION,
        instanceType: inst.type,
        vcpus: inst.vcpus,
        memoryGb: inst.memory,
        arch: inst.cpuVendor === 'Ampere' || inst.cpuVendor === 'AWS' ? 'ARM' : 'x86 64',
        os: 'Linux',
        cpuVendor: inst.cpuVendor,
        gpuCount,
        geography: ORACLE_GEOGRAPHY,
        category: isHpc ? 'HPC' : this.categoryByRatio(inst.vcpus, inst.memory),
        price: inst.price,
        unit: 'Hour',
        dataSource: 'static_config' as const,
      };
    });
  }
}

export class DigitalOceanAdapter extends BaseAdapter {
  providerSlug = 'digitalocean';

  // DigitalOcean Droplet families → category. Storage- and Memory-optimized
  // get matched by slug prefix; everything else falls back to the
  // memory:vCPU ratio so GPU droplets get a real CPU-profile category.
  protected classifyDigitalOcean(slug: string, vcpus: number, memoryGb: number): string {
    const s = slug.toLowerCase();
    if (s.startsWith('c-') || s.startsWith('c2-')) return 'Compute optimized';
    if (s.startsWith('m-') || s.startsWith('m3-') || s.startsWith('m6-')) return 'Memory optimized';
    if (s.startsWith('so-') || s.startsWith('so1-')) return 'Storage optimized';
    if (s.startsWith('gpu-')) return this.categoryByRatio(vcpus, memoryGb);
    return 'General purpose';
  }

  // Detect GPU count from a DigitalOcean GPU droplet slug like
  // "gpu-h100x1-80gb" or "gpu-mi300x1-192gb" — the number after `x` is
  // the GPU count.
  protected gpuCountFromSlug(slug: string): number {
    const m = slug.toLowerCase().match(/gpu-[a-z0-9]+x(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  async fetchPricing(): Promise<PricingRecord[]> {
    const token = process.env.DIGITALOCEAN_API_TOKEN;
    if (token) {
      try {
        const records = await this.fetchFromApi(token);
        if (records.length > 0) return records;
        console.warn('⚠️  DigitalOcean live API returned 0 priced sizes — falling back to static config.');
      } catch (err: any) {
        console.error(`❌ DigitalOcean live API fetch failed (${err.message}), falling back to static config.`);
      }
    } else {
      console.warn('⚠️  DIGITALOCEAN_API_TOKEN not set — using scraper fallback.');
    }
    return this.fetchFromScraper();
  }

  private async fetchFromApi(token: string): Promise<PricingRecord[]> {
    console.log('Fetching DigitalOcean pricing (live /v2/sizes API)...');
    const url = 'https://api.digitalocean.com/v2/sizes?per_page=200';
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const sizes: any[] = response.data?.sizes || [];
    // The DO API's `available` flag reflects per-account creation eligibility
    // (e.g. new accounts often can't create GPU or premium tiers without
    // approval), not whether the size exists in the public catalogue. For a
    // price-comparison use case we want every size that has a valid hourly
    // price, regardless of whether this particular token can launch it.
    const priced = sizes.filter(s => s.price_hourly > 0);
    console.log(`DO /v2/sizes returned ${sizes.length} sizes; ${priced.length} have a hourly price.`);
    const records = priced
      .map(s => {
        const slug = String(s.slug || '');
        const vcpus = Number(s.vcpus) || 1;
        // The DO API returns memory in MB; we store GB.
        const memoryGb = (Number(s.memory) || 0) / 1024;
        const isAmd = /(?:^|-)amd(?:-|$)/.test(slug.toLowerCase());
        const gpuCount = this.gpuCountFromSlug(slug);

        return {
          provider: 'digitalocean',
          service: 'Droplets',
          region: DIGITALOCEAN_REGION,
          instanceType: slug,
          vcpus,
          memoryGb,
          arch: 'x86 64',
          os: 'Linux',
          cpuVendor: isAmd ? 'AMD' : 'Intel',
          gpuCount,
          geography: DIGITALOCEAN_GEOGRAPHY,
          category: this.classifyDigitalOcean(slug, vcpus, memoryGb),
          price: Number(s.price_hourly),
          unit: 'Hour',
          dataSource: 'live_api' as const,
        } as PricingRecord;
      });

    console.log(`✅ Fetched ${records.length} DigitalOcean Droplet sizes from live API.`);
    return records;
  }

  private async fetchFromScraper(): Promise<PricingRecord[]> {
    console.log(`Fetching DigitalOcean pricing (from Playwright Scraper)...`);
    const scraper = new DigitalOceanDropletsScraper();
    const scrapedInstances = await scraper.run();
    return scrapedInstances.map(s => ({
      provider: 'digitalocean',
      service: 'Droplets',
      region: DIGITALOCEAN_REGION,
      instanceType: s.slug,
      vcpus: s.vcpus,
      memoryGb: s.memory,
      arch: 'x86 64',
      os: 'Linux',
      cpuVendor: 'Intel',
      gpuCount: 0,
      geography: DIGITALOCEAN_GEOGRAPHY,
      category: s.category || this.classifyDigitalOcean(s.slug, s.vcpus, s.memory),
      price: s.price,
      unit: 'Hour',
      dataSource: 'playwright_scraper' as any,
    }));
  }
}

export class AlibabaAdapter extends BaseAdapter {
  providerSlug = 'alibaba';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Alibaba pricing (from static config, ${ALIBABA_INSTANCES.length} entries)...`);
    return ALIBABA_INSTANCES.map(inst => {
      const gpuCount = inst.gpuCount ?? 0;
      return {
        provider: 'alibaba',
        service: 'Elastic Compute Service',
        region: ALIBABA_REGION,
        instanceType: inst.type,
        vcpus: inst.vcpus,
        memoryGb: inst.memory,
        arch: inst.cpuVendor === 'Ampere' ? 'ARM' : 'x86 64',
        os: 'Linux',
        cpuVendor: inst.cpuVendor,
        gpuCount,
        geography: ALIBABA_GEOGRAPHY,
        category: this.categoryByRatio(inst.vcpus, inst.memory),
        price: inst.price,
        unit: 'Hour',
        dataSource: 'static_config' as const,
      };
    });
  }
}

export class PricingPipeline {
  protected sql: Sql;
  protected adapters: BaseAdapter[];

  constructor(sql: Sql) {
    this.sql = sql;
    // Removed dangerous TLS override — all certificates are now validated properly.
    // If you encounter certificate validation errors, the root cause is the database
    // connection or intermediate CA setup, not external cloud provider APIs.
    // See OPERATIONS_RUNBOOK.md for troubleshooting TLS issues.

    
    this.adapters = [
      new AzureAdapter(),
      new AWSAdapter(),
      new GCPAdapter(),
      new OracleAdapter(),
      new DigitalOceanAdapter(),
      new AlibabaAdapter()
    ];
  }

  async run(): Promise<{ provider: string; status: string; count?: number; message?: string; driftAlerts?: PriceDriftResult[] }[]> {
    const results = [];
    for (const adapter of this.adapters) {
      try {
        const records = await adapter.fetchPricing();
        const driftAlerts = await this.saveRecords(records);
        results.push({ provider: adapter.providerSlug, status: 'success', count: records.length, driftAlerts });
      } catch (error: any) {
        console.error(`Error running ${adapter.providerSlug} pipeline:`, error);
        results.push({ provider: adapter.providerSlug, status: 'error', message: error.message });
      }
    }
    return results;
  }

  
  protected async saveRecords(records: PricingRecord[], serviceCategory = 'compute'): Promise<PriceDriftResult[]> {
    if (records.length === 0) return [];

    const dataSource = records[0].dataSource ?? 'live_api';
    let driftAlerts: PriceDriftResult[] = [];

    await this.sql.begin(async (sql) => {
      const providerSlug = records[0].provider;
      let providerRes = await sql`SELECT id FROM providers WHERE slug = ${providerSlug}`;

      if (providerRes.length === 0) {
        // Auto-create providers that exist in config but were never seeded into the
        // providers table (e.g. vector DB providers like pinecone/qdrant/weaviate).
        // Prevents a whole category from failing to ingest just because the DB
        // predates a config addition.
        const name = PROVIDERS.find(p => p.id === providerSlug)?.name
          ?? providerSlug.charAt(0).toUpperCase() + providerSlug.slice(1);
        providerRes = await sql`
          INSERT INTO providers (slug, name) VALUES (${providerSlug}, ${name})
          ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;
      }
      const providerId = providerRes[0].id;

      // 1. Map Regions
      const regionMap = new Map<string, number>();
      const uniqueRegions = [...new Set(records.map(r => r.region))];

      for (const regionSlug of uniqueRegions) {
        const res = await sql`
          INSERT INTO regions (provider_id, slug) 
          VALUES (${providerId}, ${regionSlug}) 
          ON CONFLICT (provider_id, slug) DO UPDATE SET slug = EXCLUDED.slug 
          RETURNING id
        `;
        regionMap.set(regionSlug, res[0].id);
      }

      // 2. Ensure Service exists
      const serviceName = records[0].service;
      const serviceRes = await sql`
        INSERT INTO services (provider_id, name, category) 
        VALUES (${providerId}, ${serviceName}, ${serviceCategory}) 
        ON CONFLICT (provider_id, name) DO UPDATE SET category = EXCLUDED.category 
        RETURNING id
      `;
      const serviceId = serviceRes[0].id;

      // 3. Fetch old prices for drift detection BEFORE deleting
      const oldPriceRes = await sql`
        SELECT instance_type, price_per_unit 
        FROM pricing_records 
        WHERE service_id = ${serviceId}
      `;
      const oldPriceMap = new Map<string, number>();
      for (const row of oldPriceRes) {
        oldPriceMap.set(row.instance_type, parseFloat(row.price_per_unit));
      }

      // 4. Detect price drift (>20% change)
      if (oldPriceMap.size > 0) {
        for (const r of records) {
          const oldPrice = oldPriceMap.get(r.instanceType);
          if (oldPrice !== undefined && oldPrice > 0) {
            const pctChange = ((r.price - oldPrice) / oldPrice) * 100;
            if (Math.abs(pctChange) > 20) {
              driftAlerts.push({ provider: providerSlug, service: serviceName, instanceType: r.instanceType, oldPrice, newPrice: r.price, pctChange });
            }
          }
        }
        if (driftAlerts.length > 0) {
          console.warn(`⚠️  Price drift detected for ${providerSlug} / ${serviceName}: ${driftAlerts.length} instance(s) changed >20%`);
        }
      }

      // 5. Delete old records
      await sql`DELETE FROM pricing_records WHERE service_id = ${serviceId}`;

      // 6. Batch Insert Pricing Records
      const rowsToInsert = records.map(r => {
        const attrs = { ...r.attributes };
        if (r.supportedLanguages && r.supportedLanguages.length > 0) {
          attrs.supportedLanguages = r.supportedLanguages;
        }
        const prevPrice = oldPriceMap.get(r.instanceType);
        return {
          service_id: serviceId,
          region_id: regionMap.get(r.region),
          instance_type: r.instanceType,
          vcpus: r.vcpus,
          memory_gb: r.memoryGb,
          arch: r.arch,
          os: r.os,
          cpu_vendor: r.cpuVendor,
          gpu_count: r.gpuCount,
          geography: r.geography,
          category: r.category,
          price_per_unit: r.price,
          previous_price_per_unit: prevPrice ?? null,
          unit: r.unit,
          attributes: Object.keys(attrs).length > 0 ? this.sql.json(attrs) : null,
          data_source: dataSource
        };
      });

      // postgres.js bulk insert!
      if (rowsToInsert.length > 0) {
        await sql`INSERT INTO pricing_records ${sql(rowsToInsert)}`;
      }

      console.log(`✅ Saved ${records.length} records for ${providerSlug} (${serviceCategory}, source: ${dataSource})`);
    });

    return driftAlerts;
  }
}
