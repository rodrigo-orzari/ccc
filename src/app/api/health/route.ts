import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { buildPricingFilters } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    const { whereClause, values } = buildPricingFilters(query);

    const countRes = await sql.unsafe(`SELECT COUNT(*) FROM pricing_records pr JOIN services s ON pr.service_id = s.id LEFT JOIN regions r ON pr.region_id = r.id WHERE 1=1 ${whereClause}`, values);
    const providerRes = await sql.unsafe(`
      SELECT p.slug, COUNT(pr.id) as count
      FROM providers p
      LEFT JOIN services s ON s.provider_id = p.id
      LEFT JOIN pricing_records pr ON pr.service_id = s.id
      LEFT JOIN regions r ON pr.region_id = r.id
      WHERE 1=1 ${whereClause}
      GROUP BY p.slug
    `, values);
    const lastUpdatedRes = await sql.unsafe('SELECT MAX(updated_at) as last_updated FROM pricing_records');
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      total_records: parseInt(countRes[0].count),
      by_provider: providerRes,
      last_updated: lastUpdatedRes[0].last_updated
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
