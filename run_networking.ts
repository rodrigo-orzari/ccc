import postgres from 'postgres';
import { NetworkingPricingPipeline } from './src/services/networking_pipeline.ts';

const sql = postgres(process.env.DATABASE_URL || 'postgresql://doadmin:AVNS_6wU4YV6n7SjN3xGj7U2@db-postgresql-ccc-do-user-16521473-0.k.db.ondigitalocean.com:25060/defaultdb?sslmode=require');
const pipeline = new NetworkingPricingPipeline(sql);
pipeline.run().then(() => {
  console.log('Done');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
