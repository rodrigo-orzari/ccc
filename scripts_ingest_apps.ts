import sql from './src/lib/db.ts';
import { PricingRecord } from './src/services/pricing_pipeline.ts';
import { AZURE_APP_HOSTING, DO_APP_HOSTING } from './src/config/app_hosting.ts';
import { AZURE_INTEGRATION, AWS_INTEGRATION } from './src/config/integration.ts';

async function saveRecords(records: PricingRecord[], category: string) {
  if (records.length === 0) return;
  const providers = Array.from(new Set(records.map((r) => r.provider)));

  await sql.begin(async (sql) => {
    for (const p of providers) {
      const [providerRow] = await sql`SELECT id FROM providers WHERE slug = ${p as string}`;
      if (!providerRow) throw new Error(`Provider not found: ${p}`);
      
      await sql`
        DELETE FROM pricing_records 
        USING services
        WHERE pricing_records.service_id = services.id
          AND services.provider_id = ${providerRow.id}
          AND services.category = ${category}
          AND pricing_records.data_source = 'static_config'
      `;
    }

    for (const r of records) {
      const [providerRow] = await sql`SELECT id FROM providers WHERE slug = ${r.provider}`;
      const [serviceRow] = await sql`
        INSERT INTO services (provider_id, name, category)
        VALUES (${providerRow.id}, ${r.service}, ${category})
        ON CONFLICT (provider_id, name) DO UPDATE SET category = EXCLUDED.category
        RETURNING id
      `;

      await sql`
        INSERT INTO pricing_records (
          service_id, region, instance_type,
          vcpus, memory_gb, arch, os, cpu_vendor, gpu_count,
          geography, category, price_per_unit, unit,
          data_source, attributes
        ) VALUES (
          ${serviceRow.id}, ${r.region}, ${r.instanceType},
          ${r.vcpus}, ${r.memoryGb}, ${r.arch}, ${r.os}, ${r.cpuVendor}, ${r.gpuCount},
          ${r.geography}, ${r.category}, ${r.price}, ${r.unit},
          ${r.dataSource}, ${r.attributes as any}
        )
      `;
    }
  });
  console.log(`✅ Saved ${records.length} static records for ${category}`);
}

async function main() {
  // APP HOSTING
  const appHostingRecords: any[] = [
    ...AZURE_APP_HOSTING.map(r => ({
      provider: 'azure', service: 'App Service', region: 'eastus', instanceType: r.type,
      vcpus: r.vcpus, memoryGb: r.memory_gb, arch: '', os: r.attributes.os, cpuVendor: '', gpuCount: 0,
      geography: 'N. America', category: 'App Hosting', price: r.price, unit: r.unit, dataSource: 'static_config', attributes: r.attributes
    })),
    ...DO_APP_HOSTING.map(r => ({
      provider: 'digitalocean', service: 'App Platform', region: 'nyc1', instanceType: r.type,
      vcpus: r.vcpus, memoryGb: r.memory_gb, arch: '', os: r.attributes.os, cpuVendor: '', gpuCount: 0,
      geography: 'N. America', category: 'App Hosting', price: r.price, unit: r.unit, dataSource: 'static_config', attributes: r.attributes
    }))
  ];

  await saveRecords(appHostingRecords, 'app-hosting');

  // INTEGRATION
  const integrationRecords: any[] = [
    ...AZURE_INTEGRATION.map(r => ({
      provider: 'azure', service: r.type.includes('Grid') ? 'Event Grid' : 'Service Bus', region: 'eastus', instanceType: r.type,
      vcpus: 0, memoryGb: 0, arch: '', os: '', cpuVendor: '', gpuCount: 0,
      geography: 'N. America', category: r.category, price: r.price, unit: r.unit, dataSource: 'static_config', attributes: r.attributes
    })),
    ...AWS_INTEGRATION.map(r => ({
      provider: 'aws', service: r.type.includes('API') ? 'API Gateway' : 'SQS', region: 'us-east-1', instanceType: r.type,
      vcpus: 0, memoryGb: 0, arch: '', os: '', cpuVendor: '', gpuCount: 0,
      geography: 'N. America', category: r.category, price: r.price, unit: r.unit, dataSource: 'static_config', attributes: r.attributes
    }))
  ];

  await saveRecords(integrationRecords, 'integration');
  await sql.end();
}

main().catch(console.error);
