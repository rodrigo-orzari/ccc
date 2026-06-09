import { buildPricingFilters } from './src/lib/api-utils.ts';
import sql from './src/lib/db.ts';

async function testCounts() {
  const query = { product: 'ai' }; // same as debouncedParamsString without provider
  try {
    const { whereClause, values } = buildPricingFilters(query);
    console.log('Where:', whereClause);
    console.log('Values:', values);

    const dbQuery = `
      SELECT p.slug, COUNT(pr.id) as count
      FROM providers p
      LEFT JOIN services s ON s.provider_id = p.id
      LEFT JOIN pricing_records pr ON pr.service_id = s.id
      LEFT JOIN regions r ON pr.region_id = r.id
      WHERE 1=1 ${whereClause}
      GROUP BY p.slug
    `;
    const res = await sql.unsafe(dbQuery, values);
    console.log('Counts:', res);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

testCounts();
