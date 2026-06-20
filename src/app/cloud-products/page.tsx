'use client';

import React from 'react';
import Link from 'next/link';
import { Footer, ProductTypeSelector } from '@/components';
import cloudProductsData from '../../../cloud_products_comparison.json';

const headingToId = (text: string): string =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

const PROVIDERS = ['Azure', 'AWS', 'GCP', 'OCI', 'Alibaba', 'DigitalOcean'];

// Brand colours — kept in sync with src/config/index.ts PROVIDERS.
const PROVIDER_COLORS: Record<string, string> = {
  AWS: '#FF9900',
  Azure: '#00BCFF',
  GCP: '#34A853',
  OCI: '#F80000',
  Alibaba: '#FF6A00',
  DigitalOcean: '#0069FF',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  'Compute': '💻',
  'Storage': '💾',
  'Databases': '🗄️',
  'Containers': '📦',
  'Networking': '🌐',
  'Analytics': '📊',
  'AI & Machine Learning': '🤖',
  'Identity & Security': '🔒',
};

// Categories CCC actively prices → deep-link into the live catalog.
const CATEGORY_TO_PRODUCT: Record<string, string> = {
  'Compute': 'compute',
  'Storage': 'storage',
  'Databases': 'database',
  'Containers': 'containers',
  'Networking': 'networking',
  'Analytics': 'data-analytics',
  'AI & Machine Learning': 'ai',
};

function ProviderPill({ provider }: { provider: string }) {
  const color = PROVIDER_COLORS[provider] ?? '#888';
  return (
    <span
      className="inline-flex px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border w-fit"
      style={{ color, borderColor: color + '50', backgroundColor: color + '18' }}
    >
      {provider}
    </span>
  );
}

const CloudProductsPage: React.FC = () => {
  // Group products by category (preserve insertion order).
  const categoriesMap = new Map<string, typeof cloudProductsData>();
  cloudProductsData.forEach((item) => {
    if (!categoriesMap.has(item.category)) categoriesMap.set(item.category, []);
    categoriesMap.get(item.category)!.push(item);
  });
  const categories = Array.from(categoriesMap.keys());

  // Summary stats.
  const totalServiceTypes = cloudProductsData.length;
  const totalProductsMapped = cloudProductsData.reduce(
    (sum, item) => sum + PROVIDERS.filter(p => (item.providers as any)[p]?.name).length,
    0,
  );
  const pricedCategories = categories.filter(c => CATEGORY_TO_PRODUCT[c]).length;

  const getCategoryWithEmoji = (category: string) => {
    const emoji = CATEGORY_EMOJIS[category];
    return emoji ? `${emoji} ${category}` : category;
  };

  const stats = [
    { label: 'Product Categories', value: categories.length },
    { label: 'Service Types', value: totalServiceTypes },
    { label: 'Products Mapped', value: totalProductsMapped },
    { label: 'Priced by CCC', value: `${pricedCategories}/${categories.length}` },
  ];

  return (
    <>
      <style>
        {`
          :root {
            --bg-color: #f7f8ff;
            --text-color: #1a1a1a;
            --sidebar-bg: #eef0fc;
            --border-color: #dde0f0;
            --link-color: #2563eb;
            --muted-text: #6b7280;
            --surface: #ffffff;
            --row-alt: #f7f8ff;
            --row-hover: #eef0fc;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg-color: #06060f;
              --text-color: #f1f5f9;
              --sidebar-bg: #0c0c1e;
              --border-color: #1e1e38;
              --link-color: #818cf8;
              --muted-text: #94a3b8;
              --surface: #0a0a18;
              --row-alt: #0a0a18;
              --row-hover: #0c0c1e;
            }
          }
          .products-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: var(--bg-color); }
          .products-container { display: flex; flex: 1; background-color: var(--bg-color); color: var(--text-color); }
          .sidebar {
            width: 280px; border-right: 1px solid var(--border-color); padding: 2rem 1.5rem;
            position: fixed; top: 44px; height: calc(100vh - 44px - 48px); overflow-y: auto;
            background-color: var(--sidebar-bg);
          }
          .sidebar a { color: var(--text-color); text-decoration: none; transition: color 0.2s; }
          .sidebar a:hover { color: var(--link-color); }
          .main-content { margin-left: 280px; flex: 1; padding: 2.5rem 3rem 5rem; max-width: 1100px; }
          .products-wrapper > footer { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; }
          @media (max-width: 1024px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 1.5rem 1.25rem 5rem; }
          }
        `}
      </style>

      <div className="products-wrapper">
        <ProductTypeSelector activeProductType={'' as any} />
        <div className="products-container" id="cloud-products">

          {/* Sidebar TOC (desktop) */}
          <aside className="sidebar">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)] mb-3">
              Categories
            </h4>
            <nav className="flex flex-col gap-0.5">
              {categories.map((category) => (
                <a
                  key={category}
                  href={`#${headingToId(category)}`}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 rounded text-sm font-medium hover:bg-[var(--row-hover)] transition-colors"
                >
                  <span>{getCategoryWithEmoji(category)}</span>
                  <span className="text-[10px] text-[var(--muted-text)] tabular-nums">
                    {categoriesMap.get(category)!.length}
                  </span>
                </a>
              ))}
            </nav>
          </aside>

          <main className="main-content">
            {/* Header */}
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a2e] dark:text-[#f7f8ff] mb-1">
              Cloud Products Comparison
            </h1>
            <p className="text-sm text-[var(--muted-text)] max-w-2xl leading-relaxed mb-6">
              A cross-provider map of equivalent cloud services. Find the AWS, Azure, Google,
              Oracle, Alibaba, and DigitalOcean product for any capability — and jump straight
              into live pricing for the categories we track.
            </p>

            {/* Summary stat cards — joined Status-page style */}
            <div
              className="flex flex-wrap rounded-lg overflow-hidden border border-[var(--border-color)] mb-8"
              style={{ gap: 1, background: 'var(--border-color)' }}
            >
              {stats.map((s) => (
                <div key={s.label} className="flex-1 min-w-[140px] bg-[var(--surface)] px-4 py-3.5">
                  <div className="text-[22px] font-black tabular-nums leading-none text-[#1a1a2e] dark:text-[#f7f8ff]">
                    {s.value}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-text)] mt-1.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Category cards */}
            <div className="flex flex-col gap-8">
              {categories.map((category) => {
                const items = categoriesMap.get(category)!;
                const productType = CATEGORY_TO_PRODUCT[category];
                const isPriced = !!productType;

                return (
                  <section
                    key={category}
                    id={headingToId(category)}
                    className="scroll-mt-6 border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--surface)]"
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border-color)] bg-[var(--sidebar-bg)]">
                      <h2 className="text-base font-bold text-[#1a1a2e] dark:text-[#f7f8ff] flex items-center gap-2">
                        {getCategoryWithEmoji(category)}
                        <span className="text-[10px] font-medium text-[var(--muted-text)]">
                          · {items.length} service{items.length !== 1 ? 's' : ''}
                        </span>
                      </h2>
                      {isPriced ? (
                        <Link
                          href={`/?product=${productType}`}
                          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors"
                          style={{ color: '#16a34a', borderColor: '#16a34a40', backgroundColor: '#16a34a18' }}
                        >
                          ✓ Compare pricing →
                        </Link>
                      ) : (
                        <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-[var(--bg-color)] border-[var(--border-color)] text-[var(--muted-text)]">
                          Reference
                        </span>
                      )}
                    </div>

                    {/* Comparison table */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-[760px] text-left">
                        <thead>
                          <tr className="border-b border-[var(--border-color)]">
                            <th className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)] whitespace-nowrap">
                              Capability
                            </th>
                            {PROVIDERS.map((provider) => (
                              <th key={provider} className="py-2.5 px-4 text-center whitespace-nowrap">
                                <ProviderPill provider={provider} />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, idx) => (
                            <tr
                              key={idx}
                              className="border-b border-[var(--border-color)] last:border-0 transition-colors"
                              style={{ backgroundColor: idx % 2 === 1 ? 'var(--row-alt)' : 'var(--surface)' }}
                            >
                              <td className="py-3 px-4 text-[13px] font-semibold text-[#1a1a2e] dark:text-[#e5e7eb] whitespace-nowrap">
                                {item.feature}
                              </td>
                              {PROVIDERS.map((provider) => {
                                const prod = (item.providers as any)[provider];
                                const color = PROVIDER_COLORS[provider] ?? '#888';
                                if (!prod || !prod.name) {
                                  return (
                                    <td key={provider} className="py-3 px-4 text-center text-[12px] text-[#c7ccee] dark:text-[#2a2a4a]">
                                      —
                                    </td>
                                  );
                                }
                                return (
                                  <td key={provider} className="py-3 px-4 text-center">
                                    {prod.url ? (
                                      <a
                                        href={prod.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[12px] font-medium text-[#404040] dark:text-[#d4d4d4] hover:underline transition-colors leading-snug"
                                        style={{ textDecorationColor: color }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = color; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = ''; }}
                                      >
                                        {prod.name}
                                      </a>
                                    ) : (
                                      <span className="text-[12px] text-[var(--muted-text)] leading-snug">{prod.name}</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Footnote */}
            <div className="mt-10 pt-6 border-t border-[var(--border-color)] text-[11px] text-[var(--muted-text)] leading-relaxed">
              <strong className="text-[#171717] dark:text-[#e5e7eb] uppercase tracking-widest text-[10px]">
                Note on coverage:
              </strong>{' '}
              comparecloudcosts.com calculates live pricing for core infrastructure. Categories marked
              with a green <strong>✓ Compare pricing →</strong> badge link straight into our pricing
              tool; the rest are provided as a reference for understanding product equivalents across
              the cloud ecosystem. Product names and links point to each provider's official page.
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CloudProductsPage;
