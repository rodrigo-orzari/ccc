import fs from 'fs';

let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Inside useEffect for filtersSynced
const newSyncs = `
      if (selectedAppHostingTiers.length === staticConfig.APP_HOSTING_TIERS.length) setSelectedAppHostingTiers([...config.APP_HOSTING_TIERS]);
      if (selectedAppHostingComputeTypes.length === staticConfig.APP_HOSTING_COMPUTE_TYPES.length) setSelectedAppHostingComputeTypes([...config.APP_HOSTING_COMPUTE_TYPES]);
      if (selectedIntegrationCategories.length === staticConfig.INTEGRATION_TYPES.length) setSelectedIntegrationCategories([...config.INTEGRATION_CATEGORIES]);
      if (selectedIntegrationTiers.length === staticConfig.INTEGRATION_TIERS.length) setSelectedIntegrationTiers([...config.INTEGRATION_TIERS]);
`;
content = content.replace(
  "      if (selectedStorageTiers.length === staticConfig.STORAGE_TIERS.length) setSelectedStorageTiers([...config.STORAGE_TIERS]);",
  "      if (selectedStorageTiers.length === staticConfig.STORAGE_TIERS.length) setSelectedStorageTiers([...config.STORAGE_TIERS]);\n" + newSyncs
);

// Inside useState declarations
const newStates = `
  const [selectedAppHostingTiers, setSelectedAppHostingTiers] = useState<string[]>([...config.APP_HOSTING_TIERS]);
  const [selectedAppHostingComputeTypes, setSelectedAppHostingComputeTypes] = useState<string[]>([...config.APP_HOSTING_COMPUTE_TYPES]);
  const [selectedIntegrationCategories, setSelectedIntegrationCategories] = useState<string[]>([...config.INTEGRATION_CATEGORIES]);
  const [selectedIntegrationTiers, setSelectedIntegrationTiers] = useState<string[]>([...config.INTEGRATION_TIERS]);
`;
content = content.replace(
  "  const [selectedStorageTiers, setSelectedStorageTiers] = useState<string[]>([...config.STORAGE_TIERS]);",
  "  const [selectedStorageTiers, setSelectedStorageTiers] = useState<string[]>([...config.STORAGE_TIERS]);\n" + newStates
);

// Inside buildParams subset logic
const newSubsets = `
    subset('appHostingTiers', selectedAppHostingTiers, config.APP_HOSTING_TIERS);
    subset('appHostingComputeTypes', selectedAppHostingComputeTypes, config.APP_HOSTING_COMPUTE_TYPES);
    subset('integrationCategories', selectedIntegrationCategories, config.INTEGRATION_CATEGORIES);
    subset('integrationTiers', selectedIntegrationTiers, config.INTEGRATION_TIERS);
`;
content = content.replace(
  "    subset('storageTiers', selectedStorageTiers, config.STORAGE_TIERS);",
  "    subset('storageTiers', selectedStorageTiers, config.STORAGE_TIERS);\n" + newSubsets
);

// We also need to add these selected* states as props to FilterSidebar
const newSidebarProps = `
        selectedAppHostingTiers={selectedAppHostingTiers}
        setSelectedAppHostingTiers={setSelectedAppHostingTiers}
        selectedAppHostingComputeTypes={selectedAppHostingComputeTypes}
        setSelectedAppHostingComputeTypes={setSelectedAppHostingComputeTypes}
        selectedIntegrationCategories={selectedIntegrationCategories}
        setSelectedIntegrationCategories={setSelectedIntegrationCategories}
        selectedIntegrationTiers={selectedIntegrationTiers}
        setSelectedIntegrationTiers={setSelectedIntegrationTiers}
`;
content = content.replace(
  "        selectedStorageTiers={selectedStorageTiers}\n        setSelectedStorageTiers={setSelectedStorageTiers}",
  "        selectedStorageTiers={selectedStorageTiers}\n        setSelectedStorageTiers={setSelectedStorageTiers}\n" + newSidebarProps
);

fs.writeFileSync('src/app/page.tsx', content, 'utf-8');
