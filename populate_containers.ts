import postgres from 'postgres';
import { ContainersPricingPipeline } from './src/services/containers_pipeline.ts';
import dotenv from 'dotenv';
dotenv.config();


async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }
  const sql = postgres(dbUrl, { ssl: { rejectUnauthorized: false } });
  const pipeline = new ContainersPricingPipeline(sql as any);
  console.log('Running Containers Pricing Pipeline...');
  const results = await pipeline.run();
  console.log('Results:', JSON.stringify(results, null, 2));
  process.exit(0);
}

run().catch(console.error);
