'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Footer, Sidebar, DigitalOceanReferralModal } from '@/components';
import { PROVIDER_INFRA, GEOGRAPHIES, type ProviderInfrastructure, type DatacenterRegion } from '@/config/datacenter_data';
import { DATACENTERS_SPONSOR } from '@/config';
import { ChevronDown, ExternalLink, Info, Link as LinkIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import WorldMap from './WorldMap';

// Provider brand colors — matches the badge palette used on the pricing category
// pages (PricingTable.tsx). Only the map's own filter buttons stay neutral
// black/white; every other provider indicator on this page uses these colors.
const PROVIDER_COLORS: Record<string, string> = {
  aws: '#FF9900',
  azure: '#00BCFF',
  gcp: '#34A853',
  oracle: '#F80000',
  digitalocean: '#0069FF',
  alibaba: '#FF6A00',
  cloudflare: '#F38020',
};



// ─── helpers ─────────────────────────────────────────────────────────────────

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-[20px] font-black text-[var(--text)] tabular-nums leading-none">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest leading-tight">{label}</div>
      {sub && <div className="text-[9px] text-[#a3a3a3] leading-tight">{sub}</div>}
    </div>
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
  const rowBg = rowIndex % 2 === 0 ? 'bg-[#f7f8ff] dark:bg-[#06060f]' : 'bg-[#e8eaf8] dark:bg-[#10102a]';

  return (
    <>
      <tr className={`border-b border-[var(--border)] hover:bg-[#eef2ff] dark:hover:bg-[#111827] transition-colors ${rowBg}`}>
        <td className="py-4 px-4 min-w-[180px]">
          <div className="flex items-center justify-center gap-2.5">
            <span className="w-0.5 h-8 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <div>
              <button onClick={onToggle} className="flex items-center gap-1.5 group text-left">
                <ChevronDown size={11} className={`text-[var(--muted)] transition-transform shrink-0 ${isExpanded ? '' : '-rotate-90'}`} />
                <ProviderBadge id={p.id} name={p.nameShort} />
              </button>
              <div className="text-[10px] text-[var(--muted)] mt-1 pl-4">Since {p.since}</div>
            </div>
          </div>
        </td>
        <td className="py-4 px-4 text-center">
          <span className="text-[15px] font-black text-[var(--text)] tabular-nums">{p.regions}</span>
          {p.announcedRegions > 0 && (
            <div className="text-[9px] text-[#f59e0b] font-bold mt-0.5">+{p.announcedRegions} planned</div>
          )}
        </td>
        <td className="py-4 px-4 text-center">
          {p.availabilityZones > 0 ? (
            <span className="text-[15px] font-black text-[var(--text)] tabular-nums">{p.availabilityZones}</span>
          ) : (
            <span className="text-[11px] text-[#a3a3a3]">—</span>
          )}
          {p.availabilityZones > 0 && p.regions > 0 && (
            <div className="text-[9px] text-[var(--muted)] mt-0.5">~{Math.round(p.availabilityZones / p.regions)} zones / region</div>
          )}
        </td>
        <td className="py-4 px-4 text-center">
          <span className="text-[15px] font-black text-[var(--text)] tabular-nums">{p.edgeLocations.toLocaleString()}+</span>
        </td>
        <td className="py-4 px-4 text-center">
          <span className="text-[15px] font-black text-[var(--text)] tabular-nums">{p.countriesServed}+</span>
        </td>
        <td className="py-4 px-4 text-center">
          {hasGovCloud ? (
            <>
              <span className="text-[15px] font-black text-[var(--text)] tabular-nums">{p.governmentRegions}</span>
              <div className="text-[9px] text-[var(--muted)] mt-0.5">regions</div>
            </>
          ) : (
            <span className="text-[11px] text-[#a3a3a3]">—</span>
          )}
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-[var(--surface)] border-b border-[var(--border)]">
          <td colSpan={6} className="px-4 py-5">
            <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1">
              {GEOGRAPHIES.map(geo => {
                const geoRegions = p.regionList.filter(r => r.geography === geo);
                if (geoRegions.length === 0) return null;
                return (
                  <div key={geo} className="mb-3">
                    <div className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1.5">{geo}</div>
                    {geoRegions.map(r => (
                      <div key={r.code} className="flex items-center gap-2 py-0.5">
                        <StatusDot status={r.status} />
                        <span className="text-[11px] text-[var(--text)]">{r.name}</span>
                        <span className="text-[9px] text-[#a3a3a3] font-mono">{r.code}</span>
                        {r.azCount > 1 && <span className="text-[9px] text-[var(--muted)]">{r.azCount} zones</span>}
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

// Distinct palette for geography segments in the matrix chart
const GEO_COLORS: Record<string, string> = {
  'N. America': '#3b82f6',
  'S. America': '#22c55e',
  'W. Europe': '#a855f7',
  'Asia Pacific': '#f59e0b',
  'Australia': '#ec4899',
  'Mid East & Africa': '#14b8a6',
};

function ViewToggle({ view, onChange }: { view: 'table' | 'chart'; onChange: (v: 'table' | 'chart') => void }) {
  return (
    <div className="flex bg-[var(--row-hover)] p-0.5 rounded-lg border border-[var(--border)]">
      <button
        onClick={() => onChange('table')}
        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${view === 'table' ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
      >
        📊 Table
      </button>
      <button
        onClick={() => onChange('chart')}
        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${view === 'chart' ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
      >
        📈 Chart
      </button>
    </div>
  );
}

function InfraChart() {
  const data = PROVIDER_INFRA.map(p => ({
    name: p.nameShort,
    Regions: p.regions,
    'Availability Zones': p.availabilityZones,
    color: PROVIDER_COLORS[p.id] ?? '#888',
  }));
  return (
    <div className="border border-[var(--border)] rounded bg-[var(--surface)] p-4" style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dde0f033" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#737373' }} />
          <YAxis tick={{ fontSize: 11, fill: '#737373' }} />
          <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #dde0f0' }} cursor={{ fill: '#73737318' }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="Regions" radius={[3, 3, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Bar>
          <Bar dataKey="Availability Zones" radius={[3, 3, 0, 0]} fill="#94a3b8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CoverageChart() {
  const data = PROVIDER_INFRA.map(p => {
    const row: Record<string, any> = { name: p.nameShort };
    GEOGRAPHIES.forEach(geo => { row[geo] = p.geographyCoverage[geo] ?? 0; });
    return row;
  });
  return (
    <div className="border border-[var(--border)] rounded bg-[var(--surface)] p-4" style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dde0f033" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#737373' }} />
          <YAxis tick={{ fontSize: 11, fill: '#737373' }} />
          <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #dde0f0' }} cursor={{ fill: '#73737318' }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {GEOGRAPHIES.map(geo => (
            <Bar key={geo} dataKey={geo} stackId="geo" fill={GEO_COLORS[geo] ?? '#888'} radius={[0, 0, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DatacentersPage() {
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({});
  const [infraView, setInfraView] = useState<'table' | 'chart'>('table');
  const [matrixView, setMatrixView] = useState<'table' | 'chart'>('table');

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
    <div className="dc-page flex h-screen bg-[var(--bg)] text-[var(--text)] font-sans overflow-hidden">
      <style>{`
        .dc-page {
          --bg: #ffffff;
          --surface: #ffffff;
          --border: #e5e5e5;
          --text: #171717;
          --muted: #737373;
          --divider: #e5e5e5;
          --row-hover: #fafafa;
        }
        @media (prefers-color-scheme: dark) {
          .dc-page {
            --bg: #000000;
            --surface: #000000;
            --border: #262626;
            --text: #e5e7eb;
            --muted: #a3a3a3;
            --divider: #262626;
            --row-hover: #0a0a0a;
          }
        }
      `}</style>
      <Sidebar activeProductType={'datacenters' as any} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto flex flex-col">

          {/* Main */}
          <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1600px] mx-auto">

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1 text-[var(--text)]">Cloud Infrastructure</h1>
              <p className="text-sm text-[#737373] dark:text-[#a3a3a3] leading-relaxed mb-4">
                Compare global datacenter presence, availability zones, and physical footprint across cloud providers. Comparing regulatory posture instead? Visit{' '}
                <Link href="/certifications" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold">Compliance</Link>{' '}
                to see which certifications and standards each provider holds.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* Sponsorship Box — renders DATACENTERS_SPONSOR's 1200×200 banner when set,
                otherwise falls back to the "become a sponsor" pitch. */}
            {DATACENTERS_SPONSOR ? (
              <a
                href={DATACENTERS_SPONSOR.linkUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mb-8 block rounded overflow-hidden border border-[var(--border)]"
              >
                <img
                  src={DATACENTERS_SPONSOR.imageUrl}
                  alt={`Sponsored by ${DATACENTERS_SPONSOR.companyName}`}
                  width={1200}
                  height={200}
                  className="w-full h-auto aspect-[6/1] object-cover"
                />
              </a>
            ) : (
            <div className="mb-8 border-2 border-dashed border-[var(--border)] rounded bg-[var(--row-hover)] p-6 flex flex-col items-center gap-3 text-center">
              <div>
                <h3 className="text-sm font-bold text-[var(--text)] mb-1 flex items-center justify-center gap-2">
                  Sponsor This Page
                </h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                  Sponsor this page. Your brand in front of engineers and architects comparing cloud pricing. See <Link href="/docs#advertising" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-bold">Advertising with Us in the Documentation</Link>, or email hello@comparecloudcosts.com.
                </p>
                <p className="text-[11px] text-[var(--muted)] mt-1.5 opacity-80">
                  Banner spec: 1200 × 200px (6:1 ratio) · PNG, JPG, or WebP. See the <Link href="/docs#advertising-specs" className="underline hover:text-[var(--text)]">Docs</Link> for detailed instructions.
                </p>
              </div>
            </div>
            )}

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* World Map */}
            <div id="world-map" className="mb-8 scroll-mt-6">
              <WorldMap />
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* Infrastructure Overview */}
            <div id="infra-table" className="scroll-mt-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-[var(--text)] group flex items-center gap-2">
                  Infrastructure Overview
                  <a href="#infra-table" className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[#2563eb] transition-opacity" aria-label="Link to Infrastructure Overview section">
                    <LinkIcon size={18} />
                  </a>
                </h2>
                <ViewToggle view={infraView} onChange={setInfraView} />
              </div>
              <p className="text-sm text-[var(--muted)] mb-3">
                Click any row to expand the full region list with Availability Zone counts.
              </p>
              {/* Legend */}
              <div className="flex items-center gap-5 mb-4">
                <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0" /> Available
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" /> Announced / Planned
                </div>
              </div>
              {infraView === 'chart' ? <InfraChart /> : (
              <div className="border border-[var(--border)] rounded overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest whitespace-nowrap text-center">Provider</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest whitespace-nowrap text-center">Regions</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest whitespace-nowrap text-center">Availability Zones</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest whitespace-nowrap text-center">Edge Locations</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest whitespace-nowrap text-center">Countries</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest whitespace-nowrap text-center">Gov Cloud</th>
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
                  <tr className="border-t-2 border-[var(--border)] bg-[var(--row-hover)] font-bold">
                    <td className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">Total</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[14px] font-black text-[var(--text)] tabular-nums">{totals.regions}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[14px] font-black text-[var(--text)] tabular-nums">{totals.azs}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[14px] font-black text-[var(--text)] tabular-nums">{totals.edgeLocations.toLocaleString()}+</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[14px] font-black text-[var(--text)] tabular-nums">{totals.countries}+</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[14px] font-black text-[var(--text)] tabular-nums">{totals.govCloud}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
              </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* Availability Zones per Region — stat cards grid */}
            <div id="az-detail" className="scroll-mt-6">
              <h2 className="text-xl font-bold mb-1 text-[var(--text)] group flex items-center gap-2">
                Availability Zones per Region
                <a href="#az-detail" className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[#2563eb] transition-opacity" aria-label="Link to Availability Zones section">
                  <LinkIcon size={18} />
                </a>
              </h2>
              <p className="text-sm text-[var(--muted)] mb-4">Total and average Availability Zones per region, per provider.</p>
              <div className="flex flex-wrap gap-px rounded overflow-hidden border border-[var(--border)]" style={{ background: 'var(--border)' }}>
                {PROVIDER_INFRA.map(p => (
                  <div
                    key={p.id}
                    className="flex-1 min-w-0 bg-[var(--surface)] px-4 py-3.5 flex flex-col gap-2"
                  >
                    <ProviderBadge id={p.id} name={p.nameShort} />
                    {p.availabilityZones > 0 ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[20px] font-black text-[var(--text)] tabular-nums leading-none">{p.availabilityZones}</span>
                        <span className="text-[9px] text-[#a3a3a3]">~{Math.round(p.availabilityZones / p.regions)} per region</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[20px] font-black text-[var(--text)] tabular-nums leading-none">{p.regions}</span>
                        <span className="text-[9px] text-[#a3a3a3]">Single DC / region</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* Regional Coverage Matrix */}
            <div id="coverage-matrix" className="scroll-mt-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-[var(--text)] group flex items-center gap-2">
                  Regional Coverage Matrix
                  <a href="#coverage-matrix" className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[#2563eb] transition-opacity" aria-label="Link to Regional Coverage Matrix section">
                    <LinkIcon size={18} />
                  </a>
                </h2>
                <ViewToggle view={matrixView} onChange={setMatrixView} />
              </div>
              <p className="text-sm text-[var(--muted)] mb-4">Number of available regions per provider per geography.</p>
              {matrixView === 'chart' ? <CoverageChart /> : (
              <div className="border border-[var(--border)] rounded overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                      <th className="py-2.5 px-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest whitespace-nowrap text-center">Provider</th>
                      {GEOGRAPHIES.map(geo => (
                        <th key={geo} className="py-2.5 px-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest whitespace-nowrap text-center">{geo}</th>
                      ))}
                      <th className="py-2.5 px-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest whitespace-nowrap text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROVIDER_INFRA.map((p, i) => {
                      const rowBg = i % 2 === 0 ? 'bg-[#f7f8ff] dark:bg-[#06060f]' : 'bg-[#e8eaf8] dark:bg-[#10102a]';
                      return (
                        <tr key={p.id} className={`border-b border-[var(--border)] hover:bg-[#eef2ff] dark:hover:bg-[#111827] transition-colors ${rowBg}`}>
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
                                  <span className="text-[13px] font-black text-[var(--text)] tabular-nums">
                                    {count}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          <td className="py-3 px-4 text-center">
                            <span className="text-[13px] font-black text-[var(--text)] tabular-nums">{p.regions}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[var(--border)] bg-[var(--row-hover)] font-bold">
                      <td className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">
                        Total
                      </td>
                      {GEOGRAPHIES.map(geo => {
                        const totalGeo = PROVIDER_INFRA.reduce((sum, p) => sum + (p.geographyCoverage[geo] ?? 0), 0);
                        return (
                          <td key={geo} className="py-3 px-4 text-center">
                            <span className="text-[14px] font-black text-[var(--text)] tabular-nums">
                              {totalGeo}
                            </span>
                          </td>
                        );
                      })}
                      <td className="py-3 px-4 text-center">
                        <span className="text-[14px] font-black text-[var(--text)] tabular-nums">
                          {PROVIDER_INFRA.reduce((sum, p) => sum + p.regions, 0)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* Data sources */}
            <div id="data-sources" className="scroll-mt-6">
              <h2 className="text-xl font-bold mb-1 text-[var(--text)] group flex items-center gap-2">
                Sources
                <a href="#data-sources" className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[#2563eb] transition-opacity" aria-label="Link to Sources section">
                  <LinkIcon size={18} />
                </a>
              </h2>
              <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
                All infrastructure data is sourced from each provider's official public documentation. Figures reflect available regions at the time of last verification. Announced regions may not yet be generally available.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2">
                {PROVIDER_INFRA.map(p => (
                  <div key={p.id} className="bg-[var(--surface)] border border-[var(--border)] rounded p-2 flex flex-col gap-1.5">
                    <ProviderBadge id={p.id} name={p.nameShort} />
                    <div className="flex flex-col gap-1">
                      {p.sources.map(src => (
                        <a
                          key={src.url}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[10px] text-[var(--muted)] hover:text-[var(--text)] transition-colors group"
                        >
                          <ExternalLink size={9} className="shrink-0 group-hover:text-[#2563eb]" />
                          {src.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-[#a3a3a3] mt-4">Last verified: June 2026. Updated manually — not real-time.</p>
            </div>

            {/* Disclaimer */}
            <div className="max-w-[1600px] mx-auto mt-6">
              <blockquote className="border-l-4 border-[#e5e5e5] dark:border-[#262626] pl-4 my-6 text-[12px] text-[#737373] dark:text-[#a3a3a3] italic">
                <strong>Disclaimer:</strong> Infrastructure data may be delayed, incomplete, or imprecise. The data on this platform serves as a directional indicator, and comparecloudcosts.com makes no warranties regarding accuracy. Please consult the{' '}
                <Link href="/terms" className="underline hover:text-[#171717] dark:hover:text-[#e5e7eb]">Terms of Use</Link> for more information regarding data completeness and coverage.
              </blockquote>
            </div>

          </main>
      </div>

      <Footer />
      </div>
      <DigitalOceanReferralModal />
    </div>
  );
}
