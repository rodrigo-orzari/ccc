import fs from 'fs';

// 1. Fix Subclasses
const subclasses = [
  'database_pipeline.ts', 'serverless_pipeline.ts', 'containers_pipeline.ts', 'data_analytics_pipeline.ts'
];
subclasses.forEach(file => {
  const p = 'src/services/' + file;
  if (fs.existsSync(p)) {
    let subContent = fs.readFileSync(p, 'utf8');
    subContent = subContent.replace(/super\(pool\);/g, "super(sql);");
    fs.writeFileSync(p, subContent);
  }
});
console.log('Fixed subclasses super(sql).');

// 2. Fix networking_pipeline.ts
let netContent = fs.readFileSync('src/services/networking_pipeline.ts', 'utf8');
netContent = netContent.replace(/private pool: Pool;/g, "private sql: Sql;");
netContent = netContent.replace(/constructor\(sql: Sql\) \{\n\s*super\(sql\);\n\s*this\.pool = pool;\n\s*\}/m, 
  "constructor(sql: Sql) {\n    this.sql = sql;\n  }"
);

// We'll rewrite run() and setupNetworkingServices() using Postgres.js style
const newRunMethod = `
  async run() {
    console.log('🚀 Starting Networking Pricing Pipeline...');
    const results: any[] = [];
    const driftAlerts: PriceDriftResult[] = [];

    // Ensure services exist
    await this.setupNetworkingServices();

    let recordsAdded = 0;

    await this.sql.begin(async (sql) => {
      // Clear existing static networking data to avoid duplicates
      await sql\`
        DELETE FROM pricing_records 
        WHERE data_source = 'static_config' 
        AND service_id IN (
          SELECT id FROM services WHERE category = 'networking'
        )
      \`;

      for (const record of STATIC_NETWORKING_PRICING) {
        // Fetch provider and service IDs
        const providerRes = await sql\`SELECT id FROM providers WHERE slug = \${record.provider}\`;
        if (providerRes.length === 0) continue;

        let serviceRes = await sql\`SELECT id FROM services WHERE provider_id = \${providerRes[0].id} AND name = \${record.service} AND category = 'networking'\`;
        let serviceId: string;

        if (serviceRes.length === 0) {
          const insertService = await sql\`
            INSERT INTO services (provider_id, name, category) VALUES (\${providerRes[0].id}, \${record.service}, 'networking') RETURNING id
          \`;
          serviceId = insertService[0].id;
        } else {
          serviceId = serviceRes[0].id;
        }

        // Insert pricing record
        await sql\`
          INSERT INTO pricing_records 
            (service_id, instance_type, category, geography, price_per_unit, unit, attributes, data_source, updated_at) 
           VALUES (
             \${serviceId}, \${record.instance_type}, \${record.category}, \${record.geography}, 
             \${record.price_per_unit}, \${record.unit}, \${JSON.stringify(record.attributes)}, 
             'static_config', NOW()
           )
        \`;
        recordsAdded++;
      }
    });

    results.push({ provider: 'all_networking', status: 'success', recordsProcessed: recordsAdded, driftAlerts });
    console.log(\`✅ Networking Pricing Pipeline Completed. Inserted \${recordsAdded} records.\`);
    return results;
  }

  private async setupNetworkingServices() {
    const services = ['Data Transfer', 'Virtual Private Cloud (VPC)', 'Load Balancing', 'Dedicated Connection', 'Public IPv4'];
    for (const service of services) {
      await this.sql\`
        INSERT INTO services (provider_id, name, category)
        SELECT id, \${service}, 'networking' FROM providers WHERE slug IN ('aws', 'gcp', 'azure', 'oracle', 'digitalocean')
        ON CONFLICT (provider_id, name) DO UPDATE SET category = 'networking'
      \`;
    }
  }
`;

// Replace run() and setupNetworkingServices() with the new versions
netContent = netContent.slice(0, netContent.indexOf('async run() {')) + newRunMethod + "\n}\n";

fs.writeFileSync('src/services/networking_pipeline.ts', netContent);
console.log('Fixed networking_pipeline.ts.');
