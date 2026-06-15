import 'dotenv/config';
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });
async function main() {
  const result = await sql`SELECT provider, COUNT(*) FROM pricing_records WHERE category = 'data_warehouse' GROUP BY provider`;
  console.log(result);
  await sql.end();
}
main();
