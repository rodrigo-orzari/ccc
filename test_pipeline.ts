import { AWSRDSAdapter } from './src/services/database_pipeline';
import { AzureAdapter } from './src/services/pricing_pipeline';

async function test() {
  const rds = new AWSRDSAdapter();
  await rds.fetchPricing();
  
  const azure = new AzureAdapter();
  await azure.fetchPricing();
}

test().catch(console.error);
