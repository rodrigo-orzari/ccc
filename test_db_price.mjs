import postgres from 'postgres';

const sql = postgres('postgresql://ccc-db:AVNS_urrXEwId1lR8DzpTaji@db-postgresql-ccc-do-user-16521473-0.k.db.ondigitalocean.com:25060/ccc?sslmode=require');

async function test() {
  try {
    const result = await sql`
      SELECT p.name as provider, s.name as service, pr.price_per_unit, pr.unit, pr.attributes 
      FROM pricing_records pr 
      JOIN services s ON pr.service_id = s.id 
      JOIN providers p ON s.provider_id = p.id 
      WHERE s.category = 'networking' 
      LIMIT 10
    `;
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

test();
