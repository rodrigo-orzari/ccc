import sql from './src/lib/db.ts';

async function run() {
  const res = await sql`SELECT DISTINCT category FROM services;`;
  console.log('Service Categories:', res);
  process.exit(0);
}
run();
