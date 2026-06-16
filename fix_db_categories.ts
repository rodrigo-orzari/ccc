import sql from './src/lib/db.ts';

async function run() {
  console.log('Running DB updates...');
  await sql`UPDATE pricing_records SET category = 'In-memory' WHERE category = 'Relational' AND attributes->>'engine' IN ('Redis', 'Memcached', 'Valkey');`;
  await sql`UPDATE pricing_records SET category = 'NoSQL' WHERE category = 'Relational' AND attributes->>'engine' IN ('MongoDB', 'Cassandra', 'DynamoDB', 'Cosmos DB');`;
  await sql`UPDATE pricing_records SET category = 'Streaming' WHERE service_id IN (SELECT id FROM services WHERE category='data_warehouse') AND (instance_type ILIKE '%Kafka%' OR instance_type ILIKE '%Kinesis%' OR instance_type ILIKE '%Event%' OR instance_type ILIKE '%Pub/Sub%');`;
  console.log('Done.');
  process.exit(0);
}
run();
