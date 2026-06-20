'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Footer, ProductTypeSelector } from "@/components";

const headingToId = (children: React.ReactNode): string => {
  const collect = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(collect).join('');
    if (node?.props?.children) return collect(node.props.children);
    return '';
  };
  return collect(children).toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
};

const AboutPage: React.FC = () => {
  const content = `
comparecloudcosts.com (CCC) is a comprehensive platform designed to demystify cloud pricing across the industry's leading providers. By normalizing complex billing metrics into side-by-side comparisons, CCC empowers users to make data-driven infrastructure decisions, optimize their cloud spend, and confidently navigate a multi-cloud strategy before committing to a specific architecture.

## Why we built this

Cloud computing has revolutionized how we build and scale technology, but it has also introduced a new challenge: pricing complexity. While cloud providers offer individual calculators and purchase agreements, calculating the True Cost of Ownership (TCO) for a modern infrastructure remains a monumental task.

### The Cloud Pricing Maze

Users can find exact pricing for one provider in isolation, but comparing those costs side-by-side requires navigating disparate calculators and performing exhaustive individual studies. Data is scattered across different rate cards and service models, making an "apples-to-apples" comparison nearly impossible without manual normalization.

Many organizations rely on traditional FinOps solutions that provide an "after-the-fact" view of spending. While these help optimize existing spend, they don't provide the proactive, comparative clarity needed before a workload is deployed.

Furthermore, the modern landscape is increasingly multi-cloud. Companies run workloads across different cloud providers simultaneously to achieve specific performance, redundancy, or strategic goals. Many organizations find themselves overpaying because they lacked a unified, cross-provider view during the planning phase.

[↑ Go back to the top](#about-us)

## Features

comparecloudcosts.com (CCC) was built to bridge the gap between complex provider rate cards and actionable business intelligence.

### Side-by-Side Multi-Cloud Analysis

Compare identical configurations across the world's leading cloud providers (AWS, Microsoft Azure, Google Cloud, Oracle Cloud, DigitalOcean, and more) in a single view.

### Real-Time Data

Our engines refresh pricing data frequently to ensure you are seeing the most accurate market rates before you commit to a provider.

### Granular Breakdown

We break down compute, storage, networking, and support costs so you see exactly how a workload's cost structure changes across different providers.

### Proactive Optimization

We provide insights into right-sizing and regional price differences before deployment, complementing your existing reactive FinOps tools.

[↑ Go back to the top](#about-us)

## Who is CCC for?

### IT Managers and CTOs
IT leaders use CCC during the architectural planning phase to estimate the total cost of ownership (TCO) for new workloads. By seeing "apples-to-apples" cost comparisons for compute, databases, and networking, they can justify budget requests, avoid vendor lock-in, and select the most cost-effective cloud provider for their specific performance needs.

### Cloud Provider Sales
Cloud sales professionals leverage CCC as an independent, third-party benchmark to demonstrate the competitive pricing of their offerings. For example, a sales representative can quickly show a prospective client how their pricing for a specific database or compute instance stacks up against competitors, helping to close deals based on transparent cost advantages.

### Product Owners
Product Owners use CCC to align product roadmaps with infrastructure budgets. By easily comparing the cost implications of introducing new features (e.g., adding an AI inference endpoint or switching to a NoSQL database), Product Owners can make data-backed decisions that balance product innovation with operational profitability.

### Managed Service Providers (MSPs)
MSPs managing infrastructure for multiple clients use CCC to design optimized, cost-effective environments. Whether migrating a client from on-premises to the cloud or optimizing an existing cloud footprint, CCC allows MSPs to rapidly evaluate different providers and present compelling, cost-optimized proposals to their clients, thereby increasing their margins and value-add.

### Consulting Companies (Cloud Deployment Specialists)
Cloud consultants and architects use CCC as a foundational tool during the discovery and design phases of a digital transformation project. It allows them to quickly model out multi-cloud scenarios, provide clients with accurate directional estimates, and design architectures that balance performance requirements with strict budget constraints.

[↑ Go back to the top](#about-us)

## About the Creator

Hi, I'm **Rodrigo Orzari** ([Connect with me on LinkedIn](https://www.linkedin.com/in/rodrigoorzari/)). 

I built comparecloudcosts.com as a passion project to deepen my understanding of modern tech stacks and artificial intelligence—transitioning from "vibe-coding" to actively integrating AI into production-grade applications. 

The core motivation behind this tool was to solve a very specific, painful problem for the professionals mentioned above. Instead of forcing IT leaders, sales reps, and consultants to manually hunt down prices across every individual cloud provider's rate card, I wanted to provide a seamless, "apples-to-apples" comparison. CCC makes it significantly easier to navigate complex pricing models and make informed architectural choices without the headache of manual spreadsheet normalization.

[↑ Go back to the top](#about-us)

## Directional Estimates, Not Official Quotes

It is important to note that the data on CCC serves as a **directional indicator** or a sample of popular instances, designed to highlight architectural cost differences across clouds. It is not a substitute for an official quote.

### Comprehensive Coverage & Missing Services

This application is not meant to be a comprehensive catalog of all offerings across all cloud providers. We consolidate data in good faith based on publicly available pricing pages and APIs, but we may inadvertently omit certain services, instance types, or product categories that cloud providers currently offer. If you represent a cloud provider or are a user who detects that a specific service or offering is missing or misrepresented, we welcome your feedback. Please reach out to us so we can continuously improve the accuracy and completeness of our platform.

Always verify your final estimates using the official calculators:
- [AWS Pricing Calculator](https://calculator.aws/)
- [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)
- [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)
- [Oracle Cloud Cost Estimator](https://www.oracle.com/cloud/costestimator.html)
- [DigitalOcean Pricing](https://www.digitalocean.com/pricing)
- [Alibaba Cloud Pricing Calculator](https://www.alibabacloud.com/pricing-calculator)
- [OpenAI API Pricing](https://openai.com/api/pricing/)
- [Anthropic Pricing](https://www.anthropic.com/pricing)

[↑ Go back to the top](#about-us)
`;

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

          .about-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: var(--bg-color);
          }

          .about-container {
            display: flex;
            flex: 1;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
          }

          .about-topnav {
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

          .about-wrapper > footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
          }

          @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 2rem 1.5rem 5rem; }
          }
        `}
      </style>

      <div className="about-wrapper">
        <ProductTypeSelector />
      <div className="about-container" id="about-us">
        <aside className="sidebar">

          <h4 style={{ fontSize: '0.75rem', color: 'var(--muted-text)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Content
          </h4>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.6rem' }}><a href="#about-compare-cloud-costs-ccc">About CCC</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#why-we-built-this">Why we built this</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#features">Features</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#who-is-ccc-for">Who is CCC for?</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#about-the-creator">About the Creator</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#directional-estimates-not-official-quotes">Directional Estimates</a></li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            What is CompareCloudCosts.com?
          </h1>
          <div className="prose prose-slate dark:prose-invert max-w-none text-black dark:text-white">
            <ReactMarkdown
              components={{
                h2: ({ children }) => <h2 id={headingToId(children)}>{children}</h2>,
                h3: ({ children }) => <h3 id={headingToId(children)}>{children}</h3>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </main>
      </div>
      <Footer />
      </div>
    </>
  );
};

export default AboutPage;
