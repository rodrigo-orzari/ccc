import { BaseAdapter, PricingRecord } from './pricing_pipeline.js';

export class AWSContainersLiveAdapter extends BaseAdapter {
  providerSlug = 'aws';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('⏳ AWS Containers live API fetch not fully implemented. Falling back to empty to trigger static config...');
    // We could implement the actual API fetch from AWS Pricing API here, but for now we'll return [] to trigger the static fallback.
    return [];
  }
}

export class AzureContainersLiveAdapter extends BaseAdapter {
  providerSlug = 'azure';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('⏳ Azure Containers live API fetch not fully implemented. Falling back to empty to trigger static config...');
    return [];
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
