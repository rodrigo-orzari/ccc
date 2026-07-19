import { DatabricksStaticAdapter, SnowflakeStaticAdapter, NativeAnalyticsStaticAdapter, AlibabaAnalyticsAdapter, OracleAnalyticsAdapter, DigitalOceanAnalyticsAdapter } from './src/services/data_analytics_pipeline';

async function main() {
  const adapters = [
    new DatabricksStaticAdapter('aws'),
    new DatabricksStaticAdapter('gcp'),
    new SnowflakeStaticAdapter('aws'),
    new SnowflakeStaticAdapter('azure'),
    new SnowflakeStaticAdapter('gcp'),
    new NativeAnalyticsStaticAdapter('aws'),
    new NativeAnalyticsStaticAdapter('gcp'),
    new AlibabaAnalyticsAdapter(),
    new OracleAnalyticsAdapter(),
    new DigitalOceanAnalyticsAdapter()
  ];

  const records = [];
  for (const adapter of adapters) {
    const fetched = await adapter.fetchPricing();
    records.push(...fetched);
  }

  // Group by engine, tier, deployment_type
  const groups = new Map();
  for (const r of records) {
    const engine = r.attributes.engine || 'Unknown';
    const tier = r.attributes.tier || 'Unknown';
    const deployment_type = r.attributes.deployment_type || 'Unknown';
    
    const key = `${engine}|${tier}|${deployment_type}`;
    if (!groups.has(key)) {
      groups.set(key, { engine, tier, deployment_type, count: 0 });
    }
    groups.get(key).count += 1;
  }

  console.log("=== All distinct tier values for data-analytics ===");
  const allGroups = Array.from(groups.values()).sort((a, b) => a.engine.localeCompare(b.engine) || a.tier.localeCompare(b.tier));
  console.table(allGroups);

  console.log("\n=== Flagged Rows ===");
  const flagged = allGroups.filter(g => 
    g.tier.toLowerCase() === 'provisioned' || 
    g.tier.toLowerCase() === 'serverless' || 
    g.tier.toLowerCase() === 'on-demand'
  );
  console.table(flagged);

  console.log("\n=== Reverse Leak Check ===");
  const reverseLeak = allGroups.filter(g => 
    g.deployment_type.toLowerCase().includes('enterprise') || 
    g.deployment_type.toLowerCase().includes('standard') ||
    g.deployment_type.toLowerCase().includes('premium') ||
    g.deployment_type.toLowerCase().includes('basic') ||
    g.deployment_type.toLowerCase().includes('free')
  );
  console.table(reverseLeak);

  console.log("\n=== Stray Whitespace / Casing ===");
  const whitespace = allGroups.filter(g => 
    g.tier !== g.tier.trim() || 
    /^[a-z]/.test(g.tier) ||
    /[A-Z]{2,}/.test(g.tier)
  );
  console.table(whitespace);
}

main().catch(console.error);
