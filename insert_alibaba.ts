import dotenv from 'dotenv';
dotenv.config();
import postgres from 'postgres';

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });
  try {
    await sql`
      INSERT INTO providers (slug, name) VALUES ('alibaba', 'Alibaba Cloud')
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
    `;
    console.log('Inserted Alibaba into DB');
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}
main();
