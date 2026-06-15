import sql from './src/lib/db';
async function main() {
  const result = await sql`SELECT COUNT(*) FROM pricing_records pr JOIN services s ON s.id = pr.service_id WHERE s.category = 'storage';`;
  console.log(result);
  process.exit(0);
}
main();
