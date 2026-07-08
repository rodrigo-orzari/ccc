import axios from 'axios';
import { BaseAdapter, PricingRecord, findOracleFlexRates } from './pricing_pipeline';
import { AwsFargateScraper } from '../scrapers/aws_fargate';
import { AzureContainerInstancesScraper } from '../scrapers/azure_container_instances';
import { AWS_CONTAINERS_REGION, AWS_CONTAINERS_GEOGRAPHY } from '../config/aws_containers';
import { AZURE_CONTAINERS_REGION, AZURE_CONTAINERS_GEOGRAPHY } from '../config/azure_containers';
import { GCP_CONTAINERS, GCP_CONTAINERS_REGION, GCP_CONTAINERS_GEOGRAPHY } from '../config/gcp_containers';
import { DIGITALOCEAN_CONTAINERS, DIGITALOCEAN_CONTAINERS_REGION, DIGITALOCEAN_CONTAINERS_GEOGRAPHY } from '../config/digitalocean_containers';
import { ORACLE_CONTAINERS, ORACLE_CONTAINERS_REGION, ORACLE_CONTAINERS_GEOGRAPHY } from '../config/oracle_containers';
import { fetchGcpCloudRunRates } from './serverless_adapters_live';
import { fetchOracleCatalog } from './oracle_price_list';

function mapContainerRow(
  inst: any,
  slug: string,
  region: string,
  geography: string,
  price: number,
  dataSource: 'live_api' | 'static_config'
): PricingRecord {
  return {
    provider: slug,
    service: 'Containers',
    region,
    instanceType: inst.type,
    vcpus: inst.vcpus,
    memoryGb: inst.memory,
    arch: inst.cpuVendor === 'AWS' ? 'ARM' : 'x86 64',
    os: 'Linux',
    cpuVendor: inst.cpuVendor,
    gpuCount: 0,
    geography,
    category: 'containers',
    price,
    unit: 'Hourly',
    dataSource,
    attributes: inst.attributes,
  };
}

export class AWSContainersLiveAdapter extends BaseAdapter {
  providerSlug = 'aws';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`🔄 Attempting AWS Containers live API fetch (via AwsFargateScraper)...`);
    try {
      const scraper = new AwsFargateScraper();
      const instances = await scraper.run();
      
      return instances.map(inst => ({
        provider: 'aws',
        service: 'Fargate',
        region: AWS_CONTAINERS_REGION,
        instanceType: inst.type,
        vcpus: inst.vcpus,
        memoryGb: inst.memory,
        arch: inst.cpuVendor === 'AWS' ? 'ARM' : 'x86 64',
        os: 'Linux',
        cpuVendor: inst.cpuVendor,
        gpuCount: 0,
        geography: AWS_CONTAINERS_GEOGRAPHY,
        category: 'Containers',
        price: inst.price,
        unit: 'Hour',
        dataSource: 'live_api' as any,
        attributes: inst.attributes,
      }));
    } catch (e) {
      console.warn('⚠️  AWS Containers live fetch failed. Falling back to empty to trigger static config...');
      return [];
    }
  }
}

export class AzureContainersLiveAdapter extends BaseAdapter {
  providerSlug = 'azure';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`🔄 Attempting AZURE Containers live API fetch (via AzureContainerInstancesScraper)...`);
    try {
      const scraper = new AzureContainerInstancesScraper();
      const instances = await scraper.run();
      
      return instances.map(inst => ({
        provider: 'azure',
        service: 'Container Instances',
        region: AZURE_CONTAINERS_REGION,
        instanceType: inst.type,
        vcpus: inst.vcpus,
        memoryGb: inst.memory,
        arch: 'x86 64',
        os: 'Linux',
        cpuVendor: inst.cpuVendor,
        gpuCount: 0,
        geography: AZURE_CONTAINERS_GEOGRAPHY,
        category: 'Containers',
        price: inst.price,
        unit: 'Hour',
        dataSource: 'live_api' as any,
      }));
    } catch (e) {
      console.warn('⚠️  AZURE Containers live fetch failed. Falling back to empty to trigger static config...');
      return [];
    }
  }
}

// Only the Cloud Run rows in GCP_CONTAINERS have a live source (the same
// Billing Catalog CPU/Memory Allocation Time rates used by
// GCPCloudRunLiveAdapter in the serverless category). GKE node prices are
// really just Compute Engine VM prices, already covered live under the
// compute category — recomputing them here too would duplicate that
// integration for no extra accuracy, so those rows stay static. Returns the
// FULL row set every time (live-recomputed Cloud Run rows + static GKE rows)
// so the pipeline's live-vs-static fallback logic (which swaps in the entire
// static config if this returns anything non-empty) doesn't silently drop
// the GKE rows.
export class GCPContainersLiveAdapter extends BaseAdapter {
  providerSlug = 'gcp';

  async fetchPricing(): Promise<PricingRecord[]> {
    const apiKey = process.env.GCP_BILLING_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  GCP_BILLING_API_KEY not set — GCP Containers live pricing unavailable, using static config.');
      return [];
    }

    let cpuRate: number | null = null;
    let memRate: number | null = null;
    try {
      const rates = await fetchGcpCloudRunRates(apiKey);
      cpuRate = rates.cpuRate;
      memRate = rates.memRate;
    } catch (err: any) {
      console.warn(`⚠️  GCP Containers live pricing fetch failed (${err.message}), using static config.`);
      return [];
    }

    let liveCount = 0;
    const records = GCP_CONTAINERS.map(inst => {
      const isCloudRun = inst.type.startsWith('CloudRun-') && inst.type.endsWith('-x86');
      if (isCloudRun && cpuRate != null && memRate != null) {
        liveCount++;
        const price = (cpuRate * inst.vcpus * 3600) + (memRate * inst.memory * 3600);
        return mapContainerRow(inst, 'gcp', GCP_CONTAINERS_REGION, GCP_CONTAINERS_GEOGRAPHY, price, 'live_api');
      }
      return mapContainerRow(inst, 'gcp', GCP_CONTAINERS_REGION, GCP_CONTAINERS_GEOGRAPHY, inst.price, 'static_config');
    });

    console.log(`✅ GCP Containers: ${liveCount}/${records.length} rows (Cloud Run) priced live, rest (GKE) from static config.`);
    return records;
  }
}

// DOKS node prices are just Droplet prices — DOKS nodes ARE droplets under
// the hood — so this reuses DigitalOcean's public /v2/sizes API (same one
// DigitalOceanAdapter uses for compute) rather than a container-specific
// endpoint. App Platform entries have no equivalent live source and stay
// static. Returns the full row set every time, same reasoning as GCP above.
export class DigitalOceanContainersLiveAdapter extends BaseAdapter {
  providerSlug = 'digitalocean';

  // "DOKS-s-2vcpu-4gb" -> "s-2vcpu-4gb" (the underlying Droplet slug)
  private droptletSlugFor(instanceType: string): string | null {
    return instanceType.startsWith('DOKS-') ? instanceType.slice('DOKS-'.length) : null;
  }

  async fetchPricing(): Promise<PricingRecord[]> {
    const token = process.env.DIGITALOCEAN_API_TOKEN;
    if (!token) {
      console.warn('⚠️  DIGITALOCEAN_API_TOKEN not set — DigitalOcean Containers live pricing unavailable, using static config.');
      return [];
    }

    let priceBySlug: Map<string, number>;
    try {
      const response = await axios.get('https://api.digitalocean.com/v2/sizes?per_page=200', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      });
      const sizes: any[] = response.data?.sizes ?? [];
      priceBySlug = new Map(sizes.filter(s => s.price_hourly > 0).map(s => [String(s.slug), Number(s.price_hourly)]));
    } catch (err: any) {
      console.warn(`⚠️  DigitalOcean Containers live pricing fetch failed (${err.message}), using static config.`);
      return [];
    }

    let liveCount = 0;
    const records = DIGITALOCEAN_CONTAINERS.map(inst => {
      const slug = this.droptletSlugFor(inst.type);
      const livePrice = slug ? priceBySlug.get(slug) : undefined;
      if (livePrice != null) {
        liveCount++;
        return mapContainerRow(inst, 'digitalocean', DIGITALOCEAN_CONTAINERS_REGION, DIGITALOCEAN_CONTAINERS_GEOGRAPHY, livePrice, 'live_api');
      }
      return mapContainerRow(inst, 'digitalocean', DIGITALOCEAN_CONTAINERS_REGION, DIGITALOCEAN_CONTAINERS_GEOGRAPHY, inst.price, 'static_config');
    });

    console.log(`✅ DigitalOcean Containers: ${liveCount}/${records.length} rows (DOKS) priced live, rest (App Platform) from static config.`);
    return records;
  }
}

// Container-Instance-E4-* and OKE-VM.Standard.E4.Flex-* are priced from the
// same OCI Standard.E4 (x86/AMD) OCPU+Memory rates as Oracle's compute
// category (see oracle_price_list.ts / findOracleFlexRates in
// pricing_pipeline.ts) — recomputed live here the same way. The A1 (ARM)
// rows keep their static price: the OCI price feed reports a $0
// PAY_AS_YOU_GO value for Standard.A1, which looks like a free-tier
// artifact rather than the real rate (same issue documented on
// OracleAdapter's compute A1 handling) — recomputing from it would silently
// under-price these rows rather than leave them at their known-good static
// value.
export class OracleContainersLiveAdapter extends BaseAdapter {
  providerSlug = 'oracle';

  async fetchPricing(): Promise<PricingRecord[]> {
    let e4Rates: { ocpuRate: number; memRate: number } | null = null;
    try {
      const catalog = await fetchOracleCatalog();
      e4Rates = findOracleFlexRates(catalog, 'e4');
    } catch (err: any) {
      console.warn(`⚠️  OCI live price list fetch failed for containers (${err.message}), using static config.`);
    }

    let liveCount = 0;
    const records = ORACLE_CONTAINERS.map(inst => {
      const isX86E4 = inst.cpuVendor === 'AMD'; // AMD-tagged rows are all Standard.E4-based in this config
      if (isX86E4 && e4Rates) {
        liveCount++;
        const ocpus = inst.vcpus / 2; // x86: 1 OCPU = 2 vCPU
        const price = e4Rates.ocpuRate * ocpus + e4Rates.memRate * inst.memory;
        return mapContainerRow(inst, 'oracle', ORACLE_CONTAINERS_REGION, ORACLE_CONTAINERS_GEOGRAPHY, price, 'live_api');
      }
      return mapContainerRow(inst, 'oracle', ORACLE_CONTAINERS_REGION, ORACLE_CONTAINERS_GEOGRAPHY, inst.price, 'static_config');
    });

    console.log(`✅ Oracle Containers: ${liveCount}/${records.length} rows (E4/x86) priced live, rest (A1/ARM) from static config.`);
    return records;
  }
}
