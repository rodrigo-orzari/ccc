'use client';

import React, { useState, useMemo } from 'react';
import { Footer, ProductTypeSelector, DigitalOceanReferralModal } from '@/components';
import { GEOGRAPHIES } from '@/config';
import {
  CERTIFICATIONS,
  CERT_BY_ID,
  COMPLIANCE_PROVIDERS,
  PROVIDER_CERTIFICATIONS,
  providerHasCert,
  type CertCategory,
} from '@/config/certifications';
import { ExternalLink } from 'lucide-react';

const CATEGORY_ORDER: CertCategory[] = ['Security', 'Privacy', 'Industry', 'Government / Regional'];

// Toggle a value in a Set (immutably) — used by all three filters.
function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function CertificationsPage() {
  const [selProviders, setSelProviders] = useState<Set<string>>(new Set());
  const [selGeos, setSelGeos] = useState<Set<string>>(new Set());
  const [selCerts, setSelCerts] = useState<Set<string>>(new Set());

  // A cert is visible under the current geo filter if no geos are selected, the
  // cert is Global, or its jurisdiction matches a selected geography.
  const certPassesGeo = useMemo(() => {
    return (certId: string) => {
      if (selGeos.size === 0) return true;
      const cert = CERT_BY_ID[certId];
      return cert.scope === 'Global' || selGeos.has(cert.scope);
    };
  }, [selGeos]);

  // Cross-filter: a provider is eligible only if it holds EVERY selected cert.
  // (Selecting a cert "disables" providers that lack it.) Independent of the
  // provider filter so we can grey-out disabled provider chips.
  const providerMeetsCerts = useMemo(() => {
    return (providerId: string) =>
      [...selCerts].every((certId) => providerHasCert(providerId, certId));
  }, [selCerts]);

  const visibleProviders = useMemo(() => {
    return COMPLIANCE_PROVIDERS.filter((p) => {
      if (selProviders.size > 0 && !selProviders.has(p.id)) return false;
      if (!providerMeetsCerts(p.id)) return false;
      return true;
    });
  }, [selProviders, providerMeetsCerts]);

  const certsByCategory = useMemo(() => {
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      certs: CERTIFICATIONS.filter((c) => c.category === cat),
    })).filter((g) => g.certs.length > 0);
  }, []);

  const anyFilterActive = selProviders.size > 0 || selGeos.size > 0 || selCerts.size > 0;

  return (
    <div className="cc-page flex flex-col h-screen bg-[var(--bg)] text-[var(--text)] font-sans overflow-hidden">
      <style>{`
        .cc-page {
          --bg: #ffffff;
          --surface: #ffffff;
          --border: #e5e5e5;
          --text: #171717;
          --muted: #737373;
          --divider: #e5e5e5;
          --row-hover: #fafafa;
          --chip: #f5f5f5;
        }
        @media (prefers-color-scheme: dark) {
          .cc-page {
            --bg: #000000;
            --surface: #000000;
            --border: #262626;
            --text: #e5e7eb;
            --muted: #a3a3a3;
            --divider: #262626;
            --row-hover: #0a0a0a;
            --chip: #111111;
          }
        }
      `}</style>
      <ProductTypeSelector activeProductType={'certifications' as any} />

      <div className="flex-1 overflow-auto flex flex-col">
        <main className="flex-1 min-w-0 overflow-x-auto p-4 lg:p-8 pb-20">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1 text-[var(--text)]">Certifications &amp; Regulations</h1>
            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-3xl">
              Compare the security, privacy, industry, and government compliance certifications each
              cloud provider holds. Filter by provider or region, or select certifications to see which
              providers qualify — providers that lack a selected certification are disabled.
            </p>
          </div>

          <div className="h-px bg-[var(--border)] mb-6" />

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Providers */}
            <FilterRow label="Provider">
              {COMPLIANCE_PROVIDERS.map((p) => {
                const disabled = !providerMeetsCerts(p.id);
                const active = selProviders.has(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => !disabled && setSelProviders((s) => toggle(s, p.id))}
                    disabled={disabled}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${
                      disabled
                        ? 'opacity-30 cursor-not-allowed border-[var(--border)]'
                        : active
                        ? 'border-transparent text-white'
                        : 'border-[var(--border)] text-[var(--text)] hover:bg-[var(--row-hover)]'
                    }`}
                    style={active && !disabled ? { backgroundColor: p.color } : undefined}
                    title={disabled ? `${p.name} lacks a selected certification` : undefined}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </button>
                );
              })}
            </FilterRow>

            {/* Geographies */}
            <FilterRow label="Region">
              {GEOGRAPHIES.map((g) => {
                const active = selGeos.has(g);
                return (
                  <button
                    key={g}
                    onClick={() => setSelGeos((s) => toggle(s, g))}
                    className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${
                      active
                        ? 'border-[#2563eb] bg-[#2563eb] text-white'
                        : 'border-[var(--border)] text-[var(--text)] hover:bg-[var(--row-hover)]'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </FilterRow>

            {/* Certifications (cross-filter) */}
            <FilterRow label="Certification">
              <div className="flex flex-col gap-2">
                {certsByCategory.map((group) => (
                  <div key={group.category} className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted)] w-full sm:w-auto sm:mr-1">
                      {group.category}
                    </span>
                    {group.certs.map((c) => {
                      const active = selCerts.has(c.id);
                      return (
                        <button
                          key={c.id}
                          onClick={() => setSelCerts((s) => toggle(s, c.id))}
                          className={`px-2 py-0.5 rounded border text-[11px] font-medium transition-all ${
                            active
                              ? 'border-[#7c3aed] bg-[#7c3aed] text-white'
                              : 'border-[var(--border)] text-[var(--text)] hover:bg-[var(--row-hover)]'
                          }`}
                          title={c.description}
                        >
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </FilterRow>

            {anyFilterActive && (
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[var(--muted)]">
                  Showing {visibleProviders.length} of {COMPLIANCE_PROVIDERS.length} providers
                </span>
                <button
                  onClick={() => { setSelProviders(new Set()); setSelGeos(new Set()); setSelCerts(new Set()); }}
                  className="text-[11px] font-medium text-[#2563eb] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Provider tiles */}
          {visibleProviders.length === 0 ? (
            <div className="border border-dashed border-[var(--border)] rounded p-10 text-center text-sm text-[var(--muted)]">
              No provider holds every selected certification. Try removing a certification filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {visibleProviders.map((p) => {
                const held = (PROVIDER_CERTIFICATIONS[p.id] ?? [])
                  .map((id) => CERT_BY_ID[id])
                  .filter((c) => c && certPassesGeo(c.id))
                  .sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));
                const totalHeld = (PROVIDER_CERTIFICATIONS[p.id] ?? []).length;
                return (
                  <div key={p.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                        <span className="font-bold text-[var(--text)]">{p.name}</span>
                      </div>
                      <span className="text-[10px] font-medium text-[var(--muted)]">
                        {held.length}{selGeos.size > 0 ? ` of ${totalHeld}` : ''} certifications
                      </span>
                    </div>

                    {held.length === 0 ? (
                      <p className="text-[11px] text-[var(--muted)]">No certifications match the selected region.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {held.map((c) => {
                          const selected = selCerts.has(c.id);
                          return (
                            <a
                              key={c.id}
                              href={c.definitionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={c.description}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                                selected
                                  ? 'border-[#7c3aed] text-[#7c3aed] bg-[#7c3aed]/10'
                                  : 'border-[var(--border)] bg-[var(--chip)] text-[var(--text)] hover:border-[#2563eb] hover:text-[#2563eb]'
                              }`}
                            >
                              {c.name}
                              <ExternalLink size={9} className="opacity-50" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Data sources */}
          <div id="data-sources" className="mt-12 border-t border-[var(--border)] pt-6 scroll-mt-6">
            <h2 className="text-xl font-bold mb-1 text-[var(--text)]">Data Sources</h2>
            <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed max-w-3xl">
              Certification status is compiled from each provider&apos;s official compliance
              documentation (linked below). Standard names link to a definition of the standard.
              This information is provided for general comparison only, may not reflect real-time
              changes, and is not legal or compliance advice — verify directly with the provider
              before relying on it.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {COMPLIANCE_PROVIDERS.map((p) => (
                <div key={p.id} className="bg-[var(--surface)] border border-[var(--border)] rounded p-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="text-[11px] font-bold text-[var(--text)]">{p.name}</span>
                  </div>
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

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] pt-1.5 w-24 shrink-0">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}
