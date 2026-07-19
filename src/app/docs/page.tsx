'use client';
import React from 'react';
import Link from 'next/link';
import { Footer, Sidebar, PRODUCT_TYPE_ICONS, EXTRA_LINK_ICONS } from "@/components";

// JSX tag names can't be computed/bracket member expressions, so alias the
// hyphenated-key icons to plain identifiers for use as <Icon /> in headings below.
const AppHostingIcon = PRODUCT_TYPE_ICONS['app-hosting'];
const DataAnalyticsIcon = PRODUCT_TYPE_ICONS['data-analytics'];

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
          top: 0;
          height: calc(100vh - 48px);
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
          max-width: 1200px;
          line-height: 1.7;
          font-size: 0.9375rem;
        }
        .docs-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.8125rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        .docs-table th {
          background-color: var(--sidebar-bg);
          color: var(--text-color);
          font-weight: 700;
          text-align: left;
          padding: 0.75rem 1rem;
          border-bottom: 2px solid var(--border-color);
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
        .docs-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-color);
          line-height: 1.5;
        }
        .docs-table tr:last-child td {
          border-bottom: none;
        }
        .docs-table tr:nth-child(even) {
          background-color: rgba(238, 240, 252, 0.3);
        }
        @media (prefers-color-scheme: dark) {
          .docs-table tr:nth-child(even) {
            background-color: rgba(12, 12, 30, 0.3);
          }
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
        .docs-wrapper footer {
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

      <div className="docs-wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar activeProductType={'docs' as any} />
        <div className="flex-1 min-w-0 overflow-y-auto flex flex-col">
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
                  <li><a href="#gpu" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>GPU</a></li>
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
                <a href="#certifications" style={{ padding: '3px 0' }}>Certifications</a>
                <ul style={{ listStyle: 'none', paddingLeft: '0.875rem', margin: '2px 0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <li><a href="#certifications-filters" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Filters</a></li>
                  <li><a href="#certifications-accuracy" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Accuracy &amp; freshness</a></li>
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
              <li><a href="#filters" style={{ padding: '3px 0' }}>Filters</a></li>
              <li><a href="#sharing" style={{ padding: '3px 0' }}>Sharing</a></li>
              <li>
                <a href="#advertising" style={{ padding: '3px 0' }}>Advertising with Us</a>
                <ul style={{ listStyle: 'none', paddingLeft: '0.875rem', margin: '2px 0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <li><a href="#advertising-specs" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Image Specs</a></li>
                  <li><a href="#advertising-tracking" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Link Tracking</a></li>
                  <li><a href="#advertising-exclusivity" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Sponsorship Exclusivity</a></li>
                  <li><a href="#advertising-csv-downloads" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>CSV Downloads</a></li>
                  <li><a href="#advertising-analytics" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Site Analytics &amp; Tracking</a></li>
                  <li><a href="#advertising-prices" style={{ fontSize: '0.8125rem', padding: '2px 0' }}>Prices</a></li>
                </ul>
              </li>
              <li><a href="#contributing--feedback" style={{ padding: '3px 0' }}>Contributing &amp; Feedback</a></li>
              <li><a href="#data-dictionary" style={{ padding: '3px 0' }}>Data Dictionary</a></li>
              <li><a href="#glossary" style={{ padding: '3px 0' }}>Glossary</a></li>
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
              Compare Cloud Costs is a free, open-source tool. It aggregates and normalizes on-demand
              (pay-as-you-go) pricing across AWS, Microsoft Azure, Google Cloud, Oracle Cloud,
              DigitalOcean, and Alibaba Cloud, plus 8 specialized providers, into one **cloud cost comparison** side-by-side view.
            </p>
            <p>
              Use the <strong>product tabs</strong> at the top to switch between categories: AI &amp; Machine Learning,
              App Hosting, Certificates, Containers, Databases, Data &amp; Analytics, GPU, Inference, Networking, Search, Storage, Time-Series, Graph, and more.
            </p>
            <p>
              Use the <strong>filter sidebar</strong> on the left to narrow results by provider,
              geography, instance specs, and product-specific attributes. This allows you to generate a tailored **cloud server pricing comparison** in seconds.
            </p>
            <BackToTop />
          </div>

          {/* Product Categories */}
          <div className="docs-section">
            <CopyHeading id="product-categories">Product Categories</CopyHeading>

            <h3 id="ai-machine-learning"><PRODUCT_TYPE_ICONS.ai size={18} className="inline align-text-bottom mr-1" /> <Link href="/?product=ai">AI &amp; Machine Learning</Link></h3>
            <p>
              Compares managed AI foundation models and APIs (e.g., GPT-4, Claude 3, Gemini 1.5, Llama 3). Filter by context window size, multimodal capabilities, and compare input/output pricing per 1M tokens to optimize your **AI API costs**.
            </p>

            <h3 id="app-hosting"><AppHostingIcon size={18} className="inline align-text-bottom mr-1" /> <Link href="/?product=app-hosting">App Hosting</Link></h3>
            <p>
              Covers managed application hosting and Platform-as-a-Service offerings (App Service, App Engine, Heroku, etc.). Compare by compute tier, operating system, and architecture.
            </p>

            <h3 id="containers"><PRODUCT_TYPE_ICONS.containers size={18} className="inline align-text-bottom mr-1" /> <Link href="/?product=containers">Containers</Link></h3>
            <p>
              Covers container infrastructure across two subsections: (1) **Orchestration**: managed container runtimes including Kubernetes node pools (**AWS EKS vs Azure AKS vs GCP GKE** node cost comparisons) and serverless container platforms (Fargate, Cloud Run, ACI). (2) **Container Registries**: private image repositories for storing, managing, and deploying container images (**AWS ECR vs Azure ACR vs Google Artifact Registry**). Filter by service type, orchestrator, architecture (x86 or ARM), and billing granularity.
            </p>

            <h3 id="databases"><PRODUCT_TYPE_ICONS.database size={18} className="inline align-text-bottom mr-1" /> <Link href="/?product=database">Databases</Link></h3>
            <p>
              Covers managed relational, NoSQL, and In-memory database services (**AWS RDS vs Azure SQL vs Google Cloud SQL** PostgreSQL/MySQL pricing). Filter by database family, engine, deployment type (Single AZ, Multi-AZ,
              Serverless), and HA mode.
            </p>

            <h3 id="data--analytics"><DataAnalyticsIcon size={18} className="inline align-text-bottom mr-1" /> <Link href="/?product=data-analytics">Data &amp; Analytics</Link></h3>
            <p>
              Covers managed data warehouse and analytics services (Redshift, BigQuery, Synapse,
              Snowflake, Databricks, and native cloud-provider offerings). Filter by engine,
              deployment type, and service tier.
            </p>

            <h3 id="gpu"><PRODUCT_TYPE_ICONS.gpu size={18} className="inline align-text-bottom mr-1" /> <Link href="/?product=gpu">GPU</Link></h3>
            <p>
              Compares GPU accelerator pricing for machine learning training, scientific computing, and rendering workloads. Covers single and multi-GPU instance configurations across providers. Filter by GPU model (A100, H100, RTX, V100, L4, etc.), GPU count, and system specs (vCPU, memory) to find the most cost-effective GPU infrastructure for your workload.
            </p>

            <h3 id="networking"><PRODUCT_TYPE_ICONS.networking size={18} className="inline align-text-bottom mr-1" /> <Link href="/?product=networking">Networking</Link></h3>
            <p>
              Compares data transfer, VPC, load balancing, VPN, NAT gateway, and dedicated connection
              pricing. Supports filtering by service type, connection type, routing, and direction
              (egress/ingress).
            </p>

            <h3 id="serverless"><PRODUCT_TYPE_ICONS.serverless size={18} className="inline align-text-bottom mr-1" /> <Link href="/?product=serverless">Serverless</Link></h3>
            <p>
              Compares function-as-a-service pricing (AWS Lambda, Azure Functions, Google Cloud
              Functions, etc.) alongside integration services like API Gateways, Messaging Queues, Event Buses, and Workflows. Key attributes include supported runtimes, cold start behavior, billing granularity, and memory configuration.
            </p>

            <h3 id="storage"><PRODUCT_TYPE_ICONS.storage size={18} className="inline align-text-bottom mr-1" /> <Link href="/?product=storage">Storage</Link></h3>
            <p>
              Compares object, block, and file storage pricing (**AWS S3 vs Azure Blob vs GCP Cloud Storage price per GB**). Filter by storage type, performance tier, redundancy (LRS, ZRS, GRS), and media type.
            </p>

            <h3 id="virtual-machines"><PRODUCT_TYPE_ICONS.vm size={18} className="inline align-text-bottom mr-1" /> <Link href="/?product=compute">Virtual Machines</Link></h3>
            <p>
              Compares compute instances across providers (**AWS EC2 vs Azure VM vs GCP Compute Engine**). Filter by operating system, CPU
              vendor/architecture, GPU support, and instance category (General Purpose, Compute
              Optimized, Memory Optimized, etc.). All prices are hourly, on-demand, Linux-based
              unless otherwise noted.
            </p>

            <h3 id="time-series-databases">⏱️ Time-Series Databases</h3>
            <p>
              Specialized databases for time-stamped, sequential data (metrics, sensors, financial ticks, logs). Compare **AWS Timestream vs Azure Data Explorer vs GCP Bigtable** with pricing models for writes, reads, and storage tiers. Optimized for real-time analytics and retention policies.
            </p>

            <h3 id="graph-databases">🔗 Graph Databases</h3>
            <p>
              Databases optimized for relationships, networks, and complex queries. Compare **AWS Neptune vs Azure Cosmos DB (Gremlin) vs Oracle Graph** for social graphs, recommendation engines, identity graphs, and knowledge bases. Pricing varies by instance size and storage.
            </p>

            <h3 id="search-engines">🔍 Search Engines</h3>
            <p>
              Full-text search, analytics, and log aggregation. Compare **AWS OpenSearch vs Azure Cognitive Search vs GCP Cloud Search** for indexing, querying, and scaling distributed search clusters across providers.
            </p>

            <h3 id="certificate-management">🔐 Certificate Management</h3>
            <p>
              Public and private certificate authorities, SSL/TLS management, and lifecycle automation. Compare **AWS Certificate Manager vs Azure Key Vault vs GCP Certificate Authority** for managed certificates, private CAs, and auto-renewal features.
            </p>

            <h3 id="inference-endpoints">🤖 Inference Endpoints</h3>
            <p>
              Model serving platforms for deploying trained ML models to production. Compare **AWS SageMaker vs Azure Machine Learning vs GCP Vertex AI** for real-time and batch inference, with pricing for compute instances (CPU/GPU) and storage. Separate from model training.
            </p>

            <BackToTop />
          </div>

          {/* Workloads */}
          <div className="docs-section">
            <CopyHeading id="workloads">Workloads</CopyHeading>
            <p>
              The <Link href="/workloads"><EXTRA_LINK_ICONS.workloads size={16} className="inline align-text-bottom mr-1" />Workloads</Link> page lets you price end-to-end cloud architectures instead of just individual components. We've defined common application patterns and their component requirements. By adjusting scale parameters, the tool automatically calculates necessary resource specs and queries the cheapest matching instances across all providers.
            </p>
            <p><strong>Available workloads:</strong></p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                ⚡ <Link href="/workloads/serverless-web-app" style={{ color: 'var(--link-color)', textDecoration: 'none' }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}>
                  Serverless Web Application
                </Link> — Event-driven backends for web and mobile apps. Ideal for variable workloads and reduced operational overhead.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                🏢 <Link href="/workloads/3-tier-web" style={{ color: 'var(--link-color)', textDecoration: 'none' }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}>
                  Classic 3-Tier Web Architecture
                </Link> — The foundational blueprint for traditional web applications using VMs and relational databases. Scales from hundreds to thousands of concurrent users.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                🌊 <Link href="/workloads/streaming-analytics" style={{ color: 'var(--link-color)', textDecoration: 'none' }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}>
                  Real-time Streaming Analytics
                </Link> — High-throughput data pipelines for IoT telemetry, clickstreams, and financial data processing.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                🛒 <Link href="/workloads/ecommerce-microservices" style={{ color: 'var(--link-color)', textDecoration: 'none' }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}>
                  E-Commerce Microservices Stack
                </Link> — A decoupled, highly available architecture for product catalogs and transactions. Built for fast lookups and fault tolerance.
              </li>
            </ul>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted-text)' }}>
              See the full list and build your own configuration on the <Link href="/workloads">Workloads page</Link>.
            </p>

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
            <ol style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem', listStyleType: 'decimal', listStylePosition: 'outside' }}>
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
            <blockquote>
              <strong>💡 Tip:</strong> Repeat this comparison at 5,000 and 10,000 concurrent users by increasing vCPU/memory filters. You'll see how scaling costs differ across providers — some remain linear, while others show volume discounts or better pricing at larger sizes.
            </blockquote>

            <h3 id="use-case-2">Use Case 2: Multi-Region Disaster Recovery Architecture</h3>
            <p>
              <strong>Scenario:</strong> You need to set up a disaster recovery (DR) backup in a different geographic region. You want to compare both primary and backup region costs across Storage (for backups) and Networking (for data replication).
            </p>
            <p><strong>Steps:</strong></p>
            <ol style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem', listStyleType: 'decimal', listStylePosition: 'outside' }}>
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
            <blockquote>
              <strong>💡 Tip:</strong> Use the <strong>Aggregate View</strong> toggle (in the toolbar) to collapse results by instance type and see min/max/avg pricing. This makes it easier to spot which provider offers the best value across regions.
            </blockquote>

            <h3 id="use-case-3">Use Case 3: Containerized Workload Scaling on Kubernetes</h3>
            <p>
              <strong>Scenario:</strong> You're migrating a Docker-based application to Kubernetes and need to compare the per-node cost of different providers' managed Kubernetes services (EKS, GKE, AKS, DOKS, OKE).
            </p>
            <p><strong>Steps:</strong></p>
            <ol style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem', listStyleType: 'decimal', listStylePosition: 'outside' }}>
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
            <blockquote>
              <strong>💡 Tip:</strong> Also check the <strong>Serverless</strong> tab for <strong>Cloud Run / Fargate / App Engine</strong> if you're considering a serverless container approach. Many teams find these cheaper than managing Kubernetes clusters for variable workloads.
            </blockquote>

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

          {/* Certifications */}
          <div className="docs-section">
            <CopyHeading id="certifications">Certifications &amp; Regulations</CopyHeading>
            <p>
              The <Link href="/certifications"><EXTRA_LINK_ICONS.certifications size={16} className="inline align-text-bottom mr-1" />Certifications &amp; Regulations</Link> page compares the compliance posture of each cloud provider side by side — which security, privacy, industry, and government certifications they hold — independently of pricing. It covers standards such as ISO&nbsp;27001/27017/27018/27701/22301/20000-1/42001, SOC&nbsp;1/2/3, PCI&nbsp;DSS, HIPAA, FedRAMP High/Moderate, CSA&nbsp;STAR, FIPS&nbsp;140-2, HITRUST, NIST&nbsp;800-171, GDPR, IRAP, C5, ENS, MTCS, and ISMAP.
            </p>
            <p>
              Like the Datacenters page, this data is curated manually from each provider's official compliance documentation rather than a live database — a missing certification means "not found in that provider's published docs at verification time," not necessarily that it is unavailable.
            </p>
            <p>
              Importantly, the page tracks a <strong>curated set of widely-recognized standards</strong> chosen so providers can be compared side by side — it is <strong>not</strong> an exhaustive list. The largest clouds hold far more (AWS advertises 140+ certifications and attestations, Azure 100+). For a provider's complete, authoritative catalog, use its <strong>trust center</strong> — every provider's is linked at the bottom of the Certifications page.
            </p>

            <h3 id="certifications-filters">Filters</h3>
            <p>
              Tiles are provider-centric — each provider shows the certifications it holds, with every certification name linking to a definition of the standard. Three filters narrow the view:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.4rem' }}><strong>Provider</strong> — limit the tiles to specific providers.</li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Region</strong> — uses the same geography buckets as the pricing pages; regional standards (e.g. IRAP, C5, ENS, MTCS) appear only when their jurisdiction is selected, while globally recognized standards always show.</li>
              <li style={{ marginBottom: '0.4rem' }}><strong>Certification</strong> — a cross-filter: selecting one or more certifications <em>disables</em> any provider that lacks them, answering questions like "which providers qualify for FedRAMP High?"</li>
            </ul>

            <h3 id="certifications-accuracy">Accuracy &amp; freshness</h3>
            <p>
              Compliance status changes rarely (roughly annually), so the matrix is re-verified against each provider's official compliance page about every six months. The "Last verified" date and the per-provider source links are shown at the bottom of the page. Key caveats:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.4rem' }}>Certification names link to a <strong>definition</strong> of the standard (Wikipedia or the standard body); the provider's own compliance page — linked at the bottom of the page — is the source of truth for who holds what.</li>
              <li style={{ marginBottom: '0.4rem' }}>Some entries are intentionally <strong>conservative</strong> — where a provider's page did not clearly confirm a certification, it is left off rather than assumed.</li>
            </ul>
            <blockquote>
              <strong>Important:</strong> This page is for general comparison only and is not legal or compliance advice. Always confirm a provider's current certifications directly with the provider before relying on them.
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
            <p>
              The data on this platform serves as a <strong>directional indicator</strong> — a sample of popular
              instances designed to highlight architectural cost differences across clouds — not a substitute for
              an official quote. Always verify your final estimates using the official calculators or pricing pages:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://calculator.aws/" target="_blank" rel="noopener noreferrer">AWS Pricing Calculator</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://azure.microsoft.com/en-us/pricing/calculator/" target="_blank" rel="noopener noreferrer">Azure Pricing Calculator</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://cloud.google.com/products/calculator" target="_blank" rel="noopener noreferrer">Google Cloud Pricing Calculator</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://www.oracle.com/cloud/costestimator.html" target="_blank" rel="noopener noreferrer">Oracle Cloud Cost Estimator</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://www.digitalocean.com/pricing" target="_blank" rel="noopener noreferrer">DigitalOcean Pricing</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://www.alibabacloud.com/pricing-calculator" target="_blank" rel="noopener noreferrer">Alibaba Cloud Pricing Calculator</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://developers.cloudflare.com/workers/platform/pricing/" target="_blank" rel="noopener noreferrer">Cloudflare Workers Pricing</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://openai.com/api/pricing/" target="_blank" rel="noopener noreferrer">OpenAI API Pricing</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://www.anthropic.com/pricing" target="_blank" rel="noopener noreferrer">Anthropic Pricing</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://www.pinecone.io/pricing/" target="_blank" rel="noopener noreferrer">Pinecone Pricing</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://qdrant.tech/pricing/" target="_blank" rel="noopener noreferrer">Qdrant Pricing</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://zilliz.com/pricing" target="_blank" rel="noopener noreferrer">Zilliz Cloud (Milvus) Pricing</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://weaviate.io/pricing" target="_blank" rel="noopener noreferrer">Weaviate Pricing</a></li>
              <li style={{ marginBottom: '0.4rem' }}><a href="https://www.trychroma.com/pricing" target="_blank" rel="noopener noreferrer">Chroma Pricing</a></li>
            </ul>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted-text)' }}>
              Not every provider above publishes an interactive calculator — for those (Cloudflare, and the
              vector database providers), the link goes to their official pricing page instead.
            </p>
            <blockquote>
              <strong>Disclaimer:</strong> Price data may be delayed, incomplete, or imprecise.
              comparecloudcosts.com makes no warranties regarding accuracy. See our{' '}
              <Link href="/terms">Terms of Use</Link> for full details.
            </blockquote>

            <BackToTop />
          </div>

          {/* Filters */}
          <div className="docs-section">
            <CopyHeading id="filters">Filters</CopyHeading>
            <p>
              Users have the ability to filter every product category on the platform — narrow results
              by provider, region, specs, price, and category-specific attributes to zero in on exactly
              the comparison you need. To see these filters applied in a real, multi-category workflow,
              check out the <Link href="/docs#use-cases">Use Cases &amp; Step-by-Step Comparisons</Link>{' '}
              section above.
            </p>

            <h3 id="provider">Provider</h3>
            <p>
              Checkbox list to include or exclude specific cloud providers (AWS, Azure, GCP, Oracle,
              DigitalOcean, Alibaba Cloud, and category-specific providers like OpenAI, Anthropic,
              Cloudflare, or the vector database providers). Multi-select — narrow to one provider or
              compare a custom subset.
            </p>

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

            <h3 id="category-specific-filters">Category-Specific Filters</h3>
            <p>
              Beyond the universal filters above, each product category exposes its own additional
              attribute filters in the sidebar — for example, GPU and CPU vendor for Virtual Machines;
              Database Engine, Deployment type, and High-Availability mode for Databases; Context Window
              and Multimodal support for AI &amp; Machine Learning; Cold Start, Timeout, and Execution
              Model for Serverless; Orchestrator and Architecture for Containers; Connection Type,
              Routing Type, and Direction for Networking; and Redundancy and Media type for Storage. See
              the <Link href="/docs#product-categories">Product Categories</Link> section above for what
              each category covers.
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
              Compare Cloud Costs puts your brand in front of engineers and architects who are actively
              comparing cloud pricing — the moment they're deciding what to buy.
            </p>
            <p>
              Sponsorship slots are available on individual workload pages. Additionally, your brand is displayed across the
              <Link href="/datacenters"> Datacenters</Link> page, the <Link href="/workloads">Workloads</Link> catalog, and inside the CSV file when a user downloads the workload comparison from a page your company sponsors. As a fifth place of brand visibility, all active sponsors are featured on our dedicated <Link href="/sponsors">Sponsors</Link> page.
              This inclusion gives you a dedicated card featuring your company logo, a brief description (up to 500 characters), and a direct link to your sponsored page or product.
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
            <blockquote>
              <strong>💡 Tip:</strong> Your banner can include a call to action tailored to your goal —
              whether that's driving traffic to a landing page or to your company's main site. You can
              also swap your banner for a new one at least once a month; just send us the replacement
              asset and we'll have it live within 3 business days.
            </blockquote>
            <h3 id="advertising-tracking">Link Tracking</h3>
            <p>
              Please note that we do not offer native click-through rate (CTR) tracking or analytics on our end.
              Sponsors are responsible for providing their own trackable destination links (e.g., using UTM parameters,
              Bitly, or other custom redirect services) to measure the performance of their campaigns.
            </p>
            <h3 id="advertising-exclusivity">Sponsorship Exclusivity</h3>
            <p>
              We want to ensure that our sponsors get high-quality visibility without competing offerings cluttering their space.
              To achieve this, we apply different levels of exclusivity depending on the page you choose to sponsor:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.4rem' }}>
                <strong>Individual Workload Pages (Exclusive):</strong> If you sponsor a specific workload (e.g., a three-tier web application), that space is <strong>exclusive</strong> to you. We will not allow a direct competitor (e.g., another consulting company offering the same services) to advertise on that same page.
              </li>
              <li style={{ marginBottom: '0.4rem' }}>
                <strong>Global Pages (Shared / Carousel):</strong> On high-traffic aggregator pages such as the main <strong>Workloads</strong> page, the <strong>Compliance</strong> page, and the <strong>Datacenters</strong> page, sponsor banners are displayed in a rotating carousel. These spaces are non-exclusive and may feature multiple sponsors.
              </li>
            </ul>

            <h3 id="advertising-csv-downloads">Sponsorship in CSV Downloads</h3>
            <p>
              When users download a pricing comparison CSV from a workload page, the file includes a header section with the workload name, generation timestamp, and pricing model used. If the workload has an active sponsor, the CSV header displays the sponsor company name and a link to learn more. If the workload is unsponsored, the header includes information about sponsorship opportunities and how to get involved.
            </p>
            <p>
              This ensures that sponsors receive brand exposure at download time — reaching users who are actively exporting and analyzing cloud cost data — while unsponsored workloads serve as a soft call-to-action for potential sponsors.
            </p>

            <h3 id="advertising-analytics">Site Analytics & Tracking</h3>
            <p>
              We use <a href="https://clarity.microsoft.com/" target="_blank" rel="noopener noreferrer">Microsoft Clarity</a> to track
              how users interact with the site — including page views, engagement metrics, click patterns, and device/browser data.
              This helps us understand audience behavior and measure the effectiveness of sponsor placements.
              All analytics are anonymized and aggregated; individual user data is never shared with sponsors.
            </p>
            <p>
              When evaluating a sponsorship opportunity, you can review our <Link href="/sponsors">Sponsors</Link> page,
              which features high-level audience metrics including traffic volume, user roles, geographic distribution,
              engagement depth, and platform breakdown — allowing you to make an informed decision about sponsorship ROI.
            </p>

            <h3 id="advertising-prices">Prices</h3>
            <p>
              We offer flexible pricing options designed to fit different goals and budgets. Choose the tier that best suits your needs:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 1rem' }}>
              <li style={{ marginBottom: '0.4rem' }}><strong>$9.99/month or $99/year</strong> to have your brand in a workload page + sponsors page</li>
              <li style={{ marginBottom: '0.4rem' }}><strong>$12.99/month or $119/year</strong> to have your brand in a workload page + sponsors page + a carousel in the main workload page</li>
              <li style={{ marginBottom: '0.4rem' }}><strong>$15.99/month or $149/year</strong> to have your brand in a workload page + sponsors page + a carousel in the main workload, compliance, and datacenter page</li>
              <li style={{ marginBottom: '0.4rem' }}><strong>$19.99/month or $189/year</strong> to have your brand in a workload page + premium placement in the sponsors page + a carousel in the main workload, compliance, datacenter, and main blog post pages + a yearly sponsored blog post in <a href="https://comparecloudcosts.com/blog" target="_blank" rel="noopener noreferrer">https://comparecloudcosts.com/blog</a></li>
            </ul>

            <p style={{ marginTop: '1.5rem' }}>
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

          {/* Data Dictionary */}
          <div className="docs-section">
            <CopyHeading id="data-dictionary">Data Dictionary</CopyHeading>
            <p>
              This Data Dictionary provides a comprehensive breakdown of every product category, the specific columns displayed in their comparison tables, and the core definitions of their filters and parameters.
            </p>

            <h3 style={{ marginTop: '2rem' }}>1. Virtual Machines (VM)</h3>
            <p>General-purpose, compute-optimized, memory-optimized, or accelerator-backed virtual server instances.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Instance Type</strong></td>
                  <td>The unique provider-specific SKU identifier (e.g. <code>m5.large</code> on AWS, <code>Standard_D2s_v5</code> on Azure, <code>c2-standard-4</code> on GCP). Normalizes name profiles to facilitate direct comparisons.</td>
                </tr>
                <tr>
                  <td><strong>Category</strong></td>
                  <td>
                    Resource allocation classification profile:<br />
                    • <strong>Compute Optimized:</strong> Higher ratio of CPU cores relative to RAM, suited for web servers and batch processing.<br />
                    • <strong>General Purpose:</strong> Balanced CPU-to-RAM ratio, suited for standard application servers.<br />
                    • <strong>Memory Optimized:</strong> Higher ratio of RAM relative to CPU cores, suited for caching, analytics, and in-memory databases.<br />
                    • <strong>GPU Instance:</strong> Equipped with dedicated hardware accelerators (e.g. NVIDIA A100/H100) for machine learning training, rendering, and scientific simulation.<br />
                    • <strong>HPC:</strong> High-Performance Computing nodes configured for low-latency cluster interconnects.
                  </td>
                </tr>
                <tr>
                  <td><strong>vCPUs &amp; Memory</strong></td>
                  <td>The virtual processing cores and RAM capacity (in GB). Oracle Cloud’s OCPUs (which represent physical cores) are normalized to vCPUs (1 OCPU = 2 vCPUs) to ensure comparable capacity calculation.</td>
                </tr>
                <tr>
                  <td><strong>Operating System</strong></td>
                  <td>The OS configuration: <strong>Linux</strong> (standard license-free base pricing) vs. <strong>Windows</strong> (includes the developer OS licensing surcharge).</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>2. Databases</h3>
            <p>Managed relational servers, NoSQL document stores, cache layers, and vector indexes.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Database Engine</strong></td>
                  <td>The underlying database platform: <strong>Relational</strong> (PostgreSQL, MySQL, MariaDB, SQL Server, Oracle DB) vs. <strong>NoSQL</strong> (MongoDB, Cosmos DB, Cassandra) vs. <strong>In-Memory Cache</strong> (Redis, Valkey) vs. <strong>Vector Index</strong> (Pinecone, Milvus, Qdrant, Weaviate, Chroma).</td>
                </tr>
                <tr>
                  <td><strong>Deployment Type</strong></td>
                  <td>
                    Resource provisioning model:<br />
                    • <strong>Provisioned:</strong> Replicating a traditional VM host with fixed CPU/RAM ceilings.<br />
                    • <strong>Serverless:</strong> Dynamic compute units that automatically scale up/down or pause based on query traffic.
                  </td>
                </tr>
                <tr>
                  <td><strong>HA Mode</strong></td>
                  <td>
                    High-Availability cluster configuration:<br />
                    • <strong>Single AZ:</strong> A single active database node in one Availability Zone.<br />
                    • <strong>Multi AZ:</strong> An active primary database with a hot standby node synchronously replicated in a second zone.
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>3. Serverless</h3>
            <p>Event-driven Serverless Functions (FaaS) executed on demand.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Memory Config</strong></td>
                  <td>
                    How memory allocations are managed:<br />
                    • <strong>Configurable:</strong> Users explicitly configure the function memory limits (e.g. 128 MB up to 10 GB), which automatically scales virtual CPU allocation proportionally.<br />
                    • <strong>Automatic:</strong> The provider dynamically adjusts memory allocation per execution based on requirements, without manual settings.<br />
                    • <strong>Tiers:</strong> Predefined memory resource templates to select from.
                  </td>
                </tr>
                <tr>
                  <td><strong>Granularity</strong></td>
                  <td>The rounding increments of execution billing: <strong>1 ms</strong> billing (precise computation time, e.g. AWS Lambda) vs. <strong>100 ms</strong> billing (execution duration rounded up to the nearest 100ms increment).</td>
                </tr>
                <tr>
                  <td><strong>Timeout</strong></td>
                  <td>The maximum execution duration limit (e.g. 5 min, 10 min, 15+ min) before the platform terminates the executing thread.</td>
                </tr>
                <tr>
                  <td><strong>Provisioned Concurrency</strong></td>
                  <td>Pre-allocated warm environments maintained by the provider to eliminate function activation latency (cold starts).</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>4. Containers</h3>
            <p>Managed container control planes (Kubernetes), serverless container runners, and container image registries (repositories for storing and managing container images).</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Service Type</strong></td>
                  <td>
                    The container infrastructure function:<br />
                    • <strong>Orchestration:</strong> Managed container runtimes including Kubernetes node pools (AWS EKS, Azure AKS, GCP GKE) and serverless container platforms (AWS Fargate, GCP Cloud Run, Azure Container Apps).<br />
                    • <strong>Container Registry:</strong> Private image repositories for storing, managing, and deploying container images (AWS ECR, Azure ACR, Google Artifact Registry, Oracle Container Registry, DigitalOcean Container Registry, Alibaba Container Registry).
                  </td>
                </tr>
                <tr>
                  <td><strong>Pricing Model (Orchestration)</strong></td>
                  <td>
                    Compute allocation model:<br />
                    • <strong>Managed Nodes:</strong> Billed by the provisioned nodes/VMs that form the Kubernetes cluster.<br />
                    • <strong>Serverless Containers:</strong> Billed purely per vCPU-second and RAM-second consumed by active container replicas.
                  </td>
                </tr>
                <tr>
                  <td><strong>Orchestrator</strong></td>
                  <td>The control plane mechanism: <strong>Kubernetes</strong> (standard K8s clusters) vs. <strong>PaaS Container Runner</strong> (simplified orchestrators, hosting isolated containers without cluster nodes management).</td>
                </tr>
                <tr>
                  <td><strong>Registry Pricing Component</strong></td>
                  <td>
                    What you're being charged for in a container registry:<br />
                    • <strong>Storage (per GB/month):</strong> Cost for storing container images in the repository.<br />
                    • <strong>Data Transfer (per GB):</strong> Cost for pulling/pushing images across regions or to external systems.<br />
                    • <strong>API Operations:</strong> Cost per webhook call, registry scan, or API request (provider-specific).
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>5. Networking</h3>
            <p>Network routing, load balancing, tunnels, and data transfer egress.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Service Type</strong></td>
                  <td>Network infrastructure components: <strong>Load Balancers</strong> (L4 network / L7 application routing), <strong>NAT Gateway</strong> (outbound translation for private subnets), <strong>VPN</strong> (secure IPSec tunnels), <strong>CDN</strong> (edge static caching), or <strong>Data Transfer</strong> (egress).</td>
                </tr>
                <tr>
                  <td><strong>Direction</strong></td>
                  <td>The path direction of traffic: <strong>Inbound</strong> (ingress from internet - universally free) vs. <strong>Outbound</strong> (egress to internet or across cloud regions - billed at variable per-GB rates).</td>
                </tr>
                <tr>
                  <td><strong>Billing Model</strong></td>
                  <td>Pricing metrics structure: <strong>Hourly Base</strong> (base fee to run the load balancer/gateway endpoint) vs. <strong>Data Volume</strong> (cost per GB of data processed).</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>6. Data &amp; Analytics</h3>
            <p>Cloud data warehouses, streaming analytics, ETL utilities, and lakehouse storage.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Service Type</strong></td>
                  <td>Analytical engine types: <strong>Data Warehouse</strong> (OLAP databases, e.g. Snowflake, Redshift, BigQuery), <strong>ETL / Ingestion</strong> (pipelines, e.g. AWS Glue, Kinesis), or <strong>Lakehouse</strong> (querying files directly).</td>
                </tr>
                <tr>
                  <td><strong>Billing Metric</strong></td>
                  <td>How usage is billed: <strong>Compute Hours</strong> (billed per running node/instance) vs. <strong>Serverless Scan</strong> (billed per TB of data processed by queries).</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>7. GPU</h3>
            <p>Dedicated GPU accelerator instances for machine learning, scientific computing, graphics rendering, and high-performance computing.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>GPU Model</strong></td>
                  <td>The specific GPU accelerator type: <strong>NVIDIA</strong> (A100, H100, V100, L4, T4, RTX series) vs. <strong>AMD</strong> (MI300, MI250) vs. <strong>Google TPU</strong> (TPU v3, TPU v4). Each has different performance characteristics, memory, and pricing.</td>
                </tr>
                <tr>
                  <td><strong>GPU Count</strong></td>
                  <td>The number of GPUs attached to the instance (1–8 GPUs per instance, depending on provider and instance type). Pricing scales with GPU count.</td>
                </tr>
                <tr>
                  <td><strong>vCPUs &amp; Memory</strong></td>
                  <td>The host system's virtual processing cores and RAM capacity (in GB). GPU instances include both the GPU accelerators and the host CPU/memory for data I/O and orchestration.</td>
                </tr>
                <tr>
                  <td><strong>Operating System</strong></td>
                  <td>The OS configuration: <strong>Linux</strong> (standard license-free base pricing) vs. <strong>Windows</strong> (includes the developer OS licensing surcharge). Most GPU workloads run Linux.</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>8. Storage</h3>
            <p>Object buckets, VM block storage volumes, shared file systems, and archive tiers.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Storage Type</strong></td>
                  <td>Storage architecture: <strong>Object</strong> (API-driven bucket folders), <strong>Block</strong> (virtual SSD/HDD drives mounted to VMs), <strong>File</strong> (shared directories accessed by multiple VMs), or <strong>Archive</strong> (offline data storage).</td>
                </tr>
                <tr>
                  <td><strong>Access Tier</strong></td>
                  <td>
                    Storage temperature tiers:<br />
                    • <strong>Hot:</strong> Optimized for active, frequent read/writes. Highest storage cost, lowest access fees.<br />
                    • <strong>Cool / Warm:</strong> Optimized for data read less than once a month. Reduced storage cost, slight read/write access fee.<br />
                    • <strong>Cold / Archive:</strong> Long-term offline backups. Lowest storage cost, high access fee, retrieval times span minutes to hours.
                  </td>
                </tr>
                <tr>
                  <td><strong>Redundancy</strong></td>
                  <td>
                    Replication level:<br />
                    • <strong>LRS (Locally Redundant):</strong> Syncs 3 copies within a single data center. Protects against hardware failure.<br />
                    • <strong>ZRS (Zone Redundant):</strong> Syncs copies across 3 distinct zones/facilities in a region. Protects against zonal outages.<br />
                    • <strong>GRS (Geo-Redundant):</strong> Async replication to a secondary geographic region. Protects against region-wide disasters.
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>9. Artificial Intelligence (AI)</h3>
            <p>GenAI LLM endpoints, custom model training nodes, and vector search operations.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Service Type</strong></td>
                  <td>AI runtime function: <strong>Inference API</strong> (querying pre-trained LLMs, e.g. Claude, Llama, GPT) vs. <strong>Model Training</strong> (provisioning custom accelerator nodes).</td>
                </tr>
                <tr>
                  <td><strong>Billing Unit</strong></td>
                  <td>Billing metrics: <strong>Per 1M Tokens</strong> (volume-based billing for input/output prompts) vs. <strong>Accelerator Hour</strong> (compute-based billing for active GPU/TPU hours).</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>10. App Hosting</h3>
            <p>Fully managed Platform-as-a-Service (PaaS) app runners and app engines.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Hosting Tier</strong></td>
                  <td>The environment isolation: <strong>Hobby/Free</strong> (basic sandboxes, auto-sleeps), <strong>Shared</strong> (shared CPU resource, no sleeps), <strong>Dedicated</strong> (guaranteed dedicated vCPU/RAM), or <strong>Enterprise</strong> (fully isolated virtual network nodes).</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>11. Security &amp; Identity</h3>
            <p>Firewalls, IAM policies, encryption key management, secrets management, and runtime threat detection.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Security Type</strong></td>
                  <td>The protection layer: <strong>WAF</strong> (Web Application Firewall rules), <strong>IAM</strong> (Identity &amp; Access Management users), <strong>KMS</strong> (encryption key management and cryptographic operations), <strong>Secrets Management</strong> (API keys, database passwords, certificates storage &amp; rotation), <strong>DDoS Protection</strong> (mitigation shielding), or <strong>Threat Detection</strong> (active system monitoring).</td>
                </tr>
                <tr>
                  <td><strong>Billing Metric</strong></td>
                  <td>The billing dimensions: <strong>Per Rule/Policy</strong> (WAF rules), <strong>Per Key/Month</strong> (KMS active keys), <strong>Per Secret + Operations</strong> (Secrets Manager active secrets + API calls), <strong>Per GB Scanned</strong> (Threat Detection checking CloudTrail/System logs), or <strong>Per Host/Month</strong> (continuous server threat protection).</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>12. Integration</h3>
            <p>Managed message queues, publish-subscribe brokers, gateways, and workflows.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Integration Type</strong></td>
                  <td>Middleware broker type: <strong>Pub-Sub</strong> (topics for fan-out), <strong>Message Queue</strong> (point-to-point queues), <strong>Event Bus</strong> (routing buses), or <strong>API Gateway</strong> (access endpoint mapping).</td>
                </tr>
                <tr>
                  <td><strong>Billing Unit</strong></td>
                  <td>Performance metrics: <strong>Per Million Messages</strong> (event traffic volume) vs. <strong>Connection Hour</strong> (persistent web sockets billing).</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>13. Time-Series Databases</h3>
            <p>Optimized databases for timestamped, sequential data at scale (metrics, sensors, financial data).</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Engine</strong></td>
                  <td>The time-series database engine: <strong>Timestream</strong> (AWS), <strong>Kusto</strong> (Azure Data Explorer), <strong>Bigtable</strong> (GCP NoSQL), <strong>TimescaleDB</strong> (PostgreSQL extension), or proprietary offerings.</td>
                </tr>
                <tr>
                  <td><strong>Billing Model</strong></td>
                  <td>Pricing structure: <strong>Capacity Units</strong> (write/read units per hour), <strong>Hourly Cluster</strong> (cluster node hours), <strong>Serverless</strong> (pay-per-use based on operations), or <strong>Storage + Compute</strong> (separate tiers for hot/cold data).</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>14. Graph Databases</h3>
            <p>Specialized for relationships, networks, and complex traversal queries (social graphs, recommendations, knowledge bases).</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Engine</strong></td>
                  <td>The graph database: <strong>Neptune</strong> (AWS property graph + RDF), <strong>Cosmos DB Gremlin</strong> (Azure), <strong>Memgraph</strong> (GCP), or <strong>Oracle Graph</strong>.</td>
                </tr>
                <tr>
                  <td><strong>Instance Tier</strong></td>
                  <td>Resource allocation: <strong>Small</strong> (development), <strong>Medium</strong> (production read-heavy), <strong>Large</strong> (high-throughput traversals), with corresponding memory and vCPU caps.</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>15. Search Engines</h3>
            <p>Full-text search, log aggregation, and analytics (Elasticsearch/OpenSearch clusters or managed search).</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Engine</strong></td>
                  <td>The search platform: <strong>OpenSearch</strong> (AWS/Oracle), <strong>Cognitive Search</strong> (Azure), <strong>Cloud Search</strong> (GCP), or managed distributions.</td>
                </tr>
                <tr>
                  <td><strong>Billing Model</strong></td>
                  <td>Pricing structure: <strong>Node Hours</strong> (provisioned cluster instances), <strong>Tiered Plans</strong> (Basic/Standard/High Density with index/storage limits), <strong>API Calls</strong> (per-query), or <strong>Storage + Compute</strong> (separate dimensions).</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>16. Certificate Management</h3>
            <p>Public and private SSL/TLS certificate lifecycle management, CAs, and auto-renewal.</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Certificate Type</strong></td>
                  <td>Service offering: <strong>Public SSL/TLS</strong> (free, auto-managed), <strong>Private CA</strong> (root/subordinate certificate authority for internal PKI), <strong>Managed Certificates</strong> (auto-renewing with ACME), or <strong>API-issued Certificates</strong> (custom validity, constraints).</td>
                </tr>
                <tr>
                  <td><strong>Billing Metric</strong></td>
                  <td>Pricing dimensions: <strong>Free</strong> (public certs), <strong>Per Month</strong> (CA authority or managed cert), <strong>Per Certificate</strong> (issued certs), or <strong>Per 10K Operations</strong> (API calls/signing operations).</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ marginTop: '2rem' }}>17. Inference Endpoints</h3>
            <p>Model serving platforms for deploying trained ML models to production (real-time and batch predictions).</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Element / Parameter</th>
                  <th style={{ width: '75%' }}>Definition &amp; Value Breakdown</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Service Type</strong></td>
                  <td>Deployment mode: <strong>Real-time Endpoints</strong> (always-on prediction servers), <strong>Batch Inference</strong> (scheduled jobs over datasets), <strong>Serverless</strong> (pay-per-request, scale-to-zero), or <strong>Container-based</strong> (custom Docker containers).</td>
                </tr>
                <tr>
                  <td><strong>Instance Family</strong></td>
                  <td>Compute type: <strong>CPU</strong> (cost-effective for latency-tolerant models), <strong>GPU</strong> (V100, A100, H100 for ML inference), <strong>TPU</strong> (GCP tensor processors), or <strong>Accelerators</strong> (Inferentia, Trainium).</td>
                </tr>
                <tr>
                  <td><strong>Billing Dimension</strong></td>
                  <td>Pricing structure: <strong>Hourly Instance</strong> (provisioned endpoint), <strong>Core Hours</strong> (vCPU-based), <strong>Node Hours</strong> (cluster nodes), or <strong>Per Prediction</strong> (serverless/API-based).</td>
                </tr>
              </tbody>
            </table>

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

        </main>
      </div>
      <Footer />
        </div>
      </div>
    </>
  );
};

export default DocsPage;
