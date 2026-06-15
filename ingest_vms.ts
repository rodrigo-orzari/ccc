import dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';
import { PricingPipeline } from './src/services/pricing_pipeline';

async function main() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const sql = postgres(dbUrl, { ssl: { rejectUnauthorized: false } });

  try {
    console.log('🚀 Starting VM pricing data ingestion...\n');

    // Run compute pricing pipeline
    console.log('📊 Computing VM Pricing...');
    const computePipeline = new PricingPipeline(sql as any);
    const computeResults = await computePipeline.run();
    computeResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ ${result.provider.toUpperCase()}: ${result.count} VMs`);
      } else {
        console.log(`  ❌ ${result.provider.toUpperCase()}: ${result.message}`);
      }
    });

    console.log('\n✨ Standalone VM ingestion complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
