import { PricingRecord, PricingPipeline } from './pricing_pipeline';
import { AwsStorageScraper } from '../scrapers/aws_storage';
import { AzureStorageScraper } from '../scrapers/azure_storage';
import { GcpStorageScraper } from '../scrapers/gcp_storage';

import { ORACLE_STORAGE, ORACLE_STORAGE_REGION, ORACLE_STORAGE_GEOGRAPHY } from '../config/oracle_storage';
import { DIGITALOCEAN_STORAGE, DIGITALOCEAN_STORAGE_REGION, DIGITALOCEAN_STORAGE_GEOGRAPHY } from '../config/digitalocean_storage';
import { ALIBABA_STORAGE, ALIBABA_STORAGE_REGION, ALIBABA_STORAGE_GEOGRAPHY } from '../config/alibaba_storage';

interface StorageConfigEntry {
  type: string;
  price: number;
  unit: string;
  attributes: Record<string, any>;
  category?: string;
}

function mapStaticRows(rows: StorageConfigEntry[], slug: string, region: string, geography: string): PricingRecord[] {
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
    dataSource: 'static_config' as const,
    attributes: inst.attributes || {},
  }));
}

function mapScrapedRows(rows: any[], slug: string, region: string, geography: string): PricingRecord[] {
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
    dataSource: 'live_api' as const,
    attributes: inst.attributes || {},
  }));
}

const STATIC_PROVIDERS = [
  { slug: 'oracle', rows: ORACLE_STORAGE, region: ORACLE_STORAGE_REGION, geography: ORACLE_STORAGE_GEOGRAPHY },
  { slug: 'digitalocean', rows: DIGITALOCEAN_STORAGE, region: DIGITALOCEAN_STORAGE_REGION, geography: DIGITALOCEAN_STORAGE_GEOGRAPHY },
  { slug: 'alibaba', rows: ALIBABA_STORAGE, region: ALIBABA_STORAGE_REGION, geography: ALIBABA_STORAGE_GEOGRAPHY },
];

export class StoragePricingPipeline extends PricingPipeline {
  async run() {
    const results: any[] = [];
    
    // 1. Live Scrapers
    const scrapers = [
      { slug: 'aws', scraper: new AwsStorageScraper(), region: 'us-east-1', geography: 'N. America' },
      { slug: 'azure', scraper: new AzureStorageScraper(), region: 'eastus', geography: 'N. America' },
      { slug: 'gcp', scraper: new GcpStorageScraper(), region: 'us-east1', geography: 'N. America' },
    ];

    for (const p of scrapers) {
      console.log(`⏳ Storage: Scrape ${p.slug}...`);
      try {
        const rows = await p.scraper.run();
        const records = mapScrapedRows(rows, p.slug, p.region, p.geography);
        const driftAlerts = await this.saveRecords(records, 'storage');
        results.push({
          provider: p.slug,
          service: 'Storage',
          status: 'success',
          count: records.length,
          driftAlerts,
          dataSource: 'api',
          note: `${p.slug} Storage - live API`,
        });
      } catch (error: any) {
        console.warn(`⚠️  Storage ${p.slug} API error:`, error.message);
        results.push({ provider: p.slug, service: 'Storage', status: 'error', message: error.message });
      }
    }

    // 2. Static Fallbacks
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
    return results;
  }
}
