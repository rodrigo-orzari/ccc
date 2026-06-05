'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef, useDeferredValue } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Download,
  ChevronDown,
  Info,
  Maximize2
} from 'lucide-react';
import Link from 'next/link';


const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <span 
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => { e.stopPropagation(); setShow(!show); }}
    >
      {children}
      {show && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-[140px] p-1.5 bg-[#171717] dark:bg-[#e5e5e5] text-white dark:text-black text-[10px] rounded shadow-lg z-50 font-normal tracking-normal normal-case text-left leading-relaxed">
          {text}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-b-[4px] border-r-[4px] border-t-transparent border-b-transparent border-r-[#171717] dark:border-r-[#e5e5e5]"></div>
        </div>
      )}
    </span>
  );
};

interface PricingRecord {
  provider: string;
  service: string;
  region: string;
  instance_type: string;
  vcpus: number;
  memory_gb: number;
  arch: string;
  os: string;
  cpu_vendor: string;
  gpu_count: number;
  geography: string;
  category: string;
  price_per_unit: string;
  unit: string;
  min_price?: string;
  avg_price?: string;
  max_price?: string;
  data_source?: string;
  attributes?: {
    supportedLanguages?: string | string[];

    engine?: string;
    engine_version?: string;
    deployment_type?: string;
    ha_mode?: string;
    storage_type?: string;
    workload?: string;
    tier?: string;
    cold_start_overhead_ms?: string | number;
    timeout_seconds?: string | number;
    memory_configuration?: string;
    free_invocations_per_month?: string | number;
    billing_granularity_ms?: number | string;
    invocation_price_per_1m?: number | string;
    execution_model?: string;
    provisioned_concurrency_support?: string;
    max_ephemeral_storage_gb?: number | string;
    
    // Containers
    orchestrator?: string;
    compute_type?: string;
    architecture?: string;
    billing_granularity?: string;
    
    // Networking
    transfer_tier?: string;
    destination?: string;
    included_transfer?: string;
  };
}

type ProductType = 'vm' | 'database' | 'serverless' | 'containers' | 'networking' | 'data-analytics' | 'ai';

const PROVIDERS: { id: string; name: string; color: string; soon?: boolean }[] = [
  { id: 'aws', name: 'AWS', color: '#FF9900' },
  { id: 'azure', name: 'Azure', color: '#00BCFF' },
  { id: 'gcp', name: 'Google', color: '#34A853' },
  { id: 'oracle', name: 'Oracle', color: '#F80000' },
  { id: 'digitalocean', name: 'DigitalOcean', color: '#0069FF' },
];

const GEOGRAPHIES = ['N. America', 'S. America', 'W. Europe', 'N. Europe', 'Mid East & Africa', 'Asia Pacific', 'Australia'];
const OS_TYPES = ['Linux', 'Windows'];
const CPU_PROFILES = [
  { id: 'intel-x86', label: 'Intel (x86)', vendor: 'Intel', arch: 'x86 64' },
  { id: 'amd-x86', label: 'AMD (x86)', vendor: 'AMD', arch: 'x86 64' },
  { id: 'aws-arm', label: 'AWS Graviton (ARM)', vendor: 'AWS', arch: 'ARM' },
  { id: 'ampere-arm', label: 'Ampere (ARM)', vendor: 'Ampere', arch: 'ARM' },
];
const CATEGORIES = ['General purpose', 'Compute optimized', 'Memory optimized', 'Storage optimized', 'Burstable', 'HPC'];

// Database-view constants
const DB_FAMILIES = ['Relational', 'NoSQL'];
const DB_ENGINES = ['PostgreSQL', 'MySQL', 'MariaDB', 'SQL Server', 'Oracle DB', 'Cosmos DB', 'MongoDB', 'Redis', 'Valkey', 'DB2'];
const DEPLOYMENT_TYPES = ['Provisioned', 'Serverless'];
const HA_MODES = ['Single AZ', 'Multi AZ', 'Zone Redundant', 'Multi Region', 'Geo Redundant'];

// Serverless-view constants
const SERVERLESS_LANGUAGES = ['Python', 'Node', 'Go', 'Java', 'C#', 'Ruby', 'JavaScript', 'PHP', 'Rust', 'PowerShell', 'TypeScript', 'Any (Container)'];
const SERVERLESS_COLD_START_OPTIONS = ['Fast (<100)', 'Medium (100-200)', 'Slow (>200)'];
const SERVERLESS_TIMEOUT_OPTIONS = ['Short (5)', 'Medium (10)', 'Long (15+)'];
const SERVERLESS_MEMORY_CONFIG_OPTIONS = ['Configurable', 'Tiers', 'Automatic'];
const SERVERLESS_FREE_TIER_OPTIONS = ['Yes', 'No'];
const SERVERLESS_GRANULARITY_OPTIONS = ['1', '100'];
const SERVERLESS_EXECUTION_MODEL_OPTIONS = ['Both', 'Code (ZIP)', 'Container Image'];
const SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS = ['Yes', 'No'];
const SERVERLESS_EPHEMERAL_STORAGE_OPTIONS = ['< 1', '1 - 5', '> 5'];

// Containers-view constants
const CONTAINERS_ORCHESTRATORS = ['Kubernetes', 'Serverless', 'Docker'];
const CONTAINERS_COMPUTE_TYPES = ['Serverless', 'Provisioned'];
const CONTAINERS_ARCHITECTURES = ['x86_64', 'ARM64'];
const CONTAINERS_BILLING_GRANULARITY = ['Per Second', 'Per Hour'];
const NETWORKING_SERVICES = ['Data Transfer', 'Virtual Private Cloud (VPC)', 'Load Balancing', 'Dedicated Connection', 'Public IPv4'];
const NETWORKING_CONNECTION_TYPES = ['Multipoint', 'Point-to-Point'];
const NETWORKING_ROUTING_TYPES = ['Dynamic', 'Fixed'];
const NETWORKING_HA_SUPPORT = ['Yes', 'No'];
const NETWORKING_VPC_SUPPORT = ['Yes', 'No'];
const NETWORKING_DIRECTIONS = ['Egress', 'Ingress', 'Intra-Cloud'];

// Data-Analytics-view constants
const ANALYTICS_ENGINES = ['Databricks', 'Snowflake', 'BigQuery', 'Redshift', 'Synapse'];
const ANALYTICS_DEPLOYMENT_TYPES = ['Serverless', 'Provisioned'];
const ANALYTICS_TIERS = ['Standard', 'Premium', 'Enterprise'];

const DEFAULT_VCPU_RANGE   = { min: 0,   max: 320 };
const DEFAULT_MEMORY_RANGE = { min: 0,   max: 3200 };
const DEFAULT_PRICE_RANGE  = { min: 0,   max: 510 };

const RangeSlider = ({ min, max, value, onChange, step = 1, unit = '' }: {
  min: number,
  max: number,
  value: { min: number, max: number },
  onChange: (val: { min: number, max: number }) => void,
  step?: number,
  unit?: string
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-bold text-[#737373]">
        <span>Min <span className="ml-1 font-mono font-medium text-black dark:text-white">{unit}{value.min}{!unit && ' '}</span></span>
        <span>Max <span className="ml-1 font-mono font-medium text-black dark:text-white">{unit}{value.max}{!unit && ' '}</span></span>
      </div>
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div className="absolute w-full h-1 bg-[#262626] rounded-full" />

        {/* Active Range Highlight */}
        <div
          className="absolute h-1 bg-white rounded-full pointer-events-none"
          style={{
            left: `${((value.min - min) / (max - min)) * 100}%`,
            right: `${100 - ((value.max - min) / (max - min)) * 100}%`
          }}
        />

        {/* Min Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), value.max - step);
            onChange({ ...value, min: val });
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 slider-input-min"
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), value.min + step);
            onChange({ ...value, max: val });
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 slider-input-max"
        />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [activeProductType, setActiveProductType] = useState<ProductType>('vm');

  const [selectedProviders, setSelectedProviders] = useState<string[]>(PROVIDERS.filter(p => !p.soon).map(p => p.id));
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([...GEOGRAPHIES]);
  const [selectedOS, setSelectedOS] = useState<string[]>([...OS_TYPES]);
  const [selectedCpu, setSelectedCpu] = useState<string[]>(CPU_PROFILES.map(p => p.id));
  const [selectedCategory, setSelectedCategory] = useState<string[]>([...CATEGORIES]);
  // gpuIncluded uses INCLUSION semantics matching every other pill in the
  // sidebar: true = GPU instances are included in the result set (default,
  // selected pill); false = GPU instances are excluded. This is intentionally
  // a flip of the older "gpu-only" mode — the GPU pill is now just one of
  // the CPU | GPU section's filter chips, and Select All / Clear All operate
  // on it like every other chip.
  const [gpuIncluded, setGpuIncluded] = useState(true);

  // Database-specific filter state
  const [selectedDbFamilies, setSelectedDbFamilies] = useState<string[]>([...DB_FAMILIES]);
  const [selectedEngines, setSelectedEngines] = useState<string[]>([...DB_ENGINES]);
  const [selectedDeploymentTypes, setSelectedDeploymentTypes] = useState<string[]>([...DEPLOYMENT_TYPES]);
  const [selectedHaModes, setSelectedHaModes] = useState<string[]>([...HA_MODES]);

  // Serverless-specific filter state
  const [selectedServerlessLanguages, setSelectedServerlessLanguages] = useState<string[]>([...SERVERLESS_LANGUAGES]);
  const [selectedServerlessColdStart, setSelectedServerlessColdStart] = useState<string[]>([...SERVERLESS_COLD_START_OPTIONS]);
  const [selectedServerlessTimeout, setSelectedServerlessTimeout] = useState<string[]>([...SERVERLESS_TIMEOUT_OPTIONS]);
  const [selectedServerlessMemoryConfig, setSelectedServerlessMemoryConfig] = useState<string[]>([...SERVERLESS_MEMORY_CONFIG_OPTIONS]);
  const [selectedServerlessFreeTier, setSelectedServerlessFreeTier] = useState<string[]>([...SERVERLESS_FREE_TIER_OPTIONS]);
  const [selectedServerlessGranularity, setSelectedServerlessGranularity] = useState<string[]>([...SERVERLESS_GRANULARITY_OPTIONS]);
  const [selectedServerlessExecutionModel, setSelectedServerlessExecutionModel] = useState<string[]>([...SERVERLESS_EXECUTION_MODEL_OPTIONS]);
  const [selectedServerlessProvisionedConcurrency, setSelectedServerlessProvisionedConcurrency] = useState<string[]>([...SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS]);
  const [selectedServerlessEphemeralStorage, setSelectedServerlessEphemeralStorage] = useState<string[]>([...SERVERLESS_EPHEMERAL_STORAGE_OPTIONS]);

  // Containers-specific filter state
  const [selectedContainersOrchestrators, setSelectedContainersOrchestrators] = useState<string[]>([...CONTAINERS_ORCHESTRATORS]);
  const [selectedContainersComputeTypes, setSelectedContainersComputeTypes] = useState<string[]>([...CONTAINERS_COMPUTE_TYPES]);
  const [selectedContainersArchitectures, setSelectedContainersArchitectures] = useState<string[]>([...CONTAINERS_ARCHITECTURES]);
  const [selectedContainersBillingGranularity, setSelectedContainersBillingGranularity] = useState<string[]>([...CONTAINERS_BILLING_GRANULARITY]);
  const [selectedNetworkingServices, setSelectedNetworkingServices] = useState<string[]>([...NETWORKING_SERVICES]);
  const [selectedNetworkingConnectionTypes, setSelectedNetworkingConnectionTypes] = useState<string[]>([...NETWORKING_CONNECTION_TYPES]);
  const [selectedNetworkingRoutingTypes, setSelectedNetworkingRoutingTypes] = useState<string[]>([...NETWORKING_ROUTING_TYPES]);
  const [selectedNetworkingHaSupport, setSelectedNetworkingHaSupport] = useState<string[]>([...NETWORKING_HA_SUPPORT]);
  const [selectedNetworkingVpcSupport, setSelectedNetworkingVpcSupport] = useState<string[]>([...NETWORKING_VPC_SUPPORT]);
  const [selectedNetworkingDirections, setSelectedNetworkingDirections] = useState<string[]>([...NETWORKING_DIRECTIONS]);
  const [containersGpuIncluded, setContainersGpuIncluded] = useState(true);

  // Data-Analytics-specific filter state
  const [selectedAnalyticsEngines, setSelectedAnalyticsEngines] = useState<string[]>([...ANALYTICS_ENGINES]);
  const [selectedAnalyticsDeploymentTypes, setSelectedAnalyticsDeploymentTypes] = useState<string[]>([...ANALYTICS_DEPLOYMENT_TYPES]);
  const [selectedAnalyticsTiers, setSelectedAnalyticsTiers] = useState<string[]>([...ANALYTICS_TIERS]);

  const [vCpuRange, setVCpuRange] = useState({ ...DEFAULT_VCPU_RANGE });
  const [memoryRange, setMemoryRange] = useState({ ...DEFAULT_MEMORY_RANGE });
  const [priceRange, setPriceRange] = useState({ ...DEFAULT_PRICE_RANGE });
  const [search, setSearch] = useState('');
  const [showAggregation, setShowAggregation] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PricingRecord | string, direction: 'asc' | 'desc' }>({ key: 'price_per_unit', direction: 'asc' });

      const [isInitialFetch, setIsInitialFetch] = useState(true);
    


  // Ref + state for the table scroll container, used to detect whether there
  // is actual horizontal overflow and to show / hide the right-edge fade hint.
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  // Combine all active filters into URLSearchParams for querying
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

  // Debounce the entire query string so fast slider drags don't spam the server
  const debouncedParamsString = useDeferredValue(searchParams.toString());
  
  // Guard condition to prevent fetching if basic requirements aren't met
  const canFetch = useMemo(() => {
    if (selectedProviders.length === 0 || selectedGeographies.length === 0) return false;
    if (activeProductType === 'vm' && (selectedOS.length === 0 || selectedCpu.length === 0 || selectedCategory.length === 0)) return false;
    if (activeProductType === 'database' && (selectedDbFamilies.length === 0 || selectedEngines.length === 0 || selectedDeploymentTypes.length === 0 || selectedHaModes.length === 0)) return false;
    if (activeProductType === 'serverless' && (selectedServerlessLanguages.length === 0 || selectedServerlessColdStart.length === 0 || selectedServerlessTimeout.length === 0 || selectedServerlessMemoryConfig.length === 0 || selectedServerlessFreeTier.length === 0 || selectedServerlessGranularity.length === 0 || selectedServerlessExecutionModel.length === 0 || selectedServerlessProvisionedConcurrency.length === 0 || selectedServerlessEphemeralStorage.length === 0)) return false;
    if (activeProductType === 'containers' && (selectedContainersOrchestrators.length === 0 || selectedContainersComputeTypes.length === 0 || selectedContainersArchitectures.length === 0 || selectedContainersBillingGranularity.length === 0)) return false;
    if (activeProductType === 'data-analytics' && (selectedAnalyticsEngines.length === 0 || selectedAnalyticsDeploymentTypes.length === 0 || selectedAnalyticsTiers.length === 0)) return false;
    return true;
  }, [debouncedParamsString, selectedProviders, selectedGeographies]); // Re-eval on debounce

  // 1. Health Status Query
  const { data: dbStatus } = useQuery({
    queryKey: ['health', debouncedParamsString],
    queryFn: async () => {
      const res = await fetch(`/api/health?${debouncedParamsString}`);
      const status = await res.json();
      return {
        total: status.total_records || 0,
        providers: status.by_provider || [],
        lastUpdated: status.last_updated || null
      };
    },
    enabled: canFetch,
    placeholderData: keepPreviousData,
  });

  // 2. Provider Counts Query
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

  // 3. Pricing Data Query
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

      // Handle nested attributes (e.g., 'attributes.engine')
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




  // Sidebar section expand/collapse state — all expanded by default; user can
  // collapse top sections to make the bottom ones (vCPU/Memory/Price sliders)
  // more discoverable.
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
  const toggleSection = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));



  // Watch the table scroll container for horizontal overflow + scroll position.
  // The fade-right hint is shown when the inner content is wider than the
  // container AND the user hasn't yet scrolled to the right edge. This is a
  // belt-and-suspenders fallback for environments where the native scrollbar
  // doesn't render visibly (macOS overlay scrollbars, etc.).
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

  // Double-click on a resize handle → auto-fit column to widest visible cell.

  const SortIcon = ({ sortKey }: { sortKey: string }) => {
    const isActive = sortConfig.key === sortKey;
    return (
      <span className={`ml-1 inline-block transition-opacity ${isActive ? 'opacity-100' : 'opacity-25'}`}>
        {isActive ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    );
  };





  // Truthful total across the providers the user has currently selected. Sums
  // the per-provider counts from /api/pricing/counts (which already respect
  // every other filter). Used by the toolbar so the displayed total reflects
  // the actual filtered pool — even when the table is capped at 1,000 rows.
  const totalFilteredCount = useMemo(() => {
    return selectedProviders.reduce((sum, providerId) => sum + (providerCounts[providerId] || 0), 0);
  }, [selectedProviders, providerCounts]);

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#000000] text-[#171717] dark:text-[#e5e7eb] font-sans overflow-hidden transition-colors duration-300">



      {/* Capabilities Sub-header */}
      <div className="h-10 border-b border-[#e5e5e5] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#080808] flex items-center px-4 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={() => { setActiveProductType('vm'); }}
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
              activeProductType === 'vm'
                ? 'bg-white dark:bg-[#171717] shadow-sm border-[#e5e5e5] dark:border-[#262626] cursor-default'
                : 'border-transparent text-[#737373] hover:text-black dark:hover:text-white opacity-60 hover:opacity-100'
            }`}
          >
            <span className={`text-xs font-bold flex items-center gap-1.5 ${activeProductType !== 'vm' ? 'font-medium' : ''}`}>
              🖥️ Virtual Machines
            </span>
          </button>

          <button
            onClick={() => { setActiveProductType('database'); }}
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
              activeProductType === 'database'
                ? 'bg-white dark:bg-[#171717] shadow-sm border-[#e5e5e5] dark:border-[#262626] cursor-default'
                : 'border-transparent text-[#737373] hover:text-black dark:hover:text-white opacity-60 hover:opacity-100'
            }`}
          >
            <span className="text-xs font-bold flex items-center gap-1.5">
              🗄️ Databases
            </span>
          </button>

          <button
            onClick={() => { setActiveProductType('serverless'); }}
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
              activeProductType === 'serverless'
                ? 'bg-white dark:bg-[#171717] shadow-sm border-[#e5e5e5] dark:border-[#262626] cursor-default'
                : 'border-transparent text-[#737373] hover:text-black dark:hover:text-white opacity-60 hover:opacity-100'
            }`}
          >
            <span className={`text-xs font-bold flex items-center gap-1.5 ${activeProductType !== 'serverless' ? 'font-medium' : ''}`}>
              ⚡ Serverless
            </span>
          </button>

          <button
            onClick={() => { setActiveProductType('containers'); }}
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
              activeProductType === 'containers'
                ? 'bg-white dark:bg-[#171717] shadow-sm border-[#e5e5e5] dark:border-[#262626] cursor-default'
                : 'border-transparent text-[#737373] hover:text-black dark:hover:text-white opacity-60 hover:opacity-100'
            }`}
          >
            <span className={`text-xs font-bold flex items-center gap-1.5 ${activeProductType !== 'containers' ? 'font-medium' : ''}`}>
              📦 Containers
            </span>
          </button>

          <button
            onClick={() => { setActiveProductType('networking'); }}
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
              activeProductType === 'networking'
                ? 'bg-white dark:bg-[#171717] shadow-sm border-[#e5e5e5] dark:border-[#262626] cursor-default'
                : 'border-transparent text-[#737373] hover:text-black dark:hover:text-white opacity-60 hover:opacity-100'
            }`}
          >
            <span className={`text-xs font-bold flex items-center gap-1.5 ${activeProductType !== 'networking' ? 'font-medium' : ''}`}>
              🌐 Networking
            </span>
          </button>

          <button
            onClick={() => { setActiveProductType('data-analytics'); }}
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
              activeProductType === 'data-analytics'
                ? 'bg-white dark:bg-[#171717] shadow-sm border-[#e5e5e5] dark:border-[#262626] cursor-default'
                : 'border-transparent text-[#737373] hover:text-black dark:hover:text-white opacity-60 hover:opacity-100'
            }`}
          >
            <span className={`text-xs font-bold flex items-center gap-1.5 ${activeProductType !== 'data-analytics' ? 'font-medium' : ''}`}>
              📊 Data & Analytics
            </span>
          </button>

          <div className="flex items-center gap-2 group opacity-60">
            <span className="text-xs font-medium text-[#737373] flex items-center gap-1.5">
              🧠 Artificial Intelligence
              <span className="text-[8px] font-bold bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] px-1 rounded uppercase tracking-tighter">Soon</span>
            </span>
          </div>

          <div className="flex items-center gap-2 group opacity-60">
            <span className="text-xs font-medium text-[#737373] flex items-center gap-1.5">
              💾 Storage
              <span className="text-[8px] font-bold bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] px-1 rounded uppercase tracking-tighter">Soon</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar Filters */}
        <aside className="w-72 border-r border-[#e5e5e5] dark:border-[#262626] flex flex-col shrink-0 overflow-y-auto bg-white dark:bg-[#000000] custom-scrollbar pb-10">
          <div className="p-4 space-y-8">

            {/* Providers Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="m-0">
                  <button
                    onClick={() => toggleSection('provider')}
                    className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ChevronDown size={10} className={`transition-transform ${expanded.provider ? '' : '-rotate-90'}`} />
                    Provider <Tooltip text="Cloud providers offering virtual machine pricing. Click a provider tile or chip to filter."><Info size={10} className="cursor-help" /></Tooltip>
                  </button>
                </h2>
                <button
                  onClick={() => {
                    if (selectedProviders.length === PROVIDERS.filter(p => !p.soon).length) {
                      setSelectedProviders([]);
                    } else {
                      setSelectedProviders(PROVIDERS.filter(p => !p.soon).map(p => p.id));
                    }
                  }}
                  className={`text-[10px] font-bold uppercase transition-colors ${selectedProviders.length === PROVIDERS.filter(p => !p.soon).length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}
                >
                  {selectedProviders.length === PROVIDERS.filter(p => !p.soon).length ? 'Clear All' : 'Select All'}
                </button>
              </div>
              {expanded.provider && (
              <div className="flex flex-wrap gap-2">
                {PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    disabled={p.soon}
                    onClick={() => {
                      if (p.soon) return;
                      toggleFilter(selectedProviders, setSelectedProviders, p.id);
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border flex items-center ${
                      p.soon
                      ? 'bg-transparent text-[#737373] border-[#e5e5e5] dark:border-[#262626] cursor-not-allowed opacity-60'
                      : selectedProviders.includes(p.id)
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {p.name}
                    {p.soon && <span className="bg-[#737373] text-white text-[7px] px-1 rounded ml-1">SOON</span>}
                  </button>
                ))}
              </div>
              )}
            </section>

            {activeProductType === 'vm' && (
              <>
                {/* ── VM: Category ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('category')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.category ? '' : '-rotate-90'}`} />
                        Category <Tooltip text="Instance type purpose, derived from each cloud's published instance families."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedCategory.length === CATEGORIES.length ? setSelectedCategory([]) : setSelectedCategory([...CATEGORIES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedCategory.length === CATEGORIES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedCategory.length === CATEGORIES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.category && (
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(category => (
                      <button key={category} onClick={() => toggleFilter(selectedCategory, setSelectedCategory, category)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedCategory.includes(category) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {category}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── VM: Geography ── */}
                <section className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('geography')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.geography ? '' : '-rotate-90'}`} />
                        Geography <Tooltip text="Geographic region where the VM runs."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedGeographies.length === GEOGRAPHIES.length ? setSelectedGeographies([]) : setSelectedGeographies([...GEOGRAPHIES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedGeographies.length === GEOGRAPHIES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedGeographies.length === GEOGRAPHIES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.geography && (
                  <div className="flex flex-wrap gap-2">
                    {GEOGRAPHIES.map(geo => (
                      <button key={geo} onClick={() => toggleFilter(selectedGeographies, setSelectedGeographies, geo)}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all border ${selectedGeographies.includes(geo) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {geo}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── VM: Operating System ── */}
                <section className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('os')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.os ? '' : '-rotate-90'}`} />
                        Operating System <Tooltip text="The operating system running on the VM."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedOS.length === OS_TYPES.length ? setSelectedOS([]) : setSelectedOS([...OS_TYPES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedOS.length === OS_TYPES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedOS.length === OS_TYPES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.os && (
                  <div className="flex flex-wrap gap-2">
                    {OS_TYPES.map(os => (
                      <button key={os} onClick={() => toggleFilter(selectedOS, setSelectedOS, os)}
                        className={`px-4 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedOS.includes(os) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {os}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── VM: CPU | GPU ── */}
                <section className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('cpu')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.cpu ? '' : '-rotate-90'}`} />
                        CPU | GPU <Tooltip text="Processor vendor, architecture, and GPU accelerator."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => {
                        // GPU pill is treated as just another chip in this section,
                        // so "all selected" means every CPU profile is in AND the
                        // GPU pill is on. Clear All turns every chip in the
                        // section off — including GPU — to match the other
                        // sidebar sections' Clear All behaviour.
                        const allSelected = selectedCpu.length === CPU_PROFILES.length && gpuIncluded;
                        if (allSelected) { setSelectedCpu([]); setGpuIncluded(false); }
                        else { setSelectedCpu(CPU_PROFILES.map(p => p.id)); setGpuIncluded(true); }
                      }} className={`text-[10px] font-bold uppercase transition-colors ${selectedCpu.length === CPU_PROFILES.length && gpuIncluded ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedCpu.length === CPU_PROFILES.length && gpuIncluded ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.cpu && (
                  <div className="flex flex-wrap gap-2">
                    {CPU_PROFILES.map(profile => (
                      <button key={profile.id} onClick={() => toggleFilter(selectedCpu, setSelectedCpu, profile.id)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedCpu.includes(profile.id) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {profile.label}
                      </button>
                    ))}
                    <button
                      title="Include GPU instances in the results. Deselect to exclude GPU instances."
                      onClick={() => setGpuIncluded(v => !v)}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${gpuIncluded ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                      GPU
                    </button>
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
              </>
            )}

            {activeProductType === 'database' && (
              <>
                {/* ── DB: DB Family ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('dbFamily')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.dbFamily ? '' : '-rotate-90'}`} />
                        DATABASE FAMILY <Tooltip text="The broad category of the database system: Relational (SQL-based) or NoSQL."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedDbFamilies.length === DB_FAMILIES.length ? setSelectedDbFamilies([]) : setSelectedDbFamilies([...DB_FAMILIES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedDbFamilies.length === DB_FAMILIES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedDbFamilies.length === DB_FAMILIES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.dbFamily && (
                  <div className="flex flex-wrap gap-2">
                    {DB_FAMILIES.map(f => (
                      <button key={f} onClick={() => toggleFilter(selectedDbFamilies, setSelectedDbFamilies, f)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedDbFamilies.includes(f) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── DB: Geography ── */}
                <section className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('geography')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.geography ? '' : '-rotate-90'}`} />
                        Geography <Tooltip text="Geographic region where the database is deployed."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedGeographies.length === GEOGRAPHIES.length ? setSelectedGeographies([]) : setSelectedGeographies([...GEOGRAPHIES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedGeographies.length === GEOGRAPHIES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedGeographies.length === GEOGRAPHIES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.geography && (
                  <div className="flex flex-wrap gap-2">
                    {GEOGRAPHIES.map(geo => (
                      <button key={geo} onClick={() => toggleFilter(selectedGeographies, setSelectedGeographies, geo)}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all border ${selectedGeographies.includes(geo) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {geo}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── DB: Engine ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('engine')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.engine ? '' : '-rotate-90'}`} />
                        DATABASE ENGINE <Tooltip text="The database engine: PostgreSQL, MySQL, SQL Server, Oracle DB, etc."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedEngines.length === DB_ENGINES.length ? setSelectedEngines([]) : setSelectedEngines([...DB_ENGINES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedEngines.length === DB_ENGINES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedEngines.length === DB_ENGINES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.engine && (
                  <div className="flex flex-wrap gap-2">
                    {DB_ENGINES.map(eng => (
                      <button key={eng} onClick={() => toggleFilter(selectedEngines, setSelectedEngines, eng)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedEngines.includes(eng) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {eng}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── DB: Deployment Type ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('deploymentType')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.deploymentType ? '' : '-rotate-90'}`} />
                        Deployment <Tooltip text="Provisioned: fixed instance size billed hourly. Serverless: auto-scales, billed per compute unit consumed."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedDeploymentTypes.length === DEPLOYMENT_TYPES.length ? setSelectedDeploymentTypes([]) : setSelectedDeploymentTypes([...DEPLOYMENT_TYPES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedDeploymentTypes.length === DEPLOYMENT_TYPES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedDeploymentTypes.length === DEPLOYMENT_TYPES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.deploymentType && (
                  <div className="flex flex-wrap gap-2">
                    {DEPLOYMENT_TYPES.map(dt => (
                      <button key={dt} onClick={() => toggleFilter(selectedDeploymentTypes, setSelectedDeploymentTypes, dt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedDeploymentTypes.includes(dt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {dt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── DB: HA Mode ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('haMode')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.haMode ? '' : '-rotate-90'}`} />
                        HIGH-AVAILABILITY <Tooltip text="High-availability configuration: Single AZ (no redundancy), Multi AZ (same-region standby), Zone Redundant, or Multi Region (geo-redundant)."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedHaModes.length === HA_MODES.length ? setSelectedHaModes([]) : setSelectedHaModes([...HA_MODES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedHaModes.length === HA_MODES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedHaModes.length === HA_MODES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.haMode && (
                  <div className="flex flex-wrap gap-2">
                    {HA_MODES.map(hm => (
                      <button key={hm} onClick={() => toggleFilter(selectedHaModes, setSelectedHaModes, hm)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedHaModes.includes(hm) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {hm}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
              </>
            )}

            {/* Serverless: Language Filter */}
            {activeProductType === 'serverless' && (
              <>
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('languages')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.languages ? '' : '-rotate-90'}`} />
                        Language Support <Tooltip text="Filter by programming language runtime: Python, Node.js, Go, Java, C#, Ruby, JavaScript, PHP, PowerShell, Rust, TypeScript, or container-based deployments."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessLanguages.length === SERVERLESS_LANGUAGES.length ? setSelectedServerlessLanguages([]) : setSelectedServerlessLanguages([...SERVERLESS_LANGUAGES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessLanguages.length === SERVERLESS_LANGUAGES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessLanguages.length === SERVERLESS_LANGUAGES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.languages && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_LANGUAGES.map(lang => (
                      <button key={lang} onClick={() => toggleFilter(selectedServerlessLanguages, setSelectedServerlessLanguages, lang)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessLanguages.includes(lang) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {lang}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* Serverless: Cold Start Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('coldStart')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.coldStart ? '' : '-rotate-90'}`} />
                        Cold Start (MS) <Tooltip text="Filter by cold start latency: Fast (< 100ms), Medium (100-200ms), or Slow (> 200ms)."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessColdStart.length === SERVERLESS_COLD_START_OPTIONS.length ? setSelectedServerlessColdStart([]) : setSelectedServerlessColdStart([...SERVERLESS_COLD_START_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessColdStart.length === SERVERLESS_COLD_START_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessColdStart.length === SERVERLESS_COLD_START_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.coldStart && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_COLD_START_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessColdStart, setSelectedServerlessColdStart, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessColdStart.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* Serverless: Timeout Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('timeout')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.timeout ? '' : '-rotate-90'}`} />
                        Timeout (Min) <Tooltip text="Filter by execution timeout: Short (5), Medium (10), or Long (15+)."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessTimeout.length === SERVERLESS_TIMEOUT_OPTIONS.length ? setSelectedServerlessTimeout([]) : setSelectedServerlessTimeout([...SERVERLESS_TIMEOUT_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessTimeout.length === SERVERLESS_TIMEOUT_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessTimeout.length === SERVERLESS_TIMEOUT_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.timeout && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_TIMEOUT_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessTimeout, setSelectedServerlessTimeout, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessTimeout.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* Serverless: Memory Configuration Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('memoryConfig')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.memoryConfig ? '' : '-rotate-90'}`} />
                        Memory Config <Tooltip text="Filter by memory configuration: Configurable, Tiers, or Automatic."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessMemoryConfig.length === SERVERLESS_MEMORY_CONFIG_OPTIONS.length ? setSelectedServerlessMemoryConfig([]) : setSelectedServerlessMemoryConfig([...SERVERLESS_MEMORY_CONFIG_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessMemoryConfig.length === SERVERLESS_MEMORY_CONFIG_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessMemoryConfig.length === SERVERLESS_MEMORY_CONFIG_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.memoryConfig && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_MEMORY_CONFIG_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessMemoryConfig, setSelectedServerlessMemoryConfig, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessMemoryConfig.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* Serverless: Free Tier Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('freeTier')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.freeTier ? '' : '-rotate-90'}`} />
                        Free Tier <Tooltip text="Filter by free tier availability: Included or Not included."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessFreeTier.length === SERVERLESS_FREE_TIER_OPTIONS.length ? setSelectedServerlessFreeTier([]) : setSelectedServerlessFreeTier([...SERVERLESS_FREE_TIER_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessFreeTier.length === SERVERLESS_FREE_TIER_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessFreeTier.length === SERVERLESS_FREE_TIER_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.freeTier && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_FREE_TIER_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessFreeTier, setSelectedServerlessFreeTier, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessFreeTier.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
                {/* Serverless: Granularity Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('granularity')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.granularity ? '' : '-rotate-90'}`} />
                        Billing Granularity (MS) <Tooltip text="Filter by minimum billing increment (e.g., 1ms vs 100ms)."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessGranularity.length === SERVERLESS_GRANULARITY_OPTIONS.length ? setSelectedServerlessGranularity([]) : setSelectedServerlessGranularity([...SERVERLESS_GRANULARITY_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessGranularity.length === SERVERLESS_GRANULARITY_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessGranularity.length === SERVERLESS_GRANULARITY_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.granularity && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_GRANULARITY_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessGranularity, setSelectedServerlessGranularity, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessGranularity.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* Serverless: Execution Model Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('executionModel')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.executionModel ? '' : '-rotate-90'}`} />
                        Execution Model <Tooltip text="Filter by supported deployment formats: Code (ZIP), Container Image, or Both."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessExecutionModel.length === SERVERLESS_EXECUTION_MODEL_OPTIONS.length ? setSelectedServerlessExecutionModel([]) : setSelectedServerlessExecutionModel([...SERVERLESS_EXECUTION_MODEL_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessExecutionModel.length === SERVERLESS_EXECUTION_MODEL_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessExecutionModel.length === SERVERLESS_EXECUTION_MODEL_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.executionModel && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_EXECUTION_MODEL_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessExecutionModel, setSelectedServerlessExecutionModel, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessExecutionModel.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* Serverless: Provisioned Concurrency Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('provisionedConcurrency')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.provisionedConcurrency ? '' : '-rotate-90'}`} />
                        Prov. Concurrency <Tooltip text="Filter by ability to pay for pre-warmed instances."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessProvisionedConcurrency.length === SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS.length ? setSelectedServerlessProvisionedConcurrency([]) : setSelectedServerlessProvisionedConcurrency([...SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessProvisionedConcurrency.length === SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessProvisionedConcurrency.length === SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.provisionedConcurrency && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessProvisionedConcurrency, setSelectedServerlessProvisionedConcurrency, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessProvisionedConcurrency.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* Serverless: Ephemeral Storage Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('ephemeralStorage')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.ephemeralStorage ? '' : '-rotate-90'}`} />
                        Max Storage (GB) <Tooltip text="Filter by maximum available temporary disk space."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessEphemeralStorage.length === SERVERLESS_EPHEMERAL_STORAGE_OPTIONS.length ? setSelectedServerlessEphemeralStorage([]) : setSelectedServerlessEphemeralStorage([...SERVERLESS_EPHEMERAL_STORAGE_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessEphemeralStorage.length === SERVERLESS_EPHEMERAL_STORAGE_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessEphemeralStorage.length === SERVERLESS_EPHEMERAL_STORAGE_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.ephemeralStorage && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_EPHEMERAL_STORAGE_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessEphemeralStorage, setSelectedServerlessEphemeralStorage, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessEphemeralStorage.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
              </>
            )}

            {/* Containers Filters */}
            {activeProductType === 'containers' && (
              <>
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('containersOrchestrator')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.containersOrchestrator ? '' : '-rotate-90'}`} />
                        Orchestrator <Tooltip text="The container management system."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedContainersOrchestrators.length === CONTAINERS_ORCHESTRATORS.length ? setSelectedContainersOrchestrators([]) : setSelectedContainersOrchestrators([...CONTAINERS_ORCHESTRATORS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedContainersOrchestrators.length === CONTAINERS_ORCHESTRATORS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedContainersOrchestrators.length === CONTAINERS_ORCHESTRATORS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.containersOrchestrator && (
                  <div className="flex flex-wrap gap-2">
                    {CONTAINERS_ORCHESTRATORS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedContainersOrchestrators, setSelectedContainersOrchestrators, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedContainersOrchestrators.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('containersComputeType')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.containersComputeType ? '' : '-rotate-90'}`} />
                        Compute Type <Tooltip text="Serverless (pay per request) or Provisioned (pay for nodes)."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedContainersComputeTypes.length === CONTAINERS_COMPUTE_TYPES.length ? setSelectedContainersComputeTypes([]) : setSelectedContainersComputeTypes([...CONTAINERS_COMPUTE_TYPES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedContainersComputeTypes.length === CONTAINERS_COMPUTE_TYPES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedContainersComputeTypes.length === CONTAINERS_COMPUTE_TYPES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.containersComputeType && (
                  <div className="flex flex-wrap gap-2">
                    {CONTAINERS_COMPUTE_TYPES.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedContainersComputeTypes, setSelectedContainersComputeTypes, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedContainersComputeTypes.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('containersArchitecture')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.containersArchitecture ? '' : '-rotate-90'}`} />
                        Architecture <Tooltip text="CPU Architecture for the container node."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedContainersArchitectures.length === CONTAINERS_ARCHITECTURES.length ? setSelectedContainersArchitectures([]) : setSelectedContainersArchitectures([...CONTAINERS_ARCHITECTURES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedContainersArchitectures.length === CONTAINERS_ARCHITECTURES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedContainersArchitectures.length === CONTAINERS_ARCHITECTURES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.containersArchitecture && (
                  <div className="flex flex-wrap gap-2">
                    {CONTAINERS_ARCHITECTURES.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedContainersArchitectures, setSelectedContainersArchitectures, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedContainersArchitectures.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('containersBillingGranularity')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.containersBillingGranularity ? '' : '-rotate-90'}`} />
                        Billing Granularity <Tooltip text="Billing granularity for containers."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedContainersBillingGranularity.length === CONTAINERS_BILLING_GRANULARITY.length ? setSelectedContainersBillingGranularity([]) : setSelectedContainersBillingGranularity([...CONTAINERS_BILLING_GRANULARITY]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedContainersBillingGranularity.length === CONTAINERS_BILLING_GRANULARITY.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedContainersBillingGranularity.length === CONTAINERS_BILLING_GRANULARITY.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.containersBillingGranularity && (
                  <div className="flex flex-wrap gap-2">
                    {CONTAINERS_BILLING_GRANULARITY.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedContainersBillingGranularity, setSelectedContainersBillingGranularity, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedContainersBillingGranularity.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
              </>
            )}

            {activeProductType === 'networking' && (
              <>
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('networkingService')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.networkingService ? '' : '-rotate-90'}`} />
                        Service <Tooltip text="Networking Service Type"><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedNetworkingServices.length === NETWORKING_SERVICES.length ? setSelectedNetworkingServices([]) : setSelectedNetworkingServices([...NETWORKING_SERVICES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedNetworkingServices.length === NETWORKING_SERVICES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedNetworkingServices.length === NETWORKING_SERVICES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.networkingService && (
                  <div className="flex flex-wrap gap-2">
                    {NETWORKING_SERVICES.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedNetworkingServices, setSelectedNetworkingServices, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedNetworkingServices.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('networkingConnectionType')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.networkingConnectionType ? '' : '-rotate-90'}`} />
                        Connection Type <Tooltip text="Multipoint vs Point-to-Point"><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                  </div>
                  {expanded.networkingConnectionType && (
                  <div className="flex flex-wrap gap-2">
                    {NETWORKING_CONNECTION_TYPES.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedNetworkingConnectionTypes, setSelectedNetworkingConnectionTypes, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedNetworkingConnectionTypes.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('networkingRoutingType')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.networkingRoutingType ? '' : '-rotate-90'}`} />
                        Routing Type <Tooltip text="Dynamic (e.g. BGP) vs Fixed"><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                  </div>
                  {expanded.networkingRoutingType && (
                  <div className="flex flex-wrap gap-2">
                    {NETWORKING_ROUTING_TYPES.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedNetworkingRoutingTypes, setSelectedNetworkingRoutingTypes, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedNetworkingRoutingTypes.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('networkingHaSupport')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.networkingHaSupport ? '' : '-rotate-90'}`} />
                        High Availability <Tooltip text="Built-in redundancy"><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                  </div>
                  {expanded.networkingHaSupport && (
                  <div className="flex flex-wrap gap-2">
                    {NETWORKING_HA_SUPPORT.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedNetworkingHaSupport, setSelectedNetworkingHaSupport, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedNetworkingHaSupport.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('networkingVpcSupport')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.networkingVpcSupport ? '' : '-rotate-90'}`} />
                        VPC Integration <Tooltip text="Connects to Private VPCs"><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                  </div>
                  {expanded.networkingVpcSupport && (
                  <div className="flex flex-wrap gap-2">
                    {NETWORKING_VPC_SUPPORT.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedNetworkingVpcSupport, setSelectedNetworkingVpcSupport, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedNetworkingVpcSupport.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('networkingTransferDirection')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.networkingTransferDirection ? '' : '-rotate-90'}`} />
                        Transfer Direction <Tooltip text="Direction of network traffic"><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                  </div>
                  {expanded.networkingTransferDirection && (
                  <div className="flex flex-wrap gap-2">
                    {NETWORKING_DIRECTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedNetworkingDirections, setSelectedNetworkingDirections, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedNetworkingDirections.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
              </>
            )}

            {activeProductType === 'data-analytics' && (
              <>
                {/* ── Data-Analytics: Engine ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('engine')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.engine ? '' : '-rotate-90'}`} />
                        ENGINE <Tooltip text="The analytics engine: Databricks, Snowflake, BigQuery, etc."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedAnalyticsEngines.length === ANALYTICS_ENGINES.length ? setSelectedAnalyticsEngines([]) : setSelectedAnalyticsEngines([...ANALYTICS_ENGINES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedAnalyticsEngines.length === ANALYTICS_ENGINES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedAnalyticsEngines.length === ANALYTICS_ENGINES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.engine && (
                  <div className="flex flex-wrap gap-2">
                    {ANALYTICS_ENGINES.map(e => (
                      <button key={e} onClick={() => toggleFilter(selectedAnalyticsEngines, setSelectedAnalyticsEngines, e)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedAnalyticsEngines.includes(e) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── Data-Analytics: Deployment Type ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('deploymentType')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.deploymentType ? '' : '-rotate-90'}`} />
                        DEPLOYMENT TYPE <Tooltip text="Serverless or Provisioned deployment."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedAnalyticsDeploymentTypes.length === ANALYTICS_DEPLOYMENT_TYPES.length ? setSelectedAnalyticsDeploymentTypes([]) : setSelectedAnalyticsDeploymentTypes([...ANALYTICS_DEPLOYMENT_TYPES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedAnalyticsDeploymentTypes.length === ANALYTICS_DEPLOYMENT_TYPES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedAnalyticsDeploymentTypes.length === ANALYTICS_DEPLOYMENT_TYPES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.deploymentType && (
                  <div className="flex flex-wrap gap-2">
                    {ANALYTICS_DEPLOYMENT_TYPES.map(d => (
                      <button key={d} onClick={() => toggleFilter(selectedAnalyticsDeploymentTypes, setSelectedAnalyticsDeploymentTypes, d)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedAnalyticsDeploymentTypes.includes(d) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── Data-Analytics: Tier ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('tier')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.tier ? '' : '-rotate-90'}`} />
                        TIER <Tooltip text="Standard, Premium, or Enterprise tier."><Info size={10} className="cursor-help" /></Tooltip>
                      </button>
                    </h2>
                    <button onClick={() => { selectedAnalyticsTiers.length === ANALYTICS_TIERS.length ? setSelectedAnalyticsTiers([]) : setSelectedAnalyticsTiers([...ANALYTICS_TIERS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedAnalyticsTiers.length === ANALYTICS_TIERS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedAnalyticsTiers.length === ANALYTICS_TIERS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.tier && (
                  <div className="flex flex-wrap gap-2">
                    {ANALYTICS_TIERS.map(t => (
                      <button key={t} onClick={() => toggleFilter(selectedAnalyticsTiers, setSelectedAnalyticsTiers, t)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedAnalyticsTiers.includes(t) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
              </>
            )}

            {/* Range Sliders Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="m-0">
                  <button
                    onClick={() => toggleSection('specs')}
                    className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ChevronDown size={10} className={`transition-transform ${expanded.specs ? '' : '-rotate-90'}`} />
                    Specs & Price <Tooltip text="Filter by vCPU count, memory size (GB), and hourly price ($). Prices are on-demand (PAYG) USD."><Info size={10} className="cursor-help" /></Tooltip>
                  </button>
                </h2>
                <button
                  onClick={() => {
                    setVCpuRange({ ...DEFAULT_VCPU_RANGE });
                    setMemoryRange({ ...DEFAULT_MEMORY_RANGE });
                    setPriceRange({ ...DEFAULT_PRICE_RANGE });
                  }}
                  className={`text-[10px] font-bold uppercase transition-colors ${
                    vCpuRange.min !== DEFAULT_VCPU_RANGE.min || vCpuRange.max !== DEFAULT_VCPU_RANGE.max ||
                    memoryRange.min !== DEFAULT_MEMORY_RANGE.min || memoryRange.max !== DEFAULT_MEMORY_RANGE.max ||
                    priceRange.min !== DEFAULT_PRICE_RANGE.min || priceRange.max !== DEFAULT_PRICE_RANGE.max
                      ? 'text-black dark:text-white'
                      : 'text-[#737373] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Clear All
                </button>
              </div>
              {expanded.specs && (
              <div className="space-y-8 px-1">
                {activeProductType !== 'networking' && (
                  <>
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-[#737373]">vCPU</div>
                      <RangeSlider
                        min={DEFAULT_VCPU_RANGE.min}
                        max={DEFAULT_VCPU_RANGE.max}
                        value={vCpuRange}
                        onChange={setVCpuRange}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-[#737373]">Memory (GB)</div>
                      <RangeSlider
                        min={DEFAULT_MEMORY_RANGE.min}
                        max={DEFAULT_MEMORY_RANGE.max}
                        value={memoryRange}
                        onChange={setMemoryRange}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[#737373]">Hourly price ($)</div>
                  <RangeSlider
                    min={DEFAULT_PRICE_RANGE.min}
                    max={DEFAULT_PRICE_RANGE.max}
                    step={0.1}
                    unit="$"
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                </div>
              </div>
              )}
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            {/* Pricing Mode Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="m-0">
                  <button
                    onClick={() => toggleSection('pricing')}
                    className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ChevronDown size={10} className={`transition-transform ${expanded.pricing ? '' : '-rotate-90'}`} />
                    PAYG OR YEARLY PRICE <Tooltip text="PAYG shows the on-demand hourly price. Yearly multiplies the hourly price by 8,760 hours for a rough annual estimate (no committed-use discounts applied)."><Info size={10} className="cursor-help" /></Tooltip>
                  </button>
                </h2>
              </div>
              {expanded.pricing && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowAggregation(false)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                    !showAggregation
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                  }`}
                >
                  PAYG
                </button>
                <button
                  onClick={() => setShowAggregation(true)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                    showAggregation
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                  }`}
                >
                  Yearly
                </button>
              </div>
              )}
            </section>
          </div>
        </aside>


        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col bg-white dark:bg-[#000000]">

          {/* Provider Summary Cards */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-px bg-[#e5e5e5] dark:bg-[#262626]">
            {PROVIDERS.filter(p => !p.soon).map(p => {
              const activeNonSoon = PROVIDERS.filter(pr => !pr.soon).map(pr => pr.id);
              const isSelected = selectedProviders.length === activeNonSoon.length || selectedProviders.includes(p.id);

              const filteredCount = providerCounts[p.id];
              const dbProvider = dbStatus?.providers.find(dp => dp.slug === p.id || dp.slug === p.name.toLowerCase());
              const dbCount = dbProvider ? parseInt(dbProvider.count) : 0;
              // Deselected providers contribute 0 to the visible pool. For selected
              // providers, prefer the filter-aware count; fall back to the DB total
              // before the first fetch resolves.
              const displayCount = isSelected ? (isInitialFetch ? dbCount : (filteredCount || 0)) : 0;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (p.soon) return;
                    if (selectedProviders.includes(p.id) && selectedProviders.length === 1) {
                      setSelectedProviders(activeNonSoon);
                    } else {
                      setSelectedProviders([p.id]);
                    }
                  }}
                  className={`bg-white dark:bg-[#000000] py-2.5 px-4 flex items-center justify-between group transition-all border-b-2 ${
                    p.soon ? 'cursor-default opacity-40 grayscale' : 'cursor-pointer'
                  } ${
                    isSelected ? 'border-black dark:border-white' : 'border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* Provider label uses the same rounded-pill treatment as
                        the Provider column in the table — same colour token,
                        same shape, same uppercase styling — so the cards and
                        the table read as one coherent visual system. */}
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                      style={{ color: p.color, borderColor: p.color + '50', backgroundColor: p.color + '18' }}
                    >
                      {p.name}
                    </span>
                    {p.soon && <span className="text-[7px] font-bold bg-[#737373] text-white px-1 rounded ml-1 border border-white/20">SOON</span>}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-black dark:text-white">{p.soon ? '-' : displayCount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Toolbar */}
          <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-[#000000] border-b border-[#e5e5e5] dark:border-[#262626]">
            <div className="flex items-center gap-6">
              <span className="text-xl font-bold text-black dark:text-white shrink-0">
                {totalFilteredCount.toLocaleString()}
                {totalFilteredCount > data.length && data.length > 0 && (
                  <span className="ml-2 text-[10px] font-normal text-[#a3a3a3]">(top {data.length.toLocaleString()} shown)</span>
                )}
              </span>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded px-10 py-2 text-xs w-48 md:w-64 focus:outline-none focus:border-black/10 dark:focus:border-white/20 transition-all placeholder:text-[#a3a3a3]"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-[#737373] dark:text-[#525252] font-medium">Click a column header to sort</span>

              <button className="flex items-center gap-2 text-[10px] font-bold text-[#737373] dark:text-[#a3a3a3] border border-[#e5e5e5] dark:border-[#262626] px-3 py-1.5 rounded hover:bg-[#f5f5f5] dark:hover:bg-[#171717] transition-all">
                <Download size={12} /> Export
              </button>
            </div>
          </div>

          {/* Main Pricing Table */}
          {/* minHeight:0 — flex-1 defaults to min-height:auto which lets this
              div grow to fit all rows; the parent's overflow-hidden then clips
              the bottom edge (where the horizontal scrollbar lives). Forcing
              minHeight:0 keeps the div inside the parent's bounds so the h-scroll
              bar stays at the bottom of the viewport, not buried under content.
              overflowX:scroll — always reserve the h-scrollbar track so it's
              visible even before the user discovers there's more to the right.
              scroll-fade-right (conditional) — adds a right-edge fade as a
              fallback hint for browsers that hide the native scrollbar. */}
          <div
            ref={tableScrollRef}
            className={`flex-1 custom-scrollbar ${hasHorizontalOverflow && !scrolledToEnd ? 'scroll-fade-right' : ''}`}
            style={{ minHeight: 0, overflowY: 'auto', overflowX: 'scroll' }}
          >
            {/* Explicit-width block wrapper so overflow-auto reliably detects
                horizontal overflow and shows the scrollbar in all browsers. */}
            <div className="w-full">
              <table className="border-collapse w-full table-auto">
                <thead className="sticky top-0 bg-white dark:bg-[#000000] z-10 border-b border-[#e5e5e5] dark:border-[#262626]">
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-[#171717] dark:text-[#e5e5e5]">
                    <th data-col="provider" onClick={() => handleHeaderClick('provider')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                      Provider <SortIcon sortKey="provider" />
                      
                    </th>
                    <th data-col="instance_type" onClick={() => handleHeaderClick('instance_type')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                      SKU <SortIcon sortKey="instance_type" />
                      
                    </th>
                    {activeProductType === 'database' ? (
                      <>
                        <th data-col="engine_category" onClick={() => handleHeaderClick('attributes.engine')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Engine <SortIcon sortKey="attributes.engine" />
                          
                        </th>
                        <th data-col="db_family_cpu_vendor" onClick={() => handleHeaderClick('attributes.tier')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Tier <SortIcon sortKey="attributes.tier" />
                          
                        </th>
                        <th data-col="deployment_arch" onClick={() => handleHeaderClick('attributes.deployment_type')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Deployment <SortIcon sortKey="attributes.deployment_type" />
                          
                        </th>
                        <th data-col="ha_mode_os" onClick={() => handleHeaderClick('attributes.ha_mode')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          HA Mode <SortIcon sortKey="attributes.ha_mode" />
                          
                        </th>
                      </>
                    ) : activeProductType === 'data-analytics' ? (
                      <>
                        <th data-col="engine_category" onClick={() => handleHeaderClick('attributes.engine')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Engine <SortIcon sortKey="attributes.engine" />
                        </th>
                        <th data-col="deployment_arch" onClick={() => handleHeaderClick('attributes.deployment_type')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Deployment Type <SortIcon sortKey="attributes.deployment_type" />
                        </th>
                        <th data-col="db_family_cpu_vendor" onClick={() => handleHeaderClick('attributes.tier')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Tier <SortIcon sortKey="attributes.tier" />
                        </th>
                        <th data-col="vcpus" onClick={() => handleHeaderClick('vcpus')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Compute Unit <SortIcon sortKey="vcpus" />
                        </th>
                      </>
                    ) : activeProductType === 'serverless' ? (
                      <>
                        <th data-col="languages" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Languages
                        </th>
<th data-col="engine_category" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Cold Start (ms)
                          
                        </th>
                        <th data-col="db_family_cpu_vendor" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Timeout (sec)
                          
                        </th>
                        <th data-col="deployment_arch" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Memory Config
                          
                        </th>
                        <th data-col="ha_mode_os" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Free Tier
                          
                        </th>
                        <th data-col="granularity" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Granularity
                          
                        </th>
                        <th data-col="exec_model" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Exec. Model
                          
                        </th>
                        <th data-col="prov_concurrency" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Prov. Concurrency
                          
                        </th>
                        <th data-col="max_storage" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Max Storage
                          
                        </th>
                        <th data-col="inv_price" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Inv. Price ($/1M)
                          
                        </th>
                      </>
                    ) : activeProductType === 'containers' ? (
                      <>
                        <th data-col="engine_category" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Orchestrator
                        </th>
                        <th data-col="db_family_cpu_vendor" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Compute Type
                        </th>
                        <th data-col="deployment_arch" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Architecture
                        </th>
                        <th data-col="ha_mode_os" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Granularity
                        </th>
                        <th data-col="gpu" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          GPU
                        </th>
                      </>
                    ) : activeProductType === 'networking' ? (
                      <>
                        <th data-col="engine_category" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Service
                        </th>
                        <th data-col="db_family_cpu_vendor" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Category
                        </th>
                        <th data-col="deployment_arch" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Transfer Tier
                        </th>
                        <th data-col="ha_mode_os" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Destination
                        </th>
                        <th data-col="gpu" className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Included
                        </th>
                      </>
                    ) : (
                      <>
                        <th data-col="engine_category" onClick={() => handleHeaderClick('category')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Category <SortIcon sortKey="category" />
                          
                        </th>
                        <th data-col="db_family_cpu_vendor" onClick={() => handleHeaderClick('cpu_vendor')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          CPU Vendor <SortIcon sortKey="cpu_vendor" />
                          
                        </th>
                        <th data-col="deployment_arch" onClick={() => handleHeaderClick('arch')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Arch <SortIcon sortKey="arch" />
                          
                        </th>
                        <th data-col="ha_mode_os" onClick={() => handleHeaderClick('os')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          OS <SortIcon sortKey="os" />
                          
                        </th>
                        <th data-col="gpu" onClick={() => handleHeaderClick('gpu_count')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          GPU <SortIcon sortKey="gpu_count" />
                          
                        </th>
                      </>
                    )}
                    <th data-col="geography" onClick={() => handleHeaderClick('geography')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                      Geo <SortIcon sortKey="geography" />
                      
                    </th>
                    {activeProductType !== 'networking' && activeProductType !== 'data-analytics' && (
                      <>
                        <th data-col="vcpus" onClick={() => handleHeaderClick('vcpus')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          vCPU <SortIcon sortKey="vcpus" />
                          
                        </th>
                        <th data-col="memory_gb" onClick={() => handleHeaderClick('memory_gb')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Memory (GB) <SortIcon sortKey="memory_gb" />
                          
                        </th>
                      </>
                    )}
                    <th data-col="price_per_unit" onClick={() => handleHeaderClick('price_per_unit')} className="px-6 py-4 text-center font-bold text-black dark:text-white whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity relative" title="Double-click to auto-fit column width">
                      {showAggregation ? 'Yearly price ($)' : 'Hourly price ($)'} <SortIcon sortKey="price_per_unit" />
                      
                    </th>
                    <th data-col="source" onClick={() => handleHeaderClick('data_source')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                      Source <SortIcon sortKey="data_source" />
                      
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f5] dark:divide-[#181818]">
                  {loading ? (
                    Array.from({ length: 15 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 12 }).map((_, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-3 bg-[#f5f5f5] dark:bg-[#171717] rounded w-16 mx-auto"></div></td>
                        ))}
                      </tr>
                    ))
                  ) : data.length > 0 ? (
                    data.map((record, index) => (
                      <tr key={index} className={`transition-colors group ${index % 2 === 0 ? 'bg-white dark:bg-[#000000]' : 'bg-[#f7f7f7] dark:bg-[#0a0a0a]'} hover:bg-[#eef2ff] dark:hover:bg-[#111827]`}>
                        {/* Provider — shared */}
                        <td data-col="provider" className="px-6 py-4 whitespace-nowrap text-center">
                          {(() => {
                            const color = PROVIDERS.find(p => (record.provider || '').toLowerCase() === p.id || record.provider === p.name)?.color ?? '#525252';
                            return (
                              <span
                                className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border"
                                style={{ color, borderColor: color + '50', backgroundColor: color + '18' }}
                              >
                                {record.provider}
                              </span>
                            );
                          })()}
                        </td>
                        {/* SKU — shared */}
                        <td data-col="instance_type" className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-xs font-bold text-black dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">{record.instance_type}</span>
                        </td>
                        {/* Middle 4 columns — differ by product type */}
                        {activeProductType === 'database' ? (
                          <>
                            <td data-col="engine_category" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.engine || '—'}</span>
                            </td>
                            <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.category || '—'}</span>
                            </td>
                            <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest ${
                                record.attributes?.deployment_type === 'Serverless'
                                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                                  : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]'
                              }`}>{record.attributes?.deployment_type || 'Provisioned'}</span>
                            </td>
                            <td data-col="ha_mode_os" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.ha_mode || '—'}</span>
                            </td>
                          </>
                        ) : activeProductType === 'data-analytics' ? (
                          <>
                            <td data-col="engine_category" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.engine || '—'}</span>
                            </td>
                            <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest ${
                                record.attributes?.deployment_type === 'Serverless'
                                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                                  : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]'
                              }`}>{record.attributes?.deployment_type || 'Provisioned'}</span>
                            </td>
                            <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.tier || '—'}</span>
                            </td>
                            <td data-col="vcpus" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.vcpus || '—'}</span>
                            </td>
                          </>
                        ) : activeProductType === 'serverless' ? (
                          <>
                            <td data-col="languages" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
                                {record.attributes?.supportedLanguages ? (Array.isArray(record.attributes.supportedLanguages) ? record.attributes.supportedLanguages.join(', ') : record.attributes.supportedLanguages) : '—'}
                              </span>
                            </td>
                            <td data-col="engine_category" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.cold_start_overhead_ms || '—'}</span>
                            </td>
                            <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.timeout_seconds ? (Number(record.attributes.timeout_seconds) >= 60 ? `${Number(record.attributes.timeout_seconds) / 60} min` : `${record.attributes.timeout_seconds} sec`) : '—'}</span>
                            </td>
                            <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.memory_configuration ? (String(record.attributes.memory_configuration).toLowerCase().includes('configurable') ? 'Configurable' : String(record.attributes.memory_configuration).toLowerCase().includes('tier') ? 'Tiers' : String(record.attributes.memory_configuration).toLowerCase().includes('auto') ? 'Automatic' : record.attributes.memory_configuration) : '—'}</span>
                            </td>
                            <td data-col="ha_mode_os" className="px-6 py-4 whitespace-nowrap text-center">
                              {(() => {
                                const freeInvocations = record.attributes?.free_invocations_per_month;
                                const hasFreeTier = freeInvocations && Number(freeInvocations) > 0;
                                return (
                                  <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">
                                    {hasFreeTier ? 'Yes' : 'No'}
                                  </span>
                                );
                              })()}
                            </td>
                            <td data-col="granularity" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.billing_granularity_ms ? `${record.attributes.billing_granularity_ms}ms` : '—'}</span>
                            </td>
                            <td data-col="exec_model" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.execution_model || '—'}</span>
                            </td>
                            <td data-col="prov_concurrency" className="px-6 py-4 whitespace-nowrap text-center">
                              {(() => {
                                const provSupport = record.attributes?.provisioned_concurrency_support;
                                return (
                                  <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">
                                    {provSupport || '—'}
                                  </span>
                                );
                              })()}
                            </td>
                            <td data-col="max_storage" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.max_ephemeral_storage_gb ? `${record.attributes.max_ephemeral_storage_gb} GB` : '—'}</span>
                            </td>
                            <td data-col="inv_price" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.invocation_price_per_1m ? `$${Number(record.attributes.invocation_price_per_1m).toFixed(2)}` : '—'}</span>
                            </td>
                          </>
                        ) : activeProductType === 'containers' ? (
                          <>
                            <td data-col="engine_category" className="px-6 py-4 text-center whitespace-nowrap">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.orchestrator || '—'}</span>
                            </td>
                            <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.compute_type || '—'}</span>
                            </td>
                            <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
                                {record.attributes?.architecture || '—'}
                              </span>
                            </td>
                            <td data-col="ha_mode_os" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.billing_granularity || '—'}</span>
                            </td>
                            <td data-col="gpu" className="px-6 py-4 text-center whitespace-nowrap">
                              {record.gpu_count > 0
                                ? <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">GPU</span>
                                : <span className="text-[10px] font-bold text-[#d4d4d4] dark:text-[#404040]">—</span>
                              }
                            </td>
                          </>
                        ) : activeProductType === 'networking' ? (
                          <>
                            <td data-col="engine_category" className="px-6 py-4 text-center whitespace-nowrap">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.service || '—'}</span>
                            </td>
                            <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.category || '—'}</span>
                            </td>
                            <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.transfer_tier || '—'}</span>
                            </td>
                            <td data-col="ha_mode_os" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.destination || '—'}</span>
                            </td>
                            <td data-col="gpu" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.included_transfer || '—'}</span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td data-col="engine_category" className="px-6 py-4 text-center whitespace-nowrap">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.category || 'General purpose'}</span>
                            </td>
                            <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373] dark:text-[#a3a3a3]">{record.cpu_vendor || '—'}</span>
                            </td>
                            <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
                                {record.arch === 'x86 64' ? 'x86' : (record.arch || '—')}
                              </span>
                            </td>
                            <td data-col="ha_mode_os" className="px-6 py-4 font-bold text-[#737373] text-[10px] uppercase text-center whitespace-nowrap">{record.os || '—'}</td>
                            <td data-col="gpu" className="px-6 py-4 text-center whitespace-nowrap">
                              {record.gpu_count > 0
                                ? <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">GPU</span>
                                : <span className="text-[10px] font-bold text-[#d4d4d4] dark:text-[#404040]">—</span>
                              }
                            </td>
                          </>
                        )}
                        {/* Geography, vCPU, Memory, Price — shared */}
                        <td data-col="geography" className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.geography || '—'}</span>
                        </td>
                        {activeProductType !== 'networking' && activeProductType !== 'data-analytics' && (
                          <>
                            <td data-col="vcpus" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.vcpus || '—'}</span>
                            </td>
                            <td data-col="memory_gb" className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.memory_gb || '—'}</span>
                            </td>
                          </>
                        )}
                        <td data-col="price_per_unit" className="px-6 py-4 text-center whitespace-nowrap">
                          <span className="text-xs font-bold text-black dark:text-white">
                            {showAggregation
                              ? `$${(parseFloat(record.price_per_unit) * 8760).toFixed(2)}`
                              : `$${parseFloat(record.price_per_unit).toFixed(4)}`}
                          </span>
                        </td>
                        <td data-col="source" className="px-6 py-4 text-center whitespace-nowrap">
                          {record.data_source === 'static_config' ? (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">Static</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">API</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="px-6 py-32 text-center text-[#737373] dark:text-[#525252] italic text-sm">
                        <div className="flex flex-col items-center gap-4">
                          <span>No matches for your filters.</span>
                          {dbStatus && dbStatus.total === 0 && (
                            <div className="p-4 border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 rounded-lg max-w-md">
                              <p className="text-amber-800 dark:text-amber-400 font-bold mb-1">⚠️ Database is empty</p>
                              <p className="text-amber-700 dark:text-amber-500 text-xs not-italic">
                                It looks like the pricing data hasn't been ingested yet.
                                The pipeline runs automatically, but if this persists, try clicking "Support this project" to learn more.
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#050505] py-2 px-4 shrink-0 z-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-medium text-[#737373] dark:text-[#a3a3a3]">
            <span className="text-[#a3a3a3] dark:text-[#525252]">© 2026 Co-Sell Plus LLC</span>
            <Link to="/about" className="hover:text-black dark:hover:text-white transition-colors">About</Link>
            <Link to="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms of Use</Link>
            <a href="mailto:hello@comparecloudcosts.com" className="hover:text-black dark:hover:text-white transition-colors">Contact</a>
            
            <a href="https://www.digitalocean.com/?refcode=23d2b384f3b1&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
              <svg className="w-3 h-3 fill-[#0080FF]" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 0C5.408-.02.005 5.37.005 11.992h4.638c0-4.923 4.882-8.731 10.064-6.855a6.95 6.95 0 014.147 4.148c1.889 5.177-1.924 10.055-6.84 10.064v-4.61H7.391v4.623h4.61V24c7.86 0 13.967-7.588 11.397-15.83-1.115-3.59-3.985-6.446-7.575-7.575A12.8 12.8 0 0012.039 0zM7.39 19.362H3.828v3.564H7.39zm-3.563 0v-2.978H.85v2.978z"/></svg>
              DigitalOcean
            </a>

            <a href="https://github.com/rodrigo-orzari/ccc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
              GitHub
            </a>

            <a href="https://connect.intuit.com/pay/comparecloudcosts/scs-v1-d4824657f6fd4f78a6856dc5e82dd2429767f2a940be417e91832e441461fa61acbb2640b33e45d295200d2aafb687ca" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
              Support ❤️
            </a>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Scrollbar — clearly visible track + brighter thumb so users can see
           that more content exists in either direction.

           CRITICAL: do NOT set the standard scrollbar-width or scrollbar-color
           properties on .custom-scrollbar. In Chromium, setting either of those
           routes the element into the modern CSS scrollbar pipeline, which on
           macOS produces an OVERLAY scrollbar that takes 0px of layout space
           and disables every ::-webkit-scrollbar rule below. Verified live on
           Chrome 147 / macOS: removing scrollbar-width:auto restored a 14px
           layout-reserved scrollbar; reintroducing it collapsed it back to 0.

           Firefox (and any other browser without ::-webkit-scrollbar support)
           still gets a styled scrollbar via the @supports block below — we
           only enable the standard properties when webkit pseudo-elements
           are NOT supported, so the two paths never collide. */
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

        /* Fallback right-edge fade gradient so users know they can scroll right
           even on systems / browsers where the native scrollbar won't render. */
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
