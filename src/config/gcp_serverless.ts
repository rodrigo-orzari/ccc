export const GCP_SERVERLESS = [
  {
    type: 'CloudRun-CPU-Allocated',
    vcpus: 1,
    memory: 1,
    cpuVendor: 'Intel',
    // CPU: $0.00002400/vCPU-sec, Memory: $0.00000250/GB-sec
    price: (0.00002400 * 3600) + (0.00000250 * 3600), 
  },
];
export const GCP_SERVERLESS_REGION = 'us-central1';
export const GCP_SERVERLESS_GEOGRAPHY = 'N. America';
