import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL || '');

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
