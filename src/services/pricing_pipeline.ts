import axios from 'axios';
import { Pool } from 'pg';

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

  protected getCategory(sku: string, vcpus: number, memoryGb: number): string {
    const s = sku.toLowerCase();
    const ratio = vcpus > 0 ? memoryGb / vcpus : 4;

    if (s.startsWith('p') || s.startsWith('g') || s.startsWith('nc') || s.startsWith('nd') || s.startsWith('nv') || s.includes('gpu')) return 'GPU';
    if (s.includes('hpc')) return 'HPC';

    if (s.startsWith('t1') || s.startsWith('t2') || s.startsWith('t3') || s.startsWith('t4') || s.startsWith('b') || s.includes('burstable')) return 'Burstable';

    if (s.startsWith('i') || s.startsWith('d') || s.includes('storage') || s.includes('highio')) return 'Storage optimized';

    if (ratio >= 7.5 || s.startsWith('r') || s.includes('highmem') || s.includes('memory')) return 'Memory optimized';

    if (ratio <= 2.1 || s.startsWith('c') || s.includes('highcpu') || s.includes('compute')) return 'Compute optimized';

    return 'General purpose';
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
          category: this.getCategory(sku, vcpus, 4),
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
        category: this.getCategory(attr.instanceType, vcpus, memoryGb),
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
    console.log('Fetching GCP pricing (Compute Engine)...');
    const instances = [
      { type: 'n1-standard-1', vcpus: 1, memory: 3.75, price: 0.0475 },
      { type: 'n1-standard-2', vcpus: 2, memory: 7.5, price: 0.095 },
      { type: 'e2-medium', vcpus: 2, memory: 4, price: 0.0335 },
      { type: 'n2-standard-4', vcpus: 4, memory: 16, price: 0.228 },
      { type: 't2d-standard-1', vcpus: 1, memory: 4, price: 0.0422 },
      { type: 't2a-standard-1', vcpus: 1, memory: 4, price: 0.0385 },
      { type: 'n2-highmem-2', vcpus: 2, memory: 16, price: 0.131 },
      { type: 'c2-standard-4', vcpus: 4, memory: 16, price: 0.208 },
    ];

    return instances.map(inst => ({
      provider: 'gcp',
      service: 'Compute Engine',
      region: 'us-central1',
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: inst.type.startsWith('t2a') ? 'ARM' : 'x86 64',
      os: 'Linux',
      cpuVendor: inst.type.startsWith('t2a') ? 'Ampere' : (inst.type.startsWith('t2d') ? 'AMD' : 'Intel'),
      gpuCount: 0,
      geography: 'N. America',
      category: this.getCategory(inst.type, inst.vcpus, inst.memory),
      price: inst.price,
      unit: 'Hour'
    }));
  }
}

export class OracleAdapter extends BaseAdapter {
  providerSlug = 'oracle';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('Fetching Oracle pricing...');
    const instances = [
      { type: 'VM.Standard.E4.Flex', vcpus: 1, memory: 16, price: 0.025, cpuVendor: 'AMD' },
      { type: 'VM.Standard3.Flex', vcpus: 1, memory: 16, price: 0.04, cpuVendor: 'Intel' },
      { type: 'VM.Standard.A1.Flex', vcpus: 1, memory: 6, price: 0.015, cpuVendor: 'Ampere' },
    ];

    return instances.map(inst => ({
      provider: 'oracle',
      service: 'OCI Compute',
      region: 'us-phoenix-1',
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: inst.cpuVendor === 'Ampere' ? 'ARM' : 'x86 64',
      os: 'Linux',
      cpuVendor: inst.cpuVendor,
      gpuCount: 0,
      geography: 'N. America',
      category: this.getCategory(inst.type, inst.vcpus, inst.memory),
      price: inst.price,
      unit: 'Hour'
    }));
  }
}

export class DigitalOceanAdapter extends BaseAdapter {
  providerSlug = 'digitalocean';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('Fetching DigitalOcean pricing...');
    const sizes = [
      { slug: 's-1vcpu-1gb', vcpus: 1, memory: 1, price: 0.00893, category: 'General purpose' },
      { slug: 's-2vcpu-2gb', vcpus: 2, memory: 2, price: 0.02679, category: 'Compute optimized' },
      { slug: 's-2vcpu-4gb', vcpus: 2, memory: 4, price: 0.03571, category: 'General purpose' },
      { slug: 'g-2vcpu-8gb', vcpus: 2, memory: 8, price: 0.08929, category: 'General purpose' },
      { slug: 'm-2vcpu-16gb', vcpus: 2, memory: 16, price: 0.11905, category: 'Memory optimized' },
      { slug: 'c-2vcpu-4gb', vcpus: 2, memory: 4, price: 0.05952, category: 'Compute optimized' },
    ];

    return sizes.map(s => ({
      provider: 'digitalocean',
      service: 'Droplets',
      region: 'nyc1',
      instanceType: s.slug,
      vcpus: s.vcpus,
      memoryGb: s.memory,
      arch: 'x86 64',
      os: 'Linux',
      cpuVendor: 'Intel',
      gpuCount: 0,
      geography: 'N. America',
      category: s.category || this.getCategory(s.slug, s.vcpus, s.memory),
      price: s.price,
      unit: 'Hour'
    }));
  }
}

export class PricingPipeline {
  private pool: Pool;
  private adapters: BaseAdapter[];

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

  async run() {
    const results = [];
    for (const adapter of this.adapters) {
      try {
        const records = await adapter.fetchPricing();
        await this.saveRecords(records);
        results.push({ provider: adapter.providerSlug, status: 'success', count: records.length });
      } catch (error: any) {
        console.error(`Error running ${adapter.providerSlug} pipeline:`, error);
        results.push({ provider: adapter.providerSlug, status: 'error', message: error.message });
      }
    }
    return results;
  }

  private async saveRecords(records: PricingRecord[]) {
    if (records.length === 0) return;

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
        'INSERT INTO services (provider_id, name, category) VALUES ($1, $2, $3) ON CONFLICT (provider_id, name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [providerId, serviceName, 'Compute']
      );
      const serviceId = serviceRes.rows[0].id;

      // 3. Delete old records for this provider BEFORE batch insert
      await client.query('DELETE FROM pricing_records WHERE service_id = $1', [serviceId]);

      // 4. Batch Insert Pricing Records
      const BATCH_SIZE = 100;
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        const values: any[] = [];
        const placeholders = batch.map((r, idx) => {
          const offset = idx * 13;
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
            r.unit
          );
          return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13})`;
        }).join(',');

        await client.query(
          `INSERT INTO pricing_records
           (service_id, region_id, instance_type, vcpus, memory_gb, arch, os, cpu_vendor, gpu_count, geography, category, price_per_unit, unit)
           VALUES ${placeholders}`,
          values
        );
      }

      await client.query('COMMIT');
      console.log(`✅ Saved ${records.length} records for ${providerSlug}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('❌ Batch save failed:', err);
      throw err;
    } finally {
      client.release();
    }
  }
}
