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
        let conditions = [
          sql`p.slug = ${provider}`,
          sql`s.category = ${dbCategory}`
        ];

        if (reqs.minVcpus) {
          conditions.push(sql`pr.vcpus >= ${reqs.minVcpus}`);
        }
        if (reqs.minMemoryGb) {
          conditions.push(sql`pr.memory_gb >= ${reqs.minMemoryGb}`);
        }
        if (reqs.category === 'GPU instance') {
          conditions.push(sql`pr.gpu_count > 0`);
        } else if (reqs.category === 'Inference') {
          conditions.push(sql`pr.category ILIKE '%ai%'`);
        } else if (reqs.category) {
          conditions.push(sql`pr.category ILIKE ${'%' + reqs.category + '%'}`);
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
          conditions.push(sql`LOWER(pr.geography) = ANY(${regionTerms})`);
        }

        const conditionSnippet = conditions.reduce((acc, condition, index) => {
          if (index === 0) return condition;
          return sql`${acc} AND ${condition}`;
        }, sql``);

        const match = await sql`
          SELECT pr.* FROM pricing_records pr
          JOIN services s ON pr.service_id = s.id
          JOIN providers p ON s.provider_id = p.id
          WHERE ${conditionSnippet}
          ORDER BY pr.price_per_unit ASC LIMIT 1
        `;
        
        if (match && match.length > 0) {
          const instance = match[0];
          const isMonthly = (instance.unit || '').toLowerCase().includes('mo');
          const monthlyPrice = isMonthly 
            ? parseFloat(instance.price_per_unit) * reqs.quantity
            : parseFloat(instance.price_per_unit) * 730 * reqs.quantity;

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
