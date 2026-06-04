export const NATIVE_ANALYTICS_AWS_REGION = 'us-east-1';
export const NATIVE_ANALYTICS_GCP_REGION = 'us-central1';

export interface NativeAnalyticsConfig {
  provider: 'aws' | 'gcp';
  engine: string;
  tier: string;
  deploymentType: 'Provisioned' | 'Serverless';
  computeUnitName: string;
  pricePerNormalizedUnit: number;
}

export const NATIVE_ANALYTICS_INSTANCES: NativeAnalyticsConfig[] = [
  // AWS Redshift (Serverless - RPUs)
  // Normalization: 1 RPU = 1 Compute Unit
  { provider: 'aws', engine: 'Redshift', tier: 'Standard', deploymentType: 'Serverless', computeUnitName: 'RPU', pricePerNormalizedUnit: 0.36 },
  
  // AWS Redshift (Provisioned - Node Equivalent)
  // RA3 4xlarge is ~$3.26/hr, we map 1 Compute Unit to 1 Node for simplicity here.
  { provider: 'aws', engine: 'Redshift', tier: 'RA3 Node', deploymentType: 'Provisioned', computeUnitName: 'Node', pricePerNormalizedUnit: 3.26 },
  { provider: 'aws', engine: 'Redshift', tier: 'DC2 Node', deploymentType: 'Provisioned', computeUnitName: 'Node', pricePerNormalizedUnit: 0.25 },

  // GCP BigQuery (Capacity Pricing)
  // Normalization: 1 Compute Unit = 100 Slots
  // Standard Edition: ~$0.04 / slot / hr -> $4.00 / 100 slots
  // Enterprise Edition: ~$0.06 / slot / hr -> $6.00 / 100 slots
  // Enterprise Plus: ~$0.10 / slot / hr -> $10.00 / 100 slots
  { provider: 'gcp', engine: 'BigQuery', tier: 'Standard Edition', deploymentType: 'Provisioned', computeUnitName: '100 Slots', pricePerNormalizedUnit: 4.00 },
  { provider: 'gcp', engine: 'BigQuery', tier: 'Enterprise Edition', deploymentType: 'Provisioned', computeUnitName: '100 Slots', pricePerNormalizedUnit: 6.00 },
  { provider: 'gcp', engine: 'BigQuery', tier: 'Enterprise Plus', deploymentType: 'Provisioned', computeUnitName: '100 Slots', pricePerNormalizedUnit: 10.00 },

  // BigQuery On-Demand (Per TiB, but we map to a "Compute Unit" equivalent for the slider if needed, though usually it's hard to map)
  // We'll leave it as Serverless On-Demand mapped to 1 Unit = 1 TiB Scanned equivalent.
  { provider: 'gcp', engine: 'BigQuery', tier: 'On-Demand', deploymentType: 'Serverless', computeUnitName: 'TiB Scanned', pricePerNormalizedUnit: 6.25 },
];
