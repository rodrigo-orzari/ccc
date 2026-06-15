import fs from 'fs';

let content = fs.readFileSync('src/components/PricingTable.tsx', 'utf-8');

// 1. Add column specs for Storage if missing
// We reuse middle columns: COL_MID1 (Category), COL_MID2 (Tier), COL_MID3 (Redundancy), COL_MID4 (Media)

// 2. Add storage to getColDefs
content = content.replace(
  "  if (pt === 'data-analytics') return [...start, COL_MID1, COL_MID3, COL_MID2, COL_VCPU, ...tail];",
  "  if (pt === 'storage')        return [...start, COL_MID1, COL_MID2, COL_MID3, COL_MID4, ...tail];\n  if (pt === 'data-analytics') return [...start, COL_MID1, COL_MID3, COL_MID2, COL_VCPU, ...tail];"
);

// 3. Add column label rendering in TableHeader
const renderHeaderReplacement = `
  const getColLabel = (pt: ProductType, key: string) => {
    if (key === 'engine_category') {
      if (pt === 'database') return 'Engine';
      if (pt === 'serverless') return 'Memory Config';
      if (pt === 'containers') return 'Orchestrator';
      if (pt === 'networking') return 'Service';
      if (pt === 'data-analytics') return 'Engine';
      if (pt === 'ai') return 'Service';
      if (pt === 'storage') return 'Category';
      return 'Category';
    }
    if (key === 'db_family_cpu_vendor') {
      if (pt === 'database') return 'Tier';
      if (pt === 'serverless') return 'Free Tier';
      if (pt === 'containers') return 'Billing Granularity';
      if (pt === 'networking') return 'Category';
      if (pt === 'data-analytics') return 'Compute Unit';
      if (pt === 'ai') return 'Context Window';
      if (pt === 'storage') return 'Tier';
      return 'CPU Vendor';
    }
    if (key === 'deployment_arch') {
      if (pt === 'database') return 'Deployment';
      if (pt === 'serverless') return 'Cold Start (ms)';
      if (pt === 'containers') return 'Compute Type';
      if (pt === 'networking') return 'Transfer Tier';
      if (pt === 'data-analytics') return 'Deployment Type';
      if (pt === 'ai') return 'Model Tier';
      if (pt === 'storage') return 'Redundancy';
      return 'Arch';
    }
    if (key === 'ha_mode_os') {
      if (pt === 'database') return 'HA Mode';
      if (pt === 'serverless') return 'Timeout (sec)';
      if (pt === 'containers') return 'Architecture';
      if (pt === 'networking') return 'Destination / Scope';
      if (pt === 'ai') return 'Multimodal';
      if (pt === 'storage') return 'Media';
      return 'OS';
    }
`;

content = content.replace(
  /const getColLabel = \(pt: ProductType, key: string\) => \{[\s\S]*?return 'OS';\n    \}/,
  renderHeaderReplacement.trim()
);

// 4. Update row rendering in renderRow
const renderRowReplacement = `
    const getMid1 = (pt: ProductType, r: PricingRecord) => {
      if (pt === 'database') return r.attributes?.engine || '—';
      if (pt === 'serverless') return r.attributes?.memory_configuration || '—';
      if (pt === 'containers') return r.attributes?.orchestrator || '—';
      if (pt === 'networking') return r.service || '—';
      if (pt === 'data-analytics') return r.attributes?.engine || '—';
      if (pt === 'ai') return r.service || '—';
      if (pt === 'storage') return r.category || '—';
      return r.category || '—';
    };
    const getMid2 = (pt: ProductType, r: PricingRecord) => {
      if (pt === 'database') return r.attributes?.tier || '—';
      if (pt === 'serverless') return r.attributes?.free_invocations_per_month ? String(r.attributes.free_invocations_per_month) : '—';
      if (pt === 'containers') return r.attributes?.billing_granularity || '—';
      if (pt === 'networking') return r.category || '—';
      if (pt === 'data-analytics') return r.attributes?.compute_type || '—';
      if (pt === 'ai') return r.attributes?.contextWindowK ? \`\${r.attributes.contextWindowK}K\` : '—';
      if (pt === 'storage') return r.attributes?.tier || '—';
      return r.cpu_vendor || '—';
    };
    const getMid3 = (pt: ProductType, r: PricingRecord) => {
      if (pt === 'database') return r.attributes?.deployment_type || '—';
      if (pt === 'serverless') return r.attributes?.cold_start_overhead_ms ? String(r.attributes.cold_start_overhead_ms) : '—';
      if (pt === 'containers') return r.attributes?.compute_type || '—';
      if (pt === 'networking') return r.attributes?.transfer_tier || '—';
      if (pt === 'data-analytics') return r.attributes?.deployment_type || '—';
      if (pt === 'ai') return r.attributes?.modelTier || '—';
      if (pt === 'storage') return r.attributes?.redundancy || '—';
      return r.arch || '—';
    };
    const getMid4 = (pt: ProductType, r: PricingRecord) => {
      if (pt === 'database') return r.attributes?.ha_mode || '—';
      if (pt === 'serverless') return r.attributes?.timeout_seconds ? String(r.attributes.timeout_seconds) : '—';
      if (pt === 'containers') return r.attributes?.architecture || '—';
      if (pt === 'networking') return r.attributes?.destination || r.attributes?.transfer_scope || '—';
      if (pt === 'ai') return r.attributes?.multimodal || '—';
      if (pt === 'storage') return r.attributes?.media || '—';
      return r.os || '—';
    };
`;

content = content.replace(
  /const getMid1 = \(pt: ProductType, r: PricingRecord\) => \{[\s\S]*?return r\.os \|\| '—';\n    \};/,
  renderRowReplacement.trim()
);

fs.writeFileSync('src/components/PricingTable.tsx', content, 'utf-8');
