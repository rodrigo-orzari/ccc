/**
 * DigitalOcean Containers Pricing Configuration (Static Fallback)
 *
 * Example prices for App Platform and DigitalOcean Kubernetes (DOKS)
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

const baseDigitaloceanContainerEntries = [
  // App Platform (Serverless Containers)
  { type: 'AppPlatform-Pro-1vCPU-1GB', vcpus: 1, memory: 1, cpuVendor: 'Intel', price: 0.033, orchestrator: 'Serverless', compute_type: 'Serverless', architecture: 'x86_64', billing_granularity: 'Per Second' },
  { type: 'AppPlatform-Pro-2vCPU-4GB', vcpus: 2, memory: 4, cpuVendor: 'Intel', price: 0.083, orchestrator: 'Serverless', compute_type: 'Serverless', architecture: 'x86_64', billing_granularity: 'Per Second' },

  // DOKS (Kubernetes Provisioned)
  { type: 'DOKS-s-2vcpu-4gb', vcpus: 2, memory: 4, cpuVendor: 'Intel', price: 0.033, orchestrator: 'Kubernetes', compute_type: 'Provisioned', architecture: 'x86_64', billing_granularity: 'Per Hour' },
  { type: 'DOKS-s-4vcpu-8gb', vcpus: 4, memory: 8, cpuVendor: 'Intel', price: 0.066, orchestrator: 'Kubernetes', compute_type: 'Provisioned', architecture: 'x86_64', billing_granularity: 'Per Hour' },
];

export const DIGITALOCEAN_CONTAINERS = baseDigitaloceanContainerEntries.map(addContainerAttributes);

export const DIGITALOCEAN_CONTAINERS_REGION = 'nyc3';
export const DIGITALOCEAN_CONTAINERS_GEOGRAPHY = 'N. America';
