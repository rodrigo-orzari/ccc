'use client';

import React, { RefObject, useState, useEffect, useRef, useCallback } from 'react';
import type { ProductType, PricingRecord } from '@/types';
import { formatInstanceName } from '@/lib/formatInstanceName';

// ─── Provider colour map ────────────────────────────────────────────────────
const PROVIDERS: { id: string; name: string; color: string }[] = [
  { id: 'aws',          name: 'AWS',           color: '#FF9900' },
  { id: 'azure',        name: 'Azure',         color: '#00BCFF' },
  { id: 'gcp',          name: 'Google',        color: '#34A853' },
  { id: 'oracle',       name: 'Oracle',        color: '#F80000' },
  { id: 'digitalocean', name: 'DigitalOcean',  color: '#0069FF' },
  { id: 'alibaba',      name: 'Alibaba', color: '#FF6A00' },
];

// ─── Column definitions ─────────────────────────────────────────────────────
interface ColDef { key: string; defaultWidth: number; }

const C = (key: string, defaultWidth: number): ColDef => ({ key, defaultWidth });

// Shared columns
const COL_PROVIDER   = C('provider',             100);
const COL_SKU        = C('instance_type',         180);
const COL_GEO        = C('geography',             120);
const COL_VCPU       = C('vcpus',                  70);
const COL_MEM        = C('memory_gb',             110);
const COL_PRICE      = C('price_per_unit',        140);
const COL_SOURCE     = C('source',                 80);

// Shared middle slots (reused with different labels per product type)
const COL_MID1       = C('engine_category',       140);
const COL_MID2       = C('db_family_cpu_vendor',  130);
const COL_MID3       = C('deployment_arch',       130);
const COL_MID4       = C('ha_mode_os',            100);
const COL_GPU        = C('gpu',                    70);

// Serverless-specific
const COL_SVC_TYPE   = C('svc_type',              130);
const COL_ARCH       = C('arch',                   90);
const COL_LANG       = C('languages',             160);
const COL_GRAN       = C('granularity',           100);
const COL_EXEC       = C('exec_model',            130);
const COL_PROV       = C('prov_concurrency',      140);
const COL_STOR       = C('max_storage',           110);
const COL_INV        = C('inv_price',             140);
const COL_UNIT       = C('unit',                  140);

const ALL_DEFS: ColDef[] = [
  COL_PROVIDER, COL_SKU, COL_GEO, COL_VCPU, COL_MEM, COL_PRICE, COL_SOURCE,
  COL_MID1, COL_MID2, COL_MID3, COL_MID4, COL_GPU,
  COL_SVC_TYPE, COL_ARCH, COL_LANG, COL_GRAN, COL_EXEC, COL_PROV, COL_STOR, COL_INV, COL_UNIT,
];

const DEFAULT_WIDTHS: Record<string, number> =
  Object.fromEntries(ALL_DEFS.map(c => [c.key, c.defaultWidth]));

const MIN_WIDTH = 48;

function getColDefs(pt: ProductType): ColDef[] {
  const start = [COL_PROVIDER, COL_SKU];
  const tail  = [COL_GEO, COL_PRICE, COL_SOURCE];
  const specs = [COL_VCPU, COL_MEM];
  const tailWithSpecs = [COL_GEO, ...specs, COL_PRICE, COL_SOURCE];

  if (pt === 'vm')           return [...start, COL_MID1, COL_MID2, COL_MID3, COL_MID4, COL_GPU, ...tailWithSpecs];
  if (pt === 'database')     return [...start, COL_MID1, COL_MID2, COL_MID3, COL_MID4, ...tailWithSpecs];
  if (pt === 'serverless')   return [...start, COL_SVC_TYPE, COL_ARCH, COL_LANG, COL_MID1, COL_MID2, COL_MID3, COL_MID4, COL_GRAN, COL_EXEC, COL_PROV, COL_STOR, COL_INV, COL_GEO, ...specs, COL_UNIT, COL_PRICE, COL_SOURCE];
  if (pt === 'containers')   return [...start, COL_MID1, COL_MID2, COL_MID3, COL_MID4, ...tailWithSpecs];
  if (pt === 'networking')   return [...start, COL_MID1, COL_MID2, COL_MID3, COL_MID4, COL_GPU, ...tail];
  if (pt === 'storage')        return [...start, COL_MID1, COL_MID2, COL_MID3, COL_MID4, ...tail];
  if (pt === 'app-hosting')    return [...start, COL_MID1, COL_MID2, COL_MID4, ...tailWithSpecs];
  if (pt === 'data-analytics') return [...start, COL_MID1, COL_MID3, COL_MID2, COL_VCPU, ...tail];
  if (pt === 'ai')             return [...start, COL_MID1, COL_MID3, COL_MID2, COL_MID4, COL_PRICE, COL_INV];
  return [...start, ...tail];
}

// ─── LocalStorage helpers ───────────────────────────────────────────────────
const lsKey = (pt: string) => `ccc_col_widths_v2_${pt}`;

function loadWidths(pt: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(lsKey(pt));
    if (raw) return { ...DEFAULT_WIDTHS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_WIDTHS };
}

function saveWidths(pt: string, w: Record<string, number>) {
  try { localStorage.setItem(lsKey(pt), JSON.stringify(w)); } catch { /* ignore */ }
}

// ─── Sort icon ──────────────────────────────────────────────────────────────
interface SortConfig { key: string; direction: 'asc' | 'desc'; }

const SortIcon = ({ sortKey, sortConfig }: { sortKey: string; sortConfig: SortConfig }) => {
  const active = sortConfig.key === sortKey;
  return (
    <span className={`ml-1 inline-block transition-opacity ${active ? 'opacity-100' : 'opacity-25'}`}>
      {active ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );
};

// ─── Props ──────────────────────────────────────────────────────────────────
interface PricingTableProps {
  data: PricingRecord[];
  loading: boolean;
  activeProductType: ProductType;
  showAggregation: boolean;
  tableScrollRef: RefObject<HTMLDivElement>;
  hasHorizontalOverflow: boolean;
  scrolledToEnd: boolean;
  sortConfig: SortConfig;
  onHeaderClick: (key: string) => void;
}

// ─── Resize handle ──────────────────────────────────────────────────────────
function ResizeHandle({ onStart, onReset }: { onStart: (e: React.PointerEvent) => void; onReset: () => void }) {
  return (
    <div
      className="ccc-rh"
      onPointerDown={onStart}
      onDoubleClick={(e) => { e.stopPropagation(); onReset(); }}
    >
      <div className="ccc-rh-line" />
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
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
  const [colWidths, setColWidths] = useState<Record<string, number>>(DEFAULT_WIDTHS);
  const widthsRef = useRef(colWidths);
  widthsRef.current = colWidths;

  // Reload widths from localStorage whenever the active product type changes
  useEffect(() => {
    setColWidths(loadWidths(activeProductType));
  }, [activeProductType]);

  const startResize = useCallback((e: React.PointerEvent, colKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX   = e.clientX;
    const startW   = widthsRef.current[colKey] ?? DEFAULT_WIDTHS[colKey] ?? 100;

    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (ev: PointerEvent) => {
      const next = Math.max(MIN_WIDTH, startW + ev.clientX - startX);
      setColWidths(prev => ({ ...prev, [colKey]: next }));
    };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      saveWidths(activeProductType, widthsRef.current);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [activeProductType]);

  const resetWidth = useCallback((colKey: string) => {
    setColWidths(prev => {
      const next = { ...prev, [colKey]: DEFAULT_WIDTHS[colKey] ?? 100 };
      saveWidths(activeProductType, next);
      return next;
    });
  }, [activeProductType]);

  const colDefs    = getColDefs(activeProductType);
  const totalWidth = colDefs.reduce((s, c) => s + (colWidths[c.key] ?? c.defaultWidth), 0);

  const maxPrice = data.length > 0 ? Math.max(...data.map(r => parseFloat(r.price_per_unit) || 0)) : 0;
  const maxInvPrice = activeProductType === 'serverless' && data.length > 0
    ? Math.max(...data.map(r => Number(r.attributes?.invocation_price_per_1m) || 0))
    : 0;

  // For VMs, databases, and AI the name is the provider's real instance/model
  // identifier (e.g. m8a.12xlarge, db.r8i.4xlarge, GPT-5.4) and is searchable in
  // the provider's catalog. For serverless/containers/networking/analytics the
  // name is a normalized configuration the tool defines for comparison and may not
  // match an official provider SKU — flag that so users don't search for it in vain.
  const isRealSku = ['vm', 'database', 'ai'].includes(activeProductType);
  const skuTooltip = isRealSku
    ? "Provider instance/model identifier — searchable in the provider's catalog."
    : "Normalized configuration for cross-provider comparison — not an official provider SKU. Verify exact pricing on the provider's pricing page.";

  // Helper: build a <th> with sort + resize handle
  const Th = ({
    colKey, sortKey, label, className = '',
  }: { colKey: string; sortKey?: string; label: React.ReactNode; className?: string }) => (
    <th
      data-col={colKey}
      onClick={sortKey ? () => onHeaderClick(sortKey) : undefined}
      className={`px-6 py-4 font-bold whitespace-nowrap ccc-th ${sortKey ? 'cursor-pointer hover:text-black dark:hover:text-[#f7f8ff] transition-colors' : ''} ${className}`}
      style={{ width: colWidths[colKey] ?? DEFAULT_WIDTHS[colKey] }}
    >
      <div className="flex items-center justify-center h-full w-full">
        {label}
        {sortKey && <SortIcon sortKey={sortKey} sortConfig={sortConfig} />}
      </div>
      <ResizeHandle
        onStart={(e) => startResize(e, colKey)}
        onReset={() => resetWidth(colKey)}
      />
    </th>
  );

  return (
    <>
      {/* Resize handle styles — scoped to CCC table */}
      <style>{`
        .ccc-th {
          position: relative;
          overflow: hidden;
        }
        /* Hit zone — wider than the visible line so it's easier to grab */
        .ccc-rh {
          position: absolute;
          right: 0;
          top: 0;
          width: 12px;
          height: 100%;
          cursor: col-resize;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Always-visible divider line — signals the resize boundary */
        .ccc-rh-line {
          width: 2px;
          height: 65%;
          background: #e5e5e5;
          border-radius: 1px;
          pointer-events: none;
          transition: background 0.12s, height 0.12s;
        }
        /* Full-column hover: nudge the line a bit brighter */
        .ccc-th:hover .ccc-rh-line { background: #c4b5fd; height: 75%; }
        /* Direct handle hover: full indigo — "you can drag here" */
        .ccc-rh:hover  .ccc-rh-line { background: #6366f1; height: 80%; }
        @media (prefers-color-scheme: dark) {
          .ccc-rh-line { background: #2a2a2a; }
          .ccc-th:hover .ccc-rh-line { background: #4c4570; }
          .ccc-rh:hover  .ccc-rh-line { background: #818cf8; }
        }
      `}</style>

      <div
        ref={tableScrollRef}
        className={`flex-1 custom-scrollbar ${hasHorizontalOverflow && !scrolledToEnd ? 'scroll-fade-right' : ''}`}
        style={{ minHeight: 0, overflowY: 'auto', overflowX: 'scroll' }}
      >
        {/* Inner div fixes the table width so the scroll container can measure it */}
        <div style={{ width: totalWidth }}>
          <table
            className="border-collapse"
            style={{ tableLayout: 'fixed', width: totalWidth }}
          >
            <colgroup>
              {colDefs.map(c => (
                <col key={c.key} style={{ width: colWidths[c.key] ?? c.defaultWidth }} />
              ))}
            </colgroup>

            <thead className="sticky top-0 bg-[#f7f8ff] dark:bg-[#06060f] z-10 border-b border-[#dde0f0] dark:border-[#1e1e38]">
              <tr className="text-[10px] font-bold uppercase tracking-widest text-[#1e1e38] dark:text-[#dde0f0]">

                <Th colKey="provider"       sortKey="provider"       label="Provider" />
                <Th colKey="instance_type"  sortKey="instance_type"  label={<span title={skuTooltip} style={{ cursor: 'help' }}>Configuration <span style={{ opacity: 0.45, fontWeight: 400 }}>ⓘ</span></span>} />

                {/* ── Product-type-specific middle columns ── */}
                {activeProductType === 'database' ? (<>
                  <Th colKey="engine_category"    sortKey="attributes.engine"          label="Engine" />
                  <Th colKey="db_family_cpu_vendor" sortKey="attributes.tier"          label="Tier" />
                  <Th colKey="deployment_arch"    sortKey="attributes.deployment_type" label="Deployment" />
                  <Th colKey="ha_mode_os"         sortKey="attributes.ha_mode"         label="HA Mode" />
                </>) : activeProductType === 'data-analytics' ? (<>
                  <Th colKey="engine_category"    sortKey="attributes.engine"          label="Engine" />
                  <Th colKey="deployment_arch"    sortKey="attributes.deployment_type" label="Deployment Type" />
                  <Th colKey="db_family_cpu_vendor" sortKey="attributes.tier"          label="Tier" />
                  <Th colKey="vcpus"              sortKey="vcpus"                      label="Compute Unit" />
                </>) : activeProductType === 'ai' ? (<>
                  <Th colKey="engine_category"    sortKey="service"                    label="Service" />
                  <Th colKey="deployment_arch"    sortKey="attributes.modelTier"       label="Model Tier" />
                  <Th colKey="db_family_cpu_vendor" sortKey="attributes.contextWindowK" label="Context Window" />
                  <Th colKey="ha_mode_os"         sortKey="attributes.multimodal"      label="Multimodal" />
                </>) : activeProductType === 'serverless' ? (<>
                  <Th colKey="svc_type"           sortKey="attributes.service_type" label="Service Type" />
                  <Th colKey="arch"               sortKey="arch"      label="Arch" />
                  <Th colKey="languages"          label="Languages" />
                  <Th colKey="engine_category"    label="Cold Start (ms)" />
                  <Th colKey="db_family_cpu_vendor" label="Timeout (sec)" />
                  <Th colKey="deployment_arch"    label="Memory Config" />
                  <Th colKey="ha_mode_os"         label="Free Tier" />
                  <Th colKey="granularity"        label="Granularity" />
                  <Th colKey="exec_model"         label="Exec. Model" />
                  <Th colKey="prov_concurrency"   label="Prov. Concurrency" />
                  <Th colKey="max_storage"        label="Max Storage" />
                  <Th colKey="inv_price"          label="Inv. Price ($/1M)" />
                </>) : activeProductType === 'containers' ? (<>
                  <Th colKey="engine_category"    label="Orchestrator" />
                  <Th colKey="db_family_cpu_vendor" label="Compute Type" />
                  <Th colKey="deployment_arch"    label="Architecture" />
                  <Th colKey="ha_mode_os"         label="Granularity" />
                  <Th colKey="gpu"                label="GPU" />
                </>) : activeProductType === 'networking' ? (<>
                  <Th colKey="engine_category"    label="Service" />
                  <Th colKey="db_family_cpu_vendor" label="Billing Model" />
                  <Th colKey="deployment_arch"    label="Usage Tier" />
                  <Th colKey="ha_mode_os"         label="Port Capacity" />
                  <Th colKey="gpu"                label="Transfer Scope" />
                </>) : activeProductType === 'storage' ? (<>
                  <Th colKey="engine_category"    sortKey="attributes.storage_type" label="Type" />
                  <Th colKey="db_family_cpu_vendor" sortKey="attributes.tier"        label="Tier" />
                  <Th colKey="deployment_arch"    sortKey="attributes.redundancy"  label="Redundancy" />
                  <Th colKey="ha_mode_os"         sortKey="attributes.media"       label="Media" />
                </>) : activeProductType === 'app-hosting' ? (<>
                  <Th colKey="engine_category"    sortKey="attributes.tier"         label="Tier" />
                  <Th colKey="db_family_cpu_vendor" sortKey="attributes.compute_type" label="Compute Type" />
                  <Th colKey="ha_mode_os"         sortKey="os"                      label="OS" />
                </>) : (<>
                  {/* vm (default) */}
                  <Th colKey="engine_category"    sortKey="category"   label="Category" />
                  <Th colKey="db_family_cpu_vendor" sortKey="cpu_vendor" label="CPU Vendor" />
                  <Th colKey="deployment_arch"    sortKey="arch"       label="Arch" />
                  <Th colKey="ha_mode_os"         sortKey="os"         label="OS" />
                  <Th colKey="gpu"                sortKey="gpu_count"  label="GPU" />
                </>)}

                {activeProductType !== 'ai' && <Th colKey="geography" sortKey="geography" label="Geo" />}

                {activeProductType !== 'networking' && activeProductType !== 'data-analytics' && activeProductType !== 'ai' && activeProductType !== 'storage' && (<>
                  <Th colKey="vcpus"     sortKey="vcpus"     label="vCPU" />
                  <Th colKey="memory_gb" sortKey="memory_gb" label="Memory (GB)" />
                </>)}

                {activeProductType === 'serverless' && <Th colKey="unit" sortKey="unit" label="Pricing Unit" />}

                <Th
                  colKey="price_per_unit"
                  sortKey="price_per_unit"
                  label={activeProductType === 'ai' ? 'Input Price (/1M)' : activeProductType === 'serverless' ? 'Price ($)' : (showAggregation ? 'Yearly price ($)' : 'Hourly price ($)')}
                  className="text-black dark:text-[#f7f8ff] hover:opacity-80"
                />
                
                {activeProductType === 'serverless' && <Th colKey="source" sortKey="data_source" label="Source" />}
                {activeProductType === 'ai' && <Th colKey="inv_price" sortKey="attributes.outputPricePer1M" label="Output Price (/1M)" />}
                {activeProductType !== 'serverless' && activeProductType !== 'ai' && <Th colKey="source" sortKey="data_source" label="Source" />}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#dde0f0] dark:divide-[#181818]">
              {loading ? (
                Array.from({ length: 15 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {colDefs.map(c => (
                      <td key={c.key} className="px-6 py-4">
                        <div className="h-3 bg-[#dde0f0] dark:bg-[#1e1e38] rounded w-12 mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((record, index) => (
                  <TableRow
                    key={index}
                    record={record}
                    index={index}
                    activeProductType={activeProductType}
                    showAggregation={showAggregation}
                    maxPrice={maxPrice}
                    maxInvPrice={maxInvPrice}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={colDefs.length} className="px-6 py-32 text-center text-[#737373] dark:text-[#525252] italic text-sm">
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
    </>
  );
}

// ─── Table row ───────────────────────────────────────────────────────────────
function TableRow({
  record, index, activeProductType, showAggregation, maxPrice, maxInvPrice,
}: {
  record: PricingRecord;
  index: number;
  activeProductType: ProductType;
  showAggregation: boolean;
  maxPrice?: number;
  maxInvPrice?: number;
}) {
  const providerColor = PROVIDERS.find(
    p => (record.provider || '').toLowerCase() === p.id || record.provider === p.name,
  )?.color ?? '#525252';

  return (
    <tr className={`transition-colors group ${index % 2 === 0 ? 'bg-[#f7f8ff] dark:bg-[#06060f]' : 'bg-[#e8eaf8] dark:bg-[#10102a]'} hover:bg-[#eef2ff] dark:hover:bg-[#111827]`}>
      {/* Provider */}
      <td data-col="provider" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">
        <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border" style={{ color: providerColor, borderColor: providerColor + '50', backgroundColor: providerColor + '18' }}>
          {record.provider}
        </span>
      </td>

      {/* SKU */}
      <td data-col="instance_type" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">
        <span className="text-xs font-bold text-[#404040] dark:text-[#d4d4d4]" title={record.instance_type}>{formatInstanceName(record.instance_type, record.provider)}</span>
      </td>

      {/* Product-type-specific cells */}
      {activeProductType === 'database' ? (<>
        <td data-col="engine_category"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.engine || '—'}</span></td>
        <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.category || '—'}</span></td>
        <td data-col="deployment_arch"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.deployment_type || 'Provisioned'}</span></td>
        <td data-col="ha_mode_os"           className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.ha_mode || '—'}</span></td>
      </>) : activeProductType === 'data-analytics' ? (<>
        <td data-col="engine_category"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.engine || '—'}</span></td>
        <td data-col="deployment_arch"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.deployment_type || 'Provisioned'}</span></td>
        <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.tier || '—'}</span></td>
        <td data-col="vcpus"               className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.vcpus || '—'}</span></td>
      </>) : activeProductType === 'ai' ? (<>
        <td data-col="engine_category"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.service || '—'}</span></td>
        <td data-col="deployment_arch"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.modelTier || '—'}</span></td>
        <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.contextWindowK ? `${record.attributes.contextWindowK}K` : '—'}</span></td>
        <td data-col="ha_mode_os"           className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.multimodal || '—'}</span></td>
      </>) : activeProductType === 'serverless' ? (<>
        <td data-col="svc_type"            className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
            {record.attributes?.service_type || 'Compute'}
          </span>
        </td>
        <td data-col="arch"                className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.arch === 'x86 64' ? 'x86' : (record.arch || '—')}</span></td>
        <td data-col="languages"           className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.supportedLanguages ? (Array.isArray(record.attributes.supportedLanguages) ? record.attributes.supportedLanguages.join(', ') : record.attributes.supportedLanguages) : '—'}</span></td>
        <td data-col="engine_category"     className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.cold_start_overhead_ms || '—'}</span></td>
        <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.timeout_seconds ? (Number(record.attributes.timeout_seconds) >= 60 ? `${Number(record.attributes.timeout_seconds) / 60} min` : `${record.attributes.timeout_seconds} sec`) : '—'}</span></td>
        <td data-col="deployment_arch"     className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.memory_configuration ? (String(record.attributes.memory_configuration).toLowerCase().includes('configurable') ? 'Configurable' : String(record.attributes.memory_configuration).toLowerCase().includes('tier') ? 'Tiers' : String(record.attributes.memory_configuration).toLowerCase().includes('auto') ? 'Automatic' : record.attributes.memory_configuration) : '—'}</span></td>
        <td data-col="ha_mode_os"          className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">{record.attributes?.service_type && record.attributes.service_type !== 'Compute' ? <span className="text-[10px] font-bold text-[#d4d4d4] dark:text-[#404040]">—</span> : <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.free_invocations_per_month && Number(record.attributes.free_invocations_per_month) > 0 ? 'Yes' : 'No'}</span>}</td>
        <td data-col="granularity"         className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.billing_granularity_ms ? `${record.attributes.billing_granularity_ms}ms` : '—'}</span></td>
        <td data-col="exec_model"          className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.execution_model || '—'}</span></td>
        <td data-col="prov_concurrency"    className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">{record.attributes?.provisioned_concurrency_support ? <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes.provisioned_concurrency_support}</span> : <span className="text-[10px] font-bold text-[#d4d4d4] dark:text-[#404040]">—</span>}</td>
        <td data-col="max_storage"         className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.max_ephemeral_storage_gb ? `${record.attributes.max_ephemeral_storage_gb} GB` : '—'}</span></td>
        <td data-col="inv_price"           className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.invocation_price_per_1m ? `$${Number(record.attributes.invocation_price_per_1m).toFixed(2)}` : '—'}</span>
            {record.attributes?.invocation_price_per_1m && maxInvPrice !== undefined && maxInvPrice > 0 && (
              <div className="w-12 h-1 bg-[#dde0f0] dark:bg-[#1e1e38] rounded-full overflow-hidden flex justify-start">
                <div className="h-full rounded-full" style={{ width: `${(Number(record.attributes.invocation_price_per_1m) / maxInvPrice) * 100}%`, backgroundColor: '#6366f1' }} />
              </div>
            )}
          </div>
        </td>
      </>) : activeProductType === 'containers' ? (<>
        <td data-col="engine_category"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.orchestrator || '—'}</span></td>
        <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.compute_type || '—'}</span></td>
        <td data-col="deployment_arch"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.architecture || '—'}</span></td>
        <td data-col="ha_mode_os"           className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.billing_granularity || '—'}</span></td>
        <td data-col="gpu"                  className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">{record.gpu_count > 0 ? <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">GPU</span> : <span className="text-[10px] font-bold text-[#d4d4d4] dark:text-[#404040]">—</span>}</td>
      </>) : activeProductType === 'networking' ? (<>
        <td data-col="engine_category"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.service || '—'}</span></td>
        <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.billing_model || '—'}</span></td>
        <td data-col="deployment_arch"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.usage_tier || '—'}</span></td>
        <td data-col="ha_mode_os"           className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.port_capacity || '—'}</span></td>
        <td data-col="gpu"                  className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.transfer_scope || '—'}</span></td>
      </>) : activeProductType === 'storage' ? (<>
        <td data-col="engine_category"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.storage_type || '—'}</span></td>
        <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.tier || '—'}</span></td>
        <td data-col="deployment_arch"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.redundancy || '—'}</span></td>
        <td data-col="ha_mode_os"           className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.media || '—'}</span></td>
      </>) : activeProductType === 'app-hosting' ? (<>
        <td data-col="engine_category"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.tier || '—'}</span></td>
        <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.compute_type || '—'}</span></td>
        <td data-col="ha_mode_os"           className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden font-bold text-[#737373] text-[10px] uppercase">{record.os || '—'}</td>
      </>) : (<>
        {/* vm (default) */}
        <td data-col="engine_category"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.category || 'General purpose'}</span></td>
        <td data-col="db_family_cpu_vendor" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373] dark:text-[#a3a3a3]">{record.cpu_vendor || '—'}</span></td>
        <td data-col="deployment_arch"      className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.arch === 'x86 64' ? 'x86' : (record.arch || '—')}</span></td>
        <td data-col="ha_mode_os"           className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden font-bold text-[#737373] text-[10px] uppercase">{record.os || '—'}</td>
        <td data-col="gpu"                  className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">{record.gpu_count > 0 ? <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">GPU</span> : <span className="text-[10px] font-bold text-[#d4d4d4] dark:text-[#404040]">—</span>}</td>
      </>)}

      {/* Geography */}
      {activeProductType !== 'ai' && (
        <td data-col="geography" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.geography || '—'}</span>
        </td>
      )}

      {/* vCPU + Memory (not shown for networking / data-analytics / ai / storage) */}
      {activeProductType !== 'networking' && activeProductType !== 'data-analytics' && activeProductType !== 'ai' && activeProductType !== 'storage' && (<>
        <td data-col="vcpus"     className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.vcpus || '—'}</span></td>
        <td data-col="memory_gb" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden"><span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.memory_gb || '—'}</span></td>
      </>)}

      {/* Pricing Unit (serverless only, since units vary widely: GB-Hour vs per 1M Requests vs Mo) */}
      {activeProductType === 'serverless' && (
        <td data-col="unit" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.unit || '—'}</span>
        </td>
      )}

      {/* Price */}
      <td data-col="price_per_unit" className="px-6 py-4 text-center align-middle whitespace-nowrap overflow-hidden">
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            {(() => {
              const curr = parseFloat(record.price_per_unit);
              const prev = record.previous_price_per_unit != null ? parseFloat(record.previous_price_per_unit) : null;
              if (prev === null || prev === 0) return <span className="text-[10px] text-[#d4d4d4] dark:text-[#404040]" title="No previous price data">●</span>;
              if (curr > prev) return <span className="text-[10px] text-[#ef4444] font-bold leading-none" title={`Up from $${prev.toFixed(4)}`}>▲</span>;
              if (curr < prev) return <span className="text-[10px] text-[#22c55e] font-bold leading-none" title={`Down from $${prev.toFixed(4)}`}>▼</span>;
              return <span className="text-[10px] text-[#a3a3a3] font-bold leading-none" title="Unchanged since last ingest">●</span>;
            })()}
            <span className="text-xs font-bold text-black dark:text-[#f7f8ff]">
              {activeProductType === 'ai' || activeProductType === 'serverless' ? `$${parseFloat(record.price_per_unit).toFixed(4)}` : (showAggregation ? `$${(parseFloat(record.price_per_unit) * 8760).toFixed(2)}` : `$${parseFloat(record.price_per_unit).toFixed(4)}`)}
            </span>
          </div>
          {maxPrice !== undefined && maxPrice > 0 && (
            <div className="w-16 h-1 bg-[#dde0f0] dark:bg-[#1e1e38] rounded-full overflow-hidden flex justify-start">
              <div className="h-full rounded-full" style={{ width: `${(parseFloat(record.price_per_unit) / maxPrice) * 100}%`, backgroundColor: '#6366f1' }} />
            </div>
          )}
        </div>
      </td>

      {/* Source / Output Price */}
      {activeProductType === 'serverless' && (
        <td data-col="source" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">
          <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#dde0f0] dark:bg-[#1e1e38] text-[#737373] dark:text-[#a3a3a3] border-[#dde0f0] dark:border-[#1e1e38]">
            {record.data_source === 'static_config' ? 'Static' : 'API'}
          </span>
        </td>
      )}

      {activeProductType === 'ai' && (
        <td data-col="inv_price" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.outputPricePer1M ? `$${Number(record.attributes.outputPricePer1M).toFixed(4)}` : '—'}</span>
        </td>
      )}

      {activeProductType !== 'serverless' && activeProductType !== 'ai' && (
        <td data-col="source" className="px-6 py-4 whitespace-nowrap text-center align-middle overflow-hidden">
          <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-[#dde0f0] dark:bg-[#1e1e38] text-[#737373] dark:text-[#a3a3a3] border-[#dde0f0] dark:border-[#1e1e38]">
            {record.data_source === 'static_config' ? 'Static' : 'API'}
          </span>
        </td>
      )}
    </tr>
  );
}
