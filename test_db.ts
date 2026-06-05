import { sql } from './src/config/db.ts';

async function test() {
  const records = await sql`SELECT category, os, cpu_vendor, gpu_count, geography FROM pricing_records LIMIT 5;`;
  console.log(records);
  process.exit(0);
}
test();
