import fs from 'fs';

let content = fs.readFileSync('src/lib/api-utils.ts', 'utf-8');

// Add to query destructuring
content = content.replace(
  "      storageTypes, storageTiers, storageRedundancy,",
  "      storageTypes, storageTiers, storageRedundancy,\n      appHostingTiers, appHostingComputeTypes,\n      integrationCategories, integrationTiers,"
);

// Add the filter logic at the end of buildPricingFilters (before 'if (minPrice || maxPrice)')
const newFilters = `
    // App Hosting filters
    if (resolvedProductType === 'app-hosting') {
      const osFilters = parseFilterList(os as string).map((s: string) => s.toLowerCase());
      if (osFilters.length > 0) {
        conditions.push(\`LOWER(pr.os) = ANY($\${paramCount++})\`);
        values.push(osFilters);
      }
      const tierFilters = parseFilterList(appHostingTiers as string).map((s: string) => s.toLowerCase());
      if (tierFilters.length > 0) {
        conditions.push(\`LOWER(pr.attributes->>'tier') = ANY($\${paramCount++})\`);
        values.push(tierFilters);
      }
      const computeTypeFilters = parseFilterList(appHostingComputeTypes as string).map((s: string) => s.toLowerCase());
      if (computeTypeFilters.length > 0) {
        conditions.push(\`LOWER(pr.attributes->>'compute_type') = ANY($\${paramCount++})\`);
        values.push(computeTypeFilters);
      }
    }

    // Integration filters
    if (resolvedProductType === 'integration') {
      const categoryFilters = parseFilterList(integrationCategories as string).map((s: string) => s.toLowerCase());
      if (categoryFilters.length > 0) {
        conditions.push(\`LOWER(pr.category) = ANY($\${paramCount++})\`);
        values.push(categoryFilters);
      }
      const tierFilters = parseFilterList(integrationTiers as string).map((s: string) => s.toLowerCase());
      if (tierFilters.length > 0) {
        conditions.push(\`LOWER(pr.attributes->>'tier') = ANY($\${paramCount++})\`);
        values.push(tierFilters);
      }
    }
`;

content = content.replace(
  "    if (minPrice || maxPrice) {",
  newFilters + "\n    if (minPrice || maxPrice) {"
);

fs.writeFileSync('src/lib/api-utils.ts', content, 'utf-8');
