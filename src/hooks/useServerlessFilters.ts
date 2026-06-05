import { useState } from 'react';

const SERVERLESS_LANGUAGES = ['Python', 'Node', 'Go', 'Java', 'C#', 'Ruby', 'JavaScript', 'PHP', 'Rust', 'PowerShell', 'TypeScript', 'Any (Container)'];
const SERVERLESS_COLD_START_OPTIONS = ['Fast (<100)', 'Medium (100-200)', 'Slow (>200)'];
const SERVERLESS_TIMEOUT_OPTIONS = ['Short (5)', 'Medium (10)', 'Long (15+)'];
const SERVERLESS_MEMORY_CONFIG_OPTIONS = ['Configurable', 'Tiers', 'Automatic'];
const SERVERLESS_FREE_TIER_OPTIONS = ['Yes', 'No'];
const SERVERLESS_GRANULARITY_OPTIONS = ['1', '100'];
const SERVERLESS_EXECUTION_MODEL_OPTIONS = ['Both', 'Code (ZIP)', 'Container Image'];
const SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS = ['Yes', 'No'];
const SERVERLESS_EPHEMERAL_STORAGE_OPTIONS = ['< 1', '1 - 5', '> 5'];

/**
 * Serverless-specific filter state
 */
export function useServerlessFilters() {
  const [selectedServerlessLanguages, setSelectedServerlessLanguages] = useState<string[]>([...SERVERLESS_LANGUAGES]);
  const [selectedServerlessColdStart, setSelectedServerlessColdStart] = useState<string[]>([...SERVERLESS_COLD_START_OPTIONS]);
  const [selectedServerlessTimeout, setSelectedServerlessTimeout] = useState<string[]>([...SERVERLESS_TIMEOUT_OPTIONS]);
  const [selectedServerlessMemoryConfig, setSelectedServerlessMemoryConfig] = useState<string[]>([...SERVERLESS_MEMORY_CONFIG_OPTIONS]);
  const [selectedServerlessFreeTier, setSelectedServerlessFreeTier] = useState<string[]>([...SERVERLESS_FREE_TIER_OPTIONS]);
  const [selectedServerlessGranularity, setSelectedServerlessGranularity] = useState<string[]>([...SERVERLESS_GRANULARITY_OPTIONS]);
  const [selectedServerlessExecutionModel, setSelectedServerlessExecutionModel] = useState<string[]>([...SERVERLESS_EXECUTION_MODEL_OPTIONS]);
  const [selectedServerlessProvisionedConcurrency, setSelectedServerlessProvisionedConcurrency] = useState<string[]>([...SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS]);
  const [selectedServerlessEphemeralStorage, setSelectedServerlessEphemeralStorage] = useState<string[]>([...SERVERLESS_EPHEMERAL_STORAGE_OPTIONS]);

  return {
    selectedServerlessLanguages,
    setSelectedServerlessLanguages,
    selectedServerlessColdStart,
    setSelectedServerlessColdStart,
    selectedServerlessTimeout,
    setSelectedServerlessTimeout,
    selectedServerlessMemoryConfig,
    setSelectedServerlessMemoryConfig,
    selectedServerlessFreeTier,
    setSelectedServerlessFreeTier,
    selectedServerlessGranularity,
    setSelectedServerlessGranularity,
    selectedServerlessExecutionModel,
    setSelectedServerlessExecutionModel,
    selectedServerlessProvisionedConcurrency,
    setSelectedServerlessProvisionedConcurrency,
    selectedServerlessEphemeralStorage,
    setSelectedServerlessEphemeralStorage,
  };
}
