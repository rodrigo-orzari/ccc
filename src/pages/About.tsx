import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

const AboutPage: React.FC = () => {
  const content = `
# About Compare Cloud Costs (CCC)

## Why we built this

Cloud computing has revolutionized how we build and scale technology, but it has also introduced a new challenge: pricing complexity. While cloud providers offer individual calculators and purchase agreements, calculating the True Cost of Ownership (TCO) for a modern infrastructure remains a monumental task.

### The Cloud Pricing Maze

Users can find exact pricing for one provider in isolation, but comparing those costs side-by-side requires navigating disparate calculators and performing exhaustive individual studies. Data is scattered across different rate cards and service models, making an "apples-to-apples" comparison nearly impossible without manual normalization.

Many organizations rely on traditional FinOps solutions that provide an "after-the-fact" view of spending. While these help optimize existing spend, they don't provide the proactive, comparative clarity needed before a workload is deployed.

Furthermore, the modern landscape is increasingly multi-cloud. Companies run workloads across different cloud providers simultaneously to achieve specific performance, redundancy, or strategic goals. Many organizations find themselves overpaying because they lacked a unified, cross-provider view during the planning phase.

## Features

Compare Cloud Costs (CCC) was built to bridge the gap between complex provider rate cards and actionable business intelligence.

### Side-by-Side Multi-Cloud Analysis

Compare identical configurations across the world's leading cloud providers (AWS, Microsoft Azure, Google Cloud, Oracle Cloud, DigitalOcean, and more) in a single view.

### Real-Time Data

Our engines refresh pricing data frequently to ensure you are seeing the most accurate market rates before you commit to a provider.

### Granular Breakdown

We break down compute, storage, networking, and support costs so you see exactly how a workload's cost structure changes across different providers.

### Proactive Optimization

We provide insights into right-sizing and regional price differences before deployment, complementing your existing reactive FinOps tools.

---

[Terms of Use](/terms) | [Privacy Policy](/privacy) | [Contact Us](mailto:hello@comparecloudcosts.com)
`;

  return (
    <>
      <style>
        {`
          :root {
            --bg-color: #ffffff;
            --text-color: #1a1a1a;
            --sidebar-bg: #f9fafb;
            --border-color: #e5e7eb;
            --link-color: #2563eb;
            --muted-text: #6b7280;
            --divider-color: #e5e7eb;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-color: #0f172a;
              --text-color: #f1f5f9;
              --sidebar-bg: #1e293b;
              --border-color: #334155;
              --link-color: #60a5fa;
              --muted-text: #94a3b8;
              --divider-color: #334155;
            }
          }

          .about-container {
            display: flex;
            min-height: 100vh;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
          }

          .sidebar {
            width: 280px;
            border-right: 1px solid var(--border-color);
            padding: 2rem 1.5rem;
            position: fixed;
            height: 100vh;
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
            padding: 3rem 4rem;
            max-width: 850px;
          }

          .prose h2, .prose h3 {
            color: var(--text-color);
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }

          .prose hr {
            border: 0;
            border-top: 1px solid var(--divider-color);
            margin: 3rem 0;
          }

          .prose a {
            color: var(--link-color);
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 500;
          }

          .prose blockquote {
            border-left: 4px solid #f59e0b;
            background-color: #fffbeb;
            padding: 1rem 1.25rem;
            margin: 1.5rem 0;
            border-radius: 0 0.375rem 0.375rem 0;
          }

          @media (prefers-color-scheme: dark) {
            .prose blockquote {
              background-color: #1c1a0f;
            }
          }

          @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 2rem; }
          }
        `}
      </style>

      <div className="about-container" id="about-us">
        <aside className="sidebar">
          <h4 style={{ fontSize: '0.75rem', color: 'var(--muted-text)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            In this article
          </h4>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.6rem' }}><a href="#why-we-built-this">Why we built this</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#features">Features</a></li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
            What is CompareCloudCosts.com?
          </h1>
          <div className="prose">
            <MarkdownPage title="" content={content} />
          </div>
        </main>
      </div>
    </>
  );
};

export default AboutPage;
