'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Footer, ProductTypeSelector } from '@/components';

const headingToId = (children: React.ReactNode): string => {
  const collect = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(collect).join('');
    if (node?.props?.children) return collect(node.props.children);
    return '';
  };
  return collect(children).toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
};

const TermsOfUsePage: React.FC = () => {
  const content = `
_Last updated: 15 June 2026._

## Agreement to Terms

By accessing and using Compare Cloud Costs, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

[↑ Go back to the top](#terms-of-use)

## Use License

Permission is granted to temporarily download one copy of the materials (information or software) on Compare Cloud Costs for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

- Modify or copy the materials
- Use the materials for any commercial purpose or for any public display
- Attempt to reverse engineer, disassemble, or decompile any software contained on the site
- Remove any copyright or other proprietary notations from the materials
- Transfer the materials to another person or "mirror" the materials on any other server

[↑ Go back to the top](#terms-of-use)

## Disclaimer

The materials on Compare Cloud Costs are provided on an 'as is' basis. Compare Cloud Costs makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

[↑ Go back to the top](#terms-of-use)

## Limitations

In no event shall Compare Cloud Costs or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Compare Cloud Costs, even if Compare Cloud Costs or an authorized representative has been notified orally or in writing of the possibility of such damage.

[↑ Go back to the top](#terms-of-use)

## Accuracy of Materials

The materials appearing on Compare Cloud Costs could include technical, typographical, or photographic errors. Compare Cloud Costs does not warrant that any of the materials on its website are accurate, complete, or current. Compare Cloud Costs may make changes to the materials contained on its website at any time without notice.

[↑ Go back to the top](#terms-of-use)

## Links

Compare Cloud Costs has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Compare Cloud Costs of the site. Use of any such linked website is at the user's own risk.

[↑ Go back to the top](#terms-of-use)

## Modifications

Compare Cloud Costs may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.

[↑ Go back to the top](#terms-of-use)

## Governing Law

These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.

[↑ Go back to the top](#terms-of-use)

## Pricing Disclaimer

### Directional and Sample Data Only

CCC functions as an aggregator of publicly available information, designed to provide a **directional indicator** of cloud costs rather than official pricing quotes. For providers with flexible pricing models (such as custom CPU/RAM configurations), our data represents a curated **sample** of popular instances to enable apples-to-apples comparisons. 

While we refresh data frequently (at least weekly), cloud providers update their pricing, introduce new instances, and offer private negotiated discounts that are not reflected here.

### Visualizations and Charts

The application provides graphical tools, including in-table micro-visualizations and analytical charts (e.g., bar charts and scatter plots), to assist with visual trend analysis. These visualizations are strictly relative indicators calculated dynamically based on your active filters. They do not represent exact financial projections or guaranteed performance ratios. Because the scales (such as maximum price width) constantly shift depending on the selected dataset, you should not rely on visual lengths or chart placements as absolute indicators of value.

### Data Normalization

To provide a seamless comparison experience across entirely different cloud architectures, CCC normalizes proprietary billing metrics into standard equivalents. For example, in the Data & Analytics category, we map 100 Azure Synapse DWUs (Data Warehouse Units) or 100 Google BigQuery Slots to equal 1 standard "Compute Unit" (equivalent to 1 Databricks DBU or 1 Snowflake Credit). We also normalize AI Context Windows, Serverless executions, Networking throughputs (Port Capacities), and Database deployments. Similar approximations are applied across all categories.

This abstraction means the data you see is an approximation designed to match "like for like" compute power. Actual performance and cost ratios will vary significantly depending on your specific workload.

### Workloads Catalog and Architecture Calculator

The Workloads section provides hypothetical architectures to illustrate relative multi-cloud deployment costs for common scenarios (e.g., Serverless Web Apps, Machine Learning). The provided architectural components and generated cost estimates are conceptual. Real-world implementation costs will vary greatly based on bandwidth consumption, unlisted service dependencies, storage I/O, and architectural variations not represented in the catalog.

### Voluntary Donations

This project accepts voluntary donations to help cover infrastructure and API costs. All donations are processed by third-party payment providers (e.g., Intuit). Donations are non-refundable, strictly voluntary, and do not constitute a purchase of services, nor do they guarantee future uptime, feature development, or service availability of the Compare Cloud Costs platform.

### Official Pricing Calculators

Because CCC is not the primary source of truth for final billing, you must **always** rely on official provider pricing calculators and your own specific purchase agreements for final financial decisions. 

Please refer directly to the official tools for exact quotes:
- **AWS:** [AWS Pricing Calculator](https://calculator.aws/)
- **Microsoft Azure:** [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)
- **Google Cloud:** [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)
- **Oracle Cloud:** [Oracle Cloud Cost Estimator](https://www.oracle.com/cloud/costestimator.html)
- **DigitalOcean:** [DigitalOcean Pricing](https://www.digitalocean.com/pricing)
- **Alibaba Cloud:** [Alibaba Cloud Pricing Calculator](https://www.alibabacloud.com/pricing-calculator)
- **OpenAI:** [OpenAI API Pricing](https://openai.com/api/pricing/)
- **Anthropic:** [Anthropic Pricing](https://www.anthropic.com/pricing)

### No warranties or liability

The pricing data on this platform is provided as-is for informational and comparative purposes only. We make no warranties regarding accuracy, completeness, or fitness for any particular purpose. Users should independently verify all pricing before making purchasing decisions.

[↑ Go back to the top](#terms-of-use)

## Contact

For questions about these Terms of Use, please email us at [hello@comparecloudcosts.com](mailto:hello@comparecloudcosts.com).

[↑ Go back to the top](#terms-of-use)
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

          .terms-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: var(--bg-color);
          }

          .terms-container {
            display: flex;
            flex: 1;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
          }

          .terms-topnav {
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

          .terms-wrapper > footer {
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

      <div className="terms-wrapper">
        <ProductTypeSelector activeProductType={"" as any} />
      <div className="terms-container" id="terms-of-use">
        <aside className="sidebar">

          <h4 style={{ fontSize: '0.75rem', color: 'var(--muted-text)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Content
          </h4>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.6rem' }}><a href="#agreement-to-terms">Agreement to Terms</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#use-license">Use License</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#disclaimer">Disclaimer</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#limitations">Limitations</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#accuracy-of-materials">Accuracy of Materials</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#modifications">Modifications</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#governing-law">Governing Law</a></li>
              <li style={{ marginBottom: '0.6rem' }}>
                <a href="#pricing-disclaimer">Pricing Disclaimer</a>
                <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginTop: '0.5rem' }}>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#directional-and-sample-data-only" style={{ fontSize: '0.85rem' }}>Directional data only</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#visualizations-and-charts" style={{ fontSize: '0.85rem' }}>Visualizations and charts</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#data-normalization" style={{ fontSize: '0.85rem' }}>Data normalization</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#workloads-catalog-and-architecture-calculator" style={{ fontSize: '0.85rem' }}>Workloads catalog</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#voluntary-donations" style={{ fontSize: '0.85rem' }}>Voluntary donations</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#official-pricing-calculators" style={{ fontSize: '0.85rem' }}>Official calculators</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#no-warranties-or-liability" style={{ fontSize: '0.85rem' }}>No liability</a></li>
                </ul>
              </li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
            Terms of Use
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

export default TermsOfUsePage;
