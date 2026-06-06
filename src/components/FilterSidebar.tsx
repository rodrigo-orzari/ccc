'use client';

import React from 'react';
import { ChevronDown, Info } from 'lucide-react';
import type { ProductType } from '@/types';
import { RangeSlider } from './RangeSlider';

// Import all filter constants from config
import {
  GEOGRAPHIES, OS_TYPES, CPU_PROFILES, CATEGORIES,
  DB_FAMILIES, DB_ENGINES, DEPLOYMENT_TYPES, HA_MODES,
  SERVERLESS_LANGUAGES, SERVERLESS_COLD_START_OPTIONS, SERVERLESS_TIMEOUT_OPTIONS,
  SERVERLESS_MEMORY_CONFIG_OPTIONS, SERVERLESS_FREE_TIER_OPTIONS, SERVERLESS_GRANULARITY_OPTIONS,
  SERVERLESS_EXECUTION_MODEL_OPTIONS, SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS, SERVERLESS_EPHEMERAL_STORAGE_OPTIONS,
  CONTAINERS_ORCHESTRATORS, CONTAINERS_COMPUTE_TYPES, CONTAINERS_ARCHITECTURES, CONTAINERS_BILLING_GRANULARITY,
  NETWORKING_SERVICES, NETWORKING_CONNECTION_TYPES, NETWORKING_ROUTING_TYPES,
  NETWORKING_HA_SUPPORT, NETWORKING_VPC_SUPPORT, NETWORKING_DIRECTIONS,
  ANALYTICS_ENGINES, ANALYTICS_DEPLOYMENT_TYPES, ANALYTICS_TIERS,
  DEFAULT_VCPU_RANGE, DEFAULT_MEMORY_RANGE, DEFAULT_PRICE_RANGE,
  PROVIDERS,
} from '@/config';

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
  isExpanded,
  onToggleExpand,
  getLabel,
}: FilterSectionProps) => {
  // Derived select-all / clear-all — no extra props needed
  const handleSelectAll = () =>
    options.filter(o => !selected.includes(o)).forEach(o => onToggle(o));
  const handleClearAll = () =>
    [...selected].forEach(o => onToggle(o));

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

interface FilterSidebarProps {
  activeProductType: ProductType;
  selectedProviders: string[];
  selectedGeographies: string[];
  selectedOS: string[];
  selectedCpu: string[];
  selectedCategory: string[];
  gpuIncluded: boolean;
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
  selectedContainersOrchestrators: string[];
  selectedContainersComputeTypes: string[];
  selectedContainersArchitectures: string[];
  selectedContainersBillingGranularity: string[];
  containersGpuIncluded: boolean;
  selectedAnalyticsEngines: string[];
  selectedAnalyticsDeploymentTypes: string[];
  selectedAnalyticsTiers: string[];
  selectedNetworkingServices: string[];
  selectedNetworkingConnectionTypes: string[];
  selectedNetworkingRoutingTypes: string[];
  selectedNetworkingHaSupport: string[];
  selectedNetworkingVpcSupport: string[];
  selectedNetworkingDirections: string[];
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
  onGpuToggle: (value: boolean) => void;
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
  onContainersOrchestratorToggle: (opt: string) => void;
  onContainersComputeTypeToggle: (opt: string) => void;
  onContainersArchitectureToggle: (opt: string) => void;
  onContainersBillingGranularityToggle: (opt: string) => void;
  onContainersGpuToggle: (value: boolean) => void;
  onAnalyticsEngineToggle: (eng: string) => void;
  onAnalyticsDeploymentTypeToggle: (dt: string) => void;
  onAnalyticsTierToggle: (tier: string) => void;
  onNetworkingServiceToggle: (svc: string) => void;
  onNetworkingConnectionTypeToggle: (ct: string) => void;
  onNetworkingRoutingTypeToggle: (rt: string) => void;
  onNetworkingHaSupportToggle: (opt: string) => void;
  onNetworkingVpcSupportToggle: (opt: string) => void;
  onNetworkingDirectionToggle: (opt: string) => void;
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
  gpuIncluded,
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
  selectedContainersOrchestrators,
  selectedContainersComputeTypes,
  selectedContainersArchitectures,
  selectedContainersBillingGranularity,
  containersGpuIncluded,
  selectedAnalyticsEngines,
  selectedAnalyticsDeploymentTypes,
  selectedAnalyticsTiers,
  selectedNetworkingServices,
  selectedNetworkingConnectionTypes,
  selectedNetworkingRoutingTypes,
  selectedNetworkingHaSupport,
  selectedNetworkingVpcSupport,
  selectedNetworkingDirections,
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
  onContainersOrchestratorToggle,
  onContainersComputeTypeToggle,
  onContainersArchitectureToggle,
  onContainersBillingGranularityToggle,
  onContainersGpuToggle,
  onAnalyticsEngineToggle,
  onAnalyticsDeploymentTypeToggle,
  onAnalyticsTierToggle,
  onNetworkingServiceToggle,
  onNetworkingConnectionTypeToggle,
  onNetworkingRoutingTypeToggle,
  onNetworkingHaSupportToggle,
  onNetworkingVpcSupportToggle,
  onNetworkingDirectionToggle,
  onVCpuRangeChange,
  onMemoryRangeChange,
  onPriceRangeChange,
  onShowAggregationChange,
  onToggleSection,
}: FilterSidebarProps) {
  const activeNonSoon = PROVIDERS.filter(p => !p.soon).map(p => p.id);

  return (
    <aside className="w-72 border-r border-[#e5e5e5] dark:border-[#262626] flex flex-col shrink-0 overflow-y-auto bg-white dark:bg-[#000000] custom-scrollbar pb-10">
      <div className="p-4 space-y-8">
        {/* Providers Section */}
        <FilterSection
          title="Provider"
          tooltip="Cloud providers offering virtual machine pricing. Click a provider tile or chip to filter."
          options={PROVIDERS.filter(p => !p.soon).map(p => p.id)}
          getLabel={(id) => PROVIDERS.find(p => p.id === id)?.name || id}
          selected={selectedProviders}
          onToggle={onProviderToggle}
          isExpanded={expanded.provider ?? true}
          onToggleExpand={() => onToggleSection('provider')}
        />

        {/* Product-specific sections */}
        {activeProductType === 'vm' && (
          <>
            <FilterSection
              title="Category"
              tooltip="Instance type purpose, derived from each cloud's published instance families."
              options={CATEGORIES}
              selected={selectedCategory}
              onToggle={onCategoryToggle}
              isExpanded={expanded.category ?? true}
              onToggleExpand={() => onToggleSection('category')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            <FilterSection
              title="Geography"
              tooltip="Geographic region where the VM runs."
              options={GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            <FilterSection
              title="Operating System"
              tooltip="The operating system running on the VM."
              options={OS_TYPES}
              selected={selectedOS}
              onToggle={onOsToggle}
              isExpanded={expanded.os ?? true}
              onToggleExpand={() => onToggleSection('os')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="m-0">
                  <button
                    onClick={() => onToggleSection('cpu')}
                    className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ChevronDown size={10} className={`transition-transform ${expanded.cpu ? '' : '-rotate-90'}`} />
                    CPU | GPU <Tooltip text="Processor vendor, architecture, and GPU accelerator."><Info size={10} className="cursor-help" /></Tooltip>
                  </button>
                </h2>
              </div>
              {expanded.cpu && (
                <div className="flex flex-wrap gap-2">
                  {CPU_PROFILES.map(profile => (
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
                  <button
                    onClick={() => onGpuToggle(!gpuIncluded)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                      gpuIncluded
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    GPU
                  </button>
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
              options={DB_FAMILIES}
              selected={selectedDbFamilies}
              onToggle={onDbFamilyToggle}
              isExpanded={expanded.dbFamily ?? true}
              onToggleExpand={() => onToggleSection('dbFamily')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Geography"
              tooltip="Geographic region where the database is deployed."
              options={GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Database Engine"
              tooltip="The database engine: PostgreSQL, MySQL, SQL Server, Oracle DB, etc."
              options={DB_ENGINES}
              selected={selectedEngines}
              onToggle={onEngineToggle}
              isExpanded={expanded.engine ?? true}
              onToggleExpand={() => onToggleSection('engine')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Deployment"
              tooltip="Provisioned: fixed instance size billed hourly. Serverless: auto-scales, billed per compute unit consumed."
              options={DEPLOYMENT_TYPES}
              selected={selectedDeploymentTypes}
              onToggle={onDeploymentTypeToggle}
              isExpanded={expanded.deploymentType ?? true}
              onToggleExpand={() => onToggleSection('deploymentType')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="HIGH-AVAILABILITY"
              tooltip="High-availability configuration: Single AZ (no redundancy), Multi AZ (same-region standby), Zone Redundant, or Multi Region (geo-redundant)."
              options={HA_MODES}
              selected={selectedHaModes}
              onToggle={onHaModeToggle}
              isExpanded={expanded.haMode ?? true}
              onToggleExpand={() => onToggleSection('haMode')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
          </>
        )}

        {/* Serverless filters */}
        {activeProductType === 'serverless' && (
          <>
            <FilterSection
              title="Geography"
              tooltip="Geographic region where the service is deployed."
              options={GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Languages"
              tooltip="Supported programming languages."
              options={SERVERLESS_LANGUAGES}
              selected={selectedServerlessLanguages}
              onToggle={onServerlessLanguageToggle}
              isExpanded={expanded.languages ?? true}
              onToggleExpand={() => onToggleSection('languages')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Cold Start"
              tooltip="Typical cold start overhead."
              options={SERVERLESS_COLD_START_OPTIONS}
              selected={selectedServerlessColdStart}
              onToggle={onServerlessColdStartToggle}
              isExpanded={expanded.coldStart ?? true}
              onToggleExpand={() => onToggleSection('coldStart')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Timeout"
              tooltip="Maximum execution time."
              options={SERVERLESS_TIMEOUT_OPTIONS}
              selected={selectedServerlessTimeout}
              onToggle={onServerlessTimeoutToggle}
              isExpanded={expanded.timeout ?? true}
              onToggleExpand={() => onToggleSection('timeout')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Memory Config"
              tooltip="How memory is allocated."
              options={SERVERLESS_MEMORY_CONFIG_OPTIONS}
              selected={selectedServerlessMemoryConfig}
              onToggle={onServerlessMemoryConfigToggle}
              isExpanded={expanded.memoryConfig ?? true}
              onToggleExpand={() => onToggleSection('memoryConfig')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Execution Model"
              tooltip="How the code runs (ZIP vs Container)."
              options={SERVERLESS_EXECUTION_MODEL_OPTIONS}
              selected={selectedServerlessExecutionModel}
              onToggle={onServerlessExecutionModelToggle}
              isExpanded={expanded.executionModel ?? true}
              onToggleExpand={() => onToggleSection('executionModel')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Provisioned Concurrency"
              tooltip="Pre-warm instances to avoid cold starts."
              options={SERVERLESS_PROVISIONED_CONCURRENCY_OPTIONS}
              selected={selectedServerlessProvisionedConcurrency}
              onToggle={onServerlessProvisionedConcurrencyToggle}
              isExpanded={expanded.provisionedConcurrency ?? true}
              onToggleExpand={() => onToggleSection('provisionedConcurrency')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Ephemeral Storage"
              tooltip="Local storage available during execution (GB)."
              options={SERVERLESS_EPHEMERAL_STORAGE_OPTIONS}
              selected={selectedServerlessEphemeralStorage}
              onToggle={onServerlessEphemeralStorageToggle}
              isExpanded={expanded.ephemeralStorage ?? true}
              onToggleExpand={() => onToggleSection('ephemeralStorage')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Free Tier"
              tooltip="Is there a monthly free invocation allowance?"
              options={SERVERLESS_FREE_TIER_OPTIONS}
              selected={selectedServerlessFreeTier}
              onToggle={onServerlessFreeTierToggle}
              isExpanded={expanded.freeTier ?? true}
              onToggleExpand={() => onToggleSection('freeTier')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Granularity (ms)"
              tooltip="Billing duration granularity."
              options={SERVERLESS_GRANULARITY_OPTIONS}
              selected={selectedServerlessGranularity}
              onToggle={onServerlessGranularityToggle}
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
              options={GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Orchestrator"
              tooltip="Underlying orchestration platform."
              options={CONTAINERS_ORCHESTRATORS}
              selected={selectedContainersOrchestrators}
              onToggle={onContainersOrchestratorToggle}
              isExpanded={expanded.containersOrchestrator ?? true}
              onToggleExpand={() => onToggleSection('containersOrchestrator')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Compute Type"
              tooltip="How compute resources are provisioned."
              options={CONTAINERS_COMPUTE_TYPES}
              selected={selectedContainersComputeTypes}
              onToggle={onContainersComputeTypeToggle}
              isExpanded={expanded.containersComputeType ?? true}
              onToggleExpand={() => onToggleSection('containersComputeType')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Architecture"
              tooltip="CPU architecture."
              options={CONTAINERS_ARCHITECTURES}
              selected={selectedContainersArchitectures}
              onToggle={onContainersArchitectureToggle}
              isExpanded={expanded.containersArchitecture ?? true}
              onToggleExpand={() => onToggleSection('containersArchitecture')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Billing Granularity"
              tooltip="How billing is calculated."
              options={CONTAINERS_BILLING_GRANULARITY}
              selected={selectedContainersBillingGranularity}
              onToggle={onContainersBillingGranularityToggle}
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
              options={GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Service"
              tooltip="Networking service type."
              options={NETWORKING_SERVICES}
              selected={selectedNetworkingServices}
              onToggle={onNetworkingServiceToggle}
              isExpanded={expanded.networkingService ?? true}
              onToggleExpand={() => onToggleSection('networkingService')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Connection Type"
              tooltip="Point-to-point or Multipoint."
              options={NETWORKING_CONNECTION_TYPES}
              selected={selectedNetworkingConnectionTypes}
              onToggle={onNetworkingConnectionTypeToggle}
              isExpanded={expanded.networkingConnectionType ?? true}
              onToggleExpand={() => onToggleSection('networkingConnectionType')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Routing Type"
              tooltip="Dynamic or Fixed routing."
              options={NETWORKING_ROUTING_TYPES}
              selected={selectedNetworkingRoutingTypes}
              onToggle={onNetworkingRoutingTypeToggle}
              isExpanded={expanded.networkingRoutingType ?? true}
              onToggleExpand={() => onToggleSection('networkingRoutingType')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="HA Support"
              tooltip="High Availability Support."
              options={NETWORKING_HA_SUPPORT}
              selected={selectedNetworkingHaSupport}
              onToggle={onNetworkingHaSupportToggle}
              isExpanded={expanded.networkingHaSupport ?? true}
              onToggleExpand={() => onToggleSection('networkingHaSupport')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="VPC Support"
              tooltip="VPC Integration Support."
              options={NETWORKING_VPC_SUPPORT}
              selected={selectedNetworkingVpcSupport}
              onToggle={onNetworkingVpcSupportToggle}
              isExpanded={expanded.networkingVpcSupport ?? true}
              onToggleExpand={() => onToggleSection('networkingVpcSupport')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Direction"
              tooltip="Data transfer direction."
              options={NETWORKING_DIRECTIONS}
              selected={selectedNetworkingDirections}
              onToggle={onNetworkingDirectionToggle}
              isExpanded={expanded.networkingTransferDirection ?? true}
              onToggleExpand={() => onToggleSection('networkingTransferDirection')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
          </>
        )}

        {/* Data Analytics filters */}
        {activeProductType === 'data-analytics' && (
          <>
            <FilterSection
              title="Geography"
              tooltip="Geographic region."
              options={GEOGRAPHIES}
              selected={selectedGeographies}
              onToggle={onGeographyToggle}
              isExpanded={expanded.geography ?? true}
              onToggleExpand={() => onToggleSection('geography')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Engine"
              tooltip="Analytics Engine."
              options={ANALYTICS_ENGINES}
              selected={selectedAnalyticsEngines}
              onToggle={onAnalyticsEngineToggle}
              isExpanded={expanded.engine ?? true}
              onToggleExpand={() => onToggleSection('engine')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Deployment"
              tooltip="Provisioned or Serverless."
              options={ANALYTICS_DEPLOYMENT_TYPES}
              selected={selectedAnalyticsDeploymentTypes}
              onToggle={onAnalyticsDeploymentTypeToggle}
              isExpanded={expanded.deploymentType ?? true}
              onToggleExpand={() => onToggleSection('deploymentType')}
            />
            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
            <FilterSection
              title="Tier"
              tooltip="Performance Tier."
              options={ANALYTICS_TIERS}
              selected={selectedAnalyticsTiers}
              onToggle={onAnalyticsTierToggle}
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
                onVCpuRangeChange({ ...DEFAULT_VCPU_RANGE });
                onMemoryRangeChange({ ...DEFAULT_MEMORY_RANGE });
                onPriceRangeChange({ ...DEFAULT_PRICE_RANGE });
              }}
              className={`text-[10px] font-bold uppercase transition-colors ${
                vCpuRange.min !== DEFAULT_VCPU_RANGE.min ||
                vCpuRange.max !== DEFAULT_VCPU_RANGE.max ||
                memoryRange.min !== DEFAULT_MEMORY_RANGE.min ||
                memoryRange.max !== DEFAULT_MEMORY_RANGE.max ||
                priceRange.min !== DEFAULT_PRICE_RANGE.min ||
                priceRange.max !== DEFAULT_PRICE_RANGE.max
                  ? 'text-black dark:text-white'
                  : 'text-[#737373] hover:text-black dark:hover:text-white'
              }`}
            >
              Clear All
            </button>
          </div>
          {expanded.specs && (
            <div className="space-y-8 px-1">
              {activeProductType !== 'networking' && (
                <>
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#737373]">vCPU</div>
                    <RangeSlider
                      min={DEFAULT_VCPU_RANGE.min}
                      max={DEFAULT_VCPU_RANGE.max}
                      value={vCpuRange}
                      onChange={onVCpuRangeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#737373]">Memory (GB)</div>
                    <RangeSlider
                      min={DEFAULT_MEMORY_RANGE.min}
                      max={DEFAULT_MEMORY_RANGE.max}
                      value={memoryRange}
                      onChange={onMemoryRangeChange}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[#737373]">Hourly price ($)</div>
                <RangeSlider
                  min={DEFAULT_PRICE_RANGE.min}
                  max={DEFAULT_PRICE_RANGE.max}
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
      </div>
    </aside>
  );
}
