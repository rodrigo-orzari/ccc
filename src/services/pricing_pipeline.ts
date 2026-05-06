import axios from 'axios';
import { Pool } from 'pg';
import { ORACLE_INSTANCES, ORACLE_REGION, ORACLE_GEOGRAPHY } from '../config/oracle_instances.js';
import { DIGITALOCEAN_INSTANCES, DIGITALOCEAN_REGION, DIGITALOCEAN_GEOGRAPHY } from '../config/digitalocean_instances.js';
import { GCP_INSTANCES, GCP_REGION, GCP_GEOGRAPHY } from '../config/gcp_instances.js';
import { DatabasePricingPipeline } from './database_pipeline.js';

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

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('Fetching Azure pricing...');
    let url: string | null = 'https://prices.azure.com/api/retail/prices?$filter=serviceName eq \'Virtual Machines\' and (priceType eq \'Consumption\' or priceType eq \'Reservation\')';
    const allItems: any[] = [];

    let pages = 0;
    while (url && pages < 10) {
      const response = await axios.get(url);
      allItems.push(...response.data.Items);
      url = response.data.NextPageLink;
      pages++;
    }

    return allItems
      .filter((item: any) => item.retailPrice > 0)
      .map((item: any) => {
        const sku = item.armSkuName || '';
        const vcpus = sku.includes('v') ? parseInt(sku.match(/\d+/)?.[0] || '2') : 2;
        let price = item.retailPrice;
        let unit = item.unitOfMeasure || '1 Hour';

        if (unit && unit.includes('Year')) {
          const years = unit.includes('3') ? 3 : 1;
          price = price / (years * 365 * 24);
          unit = '1 Hour (Reserved)';
        }

        return {
          provider: 'azure',
          service: 'Virtual Machines',
          region: item.armRegionName || 'Global',
          instanceType: sku,
          vcpus: vcpus,
          memoryGb: 4,
          arch: sku.toLowerCase().includes('arm64') ? 'ARM' : 'x86 64',
          os: item.productName.toLowerCase().includes('windows') ? 'Windows' : 'Linux',
          cpuVendor: this.getCpuVendor(sku),
          gpuCount: this.getGpuCount(sku),
          geography: this.getGeography(item.armRegionName || ''),
          category: this.classifyAzure(sku, vcpus, 4),
          price: price,
          unit: unit
        };
      });
  }
}

export class AWSAdapter extends BaseAdapter {
  providerSlug = 'aws';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('Fetching AWS pricing (us-east-1)...');
    const url = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.json';
    const response = await axios.get(url);
    const products = response.data.products;
    const terms = response.data.terms.OnDemand;

    const records: PricingRecord[] = [];
    const skuKeys = Object.keys(products).slice(0, 5000);

    for (const sku of skuKeys) {
      const product = products[sku];
      if (product.productFamily !== 'Compute Instance') continue;

      const attr = product.attributes;
      const term = terms[sku];
      if (!term) continue;

      const offerKey = Object.keys(term)[0];
      const priceDimKey = Object.keys(term[offerKey].priceDimensions)[0];
      const priceDim = term[offerKey].priceDimensions[priceDimKey];
      const price = parseFloat(priceDim.pricePerUnit.USD);

      if (isNaN(price) || price <= 0) continue;

      const vcpus = parseInt(attr.vcpu) || 2;
      const memoryGb = attr.memory ? parseFloat(attr.memory.split(' ')[0]) : 4;

      records.push({
        provider: 'aws',
        service: 'EC2',
        region: attr.regionCode || 'us-east-1',
        instanceType: attr.instanceType,
        vcpus: vcpus,
        memoryGb: memoryGb,
        arch: attr.architecture === 'arm64' ? 'ARM' : 'x86 64',
        os: attr.operatingSystem === 'Windows' ? 'Windows' : 'Linux',
        cpuVendor: this.getCpuVendor(attr.physicalProcessor || ''),
        gpuCount: attr.gpu ? parseInt(attr.gpu) : 0,
        geography: this.getGeography(attr.location || ''),
        category: this.classifyAws(attr.instanceType, vcpus, memoryGb),
        price: parseFloat(priceDim.pricePerUnit.USD),
        unit: priceDim.unit
      });
    }
    return records;
  }
}

export class GCPAdapter extends BaseAdapter {
  providerSlug = 'gcp';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching GCP pricing (from src/config/gcp_instances.ts, ${GCP_INSTANCES.length} entries)...`);
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
        return await this.fetchFromApi(token);
      } catch (err: any) {
        console.error(`❌ DigitalOcean live API fetch failed (${err.message}), falling back to static config.`);
      }
    } else {
      console.warn('⚠️  DIGITALOCEAN_API_TOKEN not set — using static fallback in src/config/digitalocean_instances.ts.');
    }
    return this.fetchFromConfig();
  }

  private async fetchFromApi(token: string): Promise<PricingRecord[]> {
    console.log('Fetching DigitalOcean pricing (live /v2/sizes API)...');
    const url = 'https://api.digitalocean.com/v2/sizes?per_page=200';
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30000
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

  private fetchFromConfig(): PricingRecord[] {
    console.log(`Fetching DigitalOcean pricing (from src/config/digitalocean_instances.ts, ${DIGITALOCEAN_INSTANCES.length} entries)...`);
    return DIGITALOCEAN_INSTANCES.map(s => ({
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
      category: s.category || this.getCategory(s.slug, s.vcpus, s.memory),
      price: s.price,
      unit: 'Hour',
      dataSource: 'static_config' as const,
    }));
  }
}

export class PricingPipeline {
  protected pool: Pool;
  protected adapters: BaseAdapter[];

  constructor(pool: Pool) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    this.pool = pool;
    this.adapters = [
      new AzureAdapter(),
      new AWSAdapter(),
      new GCPAdapter(),
      new OracleAdapter(),
      new DigitalOceanAdapter()
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
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const providerSlug = records[0].provider;
      const providerRes = await client.query('SELECT id FROM providers WHERE slug = $1', [providerSlug]);

      if (providerRes.rows.length === 0) {
        throw new Error(`Provider ${providerSlug} not found in database`);
      }

      const providerId = providerRes.rows[0].id;

      // 1. Map Regions
      const regionMap = new Map<string, number>();
      const uniqueRegions = [...new Set(records.map(r => r.region))];

      for (const regionSlug of uniqueRegions) {
        const res = await client.query(
          'INSERT INTO regions (provider_id, slug) VALUES ($1, $2) ON CONFLICT (provider_id, slug) DO UPDATE SET slug = EXCLUDED.slug RETURNING id',
          [providerId, regionSlug]
        );
        regionMap.set(regionSlug, res.rows[0].id);
      }

      // 2. Ensure Service exists
      const serviceName = records[0].service;
      const serviceRes = await client.query(
        'INSERT INTO services (provider_id, name, category) VALUES ($1, $2, $3) ON CONFLICT (provider_id, name) DO UPDATE SET category = EXCLUDED.category RETURNING id',
        [providerId, serviceName, serviceCategory]
      );
      const serviceId = serviceRes.rows[0].id;

      // 3. Fetch old prices for drift detection BEFORE deleting
      const oldPriceRes = await client.query<{ instance_type: string; price_per_unit: string }>(
        'SELECT instance_type, price_per_unit FROM pricing_records WHERE service_id = $1',
        [serviceId]
      );
      const oldPriceMap = new Map<string, number>();
      for (const row of oldPriceRes.rows) {
        oldPriceMap.set(row.instance_type, parseFloat(row.price_per_unit));
      }

      // 4. Detect price drift (>20% change)
      const driftAlerts: PriceDriftResult[] = [];
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
      await client.query('DELETE FROM pricing_records WHERE service_id = $1', [serviceId]);

      // 6. Batch Insert Pricing Records
      const BATCH_SIZE = 100;
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        const values: any[] = [];
        const placeholders = batch.map((r, idx) => {
          const offset = idx * 15;
          values.push(
            serviceId,
            regionMap.get(r.region),
            r.instanceType,
            r.vcpus,
            r.memoryGb,
            r.arch,
            r.os,
            r.cpuVendor,
            r.gpuCount,
            r.geography,
            r.category,
            r.price,
            r.unit,
            r.attributes ? JSON.stringify(r.attributes) : null,
            dataSource
          );
          return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15})`;
        }).join(',');

        await client.query(
          `INSERT INTO pricing_records
           (service_id, region_id, instance_type, vcpus, memory_gb, arch, os, cpu_vendor, gpu_count, geography, category, price_per_unit, unit, attributes, data_source)
           VALUES ${placeholders}`,
          values
        );
      }

      await client.query('COMMIT');
      console.log(`✅ Saved ${records.length} records for ${providerSlug} (${serviceCategory}, source: ${dataSource})`);
      return driftAlerts;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('❌ Batch save failed:', err);
      throw err;
    } finally {
      client.release();
    }
  }
}
