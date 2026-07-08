import { PricingRecord, PricingPipeline } from './pricing_pipeline';

import { AWS_STORAGE, AWS_STORAGE_REGION, AWS_STORAGE_GEOGRAPHY } from '../config/aws_storage';
import { AZURE_STORAGE, AZURE_STORAGE_REGION, AZURE_STORAGE_GEOGRAPHY } from '../config/azure_storage';
import { GCP_STORAGE, GCP_STORAGE_REGION, GCP_STORAGE_GEOGRAPHY } from '../config/gcp_storage';
import { ORACLE_STORAGE, ORACLE_STORAGE_REGION, ORACLE_STORAGE_GEOGRAPHY } from '../config/oracle_storage';
import { DIGITALOCEAN_STORAGE, DIGITALOCEAN_STORAGE_REGION, DIGITALOCEAN_STORAGE_GEOGRAPHY } from '../config/digitalocean_storage';
import { ALIBABA_STORAGE, ALIBABA_STORAGE_REGION, ALIBABA_STORAGE_GEOGRAPHY } from '../config/alibaba_storage';
import { fetchOracleCatalog, findPrice, nameIncludes } from './oracle_price_list';

interface StorageConfigEntry {
  type: string;
  price: number;
  unit: string;
  attributes: Record<string, any>;
  category?: string;
}

function mapStaticRows(rows: StorageConfigEntry[], slug: string, region: string, geography: string, liveTypes: Set<string> = new Set()): PricingRecord[] {
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
    category: inst.category || inst.attributes?.storage_type || 'Storage',
    price: inst.price,
    unit: inst.unit,
    dataSource: (liveTypes.has(inst.type) ? 'live_api' : 'static_config') as PricingRecord['dataSource'],
    attributes: inst.attributes || {},
  }));
}

// Oracle's OCI price list (oracle_price_list.ts) has clean, unambiguous exact
// matches for exactly two of the seven static storage rows — Block Volume
// Balanced and File Storage. Object Storage/Archive/Infrequent Access appear
// in the feed with a $0 PAY_AS_YOU_GO value (looks like the Always-Free-tier
// line item, not the paid SKU) so findPrice() rejects them and those rows
// keep their static price. This recomputes only the two rows we can trust.
async function getOracleStorageRows(): Promise<{ rows: StorageConfigEntry[]; liveTypes: Set<string> }> {
  const liveTypes = new Set<string>();
  try {
    const catalog = await fetchOracleCatalog();
    const blockRate = findPrice(catalog, item => item.displayName.toLowerCase() === 'storage - block volume - storage');
    const fileRate = findPrice(catalog, item => item.displayName.toLowerCase() === 'file storage - storage');

    const rows = ORACLE_STORAGE.map(row => {
      if (row.type === 'Block Volume Balanced' && blockRate != null) {
        liveTypes.add(row.type);
        return { ...row, price: blockRate };
      }
      if (row.type === 'File Storage' && fileRate != null) {
        liveTypes.add(row.type);
        return { ...row, price: fileRate };
      }
      return row;
    });
    console.log(`✅ Oracle storage: ${liveTypes.size}/${rows.length} rows priced from live OCI rates.`);
    return { rows, liveTypes };
  } catch (err: any) {
    console.warn(`⚠️  OCI live price list fetch failed for storage (${err.message}), using static config.`);
    return { rows: ORACLE_STORAGE, liveTypes };
  }
}

const STATIC_PROVIDERS = [
  { slug: 'aws', rows: AWS_STORAGE, region: AWS_STORAGE_REGION, geography: AWS_STORAGE_GEOGRAPHY },
  { slug: 'azure', rows: AZURE_STORAGE, region: AZURE_STORAGE_REGION, geography: AZURE_STORAGE_GEOGRAPHY },
  { slug: 'gcp', rows: GCP_STORAGE, region: GCP_STORAGE_REGION, geography: GCP_STORAGE_GEOGRAPHY },
  { slug: 'digitalocean', rows: DIGITALOCEAN_STORAGE, region: DIGITALOCEAN_STORAGE_REGION, geography: DIGITALOCEAN_STORAGE_GEOGRAPHY },
  { slug: 'alibaba', rows: ALIBABA_STORAGE, region: ALIBABA_STORAGE_REGION, geography: ALIBABA_STORAGE_GEOGRAPHY },
];

export class StoragePricingPipeline extends PricingPipeline {
  async run() {
    const results: any[] = [];

    for (const p of STATIC_PROVIDERS) {
      console.log(`⏳ Storage: ${p.slug} (${p.rows.length} entries from static config)...`);
      try {
        const records = mapStaticRows(p.rows, p.slug, p.region, p.geography);
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
        console.warn(`⚠️  Storage ${p.slug} static error:`, error.message);
        results.push({ provider: p.slug, service: 'Storage', status: 'error', message: error.message });
      }
    }

    console.log(`⏳ Storage: oracle (${ORACLE_STORAGE.length} entries, live-recompute attempted)...`);
    try {
      const { rows, liveTypes } = await getOracleStorageRows();
      const records = mapStaticRows(rows, 'oracle', ORACLE_STORAGE_REGION, ORACLE_STORAGE_GEOGRAPHY, liveTypes);
      const driftAlerts = await this.saveRecords(records, 'storage');
      results.push({
        provider: 'oracle',
        service: 'Storage',
        status: 'success',
        count: records.length,
        driftAlerts,
        dataSource: liveTypes.size > 0 ? 'mixed' : 'static_config',
        note: `oracle Storage - ${liveTypes.size}/${records.length} live`,
      });
    } catch (error: any) {
      console.warn('⚠️  Storage oracle error:', error.message);
      results.push({ provider: 'oracle', service: 'Storage', status: 'error', message: error.message });
    }

    return results;
  }
}
