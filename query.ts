import sql from './src/lib/db';
async function main() {
  const result = await sql`
    SELECT pr.category, jsonb_object_keys(pr.attributes) as key, COUNT(*) 
    FROM pricing_records pr
    JOIN services s ON s.id = pr.service_id 
    WHERE s.category = 'storage'
    GROUP BY pr.category, key;
  `;
  console.log(result);
  process.exit(0);
}
main();
