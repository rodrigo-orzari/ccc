'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef, useDeferredValue } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { ProductType, PricingRecord } from '@/types';
import {
  ProductTypeSelector,
  ProviderCards,
  TableToolbar,
  PricingTable,
  FilterSidebar,
  Footer,
} from '@/components';
import {
  GEOGRAPHIES, OS_TYPES, CPU_PROFILES, CATEGORIES,
  DB_FAMILIES, DB_ENGINES, DEPLOYMENT_TYPES, HA_MODES,
  SERVERLESS_LANGUAGES, SERVERLESS_COLD_START_OPTIONS, SERVERLESS_TIMEOUT_OPTIONS,
  SERVERLESS_MEMORY_CONFIG_OPTIONS, SERVERLESS_FREE_TIER_OPTIONS, SERVERLESS_GRANULARITY_OPTIONS,
  SERVERLESS_EXECUTION_MODEL_OPTIONS, SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS, SERVERLESS_EPHEMERAL_STORAGE_OPTIONS,
  CONTAINERS_ORCHESTRATORS, CONTAINERS_COMPUTE_TYPES, CONTAINERS_ARCHITECTURES, CONTAINERS_BILLING_GRANULARITY,
  NETWORKING_SERVICES, NETWORKING_CONNECTION_TYPES, NETWORKING_ROUTING_TYPES,
  NETWORKING_HA_SUPPORT, NETWORKING_VPC_SUPPORT, NETWORKING_DIRECTIONS,
  ANALYTICS_ENGINES, ANALYTICS_DEPLOYMENT_TYPES, ANALYTICS_TIERS,
  PROVIDERS,
} from '@/config';

export default function Dashboard() {
  const [activeProductType, setActiveProductType] = useState<ProductType>('vm');

  // Filter state
  const [selectedProviders, setSelectedProviders] = useState<string[]>(PROVIDERS.filter(p => !p.soon).map(p => p.id));
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([...GEOGRAPHIES]);
  const [selectedOS, setSelectedOS] = useState<string[]>([...OS_TYPES]);
  const [selectedCpu, setSelectedCpu] = useState<string[]>(CPU_PROFILES.map(p => p.id));
  const [selectedCategory, setSelectedCategory] = useState<string[]>([...CATEGORIES]);
  const [gpuIncluded, setGpuIncluded] = useState(false);

  const [selectedDbFamilies, setSelectedDbFamilies] = useState<string[]>([...DB_FAMILIES]);
  const [selectedEngines, setSelectedEngines] = useState<string[]>([...DB_ENGINES]);
  const [selectedDeploymentTypes, setSelectedDeploymentTypes] = useState<string[]>([...DEPLOYMENT_TYPES]);
  const [selectedHaModes, setSelectedHaModes] = useState<string[]>([...HA_MODES]);

  const [selectedServerlessLanguages, setSelectedServerlessLanguages] = useState<string[]>([...SERVERLESS_LANGUAGES]);
  const [selectedServerlessColdStart, setSelectedServerlessColdStart] = useState<string[]>([...SERVERLESS_COLD_START_OPTIONS]);
  const [selectedServerlessTimeout, setSelectedServerlessTimeout] = useState<string[]>([...SERVERLESS_TIMEOUT_OPTIONS]);
  const [selectedServerlessMemoryConfig, setSelectedServerlessMemoryConfig] = useState<string[]>([...SERVERLESS_MEMORY_CONFIG_OPTIONS]);
  const [selectedServerlessFreeTier, setSelectedServerlessFreeTier] = useState<string[]>([...SERVERLESS_FREE_TIER_OPTIONS]);
  const [selectedServerlessGranularity, setSelectedServerlessGranularity] = useState<string[]>([...SERVERLESS_GRANULARITY_OPTIONS]);
  const [selectedServerlessExecutionModel, setSelectedServerlessExecutionModel] = useState<string[]>([...SERVERLESS_EXECUTION_MODEL_OPTIONS]);
  const [selectedServerlessProvisionedConcurrency, setSelectedServerlessProvisionedConcurrency] = useState<string[]>([...SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS]);
  const [selectedServerlessEphemeralStorage, setSelectedServerlessEphemeralStorage] = useState<string[]>([...SERVERLESS_EPHEMERAL_STORAGE_OPTIONS]);

  const [selectedContainersOrchestrators, setSelectedContainersOrchestrators] = useState<string[]>([...CONTAINERS_ORCHESTRATORS]);
  const [selectedContainersComputeTypes, setSelectedContainersComputeTypes] = useState<string[]>([...CONTAINERS_COMPUTE_TYPES]);
  const [selectedContainersArchitectures, setSelectedContainersArchitectures] = useState<string[]>([...CONTAINERS_ARCHITECTURES]);
  const [selectedContainersBillingGranularity, setSelectedContainersBillingGranularity] = useState<string[]>([...CONTAINERS_BILLING_GRANULARITY]);
  const [containersGpuIncluded, setContainersGpuIncluded] = useState(false);

  const [selectedAnalyticsEngines, setSelectedAnalyticsEngines] = useState<string[]>([...ANALYTICS_ENGINES]);
  const [selectedAnalyticsDeploymentTypes, setSelectedAnalyticsDeploymentTypes] = useState<string[]>([...ANALYTICS_DEPLOYMENT_TYPES]);
  const [selectedAnalyticsTiers, setSelectedAnalyticsTiers] = useState<string[]>([...ANALYTICS_TIERS]);

  const [selectedNetworkingServices, setSelectedNetworkingServices] = useState<string[]>([...NETWORKING_SERVICES]);
  const [selectedNetworkingConnectionTypes, setSelectedNetworkingConnectionTypes] = useState<string[]>([...NETWORKING_CONNECTION_TYPES]);
  const [selectedNetworkingRoutingTypes, setSelectedNetworkingRoutingTypes] = useState<string[]>([...NETWORKING_ROUTING_TYPES]);
  const [selectedNetworkingHaSupport, setSelectedNetworkingHaSupport] = useState<string[]>([...NETWORKING_HA_SUPPORT]);
  const [selectedNetworkingVpcSupport, setSelectedNetworkingVpcSupport] = useState<string[]>([...NETWORKING_VPC_SUPPORT]);
  const [selectedNetworkingDirections, setSelectedNetworkingDirections] = useState<string[]>([...NETWORKING_DIRECTIONS]);

  // Range filters
  const DEFAULT_VCPU_RANGE = { min: 0, max: 192 };
  const DEFAULT_MEMORY_RANGE = { min: 0, max: 6144 };
  const DEFAULT_PRICE_RANGE = { min: 0, max: 20 };

  const [vCpuRange, setVCpuRange] = useState({ ...DEFAULT_VCPU_RANGE });
  const [memoryRange, setMemoryRange] = useState({ ...DEFAULT_MEMORY_RANGE });
  const [priceRange, setPriceRange] = useState({ ...DEFAULT_PRICE_RANGE });
  const [search, setSearch] = useState('');
  const [showAggregation, setShowAggregation] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PricingRecord | string; direction: 'asc' | 'desc' }>({
    key: 'price_per_unit',
    direction: 'asc',
  });

  // UI state
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

  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [isInitialFetch, setIsInitialFetch] = useState(true);

  const toggleSection = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Build search params
  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    params.append('product', activeProductType);
    params.append('geography', selectedGeographies.join(','));
    params.append('os', selectedOS.join(','));
    params.append('cpu', selectedCpu.join(','));
    params.append('category', selectedCategory.join(','));
    params.append('gpu', gpuIncluded.toString());
    params.append('dbFamilies', selectedDbFamilies.join(','));
    params.append('engines', selectedEngines.join(','));
    params.append('deploymentTypes', selectedDeploymentTypes.join(','));
    params.append('haModes', selectedHaModes.join(','));
    params.append('serverlessLanguages', selectedServerlessLanguages.join(','));
    params.append('serverlessColdStart', selectedServerlessColdStart.join(','));
    params.append('serverlessTimeout', selectedServerlessTimeout.join(','));
    params.append('serverlessMemoryConfig', selectedServerlessMemoryConfig.join(','));
    params.append('serverlessFreeTier', selectedServerlessFreeTier.join(','));
    params.append('serverlessGranularity', selectedServerlessGranularity.join(','));
    params.append('serverlessExecutionModel', selectedServerlessExecutionModel.join(','));
    params.append('serverlessProvisionedConcurrency', selectedServerlessProvisionedConcurrency.join(','));
    params.append('serverlessEphemeralStorage', selectedServerlessEphemeralStorage.join(','));
    params.append('containersOrchestrators', selectedContainersOrchestrators.join(','));
    params.append('containersComputeTypes', selectedContainersComputeTypes.join(','));
    params.append('containersArchitectures', selectedContainersArchitectures.join(','));
    params.append('containersBillingGranularity', selectedContainersBillingGranularity.join(','));
    params.append('containersGpuIncluded', containersGpuIncluded.toString());
    params.append('analyticsEngines', selectedAnalyticsEngines.join(','));
    params.append('analyticsDeploymentTypes', selectedAnalyticsDeploymentTypes.join(','));
    params.append('analyticsTiers', selectedAnalyticsTiers.join(','));
    params.append('networkingService', selectedNetworkingServices.join(','));
    params.append('networkingConnectionTypes', selectedNetworkingConnectionTypes.join(','));
    params.append('networkingRoutingTypes', selectedNetworkingRoutingTypes.join(','));
    params.append('networkingHaSupport', selectedNetworkingHaSupport.join(','));
    params.append('networkingVpcSupport', selectedNetworkingVpcSupport.join(','));
    params.append('networkingTransferDirections', selectedNetworkingDirections.join(','));
    params.append('minVcpu', vCpuRange.min.toString());
    params.append('maxVcpu', vCpuRange.max.toString());
    params.append('minMemory', memoryRange.min.toString());
    params.append('maxMemory', memoryRange.max.toString());
    params.append('minPrice', priceRange.min.toString());
    params.append('maxPrice', priceRange.max.toString());
    params.append('search', search);
    return params;
  }, [
    activeProductType, selectedGeographies, selectedOS, selectedCpu, selectedCategory, gpuIncluded,
    selectedDbFamilies, selectedEngines, selectedDeploymentTypes, selectedHaModes,
    selectedServerlessLanguages, selectedServerlessColdStart, selectedServerlessTimeout, selectedServerlessMemoryConfig, selectedServerlessFreeTier,
    selectedServerlessGranularity, selectedServerlessExecutionModel, selectedServerlessProvisionedConcurrency, selectedServerlessEphemeralStorage,
    selectedContainersOrchestrators, selectedContainersComputeTypes, selectedContainersArchitectures, selectedContainersBillingGranularity, containersGpuIncluded,
    selectedAnalyticsEngines, selectedAnalyticsDeploymentTypes, selectedAnalyticsTiers,
    selectedNetworkingServices, selectedNetworkingConnectionTypes, selectedNetworkingRoutingTypes, selectedNetworkingHaSupport, selectedNetworkingVpcSupport, selectedNetworkingDirections,
    vCpuRange, memoryRange, priceRange, search
  ]);

  const debouncedParamsString = useDeferredValue(searchParams.toString());

  const canFetch = useMemo(() => {
    if (selectedProviders.length === 0 || selectedGeographies.length === 0) return false;
    if (activeProductType === 'vm' && (selectedOS.length === 0 || selectedCpu.length === 0 || selectedCategory.length === 0)) return false;
    if (activeProductType === 'database' && (selectedDbFamilies.length === 0 || selectedEngines.length === 0 || selectedDeploymentTypes.length === 0 || selectedHaModes.length === 0)) return false;
    return true;
  }, [debouncedParamsString, selectedProviders, selectedGeographies, activeProductType]);

  // Queries
  const { data: dbStatus } = useQuery({
    queryKey: ['health', debouncedParamsString],
    queryFn: async () => {
      const res = await fetch(`/api/health?${debouncedParamsString}`);
      const status = await res.json();
      return { total: status.total_records || 0, providers: status.by_provider || [], lastUpdated: status.last_updated || null };
    },
    enabled: canFetch,
    placeholderData: keepPreviousData,
  });

  const { data: rawProviderCounts } = useQuery({
    queryKey: ['counts', debouncedParamsString],
    queryFn: async () => {
      const res = await fetch(`/api/pricing/counts?${debouncedParamsString}`);
      return res.json();
    },
    enabled: canFetch,
    placeholderData: keepPreviousData,
  });

  const providerCounts = useMemo(() => {
    if (!rawProviderCounts || !Array.isArray(rawProviderCounts)) return {};
    const map: Record<string, number> = {};
    rawProviderCounts.forEach(r => { map[r.slug] = parseInt(r.count) || 0; });
    return map;
  }, [rawProviderCounts]);

  const pricingParamsString = useMemo(() => {
    const p = new URLSearchParams(debouncedParamsString);
    p.append('provider', selectedProviders.join(','));
    if (showAggregation) p.append('aggregate', 'true');
    return p.toString();
  }, [debouncedParamsString, selectedProviders, showAggregation]);

  const { data: rawData, isFetching: loading } = useQuery({
    queryKey: ['pricing', pricingParamsString],
    queryFn: async () => {
      const res = await fetch(`/api/pricing?${pricingParamsString}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      return Array.isArray(json) ? json : [];
    },
    enabled: canFetch,
    placeholderData: keepPreviousData,
  });

  const data = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];
    return [...rawData].sort((a, b) => {
      const key = sortConfig.key as string;
      const direction = sortConfig.direction;
      let valA: any = '';
      let valB: any = '';

      if (key.includes('.')) {
        const parts = key.split('.');
        valA = a[parts[0] as keyof PricingRecord]?.[parts[1]] ?? '';
        valB = b[parts[0] as keyof PricingRecord]?.[parts[1]] ?? '';
      } else {
        valA = a[key as keyof PricingRecord] ?? '';
        valB = b[key as keyof PricingRecord] ?? '';
      }

      const numericKeys = ['vcpus', 'memory_gb', 'price_per_unit', 'avg_price', 'min_price', 'max_price'];
      if (numericKeys.includes(key)) {
        valA = parseFloat(valA.toString().replace(/[^0-9.-]+/g, "")) || 0;
        valB = parseFloat(valB.toString().replace(/[^0-9.-]+/g, "")) || 0;
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rawData, sortConfig]);

  const totalFilteredCount = useMemo(() => {
    return selectedProviders.reduce((sum, providerId) => sum + (providerCounts[providerId] || 0), 0);
  }, [selectedProviders, providerCounts]);

  // Table scroll detection
  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;

    const update = () => {
      const overflow = el.scrollWidth > el.clientWidth + 1;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      setHasHorizontalOverflow(overflow);
      setScrolledToEnd(atEnd);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [data.length, activeProductType]);

  const handleHeaderClick = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Export logic
  const handleExport = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    let headers: string[] = ['Provider', 'SKU', 'Geography', 'Price (USD)', 'Source'];
    if (activeProductType === 'database') {
      headers = ['Provider', 'SKU', 'Engine', 'Tier', 'Deployment', 'HA Mode', 'Geography', 'Price (USD)', 'Source'];
    } else if (activeProductType === 'serverless') {
      headers = ['Provider', 'SKU', 'Languages', 'Cold Start (ms)', 'Timeout (sec)', 'Memory Config', 'Free Tier', 'Granularity', 'Execution Model', 'Provisioned Concurrency', 'Max Storage (GB)', 'Invocation Price ($/1M)', 'Geography', 'Price (USD)', 'Source'];
    } else if (activeProductType === 'containers') {
      headers = ['Provider', 'SKU', 'Orchestrator', 'Compute Type', 'Architecture', 'Billing Granularity', 'GPU', 'Geography', 'Price (USD)', 'Source'];
    } else if (activeProductType === 'networking') {
      headers = ['Provider', 'SKU', 'Service', 'Category', 'Transfer Tier', 'Destination', 'Included Transfer', 'Geography', 'Price (USD)', 'Source'];
    } else if (activeProductType === 'data-analytics') {
      headers = ['Provider', 'SKU', 'Engine', 'Deployment Type', 'Tier', 'Compute Unit', 'Geography', 'Price (USD)', 'Source'];
    } else {
      headers = ['Provider', 'SKU', 'Category', 'CPU Vendor', 'Architecture', 'OS', 'GPU', 'vCPU', 'Memory (GB)', 'Geography', 'Price (USD)', 'Source'];
    }

    const rows = data.map(record => {
      const priceDisplay = showAggregation ? (parseFloat(record.price_per_unit) * 8760).toFixed(2) : parseFloat(record.price_per_unit).toFixed(4);

      if (activeProductType === 'database') {
        return [record.provider, record.instance_type, record.attributes?.engine || '', record.category || '', record.attributes?.deployment_type || '', record.attributes?.ha_mode || '', record.geography, priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
      } else if (activeProductType === 'serverless') {
        return [record.provider, record.instance_type, record.attributes?.supportedLanguages ? (Array.isArray(record.attributes.supportedLanguages) ? record.attributes.supportedLanguages.join('; ') : record.attributes.supportedLanguages) : '', record.attributes?.cold_start_overhead_ms || '', record.attributes?.timeout_seconds || '', record.attributes?.memory_configuration || '', record.attributes?.free_invocations_per_month ? 'Yes' : 'No', record.attributes?.billing_granularity_ms || '', record.attributes?.execution_model || '', record.attributes?.provisioned_concurrency_support || '', record.attributes?.max_ephemeral_storage_gb || '', record.attributes?.invocation_price_per_1m || '', record.geography, priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
      } else if (activeProductType === 'containers') {
        return [record.provider, record.instance_type, record.attributes?.orchestrator || '', record.attributes?.compute_type || '', record.attributes?.architecture || '', record.attributes?.billing_granularity || '', record.gpu_count > 0 ? 'Yes' : 'No', record.geography, priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
      } else if (activeProductType === 'networking') {
        return [record.provider, record.instance_type, record.service || '', record.category || '', record.attributes?.transfer_tier || '', record.attributes?.destination || '', record.attributes?.included_transfer || '', record.geography, priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
      } else if (activeProductType === 'data-analytics') {
        return [record.provider, record.instance_type, record.attributes?.engine || '', record.attributes?.deployment_type || '', record.attributes?.tier || '', record.vcpus || '', record.geography, priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
      } else {
        return [record.provider, record.instance_type, record.category || '', record.cpu_vendor || '', record.arch === 'x86 64' ? 'x86' : (record.arch || ''), record.os || '', record.gpu_count > 0 ? 'Yes' : 'No', record.vcpus || '', record.memory_gb || '', record.geography, priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
      }
    });

    const csvContent = [headers.map(h => `"${h}"`).join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.setAttribute('href', url);
    link.setAttribute('download', `cloud-pricing-${activeProductType}-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#000000] text-[#171717] dark:text-[#e5e7eb] font-sans overflow-hidden transition-colors duration-300">
      <ProductTypeSelector activeProductType={activeProductType} onProductTypeChange={setActiveProductType} />

      <div className="flex flex-1 overflow-hidden">
        <FilterSidebar
          activeProductType={activeProductType}
          selectedProviders={selectedProviders}
          selectedGeographies={selectedGeographies}
          selectedOS={selectedOS}
          selectedCpu={selectedCpu}
          selectedCategory={selectedCategory}
          gpuIncluded={gpuIncluded}
          selectedDbFamilies={selectedDbFamilies}
          selectedEngines={selectedEngines}
          selectedDeploymentTypes={selectedDeploymentTypes}
          selectedHaModes={selectedHaModes}
          selectedServerlessLanguages={selectedServerlessLanguages}
          selectedServerlessColdStart={selectedServerlessColdStart}
          selectedServerlessTimeout={selectedServerlessTimeout}
          selectedServerlessMemoryConfig={selectedServerlessMemoryConfig}
          selectedServerlessFreeTier={selectedServerlessFreeTier}
          selectedServerlessGranularity={selectedServerlessGranularity}
          selectedServerlessExecutionModel={selectedServerlessExecutionModel}
          selectedServerlessProvisionedConcurrency={selectedServerlessProvisionedConcurrency}
          selectedServerlessEphemeralStorage={selectedServerlessEphemeralStorage}
          selectedContainersOrchestrators={selectedContainersOrchestrators}
          selectedContainersComputeTypes={selectedContainersComputeTypes}
          selectedContainersArchitectures={selectedContainersArchitectures}
          selectedContainersBillingGranularity={selectedContainersBillingGranularity}
          containersGpuIncluded={containersGpuIncluded}
          selectedAnalyticsEngines={selectedAnalyticsEngines}
          selectedAnalyticsDeploymentTypes={selectedAnalyticsDeploymentTypes}
          selectedAnalyticsTiers={selectedAnalyticsTiers}
          selectedNetworkingServices={selectedNetworkingServices}
          selectedNetworkingConnectionTypes={selectedNetworkingConnectionTypes}
          selectedNetworkingRoutingTypes={selectedNetworkingRoutingTypes}
          selectedNetworkingHaSupport={selectedNetworkingHaSupport}
          selectedNetworkingVpcSupport={selectedNetworkingVpcSupport}
          selectedNetworkingDirections={selectedNetworkingDirections}
          vCpuRange={vCpuRange}
          memoryRange={memoryRange}
          priceRange={priceRange}
          showAggregation={showAggregation}
          expanded={expanded}
          onProviderToggle={(p) => toggleFilter(selectedProviders, setSelectedProviders, p)}
          onGeographyToggle={(g) => toggleFilter(selectedGeographies, setSelectedGeographies, g)}
          onOsToggle={(o) => toggleFilter(selectedOS, setSelectedOS, o)}
          onCpuToggle={(c) => toggleFilter(selectedCpu, setSelectedCpu, c)}
          onCategoryToggle={(c) => toggleFilter(selectedCategory, setSelectedCategory, c)}
          onGpuToggle={setGpuIncluded}
          onDbFamilyToggle={(f) => toggleFilter(selectedDbFamilies, setSelectedDbFamilies, f)}
          onEngineToggle={(e) => toggleFilter(selectedEngines, setSelectedEngines, e)}
          onDeploymentTypeToggle={(d) => toggleFilter(selectedDeploymentTypes, setSelectedDeploymentTypes, d)}
          onHaModeToggle={(h) => toggleFilter(selectedHaModes, setSelectedHaModes, h)}
          onServerlessLanguageToggle={(l) => toggleFilter(selectedServerlessLanguages, setSelectedServerlessLanguages, l)}
          onServerlessColdStartToggle={(o) => toggleFilter(selectedServerlessColdStart, setSelectedServerlessColdStart, o)}
          onServerlessTimeoutToggle={(t) => toggleFilter(selectedServerlessTimeout, setSelectedServerlessTimeout, t)}
          onServerlessMemoryConfigToggle={(m) => toggleFilter(selectedServerlessMemoryConfig, setSelectedServerlessMemoryConfig, m)}
          onServerlessFreeTierToggle={(f) => toggleFilter(selectedServerlessFreeTier, setSelectedServerlessFreeTier, f)}
          onServerlessGranularityToggle={(g) => toggleFilter(selectedServerlessGranularity, setSelectedServerlessGranularity, g)}
          onServerlessExecutionModelToggle={(e) => toggleFilter(selectedServerlessExecutionModel, setSelectedServerlessExecutionModel, e)}
          onServerlessProvisionedConcurrencyToggle={(p) => toggleFilter(selectedServerlessProvisionedConcurrency, setSelectedServerlessProvisionedConcurrency, p)}
          onServerlessEphemeralStorageToggle={(e) => toggleFilter(selectedServerlessEphemeralStorage, setSelectedServerlessEphemeralStorage, e)}
          onContainersOrchestratorToggle={(o) => toggleFilter(selectedContainersOrchestrators, setSelectedContainersOrchestrators, o)}
          onContainersComputeTypeToggle={(c) => toggleFilter(selectedContainersComputeTypes, setSelectedContainersComputeTypes, c)}
          onContainersArchitectureToggle={(a) => toggleFilter(selectedContainersArchitectures, setSelectedContainersArchitectures, a)}
          onContainersBillingGranularityToggle={(b) => toggleFilter(selectedContainersBillingGranularity, setSelectedContainersBillingGranularity, b)}
          onContainersGpuToggle={setContainersGpuIncluded}
          onAnalyticsEngineToggle={(e) => toggleFilter(selectedAnalyticsEngines, setSelectedAnalyticsEngines, e)}
          onAnalyticsDeploymentTypeToggle={(d) => toggleFilter(selectedAnalyticsDeploymentTypes, setSelectedAnalyticsDeploymentTypes, d)}
          onAnalyticsTierToggle={(t) => toggleFilter(selectedAnalyticsTiers, setSelectedAnalyticsTiers, t)}
          onNetworkingServiceToggle={(s) => toggleFilter(selectedNetworkingServices, setSelectedNetworkingServices, s)}
          onNetworkingConnectionTypeToggle={(c) => toggleFilter(selectedNetworkingConnectionTypes, setSelectedNetworkingConnectionTypes, c)}
          onNetworkingRoutingTypeToggle={(r) => toggleFilter(selectedNetworkingRoutingTypes, setSelectedNetworkingRoutingTypes, r)}
          onNetworkingHaSupportToggle={(h) => toggleFilter(selectedNetworkingHaSupport, setSelectedNetworkingHaSupport, h)}
          onNetworkingVpcSupportToggle={(v) => toggleFilter(selectedNetworkingVpcSupport, setSelectedNetworkingVpcSupport, v)}
          onNetworkingDirectionToggle={(d) => toggleFilter(selectedNetworkingDirections, setSelectedNetworkingDirections, d)}
          onSetProviders={setSelectedProviders}
          onSetGeographies={setSelectedGeographies}
          onSetOS={setSelectedOS}
          onSetCpu={setSelectedCpu}
          onSetCategory={setSelectedCategory}
          onSetDbFamilies={setSelectedDbFamilies}
          onSetEngines={setSelectedEngines}
          onSetDeploymentTypes={setSelectedDeploymentTypes}
          onSetHaModes={setSelectedHaModes}
          onSetServerlessLanguages={setSelectedServerlessLanguages}
          onSetServerlessColdStart={setSelectedServerlessColdStart}
          onSetServerlessTimeout={setSelectedServerlessTimeout}
          onSetServerlessMemoryConfig={setSelectedServerlessMemoryConfig}
          onSetServerlessFreeTier={setSelectedServerlessFreeTier}
          onSetServerlessGranularity={setSelectedServerlessGranularity}
          onSetServerlessExecutionModel={setSelectedServerlessExecutionModel}
          onSetServerlessProvisionedConcurrency={setSelectedServerlessProvisionedConcurrency}
          onSetServerlessEphemeralStorage={setSelectedServerlessEphemeralStorage}
          onSetContainersOrchestrators={setSelectedContainersOrchestrators}
          onSetContainersComputeTypes={setSelectedContainersComputeTypes}
          onSetContainersArchitectures={setSelectedContainersArchitectures}
          onSetContainersBillingGranularity={setSelectedContainersBillingGranularity}
          onSetAnalyticsEngines={setSelectedAnalyticsEngines}
          onSetAnalyticsDeploymentTypes={setSelectedAnalyticsDeploymentTypes}
          onSetAnalyticsTiers={setSelectedAnalyticsTiers}
          onSetNetworkingServices={setSelectedNetworkingServices}
          onSetNetworkingConnectionTypes={setSelectedNetworkingConnectionTypes}
          onSetNetworkingRoutingTypes={setSelectedNetworkingRoutingTypes}
          onSetNetworkingHaSupport={setSelectedNetworkingHaSupport}
          onSetNetworkingVpcSupport={setSelectedNetworkingVpcSupport}
          onSetNetworkingDirections={setSelectedNetworkingDirections}
          onVCpuRangeChange={setVCpuRange}
          onMemoryRangeChange={setMemoryRange}
          onPriceRangeChange={setPriceRange}
          onShowAggregationChange={setShowAggregation}
          onToggleSection={toggleSection}
        />

        <main className="flex-1 min-w-0 overflow-hidden flex flex-col bg-white dark:bg-[#000000]">
          <ProviderCards
            providers={PROVIDERS}
            selectedProviders={selectedProviders}
            providerCounts={providerCounts}
            dbStatusProviders={dbStatus?.providers}
            isInitialFetch={isInitialFetch}
            onProviderSelect={(providerId) => {
              const activeNonSoon = PROVIDERS.filter(p => !p.soon).map(p => p.id);
              if (selectedProviders.includes(providerId) && selectedProviders.length === 1) {
                setSelectedProviders(activeNonSoon);
              } else {
                setSelectedProviders([providerId]);
              }
            }}
          />

          <TableToolbar
            totalFilteredCount={totalFilteredCount}
            dataLength={data.length}
            search={search}
            onSearchChange={setSearch}
            onExport={handleExport}
          />

          <PricingTable
            data={data}
            loading={loading}
            activeProductType={activeProductType}
            showAggregation={showAggregation}
            tableScrollRef={tableScrollRef}
            hasHorizontalOverflow={hasHorizontalOverflow}
            scrolledToEnd={scrolledToEnd}
            sortConfig={sortConfig}
            onHeaderClick={handleHeaderClick}
          />
        </main>
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @supports not selector(::-webkit-scrollbar) {
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #737373 #d4d4d4;
          }
          @media (prefers-color-scheme: dark) {
            .custom-scrollbar {
              scrollbar-color: #a3a3a3 #262626;
            }
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 14px !important;
          height: 14px !important;
          -webkit-appearance: none !important;
          background: #d4d4d4 !important;
        }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar { background: #262626 !important; }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #d4d4d4 !important;
          border-top: 1px solid #a3a3a3 !important;
          border-left: 1px solid #a3a3a3 !important;
        }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #262626 !important;
            border-top: 1px solid #404040 !important;
            border-left: 1px solid #404040 !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #737373 !important;
          border-radius: 7px !important;
          border: 2px solid #d4d4d4 !important;
          min-width: 40px !important;
          min-height: 40px !important;
        }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #a3a3a3 !important;
            border: 2px solid #262626 !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #525252 !important; }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4d4d4 !important; }
        }
        .custom-scrollbar::-webkit-scrollbar-corner { background: #d4d4d4 !important; }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-corner { background: #262626 !important; }
        }
        .scroll-fade-right {
          position: relative;
        }
        .scroll-fade-right::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 100%;
          pointer-events: none;
          background: linear-gradient(to right, rgba(255,255,255,0), rgba(0,0,0,0.12));
          z-index: 5;
        }
        @media (prefers-color-scheme: dark) {
          .scroll-fade-right::after {
            background: linear-gradient(to right, rgba(0,0,0,0), rgba(255,255,255,0.18));
          }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="range"].absolute {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
        }
        input[type="range"].absolute::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          border: 1px solid #d4d4d4;
        }
        .dark input[type="range"].absolute::-webkit-slider-thumb {
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          border: 1px solid #404040;
        }
        input[type="range"].absolute::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: auto;
          border: 1px solid #d4d4d4;
        }
        .dark input[type="range"].absolute::-moz-range-thumb {
          border: 1px solid #404040;
        }
        .slider-input-min {
          z-index: 30;
        }
        .slider-input-max {
          z-index: 20;
        }
      `}} />
    </div>
  );
}
