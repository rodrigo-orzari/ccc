'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Footer, ProductTypeSelector } from '@/components';
import { WORKLOADS } from '@/config/workloads';
import { WorkloadDefinition } from '@/types';
import { PROVIDERS, GEOGRAPHIES } from '@/config';
import { formatInstanceName } from '@/lib/formatInstanceName';

// Map a workload component's productType to the URL ?product= value the main
// catalog page expects. Most match 1:1; vm is a special case (catalog uses 'vm'
// in the UI but the API normalizes to 'compute', and the URL surface uses 'vm').
const catalogProductType = (productType: string) => productType === 'vm' ? 'vm' : productType;

// Region options match the main app's GEOGRAPHIES filter with a 'Global' prepend so
// workload comparisons can either span everything or scope to a continent. Same names
// as the FilterSidebar's Geography chips so users see the same vocabulary.
const REGION_OPTIONS = ['Global', ...GEOGRAPHIES];

const providerColor = (slug: string) =>
  PROVIDERS.find(p => p.id === slug)?.color ?? '#525252';
const providerName = (slug: string) => PROVIDERS.find(p => p.id === slug)?.name ?? slug;
const formatNumber = (n: number | string) => Number(n).toLocaleString();

// Provider order — pulled from the canonical PROVIDERS config so workload comparisons
// and main pricing tables show providers in the same sequence and with the same names.
const PROVIDER_IDS = ['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'alibaba'] as const;

function ProviderTh({ id }: { id: string }) {
  // Match the colored pill used in PricingTable's provider column so workload
  // comparison cells and main-catalog rows share the same provider grammar.
  const color = providerColor(id);
  return (
    <th className="py-3 px-4 text-center">
      <span
        className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border"
        style={{ color, borderColor: color + '50', backgroundColor: color + '18' }}
      >
        {providerName(id)}
      </span>
    </th>
  );
}

function ArchitectureStrip({ workload }: { workload: WorkloadDefinition }) {
  // Horizontal flow chip strip — always visible at the bottom.
  return (
    <div className="border border-[#e5e5e5] dark:border-[#262626] rounded bg-white dark:bg-[#000000]">
      <div className="w-full px-5 py-3 border-b border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between text-left">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
          Architecture Diagram
        </h2>
      </div>
      <div className="px-5 py-5 overflow-x-auto">
        {/* mx-auto + w-max centers the chip row within the box when content fits;
            overflow-x-auto on the parent keeps long chains scrollable. */}
        <div className="flex items-center gap-2 min-w-max w-max mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373] bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded px-3 py-2 whitespace-nowrap">
            Users / API
          </span>
          {workload.components.map((component) => (
            <React.Fragment key={component.id}>
              <span className="text-[#a3a3a3] dark:text-[#525252] text-xs">→</span>
              <span className="flex items-center gap-2 bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded px-3 py-2 whitespace-nowrap" title={component.description}>
                <span className="text-sm">{component.icon}</span>
                <span className="text-[11px] font-bold text-[#171717] dark:text-[#e5e7eb]">{component.name}</span>
              </span>
            </React.Fragment>
          ))}
          <span className="text-[#a3a3a3] dark:text-[#525252] text-xs">→</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373] bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded px-3 py-2 whitespace-nowrap">
            Result / Response
          </span>
        </div>
      </div>
    </div>
  );
}

export default function WorkloadDetails() {
  const params = useParams();
  const id = params.id as string;
  const workload = WORKLOADS.find((w) => w.id === id);

  const scrollbarStyles = `
    .always-show-scrollbar {
      overflow-y: hidden !important;
      overflow-x: scroll !important;
      scrollbar-width: thin !important;
      scrollbar-gutter: stable !important;
    }
    .always-show-scrollbar::-webkit-scrollbar {
      height: 8px;
    }
    .always-show-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .always-show-scrollbar::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
      min-height: 40px;
    }
    .always-show-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
    @media (prefers-color-scheme: dark) {
      .always-show-scrollbar::-webkit-scrollbar-thumb {
        background: #4b5563;
      }
      .always-show-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
      }
    }
  `;

  const [parameters, setParameters] = useState<Record<string, number>>({});
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('Global');
  const [pricingModel, setPricingModel] = useState<'PAYG' | 'Yearly'>('PAYG');
  const [viewMode, setViewMode] = useState<'table' | 'charts'>('table');
  const [diagramExpanded, setDiagramExpanded] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set(PROVIDER_IDS));

  const carouselRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canTableScrollLeft, setCanTableScrollLeft] = useState(false);
  const [canTableScrollRight, setCanTableScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  const checkTableScroll = () => {
    if (tableRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
      setCanTableScrollLeft(scrollLeft > 0);
      setCanTableScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  const tableScrollLeft = () => {
    tableRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
  };

  const tableScrollRight = () => {
    tableRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
  };

  useEffect(() => {
    checkScroll();
    checkTableScroll();
    window.addEventListener('resize', checkScroll);
    window.addEventListener('resize', checkTableScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      window.removeEventListener('resize', checkTableScroll);
    };
  }, []);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
  };

  // Seed state from URL params on mount so shared links restore the exact configuration.
  useEffect(() => {
    if (!workload) return;
    const sp = new URLSearchParams(window.location.search);
    const initial: Record<string, number> = {};
    workload.parameters.forEach(p => {
      const fromUrl = sp.get(p.id);
      const parsed = fromUrl !== null ? Number(fromUrl) : NaN;
      initial[p.id] = Number.isFinite(parsed) ? parsed : p.defaultValue;
    });
    setParameters(initial);
    const r = sp.get('region');
    if (r) setRegion(r);
    const pm = sp.get('pricing');
    if (pm === 'PAYG' || pm === 'Yearly') setPricingModel(pm);
  }, [workload]);

  // Push state back to URL (replace, no history entry per stroke) so the bar always
  // reflects the current configuration and is shareable verbatim.
  useEffect(() => {
    if (!workload || Object.keys(parameters).length === 0) return;
    const sp = new URLSearchParams();
    workload.parameters.forEach(p => {
      if (parameters[p.id] !== undefined && parameters[p.id] !== p.defaultValue) {
        sp.set(p.id, String(parameters[p.id]));
      }
    });
    if (region !== 'Global') sp.set('region', region);
    if (pricingModel !== 'PAYG') sp.set('pricing', pricingModel);
    const qs = sp.toString();
    const next = window.location.pathname + (qs ? `?${qs}` : '');
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, '', next);
    }
  }, [workload, parameters, region, pricingModel]);

  useEffect(() => {
    if (!workload || Object.keys(parameters).length === 0) return;
    const fetchPricing = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/workloads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workloadId: workload.id, parameters, region }),
        });
        const data = await res.json();
        setResults(data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchPricing, 300);
    return () => clearTimeout(debounce);
  }, [parameters, region, workload]);

  // CSV export of the current comparison: one row per component × provider plus a
  // per-provider total row. Honors the active pricing model (PAYG vs Yearly).
  const handleExport = () => {
    if (!workload || !results) return;
    const mult = pricingModel === 'Yearly' ? 12 : 1;
    const headers = ['Service', ...PROVIDER_IDS.map(p => providerName(p)), ...PROVIDER_IDS.map(p => `${providerName(p)} (${pricingModel === 'Yearly' ? 'USD/yr' : 'USD/mo'})`)];
    const rows: string[][] = [];
    workload.components.forEach(c => {
      const row: string[] = [c.name];
      const prices: string[] = [];
      PROVIDER_IDS.forEach(provider => {
        const comp = results[provider]?.components.find((x: any) => x.componentId === c.id);
        if (!comp || comp.instanceType === 'N/A') {
          row.push('Unavailable');
          prices.push('');
        } else {
          row.push(comp.quantity > 1 ? `${comp.quantity}× ${comp.instanceType}` : comp.instanceType);
          prices.push((comp.monthlyPrice * mult).toFixed(2));
        }
      });
      rows.push([...row, ...prices]);
    });
    const totalRow: string[] = [`Total / ${pricingModel === 'Yearly' ? 'Year' : 'Month'}`, ...PROVIDER_IDS.map(() => '')];
    PROVIDER_IDS.forEach(provider => {
      const pData = results[provider];
      if (!pData) { totalRow.push(''); return; }
      const isUnavailable = pData.components.some((c: any) => c.instanceType === 'N/A');
      totalRow.push(isUnavailable ? 'N/A' : (pData.total * mult).toFixed(2));
    });
    rows.push(totalRow);

    const csv = [headers, ...rows]
      .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `workload-${workload.id}-${pricingModel.toLowerCase()}-${ts}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!workload) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-[#000000] text-[#171717] dark:text-[#e5e7eb]">
        <ProductTypeSelector activeProductType={"workloads" as any} />
        <div className="flex-1 flex items-center justify-center text-[11px] uppercase tracking-widest text-[#737373]">
          Workload not found
        </div>
        <Footer />
      </div>
    );
  }

  const multiplier = pricingModel === 'Yearly' ? 12 : 1;
  const validTotals = PROVIDER_IDS.map(p => results && results[p] ? results[p].total : 0).filter(t => t > 0);
  const maxTotalPrice = validTotals.length > 0 ? Math.max(...validTotals) : 0;

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#000000] text-[#171717] dark:text-[#e5e7eb] font-sans overflow-hidden">
      <style>{scrollbarStyles}</style>
      <ProductTypeSelector activeProductType={"workloads" as any} />

      <div className="flex-1 overflow-auto flex flex-col">
      {/* Workload identity strip — content aligns with the main grid's max-width
          so the title sits flush with the architecture/comparison boxes below. */}
      <div className="border-b border-[#e5e5e5] dark:border-[#262626]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex items-center gap-3">
          <span className="text-2xl">{workload.icon}</span>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#171717] dark:text-[#e5e7eb] truncate">{workload.name}</h1>
            <p className="text-sm text-[#737373] truncate">{workload.description}</p>
          </div>
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full flex flex-col gap-6">

        {/* Prices summary — heading + blurb above the per-provider total pills */}
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-bold mb-1 text-[#171717] dark:text-[#e5e7eb]">Prices</h2>
            <p className="text-sm text-[#737373]">
              This is the sum of the monthly PAYG/Yearly average prices for this workload.
            </p>
          </div>

          {results && (
            <div className="flex flex-col sm:flex-row bg-white dark:bg-[#000000] border border-[#e5e5e5] dark:border-[#262626] rounded overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-[#e5e5e5] dark:divide-[#262626]">
              {PROVIDER_IDS.map(provider => {
                const pData = results[provider];
                if (!pData) return null;
                const isUnavailable = pData.components.some((c: any) => c.instanceType === 'N/A');
                const color = providerColor(provider);

                return (
                  <div key={provider} className="flex-1 p-4 flex flex-col justify-between gap-3 min-w-[100px] bg-white dark:bg-[#000000]">
                    <div className="flex justify-between items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border" style={{ color: color, borderColor: color + '50', backgroundColor: color + '18' }}>
                        {providerName(provider)}
                      </span>
                      {isUnavailable ? (
                        <span className="text-xs font-bold uppercase tracking-widest text-[#737373]">N/A</span>
                      ) : (
                        <span className="text-sm font-bold text-black dark:text-white">
                          ${(pData.total * multiplier).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e5e5e5] dark:bg-[#262626]" />

        {/* Sponsorship Box — full-width, between the price summary and the table/filter row.
            Renders the sponsor's 1200×200 banner when workload.sponsor is set; otherwise
            falls back to the "become a sponsor" pitch. */}
        {workload.sponsor ? (
          <a
            href={workload.sponsor.linkUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block rounded overflow-hidden border border-[#e5e5e5] dark:border-[#262626]"
          >
            <img
              src={workload.sponsor.imageUrl}
              alt={`Sponsored by ${workload.sponsor.companyName}`}
              width={1200}
              height={200}
              className="w-full h-auto aspect-[6/1] object-cover"
            />
          </a>
        ) : (
          <div className="border-2 border-dashed border-[#d1d5db] dark:border-[#404040] rounded bg-gradient-to-br from-[#f9fafb] dark:from-[#0f1117] to-[#f3f4f6] dark:to-[#161b22] p-6 flex flex-col items-center gap-3 text-center">
            <div>
              <h3 className="text-sm font-bold text-[#171717] dark:text-[#f1f5f9] mb-1 flex items-center justify-center gap-2">
                <span className="text-2xl">🤝</span> Sponsor This Workload
              </h3>
              <p className="text-[13px] text-[#737373] dark:text-[#a3a3a3] leading-relaxed">
                Have your company featured as a sponsor of this workload comparison. Reach thousands of cloud decision-makers exploring pricing strategies.
              </p>
              <p className="text-[12px] font-bold text-[#171717] dark:text-[#e5e7eb] mt-2">
                📧 <a href="mailto:hello@comparecloudcosts.com" className="text-[#2563eb] dark:text-[#818cf8] hover:underline">hello@comparecloudcosts.com</a>
              </p>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-[#e5e5e5] dark:bg-[#262626]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Tables */}
          <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          {/* Monthly/Yearly Comparison — heading + blurb outside the table box */}
          <div>
            <h2 className="text-xl font-bold mb-1 text-[#171717] dark:text-[#e5e7eb]">
              {pricingModel === 'Yearly' ? 'Yearly' : 'Monthly'} Comparison
            </h2>
            <p className="text-sm text-[#737373]">
              Prices by provider and services that enable users to run this workload.
            </p>
          </div>

          {/* Combined Configuration + Cost table */}
          <div className="flex flex-col flex-1 border border-[#e5e5e5] dark:border-[#262626] rounded bg-white dark:bg-[#000000]">
            <div className="px-5 py-3 border-b border-[#e5e5e5] dark:border-[#262626] flex items-center justify-end gap-3">
              <div className="flex bg-[#f5f5f5] dark:bg-[#171717] p-0.5 rounded-lg border border-[#e5e5e5] dark:border-[#262626]">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-[#f7f8ff] dark:bg-[#1e1e38] text-[#171717] dark:text-[#f7f8ff] shadow-sm' : 'text-[#737373] hover:text-[#171717] dark:hover:text-[#f7f8ff]'}`}
                >
                  📊 Table
                </button>
                <button
                  onClick={() => setViewMode('charts')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'charts' ? 'bg-[#f7f8ff] dark:bg-[#1e1e38] text-[#171717] dark:text-[#f7f8ff] shadow-sm' : 'text-[#737373] hover:text-[#171717] dark:hover:text-[#f7f8ff]'}`}
                >
                  📈 Chart
                </button>
              </div>
              <button
                onClick={handleExport}
                disabled={!results}
                title="Export the comparison as CSV"
                className="flex items-center gap-2 text-[10px] font-bold text-[#737373] dark:text-[#a3a3a3] border border-[#dde0f0] dark:border-[#1e1e38] px-3 py-1.5 rounded hover:bg-[#dde0f0] dark:hover:bg-[#1e1e38] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={12} /> Export
              </button>
            </div>

            {loading && !results ? (
              <div className="flex items-center justify-center min-h-[240px]">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black dark:border-white"></div>
              </div>
            ) : viewMode === 'charts' ? (
              <div className="p-6 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={PROVIDER_IDS.map(p => {
                      const pData = results && results[p];
                      if (!pData || pData.total === 0 || pData.components.some((c: any) => c.instanceType === 'N/A')) return null;
                      return {
                        provider: providerName(p),
                        total: pData.total * multiplier,
                        fill: providerColor(p)
                      };
                    }).filter(Boolean)} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="provider" tick={{ fill: '#888', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#888', fontSize: 12 }} tickFormatter={(val) => `$${val.toLocaleString('en-US')}`} />
                    <RechartsTooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff', borderRadius: 8 }} itemStyle={{ color: '#fff', fontWeight: 'bold' }} formatter={(val: number) => [`$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Total']} />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                      {PROVIDER_IDS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={providerColor(entry)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="relative group flex-1">
                {canTableScrollLeft && (
                  <button
                    onClick={tableScrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 bg-white dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded-full shadow-md text-black dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#262626] transition-all"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div
                  ref={tableRef}
                  onScroll={checkTableScroll}
                  className="overflow-x-scroll flex-1 always-show-scrollbar"
                >
                  <table className="w-full min-w-[900px] h-full text-left border-collapse">
                  <thead className="bg-[#f5f5f5] dark:bg-[#171717]">
                    <tr className="border-b border-[#e5e5e5] dark:border-[#262626]">
                      <th className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">Service</span>
                      </th>
                      {PROVIDER_IDS.filter(p => selectedProviders.has(p)).map(p => <ProviderTh key={p} id={p} />)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5f5f5] dark:divide-[#181818]">
                    {workload.components.map(c => {
                      const compPrices = PROVIDER_IDS.map(provider => {
                        if (!results || !results[provider]) return 0;
                        const comp = results[provider].components.find((x: any) => x.componentId === c.id);
                        return comp ? comp.monthlyPrice : 0;
                      }).filter(p => p > 0);
                      const maxCompPrice = compPrices.length > 0 ? Math.max(...compPrices) : 0;
                      
                      return (
                      <tr key={c.id} className="hover:bg-[#fafafa] dark:hover:bg-[#0a0a0a] transition-colors">
                        <td className="py-3 px-4 align-middle whitespace-nowrap text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <span>{c.icon}</span>
                            <span className="text-[11px] font-bold text-[#171717] dark:text-[#e5e7eb]">{c.name}</span>
                          </div>
                        </td>
                        {PROVIDER_IDS.filter(p => selectedProviders.has(p)).map(provider => {
                          if (!results || !results[provider]) {
                            return (
                              <td key={provider} className="py-3 px-4 align-middle text-center">
                                <span className="text-[10px] uppercase tracking-widest text-[#a3a3a3] dark:text-[#404040]">—</span>
                              </td>
                            );
                          }
                          const comp = results[provider].components.find((x: any) => x.componentId === c.id);
                          if (!comp || comp.instanceType === 'N/A') {
                            return (
                              <td key={provider} className="py-3 px-4 align-middle text-center">
                                <span className="text-[10px] uppercase tracking-widest text-[#a3a3a3] dark:text-[#404040]">Unavailable</span>
                              </td>
                            );
                          }
                          // Reqs from the component drive both the workload match and the deep-link
                          // back into the main catalog so users can pivot from "AWS picked this" to
                          // "show me all AWS options that satisfy this requirement".
                          const reqs = c.getRequirements(parameters || {});
                          const catalogParams = new URLSearchParams({
                            product: catalogProductType(reqs.productType),
                            provider,
                            search: comp.instanceType,
                          });
                          return (
                            <td key={provider} className="py-3 px-4 align-middle text-center">
                              <Link
                                href={`/?${catalogParams.toString()}`}
                                title={`Open ${comp.instanceType} in the main catalog`}
                                className="flex flex-col gap-0.5 items-center hover:opacity-80 transition-opacity"
                                style={{ textDecoration: 'none' }}
                              >
                                <span className="text-[11px] font-bold text-[#171717] dark:text-[#e5e7eb] truncate max-w-[160px] hover:underline">
                                  {comp.quantity > 1 ? <span className="text-[#737373] font-bold">{comp.quantity}× </span> : ''}{formatInstanceName(comp.instanceType, provider)}
                                </span>
                                <div className="flex flex-col items-center gap-1 w-full mt-1">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
                                    ${(comp.monthlyPrice * multiplier).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                </div>
                              </Link>
                            </td>
                          );
                        })}
                      </tr>
                    )})}
                    {/* Total row */}
                    <tr className="bg-[#f5f5f5] dark:bg-[#171717] border-t border-[#e5e5e5] dark:border-[#262626]">
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#171717] dark:text-[#e5e7eb]">
                          Total / {pricingModel === 'Yearly' ? 'Year' : 'Month'}
                        </span>
                      </td>
                      {PROVIDER_IDS.filter(p => selectedProviders.has(p)).map(provider => {
                        if (!results || !results[provider]) {
                          return <td key={provider} className="py-3 px-4 text-center"><span className="text-[10px] text-[#a3a3a3]">—</span></td>;
                        }
                        const pData = results[provider];
                        const isUnavailable = pData.components.some((c: any) => c.instanceType === 'N/A');
                        return (
                          <td key={provider} className="py-3 px-4 text-center">
                            {isUnavailable ? (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">N/A</span>
                            ) : (
                              <div className="flex flex-col items-center gap-1.5 w-full">
                                <span className="text-[13px] font-bold text-black dark:text-white">
                                  ${(pData.total * multiplier).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
                {canTableScrollRight && (
                  <button
                    onClick={tableScrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-2 bg-white dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded-full shadow-md text-black dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#262626] transition-all"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
            </div>
            )}
          </div>
        </div>

        {/* Configuration panel — mirrors FilterSidebar's chip patterns and section dividers */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="border border-[#e5e5e5] dark:border-[#262626] rounded bg-white dark:bg-[#000000] p-5 flex flex-col gap-6">
            {/* Pricing Model */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Pricing Model</h3>
              <div className="flex flex-wrap gap-2">
                {(['PAYG', 'Yearly'] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setPricingModel(opt)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                      pricingModel === opt
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm'
                        : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#737373] leading-relaxed">
                PAYG shows monthly on-demand cost. Yearly are committed-use discounts.
              </p>
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#262626] mx-1" />

            {/* Providers */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Providers</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedProviders(new Set(PROVIDER_IDS))}
                    className="text-[9px] font-bold text-[#2563eb] dark:text-[#818cf8] hover:underline"
                  >
                    All
                  </button>
                  <span className="text-[#a3a3a3]">/</span>
                  <button
                    onClick={() => setSelectedProviders(new Set())}
                    className="text-[9px] font-bold text-[#2563eb] dark:text-[#818cf8] hover:underline"
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {PROVIDER_IDS.map(providerId => {
                  const provName = providerName(providerId);
                  const isSelected = selectedProviders.has(providerId);
                  return (
                    <button
                      key={providerId}
                      onClick={() => {
                        const newProviders = new Set(selectedProviders);
                        if (isSelected) {
                          newProviders.delete(providerId);
                        } else {
                          newProviders.add(providerId);
                        }
                        setSelectedProviders(newProviders);
                      }}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                        isSelected
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm'
                          : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                      }`}
                    >
                      {provName}
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#262626] mx-1" />

            {/* Region */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Region</h3>
              <div className="flex flex-wrap gap-2">
                {REGION_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setRegion(opt)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                      region === opt
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm'
                        : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#262626] mx-1" />

            {/* Workload Scale */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Workload Scale</h3>
              <div className="space-y-5">
                {workload.parameters.map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[11px] font-bold text-[#171717] dark:text-[#e5e7eb]">{p.label}</label>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#171717] dark:text-[#e5e7eb] bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] px-2 py-0.5 rounded shadow-sm">
                        {formatNumber(parameters[p.id])} {p.unit}
                      </span>
                    </div>
                    <div className="relative h-6 flex items-center">
                      <div className="absolute w-full h-1 bg-[#e5e5e5] dark:bg-[#262626] rounded-full" />
                      <div
                        className="absolute h-1 bg-black dark:bg-white rounded-full pointer-events-none"
                        style={{
                          width: `${(((parameters[p.id] || p.defaultValue) - p.min) / (p.max - p.min)) * 100}%`
                        }}
                      />
                      <input
                        type="range"
                        min={p.min}
                        max={p.max}
                        step={p.step}
                        value={parameters[p.id] || p.defaultValue}
                        onChange={(e) => setParameters({ ...parameters, [p.id]: Number(e.target.value) })}
                        className="workload-slider absolute w-full top-1/2 -translate-y-1/2 cursor-pointer outline-none"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#a3a3a3] dark:text-[#525252] mt-1 font-mono">
                      <span>{formatNumber(p.min)}</span>
                      <span>{formatNumber(p.max)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        </div>

      </main>

      {/* Workload Carousel - Moved completely outside main to guarantee it renders below all content */}
      <div className="w-full border-t border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#000000]">
        <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 py-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
              Explore Other Workloads
            </h3>
            <Link href="/workloads" className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest hover:underline">
              View All →
            </Link>
          </div>
          
          <div className="relative group">
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 bg-white dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded-full shadow-md text-black dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#262626] transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div 
              ref={carouselRef}
              onScroll={checkScroll}
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar"
            >
              {WORKLOADS.filter(w => w.id !== id).map(w => (
                <Link
                  key={w.id}
                  href={`/workloads/${w.id}`}
                  className="snap-start shrink-0 w-[260px] p-4 bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded flex flex-col gap-2 hover:border-[#a3a3a3] dark:hover:border-[#404040] transition-colors"
                >
                  <div className="text-2xl mb-1">{w.icon}</div>
                  <h4 className="text-sm font-bold text-black dark:text-white leading-tight">{w.name}</h4>
                  <p className="text-[11px] text-[#737373] line-clamp-2 leading-relaxed">
                    {w.description}
                  </p>
                </Link>
              ))}
            </div>

            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-2 bg-white dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded-full shadow-md text-black dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#262626] transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer — plain text, no box, so it reads as fine-print not a feature panel. */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-8 text-[11px] text-[#737373] leading-relaxed">
        <strong className="text-[#171717] dark:text-[#e5e7eb] uppercase tracking-widest text-[10px]">Disclaimer:</strong>{' '}
        This calculator is conceptual and designed for comparison purposes. The algorithm auto-selects the cheapest matching general-purpose infrastructure components available in our database that satisfy the raw memory and compute minimums derived from your scale parameters. It does not account for licensing, egress fees, custom integrations, or platform limitations. Consult official provider documentation for workload sizing. Please consult the <Link href="/terms" className="underline hover:text-[#171717] dark:hover:text-[#e5e7eb]">Terms of Use</Link> for more information regarding data completeness and coverage.
      </div>

      </div>

      <Footer />
    </div>
  );
}
