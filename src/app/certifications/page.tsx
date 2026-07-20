'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Footer, Sidebar, DigitalOceanReferralModal } from '@/components';
import { GEOGRAPHIES, CERTIFICATIONS_SPONSOR } from '@/config';
import {
  CERTIFICATIONS,
  COMPLIANCE_PROVIDERS,
  PROVIDER_CERTIFICATIONS,
  type CertCategory,
} from '@/config/certifications';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';

const CATEGORY_ORDER: CertCategory[] = ['Security', 'Privacy', 'Industry', 'Government'];

// Accent color per certification category — used on the tile badge and the
// category filter buttons so the two read as the same grouping.
const CATEGORY_COLOR: Record<CertCategory, string> = {
  Security: '#2563eb',
  Privacy: '#7c3aed',
  Industry: '#059669',
  'Government': '#dc2626',
};

// Which providers hold a given certification (precomputed once).
const PROVIDERS_FOR_CERT: Record<string, Set<string>> = Object.fromEntries(
  CERTIFICATIONS.map((c) => [
    c.id,
    new Set(COMPLIANCE_PROVIDERS.filter((p) => (PROVIDER_CERTIFICATIONS[p.id] ?? []).includes(c.id)).map((p) => p.id)),
  ]),
);



export default function CertificationsPage() {
  const [selProviders, setSelProviders] = useState<Set<string>>(new Set(COMPLIANCE_PROVIDERS.map(p => p.id)));
  const [selGeos, setSelGeos] = useState<Set<string>>(new Set(GEOGRAPHIES));
  const [selCategories, setSelCategories] = useState<Set<string>>(new Set(CATEGORY_ORDER));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleProvider = (id: string) => {
    setSelProviders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isolateProvider = (id: string) => {
    setSelProviders(new Set([id]));
  };

  const toggleGeo = (geo: string) => {
    setSelGeos((prev) => {
      const next = new Set(prev);
      if (next.has(geo)) next.delete(geo);
      else next.add(geo);
      return next;
    });
  };

  const isolateGeo = (geo: string) => {
    setSelGeos(new Set([geo]));
  };

  const toggleCategory = (cat: string) => {
    setSelCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const isolateCategory = (cat: string) => {
    setSelCategories(new Set([cat]));
  };

  const visibleCerts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CERTIFICATIONS.filter((c) => {
      if (!selCategories.has(c.category)) return false;
      const geoMatches = c.scope === 'Global' || selGeos.has(c.scope);
      if (!geoMatches) return false;
      const held = PROVIDERS_FOR_CERT[c.id];
      if (![...selProviders].some((p) => held.has(p))) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));
  }, [selProviders, selGeos, selCategories, searchQuery]);

  const anyFilterActive =
    selProviders.size < COMPLIANCE_PROVIDERS.length ||
    selGeos.size < GEOGRAPHIES.length ||
    selCategories.size < CATEGORY_ORDER.length ||
    searchQuery.trim().length > 0;

  const clearAll = () => {
    setSelProviders(new Set(COMPLIANCE_PROVIDERS.map(p => p.id)));
    setSelGeos(new Set(GEOGRAPHIES));
    setSelCategories(new Set(CATEGORY_ORDER));
    setSearchQuery('');
  };

  return (
    <div className="cc-page flex h-screen bg-[var(--bg)] text-[var(--text)] font-sans overflow-hidden">
      <style>{`
        .cc-page {
          --bg: #ffffff;
          --surface: #ffffff;
          --border: #e5e5e5;
          --text: #171717;
          --muted: #737373;
          --row-hover: #fafafa;
        }
        @media (prefers-color-scheme: dark) {
          .cc-page {
            --bg: #000000;
            --surface: #000000;
            --border: #262626;
            --text: #e5e7eb;
            --muted: #a3a3a3;
            --row-hover: #0a0a0a;
          }
        }
      `}</style>
      <Sidebar activeProductType={'certifications' as any} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto flex flex-col">
        <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1600px] mx-auto">

          {/* Header — workloads-style intro paragraph */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[var(--text)]">Certifications &amp; Regulations</h1>
            <p className="text-[#737373] dark:text-[#a3a3a3] text-sm leading-relaxed">
              Compare <strong>security, privacy, and compliance standards</strong> across cloud providers, databases, and AI vendors. 
              Use the filters to align configurations, verify regulatory certifications, and access official trust centers. Curious where these providers actually run? Explore{' '}
              <Link href="/datacenters" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold">Datacenters</Link>{' '}
              for each cloud's global region and infrastructure footprint.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--border)] mb-8" />

          {/* Sponsorship Box — renders CERTIFICATIONS_SPONSOR's 1200×200 banner when set,
              otherwise falls back to the "become a sponsor" pitch. */}
          {CERTIFICATIONS_SPONSOR ? (
            <a
              href={CERTIFICATIONS_SPONSOR.linkUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mb-8 block rounded overflow-hidden border border-[var(--border)]"
            >
              <img
                src={CERTIFICATIONS_SPONSOR.imageUrl}
                alt={`Sponsored by ${CERTIFICATIONS_SPONSOR.companyName}`}
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

          {/* Summary — certifications held per provider (respects active filters),
              connected-card grid mirroring the provider summary on other pages. */}
          <div id="tracked-certifications" className="mb-2 scroll-mt-6">
            <h2 className="text-xl font-bold mb-1 text-[var(--text)] group flex items-center gap-2">
              Tracked certifications by provider
              <a href="#tracked-certifications" className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[#2563eb] transition-opacity" aria-label="Link to this section">
                <LinkIcon size={18} />
              </a>
            </h2>
            <span className="text-[10px] text-[var(--muted)]">
              {`Counts reflect the ${CERTIFICATIONS.length} standards tracked here — not each provider's full catalog. See the trust centers below for the complete list.`}
            </span>
          </div>
          <div
            className="grid gap-px rounded-lg overflow-x-auto border border-[var(--border)] bg-[var(--border)] mb-8 scrollbar-thin"
            style={{ gridAutoFlow: 'column', gridAutoColumns: 'minmax(90px, 1fr)' }}
          >
            {COMPLIANCE_PROVIDERS.map((p) => {
              const count = visibleCerts.filter((c) => PROVIDERS_FOR_CERT[c.id].has(p.id)).length;
              return (
                <div key={p.id} className="px-2.5 py-2.5 bg-[var(--surface)]">
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-1 truncate" style={{ color: p.color }}>
                    {p.name}
                  </div>
                  <div className="text-xl font-black leading-none text-[var(--text)] tabular-nums">{count}</div>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--border)] mb-8" />

          {/* Filters — datacenter-map-style button rows in a bordered box */}
          <p className="text-sm text-[var(--muted)] mb-4">Click to toggle providers, region, or certification categories. Double-click to isolate one.</p>

          <div className="border border-[var(--border)] rounded bg-[var(--surface)] mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
              {/* Provider */}
              <div className="px-5 py-4 flex items-start gap-2">
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mr-1 w-20 shrink-0 mt-1.5">Provider</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {COMPLIANCE_PROVIDERS.map((p) => {
                    const active = selProviders.has(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleProvider(p.id)}
                        onDoubleClick={() => isolateProvider(p.id)}
                        title={`Click to toggle · Double-click to show only ${p.name}`}
                        className={`px-2 py-1 shrink-0 rounded text-[9px] font-bold border transition-all ${
                          active
                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm'
                            : 'bg-[var(--row-hover)] text-[var(--muted)] border-[var(--border)] opacity-60 hover:opacity-90'
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Region */}
              <div className="px-5 py-4 flex items-start gap-2">
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mr-1 w-20 shrink-0 mt-1.5">Region</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {GEOGRAPHIES.map((geo) => {
                    const active = selGeos.has(geo);
                    return (
                      <button
                        key={geo}
                        onClick={() => toggleGeo(geo)}
                        onDoubleClick={() => isolateGeo(geo)}
                        title={`Click to toggle · Double-click to show only ${geo}`}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                          active
                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm'
                            : 'bg-[var(--row-hover)] text-[var(--muted)] border-[var(--border)] opacity-60 hover:opacity-90'
                        }`}
                      >
                        {geo}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category */}
              <div className="px-5 py-4 flex items-start gap-2">
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mr-1 w-28 shrink-0 mt-1.5 leading-snug">Certifications &amp; Regulations<br/>Category</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {CATEGORY_ORDER.map((cat) => {
                    const active = selCategories.has(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        onDoubleClick={() => isolateCategory(cat)}
                        title={`Click to toggle · Double-click to show only ${cat}`}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-all ${
                          active
                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm'
                            : 'bg-[var(--row-hover)] text-[var(--muted)] border-[var(--border)] opacity-60 hover:opacity-90'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--border)] mb-8" />

          {/* Search + count + clear */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-3 w-3 text-[var(--muted)]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search certifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--row-hover)] border border-[var(--border)] text-[var(--text)] text-[11px] rounded pl-8 pr-3 py-1.5 focus:border-[var(--text)] placeholder-[var(--muted)] outline-none transition-colors"
              />
            </div>
            <span className="text-[11px] text-[var(--muted)]">
              {`Showing ${visibleCerts.length} of ${CERTIFICATIONS.length} tracked standards`}
            </span>
            {anyFilterActive && (
              <button onClick={clearAll} className="text-[11px] font-medium text-[#2563eb] hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {/* Certification tiles */}
          {visibleCerts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[var(--border)] rounded">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">No certifications match</h3>
              <p className="text-[var(--muted)] mt-1 text-[11px]">Try removing a filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {visibleCerts.map((c, index) => {
                const held = PROVIDERS_FOR_CERT[c.id];
                const color = CATEGORY_COLOR[c.category];
                return (
                  <div
                    key={c.id}
                    className={`border border-[var(--border)] rounded p-4 flex flex-col hover:border-[var(--text)] transition-colors ${
                      index % 2 === 0 ? 'bg-[#f7f8ff] dark:bg-[#06060f]' : 'bg-[#e8eaf8] dark:bg-[#10102a]'
                    }`}
                  >
                    {/* badges */}
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${color}1a`, color }}
                      >
                        {c.category}
                      </span>
                      <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)]">
                        {c.scope}
                      </span>
                    </div>

                    <h3 className="text-[15px] font-bold mb-1 text-[var(--text)]">{c.name}</h3>
                    <p className="text-[var(--muted)] text-[11px] mb-3 flex-1 leading-relaxed">{c.description}</p>

                    {/* provider badges showing who has it */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {COMPLIANCE_PROVIDERS.filter((p) => held.has(p.id)).map((p) => (
                        <span
                          key={p.id}
                          className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0"
                          style={{
                            color: p.color,
                            borderColor: `${p.color}40`,
                            backgroundColor: `${p.color}12`,
                          }}
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>

                    {/* definition link */}
                    <a
                      href={c.definitionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-2 border-t border-[var(--border)] text-[9px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[#2563eb] transition-colors flex justify-between items-center"
                    >
                      Learn more <ExternalLink size={11} />
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* Data sources */}
          <div id="data-sources" className="mt-12 scroll-mt-6">
            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />
            <h2 className="text-xl font-bold mb-1 text-[var(--text)] group flex items-center gap-2">
              Sources
              <a href="#data-sources" className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[#2563eb] transition-opacity" aria-label="Link to Sources section">
                <LinkIcon size={18} />
              </a>
            </h2>
            <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
              The links below are each provider&apos;s official compliance hub / trust center — the complete,
              authoritative list of certifications, which for the largest clouds runs to 100+ (AWS alone
              advertises 140+). We track a curated, comparable subset above; standard names link to a
              definition of each. This information may not reflect real-time changes and is not legal or
              compliance advice — verify directly with the provider before relying on it.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {COMPLIANCE_PROVIDERS.map((p) => (
                <div key={p.id} className="bg-[var(--surface)] border border-[var(--border)] rounded p-2 flex flex-col gap-1.5">
                  <span
                    className="w-fit self-start px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border"
                    style={{ color: p.color, borderColor: p.color + '50', backgroundColor: p.color + '18' }}
                  >
                    {p.name}
                  </span>
                  <a
                    href={p.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] text-[var(--muted)] hover:text-[var(--text)] transition-colors group"
                  >
                    <ExternalLink size={9} className="shrink-0 group-hover:text-[#2563eb]" />
                    {p.sourceLabel}
                  </a>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-[#a3a3a3] mt-4">
              Last verified: July 2026. Re-verified roughly every six months.
            </p>
          </div>

        </main>

        {/* Divider */}
        <div className="w-full max-w-[1600px] mx-auto px-8 lg:px-10 mb-8">
          <div className="h-px bg-[var(--border)]" />
        </div>

        {/* Disclaimer */}
        <div className="w-full max-w-[1600px] mx-auto px-8 lg:px-10 pb-8">
          <blockquote className="border-l-4 border-[#e5e5e5] dark:border-[#262626] pl-4 my-6 text-[12px] text-[#737373] dark:text-[#a3a3a3] italic">
            <strong>Disclaimer:</strong>{' '}
            This compliance standards matrix is curated for comparison purposes. Mappings reflect each provider&apos;s publicly documented status at the last verification date. It does not constitute legal or compliance advice. Always consult the provider&apos;s official trust center and legal agreements for authoritative compliance audits and reports. Please consult the <Link href="/terms" className="underline hover:text-[#171717] dark:hover:text-[#e5e7eb]">Terms of Use</Link> for more information regarding data completeness.
          </blockquote>
        </div>
      </div>

      <Footer />
      </div>
      <DigitalOceanReferralModal />
    </div>
  );
}
