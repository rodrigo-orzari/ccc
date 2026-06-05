import { useState } from 'react';

const CONTAINERS_ORCHESTRATORS = ['Kubernetes', 'Serverless', 'Docker'];
const CONTAINERS_COMPUTE_TYPES = ['Serverless', 'Provisioned'];
const CONTAINERS_ARCHITECTURES = ['x86_64', 'ARM64'];
const CONTAINERS_BILLING_GRANULARITY = ['Per Second', 'Per Hour'];

/**
 * Containers-specific filter state
 */
export function useContainersFilters() {
  const [selectedContainersOrchestrators, setSelectedContainersOrchestrators] = useState<string[]>([...CONTAINERS_ORCHESTRATORS]);
  const [selectedContainersComputeTypes, setSelectedContainersComputeTypes] = useState<string[]>([...CONTAINERS_COMPUTE_TYPES]);
  const [selectedContainersArchitectures, setSelectedContainersArchitectures] = useState<string[]>([...CONTAINERS_ARCHITECTURES]);
  const [selectedContainersBillingGranularity, setSelectedContainersBillingGranularity] = useState<string[]>([...CONTAINERS_BILLING_GRANULARITY]);
  const [containersGpuIncluded, setContainersGpuIncluded] = useState(true);

  return {
    selectedContainersOrchestrators,
    setSelectedContainersOrchestrators,
    selectedContainersComputeTypes,
    setSelectedContainersComputeTypes,
    selectedContainersArchitectures,
    setSelectedContainersArchitectures,
    selectedContainersBillingGranularity,
    setSelectedContainersBillingGranularity,
    containersGpuIncluded,
    setContainersGpuIncluded,
  };
}
