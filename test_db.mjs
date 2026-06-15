import 'dotenv/config';
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });

async function run() {
  const result = await sql`
      SELECT p.slug, pr.attributes->>'engine' as engine, COUNT(pr.id) as count
      FROM providers p
      LEFT JOIN services s ON s.provider_id = p.id
      LEFT JOIN pricing_records pr ON pr.service_id = s.id
      LEFT JOIN regions r ON pr.region_id = r.id
      WHERE 1=1 
      AND s.category = 'data_warehouse'
      AND LOWER(pr.attributes->>'engine') = ANY(ARRAY['databricks','snowflake','bigquery','redshift','synapse','oracle analytics cloud','oracle autonomous data warehouse','opensearch','kafka','maxcompute','e-mapreduce','hologres','analyticdb for mysql'])
      AND LOWER(pr.attributes->>'deployment_type') = ANY(ARRAY['serverless','provisioned'])
      AND LOWER(pr.attributes->>'tier') = ANY(ARRAY['standard','standard edition','premium','enterprise','enterprise edition','enterprise plus','business critical','dc2 node','ra3 node','on-demand'])
      GROUP BY p.slug, pr.attributes->>'engine'
    `;
    
  console.log('Result:', result);
  await sql.end();
}
run();
