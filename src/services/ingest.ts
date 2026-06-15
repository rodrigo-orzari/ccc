import dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';
import { PricingPipeline } from './pricing_pipeline';
import { DatabasePricingPipeline } from './database_pipeline';
import { ServerlessPricingPipeline } from './serverless_pipeline';
import { ContainersPricingPipeline } from './containers_pipeline';
import { DataAnalyticsPricingPipeline } from './data_analytics_pipeline';
import { NetworkingPricingPipeline } from './networking_pipeline';
import { StoragePricingPipeline } from './storage_pipeline';
import { AppHostingPricingPipeline } from './app_hosting_pipeline';
import { IntegrationPricingPipeline } from './integration_pipeline';


async function main() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const sql = postgres(dbUrl, { ssl: { rejectUnauthorized: false } });

  try {
    console.log('🚀 Starting pricing data ingestion...\n');

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

    console.log('\n📊 Computing Database Pricing...');
    // Run database pricing pipeline
    const dbPipeline = new DatabasePricingPipeline(sql as any);
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
    const serverlessPipeline = new ServerlessPricingPipeline(sql as any);
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
    const containersPipeline = new ContainersPricingPipeline(sql as any);
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
    const analyticsPipeline = new DataAnalyticsPricingPipeline(sql as any);
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
    const networkingPipeline = new NetworkingPricingPipeline(sql as any);
    const networkingResults = await networkingPipeline.run();
    networkingResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ NETWORKING: ${result.recordsProcessed} configurations inserted`);
      } else {
        console.log(`  ❌ NETWORKING: ${result.message}`);
      }
    });

    console.log('\n📊 Computing Storage Pricing...');
    // Run storage pricing pipeline
    const storagePipeline = new StoragePricingPipeline(sql as any);
    const storageResults = await storagePipeline.run();
    storageResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ ${result.provider.toUpperCase()}: ${result.count} Storage configurations`);
      } else {
        console.log(`  ❌ ${result.provider.toUpperCase()}: ${result.message}`);
      }
    });

    console.log('\n📊 Computing App Hosting Pricing...');
    // Run app hosting pricing pipeline
    const appHostingPipeline = new AppHostingPricingPipeline(sql as any);
    const appHostingResults = await appHostingPipeline.run();
    appHostingResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ ${result.provider.toUpperCase()}: ${result.count} App Hosting configurations`);
      } else {
        console.log(`  ❌ ${result.provider.toUpperCase()}: ${result.message}`);
      }
    });

    console.log('\n📊 Computing Integration Pricing...');
    // Run integration pricing pipeline
    const integrationPipeline = new IntegrationPricingPipeline(sql as any);
    const integrationResults = await integrationPipeline.run();
    integrationResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ ${result.provider.toUpperCase()}: ${result.count} Integration configurations`);
      } else {
        console.log(`  ❌ ${result.provider.toUpperCase()}: ${result.message}`);
      }
    });

    console.log('\n✅ All pipelines completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the script
main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
