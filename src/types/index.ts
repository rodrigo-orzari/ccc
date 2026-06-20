export type ProductType = 'vm' | 'database' | 'serverless' | 'containers' | 'networking' | 'storage' | 'data-analytics' | 'ai' | 'app-hosting' | 'security';

export interface PricingRecord {
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
  previous_price_per_unit?: string | null;
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
    service_type?: string;
    storage_type?: string;
    redundancy?: string;
    media?: string;
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
    orchestrator?: string;
    compute_type?: string;
    architecture?: string;
    billing_granularity?: string;
    transfer_tier?: string;
    destination?: string;
    included_transfer?: string;
    modelTier?: string;
    contextWindowK?: number | string;
    multimodal?: string;
    outputPricePer1M?: number | string;
    trainingCutoff?: string;
    billing_model?: string;
    usage_tier?: string;
    port_capacity?: string;
    transfer_scope?: string;
  };
}

export interface WorkloadParameter {
  id: string;
  label: string;
  type: 'slider' | 'number';
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface WorkloadComponent {
  id: string;
  name: string;
  description: string;
  icon: string;
  getRequirements: (params: Record<string, number>) => {
    productType: ProductType;
    minVcpus?: number;
    minMemoryGb?: number;
    category?: string;
    quantity: number;
  };
}

export interface WorkloadDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  parameters: WorkloadParameter[];
  components: WorkloadComponent[];
}
