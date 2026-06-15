import fs from 'fs';

const variables = [
  ['selectedGeographies', 'GEOGRAPHIES', 'GEOGRAPHIES'],
  ['selectedOS', 'OS_TYPES', 'OS_TYPES'],
  ['selectedCpu', 'CPU_PROFILES', 'CPU_PROFILES', 'map(p => p.id)'],
  ['selectedCategory', 'CATEGORIES', 'CATEGORIES'],
  ['selectedDbFamilies', 'DB_FAMILIES', 'DB_FAMILIES'],
  ['selectedEngines', 'DB_ENGINES', 'DB_ENGINES'],
  ['selectedDeploymentTypes', 'DEPLOYMENT_TYPES', 'DEPLOYMENT_TYPES'],
  ['selectedHaModes', 'HA_MODES', 'HA_MODES'],
  ['selectedServerlessLanguages', 'SERVERLESS_LANGUAGES', 'SERVERLESS_LANGUAGES'],
  ['selectedServerlessColdStart', 'SERVERLESS_COLD_START_OPTIONS', 'SERVERLESS_COLD_START_OPTIONS'],
  ['selectedServerlessTimeout', 'SERVERLESS_TIMEOUT_OPTIONS', 'SERVERLESS_TIMEOUT_OPTIONS'],
  ['selectedServerlessMemoryConfig', 'SERVERLESS_MEMORY_CONFIG_OPTIONS', 'SERVERLESS_MEMORY_CONFIG_OPTIONS'],
  ['selectedServerlessFreeTier', 'SERVERLESS_FREE_TIER_OPTIONS', 'SERVERLESS_FREE_TIER_OPTIONS'],
  ['selectedServerlessGranularity', 'SERVERLESS_GRANULARITY_OPTIONS', 'SERVERLESS_GRANULARITY_OPTIONS'],
  ['selectedServerlessExecutionModel', 'SERVERLESS_EXECUTION_MODEL_OPTIONS', 'SERVERLESS_EXECUTION_MODEL_OPTIONS'],
  ['selectedServerlessProvisionedConcurrency', 'SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS', 'SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS'],
  ['selectedServerlessEphemeralStorage', 'SERVERLESS_EPHEMERAL_STORAGE_OPTIONS', 'SERVERLESS_EPHEMERAL_STORAGE_OPTIONS'],
  ['selectedServerlessMemory', 'SERVERLESS_MEMORY_TIERS', 'SERVERLESS_MEMORY_TIERS'],
  ['selectedServerlessArchitectures', 'SERVERLESS_ARCHITECTURES', 'SERVERLESS_ARCHITECTURES'],
  ['selectedContainersOrchestrators', 'CONTAINERS_ORCHESTRATORS', 'CONTAINERS_ORCHESTRATORS'],
  ['selectedContainersComputeTypes', 'CONTAINERS_COMPUTE_TYPES', 'CONTAINERS_COMPUTE_TYPES'],
  ['selectedContainersArchitectures', 'CONTAINERS_ARCHITECTURES', 'CONTAINERS_ARCHITECTURES'],
  ['selectedContainersBillingGranularity', 'CONTAINERS_BILLING_GRANULARITY', 'CONTAINERS_BILLING_GRANULARITY'],
  ['selectedAnalyticsEngines', 'ANALYTICS_ENGINES', 'ANALYTICS_ENGINES'],
  ['selectedAnalyticsDeploymentTypes', 'ANALYTICS_DEPLOYMENT_TYPES', 'ANALYTICS_DEPLOYMENT_TYPES'],
  ['selectedAnalyticsTiers', 'ANALYTICS_TIERS', 'ANALYTICS_TIERS'],
  ['selectedAiServiceTypes', 'AI_SERVICE_TYPES', 'AI_SERVICE_TYPES'],
  ['selectedAiModelTiers', 'AI_MODEL_TIERS', 'AI_MODEL_TIERS'],
  ['selectedAiContextWindows', 'AI_CONTEXT_WINDOWS', 'AI_CONTEXT_WINDOWS'],
  ['selectedAiMultimodalOptions', 'AI_MULTIMODAL_OPTIONS', 'AI_MULTIMODAL_OPTIONS'],
  ['selectedNetworkingServices', 'NETWORKING_SERVICES', 'NETWORKING_SERVICES'],
  ['selectedNetworkingConnectionTypes', 'NETWORKING_CONNECTION_TYPES', 'NETWORKING_CONNECTION_TYPES'],
  ['selectedNetworkingRoutingTypes', 'NETWORKING_ROUTING_TYPES', 'NETWORKING_ROUTING_TYPES'],
  ['selectedNetworkingHaSupport', 'NETWORKING_HA_SUPPORT', 'NETWORKING_HA_SUPPORT'],
  ['selectedNetworkingVpcSupport', 'NETWORKING_VPC_SUPPORT', 'NETWORKING_VPC_SUPPORT'],
  ['selectedNetworkingDirections', 'NETWORKING_DIRECTIONS', 'NETWORKING_DIRECTIONS'],
  ['selectedNetworkingBillingModels', 'NETWORKING_BILLING_MODELS', 'NETWORKING_BILLING_MODELS'],
  ['selectedNetworkingUsageTiers', 'NETWORKING_USAGE_TIERS', 'NETWORKING_USAGE_TIERS'],
  ['selectedNetworkingPortCapacities', 'NETWORKING_PORT_CAPACITIES', 'NETWORKING_PORT_CAPACITIES'],
  ['selectedNetworkingTransferScopes', 'NETWORKING_TRANSFER_SCOPES', 'NETWORKING_TRANSFER_SCOPES']
];

let syncCode = `
  const [filtersSynced, setFiltersSynced] = useState(false);
  useEffect(() => {
    if (!config.isLoading && !filtersSynced) {
`;

for (const [stateVar, configVar, staticVar, mapFn] of variables) {
  const mapStr = mapFn ? `.${mapFn}` : '';
  syncCode += `      if (${stateVar}.length === staticConfig.${staticVar}.length) set${stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}([...config.${configVar}${mapStr}]);\n`;
}

syncCode += `
      setFiltersSynced(true);
    }
  }, [config.isLoading, filtersSynced, config]);
`;

let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Insert import static config
content = content.replace(
  "import { useDynamicFilters } from '@/hooks/useDynamicFilters';",
  "import { useDynamicFilters } from '@/hooks/useDynamicFilters';\nimport * as staticConfig from '@/config';"
);

// Insert sync code right after activeProductType
content = content.replace(
  "const [activeProductType, setActiveProductType] = useState<ProductType>('vm');",
  "const [activeProductType, setActiveProductType] = useState<ProductType>('vm');\n" + syncCode
);

fs.writeFileSync('src/app/page.tsx', content, 'utf-8');
console.log('injected');
