import { OracleAdapter, DigitalOceanAdapter } from './src/services/pricing_pipeline';
import { IntegrationPricingPipeline } from './src/services/integration_pipeline';

async function run() {
  console.log("=== Validating Compute Pipeline ===");
  const oracleAdapter = new OracleAdapter();
  const oracleRecords = await oracleAdapter.fetchPricing();
  
  const oracleGPUs = oracleRecords.filter(r => r.category === 'GPU instance');
  console.log(`Found ${oracleGPUs.length} Oracle GPU instances`);
  if (oracleGPUs.length > 0) {
    console.log(oracleGPUs.slice(0, 3));
  }

  const doAdapter = new DigitalOceanAdapter();
  const doRecords = await doAdapter.fetchPricing();
  const doGPUs = doRecords.filter(r => r.category === 'GPU instance');
  console.log(`Found ${doGPUs.length} DigitalOcean GPU instances`);
  if (doGPUs.length > 0) {
    console.log(doGPUs);
  }

  console.log("\n=== Validating Integration Pipeline ===");
  // We can just import ALIBABA_INTEGRATION since integration_pipeline just reads static config
  const { ALIBABA_INTEGRATION } = require('./src/config/integration');

  const alibabaWorkflow = ALIBABA_INTEGRATION.filter((r: any) => r.attributes?.service_type === 'Workflow');
  console.log(`Found ${alibabaWorkflow.length} Alibaba Workflow components`);
  if (alibabaWorkflow.length > 0) {
    console.log(alibabaWorkflow);
  }
}

run().catch(console.error);
