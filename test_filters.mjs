import 'dotenv/config';
import { buildPricingFilters } from './src/lib/api-utils.ts';
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });

async function run() {
  const query = {
    product: 'data-analytics',
    provider: 'aws,azure,gcp,oracle,digitalocean,alibaba',
    geography: 'N. America,S. America,W. Europe,N. Europe,Mid East & Africa,Asia Pacific,Australia',
    minPrice: '0',
    maxPrice: '100',
    analyticsEngines: 'Databricks,Snowflake,Native,Oracle Analytics Cloud,Oracle Autonomous Data Warehouse,OpenSearch,Kafka,MaxCompute,E-MapReduce,Hologres,AnalyticDB for MySQL',
    analyticsDeploymentTypes: 'Serverless,Provisioned',
    analyticsTiers: 'Standard,Standard Edition,Premium,Enterprise,Enterprise Edition,Enterprise Plus,Business Critical,DC2 Node,RA3 Node,On-Demand'
  };
  
  const { whereClause, values } = buildPricingFilters(query);
  console.log('WHERE:', whereClause);
  console.log('VALUES:', values);
  
  const dbQuery = `
      SELECT p.slug, COUNT(pr.id) as count
      FROM providers p
      LEFT JOIN services s ON s.provider_id = p.id
      LEFT JOIN pricing_records pr ON pr.service_id = s.id
      LEFT JOIN regions r ON pr.region_id = r.id
      WHERE 1=1 ${whereClause}
      GROUP BY p.slug
    `;
    
  const result = await sql.unsafe(dbQuery, values);
  console.log('Result:', result);
  await sql.end();
}
run();
