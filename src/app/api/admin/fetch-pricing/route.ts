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

export async function POST(req: NextRequest) {
  const authResponse = requireAdminAuth(req);
  if (authResponse) return authResponse;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';
    const results: any[] = [];
    const allDriftAlerts: PriceDriftResult[] = [];

    if (type === 'all' || type === 'compute') {
      const pipeline = new PricingPipeline(sql as any);
      const computeResults = await pipeline.run();
      for (const r of computeResults) {
        if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
        results.push({ ...r, pipeline: 'compute' });
      }
    }

    if (type === 'all' || type === 'database') {
      const dbPipeline = new DatabasePricingPipeline(sql as any);
      const dbResults = await dbPipeline.run();
      for (const r of dbResults) {
        if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
        results.push({ ...r, pipeline: 'database' });
      }
    }

    if (type === 'all' || type === 'serverless') {
      const serverlessPipeline = new ServerlessPricingPipeline(sql as any);
      const serverlessResults = await serverlessPipeline.run();
      for (const r of serverlessResults) {
        if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
        results.push({ ...r, pipeline: 'serverless' });
      }
    }

    if (type === 'all' || type === 'networking') {
      const networkingPipeline = new NetworkingPricingPipeline(sql as any);
      const networkingResults = await networkingPipeline.run();
      for (const r of networkingResults) {
        if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
        results.push({ ...r, pipeline: 'networking' });
      }
    }

    if (type === 'all' || type === 'containers') {
      const containersPipeline = new ContainersPricingPipeline(sql as any);
      const containersResults = await containersPipeline.run();
      for (const r of containersResults) {
        if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
        results.push({ ...r, pipeline: 'containers' });
      }
    }

    if (type === 'all' || type === 'ai') {
      const aiPipeline = new AIPricingPipeline(sql as any);
      const aiResults = await aiPipeline.run();
      for (const r of aiResults) {
        if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
        results.push({ ...r, pipeline: 'ai' });
      }
    }

    if (type === 'all' || type === 'storage') {
      const storagePipeline = new StoragePricingPipeline(sql as any);
      const storageResults = await storagePipeline.run();
      for (const r of storageResults) {
        if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
        results.push({ ...r, pipeline: 'storage' });
      }
    }

    if (type === 'all' || type === 'data-analytics') {
      const dataAnalyticsPipeline = new DataAnalyticsPricingPipeline(sql as any);
      const dataAnalyticsResults = await dataAnalyticsPipeline.run();
      for (const r of dataAnalyticsResults) {
        if ((r as any).driftAlerts) allDriftAlerts.push(...(r as any).driftAlerts);
        results.push({ ...r, pipeline: 'data-analytics' });
      }
    }

    // Refresh schema migrations / column backfills after any fetch
    await initDb();

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
