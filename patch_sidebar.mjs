import fs from 'fs';

let content = fs.readFileSync('src/components/FilterSidebar.tsx', 'utf-8');

// 1. Add props to interface
const newProps = `
  selectedAppHostingTiers: string[];
  setSelectedAppHostingTiers: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAppHostingComputeTypes: string[];
  setSelectedAppHostingComputeTypes: React.Dispatch<React.SetStateAction<string[]>>;
  
  selectedIntegrationCategories: string[];
  setSelectedIntegrationCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIntegrationTiers: string[];
  setSelectedIntegrationTiers: React.Dispatch<React.SetStateAction<string[]>>;
`;
content = content.replace(
  "  selectedStorageTiers: string[];\n  setSelectedStorageTiers: React.Dispatch<React.SetStateAction<string[]>>;",
  "  selectedStorageTiers: string[];\n  setSelectedStorageTiers: React.Dispatch<React.SetStateAction<string[]>>;\n" + newProps
);

// 2. Destructure props
const newDestructures = `
  selectedAppHostingTiers,
  setSelectedAppHostingTiers,
  selectedAppHostingComputeTypes,
  setSelectedAppHostingComputeTypes,
  selectedIntegrationCategories,
  setSelectedIntegrationCategories,
  selectedIntegrationTiers,
  setSelectedIntegrationTiers,
`;
content = content.replace(
  "  selectedStorageTiers,\n  setSelectedStorageTiers,",
  "  selectedStorageTiers,\n  setSelectedStorageTiers,\n" + newDestructures
);

// 3. Add UI elements for app-hosting and integration
const newSections = `
      {/* App Hosting */}
      {activeProductType === 'app-hosting' && (
        <>
          <FilterSection title="Operating System" options={config.OS_TYPES} selected={selectedOS} onChange={setSelectedOS} />
          <FilterSection title="Compute Type" options={config.APP_HOSTING_COMPUTE_TYPES} selected={selectedAppHostingComputeTypes} onChange={setSelectedAppHostingComputeTypes} />
          <FilterSection title="Tiers" options={config.APP_HOSTING_TIERS} selected={selectedAppHostingTiers} onChange={setSelectedAppHostingTiers} />
        </>
      )}

      {/* Integration */}
      {activeProductType === 'integration' && (
        <>
          <FilterSection title="Integration Category" options={config.INTEGRATION_CATEGORIES} selected={selectedIntegrationCategories} onChange={setSelectedIntegrationCategories} />
          <FilterSection title="Tiers" options={config.INTEGRATION_TIERS} selected={selectedIntegrationTiers} onChange={setSelectedIntegrationTiers} />
        </>
      )}
`;

content = content.replace(
  "      {/* Storage */}",
  newSections + "\n      {/* Storage */}"
);

fs.writeFileSync('src/components/FilterSidebar.tsx', content, 'utf-8');
