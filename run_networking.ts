import dotenv from 'dotenv';
dotenv.config();
import postgres from 'postgres';
import { NetworkingPricingPipeline } from './src/services/networking_pipeline.ts';

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });
  const pipeline = new NetworkingPricingPipeline(sql);
  await pipeline.run();
  await sql.end();
}

main().catch(console.error);
