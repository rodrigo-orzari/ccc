import { Pool } from 'pg';
import {
  PricingPipeline,
  DatabasePricingPipeline,
  AWSAdapter,
  AzureAdapter,
  GCPAdapter,
  OracleAdapter,
  DigitalOceanAdapter,
} from './pricing_pipeline.js';

async function main() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });

  try {
    console.log('🚀 Starting pricing data ingestion...\n');

    // Run compute pricing pipeline
    console.log('📊 Computing VM Pricing...');
    const computePipeline = new PricingPipeline(pool);
    computePipeline.adapters = [
      new AWSAdapter(),
      new AzureAdapter(),
      new GCPAdapter(),
      new OracleAdapter(),
      new DigitalOceanAdapter(),
    ];
    const computeResults = await computePipeline.run();
    computeResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ ${result.provider.toUpperCase()}: ${result.count} VMs`);
      } else {
        console.log(`  ❌ ${result.provider.toUpperCase()}: ${result.message}`);
      }
    });

    console.log('\n📊 Computing Database Pricing...');
    // Run database pricing pipeline
    const dbPipeline = new DatabasePricingPipeline(pool);
    const dbResults = await dbPipeline.run();
    dbResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ ${result.provider.toUpperCase()}: ${result.count} DB configurations`);
      } else {
        console.log(`  ❌ ${result.provider.toUpperCase()}: ${result.message}`);
      }
    });

    console.log('\n✨ Pricing data ingestion complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
