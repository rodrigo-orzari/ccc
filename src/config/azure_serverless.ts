/**
 * Azure Functions Pricing Configuration (Fallback)
 *
 * Pricing as of May 2026 (Consumption Plan)
 * Execution: $0.000016 per GB-second
 * Free tier: 1M executions + 400K GB-seconds per month
 *
 * Memory tiers from 128MB to 1792MB (typical allocations)
 * Premium plans available but not shown here
 */

export const AZURE_SERVERLESS = [
  // 128MB tier
  {
    type: 'Functions-128MB-Consumption',
    vcpus: 1,
    memory: 0.128,
    cpuVendor: 'Intel',
    price: 0.000016 * 3600 * 0.128,
  },

  // 256MB tier
  {
    type: 'Functions-256MB-Consumption',
    vcpus: 1,
    memory: 0.256,
    cpuVendor: 'Intel',
    price: 0.000016 * 3600 * 0.256,
  },

  // 512MB tier
  {
    type: 'Functions-512MB-Consumption',
    vcpus: 1,
    memory: 0.512,
    cpuVendor: 'Intel',
    price: 0.000016 * 3600 * 0.512,
  },

  // 1GB tier
  {
    type: 'Functions-1GB-Consumption',
    vcpus: 1,
    memory: 1,
    cpuVendor: 'Intel',
    price: 0.000016 * 3600 * 1,
  },

  // 1.5GB tier
  {
    type: 'Functions-1536MB-Consumption',
    vcpus: 1,
    memory: 1.5,
    cpuVendor: 'Intel',
    price: 0.000016 * 3600 * 1.5,
  },

  // 1.75GB tier (Azure max for consumption plan)
  {
    type: 'Functions-1792MB-Consumption',
    vcpus: 1,
    memory: 1.75,
    cpuVendor: 'Intel',
    price: 0.000016 * 3600 * 1.75,
  },
];

export const AZURE_SERVERLESS_REGION = 'eastus';
export const AZURE_SERVERLESS_GEOGRAPHY = 'N. America';
