'use client';

import React from 'react';
import Link from 'next/link';
import { Footer } from '@/components';

// Define the dummy sponsor data
const SPONSORS = [
  {
    id: 'acme-cloud',
    name: 'Acme Cloud Consulting',
    description: 'Expert cloud migration and FinOps services to optimize your architecture and reduce spend across all major providers. (Note: This is a fictitious dummy sponsor for demonstration purposes.)',
    logoUrl: 'https://placehold.co/400x400/2563eb/ffffff?text=ACME',
    linkUrl: '/workloads/three-tier-web-app',
    sponsoredPage: '3-Tier Web Application Workload',
  },
];

export default function SponsorsPage() {
  return (
    <div className="wl-page flex flex-col h-screen bg-[var(--bg)] text-[var(--text)] font-sans overflow-hidden">
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
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        .summary-card {
          background: var(--surface);
          padding: 1rem 0.85rem;
          text-align: center;
        }
        .summary-card-label {
          font-size: 8.5px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
          color: var(--muted);
          margin-bottom: 0.3rem;
          white-space: normal;
          overflow-wrap: anywhere;
          line-height: 1.25;
          min-height: 2.1em;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .summary-card-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
        }
        .summary-card-sub {
          font-size: 9px;
          color: var(--muted);
          margin-top: 0.2rem;
        }
      `}</style>

      <div className="flex-1 overflow-auto flex flex-col">
        <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[var(--text)]">
              Our Sponsors
            </h1>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              CompareCloudCosts remains free and unbiased thanks to the generous support of our sponsors. 
              These companies help cover our infrastructure costs so we can continue providing transparent cloud pricing data to the community.
              Interested in becoming a sponsor? See our <Link href="/docs#advertising" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold">Advertising Docs</Link> or contact <a href="mailto:hello@comparecloudcosts.com" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold">hello@comparecloudcosts.com</a>.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--border)] mb-8" />

          {/* Sponsors Grid Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[var(--text)] mb-1">
              Active Sponsors
            </h2>
            <p className="text-sm text-[var(--muted)] mb-6">
              Discover the partners that make this project possible.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {SPONSORS.map((sponsor, index) => (
                <div
                  key={sponsor.id}
                  className={`border border-[var(--border)] rounded p-4 flex flex-col group ${
                    index % 2 === 0 ? 'bg-[#f7f8ff] dark:bg-[#06060f]' : 'bg-[#e8eaf8] dark:bg-[#10102a]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={sponsor.logoUrl} 
                      alt={`${sponsor.name} logo`} 
                      className="w-10 h-10 rounded-md border border-[var(--border)] object-cover"
                    />
                    <h3 className="text-sm font-bold text-[var(--text)] truncate" title={sponsor.name}>
                      {sponsor.name}
                    </h3>
                  </div>
                  <p className="text-[var(--muted)] text-[11px] mb-4 flex-1 leading-relaxed">
                    {sponsor.description}
                  </p>
                  <div className="mt-auto pt-3 border-t border-[var(--border)] flex justify-between items-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted)]">
                      Sponsoring:
                    </span>
                    <Link 
                      href={sponsor.linkUrl}
                      className="text-[10px] text-[#2563eb] dark:text-[#818cf8] hover:underline truncate ml-2"
                      title={sponsor.sponsoredPage}
                    >
                      {sponsor.sponsoredPage}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--border)] mb-8" />

          {/* Audience Stats Placeholder Section */}
          <div className="mb-8 w-full">
            <h2 className="text-xl font-bold text-[var(--text)] mb-1">
              Our Audience & Reach
            </h2>
            <p className="text-sm text-[var(--muted)] mb-4">
              A snapshot of our global reach and the highly-qualified technical audience you can connect with by sponsoring.
            </p>
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-card-label" title="Average Monthly Traffic">
                  Monthly Traffic
                </div>
                <div className="summary-card-value">
                  --
                </div>
                <div className="summary-card-sub">
                  unique visitors
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-card-label" title="Top Audience Roles">
                  Primary Roles
                </div>
                <div className="summary-card-value text-xl flex items-center justify-center h-full pt-1">
                  Engineers & Architects
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-card-label" title="Top Geographies">
                  Top Geographies
                </div>
                <div className="summary-card-value text-xl flex items-center justify-center h-full pt-1">
                  US, EU, IN
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-card-label" title="Device Breakdown">
                  Desktop vs Mobile
                </div>
                <div className="summary-card-value text-xl flex items-center justify-center h-full pt-1">
                  --% Desktop
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
