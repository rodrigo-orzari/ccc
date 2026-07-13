import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { WORKLOADS } from '@/config/workloads';
import { DEFAULT_PRIORITIES } from '@/config/workload_priorities';

// Integration SKUs are consumption-priced in heterogeneous units ("per 1M
// Requests", "per 1M Events", "per 1k Actions", "per TB", flat "Mo", …). To
// compare and price them we convert each to an estimated monthly cost at a
// representative usage volume. These volumes are deliberate, tunable
// assumptions for a directional comparison — NOT a metered bill.
const ASSUMED_MILLIONS_OF_OPS_PER_MONTH = 10;     // 10M requests/events/operations
const ASSUMED_THOUSANDS_OF_STEPS_PER_MONTH = 100; // 100k workflow actions/steps
const ASSUMED_TB_PER_MONTH = 1;                   // 1 TB throughput

function integrationMonthlyCost(unit: string, price: number, quantity: number): number {
  const u = (unit || '').toLowerCase();
  if (u.includes('mo')) return price * quantity;                                   // already monthly (flat SKU)
  if (u.includes('1m')) return price * ASSUMED_MILLIONS_OF_OPS_PER_MONTH * quantity;
  if (u.includes('1k')) return price * ASSUMED_THOUSANDS_OF_STEPS_PER_MONTH * quantity;
  if (u.includes('tb')) return price * ASSUMED_TB_PER_MONTH * quantity;
  return price * quantity; // unknown consumption unit — raw per-unit, not ×730
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workloadId, priorities, region } = body;
    const activePriorities = priorities ?? DEFAULT_PRIORITIES;

    const workload = WORKLOADS.find((w) => w.id === workloadId);
    if (!workload) {
      return NextResponse.json({ error: 'Workload not found' }, { status: 404 });
    }

    const providers = ['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'alibaba'];
    const results: Record<string, { total: number; components: any[] }> = {};

    providers.forEach(p => results[p] = { total: 0, components: [] });

    for (const component of workload.components) {
      const reqs = component.getRequirements(activePriorities);
      // Components can opt out of the architecture at the current priority levels
      // (e.g. security add-ons below Security=medium) by returning null — skip them.
      if (!reqs) continue;
      const dbCategory = reqs.productType === 'vm' ? 'compute' : reqs.productType === 'data-analytics' ? 'data_warehouse' : reqs.productType;

      for (const provider of providers) {
        // Base constraints that must always hold: provider, service category, the
        // product-type category match, and (optionally) region.
        const base = [
          sql`p.slug = ${provider}`,
          sql`s.category = ${dbCategory}`,
        ];

        if (reqs.category === 'GPU instance') {
          base.push(sql`pr.gpu_count > 0`);
        } else if (reqs.category === 'Inference') {
          base.push(sql`pr.category ILIKE '%ai%' AND s.name NOT ILIKE '%embeddings%'`);
        } else if (reqs.category === 'Embeddings') {
          base.push(sql`s.name ILIKE '%embeddings%'`);
        } else if (reqs.productType === 'integration' && reqs.category) {
          // Integration records all share pr.category = 'integration'; the
          // specific service (Message Queue / Event Bus / API Gateway /
          // Workflow) is distinguished by attributes.service_type
          // (Messaging / Eventing / API Gateway / Workflow — see
          // config/integration.ts). So match on service_type, not pr.category.
          base.push(sql`pr.attributes->>'service_type' = ${reqs.category}`);
        } else if (reqs.category) {
          base.push(sql`pr.category ILIKE ${'%' + reqs.category + '%'}`);
        }

        if (region && region !== 'Global') {
          let regionTerms = [region.toLowerCase(), 'global'];
          const lowerRegion = region.toLowerCase();
          if (lowerRegion.includes('n. america') || lowerRegion === 'us') {
            regionTerms.push('us east', 'us west', 'us central', 'us south', 'us-east', 'us-west', 'canada', 'north america', 'us');
          } else if (lowerRegion.includes('europe') || lowerRegion === 'eu') {
            regionTerms.push('europe', 'eu-west', 'eu-central', 'eu-north', 'uk', 'ireland', 'frankfurt', 'london', 'paris', 'eu');
          } else if (lowerRegion.includes('asia') || lowerRegion === 'apac') {
            regionTerms.push('asia', 'apac', 'tokyo', 'singapore', 'sydney', 'mumbai', 'seoul', 'osaka', 'hong kong');
          } else if (lowerRegion.includes('south america') || lowerRegion === 'sa') {
            regionTerms.push('south america', 'sa-east', 'sao paulo');
          }
          base.push(sql`LOWER(pr.geography) = ANY(${regionTerms})`);
        }

        const vcpuCond = reqs.minVcpus ? sql`pr.vcpus >= ${reqs.minVcpus}` : null;
        const memCond = reqs.minMemoryGb ? sql`pr.memory_gb >= ${reqs.minMemoryGb}` : null;

        let chosen: any = null;
        let monthlyPrice = 0;

        if (reqs.productType === 'integration') {
          // Integration SKUs within one service_type have HETEROGENEOUS units
          // (per 1M ops, per 1k steps, per TB, flat per Mo), so picking the row
          // with the lowest RAW price_per_unit — as the ORDER BY below does for
          // everything else — is meaningless here (a $0.40/1M-ops row would
          // "beat" a $10/Mo flat row that's actually cheaper at real volume).
          // Instead fetch every candidate, convert each to an estimated monthly
          // cost at a representative volume, and keep the cheapest by that.
          const conditionSnippet = base.reduce((acc, condition, index) => (
            index === 0 ? condition : sql`${acc} AND ${condition}`
          ), sql``);
          const candidates = await sql`
            SELECT pr.* FROM pricing_records pr
            JOIN services s ON pr.service_id = s.id
            JOIN providers p ON s.provider_id = p.id
            WHERE ${conditionSnippet}
          `;
          for (const cand of candidates) {
            const m = integrationMonthlyCost(cand.unit, parseFloat(cand.price_per_unit), reqs.quantity);
            if (chosen === null || m < monthlyPrice) {
              chosen = cand;
              monthlyPrice = m;
            }
          }
        } else {
          // Progressively relax the spec filters so a single missing/zero attribute
          // (e.g. an Azure relational row with memory_gb=0) doesn't make a provider
          // falsely report N/A. The category match is never relaxed. Each attempt is
          // tried in order; the first that returns a row wins.
          const specTiers: (typeof base)[] = [];
          specTiers.push([vcpuCond, memCond].filter(Boolean) as typeof base);   // strict: vCPU + memory
          if (memCond) specTiers.push([vcpuCond].filter(Boolean) as typeof base); // drop memory
          if (vcpuCond) specTiers.push([memCond].filter(Boolean) as typeof base); // drop vCPU
          specTiers.push([]);                                                     // category only (last resort)

          let match: any[] = [];
          for (const extra of specTiers) {
            const all = [...base, ...extra];
            const conditionSnippet = all.reduce((acc, condition, index) => (
              index === 0 ? condition : sql`${acc} AND ${condition}`
            ), sql``);
            match = await sql`
              SELECT pr.* FROM pricing_records pr
              JOIN services s ON pr.service_id = s.id
              JOIN providers p ON s.provider_id = p.id
              WHERE ${conditionSnippet}
              ORDER BY pr.price_per_unit ASC LIMIT 1
            `;
            if (match && match.length > 0) break;
          }

          if (match && match.length > 0) {
            chosen = match[0];
            const unit = (chosen.unit || '').toLowerCase().trim();
            const price = parseFloat(chosen.price_per_unit);
            if (unit.includes('mo') || unit.includes('month')) {
              monthlyPrice = price * reqs.quantity;        // storage (GB-Month) / per-month SKUs; quantity = GB or units
            } else if (unit === 'gb' || unit === 'gib') {
              monthlyPrice = price * reqs.quantity;        // per-GB data (networking egress/CDN); quantity = monthly GB
            } else {
              monthlyPrice = price * 730 * reqs.quantity;  // hourly SKUs (VM, DB, containers, load balancer) → month
            }
          }
        }

        if (chosen) {
          results[provider].components.push({
            componentId: component.id,
            name: component.name,
            instanceType: chosen.instance_type,
            vcpus: chosen.vcpus,
            memoryGb: chosen.memory_gb,
            monthlyPrice: monthlyPrice,
            quantity: reqs.quantity,
          });
          results[provider].total += monthlyPrice;
        } else {
          results[provider].components.push({
            componentId: component.id,
            name: component.name,
            instanceType: 'N/A',
            monthlyPrice: 0,
            quantity: reqs.quantity,
          });
        }
      }
    }

    return NextResponse.json({ workloadId, results });
  } catch (error) {
    console.error('Workloads API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
