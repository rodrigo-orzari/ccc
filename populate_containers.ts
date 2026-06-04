import pg from 'pg';
import { ContainersPricingPipeline } from './src/services/containers_pipeline.ts';
import dotenv from 'dotenv';
dotenv.config();

function parseDbUrl(url: string) {
  const isNeon = url.includes('neon.tech');
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? parseInt(u.port) : 5432,
    database: u.pathname.replace(/^\//, ''),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    ssl: { rejectUnauthorized: isNeon },
  };
}

async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }
  const pool = new pg.Pool(parseDbUrl(dbUrl));
  const pipeline = new ContainersPricingPipeline(pool);
  console.log('Running Containers Pricing Pipeline...');
  const results = await pipeline.run();
  console.log('Results:', JSON.stringify(results, null, 2));
  process.exit(0);
}

run().catch(console.error);
