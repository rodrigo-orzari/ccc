import fs from 'fs';

const filePaths = [
  'src/app/page.tsx',
  'src/components/FilterSidebar.tsx'
];

const variablesToReplace = [
  'GEOGRAPHIES', 'OS_TYPES', 'CPU_PROFILES', 'CATEGORIES',
  'DB_FAMILIES', 'DB_ENGINES', 'DEPLOYMENT_TYPES', 'HA_MODES',
  'SERVERLESS_LANGUAGES', 'SERVERLESS_COLD_START_OPTIONS', 'SERVERLESS_TIMEOUT_OPTIONS',
  'SERVERLESS_MEMORY_CONFIG_OPTIONS', 'SERVERLESS_FREE_TIER_OPTIONS', 'SERVERLESS_GRANULARITY_OPTIONS',
  'SERVERLESS_EXECUTION_MODEL_OPTIONS', 'SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS', 'SERVERLESS_EPHEMERAL_STORAGE_OPTIONS',
  'SERVERLESS_MEMORY_TIERS', 'SERVERLESS_ARCHITECTURES',
  'CONTAINERS_ORCHESTRATORS', 'CONTAINERS_COMPUTE_TYPES', 'CONTAINERS_ARCHITECTURES', 'CONTAINERS_BILLING_GRANULARITY',
  'NETWORKING_SERVICES', 'NETWORKING_SERVICE_GROUPS', 'NETWORKING_CONNECTION_TYPES', 'NETWORKING_ROUTING_TYPES',
  'NETWORKING_HA_SUPPORT', 'NETWORKING_VPC_SUPPORT', 'NETWORKING_DIRECTIONS',
  'NETWORKING_BILLING_MODELS', 'NETWORKING_USAGE_TIERS', 'NETWORKING_PORT_CAPACITIES', 'NETWORKING_TRANSFER_SCOPES',
  'ANALYTICS_ENGINES', 'ANALYTICS_DEPLOYMENT_TYPES', 'ANALYTICS_TIERS',
  'AI_SERVICE_TYPES', 'AI_MODEL_TIERS', 'AI_CONTEXT_WINDOWS', 'AI_MULTIMODAL_OPTIONS',
  'DEFAULT_VCPU_RANGE', 'DEFAULT_MEMORY_RANGE', 'DEFAULT_PRICE_RANGE',
  'PROVIDERS'
];

for (const filePath of filePaths) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace imports securely
  const importRegex = /import\s+\{[^{}]*?\}\s+from\s+'@\/config';/g;
  content = content.replace(importRegex, "import { useDynamicFilters } from '@/hooks/useDynamicFilters';");

  if (filePath === 'src/app/page.tsx') {
    // Delete local range definitions
    content = content.replace(/const DEFAULT_VCPU_RANGE = \{ min: 0, max: 320 \};\n/g, '');
    content = content.replace(/const DEFAULT_MEMORY_RANGE = \{ min: 0, max: 3200 \};\n/g, '');
    content = content.replace(/const DEFAULT_PRICE_RANGE = \{ min: 0, max: 100 \};\n/g, '');

    // Insert hook call
    content = content.replace(
      'export default function Dashboard() {',
      'export default function Dashboard() {\n  const config = useDynamicFilters();'
    );
  } else if (filePath === 'src/components/FilterSidebar.tsx') {
    // Insert hook call
    content = content.replace(
      '}: FilterSidebarProps) => {',
      '}: FilterSidebarProps) => {\n  const config = useDynamicFilters();'
    );
  }

  // Replace variable usages
  for (const v of variablesToReplace) {
    const regex = new RegExp(`(?<!config\\.)\\b${v}\\b`, 'g');
    content = content.replace(regex, `config.${v}`);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${filePath}`);
}
