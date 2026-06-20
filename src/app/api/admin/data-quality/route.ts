import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/api-utils';
import sql from '@/lib/db';
import { runDataQualityChecks } from '@/services/data_quality';

// GET /api/admin/data-quality
// Returns a report of catalog data-quality issues that would cause workloads to
// silently show false "N/A" values (missing capability coverage, zero specs).
// Requires the X-Admin-Token header.
export async function GET(req: NextRequest) {
  const auth = requireAdminAuth(req);
  if (auth) return auth;

  try {
    const report = await runDataQualityChecks(sql);
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Data quality check failed', details: e?.message ?? String(e) },
      { status: 500 },
    );
  }
}
