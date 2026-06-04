import 'dotenv/config';
import { Pool } from 'pg';
import { NetworkingPricingPipeline } from './src/services/networking_pipeline.ts';

let caCert = process.env.DATABASE_CA_CERT;
if (caCert && !caCert.includes('-----BEGIN CERTIFICATE-----')) {
  try {
    caCert = Buffer.from(caCert, 'base64').toString('utf-8');
  } catch (e) {}
}

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

const pool = new Pool({
  ...parseDbUrl(process.env.DATABASE_URL!),
  ssl: {
    ca: caCert,
    rejectUnauthorized: false
  }
});

async function main() {
  console.log("Running Networking Pricing Pipeline...");
  const pipeline = new NetworkingPricingPipeline(pool);
  const results = await pipeline.run();
  console.log("Pipeline results:", JSON.stringify(results, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
