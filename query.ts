import sql from './src/lib/db';
async function main() {
  const result = await sql`SELECT DISTINCT pr.category, s.category as product_category FROM pricing_records pr JOIN services s ON s.id = pr.service_id;`;
  console.log(result);
  process.exit(0);
}
main();
