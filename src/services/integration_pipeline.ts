import { PricingRecord, PricingPipeline } from './pricing_pipeline';

import { 
  AZURE_INTEGRATION,
  AWS_INTEGRATION,
  GCP_INTEGRATION,
  ALIBABA_INTEGRATION,
  ORACLE_INTEGRATION
} from '../config/integration';

// Reusing geography constants from storage
import { AWS_STORAGE_REGION, AWS_STORAGE_GEOGRAPHY } from '../config/aws_storage';
import { AZURE_STORAGE_REGION, AZURE_STORAGE_GEOGRAPHY } from '../config/azure_storage';
import { GCP_STORAGE_REGION, GCP_STORAGE_GEOGRAPHY } from '../config/gcp_storage';
import { ORACLE_STORAGE_REGION, ORACLE_STORAGE_GEOGRAPHY } from '../config/oracle_storage';
import { ALIBABA_STORAGE_REGION, ALIBABA_STORAGE_GEOGRAPHY } from '../config/alibaba_storage';

interface IntegrationConfigEntry {
  type: string;
  category: string;
  price: number;
  unit: string;
  attributes: Record<string, any>;
}

function mapStaticRows(rows: IntegrationConfigEntry[], slug: string, region: string, geography: string): PricingRecord[] {
  return rows.map(inst => ({
    provider: slug,
    service: 'Integration',
    region,
    instanceType: inst.type,
    vcpus: 0,
    memoryGb: 0,
    arch: '',
    os: '',
    cpuVendor: '',
    gpuCount: 0,
    geography,
    category: 'integration',
    price: inst.price,
    unit: inst.unit,
    dataSource: 'static_config' as const,
    attributes: { ...inst.attributes, category: inst.category },
  }));
}

const STATIC_PROVIDERS = [
  { slug: 'aws', rows: AWS_INTEGRATION, region: AWS_STORAGE_REGION, geography: AWS_STORAGE_GEOGRAPHY },
  { slug: 'azure', rows: AZURE_INTEGRATION, region: AZURE_STORAGE_REGION, geography: AZURE_STORAGE_GEOGRAPHY },
  { slug: 'gcp', rows: GCP_INTEGRATION, region: GCP_STORAGE_REGION, geography: GCP_STORAGE_GEOGRAPHY },
  { slug: 'oracle', rows: ORACLE_INTEGRATION, region: ORACLE_STORAGE_REGION, geography: ORACLE_STORAGE_GEOGRAPHY },
  { slug: 'alibaba', rows: ALIBABA_INTEGRATION, region: ALIBABA_STORAGE_REGION, geography: ALIBABA_STORAGE_GEOGRAPHY },
];

export class IntegrationPricingPipeline extends PricingPipeline {
  async run() {
    const results: any[] = [];

    for (const p of STATIC_PROVIDERS) {
      console.log(`⏳ Integration: ${p.slug} (${p.rows.length} entries from static config)...`);
      try {
        const records = mapStaticRows(p.rows, p.slug, p.region, p.geography);
        const driftAlerts = await this.saveRecords(records, 'integration');
        results.push({
          provider: p.slug,
          service: 'Integration',
          status: 'success',
          count: records.length,
          driftAlerts,
          dataSource: 'static_config',
          note: `${p.slug} Integration - static config`,
        });
      } catch (error: any) {
        console.warn(`⚠️  Integration ${p.slug} static error:`, error.message);
        results.push({ provider: p.slug, service: 'Integration', status: 'error', message: error.message });
      }
    }
    return results;
  }
}
