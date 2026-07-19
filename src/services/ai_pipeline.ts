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
      
      // Group records by provider AND service. saveRecords() labels an entire batch
      // with records[0].service, so a batch must contain only one service — otherwise
      // mixed services (e.g. 'Foundational Models' + 'Embeddings' for the same provider)
      // all collapse under the first record's service name and the others become
      // unreachable via the Service Type filter (which matches on services.name).
      const recordsByGroup: Record<string, typeof records> = {};
      for (const record of records) {
        const key = `${record.provider}||${record.service}`;
        if (!recordsByGroup[key]) recordsByGroup[key] = [];
        recordsByGroup[key].push(record);
      }

      for (const groupRecords of Object.values(recordsByGroup)) {
        const providerSlug = groupRecords[0].provider;
        const serviceName = groupRecords[0].service;
        await this.saveRecords(groupRecords, 'ai');
        results.push({
          provider: providerSlug,
          service: serviceName,
          status: 'success',
          count: groupRecords.length,
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
