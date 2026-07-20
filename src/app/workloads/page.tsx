'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Footer, Sidebar, DonationModal } from '@/components';
import { WORKLOADS } from '@/config/workloads';
import { DEFAULT_PRIORITIES } from '@/config/workload_priorities';
import { WORKLOADS_LISTING_SPONSOR, PROVIDERS } from '@/config';
import { isNotOffered } from '@/config/not_offered';

const HYPERSCALERS = PROVIDERS.slice(0, 6);

export default function WorkloadsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkloads = WORKLOADS.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="wl-page flex h-screen bg-[var(--bg)] text-[var(--text)] font-sans overflow-hidden">
      <style>{`
        .wl-page {
          --bg: #ffffff;
          --surface: #ffffff;
          --border: #e5e5e5;
          --text: #171717;
          --muted: #737373;
          --row-hover: #fafafa;
        }
        @media (prefers-color-scheme: dark) {
          .wl-page {
            --bg: #000000;
            --surface: #000000;
            --border: #262626;
            --text: #e5e7eb;
            --muted: #a3a3a3;
            --row-hover: #0a0a0a;
          }
        }
      `}</style>
      <DonationModal showOn="workloads" />
      <Sidebar activeProductType={"workloads" as any} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto flex flex-col">
        <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[var(--text)]">
              Cloud Workloads
            </h1>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              Pick an architecture below to see its total cost across different providers, scaled to your requirements. Need a template we don't have? Tell us what to build.{' '}
              <a href="mailto:hello@comparecloudcosts.com?subject=New%20Workload%20Request" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold">
                📧 hello@comparecloudcosts.com
              </a>
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--border)] mb-8" />

          {/* Sponsorship Box — renders WORKLOADS_LISTING_SPONSOR's 1200×200 banner when set,
              otherwise falls back to the "become a sponsor" pitch. */}
          {WORKLOADS_LISTING_SPONSOR ? (
            <a
              href={WORKLOADS_LISTING_SPONSOR.linkUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mb-8 block rounded overflow-hidden border border-[var(--border)]"
            >
              <img
                src={WORKLOADS_LISTING_SPONSOR.imageUrl}
                alt={`Sponsored by ${WORKLOADS_LISTING_SPONSOR.companyName}`}
                width={1200}
                height={200}
                className="w-full h-auto aspect-[6/1] object-cover"
              />
            </a>
          ) : (
            <div className="mb-8 border-2 border-dashed border-[var(--border)] rounded bg-[var(--row-hover)] p-6 flex flex-col items-center gap-3 text-center">
              <div>
                <h3 className="text-sm font-bold text-[var(--text)] mb-1 flex items-center justify-center gap-2">
                  Sponsor a Workload
                </h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                  Sponsor a workload page. Your brand in front of engineers comparing cloud pricing. See <Link href="/docs#advertising" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-bold">Advertising with Us in the Documentation</Link>, or email hello@comparecloudcosts.com.
                </p>
                <p className="text-[11px] text-[var(--muted)] mt-1.5 opacity-80">
                  Banner spec: 1200 × 200px (6:1 ratio) · PNG, JPG, or WebP. See the <Link href="/docs#advertising-specs" className="underline hover:text-[var(--text)]">Docs</Link> for detailed instructions.
                </p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-[var(--border)] mb-8" />

          {/* Search + count */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-3 w-3 text-[var(--muted)]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search workloads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--row-hover)] border border-[var(--border)] text-[var(--text)] text-[11px] rounded pl-8 pr-3 py-1.5 focus:border-[var(--text)] placeholder-[var(--muted)] outline-none transition-colors"
              />
            </div>
            <span className="text-[11px] text-[var(--muted)]">
              Showing {filteredWorkloads.length} workloads. Contact{' '}
              <a
                href="mailto:hello@comparecloudcosts.com?subject=New%20Workload%20Proposal"
                className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold"
              >
                hello@comparecloudcosts.com
              </a>{' '}
              to propose other workload designs.
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] font-medium text-[#2563eb] dark:text-[#818cf8] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {filteredWorkloads.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[var(--border)] rounded">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">No workloads found</h3>
              <p className="text-[var(--muted)] mt-1 text-[11px]">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredWorkloads.map((workload, index) => (
                <Link
                  key={workload.id}
                  href={`/workloads/${workload.id}`}
                  className={`border border-[var(--border)] rounded p-4 hover:border-[var(--text)] transition-colors flex flex-col group cursor-pointer ${
                    index % 2 === 0 ? 'bg-[#f7f8ff] dark:bg-[#06060f]' : 'bg-[#e8eaf8] dark:bg-[#10102a]'
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl shrink-0 leading-none">{workload.icon}</span>
                    <h3 className="text-[15px] font-bold text-[var(--text)] truncate" title={workload.name}>
                      {workload.name}
                    </h3>
                  </div>
                  <p className="text-[var(--muted)] text-[12px] mb-4 flex-1 line-clamp-3 leading-relaxed">
                    {workload.description}
                  </p>

                  {/* Provider bubbles showing who supports this workload */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {HYPERSCALERS.filter((p) => {
                      // AI constraint: DO doesn't support GenAI
                      const hasAI = workload.components.some(c => c.getRequirements(DEFAULT_PRIORITIES)?.productType === 'ai');
                      if (hasAI && p.id === 'digitalocean') return false;

                      // Configured NotOffered constraints
                      const excluded = workload.components.some(c => {
                        const reqs = c.getRequirements(DEFAULT_PRIORITIES);
                        if (!reqs) return false;
                        return isNotOffered(p.id, reqs.productType, reqs.category);
                      });
                      return !excluded;
                    }).map((p) => (
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

                  <div className="mt-auto pt-3 border-t border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] group-hover:text-[var(--text)] transition-colors flex justify-between items-center">
                    Configure &amp; Compare <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
      </div>
    </div>
  );
}
