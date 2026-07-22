'use client';

import React from 'react';
import Link from 'next/link';
import { Footer, Sidebar, CopyHeading } from '@/components';

interface Sponsor {
  id: string;
  name: string;
  description: string;
  logoLight: string;
  logoDark: string;
  website: string;
  websiteDisplay: string;
  email: string;
  phone: string;
  // Omitted until the sponsor has chosen a workload to attach to (see Mytech below).
  linkUrl?: string;
  sponsoredPage?: string;
}

// Active sponsors.
const SPONSORS: Sponsor[] = [
  {
    id: 'mytech',
    name: 'Mytech',
    description: 'Mytech is an AWS Partner that delivers more than technology — they deliver governance, predictability, and sustainable results. They combine automation, artificial intelligence, and cost optimization (FinOps) into a unified strategy tailored to your business. From high-growth startups to enterprises modernizing legacy systems, Mytech brings proven expertise in complex, mission-critical projects.',
    // Two color variants of the same logo — the wordmark's "my" is dark text
    // (readable on the light-mode tile) in one and white text (readable on
    // the dark-mode tile) in the other. Swapped via the dark: variant below.
    logoLight: '/sponsors/mytech-light.png',
    logoDark: '/sponsors/mytech-dark.png',
    website: 'https://mytech.com.br',
    websiteDisplay: 'mytech.com.br',
    email: 'comercial@mytech.com.br',
    phone: '+55 31 99419-0028',
  },
];

export default function SponsorsPage() {
  return (
    <div className="wl-page flex flex-col lg:flex-row min-h-[100dvh] lg:h-screen bg-[var(--bg)] text-[var(--text)] font-sans lg:overflow-hidden">
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
      
      <Sidebar activeProductType={'' as any} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto flex flex-col">
        <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[var(--text)]">
              Sponsors
            </h1>
            <div className="text-[var(--muted)] text-sm leading-relaxed">
              <p className="mb-4">
                Compare Cloud Costs stays free and independent because of sponsor support. Sponsors cover our
                infrastructure costs so pricing data stays free for IT managers, product owners, and engineers
                comparing cloud spend. If you reach out to a sponsor, tell them you found them here. Want to
                sponsor a page? See <Link href="/docs#advertising" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold">Advertising with Us</Link> in the docs, or email <a href="mailto:hello@comparecloudcosts.com" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold">hello@comparecloudcosts.com</a>.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--border)] mb-8" />

          {/* Sponsors Grid Section */}
          <div className="mb-12">
            <CopyHeading id="active-sponsors" className="text-xl font-bold text-[var(--text)] mb-1 scroll-mt-6">
              Active Sponsors
            </CopyHeading>
            <p className="text-sm text-[var(--muted)] mb-6">
              Discover the sponsors that make this project possible.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SPONSORS.map((sponsor, index) => (
                <div
                  key={sponsor.id}
                  className="h-full border border-[var(--border)] rounded p-5 flex flex-col items-center text-center group bg-[#e8eaf8] dark:bg-[#10102a]"
                >
                  <h3 className="sr-only">{sponsor.name}</h3>
                  <img
                    src={sponsor.logoLight}
                    alt={`${sponsor.name} logo`}
                    className="max-w-[170px] w-full h-auto mb-4 dark:hidden"
                  />
                  <img
                    src={sponsor.logoDark}
                    alt={`${sponsor.name} logo`}
                    className="max-w-[170px] w-full h-auto mb-4 hidden dark:block"
                  />
                  <p className="text-[var(--muted)] text-[11px] mb-4 flex-1 leading-relaxed">
                    {sponsor.description}
                  </p>
                  <div className="mt-auto pt-3 border-t border-[var(--border)] w-full flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] text-[var(--muted)]">
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563eb] dark:text-[#818cf8] hover:underline"
                    >
                      {sponsor.websiteDisplay}
                    </a>
                    <span>|</span>
                    <a
                      href={`mailto:${sponsor.email}`}
                      className="text-[#2563eb] dark:text-[#818cf8] hover:underline"
                    >
                      {sponsor.email}
                    </a>
                    <span>|</span>
                    <span>{sponsor.phone}</span>
                  </div>
                  {sponsor.linkUrl && sponsor.sponsoredPage && (
                    <div className="mt-3 pt-3 border-t border-[var(--border)] w-full flex justify-center items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted)]">
                        Sponsoring:
                      </span>
                      <Link
                        href={sponsor.linkUrl}
                        className="text-[10px] text-[#2563eb] dark:text-[#818cf8] hover:underline truncate"
                        title={sponsor.sponsoredPage}
                      >
                        {sponsor.sponsoredPage}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--border)] mb-8" />

          {/* Audience Stats Placeholder Section */}
          <div className="mb-8 w-full">
            <CopyHeading id="audience-reach" className="text-xl font-bold text-[var(--text)] mb-1 scroll-mt-6">
              Audience & Reach
            </CopyHeading>
            <p className="text-sm text-[var(--muted)] mb-4">
              A snapshot of our global reach and the highly-qualified technical audience you can connect with by sponsoring. Last update July 16, 2026.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Traffic Card */}
              <div className="border border-[var(--border)] rounded p-4 flex flex-col group bg-[#e8eaf8] dark:bg-[#10102a] hover:border-[var(--text)] transition-colors">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: '#2563eb1a', color: '#2563eb' }}>
                    TRAFFIC
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)]">
                    MONTHLY
                  </span>
                </div>
                <h3 className="text-[15px] font-bold mb-1 text-[var(--text)]">200+ Unique Visitors</h3>
                <p className="text-[var(--muted)] text-[11px] mb-3 flex-1 leading-relaxed">
                  Consistent monthly traffic of technical professionals comparing cloud infrastructure costs.
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#2563eb40] bg-[#2563eb12] text-[#2563eb]">ORGANIC</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#16a34a40] bg-[#16a34a12] text-[#16a34a]">LINKEDIN</span>
                </div>
              </div>

              {/* Roles Card */}
              <div className="border border-[var(--border)] rounded p-4 flex flex-col group bg-[#e8eaf8] dark:bg-[#10102a] hover:border-[var(--text)] transition-colors">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: '#9333ea1a', color: '#9333ea' }}>
                    AUDIENCE
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)]">
                    ROLES
                  </span>
                </div>
                <h3 className="text-[15px] font-bold mb-1 text-[var(--text)]">Engineers & Architects</h3>
                <p className="text-[var(--muted)] text-[11px] mb-3 flex-1 leading-relaxed">
                  Our users are the technical decision-makers actively evaluating cloud architectures and tools.
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#eab30840] bg-[#eab30812] text-[#eab308]">DEVOPS</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#ef444440] bg-[#ef444412] text-[#ef4444]">CTO</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#06b6d440] bg-[#06b6d412] text-[#06b6d4]">SRE</span>
                </div>
              </div>

              {/* Engagement Depth Card */}
              <div className="border border-[var(--border)] rounded p-4 flex flex-col group bg-[#e8eaf8] dark:bg-[#10102a] hover:border-[var(--text)] transition-colors">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: '#06b6d41a', color: '#06b6d4' }}>
                    ENGAGEMENT
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)]">
                    DEPTH
                  </span>
                </div>
                <h3 className="text-[15px] font-bold mb-1 text-[var(--text)]">92% Scroll Depth</h3>
                <p className="text-[var(--muted)] text-[11px] mb-3 flex-1 leading-relaxed">
                  Visitors average 4.6 pages per session with deep scroll depth on pricing tables.
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#06b6d440] bg-[#06b6d412] text-[#06b6d4]">ACTIVE READING</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#3b82f640] bg-[#3b82f612] text-[#3b82f6]">HIGH-INTENT</span>
                </div>
              </div>

              {/* Geo Card */}
              <div className="border border-[var(--border)] rounded p-4 flex flex-col group bg-[#e8eaf8] dark:bg-[#10102a] hover:border-[var(--text)] transition-colors">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: '#16a34a1a', color: '#16a34a' }}>
                    DEMOGRAPHICS
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)]">
                    GLOBAL
                  </span>
                </div>
                <h3 className="text-[15px] font-bold mb-1 text-[var(--text)]">US & Global Reach</h3>
                <p className="text-[var(--muted)] text-[11px] mb-3 flex-1 leading-relaxed">
                  Most traffic is in the United States, with meaningful reach in the EU and India.
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#3b82f640] bg-[#3b82f612] text-[#3b82f6]">US</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#f9731640] bg-[#f9731612] text-[#f97316]">EU</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#8b5cf640] bg-[#8b5cf612] text-[#8b5cf6]">IN</span>
                </div>
              </div>

              {/* Device Card */}
              <div className="border border-[var(--border)] rounded p-4 flex flex-col group bg-[#e8eaf8] dark:bg-[#10102a] hover:border-[var(--text)] transition-colors">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f59e0b1a', color: '#f59e0b' }}>
                    PLATFORM
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)]">
                    DESKTOP
                  </span>
                </div>
                <h3 className="text-[15px] font-bold mb-1 text-[var(--text)]">85% Desktop</h3>
                <p className="text-[var(--muted)] text-[11px] mb-3 flex-1 leading-relaxed">
                  Users visit CCC while actively working on their PCs, indicating high-intent research behavior.
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#14b8a640] bg-[#14b8a612] text-[#14b8a6]">WINDOWS</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#64748b40] bg-[#64748b12] text-[#64748b]">MAC</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#ec489940] bg-[#ec489912] text-[#ec4899]">LINUX</span>
                </div>
              </div>

              {/* Traffic Quality Card */}
              <div className="border border-[var(--border)] rounded p-4 flex flex-col group bg-[#e8eaf8] dark:bg-[#10102a] hover:border-[var(--text)] transition-colors">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: '#8b5cf61a', color: '#8b5cf6' }}>
                    QUALITY
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)]">
                    RETENTION
                  </span>
                </div>
                <h3 className="text-[15px] font-bold mb-1 text-[var(--text)]">34% Return Rate</h3>
                <p className="text-[var(--muted)] text-[11px] mb-3 flex-1 leading-relaxed">
                  Returning visitors demonstrate sustained interest in your cloud cost optimization tools and services.
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#8b5cf640] bg-[#8b5cf612] text-[#8b5cf6]">QUALIFIED</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#ec489940] bg-[#ec489912] text-[#ec4899]">REPEAT</span>
                </div>
              </div>

              {/* Performance Card */}
              <div className="border border-[var(--border)] rounded p-4 flex flex-col group bg-[#e8eaf8] dark:bg-[#10102a] hover:border-[var(--text)] transition-colors">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: '#10b9811a', color: '#10b981' }}>
                    PERFORMANCE
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)]">
                    QUALITY
                  </span>
                </div>
                <h3 className="text-[15px] font-bold mb-1 text-[var(--text)]">67/100 Score</h3>
                <p className="text-[var(--muted)] text-[11px] mb-3 flex-1 leading-relaxed">
                  Optimized Core Web Vitals (LCP, INP, CLS) ensure your ads load fast and don't impact user experience.
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#10b98140] bg-[#10b98112] text-[#10b981]">FAST LOAD</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#3b82f640] bg-[#3b82f612] text-[#3b82f6]">SMOOTH</span>
                </div>
              </div>

              {/* Traffic Sources Card */}
              <div className="border border-[var(--border)] rounded p-4 flex flex-col group bg-[#e8eaf8] dark:bg-[#10102a] hover:border-[var(--text)] transition-colors">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f59e0b1a', color: '#f59e0b' }}>
                    SOURCES
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted)]">
                    REFERRERS
                  </span>
                </div>
                <h3 className="text-[15px] font-bold mb-1 text-[var(--text)]">Organic & LinkedIn</h3>
                <p className="text-[var(--muted)] text-[11px] mb-3 flex-1 leading-relaxed">
                  Strong presence in organic search and professional networks, showing your audience actively discovers us through trusted channels.
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#f59e0b40] bg-[#f59e0b12] text-[#f59e0b]">GOOGLE</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#3b82f640] bg-[#3b82f612] text-[#3b82f6]">LINKEDIN</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border shrink-0 border-[#06b6d440] bg-[#06b6d412] text-[#06b6d4]">DIRECT</span>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>

      <Footer />
      </div>
    </div>
  );
}
