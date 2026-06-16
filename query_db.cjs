const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres' });
async function run() {
  const res = await pool.query("SELECT category, COUNT(*) FROM pricing_records WHERE service_id IN (SELECT id FROM services WHERE category='compute' AND provider_id=(SELECT id FROM providers WHERE slug='aws')) GROUP BY category;");
  console.table(res.rows);
  const res2 = await pool.query("SELECT category, COUNT(*) FROM pricing_records WHERE service_id IN (SELECT id FROM services WHERE category='storage' AND provider_id=(SELECT id FROM providers WHERE slug='aws')) GROUP BY category;");
  console.table(res2.rows);
  const res3 = await pool.query("SELECT category, COUNT(*) FROM pricing_records WHERE service_id IN (SELECT id FROM services WHERE category='ai' AND provider_id=(SELECT id FROM providers WHERE slug='aws')) GROUP BY category;");
  console.table(res3.rows);
  pool.end();
}
run();
