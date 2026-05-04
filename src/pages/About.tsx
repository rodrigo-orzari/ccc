import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

const AboutPage: React.FC = () => {
  const content = `
**CompareCloudCosts.com** aggregates pricing from AWS, Azure, Google Cloud, Oracle, and DigitalOcean into a single filterable interface. Rather than toggling between five separate pricing calculators, engineers and finance teams get a unified view where cloud services are normalized to a common schema — vCPUs, memory, geography, and hourly USD price — covering both virtual machines and managed databases.

---

## Why we built this
Cloud infrastructure costs are typically distributed across disparate, vendor-specific calculators. Navigating these individual tools to perform a cross-provider analysis can be time-intensive and complex. We built this platform to expedite that process, providing a centralized interface to evaluate different options efficiently and support better-informed infrastructure decisions.

[Back to top ↑](#about-us)

---

## Features
Comparing cloud instances requires more than just looking at a price tag. Our platform streamlines the technical evaluation process by normalizing diverse data points into a single, actionable view.

- **Global Comparison**: Access and compare infrastructure costs across different geographies to optimize for regional pricing variations.
- **Unified Filtering**: Standardize your search by filtering for vCPUs, memory, OS, CPU architecture, database engine, and HA mode — regardless of vendor-specific naming conventions.
- **Weekly Data Refreshes**: Pricing information is aggregated and updated on a weekly basis to reflect recent market changes.
- **Data Portability**: Export your custom comparison results directly to a **CSV file**, allowing for offline analysis, internal reporting, or integration with your financial spreadsheets.

[Back to top ↑](#about-us)

---

## Pricing Disclaimer

> **Important: Please read before using this tool.**

The pricing data displayed on CompareCloudCosts.com is provided **for informational and consultative purposes only**. It is intended to help users develop a general understanding of relative cloud infrastructure costs and to support high-level, directional decision-making.

### Data accuracy and timeliness
- Pricing information is collected from publicly available sources on a **weekly automated basis** and is **not real-time**. Prices shown may not reflect the most current rates published by cloud providers.
- Cloud providers change their pricing frequently and without prior notice. The prices shown may be outdated, incomplete, or inaccurate at the time of your visit.
- Pricing structures for cloud services are highly complex and vary based on factors not captured here, including reserved/committed-use discounts, savings plans, enterprise agreements, spot/preemptible pricing, egress fees, support tiers, taxes, and regional surcharges.

### Not a substitute for official pricing
- This tool is **not** a substitute for the official pricing pages, calculators, or quotations provided by each cloud vendor.
- All pricing, terms, and conditions must be **verified directly with the cloud provider** before making any purchasing, budgeting, or architectural decisions.
- Final pricing is always subject to individual negotiation and contractual terms agreed upon directly between you and the cloud provider.

### No warranties or liability
- CompareCloudCosts.com and its operators make **no representations or warranties**, express or implied, as to the accuracy, completeness, reliability, or fitness for a particular purpose of any pricing data displayed on this site.
- **Use of this tool is entirely at your own risk.** CompareCloudCosts.com, its owners, contributors, and operators accept **no liability whatsoever** for any decisions made, losses incurred, or damages arising — directly or indirectly — from reliance on the information provided here.
- This site does not constitute financial, legal, or procurement advice.

By using CompareCloudCosts.com, you acknowledge that you have read, understood, and agreed to this disclaimer.

[Back to top ↑](#about-us)

---

## Privacy Policy

_Last updated: 1 May 2026._

CompareCloudCosts.com is a free, public price-comparison tool. We aim to collect as little information about visitors as possible.

### Information we collect
- **No account required.** You can use the site without signing up or logging in.
- **No personal information stored.** We do not ask for your name, email, address, or any other identifying information.
- **Server logs.** Our hosting provider records standard request logs for operational and security purposes.

[Back to top ↑](#about-us)

---

### Third-party advertising
This site displays advertisements served by Google AdSense. Google and its partners may use cookies and other identifiers to serve and personalise ads based on your browsing activity.

[Back to top ↑](#about-us)

---

### Cookies
In addition to advertising cookies, the site may set minimal first-party cookies for basic functionality.

[Back to top ↑](#about-us)

---

### Children
This site is not directed at children under 13 and we do not knowingly collect information from children.

[Back to top ↑](#about-us)

---

### Changes to this policy
If we update this policy, we will revise the "Last updated" date at the top of this section. Continued use of the site constitutes acceptance of the updated policy.

[Back to top ↑](#about-us)

---

### Contact
Questions about this policy? Email [hello@comparecloudcosts.com](mailto:hello@comparecloudcosts.com).

[Back to top ↑](#about-us)
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
              <li style={{ marginBottom: '0.6rem' }}>
                <a href="#pricing-disclaimer" style={{ fontWeight: 'bold', color: '#f59e0b' }}>Pricing Disclaimer</a>
                <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginTop: '0.5rem' }}>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#data-accuracy-and-timeliness" style={{ fontSize: '0.85rem' }}>Data accuracy</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#not-a-substitute-for-official-pricing" style={{ fontSize: '0.85rem' }}>Official pricing</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#no-warranties-or-liability" style={{ fontSize: '0.85rem' }}>No liability</a></li>
                </ul>
              </li>
              <li style={{ marginBottom: '0.6rem' }}>
                <a href="#privacy-policy" style={{ fontWeight: 'bold' }}>Privacy Policy</a>
                <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginTop: '0.5rem' }}>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#information-we-collect" style={{ fontSize: '0.85rem' }}>Information we collect</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#third-party-advertising" style={{ fontSize: '0.85rem' }}>Advertising</a></li>
                  <li style={{ marginBottom: '0.4rem' }}><a href="#contact" style={{ fontSize: '0.85rem' }}>Contact</a></li>
                </ul>
              </li>
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
