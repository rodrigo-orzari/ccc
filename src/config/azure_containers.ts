/**
 * Azure Containers Pricing Configuration (Static Fallback)
 *
 * Example prices for Azure Container Instances (ACI) and Azure Kubernetes Service (AKS)
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

const baseAzureContainerEntries = [
  // ACI (Serverless Containers)
  { type: 'ACI-1vCPU-1GB-x86', vcpus: 1, memory: 1, cpuVendor: 'Intel', price: 0.046, orchestrator: 'Serverless', compute_type: 'Serverless', architecture: 'x86_64', billing_granularity: 'Per Second' },
  { type: 'ACI-2vCPU-4GB-x86', vcpus: 2, memory: 4, cpuVendor: 'Intel', price: 0.106, orchestrator: 'Serverless', compute_type: 'Serverless', architecture: 'x86_64', billing_granularity: 'Per Second' },

  // AKS (Kubernetes Provisioned)
  { type: 'AKS-Standard_D2s_v3', vcpus: 2, memory: 8, cpuVendor: 'Intel', price: 0.096, orchestrator: 'Kubernetes', compute_type: 'Provisioned', architecture: 'x86_64', billing_granularity: 'Per Second' },
  { type: 'AKS-Standard_D2ps_v5', vcpus: 2, memory: 8, cpuVendor: 'Ampere', price: 0.076, orchestrator: 'Kubernetes', compute_type: 'Provisioned', architecture: 'ARM64', billing_granularity: 'Per Second' },
];

export const AZURE_CONTAINERS = baseAzureContainerEntries.map(addContainerAttributes);

export const AZURE_CONTAINERS_REGION = 'eastus';
export const AZURE_CONTAINERS_GEOGRAPHY = 'N. America';
