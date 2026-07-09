import { PricingRecord, PricingPipeline } from './pricing_pipeline';
import {
  AWS_INTEGRATION,
  AZURE_INTEGRATION,
  GCP_INTEGRATION,
  ORACLE_INTEGRATION,
  ALIBABA_INTEGRATION,
  DIGITALOCEAN_INTEGRATION,
} from '../config/integration';

import { AWS_SERVERLESS_REGION, AWS_SERVERLESS_GEOGRAPHY } from '../config/aws_serverless';
import { GCP_SERVERLESS_REGION, GCP_SERVERLESS_GEOGRAPHY } from '../config/gcp_serverless';
import { AZURE_SERVERLESS_REGION, AZURE_SERVERLESS_GEOGRAPHY } from '../config/azure_serverless';
import { DIGITALOCEAN_SERVERLESS_REGION, DIGITALOCEAN_SERVERLESS_GEOGRAPHY } from '../config/digitalocean_serverless';
import { ORACLE_SERVERLESS_REGION, ORACLE_SERVERLESS_GEOGRAPHY } from '../config/oracle_serverless';
import { ALIBABA_SERVERLESS_REGION, ALIBABA_SERVERLESS_GEOGRAPHY } from '../config/alibaba_serverless.ts';

const STATIC_PROVIDERS: { slug: string; rows: any[]; region: string; geography: string }[] = [
  { slug: 'aws',          rows: AWS_INTEGRATION,          region: AWS_SERVERLESS_REGION,          geography: AWS_SERVERLESS_GEOGRAPHY },
  { slug: 'azure',        rows: AZURE_INTEGRATION,        region: AZURE_SERVERLESS_REGION,        geography: AZURE_SERVERLESS_GEOGRAPHY },
  { slug: 'gcp',          rows: GCP_INTEGRATION,          region: GCP_SERVERLESS_REGION,          geography: GCP_SERVERLESS_GEOGRAPHY },
  { slug: 'oracle',       rows: ORACLE_INTEGRATION,       region: ORACLE_SERVERLESS_REGION,       geography: ORACLE_SERVERLESS_GEOGRAPHY },
  { slug: 'alibaba',      rows: ALIBABA_INTEGRATION,      region: ALIBABA_SERVERLESS_REGION,      geography: ALIBABA_SERVERLESS_GEOGRAPHY },
  { slug: 'digitalocean', rows: DIGITALOCEAN_INTEGRATION, region: DIGITALOCEAN_SERVERLESS_REGION, geography: DIGITALOCEAN_SERVERLESS_GEOGRAPHY },
];

export class IntegrationPricingPipeline extends PricingPipeline {
  async run() {
    const results: any[] = [];

    for (const p of STATIC_PROVIDERS) {
      console.log(`⏳ Integration: ${p.slug} (${p.rows.length} entries)...`);
      try {
        const records: PricingRecord[] = p.rows.map(inst => ({
          provider: p.slug,
          service: 'Integration',
          region: p.region,
          instanceType: inst.type,
          vcpus: 0,
          memoryGb: 0,
          arch: '',
          os: '',
          cpuVendor: '',
          gpuCount: 0,
          geography: p.geography,
          category: 'integration',
          price: inst.price,
          unit: inst.unit,
          dataSource: 'static_config' as const,
          attributes: inst.attributes || {},
        }));

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
        console.warn(`⚠️  Integration ${p.slug} error:`, error.message);
        results.push({ provider: p.slug, service: 'Integration', status: 'error', message: error.message });
      }
    }
    return results;
  }
}
