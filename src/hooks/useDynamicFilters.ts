import { useQuery } from '@tanstack/react-query';
import * as config from '@/config';

export function useDynamicFilters() {
  const { data: dynamicData, isLoading } = useQuery({
    queryKey: ['dynamic-filters'],
    queryFn: async () => {
      const res = await fetch('/api/filters');
      if (!res.ok) throw new Error('Failed to fetch filters');
      return res.json();
    },
    staleTime: 600000, // 10 minutes
  });

  // Merge dynamic data with static config
  const merge = (staticList: string[], dynamicList?: string[]) => {
    if (!dynamicList || !Array.isArray(dynamicList)) return staticList;
    const combined = Array.from(new Set([...staticList, ...dynamicList]));
    return combined.sort((a, b) => {
      // Sort case insensitively but keep original casing
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
  };

  const CPU_PROFILES = (() => {
    const existingVendors = new Set(config.CPU_PROFILES.map(p => p.vendor));
    const newVendors = (dynamicData?.cpu_vendors || []).filter((v: string) => !existingVendors.has(v));
    const newProfiles = newVendors.map((v: string) => ({
      id: v.toLowerCase(),
      label: v,
      vendor: v,
      arch: dynamicData?.architectures?.[0] || 'x86 64' // Best guess fallback
    }));
    return [...config.CPU_PROFILES, ...newProfiles];
  })();

  return {
    isLoading,
    // Dynamically merged
    GEOGRAPHIES: merge(config.GEOGRAPHIES, dynamicData?.geographies),
    OS_TYPES: merge(config.OS_TYPES, dynamicData?.os_types),
    CATEGORIES: merge(config.CATEGORIES, dynamicData?.categories),
    DB_ENGINES: merge(config.DB_ENGINES, dynamicData?.engines),
    DEPLOYMENT_TYPES: merge(config.DEPLOYMENT_TYPES, dynamicData?.deployment_types),
    HA_MODES: merge(config.HA_MODES, dynamicData?.ha_modes),
    SERVERLESS_LANGUAGES: merge(config.SERVERLESS_LANGUAGES, dynamicData?.serverless_languages),
    ANALYTICS_TIERS: merge(config.ANALYTICS_TIERS, dynamicData?.tiers),
    AI_MODEL_TIERS: merge(config.AI_MODEL_TIERS, dynamicData?.ai_model_tiers),
    AI_CONTEXT_WINDOWS: merge(config.AI_CONTEXT_WINDOWS, dynamicData?.ai_context_windows),
    AI_MULTIMODAL_OPTIONS: merge(config.AI_MULTIMODAL_OPTIONS, dynamicData?.ai_multimodal),
    CONTAINERS_ORCHESTRATORS: merge(config.CONTAINERS_ORCHESTRATORS, dynamicData?.orchestrators),
    CONTAINERS_COMPUTE_TYPES: merge(config.CONTAINERS_COMPUTE_TYPES, dynamicData?.container_compute_types),
    CONTAINERS_ARCHITECTURES: merge(config.CONTAINERS_ARCHITECTURES, dynamicData?.container_architectures),
    CONTAINERS_BILLING_GRANULARITY: merge(config.CONTAINERS_BILLING_GRANULARITY, dynamicData?.billing_granularities),
    SERVERLESS_EXECUTION_MODEL_OPTIONS: merge(config.SERVERLESS_EXECUTION_MODEL_OPTIONS, dynamicData?.execution_models),
    SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS: merge(config.SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS, dynamicData?.provisioned_concurrency),
    NETWORKING_USAGE_TIERS: merge(config.NETWORKING_USAGE_TIERS, dynamicData?.transfer_tiers),
    NETWORKING_TRANSFER_SCOPES: merge(config.NETWORKING_TRANSFER_SCOPES, dynamicData?.destinations),
    CPU_PROFILES,
    
    // Pass through unchanged constants
    SERVERLESS_COLD_START_OPTIONS: config.SERVERLESS_COLD_START_OPTIONS,
    SERVERLESS_TIMEOUT_OPTIONS: config.SERVERLESS_TIMEOUT_OPTIONS,
    SERVERLESS_MEMORY_CONFIG_OPTIONS: config.SERVERLESS_MEMORY_CONFIG_OPTIONS,
    SERVERLESS_FREE_TIER_OPTIONS: config.SERVERLESS_FREE_TIER_OPTIONS,
    SERVERLESS_GRANULARITY_OPTIONS: config.SERVERLESS_GRANULARITY_OPTIONS,
    SERVERLESS_EPHEMERAL_STORAGE_OPTIONS: config.SERVERLESS_EPHEMERAL_STORAGE_OPTIONS,
    SERVERLESS_MEMORY_TIERS: config.SERVERLESS_MEMORY_TIERS,
    SERVERLESS_ARCHITECTURES: config.SERVERLESS_ARCHITECTURES,
    NETWORKING_SERVICES: merge(config.NETWORKING_SERVICES, dynamicData?.networking_services),
    NETWORKING_SERVICE_GROUPS: config.NETWORKING_SERVICE_GROUPS,
    NETWORKING_CONNECTION_TYPES: config.NETWORKING_CONNECTION_TYPES,
    NETWORKING_ROUTING_TYPES: config.NETWORKING_ROUTING_TYPES,
    NETWORKING_HA_SUPPORT: config.NETWORKING_HA_SUPPORT,
    NETWORKING_VPC_SUPPORT: config.NETWORKING_VPC_SUPPORT,
    NETWORKING_DIRECTIONS: config.NETWORKING_DIRECTIONS,
    NETWORKING_BILLING_MODELS: config.NETWORKING_BILLING_MODELS,
    NETWORKING_PORT_CAPACITIES: config.NETWORKING_PORT_CAPACITIES,
    ANALYTICS_ENGINES: config.ANALYTICS_ENGINES,
    ANALYTICS_DEPLOYMENT_TYPES: config.ANALYTICS_DEPLOYMENT_TYPES,
    AI_SERVICE_TYPES: config.AI_SERVICE_TYPES,
    DEFAULT_VCPU_RANGE: config.DEFAULT_VCPU_RANGE,
    DEFAULT_MEMORY_RANGE: config.DEFAULT_MEMORY_RANGE,
    DEFAULT_PRICE_RANGE: config.DEFAULT_PRICE_RANGE,
    PROVIDERS: config.PROVIDERS,
    DB_FAMILIES: merge(config.DB_FAMILIES, dynamicData?.db_families),
  };
}
