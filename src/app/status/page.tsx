'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Footer, ProductTypeSelector } from '@/components';

interface PipelineStatus {
  category: string;
  display_name: string;
  record_count: number;
  api_count: number;
  static_count: number;
  last_updated: string | null;
  data_source: 'api' | 'static' | 'mixed' | 'none';
}

interface ProviderStatus {
  name: string;
  slug: string;
  total_records: number;
  last_updated: string | null;
  pipelines: PipelineStatus[];
}

interface StatusData {
  generated_at: string;
  last_ingested: string | null;
  total_records: number;
  total_api_records: number;
  total_static_records: number;
  providers: ProviderStatus[];
}

const PROVIDER_COLORS: Record<string, string> = {
  aws: '#FF9900',
  azure: '#0078D4',
  gcp: '#4285F4',
  oracle: '#C74634',
  digitalocean: '#0080FF',
  alibaba: '#FF6A00',
  openai: '#10A37F',
  anthropic: '#CC9D87',
};

const PROVIDER_URLS: Record<string, string> = {
  aws: 'https://aws.amazon.com',
  azure: 'https://azure.microsoft.com',
  gcp: 'https://cloud.google.com',
  oracle: 'https://www.oracle.com/cloud/',
  digitalocean: 'https://www.digitalocean.com',
  alibaba: 'https://www.alibabacloud.com',
  openai: 'https://openai.com/api/pricing/',
  anthropic: 'https://www.anthropic.com/pricing',
};

const SITE_URL = 'https://comparecloudcosts.com';
const SHARE_TEXT = 'Check this out, comparecloudcosts.com is a tool that helps you compare prices of services across AWS, Microsoft, Google, Oracle, DigitalOcean, and Alibaba. #FinOps #CCC';

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const PIPELINE_ORDER = ['compute', 'database', 'serverless', 'containers', 'networking', 'data_warehouse', 'ai', 'storage'];



function SourceBadge({ source, apiCount, staticCount }: { source: string; apiCount: number; staticCount: number }) {
  if (source === 'none') return <span style={{ color: 'var(--muted)' }}>—</span>;

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 7px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid',
  };

  if (source === 'api') return (
    <span style={{ ...badgeStyle, color: '#16a34a', borderColor: '#16a34a40', backgroundColor: '#16a34a18' }}>
      API
    </span>
  );
  if (source === 'static') return (
    <span style={{ ...badgeStyle, color: '#d97706', borderColor: '#d9770640', backgroundColor: '#d9770618' }}>
      Static
    </span>
  );
  // mixed
  return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      <span style={{ ...badgeStyle, color: '#16a34a', borderColor: '#16a34a40', backgroundColor: '#16a34a18' }}>
        API
      </span>
      <span style={{ ...badgeStyle, color: '#d97706', borderColor: '#d9770640', backgroundColor: '#d9770618' }}>
        Static
      </span>
    </span>
  );
}

const BackToTop = () => (
  <p style={{ marginTop: '1.5rem' }}>
    <a
      href="#top"
      style={{ color: '#2563eb', fontSize: '0.875rem', textDecoration: 'none' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}
    >
      ↑ Go back to the top
    </a>
  </p>
);

export default function StatusPage() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/status')
      .then(r => r.json())
      .then(d => { setStatus(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);


  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const shareOnX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <>
      <style>{`
        :root {
          --bg: #ffffff;
          --surface: #ffffff;
          --border: #e5e5e5;
          --text: #171717;
          --muted: #737373;
          --link: #2563eb;
          --divider: #e5e5e5;
          --row-hover: #fafafa;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #000000;
            --surface: #000000;
            --border: #262626;
            --text: #e5e7eb;
            --muted: #a3a3a3;
            --link: #818cf8;
            --divider: #262626;
            --row-hover: #0a0a0a;
          }
        }
        .status-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }
        .status-header {
          border-bottom: 1px solid var(--border);
          padding: 2rem 2.5rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .status-body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 2.5rem 5rem;
        }
        .status-wrapper > footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 2.5rem;
        }
        .summary-card {
          background: var(--surface);
          padding: 1.25rem 1.5rem;
        }
        .summary-card-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          color: var(--muted);
          margin-bottom: 0.4rem;
        }
        .summary-card-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
        }
        .summary-card-sub {
          font-size: 11px;
          color: var(--muted);
          margin-top: 0.3rem;
        }
        .provider-card {
          border: 1px solid var(--border);
          border-radius: 8px;
          margin-bottom: 1rem;
          overflow: hidden;
        }
        .provider-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
        }
        .provider-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .provider-badge {
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border: 1px solid;
        }
        .provider-header-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          font-size: 12px;
          color: var(--muted);
        }
        .pipeline-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
          table-layout: fixed;
        }
        .pipeline-table th {
          text-align: center;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--muted);
          padding: 0.6rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
        }
        .pipeline-table th:first-child { text-align: left; }
        .pipeline-table td {
          padding: 0.65rem 1.5rem;
          border-bottom: 1px solid var(--divider);
          vertical-align: middle;
          text-align: center;
        }
        .pipeline-table td:first-child { text-align: left; }
        .pipeline-table tr:last-child td {
          border-bottom: none;
        }
        .pipeline-table tr:hover td {
          background: var(--row-hover);
        }
        @media (max-width: 640px) {
          .status-header, .status-body { padding: 1.25rem 1rem; }
          .pipeline-table th, .pipeline-table td { padding: 0.55rem 1rem; }
          .provider-header { padding: 0.875rem 1rem; }
          .summary-card { padding: 1rem; }
        }
      `}</style>

      <div className="status-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <ProductTypeSelector activeProductType={"status" as any} />
      {/* Fixed Global Nav Removed */}

      <div className="status-page" style={{ flex: 1, display: 'flex' }}>
        
        {/* Fixed Sidebar TOC */}
        <aside className="fixed top-[44px] left-0 w-[280px] h-[calc(100vh-44px)] overflow-y-auto border-r border-[#dde0f0] dark:border-[#1e1e38] p-8 hidden md:block bg-[#f7f8ff] dark:bg-[#06060f] z-40">
          <h4 className="text-[11px] text-[#6b7280] dark:text-[#71717a] uppercase tracking-wider mb-4 font-bold">Content</h4>
          <nav>
            <ul className="space-y-3">
              {status?.providers.map(p => (
                <li key={p.slug}>
                  <a href={`#${p.slug}`} className="text-[13px] font-medium transition-colors hover:text-[#2563eb] dark:hover:text-[#818cf8]" style={{ color: 'var(--text)' }}>
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="md:ml-[280px]">

        <div className="status-header border-b border-[#e5e5e5] dark:border-[#262626] pb-6 mb-6" id="top">
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-[#171717] dark:text-[#e5e7eb]">
              Last Price Update
            </h1>
          </div>
          <p className="text-sm text-[#737373] m-0">
            Learn when we last gathered pricing information per cloud provider and product category.
            {status?.last_ingested && (
              <> Last ingestion: {new Date(status.last_ingested).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}.</>
            )}
          </p>
        </div>

        <div className="status-body">
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', fontSize: 13 }}>
              Loading status…
            </div>
          )}

          {error && (
            <div style={{ padding: '1.5rem', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', fontSize: 13 }}>
              Failed to load status: {error}
            </div>
          )}

          {status && !loading && (
            <>
              {/* Summary cards */}
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="summary-card-label">Total Records</div>
                  <div className="summary-card-value">{status.total_records.toLocaleString()}</div>
                  <div className="summary-card-sub">across all providers &amp; categories</div>
                </div>
                <div className="summary-card">
                  <div className="summary-card-label">Live API Records</div>
                  <div className="summary-card-value" style={{ color: '#16a34a' }}>
                    {status.total_api_records.toLocaleString()}
                  </div>
                  <div className="summary-card-sub">
                    {status.total_records > 0
                      ? `${Math.round((status.total_api_records / status.total_records) * 100)}% of total`
                      : '—'}
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-card-label">Static Config Records</div>
                  <div className="summary-card-value" style={{ color: '#d97706' }}>
                    {status.total_static_records.toLocaleString()}
                  </div>
                  <div className="summary-card-sub">
                    {status.total_records > 0
                      ? `${Math.round((status.total_static_records / status.total_records) * 100)}% of total`
                      : '—'}
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-card-label">Providers</div>
                  <div className="summary-card-value">
                    {status.providers.filter(p => p.total_records > 0).length}
                    <span style={{ fontSize: '1rem', color: 'var(--muted)', fontWeight: 400 }}>
                      /{status.providers.length}
                    </span>
                  </div>
                  <div className="summary-card-sub">with data</div>
                </div>
                <div className="summary-card">
                  <div className="summary-card-label">Last Ingested</div>
                  <div className="summary-card-value" style={{ fontSize: '1.1rem' }}>
                    {status.last_ingested
                      ? new Date(status.last_ingested).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '—'}
                  </div>
                  <div className="summary-card-sub">most recent run</div>
                </div>
              </div>

              {/* Data source legend */}
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--surface)',
                  padding: '1rem 1.25rem',
                  marginBottom: '2.5rem',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '0.75rem' }}>
                  What the data sources mean
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: 12.5, color: 'var(--text)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ flexShrink: 0 }}><SourceBadge source="api" apiCount={0} staticCount={0} /></span>
                    <span>Pricing fetched <strong>live from the provider's pricing API</strong> during the most recent ingestion run. Most current and authoritative.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ flexShrink: 0 }}><SourceBadge source="static" apiCount={0} staticCount={0} /></span>
                    <span>Pricing from a <strong>curated fallback we maintain by hand</strong>, used when a provider has no usable live API or a live fetch fails. Accurate as of the last update but not auto-refreshed.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ flexShrink: 0 }}><SourceBadge source="mixed" apiCount={0} staticCount={0} /></span>
                    <span>The category contains <strong>both</strong> live-API and static-config records.</span>
                  </div>
                </div>
              </div>

              {/* Provider cards */}
              {status.providers.map(provider => {
                const color = PROVIDER_COLORS[provider.slug] ?? '#888';
                // Sort pipelines by canonical order
                const pipelines = [...provider.pipelines].sort(
                  (a, b) => PIPELINE_ORDER.indexOf(a.category) - PIPELINE_ORDER.indexOf(b.category)
                );

                return (
                  <React.Fragment key={provider.slug}>
                  <div id={provider.slug} className="provider-card" style={{ scrollMarginTop: '64px' }}>
                    <div className="provider-header">
                      <div className="provider-header-left">
                        <a
                          href={PROVIDER_URLS[provider.slug] ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="provider-badge"
                          style={{ color, borderColor: color + '50', backgroundColor: color + '18', textDecoration: 'none' }}
                        >
                          {provider.name}
                        </a>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                          {provider.total_records.toLocaleString()} records
                        </span>
                      </div>
                    </div>

                    {pipelines.length > 0 ? (
                      <table className="pipeline-table">
                        <thead>
                          <tr>
                            <th style={{ width: '35%' }}>Product Category</th>
                            <th style={{ width: '15%' }}>Records</th>
                            <th style={{ width: '25%' }}>Data Source</th>
                            <th style={{ width: '25%' }}>Last Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pipelines.map(pl => (
                            <tr key={pl.category}>
                              <td style={{ fontWeight: 500 }}>{pl.display_name}</td>
                              <td style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {pl.record_count > 0 ? pl.record_count.toLocaleString() : (
                                  <span style={{ color: 'var(--muted)' }}>0</span>
                                )}
                              </td>
                              <td>
                                <SourceBadge
                                  source={pl.data_source}
                                  apiCount={pl.api_count}
                                  staticCount={pl.static_count}
                                />
                              </td>
                              <td style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
                                {pl.last_updated
                                  ? new Date(pl.last_updated).toLocaleDateString('en-US', {
                                      year: 'numeric', month: 'short', day: 'numeric',
                                    })
                                  : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ padding: '1rem 1.5rem', color: 'var(--muted)', fontSize: 12 }}>
                        No pricing data found for this provider.
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            <BackToTop />

            </>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
    </>
  );
}
