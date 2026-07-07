import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, initDb } from '@/lib/api-utils';
import sql from '@/lib/db';
import { PricingPipeline, PriceDriftResult } from '@/services/pricing_pipeline';
import { DatabasePricingPipeline } from '@/services/database_pipeline';
import { ServerlessPricingPipeline } from '@/services/serverless_pipeline';
import { ContainersPricingPipeline } from '@/services/containers_pipeline';
import { NetworkingPricingPipeline } from '@/services/networking_pipeline';
import { AIPricingPipeline } from '@/services/ai_pipeline';
import { StoragePricingPipeline } from '@/services/storage_pipeline';
import { DataAnalyticsPricingPipeline } from '@/services/data_analytics_pipeline';
import { sendPriceDriftEmail } from '@/services/mailer';
import { clearCache } from '@/lib/cache';

// Pipeline registry: `type` is both the query-param selector (?type=compute) and
// the label attached to each result row. Add a new product line here in one place
// instead of copy-pasting a run block.
type PipelineCtor = new (sql: any) => { run: () => Promise<any[]> };
const PIPELINE_REGISTRY: { type: string; Pipeline: PipelineCtor }[] = [
  { type: 'compute', Pipeline: PricingPipeline },
  { type: 'database', Pipeline: DatabasePricingPipeline },
  { type: 'serverless', Pipeline: ServerlessPricingPipeline },
  { type: 'networking', Pipeline: NetworkingPricingPipeline },
  { type: 'containers', Pipeline: ContainersPricingPipeline },
  { type: 'ai', Pipeline: AIPricingPipeline },
  { type: 'storage', Pipeline: StoragePricingPipeline },
  { type: 'data-analytics', Pipeline: DataAnalyticsPricingPipeline },
];

export async function POST(req: NextRequest) {
  const authResponse = requireAdminAuth(req);
  if (authResponse) return authResponse;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';
    const results: any[] = [];
    const allDriftAlerts: PriceDriftResult[] = [];

    for (const { type: pipelineType, Pipeline } of PIPELINE_REGISTRY) {
      if (type !== 'all' && type !== pipelineType) continue;

      const pipeline = new Pipeline(sql as any);
      const pipelineResults = await pipeline.run();
      for (const r of pipelineResults) {
        if ((r as any).driftAlerts) allDriftAlerts.push(...(r as any).driftAlerts);
        results.push({ ...r, pipeline: pipelineType });
      }
    }

    // Refresh schema migrations / column backfills after any fetch
    await initDb();

    // Prices just changed — drop cached API responses so users see fresh data now.
    clearCache();

    // Send drift email if any significant price changes were detected
    if (allDriftAlerts.length > 0) {
      sendPriceDriftEmail(allDriftAlerts).catch(err =>
        console.error('❌ Failed to send price drift email:', err)
      );
    }

    return NextResponse.json({ message: 'Pipeline run completed and data migrated', results, driftAlerts: allDriftAlerts });
  } catch (err: any) {
    return NextResponse.json({ error: 'Pipeline failed', details: err.message }, { status: 500 });
  }
}
