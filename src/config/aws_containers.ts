/**
 * AWS Containers Pricing Configuration (Static Fallback)
 *
 * Example prices for Fargate and EKS
 */

const addContainerAttributes = (entry: any) => ({
  ...entry,
  attributes: {
    orchestrator: entry.orchestrator,
    compute_type: entry.compute_type,
    architecture: entry.architecture,
    billing_granularity: entry.billing_granularity,
  }
});

const baseAwsContainerEntries = [
  // Fargate (Serverless Containers)
  { type: 'Fargate-1vCPU-2GB-x86', vcpus: 1, memory: 2, cpuVendor: 'Intel', price: 0.04048, orchestrator: 'Serverless', compute_type: 'Serverless', architecture: 'x86_64', billing_granularity: 'Per Second' },
  { type: 'Fargate-1vCPU-2GB-ARM', vcpus: 1, memory: 2, cpuVendor: 'AWS', price: 0.03238, orchestrator: 'Serverless', compute_type: 'Serverless', architecture: 'ARM64', billing_granularity: 'Per Second' },

  // EKS (Kubernetes Provisioned)
  { type: 'EKS-m5.large', vcpus: 2, memory: 8, cpuVendor: 'Intel', price: 0.096, orchestrator: 'Kubernetes', compute_type: 'Provisioned', architecture: 'x86_64', billing_granularity: 'Per Second' },
  { type: 'EKS-m6g.large', vcpus: 2, memory: 8, cpuVendor: 'AWS', price: 0.077, orchestrator: 'Kubernetes', compute_type: 'Provisioned', architecture: 'ARM64', billing_granularity: 'Per Second' },
];

export const AWS_CONTAINERS = baseAwsContainerEntries.map(addContainerAttributes);

export const AWS_CONTAINERS_REGION = 'us-east-1';
export const AWS_CONTAINERS_GEOGRAPHY = 'N. America';
