export const ORACLE_ANALYTICS_REGION = 'us-ashburn-1';
export const ORACLE_ANALYTICS_GEOGRAPHY = 'N. America';

export interface OracleAnalyticsConfig {
  engine: string;
  tier: string;
  deploymentType: 'Provisioned' | 'Serverless';
  computeUnitName: string;
  pricePerUnit: number;
}

// Oracle Analytics Cloud (OAC) — Oracle's native BI and data analytics platform.
// Pricing is per OCPU-Hour (Oracle Compute Unit).
// Source: https://www.oracle.com/business-analytics/analytics-cloud/pricing/
//
// Also includes Oracle Data Integration Platform Cloud (DIPC) for ETL/pipeline workloads.
export const ORACLE_ANALYTICS_INSTANCES: OracleAnalyticsConfig[] = [
  // Oracle Analytics Cloud — Standard Edition (self-service BI, up to 25 OCPUs)
  {
    engine: 'Oracle Analytics Cloud',
    tier: 'Standard',
    deploymentType: 'Provisioned',
    computeUnitName: 'OCPU',
    pricePerUnit: 2.00,
  },
  // Oracle Analytics Cloud — Enterprise Edition (advanced ML, data prep, full feature set)
  {
    engine: 'Oracle Analytics Cloud',
    tier: 'Enterprise',
    deploymentType: 'Provisioned',
    computeUnitName: 'OCPU',
    pricePerUnit: 3.20,
  },
  // Oracle Autonomous Data Warehouse (ADW) — data warehouse with automatic tuning.
  // Priced per ECPU-Hour in the analytics context (Serverless mode).
  {
    engine: 'Oracle Analytics Cloud',
    tier: 'Premium',
    deploymentType: 'Serverless',
    computeUnitName: 'ECPU',
    pricePerUnit: 0.3078,
  },
];
