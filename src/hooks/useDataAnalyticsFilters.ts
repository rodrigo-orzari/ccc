import { useState } from 'react';

const ANALYTICS_ENGINES = ['Databricks', 'Snowflake', 'Native'];
const ANALYTICS_DEPLOYMENT_TYPES = ['Serverless', 'Provisioned'];
// Full tier list must stay in sync with ANALYTICS_TIERS in src/config/index.ts
const ANALYTICS_TIERS = [
  'Standard',
  'Standard Edition',
  'Premium',
  'Enterprise',
  'Enterprise Edition',
  'Enterprise Plus',
  'Business Critical',
  'DC2 Node',
  'RA3 Node',
  'On-Demand',
];

/**
 * Data Analytics-specific filter state
 */
export function useDataAnalyticsFilters() {
  const [selectedAnalyticsEngines, setSelectedAnalyticsEngines] = useState<string[]>([...ANALYTICS_ENGINES]);
  const [selectedAnalyticsDeploymentTypes, setSelectedAnalyticsDeploymentTypes] = useState<string[]>([...ANALYTICS_DEPLOYMENT_TYPES]);
  const [selectedAnalyticsTiers, setSelectedAnalyticsTiers] = useState<string[]>([...ANALYTICS_TIERS]);

  return {
    selectedAnalyticsEngines,
    setSelectedAnalyticsEngines,
    selectedAnalyticsDeploymentTypes,
    setSelectedAnalyticsDeploymentTypes,
    selectedAnalyticsTiers,
    setSelectedAnalyticsTiers,
  };
}
