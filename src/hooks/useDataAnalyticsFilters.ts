import { useState } from 'react';

const ANALYTICS_ENGINES = ['Databricks', 'Snowflake', 'Native'];
const ANALYTICS_DEPLOYMENT_TYPES = ['Serverless', 'Provisioned'];
const ANALYTICS_TIERS = ['Standard', 'Premium', 'Enterprise'];

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
