'use client';

import React from 'react';
import { ChevronDown, Info } from 'lucide-react';
import type { ProductType } from '@/types';
import { RangeSlider } from './RangeSlider';

// Import all filter constants from config
import { useDynamicFilters } from '@/hooks/useDynamicFilters';

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [show, setShow] = React.useState(false);
  return (
    <span
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => { e.stopPropagation(); setShow(!show); }}
    >
      {children}
      {show && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-[140px] p-1.5 bg-[#171717] dark:bg-[#e5e5e5] text-white dark:text-black text-[10px] rounded shadow-lg z-50 font-normal tracking-normal normal-case text-left leading-relaxed">
          {text}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-b-[4px] border-r-[4px] border-t-transparent border-b-transparent border-r-[#171717] dark:border-r-[#e5e5e5]"></div>
        </div>
      )}
    </span>
  );
};

interface FilterSectionProps {
  title: string;
  tooltip: string;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
  onSetAll: (items: string[]) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  getLabel?: (option: string) => string;
}

const FilterSection = ({
  title,
  tooltip,
  options,
  selected,
  onToggle,
  onSetAll,
  isExpanded,
  onToggleExpand,
  getLabel,
}: FilterSectionProps) => {
  // Batch operations: set all at once to avoid React batching issues
  const handleSelectAll = () => onSetAll(options);
  const handleClearAll = () => onSetAll([]);

  return (
  <section className="space-y-3">
    <div className="flex items-center justify-between">
      <h2 className="m-0">
        <button
          onClick={onToggleExpand}
          className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
        >
          <ChevronDown size={10} className={`transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
          {title} {tooltip && <Tooltip text={tooltip}><Info size={10} className="cursor-help" /></Tooltip>}
        </button>
      </h2>
      <button
        onClick={() => (selected.length === options.length ? handleClearAll() : handleSelectAll())}
        className={`text-[10px] font-bold uppercase transition-colors ${
          selected.length === options.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'
        }`}
      >
        {selected.length === options.length ? 'Clear All' : 'Select All'}
      </button>
    </div>
    {isExpanded && (
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onToggle(option)}
            className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
              selected.includes(option)
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
            }`}
          >
            {getLabel ? getLabel(option) : option}
          </button>
        ))}
      </div>
    )}
  </section>
  );
};

interface GroupedFilterSectionProps {
  title: string;
  tooltip: string;
  groups: { label: string; services: string[] }[];
  allOptions: string[];
  selected: string[];
  onToggle: (item: string) => void;
  onSetAll: (items: string[]) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

// Like FilterSection, but renders chips organized under labeled sub-groups.
// Select All / Clear All operate on the full flat option list.
const GroupedFilterSection = ({
  title,
  tooltip,
  groups,
  allOptions,
  selected,
  onToggle,
  onSetAll,
  isExpanded,
  onToggleExpand,
}: GroupedFilterSectionProps) => {
  const allSelected = selected.length === allOptions.length;
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="m-0">
          <button
            onClick={onToggleExpand}
            className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
          >
            <ChevronDown size={10} className={`transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
            {title} {tooltip && <Tooltip text={tooltip}><Info size={10} className="cursor-help" /></Tooltip>}
          </button>
        </h2>
        <button
          onClick={() => (allSelected ? onSetAll([]) : onSetAll(allOptions))}
          className={`text-[10px] font-bold uppercase transition-colors ${
            allSelected ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'
          }`}
        >
          {allSelected ? 'Clear All' : 'Select All'}
        </button>
      </div>
      {isExpanded && (
        <div className="flex flex-col gap-3">
          {groups.map(group => (
            <div key={group.label} className="space-y-1.5">
              <div className="text-[9px] font-bold text-[#a3a3a3] dark:text-[#525252] uppercase tracking-widest pl-0.5">
                {group.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.services.map(option => (
                  <button
                    key={option}
                    onClick={() => onToggle(option)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                      selected.includes(option)
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

interface FilterSidebarProps {
  activeProductType: ProductType;
  selectedProviders: string[];
  selectedGeographies: string[];
  selectedOS: string[];
  selectedCpu: string[];
  selectedCategory: string[];
  selectedGpu: string[];
  selectedDbFamilies: string[];
  selectedEngines: string[];
  selectedDeploymentTypes: string[];
  selectedHaModes: string[];
  selectedServerlessLanguages: string[];
  selectedServerlessColdStart: string[];
  selectedServerlessTimeout: string[];
  selectedServerlessMemoryConfig: string[];
  selectedServerlessFreeTier: string[];
  selectedServerlessGranularity: string[];
  selectedServerlessExecutionModel: string[];
  selectedServerlessProvisionedConcurrency: string[];
  selectedServerlessEphemeralStorage: string[];
  selectedServerlessMemory: string[];
  selectedServerlessArchitectures: string[];
  selectedContainersOrchestrators: string[];
  selectedContainersComputeTypes: string[];
  selectedContainersArchitectures: string[];
  selectedContainersBillingGranularity: string[];
  containersGpuIncluded: boolean;
  selectedAnalyticsEngines: string[];
  selectedAnalyticsDeploymentTypes: string[];
  selectedAnalyticsTiers: string[];
  selectedAiServiceTypes: string[];
  selectedAiModelTiers: string[];
  selectedAiContextWindows: string[];
  selectedAiMultimodalOptions: string[];
  selectedNetworkingServices: string[];
  selectedNetworkingConnectionTypes: string[];
  selectedNetworkingRoutingTypes: string[];
  selectedNetworkingHaSupport: string[];
  selectedNetworkingVpcSupport: string[];
  selectedNetworkingDirections: string[];
  selectedNetworkingBillingModels: string[];
  selectedNetworkingUsageTiers: string[];
  selectedNetworkingPortCapacities: string[];
  selectedNetworkingTransferScopes: string[];
  selectedStorageCategories: string[];
  selectedStorageTiers: string[];
  selectedStorageRedundancies: string[];
  selectedStorageMedia: string[];
  selectedAppHostingTiers: string[];
  selectedAppHostingComputeTypes: string[];
  selectedServerlessServiceTypes: string[];
  vCpuRange: { min: number; max: number };
  memoryRange: { min: number; max: number };
  priceRange: { min: number; max: number };
  showAggregation: boolean;
  expanded: Record<string, boolean>;
  // Handlers
  onProviderToggle: (providerId: string) => void;
  onGeographyToggle: (geo: string) => void;
  onOsToggle: (os: string) => void;
  onCpuToggle: (cpu: string) => void;
  onCategoryToggle: (cat: string) => void;
  onGpuToggle: (value: string) => void;
  onSetGpu: (items: string[]) => void;
  onDbFamilyToggle: (fam: string) => void;
  onEngineToggle: (eng: string) => void;
  onDeploymentTypeToggle: (dt: string) => void;
  onHaModeToggle: (hm: string) => void;
  onServerlessLanguageToggle: (lang: string) => void;
  onServerlessColdStartToggle: (opt: string) => void;
  onServerlessTimeoutToggle: (opt: string) => void;
  onServerlessMemoryConfigToggle: (opt: string) => void;
  onServerlessFreeTierToggle: (opt: string) => void;
  onServerlessGranularityToggle: (opt: string) => void;
  onServerlessExecutionModelToggle: (opt: string) => void;
  onServerlessProvisionedConcurrencyToggle: (opt: string) => void;
  onServerlessEphemeralStorageToggle: (opt: string) => void;
  onServerlessMemoryToggle: (opt: string) => void;
  onServerlessArchitectureToggle: (opt: string) => void;
  onContainersOrchestratorToggle: (opt: string) => void;
  onContainersComputeTypeToggle: (opt: string) => void;
  onContainersArchitectureToggle: (opt: string) => void;
  onContainersBillingGranularityToggle: (opt: string) => void;
  onContainersGpuToggle: (value: boolean) => void;
  onAnalyticsEngineToggle: (eng: string) => void;
  onAnalyticsDeploymentTypeToggle: (dt: string) => void;
  onAnalyticsTierToggle: (tier: string) => void;
  onAiServiceTypeToggle: (val: string) => void;
  onAiModelTierToggle: (val: string) => void;
  onAiContextWindowToggle: (val: string) => void;
  onAiMultimodalOptionToggle: (val: string) => void;
  onNetworkingServiceToggle: (svc: string) => void;
  onNetworkingConnectionTypeToggle: (ct: string) => void;
  onNetworkingRoutingTypeToggle: (rt: string) => void;
  onNetworkingHaSupportToggle: (opt: string) => void;
  onNetworkingVpcSupportToggle: (opt: string) => void;
  onNetworkingDirectionToggle: (opt: string) => void;
  onNetworkingBillingModelToggle: (opt: string) => void;
  onNetworkingUsageTierToggle: (opt: string) => void;
  onNetworkingPortCapacityToggle: (opt: string) => void;
  onNetworkingTransferScopeToggle: (opt: string) => void;
  onStorageCategoryToggle: (opt: string) => void;
  onStorageTierToggle: (opt: string) => void;
  onStorageRedundancyToggle: (opt: string) => void;
  onStorageMediaToggle: (opt: string) => void;
  onAppHostingTierToggle: (opt: string) => void;
  onAppHostingComputeTypeToggle: (opt: string) => void;
  onServerlessServiceTypeToggle: (opt: string) => void;
  // Batch setters for Select All / Clear All
  onSetProviders: (items: string[]) => void;
  onSetGeographies: (items: string[]) => void;
  onSetOS: (items: string[]) => void;
  onSetCpu: (items: string[]) => void;
  onSetCategory: (items: string[]) => void;
  onSetDbFamilies: (items: string[]) => void;
  onSetEngines: (items: string[]) => void;
  onSetDeploymentTypes: (items: string[]) => void;
  onSetHaModes: (items: string[]) => void;
  onSetServerlessLanguages: (items: string[]) => void;
  onSetServerlessColdStart: (items: string[]) => void;
  onSetServerlessTimeout: (items: string[]) => void;
  onSetServerlessMemoryConfig: (items: string[]) => void;
  onSetServerlessFreeTier: (items: string[]) => void;
  onSetServerlessGranularity: (items: string[]) => void;
  onSetServerlessExecutionModel: (items: string[]) => void;
  onSetServerlessProvisionedConcurrency: (items: string[]) => void;
  onSetServerlessEphemeralStorage: (items: string[]) => void;
  onSetServerlessMemory: (items: string[]) => void;
  onSetServerlessArchitectures: (items: string[]) => void;
  onSetContainersOrchestrators: (items: string[]) => void;
  onSetContainersComputeTypes: (items: string[]) => void;
  onSetContainersArchitectures: (items: string[]) => void;
  onSetContainersBillingGranularity: (items: string[]) => void;
  onSetAnalyticsEngines: (items: string[]) => void;
  onSetAnalyticsDeploymentTypes: (items: string[]) => void;
  onSetAnalyticsTiers: (items: string[]) => void;
  onSetAiServiceTypes: (items: string[]) => void;
  onSetAiModelTiers: (items: string[]) => void;
  onSetAiContextWindows: (items: string[]) => void;
  onSetAiMultimodalOptions: (items: string[]) => void;
  onSetNetworkingServices: (items: string[]) => void;
  onSetNetworkingConnectionTypes: (items: string[]) => void;
  onSetNetworkingRoutingTypes: (items: string[]) => void;
  onSetNetworkingHaSupport: (items: string[]) => void;
  onSetNetworkingVpcSupport: (items: string[]) => void;
  onSetNetworkingDirections: (items: string[]) => void;
  onSetNetworkingBillingModels: (items: string[]) => void;
  onSetNetworkingUsageTiers: (items: string[]) => void;
  onSetNetworkingPortCapacities: (items: string[]) => void;
  onSetNetworkingTransferScopes: (items: string[]) => void;
  onSetStorageCategories: (items: string[]) => void;
  onSetStorageTiers: (items: string[]) => void;
  onSetStorageRedundancies: (items: string[]) => void;
  onSetStorageMedia: (items: string[]) => void;
  onSetAppHostingTiers: (items: string[]) => void;
  onSetAppHostingComputeTypes: (items: string[]) => void;
  onSetServerlessServiceTypes: (items: string[]) => void;
  onVCpuRangeChange: (range: { min: number; max: number }) => void;
  onMemoryRangeChange: (range: { min: number; max: number }) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onShowAggregationChange: (value: boolean) => void;
  onToggleSection: (key: string) => void;
}

export default function FilterSidebar({
  activeProductType,
  selectedProviders,
  selectedGeographies,
  selectedOS,
  selectedCpu,
  selectedCategory,
  selectedGpu,
  selectedDbFamilies,
  selectedEngines,
  selectedDeploymentTypes,
  selectedHaModes,
  selectedServerlessLanguages,
  selectedServerlessColdStart,
  selectedServerlessTimeout,
  selectedServerlessMemoryConfig,
  selectedServerlessFreeTier,
  selectedServerlessGranularity,
  selectedServerlessExecutionModel,
  selectedServerlessProvisionedConcurrency,
  selectedServerlessEphemeralStorage,
  selectedServerlessMemory,
  selectedServerlessArchitectures,
  selectedContainersOrchestrators,
  selectedContainersComputeTypes,
  selectedContainersArchitectures,
  selectedContainersBillingGranularity,
  containersGpuIncluded,
  selectedAnalyticsEngines,
  selectedAnalyticsDeploymentTypes,
  selectedAnalyticsTiers,
  selectedAiServiceTypes,
  selectedAiModelTiers,
  selectedAiContextWindows,
  selectedAiMultimodalOptions,
  selectedNetworkingServices,
  selectedNetworkingConnectionTypes,
  selectedNetworkingRoutingTypes,
  selectedNetworkingHaSupport,
  selectedNetworkingVpcSupport,
  selectedNetworkingDirections,
  selectedNetworkingBillingModels,
  selectedNetworkingUsageTiers,
  selectedNetworkingPortCapacities,
  selectedNetworkingTransferScopes,
  selectedStorageCategories,
  selectedStorageTiers,
  selectedStorageRedundancies,
  selectedStorageMedia,
  selectedAppHostingTiers,
  selectedAppHostingComputeTypes,
  selectedServerlessServiceTypes,
  vCpuRange,
  memoryRange,
  priceRange,
  showAggregation,
  expanded,
  onProviderToggle,
  onGeographyToggle,
  onOsToggle,
  onCpuToggle,
  onCategoryToggle,
  onGpuToggle,
  onSetGpu,
  onDbFamilyToggle,
  onEngineToggle,
  onDeploymentTypeToggle,
  onHaModeToggle,
  onServerlessLanguageToggle,
  onServerlessColdStartToggle,
  onServerlessTimeoutToggle,
  onServerlessMemoryConfigToggle,
  onServerlessFreeTierToggle,
  onServerlessGranularityToggle,
  onServerlessExecutionModelToggle,
  onServerlessProvisionedConcurrencyToggle,
  onServerlessEphemeralStorageToggle,
  onServerlessMemoryToggle,
  onServerlessArchitectureToggle,
  onContainersOrchestratorToggle,
  onContainersComputeTypeToggle,
  onContainersArchitectureToggle,
  onContainersBillingGranularityToggle,
  onContainersGpuToggle,
  onAnalyticsEngineToggle,
  onAnalyticsDeploymentTypeToggle,
  onAnalyticsTierToggle,
  onAiServiceTypeToggle,
  onAiModelTierToggle,
  onAiContextWindowToggle,
  onAiMultimodalOptionToggle,
  onNetworkingServiceToggle,
  onNetworkingConnectionTypeToggle,
  onNetworkingRoutingTypeToggle,
  onNetworkingHaSupportToggle,
  onNetworkingVpcSupportToggle,
  onNetworkingDirectionToggle,
  onNetworkingBillingModelToggle,
  onNetworkingUsageTierToggle,
  onNetworkingPortCapacityToggle,
  onNetworkingTransferScopeToggle,
  onStorageCategoryToggle,
  onStorageTierToggle,
  onStorageRedundancyToggle,
  onStorageMediaToggle,
  onAppHostingTierToggle,
  onAppHostingComputeTypeToggle,
  onServerlessServiceTypeToggle,
  onSetProviders,
  onSetGeographies,
  onSetOS,
  onSetCpu,
  onSetCategory,
  onSetDbFamilies,
  onSetEngines,
  onSetDeploymentTypes,
  onSetHaModes,
  onSetServerlessLanguages,
  onSetServerlessColdStart,
  onSetServerlessTimeout,
  onSetServerlessMemoryConfig,
  onSetServerlessFreeTier,
  onSetServerlessGranularity,
  onSetServerlessExecutionModel,
  onSetServerlessProvisionedConcurrency,
  onSetServerlessEphemeralStorage,
  onSetServerlessMemory,
  onSetServerlessArchitectures,
  onSetContainersOrchestrators,
  onSetContainersComputeTypes,
  onSetContainersArchitectures,
  onSetContainersBillingGranularity,
  onSetAnalyticsEngines,
  onSetAnalyticsDeploymentTypes,
  onSetAnalyticsTiers,
  onSetAiServiceTypes,
  onSetAiModelTiers,
  onSetAiContextWindows,
  onSetAiMultimodalOptions,
  onSetNetworkingServices,
  onSetNetworkingConnectionTypes,
  onSetNetworkingRoutingTypes,
  onSetNetworkingHaSupport,
  onSetNetworkingVpcSupport,
  onSetNetworkingDirections,
  onSetNetworkingBillingModels,
  onSetNetworkingUsageTiers,
  onSetNetworkingPortCapacities,
  onSetNetworkingTransferScopes,
  onSetStorageCategories,
  onSetStorageTiers,
  onSetStorageRedundancies,
  onSetStorageMedia,
  onSetAppHostingTiers,
  onSetAppHostingComputeTypes,
  onSetServerlessServiceTypes,
  onVCpuRangeChange,
  onMemoryRangeChange,
  onPriceRangeChange,
  onShowAggregationChange,
  onToggleSection,
}: FilterSidebarProps) {
  const config = useDynamicFilters();
  const activeNonSoon = config.PROVIDERS.filter(p => !p.soon).map(p => p.id);

  return (
    <aside className="w-72 border-r border-[#e5e5e5] dark:border-[#262626] flex flex-col shrink-0 overflow-y-auto bg-white dark:bg-[#000000] custom-scrollbar pb-10">
      <div className="p-4 space-y-8">
        {/* Providers Section */}
        <FilterSection
          title="Provider"
          tooltip="Cloud providers offering virtual machine pricing. Click a provider tile or chip to filter."
          options={config.PROVIDERS.filter(p => !p.soon).map(p => p.id)}
          getLabel={(id) => config.PROVIDERS.find(p => p.id === id)?.name || id}
          selected={selectedProviders}
          onToggle={onProviderToggle}
          onSetAll={onSetProviders}
          isExpanded={expanded.provider ?? true}
          onToggleExpand={() => onToggleSection('provider')}
        />

        {/* Product-specific sections */}
        {activeProductType === 'vm' && (
          <>
            <FilterSection
              title="Category"
              tooltip="Instance type purpose, derived from each cloud's published instance families."
              options={config.CATEGORIES}
              selected={selectedCategory}
              onToggle={onCategoryToggle}
              onSetAll={onSetCategory}
              isExpanded={expanded.category ?? true}
              onToggleExpand={() => onToggleSection('category')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            <FilterSection
              title="Geography"
              tooltip="Geographic region where the VM runs."
              options={config.GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              onSetAll={onSetGeographies}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            <FilterSection
              title="Operating System"
              tooltip="The operating system running on the VM."
              options={config.OS_TYPES}
              selected={selectedOS}
              onToggle={onOsToggle}
              onSetAll={onSetOS}
              isExpanded={expanded.os ?? true}
              onToggleExpand={() => onToggleSection('os')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="m-0">
                  <button
                    onClick={() => onToggleSection('cpu')}
                    className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ChevronDown size={10} className={`transition-transform ${expanded.cpu ? '' : '-rotate-90'}`} />
                    CPU | GPU <Tooltip text="Processor vendor, architecture, and GPU accelerator."><Info size={10} className="cursor-help" /></Tooltip>
                  </button>
                </h2>
                {/* Select All / Clear All — all CPU profiles + both GPU options = "all" */}
                {(() => {
                  const GPU_OPTIONS = ['GPU', 'No GPU'];
                  const allSelected = selectedCpu.length === config.CPU_PROFILES.length && selectedGpu.length === GPU_OPTIONS.length;
                  return (
                    <button
                      onClick={() => {
                        if (allSelected) {
                          onSetCpu([]);
                          onSetGpu([]);
                        } else {
                          onSetCpu(config.CPU_PROFILES.map(p => p.id));
                          onSetGpu(GPU_OPTIONS);
                        }
                      }}
                      className={`text-[10px] font-bold uppercase transition-colors ${
                        allSelected ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {allSelected ? 'Clear All' : 'Select All'}
                    </button>
                  );
                })()}
              </div>
              {expanded.cpu && (
                <div className="flex flex-wrap gap-2">
                  {config.CPU_PROFILES.map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => onCpuToggle(profile.id)}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                        selectedCpu.includes(profile.id)
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                          : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                      }`}
                    >
                      {profile.label}
                    </button>
                  ))}
                  {['GPU', 'No GPU'].map(option => (
                    <button
                      key={option}
                      onClick={() => onGpuToggle(option)}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                        selectedGpu.includes(option)
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                          : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </section>
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
          </>
        )}

        {/* Database filters */}
        {activeProductType === 'database' && (
          <>
            <FilterSection
              title="Database Family"
              tooltip="The broad category of the database system: Relational (SQL-based) or NoSQL."
              options={config.DB_FAMILIES}
              selected={selectedDbFamilies}
              onToggle={onDbFamilyToggle}
              onSetAll={onSetDbFamilies}
              isExpanded={expanded.dbFamily ?? true}
              onToggleExpand={() => onToggleSection('dbFamily')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Geography"
              tooltip="Geographic region where the database is deployed."
              options={config.GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              onSetAll={onSetGeographies}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Database Engine"
              tooltip="The database engine: PostgreSQL, MySQL, SQL Server, Oracle DB, etc."
              options={config.DB_ENGINES}
              selected={selectedEngines}
              onToggle={onEngineToggle}
              onSetAll={onSetEngines}
              isExpanded={expanded.engine ?? true}
              onToggleExpand={() => onToggleSection('engine')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Deployment"
              tooltip="Provisioned: fixed instance size billed hourly. Serverless: auto-scales, billed per compute unit consumed."
              options={config.DEPLOYMENT_TYPES}
              selected={selectedDeploymentTypes}
              onToggle={onDeploymentTypeToggle}
              onSetAll={onSetDeploymentTypes}
              isExpanded={expanded.deploymentType ?? true}
              onToggleExpand={() => onToggleSection('deploymentType')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="HIGH-AVAILABILITY"
              tooltip="High-availability configuration: Single AZ (no redundancy), Multi AZ (same-region standby), Zone Redundant, or Multi Region (geo-redundant)."
              options={config.HA_MODES}
              selected={selectedHaModes}
              onToggle={onHaModeToggle}
              onSetAll={onSetHaModes}
              isExpanded={expanded.haMode ?? true}
              onToggleExpand={() => onToggleSection('haMode')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
          </>
        )}

        {/* AI filters */}
        {activeProductType === 'ai' && (
          <>
            <FilterSection
              title="Service Type"
              tooltip="Type of AI Service."
              options={config.AI_SERVICE_TYPES}
              selected={selectedAiServiceTypes}
              onToggle={onAiServiceTypeToggle}
              onSetAll={onSetAiServiceTypes}
              isExpanded={expanded.aiServiceTypes ?? true}
              onToggleExpand={() => onToggleSection('aiServiceTypes')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Model Tier"
              tooltip="Performance and size tier of the model."
              options={config.AI_MODEL_TIERS}
              selected={selectedAiModelTiers}
              onToggle={onAiModelTierToggle}
              onSetAll={onSetAiModelTiers}
              isExpanded={expanded.aiModelTiers ?? true}
              onToggleExpand={() => onToggleSection('aiModelTiers')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Context Window"
              tooltip="Maximum token context window supported."
              options={config.AI_CONTEXT_WINDOWS}
              selected={selectedAiContextWindows}
              onToggle={onAiContextWindowToggle}
              onSetAll={onSetAiContextWindows}
              isExpanded={expanded.aiContextWindows ?? true}
              onToggleExpand={() => onToggleSection('aiContextWindows')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Multimodal"
              tooltip="Does the model support multimodal inputs (e.g. Image/Audio)?"
              options={config.AI_MULTIMODAL_OPTIONS}
              selected={selectedAiMultimodalOptions}
              onToggle={onAiMultimodalOptionToggle}
              onSetAll={onSetAiMultimodalOptions}
              isExpanded={expanded.aiMultimodalOptions ?? true}
              onToggleExpand={() => onToggleSection('aiMultimodalOptions')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
          </>
        )}

        {/* Serverless filters */}
        {activeProductType === 'serverless' && (
          <>
            <FilterSection
              title="Service Type"
              tooltip="Compute (Lambda/Functions/Run) plus the API Gateway, Messaging, Eventing, and Workflow services that pair with them."
              options={config.SERVERLESS_SERVICE_TYPES}
              selected={selectedServerlessServiceTypes}
              onToggle={onServerlessServiceTypeToggle}
              onSetAll={onSetServerlessServiceTypes}
              isExpanded={expanded.serverlessServiceType ?? true}
              onToggleExpand={() => onToggleSection('serverlessServiceType')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Geography"
              tooltip="Geographic region where the service is deployed."
              options={config.GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              onSetAll={onSetGeographies}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Memory Size"
              tooltip="Allocated memory per function/instance. This is the main driver of serverless price."
              options={config.SERVERLESS_MEMORY_TIERS}
              selected={selectedServerlessMemory}
              onToggle={onServerlessMemoryToggle}
              onSetAll={onSetServerlessMemory}
              isExpanded={expanded.serverlessMemory ?? true}
              onToggleExpand={() => onToggleSection('serverlessMemory')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Architecture"
              tooltip="CPU architecture: x86 (Intel/AMD) or ARM (e.g. AWS Graviton). ARM is typically cheaper."
              options={config.SERVERLESS_ARCHITECTURES}
              selected={selectedServerlessArchitectures}
              onToggle={onServerlessArchitectureToggle}
              onSetAll={onSetServerlessArchitectures}
              isExpanded={expanded.serverlessArchitecture ?? true}
              onToggleExpand={() => onToggleSection('serverlessArchitecture')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Languages"
              tooltip="Supported programming languages."
              options={config.SERVERLESS_LANGUAGES}
              selected={selectedServerlessLanguages}
              onToggle={onServerlessLanguageToggle}
              onSetAll={onSetServerlessLanguages}
              isExpanded={expanded.languages ?? true}
              onToggleExpand={() => onToggleSection('languages')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Cold Start"
              tooltip="Typical cold start overhead."
              options={config.SERVERLESS_COLD_START_OPTIONS}
              selected={selectedServerlessColdStart}
              onToggle={onServerlessColdStartToggle}
              onSetAll={onSetServerlessColdStart}
              isExpanded={expanded.coldStart ?? true}
              onToggleExpand={() => onToggleSection('coldStart')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Timeout"
              tooltip="Maximum execution time."
              options={config.SERVERLESS_TIMEOUT_OPTIONS}
              selected={selectedServerlessTimeout}
              onToggle={onServerlessTimeoutToggle}
              onSetAll={onSetServerlessTimeout}
              isExpanded={expanded.timeout ?? true}
              onToggleExpand={() => onToggleSection('timeout')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Memory Config"
              tooltip="How memory is allocated."
              options={config.SERVERLESS_MEMORY_CONFIG_OPTIONS}
              selected={selectedServerlessMemoryConfig}
              onToggle={onServerlessMemoryConfigToggle}
              onSetAll={onSetServerlessMemoryConfig}
              isExpanded={expanded.memoryConfig ?? true}
              onToggleExpand={() => onToggleSection('memoryConfig')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Execution Model"
              tooltip="How the code runs (ZIP vs Container)."
              options={config.SERVERLESS_EXECUTION_MODEL_OPTIONS}
              selected={selectedServerlessExecutionModel}
              onToggle={onServerlessExecutionModelToggle}
              onSetAll={onSetServerlessExecutionModel}
              isExpanded={expanded.executionModel ?? true}
              onToggleExpand={() => onToggleSection('executionModel')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Provisioned Concurrency"
              tooltip="Pre-warm instances to avoid cold starts."
              options={config.SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS}
              selected={selectedServerlessProvisionedConcurrency}
              onToggle={onServerlessProvisionedConcurrencyToggle}
              onSetAll={onSetServerlessProvisionedConcurrency}
              isExpanded={expanded.provisionedConcurrency ?? true}
              onToggleExpand={() => onToggleSection('provisionedConcurrency')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Ephemeral Storage"
              tooltip="Local storage available during execution (GB)."
              options={config.SERVERLESS_EPHEMERAL_STORAGE_OPTIONS}
              selected={selectedServerlessEphemeralStorage}
              onToggle={onServerlessEphemeralStorageToggle}
              onSetAll={onSetServerlessEphemeralStorage}
              isExpanded={expanded.ephemeralStorage ?? true}
              onToggleExpand={() => onToggleSection('ephemeralStorage')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Free Tier"
              tooltip="Is there a monthly free invocation allowance?"
              options={config.SERVERLESS_FREE_TIER_OPTIONS}
              selected={selectedServerlessFreeTier}
              onToggle={onServerlessFreeTierToggle}
              onSetAll={onSetServerlessFreeTier}
              isExpanded={expanded.freeTier ?? true}
              onToggleExpand={() => onToggleSection('freeTier')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Granularity (ms)"
              tooltip="Billing duration granularity."
              options={config.SERVERLESS_GRANULARITY_OPTIONS}
              selected={selectedServerlessGranularity}
              onToggle={onServerlessGranularityToggle}
              onSetAll={onSetServerlessGranularity}
              isExpanded={expanded.granularity ?? true}
              onToggleExpand={() => onToggleSection('granularity')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
          </>
        )}

        {/* Containers filters */}
        {activeProductType === 'containers' && (
          <>
            <FilterSection
              title="Geography"
              tooltip="Geographic region."
              options={config.GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              onSetAll={onSetGeographies}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Orchestrator"
              tooltip="Underlying orchestration platform."
              options={config.CONTAINERS_ORCHESTRATORS}
              selected={selectedContainersOrchestrators}
              onToggle={onContainersOrchestratorToggle}
              onSetAll={onSetContainersOrchestrators}
              isExpanded={expanded.containersOrchestrator ?? true}
              onToggleExpand={() => onToggleSection('containersOrchestrator')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Compute Type"
              tooltip="How compute resources are provisioned."
              options={config.CONTAINERS_COMPUTE_TYPES}
              selected={selectedContainersComputeTypes}
              onToggle={onContainersComputeTypeToggle}
              onSetAll={onSetContainersComputeTypes}
              isExpanded={expanded.containersComputeType ?? true}
              onToggleExpand={() => onToggleSection('containersComputeType')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Architecture"
              tooltip="CPU architecture."
              options={config.CONTAINERS_ARCHITECTURES}
              selected={selectedContainersArchitectures}
              onToggle={onContainersArchitectureToggle}
              onSetAll={onSetContainersArchitectures}
              isExpanded={expanded.containersArchitecture ?? true}
              onToggleExpand={() => onToggleSection('containersArchitecture')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Billing Granularity"
              tooltip="How billing is calculated."
              options={config.CONTAINERS_BILLING_GRANULARITY}
              selected={selectedContainersBillingGranularity}
              onToggle={onContainersBillingGranularityToggle}
              onSetAll={onSetContainersBillingGranularity}
              isExpanded={expanded.containersBillingGranularity ?? true}
              onToggleExpand={() => onToggleSection('containersBillingGranularity')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="m-0">
                  <button
                    onClick={() => onToggleSection('containersGpu')}
                    className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ChevronDown size={10} className={`transition-transform ${expanded.containersGpu ?? true ? '' : '-rotate-90'}`} />
                    GPU Support
                  </button>
                </h2>
                <button
                  onClick={() => onContainersGpuToggle(!containersGpuIncluded)}
                  className={`text-[10px] font-bold uppercase transition-colors ${
                    containersGpuIncluded ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'
                  }`}
                >
                  {containersGpuIncluded ? 'Clear All' : 'Select All'}
                </button>
              </div>
              {(expanded.containersGpu ?? true) && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onContainersGpuToggle(!containersGpuIncluded)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                      containersGpuIncluded
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    GPU Included
                  </button>
                </div>
              )}
            </section>
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
          </>
        )}

        {/* Networking filters */}
        {activeProductType === 'networking' && (
          <>
            <FilterSection
              title="Geography"
              tooltip="Geographic region."
              options={config.GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              onSetAll={onSetGeographies}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <GroupedFilterSection
              title="Service"
              tooltip="Networking service type, grouped by function."
              groups={config.NETWORKING_SERVICE_GROUPS}
              allOptions={config.NETWORKING_SERVICES}
              selected={selectedNetworkingServices}
              onToggle={onNetworkingServiceToggle}
              onSetAll={onSetNetworkingServices}
              isExpanded={expanded.networkingService ?? true}
              onToggleExpand={() => onToggleSection('networkingService')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Connection Type"
              tooltip="Point-to-point or Multipoint."
              options={config.NETWORKING_CONNECTION_TYPES}
              selected={selectedNetworkingConnectionTypes}
              onToggle={onNetworkingConnectionTypeToggle}
              onSetAll={onSetNetworkingConnectionTypes}
              isExpanded={expanded.networkingConnectionType ?? true}
              onToggleExpand={() => onToggleSection('networkingConnectionType')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Routing Type"
              tooltip="Dynamic or Fixed routing."
              options={config.NETWORKING_ROUTING_TYPES}
              selected={selectedNetworkingRoutingTypes}
              onToggle={onNetworkingRoutingTypeToggle}
              onSetAll={onSetNetworkingRoutingTypes}
              isExpanded={expanded.networkingRoutingType ?? true}
              onToggleExpand={() => onToggleSection('networkingRoutingType')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Billing Model"
              tooltip="How you are charged (Uptime vs. Data)."
              options={config.NETWORKING_BILLING_MODELS}
              selected={selectedNetworkingBillingModels}
              onToggle={onNetworkingBillingModelToggle}
              onSetAll={onSetNetworkingBillingModels}
              isExpanded={expanded.networkingBillingModel ?? true}
              onToggleExpand={() => onToggleSection('networkingBillingModel')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Usage Tier"
              tooltip="Pricing tier or allowance level."
              options={config.NETWORKING_USAGE_TIERS}
              selected={selectedNetworkingUsageTiers}
              onToggle={onNetworkingUsageTierToggle}
              onSetAll={onSetNetworkingUsageTiers}
              isExpanded={expanded.networkingUsageTier ?? true}
              onToggleExpand={() => onToggleSection('networkingUsageTier')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Port Capacity"
              tooltip="Throughput capacity for dedicated connections."
              options={config.NETWORKING_PORT_CAPACITIES}
              selected={selectedNetworkingPortCapacities}
              onToggle={onNetworkingPortCapacityToggle}
              onSetAll={onSetNetworkingPortCapacities}
              isExpanded={expanded.networkingPortCapacity ?? true}
              onToggleExpand={() => onToggleSection('networkingPortCapacity')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Transfer Scope"
              tooltip="Geographic scope of the data transfer."
              options={config.NETWORKING_TRANSFER_SCOPES}
              selected={selectedNetworkingTransferScopes}
              onToggle={onNetworkingTransferScopeToggle}
              onSetAll={onSetNetworkingTransferScopes}
              isExpanded={expanded.networkingTransferScope ?? true}
              onToggleExpand={() => onToggleSection('networkingTransferScope')}
            />
            <FilterSection
              title="HA Support"
              tooltip="High Availability Support."
              options={config.NETWORKING_HA_SUPPORT}
              selected={selectedNetworkingHaSupport}
              onToggle={onNetworkingHaSupportToggle}
              onSetAll={onSetNetworkingHaSupport}
              isExpanded={expanded.networkingHaSupport ?? true}
              onToggleExpand={() => onToggleSection('networkingHaSupport')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="VPC Support"
              tooltip="VPC Integration Support."
              options={config.NETWORKING_VPC_SUPPORT}
              selected={selectedNetworkingVpcSupport}
              onToggle={onNetworkingVpcSupportToggle}
              onSetAll={onSetNetworkingVpcSupport}
              isExpanded={expanded.networkingVpcSupport ?? true}
              onToggleExpand={() => onToggleSection('networkingVpcSupport')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Direction"
              tooltip="Data transfer direction."
              options={config.NETWORKING_DIRECTIONS}
              selected={selectedNetworkingDirections}
              onToggle={onNetworkingDirectionToggle}
              onSetAll={onSetNetworkingDirections}
              isExpanded={expanded.networkingTransferDirection ?? true}
              onToggleExpand={() => onToggleSection('networkingTransferDirection')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
          </>
        )}

        {/* Storage filters */}
        {activeProductType === 'storage' && (
          <>
            <FilterSection
              title="Geography"
              tooltip="Geographic region where the storage is hosted."
              options={config.GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              onSetAll={onSetGeographies}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Storage Type"
              tooltip="Object (S3-like), Block (disks), File (shared), or Archive (cold)."
              options={config.STORAGE_CATEGORIES}
              selected={selectedStorageCategories}
              onToggle={onStorageCategoryToggle}
              onSetAll={onSetStorageCategories}
              isExpanded={expanded.storageCategory ?? true}
              onToggleExpand={() => onToggleSection('storageCategory')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Tier"
              tooltip="Access tier: Standard (hot), Infrequent (cool), or Cold (archive)."
              options={config.STORAGE_TIERS}
              selected={selectedStorageTiers}
              onToggle={onStorageTierToggle}
              onSetAll={onSetStorageTiers}
              isExpanded={expanded.storageTier ?? true}
              onToggleExpand={() => onToggleSection('storageTier')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Redundancy"
              tooltip="Replication scope: Single-Zone, Zone-Redundant, or Geo-Redundant."
              options={config.STORAGE_REDUNDANCIES}
              selected={selectedStorageRedundancies}
              onToggle={onStorageRedundancyToggle}
              onSetAll={onSetStorageRedundancies}
              isExpanded={expanded.storageRedundancy ?? true}
              onToggleExpand={() => onToggleSection('storageRedundancy')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Media"
              tooltip="Underlying media (SSD or HDD). Applies to block and some file storage."
              options={config.STORAGE_MEDIA}
              selected={selectedStorageMedia}
              onToggle={onStorageMediaToggle}
              onSetAll={onSetStorageMedia}
              isExpanded={expanded.storageMedia ?? true}
              onToggleExpand={() => onToggleSection('storageMedia')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
          </>
        )}

        {/* App Hosting Specific Filters */}
        {activeProductType === 'app-hosting' && (
          <>
            <FilterSection
              title="App Hosting Tiers"
              tooltip="Pricing and capability tier of the hosting service"
              options={config.APP_HOSTING_TIERS}
              selected={selectedAppHostingTiers}
              onToggle={onAppHostingTierToggle}
              onSetAll={onSetAppHostingTiers}
              isExpanded={expanded.appHostingTiers ?? true}
              onToggleExpand={() => onToggleSection('appHostingTiers')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Compute Type"
              tooltip="Whether the underlying compute resources are shared or dedicated"
              options={config.APP_HOSTING_COMPUTE_TYPES}
              selected={selectedAppHostingComputeTypes}
              onToggle={onAppHostingComputeTypeToggle}
              onSetAll={onSetAppHostingComputeTypes}
              isExpanded={expanded.appHostingComputeTypes ?? true}
              onToggleExpand={() => onToggleSection('appHostingComputeTypes')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
          </>
        )}

        {/* Integration Specific Filters */}
        {/* Data Analytics filters */}
        {activeProductType === 'data-analytics' && (
          <>
            <FilterSection
              title="Geography"
              tooltip="Geographic region."
              options={config.GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              onSetAll={onSetGeographies}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Engine"
              tooltip="Analytics Engine."
              options={config.ANALYTICS_ENGINES}
              selected={selectedAnalyticsEngines}
              onToggle={onAnalyticsEngineToggle}
              onSetAll={onSetAnalyticsEngines}
              isExpanded={expanded.engine ?? true}
              onToggleExpand={() => onToggleSection('engine')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Deployment"
              tooltip="Provisioned or Serverless."
              options={config.ANALYTICS_DEPLOYMENT_TYPES}
              selected={selectedAnalyticsDeploymentTypes}
              onToggle={onAnalyticsDeploymentTypeToggle}
              onSetAll={onSetAnalyticsDeploymentTypes}
              isExpanded={expanded.deploymentType ?? true}
              onToggleExpand={() => onToggleSection('deploymentType')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Tier"
              tooltip="Performance Tier."
              options={config.ANALYTICS_TIERS}
              selected={selectedAnalyticsTiers}
              onToggle={onAnalyticsTierToggle}
              onSetAll={onSetAnalyticsTiers}
              isExpanded={expanded.tier ?? true}
              onToggleExpand={() => onToggleSection('tier')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
          </>
        )}

        {/* Specs & Price Sliders */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="m-0">
              <button
                onClick={() => onToggleSection('specs')}
                className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
              >
                <ChevronDown size={10} className={`transition-transform ${expanded.specs ? '' : '-rotate-90'}`} />
                Specs & Price <Tooltip text="Filter by vCPU count, memory size (GB), and hourly price ($). Prices are on-demand (PAYG) USD."><Info size={10} className="cursor-help" /></Tooltip>
              </button>
            </h2>
            <button
              onClick={() => {
                onVCpuRangeChange({ ...config.DEFAULT_VCPU_RANGE });
                onMemoryRangeChange({ ...config.DEFAULT_MEMORY_RANGE });
                onPriceRangeChange({ ...config.DEFAULT_PRICE_RANGE });
              }}
              className={`text-[10px] font-bold uppercase transition-colors ${
                vCpuRange.min !== config.DEFAULT_VCPU_RANGE.min ||
                vCpuRange.max !== config.DEFAULT_VCPU_RANGE.max ||
                memoryRange.min !== config.DEFAULT_MEMORY_RANGE.min ||
                memoryRange.max !== config.DEFAULT_MEMORY_RANGE.max ||
                priceRange.min !== config.DEFAULT_PRICE_RANGE.min ||
                priceRange.max !== config.DEFAULT_PRICE_RANGE.max
                  ? 'text-black dark:text-white'
                  : 'text-[#737373] hover:text-black dark:hover:text-white'
              }`}
            >
              Clear All
            </button>
          </div>
          {expanded.specs && (
            <div className="space-y-8 px-1">
              {['vm', 'database', 'containers'].includes(activeProductType) && (
                <>
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#737373]">vCPU</div>
                    <RangeSlider
                      min={config.DEFAULT_VCPU_RANGE.min}
                      max={config.DEFAULT_VCPU_RANGE.max}
                      value={vCpuRange}
                      onChange={onVCpuRangeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#737373]">Memory (GB)</div>
                    <RangeSlider
                      min={config.DEFAULT_MEMORY_RANGE.min}
                      max={config.DEFAULT_MEMORY_RANGE.max}
                      value={memoryRange}
                      onChange={onMemoryRangeChange}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[#737373]">{activeProductType === 'ai' ? 'Input Price ($/1M Tokens)' : 'Hourly price ($)'}</div>
                <RangeSlider
                  min={config.DEFAULT_PRICE_RANGE.min}
                  max={config.DEFAULT_PRICE_RANGE.max}
                  step={0.1}
                  unit="$"
                  value={priceRange}
                  onChange={onPriceRangeChange}
                />
              </div>
            </div>
          )}
        </section>

        <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

        {/* Pricing Mode */}
        {activeProductType !== 'ai' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="m-0">
                <button
                  onClick={() => onToggleSection('pricing')}
                  className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
                >
                  <ChevronDown size={10} className={`transition-transform ${expanded.pricing ? '' : '-rotate-90'}`} />
                  PAYG OR YEARLY PRICE <Tooltip text="PAYG shows the on-demand hourly price. Yearly multiplies the hourly price by 8,760 hours for a rough annual estimate (no committed-use discounts applied)."><Info size={10} className="cursor-help" /></Tooltip>
                </button>
              </h2>
            </div>
            {expanded.pricing && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onShowAggregationChange(false)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                    !showAggregation
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                  }`}
                >
                  PAYG
                </button>
                <button
                  onClick={() => onShowAggregationChange(true)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                    showAggregation
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                  }`}
                >
                  Yearly
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </aside>
  );
}
