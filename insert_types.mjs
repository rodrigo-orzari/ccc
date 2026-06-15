import fs from 'fs';

let content = fs.readFileSync('src/components/ProductTypeSelector.tsx', 'utf-8');

// The array currently looks like:
// const PRODUCT_TYPES: { id: ProductType; label: string; emoji: string; soon?: boolean }[] = [
//   { id: 'ai', label: 'Artificial Intelligence', emoji: '🧠' },
//   { id: 'containers', label: 'Containers', emoji: '📦' },
//   { id: 'data-analytics', label: 'Data & Analytics', emoji: '📊' },
//   { id: 'database', label: 'Databases', emoji: '🗄️' },
//   { id: 'networking', label: 'Networking', emoji: '🌐' },
//   { id: 'serverless', label: 'Serverless', emoji: '⚡' },
//   { id: 'storage', label: 'Storage', emoji: '💾' },
//   { id: 'vm', label: 'Virtual Machines', emoji: '🖥️' },
// ];

content = content.replace(
  "{ id: 'ai', label: 'Artificial Intelligence', emoji: '🧠' },",
  "{ id: 'ai', label: 'Artificial Intelligence', emoji: '🧠' },\n  { id: 'app-hosting', label: 'App Hosting', emoji: '🚀' },"
);

content = content.replace(
  "{ id: 'database', label: 'Databases', emoji: '🗄️' },",
  "{ id: 'database', label: 'Databases', emoji: '🗄️' },\n  { id: 'integration', label: 'Integration', emoji: '🔗' },"
);

fs.writeFileSync('src/components/ProductTypeSelector.tsx', content, 'utf-8');
