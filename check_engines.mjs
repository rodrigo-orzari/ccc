import 'dotenv/config';
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });

async function run() {
  const result = await sql`
    SELECT p.slug, pr.attributes->>'engine' as engine, COUNT(pr.id) as count
    FROM providers p
    JOIN services s ON s.provider_id = p.id
    JOIN pricing_records pr ON pr.service_id = s.id
    WHERE s.category = 'data_warehouse'
    GROUP BY p.slug, pr.attributes->>'engine'
  `;
  console.log(result);
  await sql.end();
}
run();
