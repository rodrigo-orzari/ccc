import 'dotenv/config';
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });
async function main() {
  const result = await sql`
    SELECT p.slug, COUNT(pr.id) 
    FROM pricing_records pr
    JOIN services s ON pr.service_id = s.id
    JOIN providers p ON s.provider_id = p.id
    WHERE s.category = 'data_warehouse' 
    GROUP BY p.slug
  `;
  console.log(result);
  await sql.end();
}
main();
