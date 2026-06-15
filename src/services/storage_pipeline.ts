import { PricingRecord, PricingPipeline } from './pricing_pipeline';
import { AWS_STORAGE, AWS_STORAGE_REGION, AWS_STORAGE_GEOGRAPHY } from '../config/aws_storage';
import { AZURE_STORAGE, AZURE_STORAGE_REGION, AZURE_STORAGE_GEOGRAPHY } from '../config/azure_storage';
import { GCP_STORAGE, GCP_STORAGE_REGION, GCP_STORAGE_GEOGRAPHY } from '../config/gcp_storage';
import { ORACLE_STORAGE, ORACLE_STORAGE_REGION, ORACLE_STORAGE_GEOGRAPHY } from '../config/oracle_storage';
import { DIGITALOCEAN_STORAGE, DIGITALOCEAN_STORAGE_REGION, DIGITALOCEAN_STORAGE_GEOGRAPHY } from '../config/digitalocean_storage';
import { ALIBABA_STORAGE, ALIBABA_STORAGE_REGION, ALIBABA_STORAGE_GEOGRAPHY } from '../config/alibaba_storage';

interface StorageConfigEntry {
  type: string;
  price: number;
  unit: string;
  attributes: Record<string, any>;
}

// All storage rows for a provider share one service ('Storage') so saveRecords —
// which deletes + reinserts by service_id — cleanly replaces the provider's set.
// The concrete product lives in instance_type; storage_type/tier/redundancy in attributes.
function mapRows(rows: StorageConfigEntry[], slug: string, region: string, geography: string): PricingRecord[] {
  return rows.map(inst => ({
    provider: slug,
    service: 'Storage',
    region,
    instanceType: inst.type,
    vcpus: 0,
    memoryGb: 0,
    arch: '',
    os: '',
    cpuVendor: '',
    gpuCount: 0,
    geography,
    category: inst.attributes?.storage_type || 'Storage',
    price: inst.price,
    unit: inst.unit,
    dataSource: 'static_config' as const,
    attributes: inst.attributes || {},
  }));
}

const STORAGE_PROVIDERS = [
  { slug: 'aws', rows: AWS_STORAGE, region: AWS_STORAGE_REGION, geography: AWS_STORAGE_GEOGRAPHY },
  { slug: 'azure', rows: AZURE_STORAGE, region: AZURE_STORAGE_REGION, geography: AZURE_STORAGE_GEOGRAPHY },
  { slug: 'gcp', rows: GCP_STORAGE, region: GCP_STORAGE_REGION, geography: GCP_STORAGE_GEOGRAPHY },
  { slug: 'oracle', rows: ORACLE_STORAGE, region: ORACLE_STORAGE_REGION, geography: ORACLE_STORAGE_GEOGRAPHY },
  { slug: 'digitalocean', rows: DIGITALOCEAN_STORAGE, region: DIGITALOCEAN_STORAGE_REGION, geography: DIGITALOCEAN_STORAGE_GEOGRAPHY },
  { slug: 'alibaba', rows: ALIBABA_STORAGE, region: ALIBABA_STORAGE_REGION, geography: ALIBABA_STORAGE_GEOGRAPHY },
];

export class StoragePricingPipeline extends PricingPipeline {
  async run() {
    const results: any[] = [];
    for (const p of STORAGE_PROVIDERS) {
      console.log(`⏳ Storage: ${p.slug} (${p.rows.length} entries from static config)...`);
      try {
        const records = mapRows(p.rows, p.slug, p.region, p.geography);
        const driftAlerts = await this.saveRecords(records, 'storage');
        results.push({
          provider: p.slug,
          service: 'Storage',
          status: 'success',
          count: records.length,
          driftAlerts,
          dataSource: 'static_config',
          note: `${p.slug} Storage - static config`,
        });
      } catch (error: any) {
        console.warn(`⚠️  Storage ${p.slug} error:`, error.message);
        results.push({ provider: p.slug, service: 'Storage', status: 'error', message: error.message });
      }
    }
    return results;
  }
}
