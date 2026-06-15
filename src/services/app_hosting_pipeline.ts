import { PricingRecord, PricingPipeline } from './pricing_pipeline';

import { 
  AZURE_APP_HOSTING,
  DO_APP_HOSTING,
  AWS_APP_HOSTING,
  GCP_APP_HOSTING,
  ALIBABA_APP_HOSTING,
  ORACLE_APP_HOSTING
} from '../config/app_hosting';

// Reusing geography constants from storage
import { AWS_STORAGE_REGION, AWS_STORAGE_GEOGRAPHY } from '../config/aws_storage';
import { AZURE_STORAGE_REGION, AZURE_STORAGE_GEOGRAPHY } from '../config/azure_storage';
import { GCP_STORAGE_REGION, GCP_STORAGE_GEOGRAPHY } from '../config/gcp_storage';
import { ORACLE_STORAGE_REGION, ORACLE_STORAGE_GEOGRAPHY } from '../config/oracle_storage';
import { DIGITALOCEAN_STORAGE_REGION, DIGITALOCEAN_STORAGE_GEOGRAPHY } from '../config/digitalocean_storage';
import { ALIBABA_STORAGE_REGION, ALIBABA_STORAGE_GEOGRAPHY } from '../config/alibaba_storage';

interface AppHostingConfigEntry {
  type: string;
  price: number;
  unit: string;
  vcpus: number;
  memory_gb: number;
  attributes: Record<string, any>;
}

function mapStaticRows(rows: AppHostingConfigEntry[], slug: string, region: string, geography: string): PricingRecord[] {
  return rows.map(inst => ({
    provider: slug,
    service: 'App Hosting',
    region,
    instanceType: inst.type,
    vcpus: inst.vcpus || 0,
    memoryGb: inst.memory_gb || 0,
    arch: '',
    os: inst.attributes?.os || 'Linux',
    cpuVendor: '',
    gpuCount: 0,
    geography,
    category: 'app-hosting',
    price: inst.price,
    unit: inst.unit,
    dataSource: 'static_config' as const,
    attributes: inst.attributes || {},
  }));
}

const STATIC_PROVIDERS = [
  { slug: 'aws', rows: AWS_APP_HOSTING, region: AWS_STORAGE_REGION, geography: AWS_STORAGE_GEOGRAPHY },
  { slug: 'azure', rows: AZURE_APP_HOSTING, region: AZURE_STORAGE_REGION, geography: AZURE_STORAGE_GEOGRAPHY },
  { slug: 'gcp', rows: GCP_APP_HOSTING, region: GCP_STORAGE_REGION, geography: GCP_STORAGE_GEOGRAPHY },
  { slug: 'oracle', rows: ORACLE_APP_HOSTING, region: ORACLE_STORAGE_REGION, geography: ORACLE_STORAGE_GEOGRAPHY },
  { slug: 'digitalocean', rows: DO_APP_HOSTING, region: DIGITALOCEAN_STORAGE_REGION, geography: DIGITALOCEAN_STORAGE_GEOGRAPHY },
  { slug: 'alibaba', rows: ALIBABA_APP_HOSTING, region: ALIBABA_STORAGE_REGION, geography: ALIBABA_STORAGE_GEOGRAPHY },
];

export class AppHostingPricingPipeline extends PricingPipeline {
  async run() {
    const results: any[] = [];

    for (const p of STATIC_PROVIDERS) {
      console.log(`⏳ App Hosting: ${p.slug} (${p.rows.length} entries from static config)...`);
      try {
        const records = mapStaticRows(p.rows, p.slug, p.region, p.geography);
        const driftAlerts = await this.saveRecords(records, 'app-hosting');
        results.push({
          provider: p.slug,
          service: 'App Hosting',
          status: 'success',
          count: records.length,
          driftAlerts,
          dataSource: 'static_config',
          note: `${p.slug} App Hosting - static config`,
        });
      } catch (error: any) {
        console.warn(`⚠️  App Hosting ${p.slug} static error:`, error.message);
        results.push({ provider: p.slug, service: 'App Hosting', status: 'error', message: error.message });
      }
    }
    return results;
  }
}
