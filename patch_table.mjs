import fs from 'fs';

let content = fs.readFileSync('src/components/PricingTable.tsx', 'utf-8');

// Update column headers for app-hosting and integration
content = content.replace(
  "      if (pt === 'storage') return 'Category / Tier';",
  "      if (pt === 'app-hosting') return 'Tier';\n      if (pt === 'integration') return 'Integration Type';\n      if (pt === 'storage') return 'Category / Tier';"
);
content = content.replace(
  "      if (pt === 'storage') return 'Resiliency';",
  "      if (pt === 'app-hosting') return 'vCPUs';\n      if (pt === 'integration') return 'Tier';\n      if (pt === 'storage') return 'Resiliency';"
);
content = content.replace(
  "      if (pt === 'storage') return 'Perf / Media';",
  "      if (pt === 'app-hosting') return 'Memory (GB)';\n      if (pt === 'integration') return 'Base Price';\n      if (pt === 'storage') return 'Perf / Media';"
);
content = content.replace(
  "      if (pt === 'storage') return 'Constraints';",
  "      if (pt === 'app-hosting') return 'OS';\n      if (pt === 'integration') return 'Usage Price';\n      if (pt === 'storage') return 'Constraints';"
);

// Update renderRow logic for app-hosting and integration
content = content.replace(
  "      if (pt === 'storage') return `${r.category || '—'} ${r.attributes?.tier ? '- ' + r.attributes.tier : ''}`;",
  "      if (pt === 'app-hosting') return r.attributes?.tier || '—';\n      if (pt === 'integration') return r.category || '—';\n      if (pt === 'storage') return `${r.category || '—'} ${r.attributes?.tier ? '- ' + r.attributes.tier : ''}`;"
);
content = content.replace(
  "      if (pt === 'storage') return r.attributes?.redundancy || '—';",
  "      if (pt === 'app-hosting') return r.vcpus > 0 ? r.vcpus : '—';\n      if (pt === 'integration') return r.attributes?.tier || '—';\n      if (pt === 'storage') return r.attributes?.redundancy || '—';"
);
content = content.replace(
  "      if (pt === 'storage') {",
  "      if (pt === 'app-hosting') return r.memory_gb > 0 ? r.memory_gb : '—';\n      if (pt === 'integration') {\n        const bp = r.attributes?.base_price_mo;\n        return bp !== undefined ? `$${bp.toFixed(2)}/mo` : 'None';\n      }\n      if (pt === 'storage') {"
);
content = content.replace(
  "      if (pt === 'storage') {",
  "      if (pt === 'app-hosting') return r.os || r.attributes?.os || '—';\n      if (pt === 'integration') return r.price_per_unit && r.price_per_unit !== '0' ? `$${Number(r.price_per_unit).toFixed(4)} ${r.unit}` : 'Included';\n      if (pt === 'storage') {"
);

fs.writeFileSync('src/components/PricingTable.tsx', content, 'utf-8');
