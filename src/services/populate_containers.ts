import { Pool } from 'pg';
import { ContainersPricingPipeline } from './containers_pipeline.js';

async function main() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });

  try {
    console.log('🚀 Starting standalone containers pricing data ingestion...\n');

    // Run containers pricing pipeline
    const containersPipeline = new ContainersPricingPipeline(pool);
    const containersResults = await containersPipeline.run();
    
    containersResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ ${result.provider.toUpperCase()}: ${result.count} Containers configurations`);
      } else {
        console.log(`  ❌ ${result.provider.toUpperCase()}: ${result.message}`);
      }
    });

    console.log('\n✨ Standalone containers ingestion complete!');
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
