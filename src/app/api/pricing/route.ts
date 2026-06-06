import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { buildPricingFilters } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    const isAggregated = query.aggregate === 'true';

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

    // Support configurable limit (default 10000, max 50000 to prevent abuse)
    const rawLimit = query.limit ? parseInt(query.limit as string, 10) : 10000;
    const limit = Math.min(Math.max(rawLimit, 1), 50000); // Clamp between 1 and 50,000

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

    console.log('SQL Query:', dbQuery);
    console.log('SQL Params:', values);
    const result = await sql.unsafe(dbQuery, values);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch pricing data', details: err.message }, { status: 500 });
  }
}
