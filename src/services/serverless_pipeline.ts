import { Pool } from 'pg';
import { BaseAdapter, PricingRecord, PricingPipeline } from './pricing_pipeline.js';
import {
  AWS_SERVERLESS,
  AWS_SERVERLESS_REGION,
  AWS_SERVERLESS_GEOGRAPHY,
} from '../config/aws_serverless.js';
import {
  GCP_SERVERLESS,
  GCP_SERVERLESS_REGION,
  GCP_SERVERLESS_GEOGRAPHY,
} from '../config/gcp_serverless.js';
import {
  AZURE_SERVERLESS,
  AZURE_SERVERLESS_REGION,
  AZURE_SERVERLESS_GEOGRAPHY,
} from '../config/azure_serverless.js';

export class AWSServerlessAdapter extends BaseAdapter {
  providerSlug = 'aws';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching AWS Serverless pricing (${AWS_SERVERLESS.length} entries from static config)...`);
    return AWS_SERVERLESS.map(inst => ({
      provider: 'aws',
      service: 'Lambda',
      region: AWS_SERVERLESS_REGION,
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: inst.cpuVendor === 'AWS' ? 'ARM' : 'x86 64',
      os: 'Linux',
      cpuVendor: inst.cpuVendor,
      gpuCount: 0,
      geography: AWS_SERVERLESS_GEOGRAPHY,
      category: 'Serverless Compute',
      price: inst.price,
      unit: 'GB-Hour',
      dataSource: 'static_config' as const,
      attributes: {
        deployment_type: 'Serverless',
        tier: 'Serverless',
      },
    }));
  }
}

export class GCPServerlessAdapter extends BaseAdapter {
  providerSlug = 'gcp';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching GCP Serverless pricing (${GCP_SERVERLESS.length} entries from static config)...`);
    return GCP_SERVERLESS.map(inst => ({
      provider: 'gcp',
      service: 'Cloud Run',
      region: GCP_SERVERLESS_REGION,
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: 'x86 64',
      os: 'Linux',
      cpuVendor: inst.cpuVendor,
      gpuCount: 0,
      geography: GCP_SERVERLESS_GEOGRAPHY,
      category: 'Serverless Compute',
      price: inst.price,
      unit: 'GB-Hour',
      dataSource: 'static_config' as const,
      attributes: {
        deployment_type: 'Serverless',
        tier: 'Serverless',
      },
    }));
  }
}

export class AzureServerlessAdapter extends BaseAdapter {
  providerSlug = 'azure';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Azure Serverless pricing (${AZURE_SERVERLESS.length} entries from static config)...`);
    return AZURE_SERVERLESS.map(inst => ({
      provider: 'azure',
      service: 'Azure Functions',
      region: AZURE_SERVERLESS_REGION,
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: 'x86 64',
      os: 'Linux',
      cpuVendor: inst.cpuVendor,
      gpuCount: 0,
      geography: AZURE_SERVERLESS_GEOGRAPHY,
      category: 'Serverless Compute',
      price: inst.price,
      unit: 'GB-Hour',
      dataSource: 'static_config' as const,
      attributes: {
        deployment_type: 'Serverless',
        tier: 'Serverless',
      },
    }));
  }
}

export class ServerlessPricingPipeline extends PricingPipeline {
  constructor(pool: Pool) {
    super(pool);
    // Replace the compute adapters with serverless adapters
    this.adapters = [
      new AWSServerlessAdapter(),
      new GCPServerlessAdapter(),
      new AzureServerlessAdapter(),
    ];
  }

  async run() {
    const results = [];
    for (const adapter of this.adapters) {
      try {
        const records = await adapter.fetchPricing();
        const driftAlerts = await this.saveRecords(records, 'serverless');
        results.push({ provider: adapter.providerSlug, status: 'success', count: records.length, driftAlerts });
      } catch (error: any) {
        console.error(`Error running Serverless pipeline for ${adapter.providerSlug}:`, error);
        results.push({ provider: adapter.providerSlug, status: 'error', message: error.message });
      }
    }
    return results;
  }
}
