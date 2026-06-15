import sql from './src/lib/db.ts';
import { PricingRecord, PricingPipeline } from './src/services/pricing_pipeline.ts';
import { AZURE_APP_HOSTING, DO_APP_HOSTING } from './src/config/app_hosting.ts';
import { AZURE_INTEGRATION, AWS_INTEGRATION } from './src/config/integration.ts';

class AppHostingPipeline extends PricingPipeline {
  async run() {
    const appHostingRecords: PricingRecord[] = [
      ...AZURE_APP_HOSTING.map(r => ({
        provider: 'azure', service: 'App Service', region: 'eastus', instanceType: r.type,
        vcpus: r.vcpus, memoryGb: r.memory_gb, arch: '', os: r.attributes.os, cpuVendor: '', gpuCount: 0,
        geography: 'N. America', category: 'App Hosting', price: r.price, unit: r.unit, dataSource: 'static_config' as const, attributes: r.attributes
      })),
      ...DO_APP_HOSTING.map(r => ({
        provider: 'digitalocean', service: 'App Platform', region: 'nyc1', instanceType: r.type,
        vcpus: r.vcpus, memoryGb: r.memory_gb, arch: '', os: r.attributes.os, cpuVendor: '', gpuCount: 0,
        geography: 'N. America', category: 'App Hosting', price: r.price, unit: r.unit, dataSource: 'static_config' as const, attributes: r.attributes
      }))
    ];
    await this.saveRecords(appHostingRecords, 'app-hosting');
    return [];
  }
}

class IntegrationPipeline extends PricingPipeline {
  async run() {
    const integrationRecords: PricingRecord[] = [
      ...AZURE_INTEGRATION.map(r => ({
        provider: 'azure', service: r.type.includes('Grid') ? 'Event Grid' : 'Service Bus', region: 'eastus', instanceType: r.type,
        vcpus: 0, memoryGb: 0, arch: '', os: '', cpuVendor: '', gpuCount: 0,
        geography: 'N. America', category: r.category, price: r.price, unit: r.unit, dataSource: 'static_config' as const, attributes: r.attributes
      })),
      ...AWS_INTEGRATION.map(r => ({
        provider: 'aws', service: r.type.includes('API') ? 'API Gateway' : 'SQS', region: 'us-east-1', instanceType: r.type,
        vcpus: 0, memoryGb: 0, arch: '', os: '', cpuVendor: '', gpuCount: 0,
        geography: 'N. America', category: r.category, price: r.price, unit: r.unit, dataSource: 'static_config' as const, attributes: r.attributes
      }))
    ];
    await this.saveRecords(integrationRecords, 'integration');
    return [];
  }
}

async function main() {
  const p1 = new AppHostingPipeline(sql);
  await p1.run();
  
  const p2 = new IntegrationPipeline(sql);
  await p2.run();
  
  await sql.end();
}

main().catch(console.error);
