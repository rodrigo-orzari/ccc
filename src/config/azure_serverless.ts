export const AZURE_SERVERLESS = [
  {
    type: 'Functions-Consumption',
    vcpus: 1,
    memory: 1,
    cpuVendor: 'Intel',
    price: 0.000016 * 3600, // $0.000016 per GB-sec -> GB-hour
  },
];
export const AZURE_SERVERLESS_REGION = 'eastus';
export const AZURE_SERVERLESS_GEOGRAPHY = 'N. America';
