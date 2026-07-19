import sql from './src/lib/db';
async function run() {
  const res = await sql`SELECT DISTINCT category FROM services`;
  console.log(res);
  process.exit(0);
}
run();
