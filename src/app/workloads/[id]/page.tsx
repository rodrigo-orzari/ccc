'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { Footer, WorkloadHeader } from '@/components';
import { WORKLOADS } from '@/config/workloads';
import { WorkloadDefinition } from '@/types';
import { PROVIDERS, GEOGRAPHIES } from '@/config';

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

function ArchitectureStrip({ workload, expanded, onToggle }: { workload: WorkloadDefinition; expanded: boolean; onToggle: () => void }) {
  // Horizontal flow chip strip — collapsible. Default collapsed so the comparison
  // table is the first thing users see; the strip is a "what's in this workload"
  // disclosure for those who care.
  return (
    <div className="border border-[#e5e5e5] dark:border-[#262626] rounded bg-white dark:bg-[#000000]">
      <button
        onClick={onToggle}
        className="w-full px-5 py-3 border-b border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between text-left bg-transparent hover:bg-[#fafafa] dark:hover:bg-[#0a0a0a] transition-colors"
      >
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
          Architecture Diagram
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
          {expanded ? 'Hide ▲' : 'Show ▼'}
        </span>
      </button>
      {expanded && (
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
      )}
    </div>
  );
}

export default function WorkloadDetails() {
  const params = useParams();
  const id = params.id as string;
  const workload = WORKLOADS.find((w) => w.id === id);

  const [parameters, setParameters] = useState<Record<string, number>>({});
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('Global');
  const [pricingModel, setPricingModel] = useState<'PAYG' | 'Yearly'>('PAYG');
  const [diagramExpanded, setDiagramExpanded] = useState(false);

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
        if (!comp || comp.monthlyPrice === 0) {
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
      const isUnavailable = pData.components.some((c: any) => c.monthlyPrice === 0 && c.instanceType !== 'Not available');
      totalRow.push(isUnavailable || pData.total === 0 ? 'N/A' : (pData.total * mult).toFixed(2));
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
        <WorkloadHeader />
        <div className="flex-1 flex items-center justify-center text-[11px] uppercase tracking-widest text-[#737373]">
          Workload not found
        </div>
        <Footer />
      </div>
    );
  }

  const multiplier = pricingModel === 'Yearly' ? 12 : 1;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#000000] text-[#171717] dark:text-[#e5e7eb] font-sans">
      <WorkloadHeader />

      {/* Workload identity strip — content aligns with the main grid's max-width
          so the title sits flush with the architecture/comparison boxes below. */}
      <div className="border-b border-[#e5e5e5] dark:border-[#262626]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex items-center gap-3">
          <span className="text-2xl">{workload.icon}</span>
          <div className="min-w-0">
            <h1 className="text-[14px] font-bold text-[#171717] dark:text-[#e5e7eb] truncate">{workload.name}</h1>
            <p className="text-[11px] text-[#737373] truncate">{workload.description}</p>
          </div>
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full flex flex-col gap-6">
        {/* Architecture strip — collapsible, sits above the table */}
        <ArchitectureStrip
          workload={workload}
          expanded={diagramExpanded}
          onToggle={() => setDiagramExpanded(!diagramExpanded)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tables */}
          <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          {/* Combined Configuration + Cost table */}
          <div className="border border-[#e5e5e5] dark:border-[#262626] rounded bg-white dark:bg-[#000000]">
            <div className="px-5 py-3 border-b border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between gap-3">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
                {pricingModel === 'Yearly' ? 'Yearly' : 'Monthly'} Comparison
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#737373] hidden sm:inline">Cheapest match per component</span>
                <button
                  onClick={handleExport}
                  disabled={!results}
                  title="Export the comparison as CSV"
                  className="flex items-center gap-2 text-[10px] font-bold text-[#737373] dark:text-[#a3a3a3] border border-[#dde0f0] dark:border-[#1e1e38] px-3 py-1.5 rounded hover:bg-[#dde0f0] dark:hover:bg-[#1e1e38] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={12} /> Export
                </button>
              </div>
            </div>

            {loading && !results ? (
              <div className="flex items-center justify-center min-h-[240px]">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black dark:border-white"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f5f5f5] dark:bg-[#171717]">
                    <tr className="border-b border-[#e5e5e5] dark:border-[#262626]">
                      <th className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">Service</span>
                      </th>
                      {PROVIDER_IDS.map(p => <ProviderTh key={p} id={p} />)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5f5f5] dark:divide-[#181818]">
                    {workload.components.map(c => (
                      <tr key={c.id} className="hover:bg-[#fafafa] dark:hover:bg-[#0a0a0a] transition-colors">
                        <td className="py-3 px-4 align-middle whitespace-nowrap text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <span>{c.icon}</span>
                            <span className="text-[11px] font-bold text-[#171717] dark:text-[#e5e7eb]">{c.name}</span>
                          </div>
                        </td>
                        {PROVIDER_IDS.map(provider => {
                          if (!results || !results[provider]) {
                            return (
                              <td key={provider} className="py-3 px-4 align-middle text-center">
                                <span className="text-[10px] uppercase tracking-widest text-[#a3a3a3] dark:text-[#404040]">—</span>
                              </td>
                            );
                          }
                          const comp = results[provider].components.find((x: any) => x.componentId === c.id);
                          if (!comp || comp.monthlyPrice === 0) {
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
                                  {comp.quantity > 1 ? <span className="text-[#737373] font-bold">{comp.quantity}× </span> : ''}{comp.instanceType}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
                                  ${(comp.monthlyPrice * multiplier).toFixed(2)}
                                </span>
                              </Link>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr className="bg-[#f5f5f5] dark:bg-[#171717] border-t border-[#e5e5e5] dark:border-[#262626]">
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#171717] dark:text-[#e5e7eb]">
                          Total / {pricingModel === 'Yearly' ? 'Year' : 'Month'}
                        </span>
                      </td>
                      {PROVIDER_IDS.map(provider => {
                        if (!results || !results[provider]) {
                          return <td key={provider} className="py-3 px-4 text-center"><span className="text-[10px] text-[#a3a3a3]">—</span></td>;
                        }
                        const pData = results[provider];
                        const isUnavailable = pData.components.some((c: any) => c.monthlyPrice === 0 && c.instanceType !== 'Not available');
                        return (
                          <td key={provider} className="py-3 px-4 text-center">
                            {isUnavailable || pData.total === 0 ? (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">N/A</span>
                            ) : (
                              <span className="text-[13px] font-bold text-black dark:text-white">
                                ${(pData.total * multiplier).toFixed(2)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Workload Carousel */}
          <div className="mt-8 border-t border-[#e5e5e5] dark:border-[#262626] pt-8">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
                Explore Other Workloads
              </h3>
              <Link href="/workloads" className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest hover:underline">
                View All →
              </Link>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4">
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
          </div>

        </div>

        {/* Configuration panel — mirrors FilterSidebar chip patterns */}
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
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
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
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>

            {/* Workload Scale */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Workload Scale</h3>
              <div className="space-y-5">
                {workload.parameters.map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[11px] font-bold text-[#171717] dark:text-[#e5e7eb]">{p.label}</label>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#171717] dark:text-[#e5e7eb] bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] px-2 py-0.5 rounded">
                        {parameters[p.id]} {p.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={p.min}
                      max={p.max}
                      step={p.step}
                      value={parameters[p.id] || p.defaultValue}
                      onChange={(e) => setParameters({ ...parameters, [p.id]: Number(e.target.value) })}
                      className="w-full accent-black dark:accent-white cursor-pointer h-1 bg-[#e5e5e5] dark:bg-[#262626] rounded appearance-none outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-[#a3a3a3] dark:text-[#525252] mt-1 font-mono">
                      <span>{p.min}</span>
                      <span>{p.max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        </div>
      </main>

      {/* Disclaimer — plain text, no box, so it reads as fine-print not a feature panel. */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-8 text-[11px] text-[#737373] leading-relaxed">
        <strong className="text-[#171717] dark:text-[#e5e7eb] uppercase tracking-widest text-[10px]">Disclaimer:</strong>{' '}
        This calculator is conceptual and designed for comparison purposes. The algorithm auto-selects the cheapest matching general-purpose infrastructure components available in our database that satisfy the raw memory and compute minimums derived from your scale parameters. It does not account for licensing, egress fees, custom integrations, or platform limitations. Consult official provider documentation for workload sizing.
      </div>

      <Footer />
    </div>
  );
}
