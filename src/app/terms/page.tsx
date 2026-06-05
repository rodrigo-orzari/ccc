'use client';
import React from 'react';
import MarkdownPage from '@/components/MarkdownPage';

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

---

[Privacy Policy](/privacy) | [Contact Us](mailto:hello@comparecloudcosts.com) | [About Us](/about)

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

          .terms-container {
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
    </>
  );
};

export default TermsOfUsePage;
