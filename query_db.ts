import sql from './src/lib/db.ts';

async function run() {
  const res = await sql`SELECT category, COUNT(*) FROM pricing_records WHERE service_id IN (SELECT id FROM services WHERE category='database' AND provider_id=(SELECT id FROM providers WHERE slug='aws')) GROUP BY category;`;
  console.log('Database Categories:', res);

  process.exit(0);
}
run();
