import type { Sql } from 'postgres';
import { BaseAdapter, PricingRecord, PricingPipeline } from './pricing_pipeline';
import { AI_MODELS } from '../config/ai_models';

export class AIStaticAdapter extends BaseAdapter {
  providerSlug = 'all'; // handled by mapped items
  async fetchPricing(): Promise<PricingRecord[]> {
    console.log(`Fetching AI pricing (${AI_MODELS.length} entries from static config)...`);
    return AI_MODELS.map(model => ({
      provider: model.providerSlug,
      service: model.serviceName,
      region: model.regionSlug || 'global',
      instanceType: model.modelName,
      vcpus: 0,
      memoryGb: 0,
      arch: 'N/A',
      os: 'N/A',
      cpuVendor: 'N/A',
      gpuCount: 0,
      geography: model.geography,
      category: 'ai',
      price: model.inputPricePer1M,
      unit: '1M Tokens',
      dataSource: 'static_config' as const,
      attributes: {
        modelTier: model.modelTier,
        contextWindowK: model.contextWindowK,
        outputPricePer1M: model.outputPricePer1M,
        multimodal: model.multimodal,
        trainingCutoff: model.trainingCutoff,
      },
    }));
  }
}

export class AIPricingPipeline extends PricingPipeline {
  constructor(sql: Sql) {
    super(sql);
    this.adapters = [
      new AIStaticAdapter(),
    ];
  }

  async run() {
    const results = [];
    
    try {
      console.log(`🔄 Attempting AI static config fetch...`);
      const staticAdapter = new AIStaticAdapter();
      const records = await staticAdapter.fetchPricing();
      
      // Group records by provider since AIStaticAdapter returns a mix of providers
      const recordsByProvider: Record<string, typeof records> = {};
      for (const record of records) {
        if (!recordsByProvider[record.provider]) recordsByProvider[record.provider] = [];
        recordsByProvider[record.provider].push(record);
      }

      for (const [providerSlug, providerRecords] of Object.entries(recordsByProvider)) {
        const driftAlerts = await this.saveRecords(providerRecords, 'ai');
        results.push({
          provider: providerSlug,
          service: 'Artificial Intelligence',
          status: 'success',
          count: providerRecords.length,
          driftAlerts,
          dataSource: 'static_config',
        });
      }
    } catch (error: any) {
      console.error(`❌ AI static config failed:`, error);
      results.push({
        provider: 'Multiple',
        service: 'Artificial Intelligence',
        status: 'error',
        message: `Static fallback failed: ${(error as Error).message}`
      });
    }

    return results;
  }
}
