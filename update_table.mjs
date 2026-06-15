import fs from 'fs';

let content = fs.readFileSync('src/components/PricingTable.tsx', 'utf-8');

// Update column headers for storage
// Old: if (pt === 'storage') return 'Category'; ... if (pt === 'storage') return 'Tier'; ... if (pt === 'storage') return 'Redundancy'; ... if (pt === 'storage') return 'Media';
// New: if (pt === 'storage') return 'Category / Tier'; ... if (pt === 'storage') return 'Resiliency'; ... if (pt === 'storage') return 'Perf / Media'; ... if (pt === 'storage') return 'Constraints';

content = content.replace(
  "      if (pt === 'storage') return 'Category';",
  "      if (pt === 'storage') return 'Category / Tier';"
);
content = content.replace(
  "      if (pt === 'storage') return 'Tier';",
  "      if (pt === 'storage') return 'Resiliency';"
);
content = content.replace(
  "      if (pt === 'storage') return 'Redundancy';",
  "      if (pt === 'storage') return 'Perf / Media';"
);
content = content.replace(
  "      if (pt === 'storage') return 'Media';",
  "      if (pt === 'storage') return 'Constraints';"
);

// Update renderRow logic for storage
// Old: 
// getMid1: if (pt === 'storage') return r.category || '—';
// getMid2: if (pt === 'storage') return r.attributes?.tier || '—';
// getMid3: if (pt === 'storage') return r.attributes?.redundancy || '—';
// getMid4: if (pt === 'storage') return r.attributes?.media || '—';

const newMid1 = "      if (pt === 'storage') return `${r.category || '—'} ${r.attributes?.tier ? '- ' + r.attributes.tier : ''}`;";
const newMid2 = "      if (pt === 'storage') return r.attributes?.redundancy || '—';";
const newMid3 = "      if (pt === 'storage') {\n        const m = r.attributes?.media || '';\n        const iops = r.attributes?.included_iops ? `${r.attributes.included_iops} IOPS` : '';\n        return [m, iops].filter(Boolean).join(', ') || '—';\n      }";
const newMid4 = "      if (pt === 'storage') {\n        const minDays = r.attributes?.min_storage_duration_days ? `Min ${r.attributes.min_storage_duration_days} days` : '';\n        const minSize = r.attributes?.min_billable_size_kb ? `Min ${r.attributes.min_billable_size_kb}KB` : '';\n        return [minDays, minSize].filter(Boolean).join(', ') || '—';\n      }";

content = content.replace(
  "      if (pt === 'storage') return r.category || '—';",
  newMid1
);
content = content.replace(
  "      if (pt === 'storage') return r.attributes?.tier || '—';",
  newMid2
);
content = content.replace(
  "      if (pt === 'storage') return r.attributes?.redundancy || '—';",
  newMid3
);
content = content.replace(
  "      if (pt === 'storage') return r.attributes?.media || '—';",
  newMid4
);

fs.writeFileSync('src/components/PricingTable.tsx', content, 'utf-8');
