import { PricingPipeline } from './src/services/pricing_pipeline';
import { IntegrationPricingPipeline } from './src/services/integration_pipeline';

// Mock saveRecords to prevent DB connection errors
PricingPipeline.prototype.saveRecords = async function(records) {
  return records;
};

async function run() {
  console.log("=== Validating Compute Pipeline ===");
  const computePipeline = new PricingPipeline();
  // We can't just get records from run() because run() might return nothing or undefined if saveRecords returns void.
  // Wait, let's see what PricingPipeline.run() returns. If it returns void, we can extract from saveRecords.
}

run().catch(console.error);
