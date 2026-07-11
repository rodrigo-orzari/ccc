import type { SponsorSlot } from '@/types';

// Geographic regions
export const GEOGRAPHIES = ['N. America', 'S. America', 'W. Europe', 'N. Europe', 'Mid East & Africa', 'Asia Pacific', 'Australia'];

// VM-specific constants
export const OS_TYPES = ['Linux', 'Windows'];
export const CPU_PROFILES = [
  { id: 'intel-x86', label: 'Intel (x86)', vendor: 'Intel', arch: 'x86 64' },
  { id: 'amd-x86', label: 'AMD (x86)', vendor: 'AMD', arch: 'x86 64' },
  { id: 'aws-arm', label: 'AWS Graviton (ARM)', vendor: 'AWS', arch: 'ARM' },
  { id: 'ampere-arm', label: 'Ampere (ARM)', vendor: 'Ampere', arch: 'ARM' },
];
export const CATEGORIES = ['General purpose', 'Compute optimized', 'Memory optimized', 'Storage optimized', 'Burstable', 'HPC'];
export const PRICING_MODELS = ['On-Demand', 'Spot / Preemptible'];

// Database-specific constants
export const DB_FAMILIES = ['Relational', 'NoSQL', 'Vector'];
export const DB_FAMILY_MAPPINGS: Record<string, string[]> = {
  'Relational': ['PostgreSQL', 'MySQL', 'MariaDB', 'SQL Server', 'Oracle DB'],
  'NoSQL': ['Cosmos DB', 'MongoDB', 'Redis', 'Valkey', 'DB2'],
  'Vector': ['Pinecone', 'Milvus', 'Qdrant', 'Weaviate', 'Chroma']
};
export const DB_ENGINES = ['PostgreSQL', 'MySQL', 'MariaDB', 'SQL Server', 'Oracle DB', 'Cosmos DB', 'MongoDB', 'Redis', 'Valkey', 'DB2', 'Pinecone', 'Milvus', 'Qdrant', 'Weaviate', 'Chroma'];
export const DEPLOYMENT_TYPES = ['Provisioned', 'Serverless'];
export const HA_MODES = ['Single AZ', 'Multi AZ', 'Zone Redundant', 'Multi Region', 'Geo Redundant'];

// Serverless-specific constants
export const SERVERLESS_LANGUAGES = ['Python', 'Node', 'Go', 'Java', 'C#', 'Ruby', 'JavaScript', 'PHP', 'Rust', 'PowerShell', 'TypeScript', 'Any'];
export const SERVERLESS_COLD_START_OPTIONS = ['Fast (<100)', 'Medium (100-200)', 'Slow (>200)'];
export const SERVERLESS_TIMEOUT_OPTIONS = ['Short (5)', 'Medium (10)', 'Long (15+)'];
export const SERVERLESS_MEMORY_CONFIG_OPTIONS = ['Configurable', 'Tiers', 'Automatic'];
export const SERVERLESS_FREE_TIER_OPTIONS = ['Yes', 'No'];
export const SERVERLESS_GRANULARITY_OPTIONS = ['1', '100'];
export const SERVERLESS_EXECUTION_MODEL_OPTIONS = ['Both', 'Code (ZIP)', 'Container Image'];
export const SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS = ['Yes', 'No'];
export const SERVERLESS_EPHEMERAL_STORAGE_OPTIONS = ['< 1', '1 - 5', '> 5'];
// Memory-size buckets (GB). Serverless rows span ~0.125 GB → 10 GB, so the shared
// 0–3200 GB spec slider is useless here; these buckets map to memory_gb ranges in api-utils.
export const SERVERLESS_MEMORY_TIERS = ['<= 512 MB', '512 MB - 2 GB', '2 - 4 GB', '> 4 GB'];
// CPU architecture. AWS Lambda is split x86 (Intel/AMD) vs ARM (Graviton); maps to pr.arch.
export const SERVERLESS_ARCHITECTURES = ['x86', 'ARM'];
// Service-type categorization for the Serverless tab. 'Compute' covers Lambda/Functions/Run
// (the historical Serverless contents); the rest were the standalone Integration category,
// folded in here so messaging/event/API/workflow services are evaluated alongside compute.
export const SERVERLESS_SERVICE_TYPES = ['Compute', 'API Gateway', 'Messaging', 'Eventing', 'Workflow'];

// Containers-specific constants
export const CONTAINERS_ORCHESTRATORS = ['Kubernetes', 'Serverless', 'Docker'];
export const CONTAINERS_COMPUTE_TYPES = ['Serverless', 'Provisioned', 'Managed Kubernetes'];
export const CONTAINERS_ARCHITECTURES = ['x86', 'ARM'];
export const CONTAINERS_BILLING_GRANULARITY = ['Second', 'Hour'];

// Networking-specific constants
export const NETWORKING_SERVICES = ['Data Transfer', 'Content Delivery Network (CDN)', 'Virtual Private Cloud (VPC)', 'Load Balancing', 'Dedicated Connection', 'Public IPv4', 'NAT Gateway', 'VPN Gateway', 'API Gateway'];
// Display-only grouping for the Service filter chips. Every NETWORKING_SERVICES
// entry must appear in exactly one group. Filtering logic still uses the flat list.
export const NETWORKING_SERVICE_GROUPS: { label: string; services: string[] }[] = [
  { label: 'Core & Transfer', services: ['Data Transfer', 'Virtual Private Cloud (VPC)'] },
  { label: 'Connectivity & Gateways', services: ['VPN Gateway', 'NAT Gateway', 'Dedicated Connection', 'API Gateway'] },
  { label: 'Delivery & Addressing', services: ['Load Balancing', 'Public IPv4', 'Content Delivery Network (CDN)'] },
];
export const NETWORKING_CONNECTION_TYPES = ['Multipoint', 'Point-to-Point'];
export const NETWORKING_ROUTING_TYPES = ['Dynamic', 'Fixed'];
export const NETWORKING_HA_SUPPORT = ['Yes', 'No'];
export const NETWORKING_VPC_SUPPORT = ['Yes', 'No'];
export const NETWORKING_DIRECTIONS = ['Egress', 'Ingress', 'Intra-Cloud'];
export const NETWORKING_BILLING_MODELS = ['Hourly Uptime', 'Data Processed (per GB)', 'Per Endpoint/Tunnel', 'Included'];
export const NETWORKING_USAGE_TIERS = ['Flat Rate', 'First 10TB', '10TB - 50TB', 'Over 10TB', 'Over Allowance', 'Included'];
export const NETWORKING_PORT_CAPACITIES = ['< 1 Gbps', '1 Gbps - 10 Gbps', '> 10 Gbps', 'N/A'];
export const NETWORKING_TRANSFER_SCOPES = ['Same Region', 'Cross-AZ', 'Cross-Region', 'Internet', 'On-Premises', 'N/A'];



// Data Analytics-specific constants
export const ANALYTICS_ENGINES = [
  'Databricks', 
  'Snowflake', 
  'Native',
  'Oracle Analytics Cloud',
  'Oracle Autonomous Data Warehouse',
  'OpenSearch',
  'Kafka',
  'MaxCompute',
  'E-MapReduce',
  'Hologres',
  'AnalyticDB for MySQL'
];
export const ANALYTICS_DEPLOYMENT_TYPES = ['Serverless', 'Provisioned'];
export const ANALYTICS_TIERS = [
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

// Range defaults
export const DEFAULT_VCPU_RANGE = { min: 0, max: 320 };
export const DEFAULT_MEMORY_RANGE = { min: 0, max: 3200 };
export const DEFAULT_SERVERLESS_VCPU_RANGE = { min: 0, max: 16 };
export const DEFAULT_SERVERLESS_MEMORY_RANGE = { min: 0, max: 32 };
export const DEFAULT_CONTAINERS_VCPU_RANGE = { min: 0, max: 64 };
export const DEFAULT_CONTAINERS_MEMORY_RANGE = { min: 0, max: 256 };
export const DEFAULT_PRICE_RANGE = { min: 0, max: 100 };

// Cloud providers
export const PROVIDERS: { id: string; name: string; color: string; soon?: boolean; isAIOnly?: boolean }[] = [
  { id: 'aws', name: 'AWS', color: '#FF9900' },
  { id: 'azure', name: 'Azure', color: '#00BCFF' },
  { id: 'gcp', name: 'Google', color: '#34A853' },
  { id: 'oracle', name: 'Oracle', color: '#F80000' },
  { id: 'digitalocean', name: 'DigitalOcean', color: '#0069FF' },
  { id: 'alibaba', name: 'Alibaba', color: '#FF6A00' },
  { id: 'openai', name: 'OpenAI', color: '#10A37F', isAIOnly: true },
  { id: 'anthropic', name: 'Anthropic', color: '#CC9D87', isAIOnly: true },
  { id: 'pinecone', name: 'Pinecone', color: '#3B1CFF' },
  { id: 'milvus', name: 'Milvus', color: '#00D2D3' },
  { id: 'qdrant', name: 'Qdrant', color: '#FF004E' },
  { id: 'weaviate', name: 'Weaviate', color: '#2DCA73' },
  { id: 'chroma', name: 'Chroma', color: '#FF4F00' },
  { id: 'cloudflare', name: 'Cloudflare', color: '#F38020' },
];

// Providers that only belong to specific product categories. The six hyperscalers
// (aws/azure/gcp/oracle/digitalocean/alibaba) are intentionally omitted here,
// meaning "available in every category". A provider listed below only shows its
// filter button + summary card on the categories it actually offers. Keep this in
// sync with the ingest pipelines when a niche provider gains data in a new category.
export const PROVIDER_CATEGORY_SCOPE: Record<string, string[]> = {
  openai: ['ai'],
  anthropic: ['ai'],
  pinecone: ['database'],
  milvus: ['database'],
  qdrant: ['database'],
  weaviate: ['database'],
  chroma: ['database'],
  cloudflare: ['networking', 'app-hosting', 'security'],
};

// Returns the providers applicable to a given product type. Filter buttons and the
// summary provider cards should only render these so users never see a provider
// (e.g. OpenAI on Virtual Machines) that can't appear in the current category.
export function providersForType(productType: string) {
  return PROVIDERS.filter(p => {
    const scope = PROVIDER_CATEGORY_SCOPE[p.id];
    return !scope || scope.includes(productType);
  });
}

// AI-specific constants
export const AI_SERVICE_TYPES = ['Foundational Models', 'Embeddings'];
export const AI_MODEL_TIERS = ['Frontier', 'Standard', 'Efficient'];
export const AI_CONTEXT_WINDOWS = ['< 32K', '32K - 128K', '> 128K', '1M+'];
export const AI_MULTIMODAL_OPTIONS = ['Yes', 'No'];

// --- STORAGE ---
export const STORAGE_CATEGORIES: string[] = ['Object', 'Block', 'File', 'Archive'];
export const STORAGE_TIERS: string[] = ['Standard', 'Infrequent', 'Cold'];
export const STORAGE_REDUNDANCIES: string[] = ['Single-Zone', 'Zone-Redundant', 'Geo-Redundant'];
export const STORAGE_MEDIA: string[] = ['SSD', 'HDD'];

// --- APP HOSTING ---
export const APP_HOSTING_TIERS: string[] = ['Free', 'Basic', 'Standard', 'Premium', 'Professional'];
export const APP_HOSTING_COMPUTE_TYPES: string[] = ['Shared', 'Dedicated'];

// --- INTEGRATION ---
export const INTEGRATION_SERVICES = ['Messaging', 'Eventing', 'API Gateway', 'Workflow'];
export const INTEGRATION_TIERS = ['Standard', 'Premium', 'Consumption', 'FIFO'];
export const INTEGRATION_SIZES = ['256 KB', '1 MB', '4 MB', '10 MB', '100 MB'];
export const INTEGRATION_PROTOCOLS = ['REST', 'HTTP', 'SOAP', 'GraphQL'];

// --- SECURITY & IDENTITY ---
export const SECURITY_SERVICES = ['Web Application Firewall (WAF)', 'Identity & Access Management (IAM)', 'Key Management Service (KMS)', 'DDoS Protection', 'Threat Detection'];
export const SECURITY_SERVICE_GROUPS: { label: string; services: string[] }[] = [
  { label: 'Network Security', services: ['Web Application Firewall (WAF)', 'DDoS Protection'] },
  { label: 'Identity & Encryption', services: ['Identity & Access Management (IAM)', 'Key Management Service (KMS)'] },
  { label: 'Threat & Compliance', services: ['Threat Detection'] },
];

// --- SPONSORSHIP ---
// Site-wide sponsor slots (Datacenters page, Workloads listing page). Per-workload
// slots live on each entry in WORKLOADS (src/config/workloads.ts) via `sponsor`.
// Set to a SponsorSlot to go live; leave null and the page shows the "become a
// sponsor" pitch box instead. Image spec: 1200×200 (6:1) — see /docs "Advertising with us".
export const DATACENTERS_SPONSOR: SponsorSlot | null = null;
export const WORKLOADS_LISTING_SPONSOR: SponsorSlot | null = null;
export const CERTIFICATIONS_SPONSOR: SponsorSlot | null = null;
export const STATUS_SPONSOR: SponsorSlot | null = null;
