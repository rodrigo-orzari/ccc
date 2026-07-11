import { PriorityLevel, WorkloadPriorities, ProductType } from '@/types';

// ─── Well-Architected intent model ─────────────────────────────────────────────
//
// Every workload is configured by the SAME four sliders (Capacity, Performance,
// Reliability, Security), each Low/Medium/High. Cost is the OUTPUT. Each workload
// composes the reusable modifiers below into its component requirements — there
// is no per-workload 4×3 lookup table, so behaviour stays consistent everywhere
// and the "what this builds" panel can explain the resulting architecture.

export const PRIORITY_PILLARS = [
  { key: 'capacity' as const,    label: 'Capacity',    hint: 'How big — users, throughput, data volume' },
  { key: 'performance' as const, label: 'Performance', hint: 'Speed — instance class, storage media, caching' },
  { key: 'reliability' as const, label: 'Reliability', hint: 'Redundancy — HA, replicas, backups, load balancing' },
  { key: 'security' as const,    label: 'Security',    hint: 'Hardening — WAF, key management, threat detection' },
];

export const PRIORITY_LEVELS: PriorityLevel[] = ['low', 'medium', 'high'];

export const DEFAULT_PRIORITIES: WorkloadPriorities = {
  capacity: 'medium',
  performance: 'medium',
  reliability: 'medium',
  security: 'medium',
};

const idx = (l: PriorityLevel): 0 | 1 | 2 => (l === 'low' ? 0 : l === 'medium' ? 1 : 2);
const pick = <T,>(l: PriorityLevel, low: T, medium: T, high: T): T => [low, medium, high][idx(l)];

// ─── Capacity — magnitude ──────────────────────────────────────────────────────
// Drives counts, sizes, and volumes. Roughly geometric so High is a genuinely
// large deployment, not a marginal bump.

/** Multiplier for things that scale ~linearly with load (fleet size, throughput). */
export const capacityScale = (l: PriorityLevel): number => pick(l, 1, 4, 16);
/** Gentler curve for things that grow sub-linearly (a single primary DB's size,
 *  a corpus, a control plane). */
export const capacitySize = (l: PriorityLevel): number => pick(l, 1, 2.5, 6);
/** Horizontal fleet count for a stateless tier, before reliability redundancy. */
export const capacityNodes = (l: PriorityLevel): number => pick(l, 1, 3, 8);

// ─── Performance — speed / quality per unit ────────────────────────────────────

/** Instance family: compute-optimized only when performance is maxed. */
export const perfComputeCategory = (l: PriorityLevel): string =>
  l === 'high' ? 'Compute optimized' : 'General purpose';
/** GB of RAM per vCPU baseline. */
export const perfMemoryPerVcpu = (l: PriorityLevel): number => pick(l, 2, 4, 8);
/** Block (SSD) storage at high performance, else Object. */
export const perfStorageCategory = (l: PriorityLevel): 'Object' | 'Block' =>
  l === 'high' ? 'Block' : 'Object';
/** A caching layer is warranted at high performance. */
export const perfWantsCache = (l: PriorityLevel): boolean => l === 'high';

// ─── Reliability — redundancy / HA ─────────────────────────────────────────────

export const reliabilityHaMode = (l: PriorityLevel): 'Single AZ' | 'Multi-AZ' =>
  l === 'low' ? 'Single AZ' : 'Multi-AZ';
/** Redundant copies of a stateless tier (multiplies the fleet count). */
export const reliabilityReplicas = (l: PriorityLevel): number => pick(l, 1, 2, 3);
/** Keep online backups / snapshots above the lowest tier. */
export const reliabilityWantsBackup = (l: PriorityLevel): boolean => l !== 'low';
/** Front the workload with a load balancer above the lowest tier. */
export const reliabilityWantsLoadBalancer = (l: PriorityLevel): boolean => l !== 'low';

// ─── Security — which hardening components are included ─────────────────────────
// low: none · medium: WAF + key management · high: + threat detection/monitoring

export type SecurityTier = 'waf' | 'kms' | 'threat';
export const securityIncludes = (l: PriorityLevel, tier: SecurityTier): boolean => {
  if (l === 'low') return false;
  if (l === 'medium') return tier !== 'threat';
  return true;
};

// ─── Helpers for composing component sizing ────────────────────────────────────

/** Standard compute sizing from the pillars: returns {minVcpus, minMemoryGb, category, quantity}.
 *  baseVcpus is the per-node vCPU floor at Capacity=low/Performance=low. */
export function computeReqs(p: WorkloadPriorities, baseVcpus: number, opts?: { redundant?: boolean; category?: string }) {
  const vcpus = Math.max(1, Math.round(baseVcpus * capacitySize(p.capacity)));
  const nodes = Math.max(1, Math.round(capacityNodes(p.capacity) * (opts?.redundant ? reliabilityReplicas(p.reliability) : 1)));
  return {
    productType: 'vm' as ProductType,
    minVcpus: vcpus,
    minMemoryGb: Math.round(vcpus * perfMemoryPerVcpu(p.performance)),
    category: opts?.category ?? perfComputeCategory(p.performance),
    quantity: nodes,
  };
}

/** Managed-database sizing. Reliability adds a standby replica (≈ Multi-AZ), so
 *  it moves cost through the existing engine (which has no ha_mode filter) by
 *  doubling the DB footprint rather than swapping SKUs. */
export function dbReqs(p: WorkloadPriorities, baseMemGb: number, category: string) {
  return {
    productType: 'database' as ProductType,
    category,
    minMemoryGb: Math.max(2, Math.round(baseMemGb * capacitySize(p.capacity))),
    quantity: p.reliability === 'low' ? 1 : 2,
  };
}

/** Storage volume sizing (GB). Perf picks Block(SSD) vs Object unless pinned. */
export function storageReqs(p: WorkloadPriorities, baseGb: number, opts?: { category?: 'Object' | 'Block' | 'File' }) {
  return {
    productType: 'storage' as ProductType,
    category: opts?.category ?? perfStorageCategory(p.performance),
    quantity: Math.max(1, Math.round(baseGb * capacityScale(p.capacity))),
  };
}
