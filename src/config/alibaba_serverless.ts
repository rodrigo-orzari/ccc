export const ALIBABA_SERVERLESS_REGION = 'ap-southeast-1';
export const ALIBABA_SERVERLESS_GEOGRAPHY = 'Asia Pacific';

export const ALIBABA_SERVERLESS = [
  {
    type: 'Function Compute (vCPU)',
    vcpus: 1,
    memory: 0,
    cpuVendor: 'Intel',
    price: 0.000014, // 0.000014 per vCPU-second = ~$0.05 per vCPU-hour
    unit: 'vCPU-Second',
    supportedLanguages: ['Node', 'Python', 'Java', 'Go', '.NET', 'Custom Runtime'],
    attributes: {
      execution_environment: 'Container',
      billing_granularity: '1ms',
      concurrency: 'Multiple requests per instance',
      vpc_support: 'Yes'
    }
  },
  {
    type: 'Function Compute (Memory)',
    vcpus: 0,
    memory: 1,
    cpuVendor: 'Intel',
    price: 0.0000015, // 0.0000015 per GB-second = ~$0.0054 per GB-hour
    unit: 'GB-Second',
    supportedLanguages: ['Node', 'Python', 'Java', 'Go', '.NET', 'Custom Runtime'],
    attributes: {
      execution_environment: 'Container',
      billing_granularity: '1ms',
      concurrency: 'Multiple requests per instance',
      vpc_support: 'Yes'
    }
  }
];
