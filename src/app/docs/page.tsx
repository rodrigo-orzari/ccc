'use client';
import React from 'react';
import Link from 'next/link';
import { Footer, ProductTypeSelector } from "@/components";

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

// Section heading with a click-to-copy deep link to that section.
const CopyHeading: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const [copied, setCopied] = React.useState(false);
  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    const done = () => {
      setCopied(true);
      window.history.replaceState(null, '', `#${id}`);
      setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(done);
    } else {
      done();
    }
  };
  return (
    <h2 id={id} className="docs-h2">
      {children}
      <button
        type="button"
        onClick={copyLink}
        className={`docs-h2-anchor${copied ? ' copied' : ''}`}
        aria-label={`Copy link to the ${typeof children === 'string' ? children : 'section'} section`}
        title="Copy link to this section"
      >
        {copied ? '✓ Copied' : '🔗 Copy link'}
      </button>
    </h2>
  );
};

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
          flex: 1;
          background-color: var(--bg-color);
          color: var(--text-color);
          transition: background-color 0.3s, color 0.3s;
        }
        .docs-topnav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          height: 44px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--sidebar-bg);
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
        }
        .docs-sidebar {
          width: 260px;
          border-right: 1px solid var(--border-color);
          padding: 2rem 1.5rem;
          position: fixed;
          top: 44px;
          height: calc(100vh - 44px - 48px);
          overflow-y: auto;
          background-color: var(--sidebar-bg);
          flex-shrink: 0;
        }
        .docs-sidebar a {
          color: var(--text-color);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.15s;
          display: block;
        }
        .docs-sidebar a:hover { color: var(--link-color); }
        @media (prefers-color-scheme: dark) {
          .docs-sidebar a { color: #ffffff; }
        }
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
        .docs-main h2.docs-h2 {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .docs-h2-anchor {
          opacity: 0.3;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--muted-text);
          font-size: 0.7rem;
          font-weight: 600;
          line-height: 1;
          padding: 3px 6px;
          border-radius: 4px;
          transition: opacity 0.15s, background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .docs-h2:hover .docs-h2-anchor { opacity: 0.75; }
        .docs-h2-anchor:hover { opacity: 1 !important; background: var(--border-color); color: var(--text-color); }
        .docs-h2-anchor.copied { opacity: 1 !important; color: #16a34a; }
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
        .docs-section {
          margin-bottom: 0;
          padding-top: 2.5rem;
          border-top: 1px solid var(--divider-color);
        }
        .docs-section:first-of-type {
          border-top: none;
          padding-top: 0;
        }
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
        <ProductTypeSelector />
      <div className="docs-container" id="top" style={{ flex: 1 }}>
        <aside className="docs-sidebar">
            <h4 style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1, margin: 0, marginBottom: '1rem' }}>
              Content
            </h4>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <li><a href="#getting-started" style={{ padding: '3px 0' }}>Getting Started</a></li>
              <li>
                <a href="#product-categories" style={{ padding: '3px 0' }}>Product Categories</a>
                <ul style={{ listStyle: 'none', paddingLeft: '0.875rem', margin: '2px 0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <li><a href="#ai-machine-learning" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>AI &amp; Machine Learning</a></li>
                  <li><a href="#app-hosting" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>App Hosting</a></li>
                  <li><a href="#containers" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Containers</a></li>
                  <li><a href="#databases" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Databases</a></li>
                  <li><a href="#data--analytics" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Data &amp; Analytics</a></li>
                  <li><a href="#networking" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Networking</a></li>
                  <li><a href="#serverless" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Serverless</a></li>
                  <li><a href="#storage" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Storage</a></li>
                  <li><a href="#virtual-machines" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Virtual Machines</a></li>
                </ul>
              </li>
              <li>
                <a href="#workloads" style={{ padding: '3px 0' }}>Workloads</a>
              </li>
              <li>
                <a href="#use-cases" style={{ padding: '3px 0' }}>Use Cases</a>
                <ul style={{ listStyle: 'none', paddingLeft: '0.875rem', margin: '2px 0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <li><a href="#use-case-1" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Database + Compute Scaling</a></li>
                  <li><a href="#use-case-2" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Multi-Region DR</a></li>
                  <li><a href="#use-case-3" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Kubernetes Clusters</a></li>
                </ul>
              </li>
              <li>
                <a href="#datacenters" style={{ padding: '3px 0' }}>Datacenters</a>
                <ul style={{ listStyle: 'none', paddingLeft: '0.875rem', margin: '2px 0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <li><a href="#datacenter-data-sources" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Data sources</a></li>
                  <li><a href="#datacenter-accuracy" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Accuracy &amp; freshness</a></li>
                </ul>
              </li>
              <li>
                <a href="#pricing-data" style={{ padding: '3px 0' }}>Pricing Data</a>
                <ul style={{ listStyle: 'none', paddingLeft: '0.875rem', margin: '2px 0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <li><a href="#sources" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Data sources</a></li>
                  <li><a href="#normalization" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Normalization</a></li>
                  <li><a href="#price-trends" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Price Trends</a></li>
                  <li><a href="#accuracy" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Accuracy &amp; freshness</a></li>
                </ul>
              </li>
              <li><a href="#glossary" style={{ padding: '3px 0' }}>Glossary</a></li>
              <li><a href="#filters" style={{ padding: '3px 0' }}>Filters</a></li>
              <li><a href="#sharing" style={{ padding: '3px 0' }}>Sharing</a></li>
              <li><a href="#advertising" style={{ padding: '3px 0' }}>Advertising with Us</a></li>
              <li><a href="#contributing--feedback" style={{ padding: '3px 0' }}>Contributing &amp; Feedback</a></li>
            </ul>
          </nav>
        </aside>

        <main className="docs-main">
          <h1>Documentation</h1>
          <p className="docs-meta">Last updated: June 2026.</p>
          <p>
            Welcome to the comparecloudcosts.com documentation. This page covers how the tool works,
            how pricing data is collected, and how to interpret results. Content will be expanded gradually.
          </p>

          {/* Getting Started */}
          <div className="docs-section">
            <CopyHeading id="getting-started">Getting Started</CopyHeading>
            <p>
              comparecloudcosts.com is a free, open-source tool that aggregates and normalizes on-demand
              (pay-as-you-go) pricing across AWS, Microsoft Azure, Google Cloud, Oracle Cloud,
              DigitalOcean, and Alibaba in a single side-by-side view.
            </p>
            <p>
              Use the <strong>product tabs</strong> at the top to switch between categories: AI &amp; Machine Learning,
              App Hosting, Containers, Databases, Data &amp; Analytics, Networking, Serverless, Storage, and Virtual Machines.
            </p>
            <p>
              Use the <strong>filter sidebar</strong> on the left to narrow results by provider,
              geography, instance specs, and product-specific attributes.
            </p>
            <BackToTop />
          </div>

          {/* Product Categories */}
          <div className="docs-section">
            <CopyHeading id="product-categories">Product Categories</CopyHeading>

            <h3 id="ai-machine-learning">AI &amp; Machine Learning</h3>
            <p>
              Compares managed AI foundation models and APIs (e.g., GPT-4, Claude 3, Gemini 1.5, Llama 3). Filter by context window size, multimodal capabilities, and compare input/output pricing per 1M tokens.
            </p>

            <h3 id="app-hosting">App Hosting</h3>
            <p>
              Covers managed application hosting and Platform-as-a-Service offerings (App Service, App Engine, Heroku, etc.). Compare by compute tier, operating system, and architecture.
            </p>

            <h3 id="containers">Containers</h3>
            <p>
              Covers managed container runtimes including Kubernetes node pools (EKS, GKE, AKS, OKE,
              DOKS) and serverless container platforms (Fargate, Cloud Run, ACI). Filter by
              orchestrator, architecture (x86 or ARM), and billing granularity.
            </p>

            <h3 id="databases">Databases</h3>
            <p>
              Covers managed relational, NoSQL, and In-memory database services (RDS, Cloud SQL, Azure Database,
              ElastiCache, Memorystore, etc.). Filter by database family, engine, deployment type (Single AZ, Multi-AZ,
              Serverless), and HA mode.
            </p>

            <h3 id="data--analytics">Data &amp; Analytics</h3>
            <p>
              Covers managed data warehouse and analytics services (Redshift, BigQuery, Synapse,
              Snowflake, Databricks, and native cloud-provider offerings). Filter by engine,
              deployment type, and service tier.
            </p>

            <h3 id="networking">Networking</h3>
            <p>
              Compares data transfer, VPC, load balancing, VPN, NAT gateway, and dedicated connection
              pricing. Supports filtering by service type, connection type, routing, and direction
              (egress/ingress).
            </p>

            <h3 id="serverless">Serverless</h3>
            <p>
              Compares function-as-a-service pricing (AWS Lambda, Azure Functions, Google Cloud
              Functions, etc.) alongside integration services like API Gateways, Messaging Queues, Event Buses, and Workflows. Key attributes include supported runtimes, cold start behavior, billing granularity, and memory configuration.
            </p>

            <h3 id="storage">Storage</h3>
            <p>
              Compares object, block, and file storage pricing (S3, Blob Storage, Cloud Storage, EBS). Filter by storage type, performance tier, redundancy (LRS, ZRS, GRS), and media type.
            </p>

            <h3 id="virtual-machines">Virtual Machines</h3>
            <p>
              Compares compute instances across providers. Filter by operating system, CPU
              vendor/architecture, GPU support, and instance category (General Purpose, Compute
              Optimized, Memory Optimized, etc.). All prices are hourly, on-demand, Linux-based
              unless otherwise noted.
            </p>

            <BackToTop />
          </div>

          {/* Workloads */}
          <div className="docs-section">
            <CopyHeading id="workloads">Workloads</CopyHeading>
            <p>
              The Workloads feature allows you to price end-to-end cloud architectures instead of just individual components. We've defined common application patterns and their component requirements. By adjusting scale parameters, the tool automatically calculates necessary resource specs and queries the cheapest matching instances across all providers.
            </p>
            <p><strong>Available workloads:</strong></p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/workloads/serverless-web-app" style={{ color: 'var(--link-color)', textDecoration: 'none' }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}>
                  Serverless Web Application
                </Link> — Event-driven backends for web and mobile apps. Ideal for variable workloads and reduced operational overhead.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/workloads/3-tier-web" style={{ color: 'var(--link-color)', textDecoration: 'none' }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}>
                  Classic 3-Tier Web Architecture
                </Link> — The foundational blueprint for traditional web applications using VMs and relational databases. Scales from hundreds to thousands of concurrent users.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/workloads/streaming-analytics" style={{ color: 'var(--link-color)', textDecoration: 'none' }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}>
                  Real-time Streaming Analytics
                </Link> — High-throughput data pipelines for IoT telemetry, clickstreams, and financial data processing.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/workloads/ecommerce-microservices" style={{ color: 'var(--link-color)', textDecoration: 'none' }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}>
                  E-Commerce Microservices Stack
                </Link> — A decoupled, highly available architecture for product catalogs and transactions. Built for fast lookups and fault tolerance.
              </li>
            </ul>

            <BackToTop />
          </div>

          {/* Use Cases */}
          <div className="docs-section">
            <CopyHeading id="use-cases">Use Cases & Step-by-Step Comparisons</CopyHeading>
            <p>
              The following real-world scenarios demonstrate how to use comparecloudcosts.com to compare pricing across multiple product categories, apply filters, and export results for decision-making.
            </p>

            <h3 id="use-case-1">Use Case 1: Evaluating Database + Compute for a Scaling Startup</h3>
            <p>
              <strong>Scenario:</strong> You're running a SaaS product with a PostgreSQL database and API servers. You want to compare cost-effective options for both components as your user base grows from 1,000 to 5,000 concurrent users.
            </p>
            <p><strong>Steps:</strong></p>
            <ol style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Start on the Databases tab.</strong> Click <strong>Databases</strong> at the top of the page.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Filter for managed relational databases.</strong> In the left sidebar:
                <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 0.5rem' }}>
                  <li>Select <strong>Engine: PostgreSQL</strong> to narrow to your database type.</li>
                  <li>Select <strong>HA Mode: Multi-AZ</strong> to ensure high availability.</li>
                  <li>Set <strong>Memory: 8–32 GB</strong> to match a medium-sized production database.</li>
                  <li>Keep <strong>Geography: All</strong> to see global options.</li>
                </ul>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Note the top 3 providers</strong> by hourly price (typically AWS RDS, Azure Database, or Google Cloud SQL).
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Switch to Virtual Machines tab.</strong> Now compare compute instances for your application servers.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Filter for balanced compute.</strong> In the sidebar:
                <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 0.5rem' }}>
                  <li>Select <strong>Category: General purpose</strong>.</li>
                  <li>Set <strong>vCPU: 2–4</strong> and <strong>Memory: 8–16 GB</strong>.</li>
                  <li>Select <strong>Geography: US East</strong> to match your database region.</li>
                </ul>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Export or screenshot results.</strong> You now have a side-by-side cost table for all major providers. Use this to calculate total monthly cost: (Database hourly price + Compute hourly price per instance × 2–3 instances) × 730 hours/month.
              </li>
            </ol>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-text)' }}>
              <strong>💡 Tip:</strong> Repeat this comparison at 5,000 and 10,000 concurrent users by increasing vCPU/memory filters. You'll see how scaling costs differ across providers — some remain linear, while others show volume discounts or better pricing at larger sizes.
            </p>

            <h3 id="use-case-2">Use Case 2: Multi-Region Disaster Recovery Architecture</h3>
            <p>
              <strong>Scenario:</strong> You need to set up a disaster recovery (DR) backup in a different geographic region. You want to compare both primary and backup region costs across Storage (for backups) and Networking (for data replication).
            </p>
            <p><strong>Steps:</strong></p>
            <ol style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Start on the Storage tab.</strong> Click <strong>Storage</strong> at the top.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Filter for object storage.</strong> In the left sidebar:
                <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 0.5rem' }}>
                  <li>Select <strong>Type: Object Storage</strong> (S3-equivalent).</li>
                  <li>Select <strong>Geography: US East</strong> for your primary region.</li>
                </ul>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Record storage pricing per GB/month.</strong> Note the cost for your expected backup volume (e.g., 500 GB).
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Switch filters to Geography: EU West</strong> (your DR region) and repeat. Compare how storage costs differ.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Switch to Networking tab.</strong> Now estimate data transfer costs for replication.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Filter for inter-region data transfer.</strong> In the sidebar:
                <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 0.5rem' }}>
                  <li>Look for rows mentioning <strong>Data Transfer Out (Intercontinental)</strong> or <strong>Data Transfer Between Regions</strong>.</li>
                  <li>These typically cost $0.02–0.05 per GB, depending on direction and provider.</li>
                </ul>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Calculate monthly DR cost:</strong> (Primary storage + DR storage + daily replication volume × 30 days × data transfer rate).
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Export or create a spreadsheet</strong> with your calculations and share with your team for decision-making.
              </li>
            </ol>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-text)' }}>
              <strong>💡 Tip:</strong> Use the <strong>Aggregate View</strong> toggle (in the toolbar) to collapse results by instance type and see min/max/avg pricing. This makes it easier to spot which provider offers the best value across regions.
            </p>

            <h3 id="use-case-3">Use Case 3: Containerized Workload Scaling on Kubernetes</h3>
            <p>
              <strong>Scenario:</strong> You're migrating a Docker-based application to Kubernetes and need to compare the per-node cost of different providers' managed Kubernetes services (EKS, GKE, AKS, DOKS, OKE).
            </p>
            <p><strong>Steps:</strong></p>
            <ol style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Start on the Containers tab.</strong> Click <strong>Containers</strong> at the top.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Filter for Kubernetes node pools.</strong> In the left sidebar:
                <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 0.5rem' }}>
                  <li>Select <strong>Type: Kubernetes</strong> (or look for EKS, GKE, AKS, OKE, DOKS).</li>
                  <li>Set <strong>vCPU: 4</strong> and <strong>Memory: 16 GB</strong> (a typical mid-size node).</li>
                  <li>Select <strong>Geography: US East</strong>.</li>
                </ul>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Note the per-node hourly cost</strong> for each provider. This is what you'll pay for each Kubernetes worker node.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Check for hidden costs.</strong> Managed Kubernetes services often add control-plane charges:
                <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 0.5rem' }}>
                  <li><strong>AWS EKS:</strong> +$0.10/cluster/hour (control plane).</li>
                  <li><strong>Azure AKS:</strong> Free control plane (included).</li>
                  <li><strong>Google GKE:</strong> Free control plane for one cluster, then charges apply.</li>
                </ul>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Calculate cluster cost:</strong> (Control plane fee + per-node cost × number of nodes) × 730 hours/month.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Compare across node sizes.</strong> Re-apply filters for 2-vCPU (dev clusters) and 8-vCPU (production) to see how pricing scales.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Create a comparison sheet</strong> with dev, staging, and production cluster costs for each provider.
              </li>
            </ol>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-text)' }}>
              <strong>💡 Tip:</strong> Also check the <strong>Serverless</strong> tab for <strong>Cloud Run / Fargate / App Engine</strong> if you're considering a serverless container approach. Many teams find these cheaper than managing Kubernetes clusters for variable workloads.
            </p>

            <BackToTop />
          </div>

          {/* Datacenters */}
          <div className="docs-section">
            <CopyHeading id="datacenters">Datacenters</CopyHeading>
            <p>
              The <strong>Datacenters</strong> page is a dedicated infrastructure reference that lets you compare the global physical footprint of each cloud provider side by side — independently of pricing. It is designed to help teams evaluate geographic reach, redundancy posture, and regulatory coverage before committing to a cloud strategy.
            </p>
            <p>
              Unlike the pricing categories, this page does not connect to a live database. All data is sourced manually from each provider's official public infrastructure pages and verified periodically.
            </p>

            <h3 id="datacenter-data-sources">Data sources</h3>
            <p>
              Each figure on the page — region count, Availability Zone count, edge locations, countries served, and government cloud regions — is drawn directly from the provider's own published documentation:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.4rem' }}><strong>AWS</strong> — <a href="https://aws.amazon.com/about-aws/global-infrastructure/" target="_blank" rel="noopener noreferrer">AWS Global Infrastructure</a>, <a href="https://aws.amazon.com/about-aws/global-infrastructure/regions_az/" target="_blank" rel="noopener noreferrer">Regions &amp; Availability Zones</a></li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Azure</strong> — <a href="https://azure.microsoft.com/en-us/explore/global-infrastructure/" target="_blank" rel="noopener noreferrer">Azure Global Infrastructure</a>, <a href="https://azure.microsoft.com/en-us/explore/global-infrastructure/geographies/" target="_blank" rel="noopener noreferrer">Azure Geographies</a></li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Google Cloud</strong> — <a href="https://cloud.google.com/about/locations" target="_blank" rel="noopener noreferrer">Google Cloud Locations</a>, <a href="https://cloud.google.com/infrastructure" target="_blank" rel="noopener noreferrer">Google Network Infrastructure</a></li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Oracle Cloud</strong> — <a href="https://www.oracle.com/cloud/architecture-and-regions/" target="_blank" rel="noopener noreferrer">OCI Cloud Regions</a>, <a href="https://www.oracle.com/cloud/public-cloud-regions/infrastructure/" target="_blank" rel="noopener noreferrer">OCI Infrastructure</a></li>
              <li style={{ marginBottom: '0.4rem' }}><strong>DigitalOcean</strong> — <a href="https://docs.digitalocean.com/products/platform/availability-matrix/" target="_blank" rel="noopener noreferrer">Regional Availability</a></li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Alibaba Cloud</strong> — <a href="https://www.alibabacloud.com/global-locations" target="_blank" rel="noopener noreferrer">Alibaba Cloud Global Infrastructure</a></li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Cloudflare</strong> — <a href="https://www.cloudflare.com/network/" target="_blank" rel="noopener noreferrer">Cloudflare Global Network</a></li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Vultr</strong> — <a href="https://www.vultr.com/locations/" target="_blank" rel="noopener noreferrer">Vultr Global Infrastructure</a></li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Hetzner</strong> — <a href="https://www.hetzner.cloud/locations" target="_blank" rel="noopener noreferrer">Hetzner Cloud Locations</a></li>
            </ul>
            <p>
              Source links are also reproduced at the bottom of the Datacenters page itself, grouped by provider.
            </p>

            <h3 id="datacenter-accuracy">Accuracy &amp; freshness</h3>
            <p>
              Infrastructure figures change frequently as providers expand. Counts shown on the page reflect a manually verified snapshot — the "Last verified" date is displayed at the bottom of the Datacenters page. Key caveats:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.4rem' }}><strong>Announced regions</strong> are regions the provider has publicly committed to launching but that are not yet generally available. They are marked with an amber indicator and shown as "Planned" in expanded rows.</li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Edge locations</strong> (CDN/PoP nodes) are approximate — providers use different terminology and update counts frequently. Figures are rounded.</li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Government cloud regions</strong> may have restricted access and are not always open to all customers. Counts refer to publicly announced dedicated compliance regions.</li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Region coordinates</strong> on the world map are approximate and intended for geographic orientation only, not precise geolocation.</li>
            </ul>
            <blockquote>
              <strong>Important:</strong> Always verify current infrastructure availability directly with the provider before making architecture or compliance decisions.
            </blockquote>

            <BackToTop />
          </div>

          {/* Pricing Data */}
          <div className="docs-section">
            <CopyHeading id="pricing-data">Pricing Data</CopyHeading>

            <h3 id="sources">Data sources</h3>
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

            <h3 id="price-trends">Price Trends</h3>
            <p>
              The application tracks historical price changes across ingestion runs. When viewing the pricing tables, you will see an indicator next to the price: a red up arrow (▲) if the price increased, a green down arrow (▼) if the price decreased, or a grey dot (●) if the price remained unchanged. This allows you to quickly spot pricing shifts and volatility across cloud providers.
            </p>

            <h3 id="accuracy">Accuracy &amp; freshness</h3>
            <p>
              Prices are directional and intended for high-level comparison only. Always verify final
              pricing on the official provider calculator before making purchasing decisions.
            </p>
            <p>
              <strong>Comprehensive Coverage & Missing Services:</strong> This application is not meant to be a comprehensive catalog of all offerings across all cloud providers. We consolidate data in good faith based on publicly available pricing pages and APIs, but we may inadvertently omit certain services, instance types, or product categories that cloud providers currently offer. If you represent a cloud provider or are a user who detects that a specific service or offering is missing or misrepresented, we welcome your feedback. Please reach out to us so we can continuously improve the accuracy and completeness of our platform.
            </p>
            <blockquote>
              <strong>Disclaimer:</strong> Price data may be delayed, incomplete, or imprecise.
              comparecloudcosts.com makes no warranties regarding accuracy. See our{' '}
              <Link href="/terms">Terms of Use</Link> for full details.
            </blockquote>

            <BackToTop />
          </div>

          {/* Glossary */}
          <div className="docs-section">
            <CopyHeading id="glossary">Glossary</CopyHeading>
            <p>The following terms are used throughout the platform. Hovering the <strong>ⓘ</strong> icon next to any term on the Datacenters page will also surface its definition inline.</p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Region</strong> — A geographic cluster of data centers in a specific physical location. Each region is completely independent and isolated from failures in other regions. Providers typically publish regions as named locations (e.g. "US East (N. Virginia)", "West Europe").
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Availability Zone (AZ)</strong> — One or more discrete data centers within a region, each with redundant power, networking, and connectivity. Deploying resources across multiple Availability Zones in the same region allows applications to survive a single data center outage. DigitalOcean does not use traditional Availability Zones — each of its regions maps to a single data center.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Edge Location</strong> — A smaller point-of-presence (PoP) node used for content delivery (CDN) and low-latency services such as DNS, DDoS protection, and WAF. Edge locations are distinct from full compute regions and are not independently deployable as compute environments.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Government Cloud</strong> — Dedicated, isolated cloud regions operated specifically to meet government compliance requirements (e.g. FedRAMP High, IL4/IL5 in the US, UK OFFICIAL). Access is typically restricted to vetted public sector customers.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>On-Demand pricing</strong> — Pay-as-you-go pricing with no upfront commitment. All prices on this platform are on-demand unless explicitly stated otherwise. Reserved, spot, savings plan, or committed-use discounts are not included.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>vCPU</strong> — Virtual CPU. A logical compute unit mapped to a physical processor thread. Oracle Cloud uses OCPUs (one OCPU = 2 vCPUs); this platform normalizes all values to vCPUs for consistency.
              </li>
            </ul>
            <BackToTop />
          </div>

          {/* Filters */}
          <div className="docs-section">
            <CopyHeading id="filters">Filters</CopyHeading>

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
            <CopyHeading id="sharing">Sharing</CopyHeading>
            <p>
              Use the <strong>Share</strong> buttons in the top bar to share a link to the tool on X
              (Twitter) or LinkedIn.
            </p>
            <BackToTop />
          </div>

          {/* Advertising */}
          <div className="docs-section">
            <CopyHeading id="advertising">Advertising with Us</CopyHeading>
            <p>
              comparecloudcosts.com puts your brand in front of engineers, architects, and technical
              decision-makers actively comparing cloud pricing and evaluating infrastructure choices — a
              highly qualified audience at the exact moment they're making buying decisions.
            </p>
            <p>
              Sponsorship slots are available on the <Link href="/datacenters">Datacenters</Link> page,
              the <Link href="/workloads">Workloads</Link> catalog, and individual workload pages — so you
              can target a broad audience or a specific architecture pattern relevant to your product (for
              example, a security vendor sponsoring the Compliance-Ready Web Application workload).
            </p>
            <h3 id="advertising-specs">Image Specs</h3>
            <p>
              All sponsor placements use a single shared banner spec, so one asset works across every slot:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.4rem' }}><strong>Dimensions:</strong> 1200 × 200px (6:1 aspect ratio)</li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Retina asset:</strong> 2400 × 400px recommended</li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Format:</strong> PNG, JPG, or WebP</li>
              <li style={{ marginBottom: '0.4rem' }}>Images render responsively (scaled to the container width, aspect ratio preserved), so avoid placing critical text near the edges.</li>
            </ul>
            <p>
              For reference, this is close to LinkedIn's Company Page cover image ratio (1128 × 191px,
              ~5.9:1) — if you already have a LinkedIn banner asset, it will likely need only minor
              cropping to fit.
            </p>
            <p>
              Interested in sponsoring? Reach out at{' '}
              <a href="mailto:hello@comparecloudcosts.com">hello@comparecloudcosts.com</a>.
            </p>
            <BackToTop />
          </div>

          {/* Contributing */}
          <div className="docs-section">
            <CopyHeading id="contributing--feedback">Contributing &amp; Feedback</CopyHeading>
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
