import 'dotenv/config';
import postgres from 'postgres';
import { NetworkingPricingPipeline } from './src/services/networking_pipeline.ts';

let caCert = process.env.DATABASE_CA_CERT;
if (caCert && !caCert.includes('-----BEGIN CERTIFICATE-----')) {
  try {
    caCert = Buffer.from(caCert, 'base64').toString('utf-8');
  } catch (e) {}
}


const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });

async function main() {
  console.log("Running Networking Pricing Pipeline...");
  const pipeline = new NetworkingPricingPipeline(sql as any);
  const results = await pipeline.run();
  console.log("Pipeline results:", JSON.stringify(results, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
