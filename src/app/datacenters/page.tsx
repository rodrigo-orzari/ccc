'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Footer, ProductTypeSelector, DigitalOceanReferralModal } from '@/components';
import { PROVIDER_INFRA, GEOGRAPHIES, type ProviderInfrastructure, type DatacenterRegion } from '@/config/datacenter_data';
import { ChevronDown, ExternalLink, Info } from 'lucide-react';
import WorldMap from './WorldMap';

// Provider brand colors — keep in sync with src/config/index.ts PROVIDERS
const PROVIDER_COLORS: Record<string, string> = {
  aws: '#FF9900',
  azure: '#00BCFF',
  gcp: '#34A853',
  oracle: '#F80000',
  digitalocean: '#0069FF',
  alibaba: '#FF6A00',
};

// ─── glossary tooltip ────────────────────────────────────────────────────────

const GLOSSARY: Record<string, string> = {
  Region: 'A geographic cluster of data centers in a specific physical location. Each region is completely independent — isolated from failures in other regions.',
  'Availability Zone': 'One or more discrete data centers within a region, each with redundant power, networking, and connectivity. Multiple Availability Zones in a region let you build highly available applications that survive a single data center outage.',
  'Edge Location': 'A smaller point-of-presence node used for content delivery (CDN) and low-latency services, distinct from full compute regions.',
  'Government Cloud': 'Dedicated, isolated cloud regions operated to meet government compliance requirements (e.g. FedRAMP, IL4/IL5 in the US).',
};

function Term({ term, children }: { term: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const def = GLOSSARY[term];
  if (!def) return <>{children}</>;
  return (
    <span className="relative inline-flex items-center gap-0.5">
      {children}
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="text-[#737373] hover:text-[#1a1a2e] dark:hover:text-[#f7f8ff] transition-colors align-middle"
        aria-label={`Definition of ${term}`}
      >
        <Info size={11} />
      </button>
      {open && (
        <span className="absolute bottom-full left-0 mb-2 z-50 w-64 p-2.5 rounded border border-[#dde0f0] dark:border-[#1e1e38] bg-white dark:bg-[#0a0a18] shadow-lg text-[10px] text-[#1a1a2e] dark:text-[#e5e7eb] leading-relaxed font-normal normal-case tracking-normal">
          <span className="block font-bold text-[#1a1a2e] dark:text-[#f7f8ff] mb-1">{term}</span>
          {def}
        </span>
      )}
    </span>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-[20px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums leading-none">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-[9px] font-bold text-[#737373] uppercase tracking-widest leading-tight">{label}</div>
      {sub && <div className="text-[9px] text-[#a3a3a3] leading-tight">{sub}</div>}
    </div>
  );
}

function GeoChip({ geo, count }: { geo: string; count: number }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-[#dde0f0] dark:bg-[#1e1e38] border border-[#c7ccee] dark:border-[#2a2a4a] text-[#525252] dark:text-[#a3a3a3]">
      {geo}
    </span>
  );
}

function StatusDot({ status }: { status: DatacenterRegion['status'] }) {
  if (status === 'available') return <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block shrink-0" />;
  if (status === 'announced') return <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] inline-block shrink-0" />;
  return <span className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3] inline-block shrink-0" />;
}

function ProviderBadge({ id, name }: { id: string; name: string }) {
  const color = PROVIDER_COLORS[id] ?? '#888';
  return (
    <span
      className="w-fit self-start px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border"
      style={{ color, borderColor: color + '50', backgroundColor: color + '18' }}
    >
      {name}
    </span>
  );
}

function ProviderRow({
  p,
  rowIndex,
  isExpanded,
  onToggle,
}: {
  p: ProviderInfrastructure;
  rowIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const hasGovCloud = p.governmentRegions > 0;
  const color = PROVIDER_COLORS[p.id] ?? '#888';
  const rowBg = rowIndex % 2 === 0 ? 'bg-white dark:bg-[#06060f]' : 'bg-[#f7f8ff] dark:bg-[#0a0a18]';

  return (
    <>
      <tr className={`border-b border-[#dde0f0] dark:border-[#1e1e38] hover:bg-[#eef0fc] dark:hover:bg-[#0c0c1e] transition-colors ${rowBg}`}>
        <td className="py-4 px-4 min-w-[180px]">
          <div className="flex items-center justify-center gap-2.5">
            <span className="w-0.5 h-8 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <div>
              <button onClick={onToggle} className="flex items-center gap-1.5 group text-left">
                <ChevronDown size={11} className={`text-[#737373] transition-transform shrink-0 ${isExpanded ? '' : '-rotate-90'}`} />
                <ProviderBadge id={p.id} name={p.nameShort} />
              </button>
              <div className="text-[10px] text-[#737373] mt-1 pl-4">Since {p.since}</div>
            </div>
          </div>
        </td>
        <td className="py-4 px-4 text-center">
          <span className="text-[15px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">{p.regions}</span>
          {p.announcedRegions > 0 && (
            <div className="text-[9px] text-[#f59e0b] font-bold mt-0.5">+{p.announcedRegions} planned</div>
          )}
        </td>
        <td className="py-4 px-4 text-center">
          {p.availabilityZones > 0 ? (
            <span className="text-[15px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">{p.availabilityZones}</span>
          ) : (
            <span className="text-[11px] text-[#a3a3a3]">—</span>
          )}
          {p.availabilityZones > 0 && p.regions > 0 && (
            <div className="text-[9px] text-[#737373] mt-0.5">~{Math.round(p.availabilityZones / p.regions)} zones / region</div>
          )}
        </td>
        <td className="py-4 px-4 text-center">
          <span className="text-[15px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">{p.edgeLocations.toLocaleString()}+</span>
        </td>
        <td className="py-4 px-4 text-center">
          <span className="text-[15px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">{p.countriesServed}+</span>
        </td>
        <td className="py-4 px-4 text-center">
          {hasGovCloud ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#22c55e] bg-[#f0fdf4] dark:bg-[#052e16] border border-[#bbf7d0] dark:border-[#166534] px-2 py-0.5 rounded-full">
              ✓ {p.governmentRegions} regions
            </span>
          ) : (
            <span className="text-[10px] text-[#a3a3a3]">—</span>
          )}
        </td>
        <td className="py-4 px-4">
          <div className="flex flex-wrap gap-1 justify-center">
            {GEOGRAPHIES.map(geo => (
              <GeoChip key={geo} geo={geo} count={p.geographyCoverage[geo] ?? 0} />
            ))}
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-[#eef0fc] dark:bg-[#0c0c1e] border-b border-[#dde0f0] dark:border-[#1e1e38]">
          <td colSpan={7} className="px-4 py-5">
            <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1">
              {GEOGRAPHIES.map(geo => {
                const geoRegions = p.regionList.filter(r => r.geography === geo);
                if (geoRegions.length === 0) return null;
                return (
                  <div key={geo} className="mb-3">
                    <div className="text-[9px] font-bold text-[#737373] uppercase tracking-widest mb-1.5">{geo}</div>
                    {geoRegions.map(r => (
                      <div key={r.code} className="flex items-center gap-2 py-0.5">
                        <StatusDot status={r.status} />
                        <span className="text-[11px] text-[#1a1a2e] dark:text-[#e5e7eb]">{r.name}</span>
                        <span className="text-[9px] text-[#a3a3a3] font-mono">{r.code}</span>
                        {r.azCount > 1 && <span className="text-[9px] text-[#737373]">{r.azCount} zones</span>}
                        {r.status === 'announced' && <span className="text-[9px] font-bold text-[#f59e0b]">Planned</span>}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'summary-stats',    label: 'Summary' },
  { id: 'infra-table',      label: 'Infrastructure Overview' },
  { id: 'coverage-matrix',  label: 'Regional Coverage Matrix' },
  { id: 'az-detail',        label: 'Availability Zones per Region' },
  { id: 'world-map',        label: 'Global Region Map' },
  { id: 'data-sources',     label: 'Data Sources' },
];

export default function DatacentersPage() {
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({});

  const toggleProvider = (id: string) => {
    setExpandedProviders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totals = useMemo(() => ({
    regions: PROVIDER_INFRA.reduce((s, p) => s + p.regions, 0),
    azs: PROVIDER_INFRA.reduce((s, p) => s + p.availabilityZones, 0),
    announced: PROVIDER_INFRA.reduce((s, p) => s + p.announcedRegions, 0),
    edgeLocations: PROVIDER_INFRA.reduce((s, p) => s + p.edgeLocations, 0),
    countries: PROVIDER_INFRA.reduce((s, p) => s + p.countriesServed, 0),
    govCloud: PROVIDER_INFRA.reduce((s, p) => s + p.governmentRegions, 0),
  }), []);

  return (
    <div className="flex flex-col h-screen bg-[#f7f8ff] dark:bg-[#06060f] text-[#1a1a2e] dark:text-[#e5e7eb] font-sans overflow-hidden">
      <ProductTypeSelector activeProductType={'datacenters' as any} />

      <div className="flex-1 overflow-auto flex flex-col">
        <div className="flex flex-1 w-full">

          {/* Sidebar — page navigation */}
          <aside className="w-72 border-r border-[#dde0f0] dark:border-[#1e1e38] flex flex-col shrink-0 overflow-y-auto bg-[#f7f8ff] dark:bg-[#06060f] pb-10">

            {/* On this page */}
            <section className="px-4 pt-5 pb-4 border-b border-[#dde0f0] dark:border-[#1e1e38]">
              <h2 className="text-xs font-bold text-[#737373] uppercase tracking-widest mb-3">Content</h2>
              <nav className="flex flex-col gap-0.5">
                {NAV_SECTIONS.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-sm font-medium text-[#737373] hover:text-[#1a1a2e] dark:hover:text-[#f7f8ff] hover:bg-[#eef0fc] dark:hover:bg-[#0c0c1e] transition-all"
                    style={{ textDecoration: 'none' }}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </section>
          </aside>

          {/* Main */}
          <main className="flex-1 overflow-x-auto p-6 lg:p-8 pb-20">

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1 text-[#1a1a2e] dark:text-[#f7f8ff]">Cloud Infrastructure</h1>
              <p className="text-sm text-[#737373] max-w-2xl leading-relaxed mb-4">
                Compare data center presence, <Term term="Availability Zone">availability zones</Term>, and global coverage across providers.
                Click any row to expand the full <Term term="Region">region</Term> list with Availability Zone counts.
              </p>
              {/* Legend */}
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-[11px] text-[#737373]">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0" /> Available
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#737373]">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" /> Announced / Planned
                </div>
              </div>
            </div>

            {/* Main table */}
            <div id="infra-table" className="border border-[#dde0f0] dark:border-[#1e1e38] rounded overflow-x-auto scroll-mt-6">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#dde0f0] dark:border-[#1e1e38] bg-[#eef0fc] dark:bg-[#0c0c1e]">
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">Provider</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">
                      <Term term="Region">Regions</Term>
                    </th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">
                      <Term term="Availability Zone">Availability Zones</Term>
                    </th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">
                      <Term term="Edge Location">Edge Locations</Term>
                    </th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">Countries</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">
                      <Term term="Government Cloud">Gov Cloud</Term>
                    </th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest text-center">Geographic Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {PROVIDER_INFRA.map((p, i) => (
                    <ProviderRow
                      key={p.id}
                      p={p}
                      rowIndex={i}
                      isExpanded={!!expandedProviders[p.id]}
                      onToggle={() => toggleProvider(p.id)}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#dde0f0] dark:border-[#1e1e38] bg-[#f7f8ff] dark:bg-[#06060f] hover:bg-[#f7f8ff] dark:hover:bg-[#06060f]">
                    <td className="py-4 px-4 font-bold text-[#1a1a2e] dark:text-[#f7f8ff] text-center">Total</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-[15px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">{totals.regions}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-[15px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">{totals.azs}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-[15px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">{totals.edgeLocations.toLocaleString()}+</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-[15px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">{totals.countries}+</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-[15px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">{totals.govCloud}</span>
                    </td>
                    <td className="py-4 px-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Regional Coverage Matrix */}
            <div id="coverage-matrix" className="mt-8 scroll-mt-6">
              <h2 className="text-xl font-bold mb-1 text-[#1a1a2e] dark:text-[#f7f8ff]">Regional Coverage Matrix</h2>
              <p className="text-sm text-[#737373] mb-4">Number of available regions per provider per geography.</p>
              <div className="border border-[#dde0f0] dark:border-[#1e1e38] rounded overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#dde0f0] dark:border-[#1e1e38] bg-[#eef0fc] dark:bg-[#0c0c1e]">
                      <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">Provider</th>
                      {GEOGRAPHIES.map(geo => (
                        <th key={geo} className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">{geo}</th>
                      ))}
                      <th className="py-2.5 px-4 text-[10px] font-bold text-[#737373] uppercase tracking-widest whitespace-nowrap text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROVIDER_INFRA.map((p, i) => {
                      const rowBg = i % 2 === 0 ? 'bg-white dark:bg-[#06060f]' : 'bg-[#f7f8ff] dark:bg-[#0a0a18]';
                      return (
                        <tr key={p.id} className={`border-b border-[#dde0f0] dark:border-[#1e1e38] ${rowBg}`}>
                          <td className="py-3 px-4 whitespace-nowrap text-center">
                            <div className="flex justify-center">
                              <ProviderBadge id={p.id} name={p.nameShort} />
                            </div>
                          </td>
                          {GEOGRAPHIES.map(geo => {
                            const count = p.geographyCoverage[geo] ?? 0;
                            return (
                              <td key={geo} className="py-3 px-4 text-center">
                                {count > 0 && (
                                  <span className="text-[13px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">
                                    {count}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          <td className="py-3 px-4 text-center">
                            <span className="text-[13px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">{p.regions}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Availability Zones per Region — stat cards grid */}
            <div id="az-detail" className="mt-8 scroll-mt-6">
              <h2 className="text-xl font-bold mb-1 text-[#1a1a2e] dark:text-[#f7f8ff]">
                <Term term="Availability Zone">Availability Zones</Term> per <Term term="Region">Region</Term>
              </h2>
              <p className="text-sm text-[#737373] mb-4">Total and average Availability Zones per region, per provider. DigitalOcean uses single data center regions without traditional Availability Zones.</p>
              <div className="flex flex-wrap gap-px rounded overflow-hidden border border-[#dde0f0] dark:border-[#1e1e38]" style={{ background: 'var(--border-color, #dde0f0)' }}>
                {PROVIDER_INFRA.map(p => (
                  <div
                    key={p.id}
                    className="flex-1 min-w-0 bg-white dark:bg-[#0a0a18] px-4 py-3.5 flex flex-col gap-2"
                  >
                    <ProviderBadge id={p.id} name={p.nameShort} />
                    {p.availabilityZones > 0 ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[20px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums leading-none">{p.availabilityZones}</span>
                        <span className="text-[9px] font-bold text-[#737373] uppercase tracking-widest">Total Zones</span>
                        <span className="text-[9px] text-[#a3a3a3]">~{Math.round(p.availabilityZones / p.regions)} per region</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[20px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums leading-none">{p.regions}</span>
                        <span className="text-[9px] font-bold text-[#737373] uppercase tracking-widest">Data Centers</span>
                        <span className="text-[9px] text-[#a3a3a3]">Single DC / region</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* World Map */}
            <div id="world-map" className="scroll-mt-6">
              <WorldMap />
            </div>

            {/* Data sources */}
            <div id="data-sources" className="mt-10 border-t border-[#dde0f0] dark:border-[#1e1e38] pt-6 scroll-mt-6">
              <h2 className="text-xl font-bold mb-1 text-[#1a1a2e] dark:text-[#f7f8ff]">Data Sources</h2>
              <p className="text-sm text-[#737373] mb-4 max-w-2xl leading-relaxed">
                All infrastructure data is sourced from each provider's official public documentation. Figures reflect available regions at the time of last verification. Announced regions may not yet be generally available.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {PROVIDER_INFRA.map(p => (
                  <div key={p.id} className="bg-white dark:bg-[#0a0a18] border border-[#dde0f0] dark:border-[#1e1e38] rounded p-2.5 flex flex-col gap-2">
                    <ProviderBadge id={p.id} name={p.nameShort} />
                    <div className="flex flex-col gap-1">
                      {p.sources.map(src => (
                        <a
                          key={src.url}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[10px] text-[#737373] hover:text-[#1a1a2e] dark:hover:text-[#f7f8ff] transition-colors group"
                        >
                          <ExternalLink size={9} className="shrink-0 group-hover:text-[#2563eb]" />
                          {src.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-[#a3a3a3] mt-4">Last verified: June 2026 · Data may not reflect real-time changes.</p>
            </div>

          </main>
        </div>
      </div>

      <Footer />
      <DigitalOceanReferralModal />
    </div>
  );
}
