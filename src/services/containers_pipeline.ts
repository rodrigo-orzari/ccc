import { Pool } from 'pg';
import { BaseAdapter, PricingRecord, PricingPipeline } from './pricing_pipeline.js';
import { AWSContainersLiveAdapter } from './containers_adapters_live.js';
import {
  AWS_CONTAINERS,
  AWS_CONTAINERS_REGION,
  AWS_CONTAINERS_GEOGRAPHY,
} from '../config/aws_containers.js';

export class AWSContainersStaticAdapter extends BaseAdapter {
  providerSlug = 'aws';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching AWS Containers pricing (${AWS_CONTAINERS.length} entries from static config)...`);
    return AWS_CONTAINERS.map(inst => ({
      provider: 'aws',
      service: 'Containers',
      region: AWS_CONTAINERS_REGION,
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: inst.cpuVendor === 'AWS' ? 'ARM' : 'x86 64',
      os: 'Linux',
      cpuVendor: inst.cpuVendor,
      gpuCount: 0,
      geography: AWS_CONTAINERS_GEOGRAPHY,
      category: 'containers',
      price: inst.price,
      unit: 'Hourly',
      dataSource: 'static_config' as const,
      attributes: inst.attributes,
    }));
  }
}

export class ContainersPricingPipeline extends PricingPipeline {
  constructor(pool: Pool) {
    super(pool);
    // Use live API adapters with fallback to static configs
    this.adapters = [
      new AWSContainersLiveAdapter(),
    ];
  }

  async run() {
    const results = [];

    // AWS Containers: Try live API first, fall back to static config
    try {
      console.log('🔄 Attempting AWS Containers live API fetch...');
      const awsAdapter = new AWSContainersLiveAdapter();
      let records = await awsAdapter.fetchPricing();

      if (records.length === 0) {
        console.warn('⚠️  AWS Containers live API returned empty, using static config fallback');
        records = await this.getAWSContainersStaticRecords();
      }

      const driftAlerts = await this.saveRecords(records, 'containers');
      results.push({
        provider: 'aws',
        service: 'Containers',
        status: 'success',
        count: records.length,
        driftAlerts,
        dataSource: records[0]?.dataSource || 'static_config'
      });
    } catch (error: any) {
      console.warn(`⚠️  AWS Containers live API failed (${error.message}), falling back to static config...`);
      try {
        const records = await this.getAWSContainersStaticRecords();
        const driftAlerts = await this.saveRecords(records, 'containers');
        results.push({
          provider: 'aws',
          service: 'Containers',
          status: 'success',
          count: records.length,
          driftAlerts,
          dataSource: 'static_config',
          note: 'Using static config fallback due to API failure'
        });
      } catch (fallbackError: any) {
        console.error(`❌ AWS Containers static config also failed:`, fallbackError);
        results.push({
          provider: 'aws',
          service: 'Containers',
          status: 'error',
          message: `Live API failed: ${error.message}, Static fallback failed: ${(fallbackError as Error).message}`
        });
      }
    }

    return results;
  }

  private async getAWSContainersStaticRecords(): Promise<PricingRecord[]> {
    const adapter = new AWSContainersStaticAdapter();
    return adapter.fetchPricing();
  }
}
