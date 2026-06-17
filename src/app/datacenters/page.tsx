'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Footer, ProductTypeSelector } from '@/components';
import { PROVIDER_INFRA, GEOGRAPHIES, type ProviderInfrastructure, type DatacenterRegion } from '@/config/datacenter_data';
import { ChevronDown, ExternalLink } from 'lucide-react';

// ─── helpers ─────────────────────────────────────────────────────────────────

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-[18px] font-black text-[#171717] dark:text-[#f7f8ff] tabular-nums leading-none">
        {value.toLocaleString()}
      </div>
      <div className="text-[9px] font-bold text-[#737373] uppercase tracking-widest leading-tight">{label}</div>
      {sub && <div className="text-[9px] text-[#a3a3a3] leading-tight">{sub}</div>}
    </div>
  );
}

function GeoChip({ geo, count }: { geo: string; count: number }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] text-[#525252] dark:text-[#a3a3a3]">
      {geo} <span className="text-[#171717] dark:text-[#f7f8ff]">{count}</span>
    </span>
  );
}

function StatusDot({ status }: { status: DatacenterRegion['status'] }) {
  if (status === 'available') return <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block shrink-0" />;
  if (status === 'announced') return <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] inline-block shrink-0" />;
  return <span className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3] inline-block shrink-0" />;
}

function ProviderRow({
  p,
  isExpanded,
  onToggle,
  selectedGeos,
}: {
  p: ProviderInfrastructure;
  isExpanded: boolean;
  onToggle: () => void;
  selectedGeos: string[];
}) {
  const visibleRegions = useMemo(() =>
    p.regionList.filter(r => selectedGeos.length === 0 || selectedGeos.includes(r.geography)),
    [p.regionList, selectedGeos]
  );

  const hasGovCloud = p.governmentRegions > 0;

  return (
    <>
      {/* Summary row */}
      <tr className="border-b border-[#e5e5e5] dark:border-[#262626] hover:bg-[#fafafa] dark:hover:bg-[#0a0a0a] transition-colors">
        {/* Provider */}
        <td className="py-4 px-4 min-w-[160px]">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className="flex items-center gap-2 group text-left"
            >
              <ChevronDown
                size={12}
                className={`text-[#737373] transition-transform shrink-0 ${isExpanded ? '' : '-rotate-90'}`}
              />
              <span className="text-[12px] font-bold text-[#171717] dark:text-[#f7f8ff] group-hover:text-[#2563eb] dark:group-hover:text-[#818cf8] transition-colors">
                {p.nameShort}
              </span>
            </button>
          </div>
          <div className="text-[10px] text-[#737373] mt-0.5 pl-5">Since {p.since}</div>
        </td>
        {/* Regions */}
        <td className="py-4 px-4 text-center">
          <span className="text-[14px] font-black text-[#171717] dark:text-[#f7f8ff] tabular-nums">{p.regions}</span>
          {p.announcedRegions > 0 && (
            <div className="text-[9px] text-[#f59e0b] font-bold mt-0.5">+{p.announcedRegions} planned</div>
          )}
        </td>
        {/* AZs */}
        <td className="py-4 px-4 text-center">
          {p.availabilityZones > 0 ? (
            <span className="text-[14px] font-black text-[#171717] dark:text-[#f7f8ff] tabular-nums">{p.availabilityZones}</span>
          ) : (
            <span className="text-[11px] text-[#a3a3a3]">—</span>
          )}
          {p.availabilityZones > 0 && p.regions > 0 && (
            <div className="text-[9px] text-[#737373] mt-0.5">~{Math.round(p.availabilityZones / p.regions)} / region</div>
          )}
        </td>
        {/* Edge */}
        <td className="py-4 px-4 text-center">
          <span className="text-[14px] font-black text-[#171717] dark:text-[#f7f8ff] tabular-nums">{p.edgeLocations.toLocaleString()}+</span>
        </td>
        {/* Countries */}
        <td className="py-4 px-4 text-center">
          <span className="text-[14px] font-black text-[#171717] dark:text-[#f7f8ff] tabular-nums">{p.countriesServed}+</span>
        </td>
        {/* Gov Cloud */}
        <td className="py-4 px-4 text-center">
          {hasGovCloud ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#22c55e] bg-[#f0fdf4] dark:bg-[#052e16] border border-[#bbf7d0] dark:border-[#166534] px-2 py-0.5 rounded">
              ✓ {p.governmentRegions} regions
            </span>
          ) : (
            <span className="text-[10px] text-[#a3a3a3]">—</span>
          )}
        </td>
        {/* Coverage chips */}
        <td className="py-4 px-4">
          <div className="flex flex-wrap gap-1">
            {GEOGRAPHIES.map(geo => (
              <GeoChip key={geo} geo={geo} count={p.geographyCoverage[geo] ?? 0} />
            ))}
          </div>
        </td>
      </tr>

      {/* Expanded region list */}
      {isExpanded && (
        <tr className="bg-[#fafafa] dark:bg-[#050505] border-b border-[#e5e5e5] dark:border-[#262626]">
          <td colSpan={7} className="px-4 py-4">
            {visibleRegions.length === 0 ? (
              <p className="text-[11px] text-[#737373] pl-5">No regions match the selected geography filter.</p>
            ) : (
              <div className="pl-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1">
                {GEOGRAPHIES.map(geo => {
                  const geoRegions = visibleRegions.filter(r => r.geography === geo);
                  if (geoRegions.length === 0) return null;
                  return (
                    <div key={geo} className="mb-3">
                      <div className="text-[9px] font-bold text-[#a3a3a3] uppercase tracking-widest mb-1.5">{geo}</div>
                      {geoRegions.map(r => (
                        <div key={r.code} className="flex items-center gap-2 py-0.5">
                          <StatusDot status={r.status} />
                          <span className="text-[11px] text-[#171717] dark:text-[#e5e7eb]">{r.name}</span>
                          <span className="text-[9px] text-[#a3a3a3] font-mono">{r.code}</span>
                          {r.azCount > 1 && (
                            <span className="text-[9px] text-[#737373]">{r.azCount} AZs</span>
                          )}
                          {r.status === 'announced' && (
                            <span className="text-[9px] font-bold text-[#f59e0b]">Planned</span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-3 pl-5 flex items-center gap-3">
              {p.sources.map(src => (
                <a
                  key={src.url}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-[#2563eb] dark:text-[#818cf8] hover:underline"
                >
                  <ExternalLink size={10} />
                  {src.label}
                </a>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function DatacentersPage() {
  const [selectedGeos, setSelectedGeos] = useState<string[]>([]);
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({});

  const toggleGeo = (geo: string) => {
    setSelectedGeos(prev =>
      prev.includes(geo) ? prev.filter(g => g !== geo) : [...prev, geo]
    );
  };

  const toggleProvider = (id: string) => {
    setExpandedProviders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProviders = useMemo(() => {
    if (selectedGeos.length === 0) return PROVIDER_INFRA;
    return PROVIDER_INFRA.filter(p =>
      selectedGeos.some(geo => (p.geographyCoverage[geo] ?? 0) > 0)
    );
  }, [selectedGeos]);

  // Aggregate totals
  const totals = useMemo(() => ({
    regions: PROVIDER_INFRA.reduce((s, p) => s + p.regions, 0),
    azs: PROVIDER_INFRA.reduce((s, p) => s + p.availabilityZones, 0),
    announced: PROVIDER_INFRA.reduce((s, p) => s + p.announcedRegions, 0),
  }), []);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#000000] text-[#171717] dark:text-[#e5e7eb] font-sans overflow-hidden">
      <ProductTypeSelector activeProductType={'datacenters' as any} />

      <div className="flex-1 overflow-auto flex flex-col">
        <div className="flex flex-1 w-full">

          {/* Sidebar */}
          <aside className="w-[240px] border-r border-[#e5e5e5] dark:border-[#262626] p-6 hidden md:flex flex-col gap-6 bg-white dark:bg-[#000000] overflow-y-auto shrink-0">
            {/* Geography filter */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Geography</h2>
                <button
                  onClick={() => setSelectedGeos([])}
                  className={`text-[10px] font-bold uppercase transition-colors ${selectedGeos.length > 0 ? 'text-black dark:text-[#f7f8ff]' : 'text-[#737373]'}`}
                >
                  {selectedGeos.length > 0 ? 'Clear' : 'All'}
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                {GEOGRAPHIES.map(geo => (
                  <button
                    key={geo}
                    onClick={() => toggleGeo(geo)}
                    className={`w-full text-left px-3 py-1.5 rounded text-[11px] font-bold transition-all border ${
                      selectedGeos.includes(geo)
                        ? 'bg-black dark:bg-[#f7f8ff] text-[#f7f8ff] dark:text-black border-black dark:border-[#f7f8ff]'
                        : 'bg-[#f5f5f5] dark:bg-[#0a0a0a] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {geo}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div>
              <h2 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-3">Legend</h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] text-[#737373]">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0" /> Available
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#737373]">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" /> Announced / Planned
                </div>
              </div>
            </div>

            {/* Data note */}
            <div className="mt-auto">
              <p className="text-[9px] text-[#a3a3a3] leading-relaxed">
                Data sourced from each provider's public infrastructure pages. Click a provider row to see region details and source links.
              </p>
              <p className="text-[9px] text-[#a3a3a3] mt-1">Last verified: June 2026</p>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 overflow-x-auto p-6 lg:p-8 pb-20">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-[16px] font-bold mb-1 text-[#171717] dark:text-[#f7f8ff]">Cloud Infrastructure</h1>
              <p className="text-[11px] text-[#737373] max-w-2xl leading-relaxed">
                Compare data center presence, availability zones, and global coverage across providers.
                Click any row to expand the full region list with AZ counts.
              </p>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 max-w-lg">
              <div className="bg-[#f5f5f5] dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-[#262626] rounded p-3">
                <Stat label="Total Regions" value={totals.regions} />
              </div>
              <div className="bg-[#f5f5f5] dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-[#262626] rounded p-3">
                <Stat label="Total AZs" value={totals.azs} />
              </div>
              <div className="bg-[#f5f5f5] dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-[#262626] rounded p-3">
                <Stat label="Planned" value={`+${totals.announced}`} />
              </div>
            </div>

            {/* Main table */}
            <div className="border border-[#e5e5e5] dark:border-[#262626] rounded overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] dark:border-[#262626] bg-[#fafafa] dark:bg-[#050505]">
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap">Provider</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">Regions</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">Availability Zones</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">Edge Locations</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">Countries</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">Gov Cloud</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest">Geographic Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProviders.map(p => (
                    <ProviderRow
                      key={p.id}
                      p={p}
                      isExpanded={!!expandedProviders[p.id]}
                      onToggle={() => toggleProvider(p.id)}
                      selectedGeos={selectedGeos}
                    />
                  ))}
                  {filteredProviders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[11px] text-[#737373]">
                        No providers match the selected geography.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Geographic coverage matrix */}
            <div className="mt-8">
              <h2 className="text-[12px] font-bold mb-1 text-[#171717] dark:text-[#f7f8ff]">Regional Coverage Matrix</h2>
              <p className="text-[11px] text-[#737373] mb-4">Number of available regions per provider per geography.</p>
              <div className="border border-[#e5e5e5] dark:border-[#262626] rounded overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5e5e5] dark:border-[#262626] bg-[#fafafa] dark:bg-[#050505]">
                      <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap">Provider</th>
                      {GEOGRAPHIES.map(geo => (
                        <th key={geo} className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">{geo}</th>
                      ))}
                      <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROVIDER_INFRA.map((p, i) => (
                      <tr key={p.id} className={`border-b border-[#e5e5e5] dark:border-[#262626] ${i % 2 === 0 ? '' : 'bg-[#fafafa] dark:bg-[#050505]'}`}>
                        <td className="py-3 px-4 text-[12px] font-bold text-[#171717] dark:text-[#f7f8ff] whitespace-nowrap">{p.nameShort}</td>
                        {GEOGRAPHIES.map(geo => {
                          const count = p.geographyCoverage[geo] ?? 0;
                          const isSelected = selectedGeos.length === 0 || selectedGeos.includes(geo);
                          return (
                            <td key={geo} className="py-3 px-4 text-center">
                              {count > 0 ? (
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-[11px] font-black transition-opacity ${
                                  isSelected
                                    ? 'bg-black dark:bg-[#f7f8ff] text-[#f7f8ff] dark:text-black'
                                    : 'bg-[#e5e5e5] dark:bg-[#262626] text-[#a3a3a3] opacity-30'
                                }`}>
                                  {count}
                                </span>
                              ) : (
                                <span className="text-[#e5e5e5] dark:text-[#262626] text-[12px]">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-3 px-4 text-center">
                          <span className="text-[12px] font-black text-[#171717] dark:text-[#f7f8ff] tabular-nums">{p.regions}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AZ per region detail */}
            <div className="mt-8">
              <h2 className="text-[12px] font-bold mb-1 text-[#171717] dark:text-[#f7f8ff]">Availability Zones per Region</h2>
              <p className="text-[11px] text-[#737373] mb-4">Average AZs and totals. DigitalOcean uses single data center regions without traditional AZs.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {PROVIDER_INFRA.map(p => (
                  <div key={p.id} className="bg-[#f5f5f5] dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-[#262626] rounded p-4 flex flex-col gap-2">
                    <div className="text-[11px] font-bold text-[#171717] dark:text-[#f7f8ff]">{p.nameShort}</div>
                    {p.availabilityZones > 0 ? (
                      <>
                        <div className="text-[22px] font-black text-[#171717] dark:text-[#f7f8ff] tabular-nums leading-none">{p.availabilityZones}</div>
                        <div className="text-[9px] text-[#737373] uppercase tracking-widest">Total AZs</div>
                        <div className="text-[11px] text-[#737373]">~{Math.round(p.availabilityZones / p.regions)} per region</div>
                      </>
                    ) : (
                      <>
                        <div className="text-[22px] font-black text-[#171717] dark:text-[#f7f8ff] tabular-nums leading-none">{p.regions}</div>
                        <div className="text-[9px] text-[#737373] uppercase tracking-widest">Data Centers</div>
                        <div className="text-[11px] text-[#737373]">Single DC / region</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
