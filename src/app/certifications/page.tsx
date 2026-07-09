'use client';

import React, { useState, useMemo } from 'react';
import { Footer, ProductTypeSelector, DigitalOceanReferralModal } from '@/components';
import { GEOGRAPHIES, CERTIFICATIONS_SPONSOR } from '@/config';
import {
  CERTIFICATIONS,
  COMPLIANCE_PROVIDERS,
  PROVIDER_CERTIFICATIONS,
  type CertCategory,
} from '@/config/certifications';
import { ExternalLink } from 'lucide-react';

const CATEGORY_ORDER: CertCategory[] = ['Security', 'Privacy', 'Industry', 'Government / Regional'];

// Accent color per certification category — used on the tile badge and the
// category filter buttons so the two read as the same grouping.
const CATEGORY_COLOR: Record<CertCategory, string> = {
  Security: '#2563eb',
  Privacy: '#7c3aed',
  Industry: '#059669',
  'Government / Regional': '#dc2626',
};

// Which providers hold a given certification (precomputed once).
const PROVIDERS_FOR_CERT: Record<string, Set<string>> = Object.fromEntries(
  CERTIFICATIONS.map((c) => [
    c.id,
    new Set(COMPLIANCE_PROVIDERS.filter((p) => (PROVIDER_CERTIFICATIONS[p.id] ?? []).includes(c.id)).map((p) => p.id)),
  ]),
);

function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function CertificationsPage() {
  const [selProviders, setSelProviders] = useState<Set<string>>(new Set());
  const [selGeos, setSelGeos] = useState<Set<string>>(new Set());
  const [selCategories, setSelCategories] = useState<Set<string>>(new Set());

  const visibleCerts = useMemo(() => {
    return CERTIFICATIONS.filter((c) => {
      if (selCategories.size > 0 && !selCategories.has(c.category)) return false;
      if (selGeos.size > 0 && c.scope !== 'Global' && !selGeos.has(c.scope)) return false;
      if (selProviders.size > 0) {
        const held = PROVIDERS_FOR_CERT[c.id];
        if (![...selProviders].some((p) => held.has(p))) return false;
      }
      return true;
    }).sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));
  }, [selProviders, selGeos, selCategories]);

  const anyFilterActive = selProviders.size > 0 || selGeos.size > 0 || selCategories.size > 0;

  const clearAll = () => { setSelProviders(new Set()); setSelGeos(new Set()); setSelCategories(new Set()); };

  return (
    <div className="cc-page flex flex-col h-screen bg-[var(--bg)] text-[var(--text)] font-sans overflow-hidden">
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
      <ProductTypeSelector activeProductType={'certifications' as any} />

      <div className="flex-1 overflow-auto flex flex-col">
        <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1600px] mx-auto">

          {/* Header — workloads-style intro paragraph */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[var(--text)]">Certifications &amp; Regulations</h1>
            <p className="text-[var(--muted)] max-w-4xl text-sm leading-relaxed">
              Compliance is a comparison axis of its own — the cheapest provider is no use if it can&apos;t
              meet your regulatory bar. Each tile below is a security, privacy, industry, or government
              standard, with a short definition, the providers that currently hold it, and a link to learn
              more. Filter by <strong>provider</strong> to see the standards a cloud carries, by{' '}
              <strong>region</strong> to focus on a jurisdiction, or by <strong>category</strong> to narrow
              the type of standard. Certification status is compiled from each provider&apos;s official
              documentation — see the sources at the bottom. This is for general comparison only, not legal
              advice.
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
              <span className="text-2xl">🤝</span>
              <div>
                <h3 className="text-sm font-bold text-[var(--text)] mb-1">
                  Sponsor This Page
                </h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                  Have your company featured as a sponsor of our Certifications &amp; Regulations comparison. Reach engineers, architects, and security teams evaluating cloud compliance posture.
                </p>
                <p className="text-[12px] font-bold text-[var(--text)] mt-2">
                  📧 <a href="mailto:hello@comparecloudcosts.com" className="text-[#2563eb] hover:underline">hello@comparecloudcosts.com</a>
                </p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-[var(--border)] mb-8" />

          {/* Filters — datacenter-map-style button rows in a bordered box */}
          <div className="border border-[var(--border)] rounded bg-[var(--surface)] mb-8 divide-y divide-[var(--border)]">
            {/* Provider */}
            <div className="px-5 py-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mr-1 w-20 shrink-0">Provider</span>
              {COMPLIANCE_PROVIDERS.map((p) => {
                const active = selProviders.has(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelProviders((s) => toggle(s, p.id))}
                    title={`Toggle ${p.name}`}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-all ${
                      active
                        ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                        : 'bg-[var(--row-hover)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--muted)]'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>

            {/* Region */}
            <div className="px-5 py-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mr-1 w-20 shrink-0">Region</span>
              {GEOGRAPHIES.map((geo) => {
                const active = selGeos.has(geo);
                return (
                  <button
                    key={geo}
                    onClick={() => setSelGeos((s) => toggle(s, geo))}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                      active
                        ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                        : 'bg-[var(--row-hover)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--muted)]'
                    }`}
                  >
                    {geo}
                  </button>
                );
              })}
            </div>

            {/* Category */}
            <div className="px-5 py-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mr-1 w-20 shrink-0">Category</span>
              {CATEGORY_ORDER.map((cat) => {
                const active = selCategories.has(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setSelCategories((s) => toggle(s, cat))}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-all ${
                      active
                        ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                        : 'bg-[var(--row-hover)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--muted)]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary — certifications held per provider (respects active filters),
              connected-card grid mirroring the provider summary on other pages. */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-2">
            Certifications by provider
          </span>
          <div
            className="grid gap-px rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--border)] mb-6"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}
          >
            {COMPLIANCE_PROVIDERS.map((p) => {
              const count = visibleCerts.filter((c) => PROVIDERS_FOR_CERT[c.id].has(p.id)).length;
              return (
                <div key={p.id} className="px-4 py-3 bg-[var(--surface)]">
                  <div className="text-[11px] font-bold uppercase tracking-widest mb-1 truncate" style={{ color: p.color }}>
                    {p.name}
                  </div>
                  <div className="text-2xl font-black leading-none text-[var(--text)] tabular-nums">{count}</div>
                </div>
              );
            })}
          </div>

          {/* Count + clear */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] text-[var(--muted)]">
              Showing {visibleCerts.length} of {CERTIFICATIONS.length} certifications
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
              {visibleCerts.map((c) => {
                const held = PROVIDERS_FOR_CERT[c.id];
                const color = CATEGORY_COLOR[c.category];
                return (
                  <div
                    key={c.id}
                    className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex flex-col hover:border-[var(--text)] transition-colors"
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

                    {/* provider dots — held solid, not held faded */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted)] mr-0.5">
                        {held.size}/{COMPLIANCE_PROVIDERS.length}
                      </span>
                      {COMPLIANCE_PROVIDERS.map((p) => {
                        const has = held.has(p.id);
                        return (
                          <span
                            key={p.id}
                            title={`${p.name}${has ? '' : ' — not listed'}`}
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: has ? p.color : 'transparent',
                              border: has ? 'none' : `1px solid var(--border)`,
                              opacity: has ? 1 : 0.5,
                            }}
                          />
                        );
                      })}
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
          <div id="data-sources" className="mt-12 border-t border-[var(--border)] pt-6 scroll-mt-6">
            <h2 className="text-xl font-bold mb-1 text-[var(--text)]">Data Sources</h2>
            <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed max-w-3xl">
              Certification status is compiled from each provider&apos;s official compliance documentation
              (linked below). Standard names link to a definition of the standard. This information may not
              reflect real-time changes and is not legal or compliance advice — verify directly with the
              provider before relying on it.
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
              Last verified: July 2026 · Re-verified against provider documentation roughly every 6 months.
            </p>
          </div>

        </main>
      </div>

      <Footer />
      <DigitalOceanReferralModal />
    </div>
  );
}
