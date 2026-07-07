'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef, useDeferredValue } from 'react';
import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { ProductType, PricingRecord } from '@/types';
import {
  ProductTypeSelector,
  ProviderCards,
  TableToolbar,
  PricingTable,
  FilterSidebar,
  Footer,
  ChartsView,
} from '@/components';
import { useDynamicFilters } from '@/hooks/useDynamicFilters';
import * as staticConfig from '@/config';

export default function Dashboard() {
  const config = useDynamicFilters();
  const [activeProductType, setActiveProductType] = useState<ProductType>('ai');

  // Initialize from URL query param if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const product = params.get('product');
      if (product) {
        // Handle the mapping from 'compute' back to 'vm'
        setActiveProductType(product === 'compute' ? 'vm' : product as ProductType);
      }
    }
  }, []);

  const [filtersSynced, setFiltersSynced] = useState(false);
  useEffect(() => {
    if (config.isLoading || filtersSynced) return;

    // When the dynamic (DB-derived) filter config finishes loading, replace any
    // filter group that is STILL at its full static default with the dynamic list.
    // A group counts as "untouched by the user" when its length equals the static
    // default's length. Each entry is [ currentSelection, setter, staticDefaultLen,
    // () => dynamicValue ]; the value is a thunk so it's only built when applied
    // (identical lazy behavior to the old per-line `if`s).
    const syncGroups: Array<[string[], (v: string[]) => void, number, () => string[]]> = [
      [selectedGeographies, setSelectedGeographies, staticConfig.GEOGRAPHIES.length, () => [...config.GEOGRAPHIES]],
      [selectedOS, setSelectedOS, staticConfig.OS_TYPES.length, () => [...config.OS_TYPES]],
      [selectedCpu, setSelectedCpu, staticConfig.CPU_PROFILES.length, () => [...config.CPU_PROFILES.map(p => p.id)]],
      [selectedCategory, setSelectedCategory, staticConfig.CATEGORIES.length, () => [...config.CATEGORIES]],
      [selectedPricingModels, setSelectedPricingModels, staticConfig.PRICING_MODELS.length, () => ['On-Demand']],
      [selectedDbFamilies, setSelectedDbFamilies, staticConfig.DB_FAMILIES.length, () => [...config.DB_FAMILIES]],
      [selectedEngines, setSelectedEngines, staticConfig.DB_ENGINES.length, () => [...config.DB_ENGINES]],
      [selectedDeploymentTypes, setSelectedDeploymentTypes, staticConfig.DEPLOYMENT_TYPES.length, () => [...config.DEPLOYMENT_TYPES]],
      [selectedHaModes, setSelectedHaModes, staticConfig.HA_MODES.length, () => [...config.HA_MODES]],
      [selectedServerlessLanguages, setSelectedServerlessLanguages, staticConfig.SERVERLESS_LANGUAGES.length, () => [...config.SERVERLESS_LANGUAGES]],
      [selectedServerlessColdStart, setSelectedServerlessColdStart, staticConfig.SERVERLESS_COLD_START_OPTIONS.length, () => [...config.SERVERLESS_COLD_START_OPTIONS]],
      [selectedServerlessTimeout, setSelectedServerlessTimeout, staticConfig.SERVERLESS_TIMEOUT_OPTIONS.length, () => [...config.SERVERLESS_TIMEOUT_OPTIONS]],
      [selectedServerlessMemoryConfig, setSelectedServerlessMemoryConfig, staticConfig.SERVERLESS_MEMORY_CONFIG_OPTIONS.length, () => [...config.SERVERLESS_MEMORY_CONFIG_OPTIONS]],
      [selectedServerlessFreeTier, setSelectedServerlessFreeTier, staticConfig.SERVERLESS_FREE_TIER_OPTIONS.length, () => [...config.SERVERLESS_FREE_TIER_OPTIONS]],
      [selectedServerlessGranularity, setSelectedServerlessGranularity, staticConfig.SERVERLESS_GRANULARITY_OPTIONS.length, () => [...config.SERVERLESS_GRANULARITY_OPTIONS]],
      [selectedServerlessExecutionModel, setSelectedServerlessExecutionModel, staticConfig.SERVERLESS_EXECUTION_MODEL_OPTIONS.length, () => [...config.SERVERLESS_EXECUTION_MODEL_OPTIONS]],
      [selectedServerlessProvisionedConcurrency, setSelectedServerlessProvisionedConcurrency, staticConfig.SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS.length, () => [...config.SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS]],
      [selectedServerlessEphemeralStorage, setSelectedServerlessEphemeralStorage, staticConfig.SERVERLESS_EPHEMERAL_STORAGE_OPTIONS.length, () => [...config.SERVERLESS_EPHEMERAL_STORAGE_OPTIONS]],
      [selectedServerlessMemory, setSelectedServerlessMemory, staticConfig.SERVERLESS_MEMORY_TIERS.length, () => [...config.SERVERLESS_MEMORY_TIERS]],
      [selectedServerlessArchitectures, setSelectedServerlessArchitectures, staticConfig.SERVERLESS_ARCHITECTURES.length, () => [...config.SERVERLESS_ARCHITECTURES]],
      [selectedContainersOrchestrators, setSelectedContainersOrchestrators, staticConfig.CONTAINERS_ORCHESTRATORS.length, () => [...config.CONTAINERS_ORCHESTRATORS]],
      [selectedContainersComputeTypes, setSelectedContainersComputeTypes, staticConfig.CONTAINERS_COMPUTE_TYPES.length, () => [...config.CONTAINERS_COMPUTE_TYPES]],
      [selectedContainersArchitectures, setSelectedContainersArchitectures, staticConfig.CONTAINERS_ARCHITECTURES.length, () => [...config.CONTAINERS_ARCHITECTURES]],
      [selectedContainersBillingGranularity, setSelectedContainersBillingGranularity, staticConfig.CONTAINERS_BILLING_GRANULARITY.length, () => [...config.CONTAINERS_BILLING_GRANULARITY]],
      [selectedAnalyticsEngines, setSelectedAnalyticsEngines, staticConfig.ANALYTICS_ENGINES.length, () => [...config.ANALYTICS_ENGINES]],
      [selectedAnalyticsDeploymentTypes, setSelectedAnalyticsDeploymentTypes, staticConfig.ANALYTICS_DEPLOYMENT_TYPES.length, () => [...config.ANALYTICS_DEPLOYMENT_TYPES]],
      [selectedAnalyticsTiers, setSelectedAnalyticsTiers, staticConfig.ANALYTICS_TIERS.length, () => [...config.ANALYTICS_TIERS]],
      [selectedAiServiceTypes, setSelectedAiServiceTypes, staticConfig.AI_SERVICE_TYPES.length, () => [...config.AI_SERVICE_TYPES]],
      [selectedAiModelTiers, setSelectedAiModelTiers, staticConfig.AI_MODEL_TIERS.length, () => [...config.AI_MODEL_TIERS]],
      [selectedAiContextWindows, setSelectedAiContextWindows, staticConfig.AI_CONTEXT_WINDOWS.length, () => [...config.AI_CONTEXT_WINDOWS]],
      [selectedAiMultimodalOptions, setSelectedAiMultimodalOptions, staticConfig.AI_MULTIMODAL_OPTIONS.length, () => [...config.AI_MULTIMODAL_OPTIONS]],
      [selectedNetworkingServices, setSelectedNetworkingServices, staticConfig.NETWORKING_SERVICES.length, () => [...config.NETWORKING_SERVICES]],
      [selectedSecurityServices, setSelectedSecurityServices, staticConfig.SECURITY_SERVICES.length, () => [...config.SECURITY_SERVICES]],
      [selectedNetworkingConnectionTypes, setSelectedNetworkingConnectionTypes, staticConfig.NETWORKING_CONNECTION_TYPES.length, () => [...config.NETWORKING_CONNECTION_TYPES]],
      [selectedNetworkingRoutingTypes, setSelectedNetworkingRoutingTypes, staticConfig.NETWORKING_ROUTING_TYPES.length, () => [...config.NETWORKING_ROUTING_TYPES]],
      [selectedNetworkingHaSupport, setSelectedNetworkingHaSupport, staticConfig.NETWORKING_HA_SUPPORT.length, () => [...config.NETWORKING_HA_SUPPORT]],
      [selectedNetworkingVpcSupport, setSelectedNetworkingVpcSupport, staticConfig.NETWORKING_VPC_SUPPORT.length, () => [...config.NETWORKING_VPC_SUPPORT]],
      [selectedNetworkingDirections, setSelectedNetworkingDirections, staticConfig.NETWORKING_DIRECTIONS.length, () => [...config.NETWORKING_DIRECTIONS]],
      [selectedNetworkingBillingModels, setSelectedNetworkingBillingModels, staticConfig.NETWORKING_BILLING_MODELS.length, () => [...config.NETWORKING_BILLING_MODELS]],
      [selectedNetworkingUsageTiers, setSelectedNetworkingUsageTiers, staticConfig.NETWORKING_USAGE_TIERS.length, () => [...config.NETWORKING_USAGE_TIERS]],
      [selectedNetworkingPortCapacities, setSelectedNetworkingPortCapacities, staticConfig.NETWORKING_PORT_CAPACITIES.length, () => [...config.NETWORKING_PORT_CAPACITIES]],
      [selectedNetworkingTransferScopes, setSelectedNetworkingTransferScopes, staticConfig.NETWORKING_TRANSFER_SCOPES.length, () => [...config.NETWORKING_TRANSFER_SCOPES]],
      [selectedStorageCategories, setSelectedStorageCategories, staticConfig.STORAGE_CATEGORIES.length, () => [...config.STORAGE_CATEGORIES]],
      [selectedStorageRedundancies, setSelectedStorageRedundancies, staticConfig.STORAGE_REDUNDANCIES.length, () => [...config.STORAGE_REDUNDANCIES]],
      [selectedStorageMedia, setSelectedStorageMedia, staticConfig.STORAGE_MEDIA.length, () => [...config.STORAGE_MEDIA]],
      [selectedStorageTiers, setSelectedStorageTiers, staticConfig.STORAGE_TIERS.length, () => [...config.STORAGE_TIERS]],
      [selectedAppHostingTiers, setSelectedAppHostingTiers, staticConfig.APP_HOSTING_TIERS.length, () => [...config.APP_HOSTING_TIERS]],
      [selectedAppHostingComputeTypes, setSelectedAppHostingComputeTypes, staticConfig.APP_HOSTING_COMPUTE_TYPES.length, () => [...config.APP_HOSTING_COMPUTE_TYPES]],
      [selectedServerlessServiceTypes, setSelectedServerlessServiceTypes, staticConfig.SERVERLESS_SERVICE_TYPES.length, () => [...config.SERVERLESS_SERVICE_TYPES]],
    ];

    for (const [current, setter, staticLen, next] of syncGroups) {
      if (current.length === staticLen) setter(next());
    }

    setFiltersSynced(true);
  }, [config.isLoading, filtersSynced, config]);

  const [viewMode, setViewMode] = useState<'table' | 'charts'>('table');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter state
  const [selectedProviders, setSelectedProviders] = useState<string[]>(staticConfig.providersForType('ai').filter(p => !p.soon).map(p => p.id));
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([...config.GEOGRAPHIES]);
  const [selectedOS, setSelectedOS] = useState<string[]>([...config.OS_TYPES]);
  const [selectedCpu, setSelectedCpu] = useState<string[]>(config.CPU_PROFILES.map(p => p.id));
  const [selectedCategory, setSelectedCategory] = useState<string[]>([...config.CATEGORIES]);
  const [selectedPricingModels, setSelectedPricingModels] = useState<string[]>(['On-Demand']);
  const [selectedGpu, setSelectedGpu] = useState<string[]>(['GPU', 'No GPU']);

  const [selectedDbFamilies, setSelectedDbFamilies] = useState<string[]>([...config.DB_FAMILIES]);
  const [selectedEngines, setSelectedEngines] = useState<string[]>([...config.DB_ENGINES]);
  const [selectedDeploymentTypes, setSelectedDeploymentTypes] = useState<string[]>([...config.DEPLOYMENT_TYPES]);
  const [selectedHaModes, setSelectedHaModes] = useState<string[]>([...config.HA_MODES]);

  // When the category changes, reconcile the selected providers to only those
  // applicable to the new category. Keeps any still-valid prior selection, drops
  // providers that don't belong here (e.g. OpenAI when leaving AI), and auto-selects
  // the niche providers that are exclusive to the new category (e.g. vector DBs on
  // Databases, OpenAI/Anthropic on AI).
  useEffect(() => {
    const applicable = staticConfig.providersForType(activeProductType);
    const applicableIds = applicable.map(p => p.id);
    const applicableNonSoon = applicable.filter(p => !p.soon).map(p => p.id);
    const nicheForType = applicableNonSoon.filter(id => staticConfig.PROVIDER_CATEGORY_SCOPE[id]);
    setSelectedProviders(prev => {
      const kept = prev.filter(p => applicableIds.includes(p));
      const merged = Array.from(new Set([...kept, ...nicheForType]));
      return merged.length > 0 ? merged : applicableNonSoon;
    });
  }, [activeProductType]);

  const [selectedServerlessLanguages, setSelectedServerlessLanguages] = useState<string[]>([...config.SERVERLESS_LANGUAGES]);
  const [selectedServerlessColdStart, setSelectedServerlessColdStart] = useState<string[]>([...config.SERVERLESS_COLD_START_OPTIONS]);
  const [selectedServerlessTimeout, setSelectedServerlessTimeout] = useState<string[]>([...config.SERVERLESS_TIMEOUT_OPTIONS]);
  const [selectedServerlessMemoryConfig, setSelectedServerlessMemoryConfig] = useState<string[]>([...config.SERVERLESS_MEMORY_CONFIG_OPTIONS]);
  const [selectedServerlessFreeTier, setSelectedServerlessFreeTier] = useState<string[]>([...config.SERVERLESS_FREE_TIER_OPTIONS]);
  const [selectedServerlessGranularity, setSelectedServerlessGranularity] = useState<string[]>([...config.SERVERLESS_GRANULARITY_OPTIONS]);
  const [selectedServerlessExecutionModel, setSelectedServerlessExecutionModel] = useState<string[]>([...config.SERVERLESS_EXECUTION_MODEL_OPTIONS]);
  const [selectedServerlessProvisionedConcurrency, setSelectedServerlessProvisionedConcurrency] = useState<string[]>([...config.SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS]);
  const [selectedServerlessEphemeralStorage, setSelectedServerlessEphemeralStorage] = useState<string[]>([...config.SERVERLESS_EPHEMERAL_STORAGE_OPTIONS]);
  const [selectedServerlessMemory, setSelectedServerlessMemory] = useState<string[]>([...config.SERVERLESS_MEMORY_TIERS]);
  const [selectedServerlessArchitectures, setSelectedServerlessArchitectures] = useState<string[]>([...config.SERVERLESS_ARCHITECTURES]);

  const [selectedContainersOrchestrators, setSelectedContainersOrchestrators] = useState<string[]>([...config.CONTAINERS_ORCHESTRATORS]);
  const [selectedContainersComputeTypes, setSelectedContainersComputeTypes] = useState<string[]>([...config.CONTAINERS_COMPUTE_TYPES]);
  const [selectedContainersArchitectures, setSelectedContainersArchitectures] = useState<string[]>([...config.CONTAINERS_ARCHITECTURES]);
  const [selectedContainersBillingGranularity, setSelectedContainersBillingGranularity] = useState<string[]>([...config.CONTAINERS_BILLING_GRANULARITY]);
  const [containersGpuIncluded, setContainersGpuIncluded] = useState(true);

  const [selectedAnalyticsEngines, setSelectedAnalyticsEngines] = useState<string[]>([...config.ANALYTICS_ENGINES]);
  const [selectedAnalyticsDeploymentTypes, setSelectedAnalyticsDeploymentTypes] = useState<string[]>([...config.ANALYTICS_DEPLOYMENT_TYPES]);
  const [selectedAnalyticsTiers, setSelectedAnalyticsTiers] = useState<string[]>([...config.ANALYTICS_TIERS]);

  // AI
  const [selectedAiServiceTypes, setSelectedAiServiceTypes] = useState<string[]>([...config.AI_SERVICE_TYPES]);
  const [selectedAiModelTiers, setSelectedAiModelTiers] = useState<string[]>([...config.AI_MODEL_TIERS]);
  const [selectedAiContextWindows, setSelectedAiContextWindows] = useState<string[]>([...config.AI_CONTEXT_WINDOWS]);
  const [selectedAiMultimodalOptions, setSelectedAiMultimodalOptions] = useState<string[]>([...config.AI_MULTIMODAL_OPTIONS]);

  const [selectedNetworkingServices, setSelectedNetworkingServices] = useState<string[]>([...config.NETWORKING_SERVICES]);
  const [selectedSecurityServices, setSelectedSecurityServices] = useState<string[]>([...config.SECURITY_SERVICES]);
  const [selectedNetworkingConnectionTypes, setSelectedNetworkingConnectionTypes] = useState<string[]>([...config.NETWORKING_CONNECTION_TYPES]);
  const [selectedNetworkingRoutingTypes, setSelectedNetworkingRoutingTypes] = useState<string[]>([...config.NETWORKING_ROUTING_TYPES]);
  const [selectedNetworkingHaSupport, setSelectedNetworkingHaSupport] = useState<string[]>([...config.NETWORKING_HA_SUPPORT]);
  const [selectedNetworkingVpcSupport, setSelectedNetworkingVpcSupport] = useState<string[]>([...config.NETWORKING_VPC_SUPPORT]);
  const [selectedNetworkingDirections, setSelectedNetworkingDirections] = useState<string[]>([...config.NETWORKING_DIRECTIONS]);
  const [selectedNetworkingBillingModels, setSelectedNetworkingBillingModels] = useState<string[]>([...config.NETWORKING_BILLING_MODELS]);
  const [selectedNetworkingUsageTiers, setSelectedNetworkingUsageTiers] = useState<string[]>([...config.NETWORKING_USAGE_TIERS]);
  const [selectedNetworkingPortCapacities, setSelectedNetworkingPortCapacities] = useState<string[]>([...config.NETWORKING_PORT_CAPACITIES]);
  const [selectedNetworkingTransferScopes, setSelectedNetworkingTransferScopes] = useState<string[]>([...config.NETWORKING_TRANSFER_SCOPES]);

  const [selectedStorageCategories, setSelectedStorageCategories] = useState<string[]>([...config.STORAGE_CATEGORIES]);
  const [selectedStorageRedundancies, setSelectedStorageRedundancies] = useState<string[]>([...config.STORAGE_REDUNDANCIES]);
  const [selectedStorageMedia, setSelectedStorageMedia] = useState<string[]>([...config.STORAGE_MEDIA]);
  const [selectedStorageTiers, setSelectedStorageTiers] = useState<string[]>([...config.STORAGE_TIERS]);

  const [selectedAppHostingTiers, setSelectedAppHostingTiers] = useState<string[]>([...config.APP_HOSTING_TIERS]);
  const [selectedAppHostingComputeTypes, setSelectedAppHostingComputeTypes] = useState<string[]>([...config.APP_HOSTING_COMPUTE_TYPES]);


  const [selectedServerlessServiceTypes, setSelectedServerlessServiceTypes] = useState<string[]>([...config.SERVERLESS_SERVICE_TYPES]);



  // Range filters
      
  const [vCpuRange, setVCpuRange] = useState({ ...config.DEFAULT_VCPU_RANGE });
  const [memoryRange, setMemoryRange] = useState({ ...config.DEFAULT_MEMORY_RANGE });
  const [serverlessVCpuRange, setServerlessVCpuRange] = useState({ ...config.DEFAULT_SERVERLESS_VCPU_RANGE });
  const [serverlessMemoryRange, setServerlessMemoryRange] = useState({ ...config.DEFAULT_SERVERLESS_MEMORY_RANGE });
  const [containersVCpuRange, setContainersVCpuRange] = useState({ ...config.DEFAULT_CONTAINERS_VCPU_RANGE });
  const [containersMemoryRange, setContainersMemoryRange] = useState({ ...config.DEFAULT_CONTAINERS_MEMORY_RANGE });
  const [priceRange, setPriceRange] = useState({ ...config.DEFAULT_PRICE_RANGE });
  const [search, setSearch] = useState('');

  // Seed product type / provider / search from URL params so deep links from the
  // workloads pages (and shared URLs) land on a pre-filtered view.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const product = sp.get('product') as ProductType | null;
    if (product && product !== activeProductType) setActiveProductType(product);
    const provider = sp.get('provider');
    if (provider) setSelectedProviders(provider.split(',').filter(Boolean));
    const q = sp.get('search');
    if (q) setSearch(q);
    // Run only on initial mount; subsequent navigations are driven by user state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync core filters to Microsoft Clarity Custom Tags
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as any).clarity === 'function') {
      try {
        (window as any).clarity("set", "product_category", activeProductType);
        (window as any).clarity("set", "providers_compared", selectedProviders.join(','));
        if (search) {
          (window as any).clarity("set", "search_term", search);
        }
      } catch (err) {
        console.warn("Clarity set failed", err);
      }
    }
  }, [activeProductType, selectedProviders, search]);

  const [showAggregation, setShowAggregation] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PricingRecord | string; direction: 'asc' | 'desc' }>({
    key: 'price_per_unit',
    direction: 'asc',
  });

  // UI state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    provider: true,
    category: true,
    geography: true,
    os: true,
    cpu: true,
    gpu: true,
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
    networkingBillingModel: true,
    networkingUsageTier: true,
    networkingPortCapacity: true,
    networkingTransferScope: true,
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
    // API uses 'compute' for VMs; React state uses 'vm'
    params.append('product', activeProductType === 'vm' ? 'compute' : activeProductType);
    // Only send a filter when the user has narrowed it to a STRICT SUBSET of
    // the available options. When every option is selected we OMIT the param
    // entirely so the API applies no filter and returns all matching DB rows —
    // including values the UI doesn't enumerate (e.g. Outpost DB engines,
    // containers with NULL attributes). Sending the full list as an allow-list
    // was silently hiding any DB value not present in the hardcoded UI lists.
    const subset = (name: string, selected: string[], full: readonly string[]) => {
      if (selected.length > 0 && selected.length < full.length) {
        params.append(name, selected.join(','));
      }
    };

    subset('geography', selectedGeographies, config.GEOGRAPHIES);
    subset('os', selectedOS, config.OS_TYPES);
    // Translate CPU profile IDs → vendor names the API understands
    const allVendors = Array.from(new Set(config.CPU_PROFILES.map(p => p.vendor)));
    const selectedVendors = Array.from(new Set(
      selectedCpu
        .map(id => config.CPU_PROFILES.find(p => p.id === id)?.vendor)
        .filter((v): v is string => Boolean(v))
    ));
    subset('cpuVendor', selectedVendors, allVendors);
    subset('category', selectedCategory, config.CATEGORIES);
    subset('pricing_model', selectedPricingModels, config.PRICING_MODELS);
    subset('gpu', selectedGpu, ['GPU', 'No GPU']);
    subset('dbFamilies', selectedDbFamilies, config.DB_FAMILIES);
    subset('engines', selectedEngines, config.DB_ENGINES);
    subset('deploymentTypes', selectedDeploymentTypes, config.DEPLOYMENT_TYPES);
    subset('haModes', selectedHaModes, config.HA_MODES);
    subset('serverlessLanguages', selectedServerlessLanguages, config.SERVERLESS_LANGUAGES);
    subset('serverlessColdStart', selectedServerlessColdStart, config.SERVERLESS_COLD_START_OPTIONS);
    subset('serverlessTimeout', selectedServerlessTimeout, config.SERVERLESS_TIMEOUT_OPTIONS);
    subset('serverlessMemoryConfig', selectedServerlessMemoryConfig, config.SERVERLESS_MEMORY_CONFIG_OPTIONS);
    subset('serverlessFreeTier', selectedServerlessFreeTier, config.SERVERLESS_FREE_TIER_OPTIONS);
    subset('serverlessGranularity', selectedServerlessGranularity, config.SERVERLESS_GRANULARITY_OPTIONS);
    subset('serverlessExecutionModel', selectedServerlessExecutionModel, config.SERVERLESS_EXECUTION_MODEL_OPTIONS);
    subset('serverlessProvisionedConcurrency', selectedServerlessProvisionedConcurrency, config.SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS);
    subset('serverlessEphemeralStorage', selectedServerlessEphemeralStorage, config.SERVERLESS_EPHEMERAL_STORAGE_OPTIONS);
    subset('serverlessMemory', selectedServerlessMemory, config.SERVERLESS_MEMORY_TIERS);
    subset('serverlessArchitecture', selectedServerlessArchitectures, config.SERVERLESS_ARCHITECTURES);
    subset('containersOrchestrators', selectedContainersOrchestrators, config.CONTAINERS_ORCHESTRATORS);
    subset('containersComputeTypes', selectedContainersComputeTypes, config.CONTAINERS_COMPUTE_TYPES);
    subset('containersArchitectures', selectedContainersArchitectures, config.CONTAINERS_ARCHITECTURES);
    subset('containersBillingGranularity', selectedContainersBillingGranularity, config.CONTAINERS_BILLING_GRANULARITY);
    // Boolean toggle: only constrain when GPU containers are excluded.
    if (!containersGpuIncluded) params.append('containersGpuIncluded', 'false');
    subset('analyticsEngines', selectedAnalyticsEngines, config.ANALYTICS_ENGINES);
    subset('analyticsDeploymentTypes', selectedAnalyticsDeploymentTypes, config.ANALYTICS_DEPLOYMENT_TYPES);
    subset('analyticsTiers', selectedAnalyticsTiers, config.ANALYTICS_TIERS);
    subset('aiServiceTypes', selectedAiServiceTypes, config.AI_SERVICE_TYPES);
    subset('aiModelTiers', selectedAiModelTiers, config.AI_MODEL_TIERS);
    subset('aiContextWindows', selectedAiContextWindows, config.AI_CONTEXT_WINDOWS);
    subset('aiMultimodalOptions', selectedAiMultimodalOptions, config.AI_MULTIMODAL_OPTIONS);
    subset('networkingService', selectedNetworkingServices, config.NETWORKING_SERVICES);
    subset('securityService', selectedSecurityServices, config.SECURITY_SERVICES);
    subset('networkingConnectionTypes', selectedNetworkingConnectionTypes, config.NETWORKING_CONNECTION_TYPES);
    subset('networkingRoutingTypes', selectedNetworkingRoutingTypes, config.NETWORKING_ROUTING_TYPES);
    subset('networkingHaSupport', selectedNetworkingHaSupport, config.NETWORKING_HA_SUPPORT);
    subset('networkingVpcSupport', selectedNetworkingVpcSupport, config.NETWORKING_VPC_SUPPORT);
    subset('networkingTransferDirections', selectedNetworkingDirections, config.NETWORKING_DIRECTIONS);
    subset('networkingBillingModels', selectedNetworkingBillingModels, config.NETWORKING_BILLING_MODELS);
    subset('networkingUsageTiers', selectedNetworkingUsageTiers, config.NETWORKING_USAGE_TIERS);
    subset('networkingPortCapacities', selectedNetworkingPortCapacities, config.NETWORKING_PORT_CAPACITIES);
    subset('networkingTransferScopes', selectedNetworkingTransferScopes, config.NETWORKING_TRANSFER_SCOPES);

    subset('storageTypes', selectedStorageCategories, config.STORAGE_CATEGORIES);
    subset('storageRedundancy', selectedStorageRedundancies, config.STORAGE_REDUNDANCIES);
    subset('storageMedia', selectedStorageMedia, config.STORAGE_MEDIA);
    subset('storageTiers', selectedStorageTiers, config.STORAGE_TIERS);

    subset('appHostingTiers', selectedAppHostingTiers, config.APP_HOSTING_TIERS);
    subset('appHostingComputeTypes', selectedAppHostingComputeTypes, config.APP_HOSTING_COMPUTE_TYPES);
    subset('serverlessServiceTypes', selectedServerlessServiceTypes, config.SERVERLESS_SERVICE_TYPES);


    // Only send range params when the user has actively constrained them.
    // At the slider floor/ceiling → no filter applied (show all).
    const currentVCpuDefault = 
      activeProductType === 'serverless' ? config.DEFAULT_SERVERLESS_VCPU_RANGE : 
      activeProductType === 'containers' ? config.DEFAULT_CONTAINERS_VCPU_RANGE : 
      config.DEFAULT_VCPU_RANGE;
    const currentMemoryDefault = 
      activeProductType === 'serverless' ? config.DEFAULT_SERVERLESS_MEMORY_RANGE : 
      activeProductType === 'containers' ? config.DEFAULT_CONTAINERS_MEMORY_RANGE : 
      config.DEFAULT_MEMORY_RANGE;
    const currentVCpuRange = 
      activeProductType === 'serverless' ? serverlessVCpuRange : 
      activeProductType === 'containers' ? containersVCpuRange : 
      vCpuRange;
    const currentMemoryRange = 
      activeProductType === 'serverless' ? serverlessMemoryRange : 
      activeProductType === 'containers' ? containersMemoryRange : 
      memoryRange;

    if (currentVCpuRange.min > currentVCpuDefault.min) params.append('minVcpu', currentVCpuRange.min.toString());
    if (currentVCpuRange.max < currentVCpuDefault.max) params.append('maxVcpu', currentVCpuRange.max.toString());
    if (currentMemoryRange.min > currentMemoryDefault.min) params.append('minMemory', currentMemoryRange.min.toString());
    if (currentMemoryRange.max < currentMemoryDefault.max) params.append('maxMemory', currentMemoryRange.max.toString());
    if (priceRange.min > config.DEFAULT_PRICE_RANGE.min) params.append('minPrice', priceRange.min.toString());
    if (priceRange.max < config.DEFAULT_PRICE_RANGE.max) params.append('maxPrice', priceRange.max.toString());
    params.append('search', search);
    return params;
  }, [
    activeProductType, selectedGeographies, selectedOS, selectedCpu, selectedGpu, selectedCategory, selectedPricingModels,
    selectedDbFamilies, selectedEngines, selectedDeploymentTypes, selectedHaModes,
    selectedServerlessLanguages, selectedServerlessColdStart, selectedServerlessTimeout, selectedServerlessMemoryConfig, selectedServerlessFreeTier,
    selectedServerlessGranularity, selectedServerlessExecutionModel, selectedServerlessProvisionedConcurrency, selectedServerlessEphemeralStorage,
    selectedServerlessMemory, selectedServerlessArchitectures, selectedServerlessServiceTypes,
    selectedContainersOrchestrators, selectedContainersComputeTypes, selectedContainersArchitectures, selectedContainersBillingGranularity, containersGpuIncluded,
    selectedAnalyticsEngines, selectedAnalyticsDeploymentTypes, selectedAnalyticsTiers,
    selectedAiServiceTypes, selectedAiModelTiers, selectedAiContextWindows, selectedAiMultimodalOptions,
    selectedNetworkingServices, selectedNetworkingConnectionTypes, selectedNetworkingRoutingTypes, selectedNetworkingHaSupport, selectedNetworkingVpcSupport, selectedNetworkingDirections,
    selectedNetworkingBillingModels, selectedNetworkingUsageTiers, selectedNetworkingPortCapacities, selectedNetworkingTransferScopes,
    selectedSecurityServices,
    selectedStorageCategories, selectedStorageTiers, selectedStorageRedundancies, selectedStorageMedia,
    vCpuRange, memoryRange, serverlessVCpuRange, serverlessMemoryRange, containersVCpuRange, containersMemoryRange, priceRange, search
  ]);

  const debouncedParamsString = useDeferredValue(searchParams.toString());

  const canFetch = useMemo(() => {
    // Providers are always required
    if (selectedProviders.length === 0) return false;
    // Geography is required for all tabs
    if (selectedGeographies.length === 0) return false;

    if (activeProductType === 'vm' && (
      selectedOS.length === 0 ||
      // CPU and GPU are a combined section — block only when both are completely empty
      (selectedCpu.length === 0 && selectedGpu.length === 0) ||
      selectedCategory.length === 0 ||
      selectedPricingModels.length === 0
    )) return false;

    if (activeProductType === 'database' && (
      selectedDbFamilies.length === 0 ||
      selectedEngines.length === 0 ||
      selectedDeploymentTypes.length === 0 ||
      selectedHaModes.length === 0
    )) return false;

    if (activeProductType === 'data-analytics' && (
      selectedAnalyticsEngines.length === 0 ||
      selectedAnalyticsDeploymentTypes.length === 0 ||
      selectedAnalyticsTiers.length === 0
    )) return false;

    if (activeProductType === 'ai' && (
      selectedAiServiceTypes.length === 0 ||
      selectedAiModelTiers.length === 0 ||
      selectedAiContextWindows.length === 0 ||
      selectedAiMultimodalOptions.length === 0
    )) return false;

    if (activeProductType === 'serverless' && (
      selectedServerlessLanguages.length === 0 ||
      selectedServerlessColdStart.length === 0 ||
      selectedServerlessTimeout.length === 0 ||
      selectedServerlessMemoryConfig.length === 0 ||
      selectedServerlessFreeTier.length === 0 ||
      selectedServerlessGranularity.length === 0 ||
      selectedServerlessExecutionModel.length === 0 ||
      selectedServerlessProvisionedConcurrency.length === 0 ||
      selectedServerlessEphemeralStorage.length === 0 ||
      selectedServerlessMemory.length === 0 ||
      selectedServerlessArchitectures.length === 0 ||
      selectedServerlessServiceTypes.length === 0
    )) return false;

    if (activeProductType === 'containers' && (
      selectedContainersOrchestrators.length === 0 ||
      selectedContainersComputeTypes.length === 0 ||
      selectedContainersArchitectures.length === 0 ||
      selectedContainersBillingGranularity.length === 0
    )) return false;

    if (activeProductType === 'networking' && (
      selectedNetworkingServices.length === 0 ||
      selectedNetworkingConnectionTypes.length === 0 ||
      selectedNetworkingRoutingTypes.length === 0 ||
      selectedNetworkingHaSupport.length === 0 ||
      selectedNetworkingVpcSupport.length === 0 ||
      selectedNetworkingDirections.length === 0
    )) return false;

    if (activeProductType === 'security' && (
      selectedSecurityServices.length === 0
    )) return false;

    if (activeProductType === 'storage' && (
      selectedStorageCategories.length === 0 ||
      selectedStorageTiers.length === 0 ||
      selectedStorageRedundancies.length === 0 ||
      selectedStorageMedia.length === 0
    )) return false;

    if (activeProductType === 'app-hosting' && (
      selectedAppHostingTiers.length === 0 ||
      selectedAppHostingComputeTypes.length === 0
    )) return false;

    return true;
  }, [
    activeProductType,
    selectedProviders, selectedGeographies,
    selectedOS, selectedCpu, selectedGpu, selectedCategory, selectedPricingModels,
    selectedDbFamilies, selectedEngines, selectedDeploymentTypes, selectedHaModes,
    selectedAnalyticsEngines, selectedAnalyticsDeploymentTypes, selectedAnalyticsTiers,
    selectedServerlessLanguages, selectedServerlessColdStart, selectedServerlessTimeout,
    selectedServerlessMemoryConfig, selectedServerlessFreeTier, selectedServerlessGranularity,
    selectedServerlessExecutionModel, selectedServerlessProvisionedConcurrency, selectedServerlessEphemeralStorage,
    selectedServerlessMemory, selectedServerlessArchitectures, selectedServerlessServiceTypes,
    selectedContainersOrchestrators, selectedContainersComputeTypes, selectedContainersArchitectures,
    selectedContainersBillingGranularity,
    selectedNetworkingServices, selectedNetworkingConnectionTypes, selectedNetworkingRoutingTypes,
    selectedNetworkingHaSupport, selectedNetworkingVpcSupport, selectedNetworkingDirections,
    selectedSecurityServices,
    selectedStorageCategories, selectedStorageTiers, selectedStorageRedundancies, selectedStorageMedia,
    selectedAppHostingTiers, selectedAppHostingComputeTypes,
  ]);

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
    if (!canFetch || !rawProviderCounts || !Array.isArray(rawProviderCounts)) return {};
    const map: Record<string, number> = {};
    rawProviderCounts.forEach(r => { map[r.slug] = parseInt(r.count) || 0; });
    return map;
  }, [canFetch, rawProviderCounts]);

  // Flip isInitialFetch off once filter-aware counts first arrive
  useEffect(() => {
    if (rawProviderCounts && Array.isArray(rawProviderCounts) && rawProviderCounts.length > 0) {
      setIsInitialFetch(false);
    }
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
    if (!canFetch || !rawData || rawData.length === 0) return [];
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
  }, [canFetch, rawData, sortConfig]);

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

  const lastUpdated = useMemo(() => {
    if (!rawData || rawData.length === 0) return undefined;
    const maxUpdated = rawData.reduce((max, record) => {
      if (!record.updated_at) return max;
      const recordDate = new Date(record.updated_at);
      return recordDate > max ? recordDate : max;
    }, new Date(0));
    if (maxUpdated.getTime() === 0) return undefined;
    return maxUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }, [rawData]);

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

    let headers: string[] = ['Provider', 'Product', 'Geography', 'Price (USD)', 'Source'];
    if (activeProductType === 'database') {
      headers = ['Provider', 'Product', 'Engine', 'Tier', 'Deployment', 'HA Mode', 'Geography', 'Price (USD)', 'Source'];
    } else if (activeProductType === 'serverless') {
      headers = ['Provider', 'Product', 'Service Type', 'Memory (GB)', 'Architecture', 'Languages', 'Cold Start (ms)', 'Timeout (sec)', 'Memory Config', 'Free Tier', 'Granularity', 'Execution Model', 'Provisioned Concurrency', 'Max Storage (GB)', 'Invocation Price ($/1M)', 'Geography', 'Pricing Unit', 'Price (USD)', 'Source'];
    } else if (activeProductType === 'containers') {
      headers = ['Provider', 'Product', 'Orchestrator', 'Compute Type', 'Architecture', 'Billing Granularity', 'GPU', 'Geography', 'Price (USD)', 'Source'];
    } else if (activeProductType === 'networking') {
      headers = ['Provider', 'Product', 'Service', 'Category', 'Transfer Tier', 'Destination', 'Included Transfer', 'Geography', 'Price (USD)', 'Source'];
    } else if (activeProductType === 'data-analytics') {
      headers = ['Provider', 'Product', 'Engine', 'Deployment Type', 'Tier', 'Compute Unit', 'Geography', 'Price (USD)', 'Source'];
    
    } else if (activeProductType === 'storage') {
      headers = ['Provider', 'Product', 'Category', 'Tier', 'Redundancy', 'Media', 'Geography', 'Price (USD)', 'Source'];
    } else if (activeProductType === 'app-hosting') {
      headers = ['Provider', 'Product', 'Tier', 'Compute Type', 'OS', 'Geography', 'vCPU', 'Memory (GB)', 'Price (USD)', 'Source'];
    } else if (activeProductType === 'ai') {
      headers = ['Provider', 'Product', 'Service', 'Model Tier', 'Context Window', 'Multimodal', 'Geography', 'Input Price (/1M)', 'Output Price (/1M)', 'Source'];
    } else {
      headers = ['Provider', 'Product', 'Category', 'CPU Vendor', 'Architecture', 'OS', 'GPU', 'vCPU', 'Memory (GB)', 'Geography', 'Price (USD)', 'Source'];
    }

    const rows = data.map(record => {
      const priceDisplay = showAggregation ? (parseFloat(record.price_per_unit) * 8760).toFixed(2) : parseFloat(record.price_per_unit).toFixed(4);

      if (activeProductType === 'database') {
        return [record.provider, record.instance_type, record.attributes?.engine || '', record.category || '', record.attributes?.deployment_type || '', record.attributes?.ha_mode || '', record.geography, priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
      } else if (activeProductType === 'serverless') {
        const svcType = record.attributes?.service_type || 'Compute';
        const isCompute = svcType === 'Compute';
        const rawPrice = parseFloat(record.price_per_unit).toFixed(4);
        return [record.provider, record.instance_type, svcType, isCompute ? (record.memory_gb || '') : '', isCompute ? (record.arch === 'x86 64' ? 'x86' : (record.arch || '')) : '', record.attributes?.supportedLanguages ? (Array.isArray(record.attributes.supportedLanguages) ? record.attributes.supportedLanguages.join('; ') : record.attributes.supportedLanguages) : '', record.attributes?.cold_start_overhead_ms || '', record.attributes?.timeout_seconds || '', record.attributes?.memory_configuration || '', isCompute ? (record.attributes?.free_invocations_per_month ? 'Yes' : 'No') : '', record.attributes?.billing_granularity_ms || '', record.attributes?.execution_model || '', record.attributes?.provisioned_concurrency_support || '', record.attributes?.max_ephemeral_storage_gb || '', record.attributes?.invocation_price_per_1m || '', record.geography, record.unit || '', rawPrice, record.data_source === 'static_config' ? 'Static' : 'API'];
      } else if (activeProductType === 'containers') {
        return [record.provider, record.instance_type, record.attributes?.orchestrator || '', record.attributes?.compute_type || '', record.attributes?.architecture || '', record.attributes?.billing_granularity || '', record.gpu_count > 0 ? 'Yes' : 'No', record.geography, priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
      } else if (activeProductType === 'networking') {
        return [record.provider, record.instance_type, record.service || '', record.category || '', record.attributes?.transfer_tier || '', record.attributes?.destination || '', record.attributes?.included_transfer || '', record.geography, priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
      } else if (activeProductType === 'data-analytics') {
        return [record.provider, record.instance_type, record.attributes?.engine || '', record.attributes?.deployment_type || '', record.attributes?.tier || '', record.vcpus || '', record.geography, priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
      } else if (activeProductType === 'ai') {
        return [record.provider, record.instance_type, record.service || '', record.attributes?.modelTier || '', record.attributes?.contextWindowK || '', record.attributes?.multimodal || '', record.geography, priceDisplay, record.attributes?.outputPricePer1M || '', record.data_source === 'static_config' ? 'Static' : 'API'];
      } else if (activeProductType === 'storage') {
        return [record.provider, record.instance_type, record.attributes?.storage_type || '', record.attributes?.tier || '', record.attributes?.redundancy || '', record.attributes?.media || '', record.geography, priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
      } else if (activeProductType === 'app-hosting') {
        return [record.provider, record.instance_type, record.attributes?.tier || '', record.attributes?.compute_type || '', record.os || '', record.geography, record.vcpus || '', record.memory_gb || '', priceDisplay, record.data_source === 'static_config' ? 'Static' : 'API'];
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
    <main className="flex flex-col min-h-[100dvh] lg:h-screen bg-[#f7f8ff] dark:bg-[#06060f] text-[#1e1e38] dark:text-[#e5e7eb] font-sans lg:overflow-hidden transition-colors duration-300">
      <h1 className="sr-only">Compare Cloud Costs - AWS, Azure, Google Cloud Pricing</h1>
      <ProductTypeSelector activeProductType={activeProductType} onProductTypeChange={setActiveProductType} />

      <div className="flex flex-1 lg:overflow-hidden">
        <FilterSidebar
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          activeProductType={activeProductType}
          selectedProviders={selectedProviders}
          selectedGeographies={selectedGeographies}
          selectedOS={selectedOS}
          selectedCpu={selectedCpu}
          selectedCategory={selectedCategory}
          selectedPricingModels={selectedPricingModels}
          selectedGpu={selectedGpu}
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
          selectedServerlessMemory={selectedServerlessMemory}
          selectedServerlessArchitectures={selectedServerlessArchitectures}
          selectedContainersOrchestrators={selectedContainersOrchestrators}
          selectedContainersComputeTypes={selectedContainersComputeTypes}
          selectedContainersArchitectures={selectedContainersArchitectures}
          selectedContainersBillingGranularity={selectedContainersBillingGranularity}
          containersGpuIncluded={containersGpuIncluded}
          selectedAnalyticsEngines={selectedAnalyticsEngines}
          selectedAnalyticsDeploymentTypes={selectedAnalyticsDeploymentTypes}
          selectedAnalyticsTiers={selectedAnalyticsTiers}
          selectedAiServiceTypes={selectedAiServiceTypes}
          selectedAiModelTiers={selectedAiModelTiers}
          selectedAiContextWindows={selectedAiContextWindows}
          selectedAiMultimodalOptions={selectedAiMultimodalOptions}
          selectedNetworkingServices={selectedNetworkingServices}
          selectedSecurityServices={selectedSecurityServices}
          selectedNetworkingConnectionTypes={selectedNetworkingConnectionTypes}
          selectedNetworkingRoutingTypes={selectedNetworkingRoutingTypes}
          selectedNetworkingHaSupport={selectedNetworkingHaSupport}
          selectedNetworkingVpcSupport={selectedNetworkingVpcSupport}
          selectedNetworkingDirections={selectedNetworkingDirections}
          selectedNetworkingBillingModels={selectedNetworkingBillingModels}
          selectedNetworkingUsageTiers={selectedNetworkingUsageTiers}
          selectedNetworkingPortCapacities={selectedNetworkingPortCapacities}
          selectedNetworkingTransferScopes={selectedNetworkingTransferScopes}
          selectedStorageCategories={selectedStorageCategories}
          selectedStorageTiers={selectedStorageTiers}
          selectedStorageRedundancies={selectedStorageRedundancies}
          selectedStorageMedia={selectedStorageMedia}
          selectedAppHostingTiers={selectedAppHostingTiers}
          selectedAppHostingComputeTypes={selectedAppHostingComputeTypes}
          selectedServerlessServiceTypes={selectedServerlessServiceTypes}
          vCpuRange={activeProductType === 'serverless' ? serverlessVCpuRange : activeProductType === 'containers' ? containersVCpuRange : vCpuRange}
          memoryRange={activeProductType === 'serverless' ? serverlessMemoryRange : activeProductType === 'containers' ? containersMemoryRange : memoryRange}
          priceRange={priceRange}
          showAggregation={showAggregation}
          expanded={expanded}
          onProviderToggle={(p) => toggleFilter(selectedProviders, setSelectedProviders, p)}
          onGeographyToggle={(g) => toggleFilter(selectedGeographies, setSelectedGeographies, g)}
          onOsToggle={(o) => toggleFilter(selectedOS, setSelectedOS, o)}
          onCpuToggle={(c) => toggleFilter(selectedCpu, setSelectedCpu, c)}
          onCategoryToggle={(c) => toggleFilter(selectedCategory, setSelectedCategory, c)}
          onSetCategory={setSelectedCategory}
          onPricingModelToggle={(pm) => toggleFilter(selectedPricingModels, setSelectedPricingModels, pm)}
          onSetPricingModels={setSelectedPricingModels}
          onGpuToggle={(v) => toggleFilter(selectedGpu, setSelectedGpu, v)}
          onSetGpu={setSelectedGpu}
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
          onServerlessMemoryToggle={(m) => toggleFilter(selectedServerlessMemory, setSelectedServerlessMemory, m)}
          onServerlessArchitectureToggle={(a) => toggleFilter(selectedServerlessArchitectures, setSelectedServerlessArchitectures, a)}
          onContainersOrchestratorToggle={(o) => toggleFilter(selectedContainersOrchestrators, setSelectedContainersOrchestrators, o)}
          onContainersComputeTypeToggle={(c) => toggleFilter(selectedContainersComputeTypes, setSelectedContainersComputeTypes, c)}
          onContainersArchitectureToggle={(a) => toggleFilter(selectedContainersArchitectures, setSelectedContainersArchitectures, a)}
          onContainersBillingGranularityToggle={(b) => toggleFilter(selectedContainersBillingGranularity, setSelectedContainersBillingGranularity, b)}
          onContainersGpuToggle={setContainersGpuIncluded}
          onAnalyticsEngineToggle={(e) => toggleFilter(selectedAnalyticsEngines, setSelectedAnalyticsEngines, e)}
          onAnalyticsDeploymentTypeToggle={(d) => toggleFilter(selectedAnalyticsDeploymentTypes, setSelectedAnalyticsDeploymentTypes, d)}
          onAnalyticsTierToggle={(t) => toggleFilter(selectedAnalyticsTiers, setSelectedAnalyticsTiers, t)}
          onAiServiceTypeToggle={(s) => toggleFilter(selectedAiServiceTypes, setSelectedAiServiceTypes, s)}
          onAiModelTierToggle={(m) => toggleFilter(selectedAiModelTiers, setSelectedAiModelTiers, m)}
          onAiContextWindowToggle={(c) => toggleFilter(selectedAiContextWindows, setSelectedAiContextWindows, c)}
          onAiMultimodalOptionToggle={(o) => toggleFilter(selectedAiMultimodalOptions, setSelectedAiMultimodalOptions, o)}
          onNetworkingServiceToggle={(s) => toggleFilter(selectedNetworkingServices, setSelectedNetworkingServices, s)}
          onSecurityServiceToggle={(s) => toggleFilter(selectedSecurityServices, setSelectedSecurityServices, s)}
          onSetSecurityServices={(items) => setSelectedSecurityServices(items)}
          onNetworkingConnectionTypeToggle={(c) => toggleFilter(selectedNetworkingConnectionTypes, setSelectedNetworkingConnectionTypes, c)}
          onNetworkingRoutingTypeToggle={(r) => toggleFilter(selectedNetworkingRoutingTypes, setSelectedNetworkingRoutingTypes, r)}
          onNetworkingHaSupportToggle={(h) => toggleFilter(selectedNetworkingHaSupport, setSelectedNetworkingHaSupport, h)}
          onNetworkingVpcSupportToggle={(v) => toggleFilter(selectedNetworkingVpcSupport, setSelectedNetworkingVpcSupport, v)}
          onNetworkingDirectionToggle={(d) => toggleFilter(selectedNetworkingDirections, setSelectedNetworkingDirections, d)}
          onNetworkingBillingModelToggle={(b) => toggleFilter(selectedNetworkingBillingModels, setSelectedNetworkingBillingModels, b)}
          onNetworkingUsageTierToggle={(u) => toggleFilter(selectedNetworkingUsageTiers, setSelectedNetworkingUsageTiers, u)}
          onNetworkingPortCapacityToggle={(p) => toggleFilter(selectedNetworkingPortCapacities, setSelectedNetworkingPortCapacities, p)}
          onNetworkingTransferScopeToggle={(s) => toggleFilter(selectedNetworkingTransferScopes, setSelectedNetworkingTransferScopes, s)}
          onStorageCategoryToggle={(c) => toggleFilter(selectedStorageCategories, setSelectedStorageCategories, c)}
          onStorageTierToggle={(t) => toggleFilter(selectedStorageTiers, setSelectedStorageTiers, t)}
          onStorageRedundancyToggle={(r) => toggleFilter(selectedStorageRedundancies, setSelectedStorageRedundancies, r)}
          onStorageMediaToggle={(m) => toggleFilter(selectedStorageMedia, setSelectedStorageMedia, m)}
          onAppHostingTierToggle={(t) => toggleFilter(selectedAppHostingTiers, setSelectedAppHostingTiers, t)}
          onAppHostingComputeTypeToggle={(c) => toggleFilter(selectedAppHostingComputeTypes, setSelectedAppHostingComputeTypes, c)}
          onServerlessServiceTypeToggle={(s) => toggleFilter(selectedServerlessServiceTypes, setSelectedServerlessServiceTypes, s)}
          onSetProviders={setSelectedProviders}
          onSetGeographies={setSelectedGeographies}
          onSetOS={setSelectedOS}
          onSetCpu={setSelectedCpu}
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
          onSetServerlessMemory={setSelectedServerlessMemory}
          onSetServerlessArchitectures={setSelectedServerlessArchitectures}
          onSetContainersOrchestrators={setSelectedContainersOrchestrators}
          onSetContainersComputeTypes={setSelectedContainersComputeTypes}
          onSetContainersArchitectures={setSelectedContainersArchitectures}
          onSetContainersBillingGranularity={setSelectedContainersBillingGranularity}
          onSetAnalyticsEngines={setSelectedAnalyticsEngines}
          onSetAnalyticsDeploymentTypes={setSelectedAnalyticsDeploymentTypes}
          onSetAnalyticsTiers={setSelectedAnalyticsTiers}
          onSetAiServiceTypes={setSelectedAiServiceTypes}
          onSetAiModelTiers={setSelectedAiModelTiers}
          onSetAiContextWindows={setSelectedAiContextWindows}
          onSetAiMultimodalOptions={setSelectedAiMultimodalOptions}
          onSetNetworkingServices={setSelectedNetworkingServices}
          onSetNetworkingConnectionTypes={setSelectedNetworkingConnectionTypes}
          onSetNetworkingRoutingTypes={setSelectedNetworkingRoutingTypes}
          onSetNetworkingHaSupport={setSelectedNetworkingHaSupport}
          onSetNetworkingVpcSupport={setSelectedNetworkingVpcSupport}
          onSetNetworkingDirections={setSelectedNetworkingDirections}
          onSetNetworkingBillingModels={setSelectedNetworkingBillingModels}
          onSetNetworkingUsageTiers={setSelectedNetworkingUsageTiers}
          onSetNetworkingPortCapacities={setSelectedNetworkingPortCapacities}
          onSetNetworkingTransferScopes={setSelectedNetworkingTransferScopes}
          onSetStorageCategories={setSelectedStorageCategories}
          onSetStorageTiers={setSelectedStorageTiers}
          onSetStorageRedundancies={setSelectedStorageRedundancies}
          onSetStorageMedia={setSelectedStorageMedia}
          onSetAppHostingTiers={setSelectedAppHostingTiers}
          onSetAppHostingComputeTypes={setSelectedAppHostingComputeTypes}
          onSetServerlessServiceTypes={setSelectedServerlessServiceTypes}
          onVCpuRangeChange={activeProductType === 'serverless' ? setServerlessVCpuRange : activeProductType === 'containers' ? setContainersVCpuRange : setVCpuRange}
          onMemoryRangeChange={activeProductType === 'serverless' ? setServerlessMemoryRange : activeProductType === 'containers' ? setContainersMemoryRange : setMemoryRange}
          onPriceRangeChange={setPriceRange}
          onShowAggregationChange={setShowAggregation}
          onToggleSection={toggleSection}
        />

        <main className="flex-1 min-w-0 lg:overflow-hidden flex flex-col bg-[#f7f8ff] dark:bg-[#06060f]">
          <ProviderCards
            providers={staticConfig.providersForType(activeProductType)}
            selectedProviders={selectedProviders}
            providerCounts={providerCounts}
            dbStatusProviders={dbStatus?.providers}
            isInitialFetch={isInitialFetch}
            onProviderSelect={(providerId) => {
              const activeProvidersList = staticConfig.providersForType(activeProductType).filter(p => !p.soon);
              const activeNonSoon = activeProvidersList.map(p => p.id);
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
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenFilters={() => setFiltersOpen(true)}
            lastUpdated={lastUpdated}
          />

          {viewMode === 'table' ? (
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
              lastUpdated={lastUpdated}
            />
          ) : (
            <ChartsView
              data={data}
              activeProductType={activeProductType}
            />
          )}
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
    </main>
  );
}
