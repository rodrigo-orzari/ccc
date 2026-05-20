import pg from 'pg';
import { ServerlessPricingPipeline } from './src/services/serverless_pipeline.ts';
import dotenv from 'dotenv';
dotenv.config();

function parseDbUrl(url: string) {
  const isNeon = url.includes('neon.tech');
  return {
    connectionString: url,
    ssl: isNeon ? { rejectUnauthorized: true } : false,
  };
}

async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }
  const pool = new pg.Pool(parseDbUrl(dbUrl));
  const pipeline = new ServerlessPricingPipeline(pool);
  console.log('Running Serverless Pricing Pipeline...');
  const results = await pipeline.run();
  console.log('Results:', JSON.stringify(results, null, 2));
  process.exit(0);
}

run().catch(console.error);
