'use client';
import React from 'react';
import MarkdownPage from '@/components/MarkdownPage';
import Footer from '@/components/Footer';

const TermsOfUsePage: React.FC = () => {
  const content = `
# Terms of Use

_Last updated: 20 May 2026._

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

To provide a seamless comparison experience across entirely different cloud architectures, CCC normalizes proprietary billing metrics into standard equivalents. For example, in the Data & Analytics category, we map 100 Azure Synapse DWUs (Data Warehouse Units) or 100 Google BigQuery Slots to equal 1 standard "Compute Unit" (equivalent to 1 Databricks DBU or 1 Snowflake Credit). Similar approximations are applied across Virtual Machines, Databases, Serverless, and Networking categories.

This abstraction means the data you see is an approximation designed to match "like for like" compute power. Actual performance and cost ratios will vary significantly depending on your specific workload.

### Official Pricing Calculators

Because CCC is not the primary source of truth for final billing, you must **always** rely on official provider pricing calculators and your own specific purchase agreements for final financial decisions. 

Please refer directly to the official tools for exact quotes:
- **AWS:** [AWS Pricing Calculator](https://calculator.aws/)
- **Microsoft Azure:** [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)
- **Google Cloud:** [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)
- **Oracle Cloud:** [Oracle Cloud Cost Estimator](https://www.oracle.com/cloud/costestimator.html)
- **DigitalOcean:** [DigitalOcean Pricing](https://www.digitalocean.com/pricing)

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
            height: calc(100vh - 44px);
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

      <div className="terms-wrapper">
        <div className="terms-topnav">
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--text-color)', textDecoration: 'none', letterSpacing: '-0.01em' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Compare Cloud Costs
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--muted-text)', whiteSpace: 'nowrap' }}>
              Share with friends and family
            </span>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://comparecloudcosts.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              style={{ color: 'var(--muted-text)', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0A66C2')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-text)')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check this out, comparecloudcosts.com is a tool that helps you compare prices of services across AWS, Microsoft, Google, Oracle, DigitalOcean, and Alibaba Cloud. #FinOps #CCC')}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on X"
              style={{ color: 'var(--muted-text)', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-color)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-text)')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
      <div className="terms-container" id="terms-of-use">
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
          <div className="prose">
            <MarkdownPage title="" content={content} />
          </div>
        </main>
      </div>
      <Footer />
      </div>
    </>
  );
};

export default TermsOfUsePage;
