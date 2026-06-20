'use client';

import React from 'react';
import Link from 'next/link';
import { Footer, ProductTypeSelector } from '@/components';
import cloudProductsData from '../../../cloud_products_comparison.json';

const headingToId = (text: string): string => {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
};

const PROVIDERS = ['Azure', 'AWS', 'GCP', 'OCI', 'Alibaba', 'DigitalOcean'];

// Categories we explicitly compare in the app
const SUPPORTED_CATEGORIES = ['Compute', 'Storage', 'Databases', 'Containers'];

const CloudProductsPage: React.FC = () => {
  // Group products by category
  const categoriesMap = new Map<string, typeof cloudProductsData>();
  cloudProductsData.forEach((item) => {
    if (!categoriesMap.has(item.category)) {
      categoriesMap.set(item.category, []);
    }
    categoriesMap.get(item.category)!.push(item);
  });

  const categories = Array.from(categoriesMap.keys());

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

  const getCategoryWithEmoji = (category: string) => {
    const emoji = CATEGORY_EMOJIS[category];
    return emoji ? `${emoji} ${category}` : category;
  };

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
            --divider-color: #dde0f0;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-color: #06060f;
              --text-color: #f1f5f9;
              --sidebar-bg: #0c0c1e;
              --border-color: #1e1e38;
              --link-color: #818cf8;
              --muted-text: #94a3b8;
              --divider-color: #1e1e38;
            }
          }

          .products-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: var(--bg-color);
          }

          .products-container {
            display: flex;
            flex: 1;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
          }

          .sidebar {
            width: 280px;
            border-right: 1px solid var(--border-color);
            padding: 2rem 1.5rem;
            position: fixed;
            top: 44px;
            height: calc(100vh - 44px - 48px);
            overflow-y: auto;
            background-color: var(--sidebar-bg);
          }

          .sidebar a {
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.2s;
          }

          .sidebar a:hover {
            color: var(--link-color);
          }

          .main-content {
            margin-left: 280px;
            flex: 1;
            padding: 3rem 4rem 5rem;
            max-width: 1000px;
          }

          .prose h2 {
            color: var(--text-color);
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-size: 1.5rem;
            font-weight: 700;
          }

          .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
            margin-bottom: 2.5rem;
            font-size: 0.85rem;
          }

          .products-table th, .products-table td {
            border: 1px solid var(--border-color);
            padding: 0.75rem;
            text-align: center;
          }

          .products-table th {
            background-color: var(--sidebar-bg);
            font-weight: 600;
          }

          .products-table a {
            color: var(--link-color);
            text-decoration: none;
          }

          .products-table a:hover {
            text-decoration: underline;
          }

          .supported-badge {
            display: inline-flex;
            align-items: center;
            background-color: #dbeafe;
            color: #1e3a8a;
            padding: 0.15rem 0.6rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-left: 0.75rem;
            text-decoration: none;
            transition: background-color 0.2s;
          }

          .supported-badge:hover {
            background-color: #bfdbfe;
          }

          @media (prefers-color-scheme: dark) {
            .supported-badge {
              background-color: #1e3a8a;
              color: #bfdbfe;
            }
            .supported-badge:hover {
              background-color: #1e40af;
            }
          }

          @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 2rem 1.5rem 5rem; }
          }
        `}
      </style>

      <div className="products-wrapper">
        <ProductTypeSelector activeProductType={"" as any} />
        <div className="products-container" id="cloud-products">
          <aside className="sidebar">
            <h4 style={{ fontSize: '0.75rem', color: 'var(--muted-text)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Categories
            </h4>
            <nav>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {categories.map((category) => (
                  <li key={category} style={{ marginBottom: '0.6rem' }}>
                    <a href={`#${headingToId(category)}`}>{getCategoryWithEmoji(category)}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="main-content">
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
              Cloud Products Comparison
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-text)', marginBottom: '2.5rem' }}>
              A comprehensive industry mapping of cloud services across major providers.
            </p>
            
            <div className="prose prose-slate dark:prose-invert max-w-none text-black dark:text-white">

              {categories.map((category) => {
                const items = categoriesMap.get(category)!;
                const isSupported = SUPPORTED_CATEGORIES.includes(category);
                
                return (
                  <div key={category}>
                    <h2 id={headingToId(category)} style={{ display: 'flex', alignItems: 'center' }}>
                      {getCategoryWithEmoji(category)}
                      {isSupported && (
                        <Link href="/" className="supported-badge">
                          Compare Pricing ➔
                        </Link>
                      )}
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="products-table">
                        <thead>
                          <tr>
                            <th>Feature</th>
                            {PROVIDERS.map((provider) => (
                              <th key={provider}>{provider}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: 500 }}>{item.feature}</td>
                              {PROVIDERS.map((provider) => {
                                const prod = (item.providers as any)[provider];
                                return (
                                  <td key={provider}>
                                    {prod && prod.url ? (
                                      <a href={prod.url} target="_blank" rel="noopener noreferrer">
                                        {prod.name}
                                      </a>
                                    ) : (
                                      <span style={{ color: 'var(--muted-text)' }}>
                                        {prod ? prod.name : 'N/A'}
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--muted-text)', textAlign: 'center' }}>
                <strong>Note on coverage:</strong> comparecloudcosts.com focuses on calculating pricing for core infrastructure. We have highlighted the categories we actively calculate pricing for with a <strong>Compare Pricing ➔</strong> link. Other categories are provided here as a helpful reference to understand product equivalents across the cloud ecosystem.
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CloudProductsPage;
