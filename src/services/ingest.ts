import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import { PricingPipeline } from './pricing_pipeline.js';
import { DatabasePricingPipeline } from './database_pipeline.js';
import { ServerlessPricingPipeline } from './serverless_pipeline.js';
import { ContainersPricingPipeline } from './containers_pipeline.js';
import { DataAnalyticsPricingPipeline } from './data_analytics_pipeline.js';
import { NetworkingPricingPipeline } from './networking_pipeline.js';

function parseDbUrl(url: string) {
  const isNeon = url.includes('neon.tech');
  return {
    connectionString: url,
    ssl: { rejectUnauthorized: isNeon },
  };
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const pool = new Pool(parseDbUrl(dbUrl));

  try {
    console.log('🚀 Starting pricing data ingestion...\n');

    // Run compute pricing pipeline
    console.log('📊 Computing VM Pricing...');
    const computePipeline = new PricingPipeline(pool);
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

    console.log('\n📊 Computing Serverless Pricing...');
    // Run serverless pricing pipeline
    const serverlessPipeline = new ServerlessPricingPipeline(pool);
    const serverlessResults = await serverlessPipeline.run();
    serverlessResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ ${result.provider.toUpperCase()}: ${result.count} Serverless configurations`);
      } else {
        console.log(`  ❌ ${result.provider.toUpperCase()}: ${result.message}`);
      }
    });

    console.log('\n📊 Computing Containers Pricing...');
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

    console.log('\n📊 Computing Data Analytics Pricing...');
    // Run data analytics pricing pipeline
    const analyticsPipeline = new DataAnalyticsPricingPipeline(pool);
    const analyticsResults = await analyticsPipeline.run();
    analyticsResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ ${result.provider.toUpperCase()}: ${result.count} Data Analytics configurations`);
      } else {
        console.log(`  ❌ ${result.provider.toUpperCase()}: ${result.message}`);
      }
    });

    console.log('\n📊 Computing Networking Pricing...');
    // Run networking pricing pipeline
    const networkingPipeline = new NetworkingPricingPipeline(pool);
    const networkingResults = await networkingPipeline.run();
    networkingResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ NETWORKING: ${result.recordsProcessed} configurations inserted`);
      } else {
        console.log(`  ❌ NETWORKING: ${result.message}`);
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
