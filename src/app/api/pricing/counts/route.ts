import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { buildPricingFilters } from '@/lib/api-utils';
import { getCached, setCached } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const cacheKey = 'counts:' + searchParams.toString();
    const cached = getCached(cacheKey);
    if (cached) return NextResponse.json(cached);

    const { whereClause, values } = buildPricingFilters(query);

    // Aggregate matching records in a subquery, then LEFT JOIN providers to it so
    // EVERY provider is returned — including those with zero matches under the active
    // filters (count 0). Filtering directly in the outer WHERE would silently turn the
    // provider LEFT JOIN into an inner join and drop zero-count providers entirely.
    const dbQuery = `
      SELECT prov.slug, COALESCE(f.count, 0) AS count
      FROM providers prov
      LEFT JOIN (
        SELECT p.id AS provider_id, COUNT(pr.id) AS count
        FROM providers p
        JOIN services s ON s.provider_id = p.id
        JOIN pricing_records pr ON pr.service_id = s.id
        LEFT JOIN regions r ON pr.region_id = r.id
        WHERE 1=1 ${whereClause}
        GROUP BY p.id
      ) f ON f.provider_id = prov.id
      ORDER BY prov.slug
    `;
    const result = await sql.unsafe(dbQuery, values);
    setCached(cacheKey, result);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Counts API error:', err);
    return NextResponse.json({ error: 'Failed to fetch counts', details: err.message }, { status: 500 });
  }
}
