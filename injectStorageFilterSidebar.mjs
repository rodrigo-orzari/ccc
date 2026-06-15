import fs from 'fs';

let content = fs.readFileSync('src/components/FilterSidebar.tsx', 'utf-8');

// 1. Add Props
const newProps = `
  selectedStorageCategories?: string[];
  selectedStorageRedundancies?: string[];
  selectedStorageMedia?: string[];
  selectedStorageTiers?: string[];
  onStorageCategoryToggle?: (opt: string) => void;
  onSetStorageCategories?: (opts: string[]) => void;
  onStorageRedundancyToggle?: (opt: string) => void;
  onSetStorageRedundancies?: (opts: string[]) => void;
  onStorageMediaToggle?: (opt: string) => void;
  onSetStorageMedia?: (opts: string[]) => void;
  onStorageTierToggle?: (opt: string) => void;
  onSetStorageTiers?: (opts: string[]) => void;
`;
content = content.replace(
  "  onSetNetworkingTransferScopes?: (opts: string[]) => void;",
  "  onSetNetworkingTransferScopes?: (opts: string[]) => void;\n" + newProps
);

// 2. Destructure props
const destructuredProps = `
  selectedStorageCategories = [],
  selectedStorageRedundancies = [],
  selectedStorageMedia = [],
  selectedStorageTiers = [],
  onStorageCategoryToggle = noop,
  onSetStorageCategories = noopOpts,
  onStorageRedundancyToggle = noop,
  onSetStorageRedundancies = noopOpts,
  onStorageMediaToggle = noop,
  onSetStorageMedia = noopOpts,
  onStorageTierToggle = noop,
  onSetStorageTiers = noopOpts,
`;
content = content.replace(
  "  onSetNetworkingTransferScopes = noopOpts,",
  "  onSetNetworkingTransferScopes = noopOpts,\n" + destructuredProps
);

// 3. Add to dependencies of hasActiveFilters
const hasActiveDeps = `
      selectedStorageCategories.length < config.STORAGE_CATEGORIES.length ||
      selectedStorageRedundancies.length < config.STORAGE_REDUNDANCIES.length ||
      selectedStorageMedia.length < config.STORAGE_MEDIA.length ||
      selectedStorageTiers.length < config.STORAGE_TIERS.length ||
`;
content = content.replace(
  "      selectedNetworkingTransferScopes.length < config.NETWORKING_TRANSFER_SCOPES.length;",
  "      selectedNetworkingTransferScopes.length < config.NETWORKING_TRANSFER_SCOPES.length ||\n" + hasActiveDeps + "      false;"
);

// 4. Add UI Sections for Storage
const uiSections = `
      {/* ─── STORAGE FILTERS ────────────────────────────────────────── */}
      {activeProductType === 'storage' && (
        <>
          <FilterSection
            title="CATEGORY"
            options={config.STORAGE_CATEGORIES}
            selectedOptions={selectedStorageCategories}
            onToggle={onStorageCategoryToggle}
            onSelectAll={() => onSetStorageCategories(config.STORAGE_CATEGORIES)}
            onClearAll={() => onSetStorageCategories([])}
            isExpanded={expanded.storageCategory ?? true}
            onToggleExpand={() => onToggleSection('storageCategory')}
          />
          <FilterSection
            title="TIER"
            options={config.STORAGE_TIERS}
            selectedOptions={selectedStorageTiers}
            onToggle={onStorageTierToggle}
            onSelectAll={() => onSetStorageTiers(config.STORAGE_TIERS)}
            onClearAll={() => onSetStorageTiers([])}
            isExpanded={expanded.storageTier ?? true}
            onToggleExpand={() => onToggleSection('storageTier')}
          />
          <FilterSection
            title="REDUNDANCY"
            options={config.STORAGE_REDUNDANCIES}
            selectedOptions={selectedStorageRedundancies}
            onToggle={onStorageRedundancyToggle}
            onSelectAll={() => onSetStorageRedundancies(config.STORAGE_REDUNDANCIES)}
            onClearAll={() => onSetStorageRedundancies([])}
            isExpanded={expanded.storageRedundancy ?? true}
            onToggleExpand={() => onToggleSection('storageRedundancy')}
          />
          <FilterSection
            title="MEDIA"
            options={config.STORAGE_MEDIA}
            selectedOptions={selectedStorageMedia}
            onToggle={onStorageMediaToggle}
            onSelectAll={() => onSetStorageMedia(config.STORAGE_MEDIA)}
            onClearAll={() => onSetStorageMedia([])}
            isExpanded={expanded.storageMedia ?? true}
            onToggleExpand={() => onToggleSection('storageMedia')}
          />
        </>
      )}
`;

content = content.replace(
  "      {/* ─── AI FILTERS ──────────────────────────────────────────────── */}",
  uiSections + "\n      {/* ─── AI FILTERS ──────────────────────────────────────────────── */}"
);

fs.writeFileSync('src/components/FilterSidebar.tsx', content, 'utf-8');
