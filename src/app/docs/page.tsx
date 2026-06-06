'use client';
import React from 'react';
import MarkdownPage from '@/components/MarkdownPage';

const DocsPage: React.FC = () => {
  const content = `
# Documentation

_Last updated: June 2026._

Welcome to the Compare Cloud Costs documentation. This page covers how the tool works, how pricing data is collected, and how to interpret results. Content will be expanded gradually.

[↑ Go back to the top](#documentation)

## Getting Started

Compare Cloud Costs is a free, open-source tool that aggregates and normalizes on-demand (pay-as-you-go) pricing across AWS, Microsoft Azure, Google Cloud, Oracle Cloud, DigitalOcean, and Alibaba Cloud in a single side-by-side view.

Use the **product tabs** at the top to switch between categories: Virtual Machines, Databases, Serverless, Containers, Networking, and Data & Analytics.

Use the **filter sidebar** on the left to narrow results by provider, geography, instance specs, and product-specific attributes.

[↑ Go back to the top](#documentation)

## Product Categories

### Virtual Machines

Compares compute instances across providers. Filter by operating system, CPU vendor/architecture, GPU support, and instance category (General Purpose, Compute Optimized, Memory Optimized, etc.). All prices are hourly, on-demand, Linux-based unless otherwise noted.

### Databases

Covers managed relational and NoSQL database services (RDS, Cloud SQL, Azure Database, etc.). Filter by database family, engine, deployment type (Single AZ, Multi-AZ, Serverless), and HA mode.

### Serverless

Compares function-as-a-service pricing (AWS Lambda, Azure Functions, Google Cloud Functions, etc.). Key attributes include supported runtimes, cold start behavior, billing granularity, and memory configuration.

### Containers

Covers managed container runtimes including Kubernetes node pools (EKS, GKE, AKS, OKE, DOKS) and serverless container platforms (Fargate, Cloud Run, ACI). Filter by orchestrator, architecture (x86 or ARM), and billing granularity.

### Networking

Compares data transfer, VPC, load balancing, VPN, NAT gateway, and dedicated connection pricing. Supports filtering by service type, connection type, routing, and direction (egress/ingress).

### Data & Analytics

Covers managed data warehouse and analytics services (Redshift, BigQuery, Synapse, Snowflake, Databricks, and native cloud-provider offerings). Filter by engine, deployment type, and service tier.

[↑ Go back to the top](#documentation)

## Pricing Data

### Sources

Pricing data is fetched automatically on a weekly basis from each provider's public pricing APIs and pages. When a live fetch fails, the tool falls back to a curated static configuration that is updated manually.

All prices are **on-demand (pay-as-you-go)** in **USD**. Reserved, spot, savings plan, or committed-use pricing are not included.

### Normalization

To enable apples-to-apples comparisons, all prices are normalized to a common unit — typically **USD per hour**. Resource specs (vCPUs, RAM, GPU count) are standardized across providers where definitions differ (e.g. Oracle OCPUs vs vCPUs).

### Accuracy

Prices are directional and intended for high-level comparison only. Always verify final pricing on the official provider calculator before making purchasing decisions.

> **Disclaimer:** Price data may be delayed, incomplete, or imprecise. Compare Cloud Costs makes no warranties regarding accuracy. See our [Terms of Use](/terms) for full details.

[↑ Go back to the top](#documentation)

## Filters

### Geography

Filters results to regions within a geographic area (N. America, W. Europe, Asia Pacific, etc.). Multi-select — choose one or more.

### Specs & Price

Sliders to filter by vCPU count, memory (GB), and hourly price ($). Drag the handles inward to apply a range filter. Sliders at their outer limits apply no filter.

### Search

The search box at the top of the table filters by instance type name or description.

### Aggregation

Toggle **Aggregate View** in the toolbar to collapse results by instance type across providers, showing min/max/avg pricing instead of individual region rows.

[↑ Go back to the top](#documentation)

## Sharing

Use the **Share** buttons in the top bar to share a link to the tool on X (Twitter) or LinkedIn.

[↑ Go back to the top](#documentation)

## Contributing & Feedback

The project is open source. Found a bug, missing provider, or incorrect price? Open an issue or pull request on [GitHub](https://github.com/rodrigo-orzari/ccc), or reach out at [hello@comparecloudcosts.com](mailto:hello@comparecloudcosts.com).

[↑ Go back to the top](#documentation)

---

[About](/about) | [Terms of Use](/terms) | [Privacy Policy](/privacy) | [Contact Us](mailto:hello@comparecloudcosts.com)

---

© 2026 Co-Sell Plus LLC. All rights reserved.
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

          .docs-container {
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

      <div className="docs-container" id="documentation">
        <aside className="sidebar">
          <div style={{ marginBottom: '2rem' }}>
            <a href="/" style={{ display: 'inline-block' }}>
              <img src="/logo.png" alt="Compare Cloud Costs" style={{ height: '32px', width: 'auto' }} />
            </a>
          </div>
          <h4 style={{ fontSize: '0.75rem', color: 'var(--muted-text)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            In this article
          </h4>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.6rem' }}><a href="#getting-started">Getting Started</a></li>
              <li style={{ marginBottom: '0.6rem' }}>
                <a href="#product-categories">Product Categories</a>
                <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginTop: '0.5rem' }}>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#virtual-machines" style={{ fontSize: '0.85rem' }}>Virtual Machines</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#databases" style={{ fontSize: '0.85rem' }}>Databases</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#serverless" style={{ fontSize: '0.85rem' }}>Serverless</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#containers" style={{ fontSize: '0.85rem' }}>Containers</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#networking" style={{ fontSize: '0.85rem' }}>Networking</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#data--analytics" style={{ fontSize: '0.85rem' }}>Data & Analytics</a></li>
                </ul>
              </li>
              <li style={{ marginBottom: '0.6rem' }}>
                <a href="#pricing-data">Pricing Data</a>
                <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginTop: '0.5rem' }}>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#sources" style={{ fontSize: '0.85rem' }}>Sources</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#normalization" style={{ fontSize: '0.85rem' }}>Normalization</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#accuracy" style={{ fontSize: '0.85rem' }}>Accuracy</a></li>
                </ul>
              </li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#filters">Filters</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#sharing">Sharing</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#contributing--feedback">Contributing & Feedback</a></li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
            Documentation
          </h1>
          <div className="prose">
            <MarkdownPage title="" content={content} />
          </div>
        </main>
      </div>
    </>
  );
};

export default DocsPage;
