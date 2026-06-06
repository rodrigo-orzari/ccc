'use client';

import React, { RefObject } from 'react';
import type { ProductType, PricingRecord } from '@/types';

const PROVIDERS: { id: string; name: string; color: string; soon?: boolean }[] = [
  { id: 'aws', name: 'AWS', color: '#FF9900' },
  { id: 'azure', name: 'Azure', color: '#00BCFF' },
  { id: 'gcp', name: 'Google', color: '#34A853' },
  { id: 'oracle', name: 'Oracle', color: '#F80000' },
  { id: 'digitalocean', name: 'DigitalOcean', color: '#0069FF' },
  { id: 'alibaba', name: 'Alibaba Cloud', color: '#FF6A00' },
];

interface PricingTableProps {
  data: PricingRecord[];
  loading: boolean;
  activeProductType: ProductType;
  showAggregation: boolean;
  tableScrollRef: RefObject<HTMLDivElement>;
  hasHorizontalOverflow: boolean;
  scrolledToEnd: boolean;
  sortConfig: { key: keyof PricingRecord | string; direction: 'asc' | 'desc' };
  onHeaderClick: (key: string) => void;
}

const SortIcon = ({ sortKey, sortConfig }: { sortKey: string; sortConfig: PricingTableProps['sortConfig'] }) => {
  const isActive = sortConfig.key === sortKey;
  return (
    <span className={`ml-1 inline-block transition-opacity ${isActive ? 'opacity-100' : 'opacity-25'}`}>
      {isActive ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );
};

const getColumnCount = (productType: ProductType): number => {
  switch (productType) {
    case 'database': return 9;
    case 'serverless': return 15;
    case 'containers': return 10;
    case 'networking': return 10;
    case 'data-analytics': return 9;
    default: return 12;
  }
};

export default function PricingTable({
  data,
  loading,
  activeProductType,
  showAggregation,
  tableScrollRef,
  hasHorizontalOverflow,
  scrolledToEnd,
  sortConfig,
  onHeaderClick,
}: PricingTableProps) {
  const maxPrice = data.length > 0 ? Math.max(...data.map(r => parseFloat(r.price_per_unit) || 0)) : 0;
  const maxInvPrice = activeProductType === 'serverless' && data.length > 0
    ? Math.max(...data.map(r => Number(r.attributes?.invocation_price_per_1m) || 0))
    : 0;

  return (
    <div
      ref={tableScrollRef}
      className={`flex-1 custom-scrollbar ${hasHorizontalOverflow && !scrolledToEnd ? 'scroll-fade-right' : ''}`}
      style={{ minHeight: 0, overflowY: 'auto', overflowX: 'scroll' }}
    >
      <div className="w-full">
        <table className="border-collapse w-full table-auto">
          <thead className="sticky top-0 bg-white dark:bg-[#000000] z-10 border-b border-[#e5e5e5] dark:border-[#262626]">
            <tr className="text-[10px] font-bold uppercase tracking-widest text-[#171717] dark:text-[#e5e5e5]">
              <th data-col="provider" onClick={() => onHeaderClick('provider')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                Provider <SortIcon sortKey="provider" sortConfig={sortConfig} />
              </th>
              <th data-col="instance_type" onClick={() => onHeaderClick('instance_type')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                SKU <SortIcon sortKey="instance_type" sortConfig={sortConfig} />
              </th>
              {/* Product-type-specific columns */}
              {activeProductType === 'database' ? (
                <>
                  <th data-col="engine_category" onClick={() => onHeaderClick('attributes.engine')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    Engine <SortIcon sortKey="attributes.engine" sortConfig={sortConfig} />
                  </th>
                  <th data-col="db_family_cpu_vendor" onClick={() => onHeaderClick('attributes.tier')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    Tier <SortIcon sortKey="attributes.tier" sortConfig={sortConfig} />
                  </th>
                  <th data-col="deployment_arch" onClick={() => onHeaderClick('attributes.deployment_type')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    Deployment <SortIcon sortKey="attributes.deployment_type" sortConfig={sortConfig} />
                  </th>
                  <th data-col="ha_mode_os" onClick={() => onHeaderClick('attributes.ha_mode')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    HA Mode <SortIcon sortKey="attributes.ha_mode" sortConfig={sortConfig} />
                  </th>
                </>
              ) : activeProductType === 'data-analytics' ? (
                <>
                  <th data-col="engine_category" onClick={() => onHeaderClick('attributes.engine')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    Engine <SortIcon sortKey="attributes.engine" sortConfig={sortConfig} />
                  </th>
                  <th data-col="deployment_arch" onClick={() => onHeaderClick('attributes.deployment_type')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    Deployment Type <SortIcon sortKey="attributes.deployment_type" sortConfig={sortConfig} />
                  </th>
                  <th data-col="db_family_cpu_vendor" onClick={() => onHeaderClick('attributes.tier')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    Tier <SortIcon sortKey="attributes.tier" sortConfig={sortConfig} />
                  </th>
                  <th data-col="vcpus" onClick={() => onHeaderClick('vcpus')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    Compute Unit <SortIcon sortKey="vcpus" sortConfig={sortConfig} />
                  </th>
                </>
              ) : activeProductType === 'serverless' ? (
                <>
                  <th data-col="languages" className="px-6 py-4 text-center font-bold whitespace-nowrap">Languages</th>
                  <th data-col="engine_category" className="px-6 py-4 text-center font-bold whitespace-nowrap">Cold Start (ms)</th>
                  <th data-col="db_family_cpu_vendor" className="px-6 py-4 text-center font-bold whitespace-nowrap">Timeout (sec)</th>
                  <th data-col="deployment_arch" className="px-6 py-4 text-center font-bold whitespace-nowrap">Memory Config</th>
                  <th data-col="ha_mode_os" className="px-6 py-4 text-center font-bold whitespace-nowrap">Free Tier</th>
                  <th data-col="granularity" className="px-6 py-4 text-center font-bold whitespace-nowrap">Granularity</th>
                  <th data-col="exec_model" className="px-6 py-4 text-center font-bold whitespace-nowrap">Exec. Model</th>
                  <th data-col="prov_concurrency" className="px-6 py-4 text-center font-bold whitespace-nowrap">Prov. Concurrency</th>
                  <th data-col="max_storage" className="px-6 py-4 text-center font-bold whitespace-nowrap">Max Storage</th>
                  <th data-col="inv_price" className="px-6 py-4 text-center font-bold whitespace-nowrap">Inv. Price ($/1M)</th>
                </>
              ) : activeProductType === 'containers' ? (
                <>
                  <th data-col="engine_category" className="px-6 py-4 text-center font-bold whitespace-nowrap">Orchestrator</th>
                  <th data-col="db_family_cpu_vendor" className="px-6 py-4 text-center font-bold whitespace-nowrap">Compute Type</th>
                  <th data-col="deployment_arch" className="px-6 py-4 text-center font-bold whitespace-nowrap">Architecture</th>
                  <th data-col="ha_mode_os" className="px-6 py-4 text-center font-bold whitespace-nowrap">Granularity</th>
                  <th data-col="gpu" className="px-6 py-4 text-center font-bold whitespace-nowrap">GPU</th>
                </>
              ) : activeProductType === 'networking' ? (
                <>
                  <th data-col="engine_category" className="px-6 py-4 text-center font-bold whitespace-nowrap">Service</th>
                  <th data-col="db_family_cpu_vendor" className="px-6 py-4 text-center font-bold whitespace-nowrap">Category</th>
                  <th data-col="deployment_arch" className="px-6 py-4 text-center font-bold whitespace-nowrap">Transfer Tier</th>
                  <th data-col="ha_mode_os" className="px-6 py-4 text-center font-bold whitespace-nowrap">Destination</th>
                  <th data-col="gpu" className="px-6 py-4 text-center font-bold whitespace-nowrap">Included</th>
                </>
              ) : (
                <>
                  <th data-col="engine_category" onClick={() => onHeaderClick('category')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    Category <SortIcon sortKey="category" sortConfig={sortConfig} />
                  </th>
                  <th data-col="db_family_cpu_vendor" onClick={() => onHeaderClick('cpu_vendor')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    CPU Vendor <SortIcon sortKey="cpu_vendor" sortConfig={sortConfig} />
                  </th>
                  <th data-col="deployment_arch" onClick={() => onHeaderClick('arch')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    Arch <SortIcon sortKey="arch" sortConfig={sortConfig} />
                  </th>
                  <th data-col="ha_mode_os" onClick={() => onHeaderClick('os')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    OS <SortIcon sortKey="os" sortConfig={sortConfig} />
                  </th>
                  <th data-col="gpu" onClick={() => onHeaderClick('gpu_count')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    GPU <SortIcon sortKey="gpu_count" sortConfig={sortConfig} />
                  </th>
                </>
              )}
              <th data-col="geography" onClick={() => onHeaderClick('geography')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                Geo <SortIcon sortKey="geography" sortConfig={sortConfig} />
              </th>
              {activeProductType !== 'networking' && activeProductType !== 'data-analytics' && (
                <>
                  <th data-col="vcpus" onClick={() => onHeaderClick('vcpus')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    vCPU <SortIcon sortKey="vcpus" sortConfig={sortConfig} />
                  </th>
                  <th data-col="memory_gb" onClick={() => onHeaderClick('memory_gb')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                    Memory (GB) <SortIcon sortKey="memory_gb" sortConfig={sortConfig} />
                  </th>
                </>
              )}
              <th data-col="price_per_unit" onClick={() => onHeaderClick('price_per_unit')} className="px-6 py-4 text-center font-bold text-black dark:text-white whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity">
                {showAggregation ? 'Yearly price ($)' : 'Hourly price ($)'} <SortIcon sortKey="price_per_unit" sortConfig={sortConfig} />
              </th>
              <th data-col="source" onClick={() => onHeaderClick('data_source')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                Source <SortIcon sortKey="data_source" sortConfig={sortConfig} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f5] dark:divide-[#181818]">
            {loading ? (
              Array.from({ length: 15 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: getColumnCount(activeProductType) }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-3 bg-[#f5f5f5] dark:bg-[#171717] rounded w-16 mx-auto"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((record, index) => <TableRow key={index} record={record} index={index} activeProductType={activeProductType} showAggregation={showAggregation} maxPrice={maxPrice} maxInvPrice={maxInvPrice} />)
            ) : (
              <tr>
                <td colSpan={12} className="px-6 py-32 text-center text-[#737373] dark:text-[#525252] italic text-sm">
                  <div className="flex flex-col items-center gap-4">
                    <span>No matches for your filters.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Table row component for product-type-specific rendering
function TableRow({ record, index, activeProductType, showAggregation, maxPrice, maxInvPrice }: { record: PricingRecord; index: number; activeProductType: ProductType; showAggregation: boolean; maxPrice?: number; maxInvPrice?: number }) {
  const providerColor = PROVIDERS.find(p => (record.provider || '').toLowerCase() === p.id || record.provider === p.name)?.color ?? '#525252';

  return (
    <tr className={`transition-colors group ${index % 2 === 0 ? 'bg-white dark:bg-[#000000]' : 'bg-[#f7f7f7] dark:bg-[#0a0a0a]'} hover:bg-[#eef2ff] dark:hover:bg-[#111827]`}>
      {/* Provider — shared */}
      <td data-col="provider" className="px-6 py-4 whitespace-nowrap text-center">
        <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border" style={{ color: providerColor, borderColor: providerColor + '50', backgroundColor: providerColor + '18' }}>
          {record.provider}
        </span>
      </td>
      {/* SKU — shared */}
      <td data-col="instance_type" className="px-6 py-4 whitespace-nowrap text-center">
        <span className="text-xs font-bold text-black dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">{record.instance_type}</span>
      </td>
      {/* Product-type-specific columns */}
      {activeProductType === 'database' ? (
        <>
          <td data-col="engine_category" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.engine || '—'}</span>
          </td>
          <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.category || '—'}</span>
          </td>
          <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
              {record.attributes?.deployment_type || 'Provisioned'}
            </span>
          </td>
          <td data-col="ha_mode_os" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.ha_mode || '—'}</span>
          </td>
        </>
      ) : activeProductType === 'data-analytics' ? (
        <>
          <td data-col="engine_category" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.engine || '—'}</span>
          </td>
          <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
              {record.attributes?.deployment_type || 'Provisioned'}
            </span>
          </td>
          <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.tier || '—'}</span>
          </td>
          <td data-col="vcpus" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.vcpus || '—'}</span>
          </td>
        </>
      ) : activeProductType === 'serverless' ? (
        <>
          <td data-col="languages" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
              {record.attributes?.supportedLanguages ? (Array.isArray(record.attributes.supportedLanguages) ? record.attributes.supportedLanguages.join(', ') : record.attributes.supportedLanguages) : '—'}
            </span>
          </td>
          <td data-col="engine_category" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.cold_start_overhead_ms || '—'}</span>
          </td>
          <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
              {record.attributes?.timeout_seconds ? (Number(record.attributes.timeout_seconds) >= 60 ? `${Number(record.attributes.timeout_seconds) / 60} min` : `${record.attributes.timeout_seconds} sec`) : '—'}
            </span>
          </td>
          <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
              {record.attributes?.memory_configuration ? (String(record.attributes.memory_configuration).toLowerCase().includes('configurable') ? 'Configurable' : String(record.attributes.memory_configuration).toLowerCase().includes('tier') ? 'Tiers' : String(record.attributes.memory_configuration).toLowerCase().includes('auto') ? 'Automatic' : record.attributes.memory_configuration) : '—'}
            </span>
          </td>
          <td data-col="ha_mode_os" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">
              {record.attributes?.free_invocations_per_month && Number(record.attributes.free_invocations_per_month) > 0 ? 'Yes' : 'No'}
            </span>
          </td>
          <td data-col="granularity" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.billing_granularity_ms ? `${record.attributes.billing_granularity_ms}ms` : '—'}</span>
          </td>
          <td data-col="exec_model" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.execution_model || '—'}</span>
          </td>
          <td data-col="prov_concurrency" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">
              {record.attributes?.provisioned_concurrency_support || '—'}
            </span>
          </td>
          <td data-col="max_storage" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.max_ephemeral_storage_gb ? `${record.attributes.max_ephemeral_storage_gb} GB` : '—'}</span>
          </td>
          <td data-col="inv_price" className="px-6 py-4 whitespace-nowrap text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
                {record.attributes?.invocation_price_per_1m ? `$${Number(record.attributes.invocation_price_per_1m).toFixed(2)}` : '—'}
              </span>
              {record.attributes?.invocation_price_per_1m && maxInvPrice !== undefined && maxInvPrice > 0 && (
                <div className="w-12 h-1 bg-[#e5e5e5] dark:bg-[#262626] rounded-full overflow-hidden flex justify-start">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${(Number(record.attributes.invocation_price_per_1m) / maxInvPrice) * 100}%`,
                      backgroundColor: '#6366f1'
                    }}
                  />
                </div>
              )}
            </div>
          </td>
        </>
      ) : activeProductType === 'containers' ? (
        <>
          <td data-col="engine_category" className="px-6 py-4 text-center whitespace-nowrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.orchestrator || '—'}</span>
          </td>
          <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.compute_type || '—'}</span>
          </td>
          <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.architecture || '—'}</span>
          </td>
          <td data-col="ha_mode_os" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.billing_granularity || '—'}</span>
          </td>
          <td data-col="gpu" className="px-6 py-4 text-center whitespace-nowrap">
            {record.gpu_count > 0
              ? <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">GPU</span>
              : <span className="text-[10px] font-bold text-[#d4d4d4] dark:text-[#404040]">—</span>
            }
          </td>
        </>
      ) : activeProductType === 'networking' ? (
        <>
          <td data-col="engine_category" className="px-6 py-4 text-center whitespace-nowrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.service || '—'}</span>
          </td>
          <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.category || '—'}</span>
          </td>
          <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.transfer_tier || '—'}</span>
          </td>
          <td data-col="ha_mode_os" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.destination || '—'}</span>
          </td>
          <td data-col="gpu" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.included_transfer || '—'}</span>
          </td>
        </>
      ) : (
        <>
          <td data-col="engine_category" className="px-6 py-4 text-center whitespace-nowrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.category || 'General purpose'}</span>
          </td>
          <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373] dark:text-[#a3a3a3]">{record.cpu_vendor || '—'}</span>
          </td>
          <td data-col="deployment_arch" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
              {record.arch === 'x86 64' ? 'x86' : (record.arch || '—')}
            </span>
          </td>
          <td data-col="ha_mode_os" className="px-6 py-4 font-bold text-[#737373] text-[10px] uppercase text-center whitespace-nowrap">{record.os || '—'}</td>
          <td data-col="gpu" className="px-6 py-4 text-center whitespace-nowrap">
            {record.gpu_count > 0
              ? <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">GPU</span>
              : <span className="text-[10px] font-bold text-[#d4d4d4] dark:text-[#404040]">—</span>
            }
          </td>
        </>
      )}
      {/* Geography */}
      <td data-col="geography" className="px-6 py-4 whitespace-nowrap text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.geography || '—'}</span>
      </td>
      {/* vCPU, Memory */}
      {activeProductType !== 'networking' && activeProductType !== 'data-analytics' && (
        <>
          <td data-col="vcpus" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.vcpus || '—'}</span>
          </td>
          <td data-col="memory_gb" className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.memory_gb || '—'}</span>
          </td>
        </>
      )}
      {/* Price */}
      <td data-col="price_per_unit" className="px-6 py-4 text-center whitespace-nowrap">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-bold text-black dark:text-white">
            {showAggregation
              ? `$${(parseFloat(record.price_per_unit) * 8760).toFixed(2)}`
              : `$${parseFloat(record.price_per_unit).toFixed(4)}`}
          </span>
          {maxPrice !== undefined && maxPrice > 0 && (
            <div className="w-16 h-1 bg-[#e5e5e5] dark:bg-[#262626] rounded-full overflow-hidden flex justify-start">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${(parseFloat(record.price_per_unit) / maxPrice) * 100}%`,
                  backgroundColor: '#6366f1'
                }}
              />
            </div>
          )}
        </div>
      </td>
      {/* Source */}
      <td data-col="source" className="px-6 py-4 text-center whitespace-nowrap">
        {record.data_source === 'static_config' ? (
          <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">Static</span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]">API</span>
        )}
      </td>
    </tr>
  );
}
