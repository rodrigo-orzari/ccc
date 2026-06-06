'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
};

const PIPELINE_ORDER = ['compute', 'database', 'serverless', 'containers', 'networking', 'data_warehouse'];

function timeAgo(isoString: string | null): string {
  if (!isoString) return 'Never';
  const diff = Date.now() - new Date(isoString).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor(diff / 60000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

function freshnessStatus(isoString: string | null): 'fresh' | 'stale' | 'old' | 'missing' {
  if (!isoString) return 'missing';
  const days = (Date.now() - new Date(isoString).getTime()) / 86400000;
  if (days <= 8) return 'fresh';
  if (days <= 30) return 'stale';
  return 'old';
}

function StatusDot({ status }: { status: 'fresh' | 'stale' | 'old' | 'missing' | 'none' }) {
  const colors: Record<string, string> = {
    fresh: '#22c55e',
    stale: '#f59e0b',
    old: '#ef4444',
    missing: '#6b7280',
    none: '#6b7280',
  };
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: colors[status] ?? '#6b7280',
        flexShrink: 0,
      }}
    />
  );
}

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
      Live API
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
        API {apiCount.toLocaleString()}
      </span>
      <span style={{ ...badgeStyle, color: '#d97706', borderColor: '#d9770640', backgroundColor: '#d9770618' }}>
        Static {staticCount.toLocaleString()}
      </span>
    </span>
  );
}

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

  const globalFreshness = status ? freshnessStatus(status.last_ingested) : 'missing';

  return (
    <>
      <style>{`
        :root {
          --bg: #ffffff;
          --surface: #f9fafb;
          --border: #e5e7eb;
          --text: #111827;
          --muted: #6b7280;
          --link: #2563eb;
          --divider: #e5e7eb;
          --row-hover: #f3f4f6;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #000000;
            --surface: #0f0f0f;
            --border: #1f1f1f;
            --text: #f1f5f9;
            --muted: #71717a;
            --link: #60a5fa;
            --divider: #1f1f1f;
            --row-hover: #111111;
          }
        }
        .status-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
          padding: 2rem 2.5rem 4rem;
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
        }
        .pipeline-table th {
          text-align: left;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--muted);
          padding: 0.6rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
        }
        .pipeline-table td {
          padding: 0.65rem 1.5rem;
          border-bottom: 1px solid var(--divider);
          vertical-align: middle;
        }
        .pipeline-table tr:last-child td {
          border-bottom: none;
        }
        .pipeline-table tr:hover td {
          background: var(--row-hover);
        }
        .legend {
          margin-top: 2.5rem;
          padding: 1.25rem 1.5rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--surface);
        }
        .legend-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted);
          margin-bottom: 0.75rem;
        }
        .legend-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.5rem 1.5rem;
          font-size: 12px;
        }
        .legend-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        @media (max-width: 640px) {
          .status-header, .status-body { padding: 1.25rem 1rem; }
          .pipeline-table th, .pipeline-table td { padding: 0.55rem 1rem; }
          .provider-header { padding: 0.875rem 1rem; }
          .summary-card { padding: 1rem; }
        }
      `}</style>

      <div className="status-page">
        {/* Nav */}
        <div style={{ borderBottom: '1px solid var(--border)', padding: '0.75rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>
              ← Compare Cloud Costs
            </span>
          </Link>
          {status && (
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              Refreshed {timeAgo(status.generated_at)}
            </span>
          )}
        </div>

        <div className="status-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <StatusDot status={globalFreshness} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Data Status
            </h1>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
            Live view of pricing records collected per cloud provider and product category.
            {status?.last_ingested && (
              <> Last full ingestion: <strong style={{ color: 'var(--text)' }}>{timeAgo(status.last_ingested)}</strong> ({new Date(status.last_ingested).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}).</>
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
                  <div className="summary-card-sub">{timeAgo(status.last_ingested)}</div>
                </div>
              </div>

              {/* Provider cards */}
              {status.providers.map(provider => {
                const color = PROVIDER_COLORS[provider.slug] ?? '#888';
                const freshness = freshnessStatus(provider.last_updated);
                // Sort pipelines by canonical order
                const pipelines = [...provider.pipelines].sort(
                  (a, b) => PIPELINE_ORDER.indexOf(a.category) - PIPELINE_ORDER.indexOf(b.category)
                );

                return (
                  <div key={provider.slug} className="provider-card">
                    <div className="provider-header">
                      <div className="provider-header-left">
                        <StatusDot status={freshness} />
                        <span
                          className="provider-badge"
                          style={{ color, borderColor: color + '50', backgroundColor: color + '18' }}
                        >
                          {provider.name}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                          {provider.total_records.toLocaleString()} records
                        </span>
                      </div>
                      <div className="provider-header-right">
                        <span>
                          Updated: <strong style={{ color: 'var(--text)' }}>{timeAgo(provider.last_updated)}</strong>
                        </span>
                        {provider.last_updated && (
                          <span style={{ color: 'var(--muted)' }}>
                            {new Date(provider.last_updated).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    {pipelines.length > 0 ? (
                      <table className="pipeline-table">
                        <thead>
                          <tr>
                            <th>Product Category</th>
                            <th>Records</th>
                            <th>Data Source</th>
                            <th>Last Updated</th>
                            <th>Freshness</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pipelines.map(pl => {
                            const pf = freshnessStatus(pl.last_updated);
                            return (
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
                                <td>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <StatusDot status={pl.record_count === 0 ? 'missing' : pf} />
                                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                                      {pl.record_count === 0 ? 'No data' : timeAgo(pl.last_updated)}
                                    </span>
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ padding: '1rem 1.5rem', color: 'var(--muted)', fontSize: 12 }}>
                        No pricing data found for this provider.
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Legend */}
              <div className="legend">
                <div className="legend-title">How to read this page</div>
                <div className="legend-grid">
                  <div className="legend-item">
                    <StatusDot status="fresh" />
                    <span style={{ color: 'var(--muted)' }}><strong style={{ color: 'var(--text)' }}>Fresh</strong> — updated within 8 days</span>
                  </div>
                  <div className="legend-item">
                    <StatusDot status="stale" />
                    <span style={{ color: 'var(--muted)' }}><strong style={{ color: 'var(--text)' }}>Stale</strong> — 8–30 days old</span>
                  </div>
                  <div className="legend-item">
                    <StatusDot status="old" />
                    <span style={{ color: 'var(--muted)' }}><strong style={{ color: 'var(--text)' }}>Old</strong> — over 30 days old</span>
                  </div>
                  <div className="legend-item">
                    <StatusDot status="missing" />
                    <span style={{ color: 'var(--muted)' }}><strong style={{ color: 'var(--text)' }}>Missing</strong> — no data collected yet</span>
                  </div>
                  <div className="legend-item">
                    <span style={{ width: 8, flexShrink: 0 }} />
                    <span style={{ color: 'var(--muted)' }}>
                      <strong style={{ color: '#16a34a' }}>Live API</strong> — fetched directly from provider's pricing API each run
                    </span>
                  </div>
                  <div className="legend-item">
                    <span style={{ width: 8, flexShrink: 0 }} />
                    <span style={{ color: 'var(--muted)' }}>
                      <strong style={{ color: '#d97706' }}>Static</strong> — sourced from a curated config, updated manually
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: '1rem', marginBottom: 0 }}>
                  Pricing data is refreshed weekly. All prices are on-demand (pay-as-you-go) USD.
                  Static configs are used as fallbacks when live API fetches fail.
                  See the <Link href="/docs" style={{ color: 'var(--link)' }}>documentation</Link> for details.
                </p>
              </div>

              {/* Footer nav */}
              <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1.5rem', fontSize: 11, color: 'var(--muted)' }}>
                <Link href="/" style={{ color: 'var(--link)', textDecoration: 'none' }}>Dashboard</Link>
                <Link href="/about" style={{ color: 'var(--link)', textDecoration: 'none' }}>About</Link>
                <Link href="/docs" style={{ color: 'var(--link)', textDecoration: 'none' }}>Docs</Link>
                <Link href="/terms" style={{ color: 'var(--link)', textDecoration: 'none' }}>Terms of Use</Link>
                <a href="mailto:hello@comparecloudcosts.com" style={{ color: 'var(--link)', textDecoration: 'none' }}>Contact</a>
                <span>© 2026 Co-Sell Plus LLC</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
