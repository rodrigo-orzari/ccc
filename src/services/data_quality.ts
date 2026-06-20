import { WORKLOADS } from '@/config/workloads';

// Active providers we expect coverage for (mirrors the workloads matcher).
const PROVIDERS = ['aws', 'azure', 'gcp', 'oracle', 'digitalocean', 'alibaba'];

// Maps a workload component's productType to the services.category used in the DB
// (must stay in sync with src/app/api/workloads/route.ts).
const dbCat = (pt: string) =>
  pt === 'vm' ? 'compute' : pt === 'data-analytics' ? 'data_warehouse' : pt;

export interface DQIssue {
  severity: 'error' | 'warn';
  kind: string;
  detail: string;
  meta?: Record<string, unknown>;
}

export interface DQReport {
  generatedAt: string;
  issueCount: number;
  errorCount: number;
  warnCount: number;
  issues: DQIssue[];
}

/**
 * Runs automated data-quality checks against the pricing catalog. Surfaces the
 * two classes of problem that silently break workload comparisons:
 *
 *  A. Capability coverage gaps — a service a workload depends on (e.g. "Load
 *     Balancer", "Relational") exists for some providers but is missing for
 *     others that DO have other data in the same service category. Those
 *     providers then show a false "N/A" for that workload component.
 *
 *  B. Zero spec attributes — every row for a provider+category has memory_gb=0
 *     (or vcpus=0), so workload `minMemoryGb`/`minVcpus` filters exclude them
 *     all, again producing a false "N/A".
 */
export async function runDataQualityChecks(sql: any): Promise<DQReport> {
  const issues: DQIssue[] = [];

  // ── Check A: workload capability coverage ──────────────────────────────────
  // Derive the (serviceCategory, categoryToken) capabilities every workload
  // actually depends on, straight from the workload definitions.
  const caps = new Map<string, { dbCategory: string; token: string }>();
  for (const w of WORKLOADS) {
    for (const c of w.components) {
      let reqs: any;
      try {
        reqs = c.getRequirements({} as any);
      } catch {
        continue;
      }
      if (!reqs?.category) continue;
      if (reqs.category === 'GPU instance' || reqs.category === 'Inference') continue; // special-cased in matcher
      const dbCategory = dbCat(reqs.productType);
      caps.set(`${dbCategory}|${reqs.category}`, { dbCategory, token: reqs.category });
    }
  }

  for (const { dbCategory, token } of caps.values()) {
    // Providers that have ANY record in this service category at all.
    const present = await sql`
      SELECT DISTINCT p.slug FROM pricing_records pr
      JOIN services s ON pr.service_id = s.id
      JOIN providers p ON s.provider_id = p.id
      WHERE s.category = ${dbCategory}
    `;
    const provWithSvc = new Set<string>(present.map((r: any) => r.slug));
    if (provWithSvc.size === 0) continue;

    // Providers that have a record matching this capability token.
    const hit = await sql`
      SELECT DISTINCT p.slug FROM pricing_records pr
      JOIN services s ON pr.service_id = s.id
      JOIN providers p ON s.provider_id = p.id
      WHERE s.category = ${dbCategory} AND pr.category ILIKE ${'%' + token + '%'}
    `;
    const provWithCap = new Set<string>(hit.map((r: any) => r.slug));

    // Missing = has data in the service category but not this capability.
    const missing = [...provWithSvc].filter(s => !provWithCap.has(s)).sort();
    if (provWithCap.size >= 1 && missing.length > 0) {
      issues.push({
        // If literally no provider has it, it's likely a definition issue (warn);
        // if most do but a few don't, it's a real gap (error).
        severity: missing.length >= provWithSvc.size ? 'warn' : 'error',
        kind: 'capability_coverage_gap',
        detail: `"${token}" (${dbCategory}) is present for [${[...provWithCap].sort().join(', ')}] but MISSING for [${missing.join(', ')}]. These providers have other ${dbCategory} data, so workloads using this component will show N/A for them.`,
        meta: { dbCategory, token, present: [...provWithCap].sort(), missing },
      });
    }
  }

  // ── Check B: spec attributes all zero ──────────────────────────────────────
  const specRows = await sql`
    SELECT p.slug AS provider, s.category AS svc, pr.category AS subcat,
           COUNT(*) AS total,
           COUNT(*) FILTER (WHERE pr.memory_gb > 0) AS mem_ok,
           COUNT(*) FILTER (WHERE pr.vcpus > 0)     AS vcpu_ok
    FROM pricing_records pr
    JOIN services s ON pr.service_id = s.id
    JOIN providers p ON s.provider_id = p.id
    WHERE s.category IN ('compute', 'database')
    GROUP BY p.slug, s.category, pr.category
    HAVING COUNT(*) >= 3
  `;
  for (const r of specRows) {
    const total = Number(r.total);
    if (Number(r.mem_ok) === 0) {
      issues.push({
        severity: 'error',
        kind: 'zero_memory_gb',
        detail: `${r.provider} / ${r.svc} / "${r.subcat}": all ${total} rows have memory_gb=0. Workload minMemoryGb filters exclude every row, producing a false N/A.`,
        meta: { provider: r.provider, svc: r.svc, subcat: r.subcat, total },
      });
    }
    if (Number(r.vcpu_ok) === 0) {
      issues.push({
        severity: 'warn',
        kind: 'zero_vcpus',
        detail: `${r.provider} / ${r.svc} / "${r.subcat}": all ${total} rows have vcpus=0.`,
        meta: { provider: r.provider, svc: r.svc, subcat: r.subcat, total },
      });
    }
  }

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warnCount = issues.filter(i => i.severity === 'warn').length;
  return {
    generatedAt: new Date().toISOString(),
    issueCount: issues.length,
    errorCount,
    warnCount,
    issues,
  };
}
