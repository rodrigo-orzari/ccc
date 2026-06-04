import type { Sql } from 'postgres';
import { BaseAdapter, PricingRecord, PricingPipeline } from './pricing_pipeline.js';
import { AWSLambdaLiveAdapter, GCPCloudRunLiveAdapter, AzureFunctionsLiveAdapter } from './serverless_adapters_live.js';
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
import {
  DIGITALOCEAN_SERVERLESS,
  DIGITALOCEAN_SERVERLESS_REGION,
  DIGITALOCEAN_SERVERLESS_GEOGRAPHY,
} from '../config/digitalocean_serverless.js';
import {
  ORACLE_SERVERLESS,
  ORACLE_SERVERLESS_REGION,
  ORACLE_SERVERLESS_GEOGRAPHY,
} from '../config/oracle_serverless.js';

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
      supportedLanguages: inst.supportedLanguages,
      attributes: inst.attributes, // Use attributes from config with all dimensions
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
      supportedLanguages: inst.supportedLanguages,
      attributes: inst.attributes, // Use attributes from config with all dimensions
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
      supportedLanguages: inst.supportedLanguages,
      attributes: inst.attributes, // Use attributes from config with all dimensions
    }));
  }
}

export class DigitalOceanServerlessAdapter extends BaseAdapter {
  providerSlug = 'digitalocean';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching DigitalOcean Serverless pricing (${DIGITALOCEAN_SERVERLESS.length} entries from static config)...`);
    return DIGITALOCEAN_SERVERLESS.map(inst => ({
      provider: 'digitalocean',
      service: 'App Platform Functions',
      region: DIGITALOCEAN_SERVERLESS_REGION,
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: 'x86 64',
      os: 'Linux',
      cpuVendor: inst.cpuVendor,
      gpuCount: 0,
      geography: DIGITALOCEAN_SERVERLESS_GEOGRAPHY,
      category: 'Serverless Compute',
      price: inst.price,
      unit: 'GB-Hour',
      dataSource: 'static_config' as const,
      supportedLanguages: inst.supportedLanguages,
      attributes: inst.attributes, // Use attributes from config with all dimensions
    }));
  }
}

export class OracleServerlessAdapter extends BaseAdapter {
  providerSlug = 'oracle';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Oracle Serverless pricing (${ORACLE_SERVERLESS.length} entries from static config)...`);
    return ORACLE_SERVERLESS.map(inst => ({
      provider: 'oracle',
      service: 'OCI Functions',
      region: ORACLE_SERVERLESS_REGION,
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: 'x86 64',
      os: 'Linux',
      cpuVendor: inst.cpuVendor,
      gpuCount: 0,
      geography: ORACLE_SERVERLESS_GEOGRAPHY,
      category: 'Serverless Compute',
      price: inst.price,
      unit: 'GB-Hour',
      dataSource: 'static_config' as const,
      supportedLanguages: inst.supportedLanguages,
      attributes: inst.attributes, // Use attributes from config with all dimensions
    }));
  }
}

export class ServerlessPricingPipeline extends PricingPipeline {
  constructor(sql: Sql) {
    super(sql);
    // Use live API adapters with fallback to static configs
    // Phase 1: AWS Lambda (live API)
    // Phase 2: GCP Cloud Run (live API - placeholder)
    // Phase 3: Azure Functions (live API - placeholder)
    // DigitalOcean: Static config
    this.adapters = [
      new AWSLambdaLiveAdapter(),
      new GCPCloudRunLiveAdapter(),
      new AzureFunctionsLiveAdapter(),
      new DigitalOceanServerlessAdapter(),
    ];
  }

  async run() {
    const results = [];

    // AWS Lambda: Try live API first, fall back to static config
    try {
      console.log('🔄 Attempting AWS Lambda live API fetch...');
      const awsAdapter = new AWSLambdaLiveAdapter();
      let records = await awsAdapter.fetchPricing();

      if (records.length === 0) {
        console.warn('⚠️  AWS Lambda live API returned empty, using static config fallback');
        records = await this.getAWSServerlessStaticRecords();
      }

      const driftAlerts = await this.saveRecords(records, 'serverless');
      results.push({
        provider: 'aws',
        service: 'Lambda',
        status: 'success',
        count: records.length,
        driftAlerts,
        dataSource: records[0]?.dataSource || 'static_config'
      });
    } catch (error: any) {
      console.warn(`⚠️  AWS Lambda live API failed (${error.message}), falling back to static config...`);
      try {
        const records = await this.getAWSServerlessStaticRecords();
        const driftAlerts = await this.saveRecords(records, 'serverless');
        results.push({
          provider: 'aws',
          service: 'Lambda',
          status: 'success',
          count: records.length,
          driftAlerts,
          dataSource: 'static_config',
          note: 'Using static config fallback due to API failure'
        });
      } catch (fallbackError: any) {
        console.error(`❌ AWS Lambda static config also failed:`, fallbackError);
        results.push({
          provider: 'aws',
          service: 'Lambda',
          status: 'error',
          message: `Live API failed: ${error.message}, Static fallback failed: ${(fallbackError as Error).message}`
        });
      }
    }

    // GCP Cloud Run: To be implemented in Phase 2
    try {
      console.log('⏳ GCP Cloud Run (Phase 2 - not yet implemented)...');
      const records = await this.getGCPServerlessStaticRecords();
      if (records.length > 0) {
        const driftAlerts = await this.saveRecords(records, 'serverless');
        results.push({
          provider: 'gcp',
          service: 'Cloud Run',
          status: 'success',
          count: records.length,
          driftAlerts,
          dataSource: 'static_config',
          note: 'Phase 2 pending - static config only'
        });
      }
    } catch (error: any) {
      console.warn(`⚠️  GCP Cloud Run error:`, error.message);
      results.push({
        provider: 'gcp',
        service: 'Cloud Run',
        status: 'skipped',
        message: 'Phase 2 not yet implemented'
      });
    }

    // Azure Functions: To be implemented in Phase 3
    try {
      console.log('⏳ Azure Functions (Phase 3 - not yet implemented)...');
      const records = await this.getAzureServerlessStaticRecords();
      if (records.length > 0) {
        const driftAlerts = await this.saveRecords(records, 'serverless');
        results.push({
          provider: 'azure',
          service: 'Azure Functions',
          status: 'success',
          count: records.length,
          driftAlerts,
          dataSource: 'static_config',
          note: 'Phase 3 pending - static config only'
        });
      }
    } catch (error: any) {
      console.warn(`⚠️  Azure Functions error:`, error.message);
      results.push({
        provider: 'azure',
        service: 'Azure Functions',
        status: 'skipped',
        message: 'Phase 3 not yet implemented'
      });
    }

    // DigitalOcean App Platform Functions
    try {
      console.log('⏳ DigitalOcean App Platform Functions...');
      const records = await this.getDigitalOceanServerlessStaticRecords();
      if (records.length > 0) {
        const driftAlerts = await this.saveRecords(records, 'serverless');
        results.push({
          provider: 'digitalocean',
          service: 'App Platform Functions',
          status: 'success',
          count: records.length,
          driftAlerts,
          dataSource: 'static_config',
          note: 'DigitalOcean App Platform Functions - static config'
        });
      }
    } catch (error: any) {
      console.warn(`⚠️  DigitalOcean Functions error:`, error.message);
      results.push({
        provider: 'digitalocean',
        service: 'App Platform Functions',
        status: 'skipped',
        message: error.message
      });
    }

    // Oracle OCI Functions
    try {
      console.log('⏳ Oracle OCI Functions...');
      const records = await this.getOracleServerlessStaticRecords();
      if (records.length > 0) {
        const driftAlerts = await this.saveRecords(records, 'serverless');
        results.push({
          provider: 'oracle',
          service: 'OCI Functions',
          status: 'success',
          count: records.length,
          driftAlerts,
          dataSource: 'static_config',
          note: 'Oracle OCI Functions - static config'
        });
      }
    } catch (error: any) {
      console.warn(`⚠️  Oracle OCI Functions error:`, error.message);
      results.push({
        provider: 'oracle',
        service: 'OCI Functions',
        status: 'skipped',
        message: error.message
      });
    }

    return results;
  }

  /**
   * Static config fallback for AWS Lambda (Phase 1 fallback)
   */
  private async getAWSServerlessStaticRecords(): Promise<PricingRecord[]> {
    const adapter = new AWSServerlessAdapter();
    return adapter.fetchPricing();
  }

  /**
   * Static config for GCP Cloud Run (Phase 2 placeholder)
   */
  private async getGCPServerlessStaticRecords(): Promise<PricingRecord[]> {
    const adapter = new GCPServerlessAdapter();
    return adapter.fetchPricing();
  }

  /**
   * Static config for Azure Functions (Phase 3 placeholder)
   */
  private async getAzureServerlessStaticRecords(): Promise<PricingRecord[]> {
    const adapter = new AzureServerlessAdapter();
    return adapter.fetchPricing();
  }

  /**
   * Static config for DigitalOcean App Platform Functions
   */
  private async getDigitalOceanServerlessStaticRecords(): Promise<PricingRecord[]> {
    const adapter = new DigitalOceanServerlessAdapter();
    return adapter.fetchPricing();
  }

  /**
   * Static config for Oracle OCI Functions
   */
  private async getOracleServerlessStaticRecords(): Promise<PricingRecord[]> {
    const adapter = new OracleServerlessAdapter();
    return adapter.fetchPricing();
  }
}
