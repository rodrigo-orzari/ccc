import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { WORKLOADS } from '@/config/workloads';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workloadId, parameters, region } = body;

    const workload = WORKLOADS.find((w) => w.id === workloadId);
    if (!workload) {
      return NextResponse.json({ error: 'Workload not found' }, { status: 404 });
    }

    const providers = ['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'alibaba'];
    const results: Record<string, { total: number; components: any[] }> = {};
    
    providers.forEach(p => results[p] = { total: 0, components: [] });

    for (const component of workload.components) {
      const reqs = component.getRequirements(parameters || {});
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
          base.push(sql`pr.category ILIKE '%ai%'`);
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
          const instance = match[0];
          const unit = (instance.unit || '').toLowerCase();
          const price = parseFloat(instance.price_per_unit);
          let monthlyPrice: number;

          if (reqs.productType === 'integration') {
            // Integration units are consumption-based and heterogeneous
            // ("per 1M Requests", "per 1M Events", "per 1k Actions", "per TB",
            // flat "Mo", etc.) — the generic "× 730 hours" fallback used for
            // hourly VM pricing produces nonsense here (e.g. GCP Pub/Sub at
            // $40/TB would become ~$29k/mo). Instead, estimate a monthly cost
            // from a representative usage volume per unit shape. These volumes
            // are deliberate, tunable assumptions for a directional
            // comparison — NOT a metered bill. Adjust to taste.
            const ASSUMED_MILLIONS_OF_OPS_PER_MONTH = 10;   // 10M requests/events/operations
            const ASSUMED_THOUSANDS_OF_STEPS_PER_MONTH = 100; // 100k workflow actions/steps/transitions
            const ASSUMED_TB_PER_MONTH = 1;                 // 1 TB throughput
            if (unit.includes('mo')) {
              monthlyPrice = price * reqs.quantity;                                   // already monthly (flat SKU)
            } else if (unit.includes('1m')) {
              monthlyPrice = price * ASSUMED_MILLIONS_OF_OPS_PER_MONTH * reqs.quantity;
            } else if (unit.includes('1k')) {
              monthlyPrice = price * ASSUMED_THOUSANDS_OF_STEPS_PER_MONTH * reqs.quantity;
            } else if (unit.includes('tb')) {
              monthlyPrice = price * ASSUMED_TB_PER_MONTH * reqs.quantity;
            } else {
              // Unknown consumption unit (e.g. "per 10GB/Hr") — fall back to the
              // raw per-unit price rather than inflating it ×730.
              monthlyPrice = price * reqs.quantity;
            }
          } else {
            const isMonthly = unit.includes('mo');
            monthlyPrice = isMonthly
              ? price * reqs.quantity
              : price * 730 * reqs.quantity;
          }

          results[provider].components.push({
            componentId: component.id,
            name: component.name,
            instanceType: instance.instance_type,
            vcpus: instance.vcpus,
            memoryGb: instance.memory_gb,
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
