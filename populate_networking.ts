import 'dotenv/config';
import { Pool } from 'pg';
import { NetworkingPricingPipeline } from './src/services/networking_pipeline.ts';

let caCert = process.env.DATABASE_CA_CERT;
if (caCert && !caCert.includes('-----BEGIN CERTIFICATE-----')) {
  try {
    caCert = Buffer.from(caCert, 'base64').toString('utf-8');
  } catch (e) {}
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.replace('?sslmode=require', ''),
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
