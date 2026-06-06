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

// Database-specific constants
export const DB_FAMILIES = ['Relational', 'NoSQL'];
export const DB_ENGINES = ['PostgreSQL', 'MySQL', 'MariaDB', 'SQL Server', 'Oracle DB', 'Cosmos DB', 'MongoDB', 'Redis', 'Valkey', 'DB2'];
export const DEPLOYMENT_TYPES = ['Provisioned', 'Serverless'];
export const HA_MODES = ['Single AZ', 'Multi AZ', 'Zone Redundant', 'Multi Region', 'Geo Redundant'];

// Serverless-specific constants
export const SERVERLESS_LANGUAGES = ['Python', 'Node', 'Go', 'Java', 'C#', 'Ruby', 'JavaScript', 'PHP', 'Rust', 'PowerShell', 'TypeScript', 'Any (Container)'];
export const SERVERLESS_COLD_START_OPTIONS = ['Fast (<100)', 'Medium (100-200)', 'Slow (>200)'];
export const SERVERLESS_TIMEOUT_OPTIONS = ['Short (5)', 'Medium (10)', 'Long (15+)'];
export const SERVERLESS_MEMORY_CONFIG_OPTIONS = ['Configurable', 'Tiers', 'Automatic'];
export const SERVERLESS_FREE_TIER_OPTIONS = ['Yes', 'No'];
export const SERVERLESS_GRANULARITY_OPTIONS = ['1', '100'];
export const SERVERLESS_EXECUTION_MODEL_OPTIONS = ['Both', 'Code (ZIP)', 'Container Image'];
export const SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS = ['Yes', 'No'];
export const SERVERLESS_EPHEMERAL_STORAGE_OPTIONS = ['< 1', '1 - 5', '> 5'];

// Containers-specific constants
export const CONTAINERS_ORCHESTRATORS = ['Kubernetes', 'Serverless', 'Docker'];
export const CONTAINERS_COMPUTE_TYPES = ['Serverless', 'Provisioned'];
export const CONTAINERS_ARCHITECTURES = ['x86_64', 'ARM64'];
export const CONTAINERS_BILLING_GRANULARITY = ['Per Second', 'Per Hour'];

// Networking-specific constants
export const NETWORKING_SERVICES = ['Data Transfer', 'Virtual Private Cloud (VPC)', 'Load Balancing', 'Dedicated Connection', 'Public IPv4', 'NAT Gateway', 'VPN Gateway'];
export const NETWORKING_CONNECTION_TYPES = ['Multipoint', 'Point-to-Point'];
export const NETWORKING_ROUTING_TYPES = ['Dynamic', 'Fixed'];
export const NETWORKING_HA_SUPPORT = ['Yes', 'No'];
export const NETWORKING_VPC_SUPPORT = ['Yes', 'No'];
export const NETWORKING_DIRECTIONS = ['Egress', 'Ingress', 'Intra-Cloud'];

// Data Analytics-specific constants
export const ANALYTICS_ENGINES = ['Databricks', 'Snowflake', 'Native'];
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
export const DEFAULT_PRICE_RANGE = { min: 0, max: 510 };

// Cloud providers
export const PROVIDERS: { id: string; name: string; color: string; soon?: boolean }[] = [
  { id: 'aws', name: 'AWS', color: '#FF9900' },
  { id: 'azure', name: 'Azure', color: '#00BCFF' },
  { id: 'gcp', name: 'Google', color: '#34A853' },
  { id: 'oracle', name: 'Oracle', color: '#F80000' },
  { id: 'digitalocean', name: 'DigitalOcean', color: '#0069FF' },
  { id: 'alibaba', name: 'Alibaba Cloud', color: '#FF6A00' },
];
