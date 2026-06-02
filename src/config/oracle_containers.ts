/**
 * Oracle Containers Pricing Configuration (Static Fallback)
 *
 * Example prices for OCI Container Instances and Oracle Kubernetes Engine (OKE)
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

const baseOracleContainerEntries = [
  // OCI Container Instances (Serverless Containers)
  { type: 'Container-Instance-A1', vcpus: 1, memory: 6, cpuVendor: 'Ampere', price: 0.015, orchestrator: 'Serverless', compute_type: 'Serverless', architecture: 'ARM64', billing_granularity: 'Per Second' },
  { type: 'Container-Instance-E4', vcpus: 1, memory: 8, cpuVendor: 'AMD', price: 0.025, orchestrator: 'Serverless', compute_type: 'Serverless', architecture: 'x86_64', billing_granularity: 'Per Second' },

  // OKE (Kubernetes Provisioned)
  { type: 'OKE-VM.Standard.A1.Flex', vcpus: 2, memory: 12, cpuVendor: 'Ampere', price: 0.03, orchestrator: 'Kubernetes', compute_type: 'Provisioned', architecture: 'ARM64', billing_granularity: 'Per Second' },
  { type: 'OKE-VM.Standard.E4.Flex', vcpus: 2, memory: 16, cpuVendor: 'AMD', price: 0.05, orchestrator: 'Kubernetes', compute_type: 'Provisioned', architecture: 'x86_64', billing_granularity: 'Per Second' },
];

export const ORACLE_CONTAINERS = baseOracleContainerEntries.map(addContainerAttributes);

export const ORACLE_CONTAINERS_REGION = 'us-ashburn-1';
export const ORACLE_CONTAINERS_GEOGRAPHY = 'N. America';
