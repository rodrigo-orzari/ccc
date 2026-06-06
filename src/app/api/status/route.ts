import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

const PIPELINE_DISPLAY: Record<string, string> = {
  compute: 'Virtual Machines',
  database: 'Databases',
  serverless: 'Serverless',
  containers: 'Containers',
  networking: 'Networking',
  data_warehouse: 'Data & Analytics',
  ai: 'AI & Machine Learning',
};

export async function GET() {
  try {
    // Per-provider, per-pipeline breakdown with data_source split
    const rows = await sql`
      SELECT
        p.name            AS provider_name,
        p.slug,
        s.category        AS pipeline,
        COUNT(pr.id)::int AS record_count,
        MAX(pr.updated_at) AS last_updated,
        SUM(CASE WHEN pr.data_source = 'static_config' THEN 1 ELSE 0 END)::int AS static_count,
        SUM(CASE WHEN pr.data_source IS DISTINCT FROM 'static_config' THEN 1 ELSE 0 END)::int AS api_count
      FROM providers p
      LEFT JOIN services s ON s.provider_id = p.id
      LEFT JOIN pricing_records pr ON pr.service_id = s.id
      GROUP BY p.name, p.slug, s.category
      ORDER BY p.name, COALESCE(s.category, 'zzz')
    `;

    // Global totals
    const totalsRes = await sql`
      SELECT
        COUNT(*)::int        AS total_records,
        MAX(updated_at)      AS last_ingested,
        SUM(CASE WHEN data_source = 'static_config' THEN 1 ELSE 0 END)::int AS total_static,
        SUM(CASE WHEN data_source IS DISTINCT FROM 'static_config' THEN 1 ELSE 0 END)::int AS total_api
      FROM pricing_records
    `;
    const totals = totalsRes[0];

    // Group rows by provider
    const providerMap: Record<string, any> = {};
    for (const row of rows) {
      const slug = row.slug as string;
      if (!providerMap[slug]) {
        providerMap[slug] = {
          name: row.provider_name,
          slug,
          total_records: 0,
          last_updated: null as string | null,
          pipelines: [] as any[],
        };
      }
      const p = providerMap[slug];

      const count = Number(row.record_count) || 0;
      const staticCount = Number(row.static_count) || 0;
      const apiCount = Number(row.api_count) || 0;
      const lastUpdated = row.last_updated ? (row.last_updated as Date).toISOString() : null;

      p.total_records += count;
      if (lastUpdated && (!p.last_updated || lastUpdated > p.last_updated)) {
        p.last_updated = lastUpdated;
      }

      if (row.pipeline) {
        let sourceLabel: 'api' | 'static' | 'mixed' | 'none' = 'none';
        if (count === 0) sourceLabel = 'none';
        else if (apiCount > 0 && staticCount === 0) sourceLabel = 'api';
        else if (staticCount > 0 && apiCount === 0) sourceLabel = 'static';
        else sourceLabel = 'mixed';

        p.pipelines.push({
          category: row.pipeline,
          display_name: PIPELINE_DISPLAY[row.pipeline as string] ?? row.pipeline,
          record_count: count,
          api_count: apiCount,
          static_count: staticCount,
          last_updated: lastUpdated,
          data_source: sourceLabel,
        });
      }
    }

    return NextResponse.json({
      generated_at: new Date().toISOString(),
      last_ingested: totals.last_ingested ? (totals.last_ingested as Date).toISOString() : null,
      total_records: Number(totals.total_records) || 0,
      total_api_records: Number(totals.total_api) || 0,
      total_static_records: Number(totals.total_static) || 0,
      providers: Object.values(providerMap),
    });
  } catch (err: any) {
    console.error('Status API error:', err);
    return NextResponse.json({ error: 'Failed to fetch status', details: err.message }, { status: 500 });
  }
}
