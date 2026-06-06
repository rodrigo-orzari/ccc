import { useState } from 'react';

/**
 * Shared filter state used across all product types
 */
export function useSharedFilters() {
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['aws', 'azure', 'gcp', 'oracle', 'digitalocean']);
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>(['N. America', 'S. America', 'W. Europe', 'N. Europe', 'Mid East & Africa', 'Asia Pacific', 'Australia']);
  const [vCpuRange, setVCpuRange] = useState({ min: 0, max: 320 });
  const [memoryRange, setMemoryRange] = useState({ min: 0, max: 3200 });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [search, setSearch] = useState('');
  const [showAggregation, setShowAggregation] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'price_per_unit',
    direction: 'asc',
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    provider: true,
    pricing: true,
    category: true,
    geography: true,
    os: true,
    cpu: true,
    specs: true,
    dbFamily: true,
    engine: true,
    deploymentType: true,
    haMode: true,
    languages: true,
    coldStart: true,
    timeout: true,
    memoryConfig: true,
    freeTier: true,
    granularity: true,
    executionModel: true,
    provisionedConcurrency: true,
    ephemeralStorage: true,
    containersOrchestrator: true,
    containersComputeType: true,
    containersArchitecture: true,
    containersBillingGranularity: true,
    networkingService: true,
    networkingConnectionType: true,
    networkingRoutingType: true,
    networkingHaSupport: true,
    networkingVpcSupport: true,
    networkingTransferDirection: true,
  });

  return {
    selectedProviders,
    setSelectedProviders,
    selectedGeographies,
    setSelectedGeographies,
    vCpuRange,
    setVCpuRange,
    memoryRange,
    setMemoryRange,
    priceRange,
    setPriceRange,
    search,
    setSearch,
    showAggregation,
    setShowAggregation,
    sortConfig,
    setSortConfig,
    expanded,
    setExpanded,
  };
}
