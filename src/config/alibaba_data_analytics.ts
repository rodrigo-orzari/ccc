export const ALIBABA_ANALYTICS_REGION = 'ap-southeast-1'; // Singapore — primary international region
export const ALIBABA_ANALYTICS_GEOGRAPHY = 'Asia Pacific';

export interface AlibabaAnalyticsConfig {
  engine: string;
  tier: string;
  deploymentType: 'Provisioned' | 'Serverless';
  computeUnitName: string;
  pricePerUnit: number;
}

// MaxCompute (formerly ODPS) — Alibaba's native big data / data warehouse platform
// Direct equivalent of BigQuery (GCP) and Redshift (AWS).
// Pricing: reserved Compute Units (CUs) billed per hour.
// Source: https://www.alibabacloud.com/product/maxcompute/pricing (international)
export const ALIBABA_ANALYTICS_INSTANCES: AlibabaAnalyticsConfig[] = [
  // MaxCompute — Pay-As-You-Go (per SQL CU-Hour)
  {
    engine: 'MaxCompute',
    tier: 'Standard',
    deploymentType: 'Serverless',
    computeUnitName: 'CU',
    pricePerUnit: 0.044,
  },
  // MaxCompute — Subscription (reserved CU capacity, lower effective rate)
  {
    engine: 'MaxCompute',
    tier: 'Enterprise',
    deploymentType: 'Provisioned',
    computeUnitName: 'CU',
    pricePerUnit: 0.032,
  },
  // E-MapReduce — managed Apache Spark / Hadoop / Flink service
  // Base compute pricing per EMR Instance-Hour (ecs.c6.xlarge equivalent)
  // Comparable to AWS EMR or Databricks Community Edition
  {
    engine: 'E-MapReduce',
    tier: 'Standard',
    deploymentType: 'Provisioned',
    computeUnitName: 'Instance-Hr',
    pricePerUnit: 0.15,
  },
];
