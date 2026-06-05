import { BaseAdapter, PricingRecord } from './pricing_pipeline.js';
import { AwsFargateScraper } from '../scrapers/aws_fargate.js';
import { AzureContainerInstancesScraper } from '../scrapers/azure_container_instances.js';
import { AWS_CONTAINERS_REGION, AWS_CONTAINERS_GEOGRAPHY } from '../config/aws_containers.js';
import { AZURE_CONTAINERS_REGION, AZURE_CONTAINERS_GEOGRAPHY } from '../config/azure_containers.js';

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

export class GCPContainersLiveAdapter extends BaseAdapter {
  providerSlug = 'gcp';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('⏳ GCP Containers live API fetch not fully implemented. Falling back to empty to trigger static config...');
    return [];
  }
}

export class DigitalOceanContainersLiveAdapter extends BaseAdapter {
  providerSlug = 'digitalocean';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('⏳ DigitalOcean Containers live API fetch not fully implemented. Falling back to empty to trigger static config...');
    return [];
  }
}

export class OracleContainersLiveAdapter extends BaseAdapter {
  providerSlug = 'oracle';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('⏳ Oracle Containers live API fetch not fully implemented. Falling back to empty to trigger static config...');
    return [];
  }
}
