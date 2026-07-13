import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
  max: 1
});

async function main() {
  try {
    const res = await sql`SELECT 1 as result`;
    console.log('Connected! Result:', res);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await sql.end();
  }
}
main();
