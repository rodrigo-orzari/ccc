import axios from 'axios';
import { Pool } from 'pg';
import { BaseAdapter, PricingRecord, PricingPipeline } from './pricing_pipeline.js';
import { DATABRICKS_INSTANCES, DATABRICKS_AWS_REGION, DATABRICKS_GCP_REGION } from '../config/databricks_instances.js';
import { SNOWFLAKE_INSTANCES, SNOWFLAKE_AWS_REGION, SNOWFLAKE_AZURE_REGION, SNOWFLAKE_GCP_REGION } from '../config/snowflake_instances.js';

// ─── Databricks Static Adapters ────────────────────────────────────────────────

export class DatabricksStaticAdapter extends BaseAdapter {
  providerSlug: string;
  private instances: typeof DATABRICKS_INSTANCES;
  private region: string;

  constructor(provider: 'aws' | 'gcp') {
    super();
    this.providerSlug = provider;
    this.instances = DATABRICKS_INSTANCES.filter(i => i.provider === provider);
    this.region = provider === 'aws' ? DATABRICKS_AWS_REGION : DATABRICKS_GCP_REGION;
  }

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Databricks pricing for ${this.providerSlug.toUpperCase()} (static config)...`);
    return this.instances.map(inst => ({
      provider: this.providerSlug,
      service: 'Databricks',
      region: this.region,
      instanceType: `${inst.tier} ${inst.computeType}`,
      vcpus: 1, // Represents 1 DBU
      memoryGb: 0,
      arch: 'x86 64',
      os: 'Linux',
      cpuVendor: 'N/A',
      gpuCount: 0,
      geography: 'N. America',
      category: 'data_warehouse',
      price: inst.pricePerDbu,
      unit: 'DBU',
      attributes: {
        engine: 'Databricks',
        tier: inst.tier,
        deployment_type: inst.deploymentType,
      },
      dataSource: 'static_config' as const,
    }));
  }
}

// ─── Snowflake Static Adapters ─────────────────────────────────────────────────

export class SnowflakeStaticAdapter extends BaseAdapter {
  providerSlug: string;
  private instances: typeof SNOWFLAKE_INSTANCES;
  private region: string;

  constructor(provider: 'aws' | 'azure' | 'gcp') {
    super();
    this.providerSlug = provider;
    this.instances = SNOWFLAKE_INSTANCES.filter(i => i.provider === provider);
    if (provider === 'aws') this.region = SNOWFLAKE_AWS_REGION;
    else if (provider === 'azure') this.region = SNOWFLAKE_AZURE_REGION;
    else this.region = SNOWFLAKE_GCP_REGION;
  }

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Snowflake pricing for ${this.providerSlug.toUpperCase()} (static config)...`);
    return this.instances.map(inst => ({
      provider: this.providerSlug,
      service: 'Snowflake',
      region: this.region,
      instanceType: `Snowflake ${inst.tier}`,
      vcpus: 1, // Represents 1 Credit
      memoryGb: 0,
      arch: 'x86 64',
      os: 'Linux',
      cpuVendor: 'N/A',
      gpuCount: 0,
      geography: 'N. America',
      category: 'data_warehouse',
      price: inst.pricePerCredit,
      unit: 'Credit',
      attributes: {
        engine: 'Snowflake',
        tier: inst.tier,
        deployment_type: inst.deploymentType,
      },
      dataSource: 'static_config' as const,
    }));
  }
}

// ─── Databricks Azure Adapter (Live API) ───────────────────────────────────────

export class DatabricksAzureAdapter extends BaseAdapter {
  providerSlug = 'azure';
  private static readonly REGION = 'eastus';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Azure Databricks pricing (${DatabricksAzureAdapter.REGION} only)...`);
    const filter = encodeURIComponent(
      `serviceName eq 'Azure Databricks' and priceType eq 'Consumption' and armRegionName eq '${DatabricksAzureAdapter.REGION}'`
    );
    let url: string | null = `https://prices.azure.com/api/retail/prices?$filter=${filter}`;
    const allItems: any[] = [];

    let pages = 0;
    while (url && pages < 10) {
      const response = await axios.get(url, { timeout: 30000 });
      allItems.push(...(response.data.Items ?? []));
      url = response.data.NextPageLink ?? null;
      pages++;
    }

    const records: PricingRecord[] = [];
    const seen = new Set<string>();

    for (const item of allItems) {
      if (!item.retailPrice || item.retailPrice <= 0) continue;
      
      // SKU Name often looks like "Standard Jobs Light Compute" or "Premium All-purpose Compute"
      const skuName: string = (item.skuName ?? '').trim();
      if (!skuName) continue;

      // Extract Tier
      let tier = 'Standard';
      if (skuName.toLowerCase().includes('premium')) tier = 'Premium';
      else if (skuName.toLowerCase().includes('enterprise')) tier = 'Enterprise';

      // Extract Deployment Type
      const deploymentType = skuName.toLowerCase().includes('serverless') ? 'Serverless' : 'Provisioned';

      const dedupeKey = skuName;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      records.push({
        provider: 'azure',
        service: 'Azure Databricks',
        region: DatabricksAzureAdapter.REGION,
        instanceType: skuName,
        vcpus: 1, // Represents 1 DBU
        memoryGb: 0,
        arch: 'x86 64',
        os: 'Linux',
        cpuVendor: 'N/A',
        gpuCount: 0,
        geography: 'N. America',
        category: 'data_warehouse',
        price: item.retailPrice,
        unit: 'DBU',
        attributes: {
          engine: 'Databricks',
          tier,
          deployment_type: deploymentType,
        },
        dataSource: 'live_api' as const,
      });
    }

    console.log(`✅ Fetched ${records.length} Azure Databricks records`);
    return records;
  }
}

// ─── Data Analytics Pricing Pipeline ───────────────────────────────────────────

export class DataAnalyticsPricingPipeline extends PricingPipeline {
  constructor(pool: Pool) {
    super(pool);
    // Overwrite the base adapters with our data analytics adapters
    this.adapters = [
      new DatabricksStaticAdapter('aws'),
      new DatabricksStaticAdapter('gcp'),
      new SnowflakeStaticAdapter('aws'),
      new SnowflakeStaticAdapter('azure'),
      new SnowflakeStaticAdapter('gcp'),
      new DatabricksAzureAdapter()
    ];
  }

  async run(): Promise<{ provider: string; status: string; count?: number; message?: string }[]> {
    const results = [];
    console.log('🚀 Starting Data Analytics Pricing Pipeline...');
    
    // We will accumulate all records and then save them using the base class `saveRecords` method,
    // but we will do it PER provider to maintain the existing drift logic per provider/service.
    // However, `DataAnalyticsPricingPipeline` inherits `run()` from `PricingPipeline`, which loops through adapters.
    // BUT we have multiple adapters for the same provider (e.g. `aws` for Databricks and Snowflake).
    // `PricingPipeline.run()` executes `saveRecords(records)` which deletes all records for `serviceName` under the provider.
    // Since each adapter outputs a unique `service` name (e.g. 'Databricks' vs 'Snowflake'), 
    // the base `saveRecords` will properly isolate deletions to the specific service!
    
    for (const adapter of this.adapters) {
      try {
        const records = await adapter.fetchPricing();
        const driftAlerts = await this.saveRecords(records, 'data_warehouse');
        results.push({ provider: adapter.providerSlug, status: 'success', count: records.length, driftAlerts });
      } catch (error: any) {
        console.error(`❌ Error running ${adapter.providerSlug} adapter:`, error);
        results.push({ provider: adapter.providerSlug, status: 'error', message: error.message });
      }
    }
    
    console.log('✅ Data Analytics Pricing Pipeline Completed.');
    return results;
  }
}
