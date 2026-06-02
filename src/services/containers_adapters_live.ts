import { BaseAdapter, PricingRecord } from './pricing_pipeline.js';

export class AWSContainersLiveAdapter extends BaseAdapter {
  providerSlug = 'aws';

  async fetchPricing(): Promise<PricingRecord[]> {
    console.log('⏳ AWS Containers live API fetch not fully implemented. Falling back to empty to trigger static config...');
    // We could implement the actual API fetch from AWS Pricing API here, but for now we'll return [] to trigger the static fallback.
    return [];
  }
}
