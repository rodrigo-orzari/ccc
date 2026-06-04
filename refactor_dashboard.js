import fs from 'fs';

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 1. Add Imports
if (!content.includes('@tanstack/react-query')) {
  content = content.replace(
    "import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';",
    "import React, { useState, useEffect, useCallback, useMemo, useRef, useDeferredValue } from 'react';\nimport { useQuery, keepPreviousData } from '@tanstack/react-query';"
  );
}

// 2. Remove manual state
content = content.replace(/const \[data, setData\] = useState\<PricingRecord\[\]\>\(\[\]\);\n/g, "");
content = content.replace(/const \[loading, setLoading\] = useState\(false\);\n/g, "");
content = content.replace(/const \[dbStatus, setDbStatus\] = useState\<\{[^}]*\} \| null\>\(null\);\n/g, "");
content = content.replace(/const \[providerCounts, setProviderCounts\] = useState\<Record\<string, number\>\>\(\{\}\);\n/g, "");

// 3. Extract parameter building into a hook or memoized function
const paramsLogic = `
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
      const res = await fetch(\`/api/health?\${debouncedParamsString}\`);
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
      const res = await fetch(\`/api/pricing/counts?\${debouncedParamsString}\`);
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
      const res = await fetch(\`/api/pricing?\${pricingParamsString}\`);
      if (!res.ok) throw new Error(\`Server returned \${res.status}\`);
      const json = await res.json();
      return Array.isArray(json) ? json : [];
    },
    enabled: canFetch,
    placeholderData: keepPreviousData,
  });
  
  const data = rawData || [];
`;

// Remove the old blocks safely
let lines = content.split('\n');

// Find exact start of health useEffect
let healthStart = -1;
for(let i = 0; i < lines.length; i++) {
  if (lines[i].includes('useEffect(() => {') && lines[i+1] && lines[i+1].includes("const isDb = activeProductType === 'database';")) {
    healthStart = i;
    break;
  }
}

let healthEnd = -1;
if (healthStart !== -1) {
  for(let i = healthStart; i < lines.length; i++) {
    if (lines[i].includes('vCpuRange, memoryRange, priceRange,')) {
      healthEnd = i + 1; // include the ']);' line
      break;
    }
  }
}

// Find fetchFilteredData
let fetchStart = -1;
for(let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const fetchFilteredData = useCallback(async () => {')) {
    fetchStart = i;
    break;
  }
}

let fetchEnd = -1;
if (fetchStart !== -1) {
  for(let i = fetchStart; i < lines.length; i++) {
    if (lines[i].includes('vCpuRange, memoryRange, priceRange, search, showAggregation,')) {
      fetchEnd = i + 1;
      break;
    }
  }
}

// Find debounce
let debounceStart = -1;
for(let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const timeout = setTimeout(fetchFilteredData, 300);')) {
    debounceStart = i - 1; // get the useEffect line
    break;
  }
}
let debounceEnd = debounceStart !== -1 ? debounceStart + 3 : -1;

// Splice them out from bottom to top!
if (debounceStart !== -1) lines.splice(debounceStart, debounceEnd - debounceStart + 1);
if (fetchStart !== -1) lines.splice(fetchStart, fetchEnd - fetchStart + 1);
if (healthStart !== -1) lines.splice(healthStart, healthEnd - healthStart + 1);

content = lines.join('\n');

// Inject the new React Query logic right after scrolledToEnd state
content = content.replace("  const [scrolledToEnd, setScrolledToEnd] = useState(false);", "  const [scrolledToEnd, setScrolledToEnd] = useState(false);\n" + paramsLogic);

// Also need to remove the setIsInitialFetch calls
content = content.replace(/setIsInitialFetch\(true\); /g, "");

fs.writeFileSync('src/pages/Dashboard.tsx', content);
console.log('Dashboard safely refactored for React Query.');
