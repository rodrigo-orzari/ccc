import fs from 'fs';

// ---------------------------------------------------------
// 1. Refactor pricing_pipeline.ts
// ---------------------------------------------------------
let pricingContent = fs.readFileSync('src/services/pricing_pipeline.ts', 'utf8');

// Replace pg import with postgres (technically, we just need Sql type if any)
pricingContent = pricingContent.replace("import { Pool } from 'pg';", "import type { Sql } from 'postgres';");
pricingContent = pricingContent.replace("protected pool: Pool;", "protected sql: Sql;");
pricingContent = pricingContent.replace("constructor(pool: Pool) {", "constructor(sql: Sql) {\n    this.sql = sql;");
pricingContent = pricingContent.replace("this.pool = pool;", "");

// Rewrite saveRecords completely
const newSaveRecords = `
  protected async saveRecords(records: PricingRecord[], serviceCategory = 'compute'): Promise<PriceDriftResult[]> {
    if (records.length === 0) return [];

    const dataSource = records[0].dataSource ?? 'live_api';
    let driftAlerts: PriceDriftResult[] = [];

    await this.sql.begin(async (sql) => {
      const providerSlug = records[0].provider;
      const providerRes = await sql\`SELECT id FROM providers WHERE slug = \${providerSlug}\`;

      if (providerRes.length === 0) {
        throw new Error(\`Provider \${providerSlug} not found in database\`);
      }
      const providerId = providerRes[0].id;

      // 1. Map Regions
      const regionMap = new Map<string, number>();
      const uniqueRegions = [...new Set(records.map(r => r.region))];

      for (const regionSlug of uniqueRegions) {
        const res = await sql\`
          INSERT INTO regions (provider_id, slug) 
          VALUES (\${providerId}, \${regionSlug}) 
          ON CONFLICT (provider_id, slug) DO UPDATE SET slug = EXCLUDED.slug 
          RETURNING id
        \`;
        regionMap.set(regionSlug, res[0].id);
      }

      // 2. Ensure Service exists
      const serviceName = records[0].service;
      const serviceRes = await sql\`
        INSERT INTO services (provider_id, name, category) 
        VALUES (\${providerId}, \${serviceName}, \${serviceCategory}) 
        ON CONFLICT (provider_id, name) DO UPDATE SET category = EXCLUDED.category 
        RETURNING id
      \`;
      const serviceId = serviceRes[0].id;

      // 3. Fetch old prices for drift detection BEFORE deleting
      const oldPriceRes = await sql\`
        SELECT instance_type, price_per_unit 
        FROM pricing_records 
        WHERE service_id = \${serviceId}
      \`;
      const oldPriceMap = new Map<string, number>();
      for (const row of oldPriceRes) {
        oldPriceMap.set(row.instance_type, parseFloat(row.price_per_unit));
      }

      // 4. Detect price drift (>20% change)
      if (oldPriceMap.size > 0) {
        for (const r of records) {
          const oldPrice = oldPriceMap.get(r.instanceType);
          if (oldPrice !== undefined && oldPrice > 0) {
            const pctChange = ((r.price - oldPrice) / oldPrice) * 100;
            if (Math.abs(pctChange) > 20) {
              driftAlerts.push({ provider: providerSlug, service: serviceName, instanceType: r.instanceType, oldPrice, newPrice: r.price, pctChange });
            }
          }
        }
        if (driftAlerts.length > 0) {
          console.warn(\`⚠️  Price drift detected for \${providerSlug} / \${serviceName}: \${driftAlerts.length} instance(s) changed >20%\`);
        }
      }

      // 5. Delete old records
      await sql\`DELETE FROM pricing_records WHERE service_id = \${serviceId}\`;

      // 6. Batch Insert Pricing Records
      const rowsToInsert = records.map(r => {
        const attrs = { ...r.attributes };
        if (r.supportedLanguages && r.supportedLanguages.length > 0) {
          attrs.supportedLanguages = r.supportedLanguages;
        }
        return {
          service_id: serviceId,
          region_id: regionMap.get(r.region),
          instance_type: r.instanceType,
          vcpus: r.vcpus,
          memory_gb: r.memoryGb,
          arch: r.arch,
          os: r.os,
          cpu_vendor: r.cpuVendor,
          gpu_count: r.gpuCount,
          geography: r.geography,
          category: r.category,
          price_per_unit: r.price,
          unit: r.unit,
          attributes: Object.keys(attrs).length > 0 ? JSON.stringify(attrs) : null,
          data_source: dataSource
        };
      });

      // postgres.js bulk insert!
      if (rowsToInsert.length > 0) {
        await sql\`INSERT INTO pricing_records \${sql(rowsToInsert)}\`;
      }

      console.log(\`✅ Saved \${records.length} records for \${providerSlug} (\${serviceCategory}, source: \${dataSource})\`);
    });

    return driftAlerts;
  }
}
`;

pricingContent = pricingContent.replace(/protected async saveRecords[\s\S]*?\}\n\}\n/m, newSaveRecords);
fs.writeFileSync('src/services/pricing_pipeline.ts', pricingContent);
console.log('Refactored pricing_pipeline.ts');

// ---------------------------------------------------------
// 2. Refactor networking_pipeline.ts
// ---------------------------------------------------------
let netContent = fs.readFileSync('src/services/networking_pipeline.ts', 'utf8');
netContent = netContent.replace("import { Pool } from 'pg';", "import type { Sql } from 'postgres';");
netContent = netContent.replace("constructor(pool: Pool) {", "constructor(sql: Sql) {\n    super(sql);");
netContent = netContent.replace(/const client = await this\.pool\.connect\(\);[\s\S]*?try \{[\s\S]*?await client\.query\('BEGIN'\);[\s\S]*?await client\.query\('COMMIT'\);[\s\S]*?\} catch \(err\) \{[\s\S]*?await client\.query\('ROLLBACK'\);[\s\S]*?\} finally \{[\s\S]*?client\.release\(\);[\s\S]*?\}/m, `
    await this.sql.begin(async (sql) => {
      await sql\`
        INSERT INTO providers (name, slug) VALUES 
        ('AWS', 'aws'), ('Azure', 'azure'), ('Google', 'gcp'), 
        ('DigitalOcean', 'digitalocean'), ('Oracle', 'oracle')
        ON CONFLICT (slug) DO NOTHING
      \`;

      for (const record of ALL_NETWORKING_RECORDS) {
        const providerRes = await sql\`SELECT id FROM providers WHERE slug = \${record.provider}\`;
        if (providerRes.length === 0) continue;

        let serviceRes = await sql\`SELECT id FROM services WHERE provider_id = \${providerRes[0].id} AND name = \${record.service} AND category = 'networking'\`;
        let serviceId;
        if (serviceRes.length === 0) {
          const insertService = await sql\`
            INSERT INTO services (provider_id, name, category) 
            VALUES (\${providerRes[0].id}, \${record.service}, 'networking') 
            RETURNING id
          \`;
          serviceId = insertService[0].id;
        } else {
          serviceId = serviceRes[0].id;
        }

        await sql\`
          INSERT INTO regions (provider_id, slug) 
          VALUES (\${providerRes[0].id}, 'global') 
          ON CONFLICT DO NOTHING
        \`;
      }
    });
`);

netContent = netContent.replace(/await client\.query\(\`\n\s*INSERT INTO regions \(provider_id, slug\)[\s\S]*?\`,\n\s*\[providerRes\.rows\[0\]\.id, 'global'\]\n\s*\);/g, `await sql\`INSERT INTO regions (provider_id, slug) VALUES (\${providerRes[0].id}, 'global') ON CONFLICT DO NOTHING\`;`);

fs.writeFileSync('src/services/networking_pipeline.ts', netContent);
console.log('Refactored networking_pipeline.ts');

// ---------------------------------------------------------
// 3. Fix other subclasses
// ---------------------------------------------------------
const subclasses = [
  'database_pipeline.ts', 'serverless_pipeline.ts', 'containers_pipeline.ts', 'data_analytics_pipeline.ts'
];
subclasses.forEach(file => {
  const p = 'src/services/' + file;
  if (fs.existsSync(p)) {
    let subContent = fs.readFileSync(p, 'utf8');
    subContent = subContent.replace("import { Pool } from 'pg';", "import type { Sql } from 'postgres';");
    subContent = subContent.replace("constructor(pool: Pool) {", "constructor(sql: Sql) {");
    fs.writeFileSync(p, subContent);
  }
});
console.log('Refactored subclasses.');

