import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { buildPricingFilters } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    const { whereClause, values } = buildPricingFilters(query);
    
    const dbQuery = `
      SELECT p.slug, COUNT(pr.id) as count
      FROM providers p
      LEFT JOIN services s ON s.provider_id = p.id
      LEFT JOIN pricing_records pr ON pr.service_id = s.id
      WHERE 1=1 ${whereClause}
      GROUP BY p.slug
    `;
    const result = await sql.unsafe(dbQuery, values);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Counts API error:', err);
    return NextResponse.json({ error: 'Failed to fetch counts', details: err.message }, { status: 500 });
  }
}
