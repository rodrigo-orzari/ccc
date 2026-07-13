import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL as string, { ssl: { rejectUnauthorized: false } });

async function main() {
  const providers = await sql`SELECT id, slug FROM providers`;
  const gcpId = providers.find(p => p.slug === 'gcp')?.id;

  const res = await sql`
    SELECT DISTINCT pr.category
    FROM pricing_records pr
    JOIN services s ON pr.service_id = s.id
    WHERE s.provider_id = ${gcpId} AND s.category = 'database'
  `;
  console.log("GCP Database Categories:", res.map(r => r.category));
  
  // also check all providers for NoSQL
  const allNoSQL = await sql`
    SELECT DISTINCT p.slug, pr.category
    FROM pricing_records pr
    JOIN services s ON pr.service_id = s.id
    JOIN providers p ON s.provider_id = p.id
    WHERE s.category = 'database' AND pr.category ILIKE '%NoSQL%'
  `;
  console.log("\nProviders with NoSQL:", allNoSQL);
  
  process.exit(0);
}

main();
