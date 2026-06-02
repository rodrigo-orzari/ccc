/**
 * GCP Containers Pricing Configuration (Static Fallback)
 *
 * Example prices for Google Cloud Run and Google Kubernetes Engine (GKE)
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

const baseGcpContainerEntries = [
  // Cloud Run (Serverless Containers)
  { type: 'CloudRun-1vCPU-1GB-x86', vcpus: 1, memory: 1, cpuVendor: 'Intel', price: 0.0864, orchestrator: 'Serverless', compute_type: 'Serverless', architecture: 'x86_64', billing_granularity: '100ms' },
  { type: 'CloudRun-2vCPU-4GB-x86', vcpus: 2, memory: 4, cpuVendor: 'Intel', price: 0.1872, orchestrator: 'Serverless', compute_type: 'Serverless', architecture: 'x86_64', billing_granularity: '100ms' },

  // GKE (Kubernetes Provisioned)
  { type: 'GKE-e2-standard-2', vcpus: 2, memory: 8, cpuVendor: 'Intel', price: 0.067, orchestrator: 'Kubernetes', compute_type: 'Provisioned', architecture: 'x86_64', billing_granularity: 'Per Second' },
  { type: 'GKE-t2a-standard-2', vcpus: 2, memory: 8, cpuVendor: 'Ampere', price: 0.062, orchestrator: 'Kubernetes', compute_type: 'Provisioned', architecture: 'ARM64', billing_granularity: 'Per Second' },
];

export const GCP_CONTAINERS = baseGcpContainerEntries.map(addContainerAttributes);

export const GCP_CONTAINERS_REGION = 'us-central1';
export const GCP_CONTAINERS_GEOGRAPHY = 'N. America';
