import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL || '', {
  ssl: process.env.DATABASE_CA_CERT ? {
    rejectUnauthorized: false,
    ca: Buffer.from(process.env.DATABASE_CA_CERT, 'base64')
  } : {
    rejectUnauthorized: false
  }
});

async function run() {
  const query = 'SELECT p.slug, COUNT(pr.id) as count FROM providers p LEFT JOIN services s ON s.provider_id = p.id LEFT JOIN pricing_records pr ON pr.service_id = s.id WHERE 1=1 AND s.category = $1 GROUP BY p.slug';
  const values = ['compute'];
  
  try {
    const res = await sql.unsafe(query, values);
    console.log('Result:', res);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sql.end();
  }
}

run();
