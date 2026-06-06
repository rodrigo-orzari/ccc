'use client';
import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const BackToTop = () => (
  <p style={{ marginTop: '1.5rem' }}>
    <a
      href="#top"
      style={{ color: 'var(--link-color)', fontSize: '0.875rem', textDecoration: 'none' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}
    >
      ↑ Go back to the top
    </a>
  </p>
);

const DocsPage: React.FC = () => {
  return (
    <>
      <style>{`
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
            --muted-text: #71717a;
            --divider-color: #1e1e38;
          }
        }
        .docs-container {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-color);
          color: var(--text-color);
          transition: background-color 0.3s, color 0.3s;
        }
        .docs-sidebar {
          width: 260px;
          border-right: 1px solid var(--border-color);
          padding: 2rem 1.5rem;
          position: fixed;
          height: calc(100vh - 48px);
          overflow-y: auto;
          background-color: var(--sidebar-bg);
          flex-shrink: 0;
        }
        .docs-sidebar a {
          color: var(--text-color);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.15s;
          display: block;
        }
        .docs-sidebar a:hover { color: var(--link-color); }
        .docs-main {
          margin-left: 260px;
          flex: 1;
          padding: 3rem 4rem 6rem;
          max-width: 820px;
          line-height: 1.7;
          font-size: 0.9375rem;
        }
        .docs-main h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
        .docs-main h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 2.5rem 0 0.75rem;
          letter-spacing: -0.01em;
          scroll-margin-top: 2rem;
        }
        .docs-main h3 {
          font-size: 1rem;
          font-weight: 700;
          margin: 1.5rem 0 0.5rem;
          scroll-margin-top: 2rem;
        }
        .docs-main p { margin: 0 0 1rem; color: var(--text-color); }
        .docs-main a { color: var(--link-color); text-decoration: none; }
        .docs-main a:hover { text-decoration: underline; }
        .docs-main strong { font-weight: 700; }
        .docs-main blockquote {
          border-left: 3px solid #f59e0b;
          background: #fffbeb;
          padding: 0.875rem 1.125rem;
          margin: 1.25rem 0;
          border-radius: 0 5px 5px 0;
          font-size: 0.875rem;
        }
        @media (prefers-color-scheme: dark) {
          .docs-main blockquote { background: #1a1500; }
        }
        .docs-meta {
          font-size: 0.8125rem;
          color: var(--muted-text);
          margin-bottom: 2.5rem;
        }
        .docs-section { margin-bottom: 0; }
        .docs-wrapper > footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }

        @media (max-width: 768px) {
          .docs-sidebar { display: none; }
          .docs-main { margin-left: 0; padding: 2rem 1.25rem 5rem; }
        }
      `}</style>

      <div className="docs-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="docs-container" id="top" style={{ flex: 1 }}>
        <aside className="docs-sidebar">
          <div style={{ marginBottom: '1.75rem' }}>
            <Link href="/" style={{ display: 'inline-block' }}>
              <img src="/logo.png" alt="Compare Cloud Costs" style={{ height: 28, width: 'auto' }} />
            </Link>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--muted-text)', marginBottom: '0.875rem' }}>
            On this page
          </div>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <li><a href="#getting-started" style={{ padding: '3px 0' }}>Getting Started</a></li>
              <li>
                <a href="#product-categories" style={{ padding: '3px 0' }}>Product Categories</a>
                <ul style={{ listStyle: 'none', paddingLeft: '0.875rem', margin: '2px 0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <li><a href="#virtual-machines" style={{ fontSize: '0.8125rem', padding: '2px 0', color: 'var(--muted-text)' }}>Virtual Machines</a></li>
                  <li><a href="#databases" style={{ fontSize: '0.8125rem', padding: '2px 0', color: 'var(--muted-text)' }}>Databases</a></li>
                  <li><a href="#serverless" style={{ fontSize: '0.8125rem', padding: '2px 0', color: 'var(--muted-text)' }}>Serverless</a></li>
                  <li><a href="#containers" style={{ fontSize: '0.8125rem', padding: '2px 0', color: 'var(--muted-text)' }}>Containers</a></li>
                  <li><a href="#networking" style={{ fontSize: '0.8125rem', padding: '2px 0', color: 'var(--muted-text)' }}>Networking</a></li>
                  <li><a href="#data--analytics" style={{ fontSize: '0.8125rem', padding: '2px 0', color: 'var(--muted-text)' }}>Data &amp; Analytics</a></li>
                </ul>
              </li>
              <li>
                <a href="#pricing-data" style={{ padding: '3px 0' }}>Pricing Data</a>
                <ul style={{ listStyle: 'none', paddingLeft: '0.875rem', margin: '2px 0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <li><a href="#sources" style={{ fontSize: '0.8125rem', padding: '2px 0', color: 'var(--muted-text)' }}>Sources</a></li>
                  <li><a href="#normalization" style={{ fontSize: '0.8125rem', padding: '2px 0', color: 'var(--muted-text)' }}>Normalization</a></li>
                  <li><a href="#accuracy" style={{ fontSize: '0.8125rem', padding: '2px 0', color: 'var(--muted-text)' }}>Accuracy</a></li>
                </ul>
              </li>
              <li><a href="#filters" style={{ padding: '3px 0' }}>Filters</a></li>
              <li><a href="#sharing" style={{ padding: '3px 0' }}>Sharing</a></li>
              <li><a href="#contributing--feedback" style={{ padding: '3px 0' }}>Contributing &amp; Feedback</a></li>
            </ul>
          </nav>
        </aside>

        <main className="docs-main">
          <h1>Documentation</h1>
          <p className="docs-meta">Last updated: June 2026.</p>
          <p>
            Welcome to the Compare Cloud Costs documentation. This page covers how the tool works,
            how pricing data is collected, and how to interpret results. Content will be expanded gradually.
          </p>

          {/* Getting Started */}
          <div className="docs-section">
            <h2 id="getting-started">Getting Started</h2>
            <p>
              Compare Cloud Costs is a free, open-source tool that aggregates and normalizes on-demand
              (pay-as-you-go) pricing across AWS, Microsoft Azure, Google Cloud, Oracle Cloud,
              DigitalOcean, and Alibaba Cloud in a single side-by-side view.
            </p>
            <p>
              Use the <strong>product tabs</strong> at the top to switch between categories: Virtual
              Machines, Databases, Serverless, Containers, Networking, and Data &amp; Analytics.
            </p>
            <p>
              Use the <strong>filter sidebar</strong> on the left to narrow results by provider,
              geography, instance specs, and product-specific attributes.
            </p>
            <BackToTop />
          </div>

          {/* Product Categories */}
          <div className="docs-section">
            <h2 id="product-categories">Product Categories</h2>

            <h3 id="virtual-machines">Virtual Machines</h3>
            <p>
              Compares compute instances across providers. Filter by operating system, CPU
              vendor/architecture, GPU support, and instance category (General Purpose, Compute
              Optimized, Memory Optimized, etc.). All prices are hourly, on-demand, Linux-based
              unless otherwise noted.
            </p>

            <h3 id="databases">Databases</h3>
            <p>
              Covers managed relational and NoSQL database services (RDS, Cloud SQL, Azure Database,
              etc.). Filter by database family, engine, deployment type (Single AZ, Multi-AZ,
              Serverless), and HA mode.
            </p>

            <h3 id="serverless">Serverless</h3>
            <p>
              Compares function-as-a-service pricing (AWS Lambda, Azure Functions, Google Cloud
              Functions, etc.). Key attributes include supported runtimes, cold start behavior,
              billing granularity, and memory configuration.
            </p>

            <h3 id="containers">Containers</h3>
            <p>
              Covers managed container runtimes including Kubernetes node pools (EKS, GKE, AKS, OKE,
              DOKS) and serverless container platforms (Fargate, Cloud Run, ACI). Filter by
              orchestrator, architecture (x86 or ARM), and billing granularity.
            </p>

            <h3 id="networking">Networking</h3>
            <p>
              Compares data transfer, VPC, load balancing, VPN, NAT gateway, and dedicated connection
              pricing. Supports filtering by service type, connection type, routing, and direction
              (egress/ingress).
            </p>

            <h3 id="data--analytics">Data &amp; Analytics</h3>
            <p>
              Covers managed data warehouse and analytics services (Redshift, BigQuery, Synapse,
              Snowflake, Databricks, and native cloud-provider offerings). Filter by engine,
              deployment type, and service tier.
            </p>

            <BackToTop />
          </div>

          {/* Pricing Data */}
          <div className="docs-section">
            <h2 id="pricing-data">Pricing Data</h2>

            <h3 id="sources">Sources</h3>
            <p>
              Pricing data is fetched automatically on a weekly basis from each provider's public
              pricing APIs and pages. When a live fetch fails, the tool falls back to a curated
              static configuration that is updated manually.
            </p>
            <p>
              All prices are <strong>on-demand (pay-as-you-go)</strong> in <strong>USD</strong>.
              Reserved, spot, savings plan, or committed-use pricing are not included.
            </p>

            <h3 id="normalization">Normalization</h3>
            <p>
              To enable apples-to-apples comparisons, all prices are normalized to a common unit —
              typically <strong>USD per hour</strong>. Resource specs (vCPUs, RAM, GPU count) are
              standardized across providers where definitions differ (e.g. Oracle OCPUs vs vCPUs).
            </p>

            <h3 id="accuracy">Accuracy</h3>
            <p>
              Prices are directional and intended for high-level comparison only. Always verify final
              pricing on the official provider calculator before making purchasing decisions.
            </p>
            <blockquote>
              <strong>Disclaimer:</strong> Price data may be delayed, incomplete, or imprecise.
              Compare Cloud Costs makes no warranties regarding accuracy. See our{' '}
              <Link href="/terms">Terms of Use</Link> for full details.
            </blockquote>

            <BackToTop />
          </div>

          {/* Filters */}
          <div className="docs-section">
            <h2 id="filters">Filters</h2>

            <h3 id="geography">Geography</h3>
            <p>
              Filters results to regions within a geographic area (N. America, W. Europe, Asia
              Pacific, etc.). Multi-select — choose one or more.
            </p>

            <h3 id="specs--price">Specs &amp; Price</h3>
            <p>
              Sliders to filter by vCPU count, memory (GB), and hourly price ($). Drag the handles
              inward to apply a range filter. Sliders at their outer limits apply no filter.
            </p>

            <h3 id="search">Search</h3>
            <p>
              The search box at the top of the table filters by instance type name or description.
            </p>

            <h3 id="aggregation">Aggregation</h3>
            <p>
              Toggle <strong>Aggregate View</strong> in the toolbar to collapse results by instance
              type across providers, showing min/max/avg pricing instead of individual region rows.
            </p>

            <BackToTop />
          </div>

          {/* Sharing */}
          <div className="docs-section">
            <h2 id="sharing">Sharing</h2>
            <p>
              Use the <strong>Share</strong> buttons in the top bar to share a link to the tool on X
              (Twitter) or LinkedIn.
            </p>
            <BackToTop />
          </div>

          {/* Contributing */}
          <div className="docs-section">
            <h2 id="contributing--feedback">Contributing &amp; Feedback</h2>
            <p>
              The project is open source. Found a bug, missing provider, or incorrect price? Open an
              issue or pull request on{' '}
              <a href="https://github.com/rodrigo-orzari/ccc" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              , or reach out at{' '}
              <a href="mailto:hello@comparecloudcosts.com">hello@comparecloudcosts.com</a>.
            </p>
            <BackToTop />
          </div>

        </main>
      </div>
      <Footer />
      </div>
    </>
  );
};

export default DocsPage;
