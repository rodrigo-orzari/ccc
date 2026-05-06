import axios from 'axios';
import { Pool } from 'pg';
import { BaseAdapter, PricingRecord, PricingPipeline } from './pricing_pipeline.js';
import {
  GCP_CLOUD_SQL_INSTANCES,
  GCP_CLOUD_SQL_REGION,
  GCP_CLOUD_SQL_GEOGRAPHY,
  ORACLE_AUTONOMOUS_INSTANCES,
  ORACLE_AUTONOMOUS_REGION,
  ORACLE_AUTONOMOUS_GEOGRAPHY,
  ORACLE_MYSQL_HEATWAVE_INSTANCES,
  ORACLE_MYSQL_HEATWAVE_REGION,
  ORACLE_MYSQL_HEATWAVE_GEOGRAPHY,
  ORACLE_POSTGRESQL_INSTANCES,
  ORACLE_POSTGRESQL_REGION,
  ORACLE_POSTGRESQL_GEOGRAPHY,
  DIGITALOCEAN_DB_INSTANCES,
  DIGITALOCEAN_DB_REGION,
  DIGITALOCEAN_DB_GEOGRAPHY,
} from '../config/database_instances.js';

// ─── GCP Cloud SQL (static config) ────────────────────────────────────────────

export class GCPCloudSQLAdapter extends BaseAdapter {
  providerSlug = 'gcp';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching GCP Cloud SQL pricing (${GCP_CLOUD_SQL_INSTANCES.length} entries from static config)...`);
    return GCP_CLOUD_SQL_INSTANCES.map(inst => ({
      provider: 'gcp',
      service: 'Cloud SQL',
      region: GCP_CLOUD_SQL_REGION,
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: 'x86 64',
      os: '',
      cpuVendor: 'Intel',
      gpuCount: 0,
      geography: GCP_CLOUD_SQL_GEOGRAPHY,
      category: 'Relational',
      price: inst.price,
      unit: 'Hour',
      dataSource: 'static_config' as const,
      attributes: {
        engine: inst.engine,
        engine_version: inst.engine === 'PostgreSQL' ? '15' : inst.engine === 'MySQL' ? '8.0' : '2022',
        deployment_type: 'Provisioned',
        ha_mode: 'Single AZ',
        storage_type: 'SSD',
      },
    }));
  }
}

// ─── Oracle Autonomous Database (static config) ────────────────────────────────

export class OracleAutonomousAdapter extends BaseAdapter {
  providerSlug = 'oracle';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Oracle Autonomous DB pricing (${ORACLE_AUTONOMOUS_INSTANCES.length} entries from static config)...`);
    return ORACLE_AUTONOMOUS_INSTANCES.map(inst => ({
      provider: 'oracle',
      service: 'Autonomous Database',
      region: ORACLE_AUTONOMOUS_REGION,
      instanceType: inst.type,
      vcpus: 0,
      memoryGb: 0,
      arch: 'x86 64',
      os: '',
      cpuVendor: 'Intel',
      gpuCount: 0,
      geography: ORACLE_AUTONOMOUS_GEOGRAPHY,
      category: 'Relational',
      price: inst.price,
      unit: 'ECPU-Hour',
      dataSource: 'static_config' as const,
      attributes: {
        engine: 'Oracle DB',
        engine_version: '19c',
        deployment_type: 'Serverless',
        ha_mode: 'Multi AZ',
        storage_type: 'SSD',
        workload: inst.workload,
      },
    }));
  }
}

// ─── Oracle MySQL HeatWave (static config) ────────────────────────────────────

export class OracleMySQLHeatWaveAdapter extends BaseAdapter {
  providerSlug = 'oracle';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Oracle MySQL HeatWave pricing (${ORACLE_MYSQL_HEATWAVE_INSTANCES.length} entries from static config)...`);
    return ORACLE_MYSQL_HEATWAVE_INSTANCES.map(inst => ({
      provider: 'oracle',
      service: 'MySQL HeatWave',
      region: ORACLE_MYSQL_HEATWAVE_REGION,
      instanceType: inst.type,
      vcpus: inst.ecpus,
      memoryGb: inst.memory,
      arch: 'x86 64',
      os: '',
      cpuVendor: 'Intel',
      gpuCount: 0,
      geography: ORACLE_MYSQL_HEATWAVE_GEOGRAPHY,
      category: 'Relational',
      price: inst.price,
      unit: 'ECPU-Hour',
      dataSource: 'static_config' as const,
      attributes: {
        engine: 'MySQL',
        engine_version: '9.x',
        deployment_type: 'Provisioned',
        ha_mode: 'Single AZ',
        storage_type: 'SSD',
      },
    }));
  }
}

// ─── Oracle PostgreSQL (static config) ───────────────────────────────────────

export class OraclePostgreSQLAdapter extends BaseAdapter {
  providerSlug = 'oracle';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Oracle PostgreSQL pricing (${ORACLE_POSTGRESQL_INSTANCES.length} entries from static config)...`);
    return ORACLE_POSTGRESQL_INSTANCES.map(inst => ({
      provider: 'oracle',
      service: 'OCI Database with PostgreSQL',
      region: ORACLE_POSTGRESQL_REGION,
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: 'x86 64',
      os: '',
      cpuVendor: 'AMD',
      gpuCount: 0,
      geography: ORACLE_POSTGRESQL_GEOGRAPHY,
      category: 'Relational',
      price: inst.price,
      unit: 'Hour',
      dataSource: 'static_config' as const,
      attributes: {
        engine: 'PostgreSQL',
        engine_version: '16',
        deployment_type: 'Provisioned',
        ha_mode: 'Single AZ',
        storage_type: 'SSD',
      },
    }));
  }
}

// ─── AWS RDS (live API) ────────────────────────────────────────────────────────

const RDS_ENGINE_MAP: Record<string, string> = {
  'MySQL':                  'MySQL',
  'PostgreSQL':             'PostgreSQL',
  'MariaDB':                'MariaDB',
  'Aurora MySQL':           'MySQL',
  'Aurora PostgreSQL':      'PostgreSQL',
  'SQL Server':             'SQL Server',
  'SQL Server SE':          'SQL Server',
  'SQL Server EE':          'SQL Server',
  'SQL Server Web':         'SQL Server',
  'SQL Server Ex':          'SQL Server',
  'Oracle':                 'Oracle DB',
  'Oracle SE2':             'Oracle DB',
  'Oracle EE':              'Oracle DB',
  'Db2':                    'Db2',
  'IBM Db2':                'Db2',
};

export class AWSRDSAdapter extends BaseAdapter {
  providerSlug = 'aws';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('Fetching AWS RDS pricing (us-east-1)...');
    const url = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonRDS/current/us-east-1/index.json';
    const response = await axios.get(url, { timeout: 60000 });
    const products = response.data.products;
    const terms = response.data.terms?.OnDemand ?? {};

    const records: PricingRecord[] = [];
    const skuKeys = Object.keys(products);

    for (const sku of skuKeys) {
      const product = products[sku];
      if (product.productFamily !== 'Database Instance') continue;

      const attr = product.attributes;
      // Skip Windows SQL Server / Oracle licensing noise — keep Linux baseline
      if (attr.operatingSystem && attr.operatingSystem !== 'Linux') continue;

      const term = terms[sku];
      if (!term) continue;

      const offerKey = Object.keys(term)[0];
      const priceDimKey = Object.keys(term[offerKey].priceDimensions)[0];
      const priceDim = term[offerKey].priceDimensions[priceDimKey];
      const price = parseFloat(priceDim.pricePerUnit?.USD ?? '0');
      if (isNaN(price) || price <= 0) continue;

      const instanceType = attr.instanceType ?? '';
      if (!instanceType.startsWith('db.')) continue;

      const vcpus = parseInt(attr.vcpu) || 0;
      const memoryGb = attr.memory ? parseFloat(attr.memory.replace(/[^0-9.]/g, '')) : 0;
      const deploymentOption = attr.deploymentOption ?? 'Single-AZ';
      const haMode = deploymentOption.includes('Multi') ? 'Multi AZ' : 'Single AZ';
      const rawEngine = attr.databaseEngine ?? '';
      const engine = RDS_ENGINE_MAP[rawEngine] ?? rawEngine;

      records.push({
        provider: 'aws',
        service: 'RDS',
        region: attr.regionCode || 'us-east-1',
        instanceType,
        vcpus,
        memoryGb,
        arch: 'x86 64',
        os: '',
        cpuVendor: this.getCpuVendor(instanceType),
        gpuCount: 0,
        geography: this.getGeography(attr.regionCode || 'us-east-1'),
        category: 'Relational',
        price,
        unit: priceDim.unit ?? 'Hrs',
        dataSource: 'live_api' as const,
        attributes: {
          engine,
          engine_version: attr.engineVersion ?? '',
          deployment_type: 'Provisioned',
          ha_mode: haMode,
          storage_type: 'SSD',
        },
      });
    }

    console.log(`✅ Fetched ${records.length} AWS RDS records`);
    return records;
  }
}

// ─── Azure Databases (live API) ────────────────────────────────────────────────

// Azure service names → our engine label
const AZURE_DB_SERVICES: { serviceName: string; engine: string }[] = [
  { serviceName: 'SQL Database',                         engine: 'SQL Server'  },
  { serviceName: 'SQL Managed Instance',                 engine: 'SQL Server'  },
  { serviceName: 'Azure Database for PostgreSQL',        engine: 'PostgreSQL'  },
  { serviceName: 'Azure Database for MySQL',             engine: 'MySQL'       },
  { serviceName: 'Azure Database for MariaDB',           engine: 'MariaDB'     },
  { serviceName: 'Azure Cosmos DB',                      engine: 'Cosmos DB'   },
  { serviceName: 'Redis Cache',                          engine: 'Redis'       },
];

function buildAzureDbFilter(): string {
  const clauses = AZURE_DB_SERVICES.map(s => `serviceName eq '${s.serviceName}'`);
  return clauses.join(' or ');
}

export class AzureDBAdapter extends BaseAdapter {
  providerSlug = 'azure';

  // Fetch Azure DB pricing scoped to a single representative region so we
  // don't inflate the count by duplicating every SKU across all ~60 Azure
  // regions. eastus is the canonical reference region for Azure pricing.
  private static readonly REGION = 'eastus';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching Azure database pricing (${AzureDBAdapter.REGION} only)...`);
    const filter = encodeURIComponent(
      `(${buildAzureDbFilter()}) and priceType eq 'Consumption' and armRegionName eq '${AzureDBAdapter.REGION}'`
    );
    let url: string | null = `https://prices.azure.com/api/retail/prices?$filter=${filter}`;
    const allItems: any[] = [];

    let pages = 0;
    while (url && pages < 20) {
      const response = await axios.get(url, { timeout: 30000 });
      allItems.push(...(response.data.Items ?? []));
      url = response.data.NextPageLink ?? null;
      pages++;
    }

    const records: PricingRecord[] = [];
    // Deduplicate by SKU within the single-region response (some services
    // return multiple meter rows for the same SKU, e.g. different billing
    // granularities). We keep the first (cheapest) occurrence.
    const seen = new Set<string>();

    for (const item of allItems) {
      if (!item.retailPrice || item.retailPrice <= 0) continue;

      // armSkuName is the machine-readable identifier; items without one are
      // storage / I/O / backup meters, not compute instances — skip them.
      const sku: string = (item.armSkuName ?? '').trim();
      if (!sku) continue;

      const serviceName: string = item.serviceName ?? '';
      const serviceEntry = AZURE_DB_SERVICES.find(s => s.serviceName === serviceName);
      if (!serviceEntry) continue;

      const engine = serviceEntry.engine;
      const skuLower = sku.toLowerCase();

      // Skip storage, I/O, backup and other non-compute meters by checking
      // the human-readable product/SKU name for disqualifying terms.
      const productName: string = (item.productName ?? '').toLowerCase();
      const skuNameHuman: string = (item.skuName ?? '').toLowerCase();
      const nonComputeKeywords = ['storage', 'backup', 'i/o', 'log', 'snapshot', 'replica', 'lrs', 'grs', 'zrs'];
      if (nonComputeKeywords.some(kw => productName.includes(kw) || skuNameHuman.includes(kw))) continue;

      // Cosmos DB: only include vCore-provisioned throughput — skip RU/s meters
      if (engine === 'Cosmos DB' && !skuLower.includes('vcores') && !skuLower.includes('autoscale') && !skuLower.includes('standard')) continue;

      // Redis: only include actual cache-size SKUs, skip bandwidth/operations meters
      if (engine === 'Redis' && !skuLower.includes('cache')) continue;

      // Deduplicate
      const key = `${serviceName}::${sku}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // Derive HA mode from SKU/tier description
      let haMode = 'Single AZ';
      if (skuLower.includes('zone redundant') || skuLower.includes('geo-redundant')) {
        haMode = 'Zone Redundant';
      } else if (skuLower.includes('business critical') || skuLower.includes('premium')) {
        haMode = 'Multi AZ';
      }

      // Parse vCPU count from SKU (e.g. "GP_Gen5_4" → 4, "BC_Gen5_8" → 8)
      const vcpuMatch = sku.match(/_(\d+)$/);
      const vcpus = vcpuMatch ? parseInt(vcpuMatch[1]) : 0;

      let price = item.retailPrice;
      let unit = item.unitOfMeasure ?? '1 Hour';
      if (unit.includes('Year')) {
        const years = unit.includes('3') ? 3 : 1;
        price = price / (years * 365 * 24);
        unit = '1 Hour (Reserved)';
      }

      records.push({
        provider: 'azure',
        service: 'Azure Databases',
        region: AzureDBAdapter.REGION,
        instanceType: sku,
        vcpus,
        memoryGb: 0,
        arch: 'x86 64',
        os: '',
        cpuVendor: 'Intel',
        gpuCount: 0,
        geography: 'N. America',
        category: (engine === 'Cosmos DB' || engine === 'Redis') ? 'NoSQL' : 'Relational',
        price,
        unit,
        dataSource: 'live_api' as const,
        attributes: {
          engine,
          engine_version: '',
          deployment_type: 'Provisioned',
          ha_mode: haMode,
          storage_type: 'SSD',
        },
      });
    }

    console.log(`✅ Fetched ${records.length} Azure database records`);
    return records;
  }
}

// ─── DigitalOcean Managed Databases (static config) ───────────────────────────

export class DigitalOceanDBAdapter extends BaseAdapter {
  providerSlug = 'digitalocean';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching DigitalOcean DB pricing (${DIGITALOCEAN_DB_INSTANCES.length} entries from static config)...`);
    const NOSQL_ENGINES = new Set(['MongoDB', 'Valkey']);
    return DIGITALOCEAN_DB_INSTANCES.map(inst => ({
      provider: 'digitalocean',
      service: 'Managed Databases',
      region: DIGITALOCEAN_DB_REGION,
      instanceType: inst.type,
      vcpus: inst.vcpus,
      memoryGb: inst.memory,
      arch: 'x86 64',
      os: '',
      cpuVendor: 'Intel',
      gpuCount: 0,
      geography: DIGITALOCEAN_DB_GEOGRAPHY,
      category: NOSQL_ENGINES.has(inst.engine) ? 'NoSQL' : 'Relational',
      price: inst.price,
      unit: 'Hour',
      dataSource: 'static_config' as const,
      attributes: {
        engine: inst.engine,
        engine_version: '',
        deployment_type: 'Provisioned',
        ha_mode: 'Single AZ',
        storage_type: 'SSD',
      },
    }));
  }
}

// ─── DatabasePricingPipeline ───────────────────────────────────────────────────

export class DatabasePricingPipeline extends PricingPipeline {
  constructor(pool: Pool) {
    super(pool);
    // Replace the compute adapters with database adapters
    this.adapters = [
      new GCPCloudSQLAdapter(),
      new OracleAutonomousAdapter(),
      new OracleMySQLHeatWaveAdapter(),
      new OraclePostgreSQLAdapter(),
      new AWSRDSAdapter(),
      new AzureDBAdapter(),
      new DigitalOceanDBAdapter(),
    ];
  }

  async run() {
    const results = [];
    for (const adapter of this.adapters) {
      try {
        const records = await adapter.fetchPricing();
        const driftAlerts = await this.saveRecords(records, 'database');
        results.push({ provider: adapter.providerSlug, status: 'success', count: records.length, driftAlerts });
      } catch (error: any) {
        console.error(`Error running DB pipeline for ${adapter.providerSlug}:`, error);
        results.push({ provider: adapter.providerSlug, status: 'error', message: error.message });
      }
    }
    return results;
  }
}
