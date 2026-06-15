import fs from 'fs';

let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// 1. Add states
const newStates = `
  const [selectedStorageCategories, setSelectedStorageCategories] = useState<string[]>([...config.STORAGE_CATEGORIES]);
  const [selectedStorageRedundancies, setSelectedStorageRedundancies] = useState<string[]>([...config.STORAGE_REDUNDANCIES]);
  const [selectedStorageMedia, setSelectedStorageMedia] = useState<string[]>([...config.STORAGE_MEDIA]);
  const [selectedStorageTiers, setSelectedStorageTiers] = useState<string[]>([...config.STORAGE_TIERS]);
`;
content = content.replace(
  "const [selectedNetworkingTransferScopes, setSelectedNetworkingTransferScopes] = useState<string[]>([...config.NETWORKING_TRANSFER_SCOPES]);",
  "const [selectedNetworkingTransferScopes, setSelectedNetworkingTransferScopes] = useState<string[]>([...config.NETWORKING_TRANSFER_SCOPES]);\n" + newStates
);

// 2. Add sync logic
const syncLogic = `
      if (selectedStorageCategories.length === staticConfig.STORAGE_CATEGORIES.length) setSelectedStorageCategories([...config.STORAGE_CATEGORIES]);
      if (selectedStorageRedundancies.length === staticConfig.STORAGE_REDUNDANCIES.length) setSelectedStorageRedundancies([...config.STORAGE_REDUNDANCIES]);
      if (selectedStorageMedia.length === staticConfig.STORAGE_MEDIA.length) setSelectedStorageMedia([...config.STORAGE_MEDIA]);
      if (selectedStorageTiers.length === staticConfig.STORAGE_TIERS.length) setSelectedStorageTiers([...config.STORAGE_TIERS]);
`;
content = content.replace(
  "      setFiltersSynced(true);",
  syncLogic + "      setFiltersSynced(true);"
);

// 3. Add subset logic
const subsetLogic = `
    subset('storageTypes', selectedStorageCategories, config.STORAGE_CATEGORIES);
    subset('storageRedundancy', selectedStorageRedundancies, config.STORAGE_REDUNDANCIES);
    subset('storageMedia', selectedStorageMedia, config.STORAGE_MEDIA);
    subset('storageTiers', selectedStorageTiers, config.STORAGE_TIERS);
`;
content = content.replace(
  "    subset('networkingTransferScopes', selectedNetworkingTransferScopes, config.NETWORKING_TRANSFER_SCOPES);",
  "    subset('networkingTransferScopes', selectedNetworkingTransferScopes, config.NETWORKING_TRANSFER_SCOPES);\n" + subsetLogic
);

// 4. Update export headers
const exportHeaders = `
    } else if (activeProductType === 'storage') {
      headers = ['Provider', 'Configuration', 'Category', 'Tier', 'Redundancy', 'Media', 'Geography', 'Price (USD)', 'Source'];
`;
content = content.replace(
  "} else if (activeProductType === 'ai') {",
  exportHeaders + "    } else if (activeProductType === 'ai') {"
);

// 5. Update FilterSidebar props
const filterSidebarProps = `
            selectedStorageCategories={selectedStorageCategories}
            selectedStorageRedundancies={selectedStorageRedundancies}
            selectedStorageMedia={selectedStorageMedia}
            selectedStorageTiers={selectedStorageTiers}
            onStorageCategoryToggle={(opt) => handleToggle(selectedStorageCategories, setSelectedStorageCategories)(opt)}
            onSetStorageCategories={setSelectedStorageCategories}
            onStorageRedundancyToggle={(opt) => handleToggle(selectedStorageRedundancies, setSelectedStorageRedundancies)(opt)}
            onSetStorageRedundancies={setSelectedStorageRedundancies}
            onStorageMediaToggle={(opt) => handleToggle(selectedStorageMedia, setSelectedStorageMedia)(opt)}
            onSetStorageMedia={setSelectedStorageMedia}
            onStorageTierToggle={(opt) => handleToggle(selectedStorageTiers, setSelectedStorageTiers)(opt)}
            onSetStorageTiers={setSelectedStorageTiers}
`;
content = content.replace(
  "            onSetNetworkingTransferScopes={setSelectedNetworkingTransferScopes}",
  "            onSetNetworkingTransferScopes={setSelectedNetworkingTransferScopes}\n" + filterSidebarProps
);

fs.writeFileSync('src/app/page.tsx', content, 'utf-8');
