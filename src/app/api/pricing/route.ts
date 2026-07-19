import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { buildPricingFilters } from '@/lib/api-utils';
import { getCached, setCached } from '@/lib/cache';
import { normalizeTier } from '@/utils/tier_normalization';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    const isAggregated = query.aggregate === 'true';

    // Serve identical filter requests from the in-process cache. Prices change at
    // most weekly, so a short TTL is safe and spares the DB from repeated identical reads.
    const cacheKey = 'pricing:' + searchParams.toString();
    const cached = getCached(cacheKey);
    if (cached) return NextResponse.json(cached);

    let selectClause = `
      p.name as provider,
      s.name as service,
      COALESCE(r.slug, 'global') as region,
      pr.instance_type,
      pr.vcpus,
      pr.memory_gb,
      pr.arch,
      pr.os,
      pr.cpu_vendor,
      pr.gpu_count,
      pr.geography,
      pr.price_per_unit,
      pr.previous_price_per_unit,
      pr.unit,
      pr.category,
      pr.attributes,
      pr.data_source,
      pr.updated_at
    `;

    if (isAggregated) {
      selectClause = `
        p.name as provider,
        'Various' as service,
        'Various' as region,
        pr.instance_type,
        pr.vcpus,
        pr.memory_gb,
        pr.arch,
        pr.os,
        pr.cpu_vendor,
        pr.gpu_count,
        'Various' as geography,
        MIN(pr.price_per_unit) as min_price,
        AVG(pr.price_per_unit) as avg_price,
        MAX(pr.price_per_unit) as max_price,
        MIN(pr.price_per_unit) as price_per_unit,
        pr.unit,
        pr.category,
        MAX(pr.updated_at) as updated_at,
        MAX(pr.attributes::text)::jsonb as attributes,
        MAX(pr.data_source) as data_source
      `;
    }

    let dbQuery = `
      SELECT ${selectClause}
      FROM pricing_records pr
      JOIN services s ON pr.service_id = s.id
      LEFT JOIN regions r ON pr.region_id = r.id
      JOIN providers p ON s.provider_id = p.id
      WHERE 1=1
    `;

    const { whereClause, values } = buildPricingFilters(query);
    dbQuery += ' ' + whereClause;

    // Support configurable limit (default 5000, max 5000 to prevent abuse)
    const rawLimit = query.limit ? parseInt(query.limit as string, 10) : 5000;
    const limit = Math.min(Math.max(rawLimit, 1), 5000); // Clamp between 1 and 5,000

    if (isAggregated) {
      dbQuery += `
        GROUP BY
          p.name, pr.instance_type, pr.vcpus, pr.memory_gb,
          pr.arch, pr.os, pr.cpu_vendor, pr.gpu_count, pr.category, pr.unit
        ORDER BY avg_price ASC
        LIMIT ${limit}
      `;
    } else {
      dbQuery += ` ORDER BY pr.price_per_unit ASC LIMIT ${limit}`;
    }

    let result = await sql.unsafe(dbQuery, values);

    // Normalize tier in attributes for consistent filtering
    const normalizedResult = result.map((row: any) => ({
      ...row,
      attributes: row.attributes ? {
        ...row.attributes,
        tier: row.attributes.tier ? normalizeTier(row.attributes.tier) : row.attributes.tier
      } : row.attributes
    }));

    setCached(cacheKey, normalizedResult);
    return NextResponse.json(normalizedResult);
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch pricing data', details: err.message }, { status: 500 });
  }
}
