export const AWS_SERVERLESS = [
  {
    type: 'Lambda-x86',
    vcpus: 1, // Normalized to 1 for basic comparison
    memory: 1, // 1 GB execution memory
    cpuVendor: 'Intel',
    price: 0.0000166667 * 3600, // $0.0000166667 per GB-second -> GB-hour
  },
  {
    type: 'Lambda-ARM',
    vcpus: 1,
    memory: 1,
    cpuVendor: 'AWS',
    price: 0.0000133334 * 3600, // $0.0000133334 per GB-second -> GB-hour
  },
];
export const AWS_SERVERLESS_REGION = 'us-east-1';
export const AWS_SERVERLESS_GEOGRAPHY = 'N. America';
