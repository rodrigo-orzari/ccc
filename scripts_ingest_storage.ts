// One-off: run the storage pipeline to populate the DB. Delete after running.
import sql from './src/lib/db.ts';
import { StoragePricingPipeline } from './src/services/storage_pipeline.ts';

async function main() {
  const pipeline = new StoragePricingPipeline(sql as any);
  const results = await pipeline.run();
  console.log('RESULTS:', JSON.stringify(results.map((r: any) => ({ provider: r.provider, status: r.status, count: r.count, msg: r.message })), null, 1));
  await sql.end();
}
main().catch((e) => { console.error('ERR', e); process.exit(1); });
