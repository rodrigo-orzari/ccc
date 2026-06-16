'use client';
import React from 'react';
import Footer from '@/components/Footer';

const PrivacyPolicyPage: React.FC = () => {
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
            --muted-text: #94a3b8;
            --divider-color: #1e1e38;
          }
        }
        .privacy-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--bg-color);
        }
        .privacy-topnav {
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
        .privacy-body {
          display: flex;
          flex: 1;
          background-color: var(--bg-color);
          color: var(--text-color);
        }
        .privacy-sidebar {
          width: 280px;
          border-right: 1px solid var(--border-color);
          padding: 2rem 1.5rem;
          position: fixed;
          top: 44px;
          height: calc(100vh - 44px - 48px);
          overflow-y: auto;
          background-color: var(--sidebar-bg);
          flex-shrink: 0;
        }
        .privacy-sidebar a {
          color: var(--text-color);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.15s;
          display: block;
        }
        .privacy-sidebar a:hover { color: var(--link-color); }
        .privacy-main {
          margin-left: 280px;
          flex: 1;
          padding: 3rem 4rem 5rem;
          max-width: 820px;
          line-height: 1.7;
          font-size: 0.9375rem;
        }
        .privacy-main h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
        .privacy-main h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 2.5rem 0 0.75rem;
          letter-spacing: -0.01em;
          scroll-margin-top: 2rem;
        }
        .privacy-main h3 {
          font-size: 1rem;
          font-weight: 700;
          margin: 1.5rem 0 0.5rem;
          scroll-margin-top: 2rem;
        }
        .privacy-main p { margin: 0 0 1rem; }
        .privacy-main ul { margin: 0 0 1rem; padding-left: 1.5rem; }
        .privacy-main li { margin-bottom: 0.25rem; }
        .privacy-main a { color: var(--link-color); text-decoration: none; }
        .privacy-main a:hover { text-decoration: underline; }
        .privacy-main strong { font-weight: 700; }
        .privacy-main hr {
          border: 0;
          border-top: 1px solid var(--divider-color);
          margin: 2.5rem 0;
        }
        .privacy-meta {
          font-size: 0.8125rem;
          color: var(--muted-text);
          margin-bottom: 2.5rem;
        }
        .privacy-wrapper > footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }
        @media (max-width: 768px) {
          .privacy-sidebar { display: none; }
          .privacy-main { margin-left: 0; padding: 2rem 1.25rem 5rem; }
        }
      `}</style>

      <div className="privacy-wrapper">
        {/* Top nav */}
        <div className="privacy-topnav">
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
              target="_blank" rel="noopener noreferrer" title="Share on LinkedIn"
              style={{ color: 'var(--muted-text)', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0A66C2')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-text)')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check this out, comparecloudcosts.com is a tool that helps you compare prices of services across AWS, Microsoft, Google, Oracle, DigitalOcean, and Alibaba. #FinOps #CCC')}`}
              target="_blank" rel="noopener noreferrer" title="Share on X"
              style={{ color: 'var(--muted-text)', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-color)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-text)')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        <div className="privacy-body" id="privacy-policy">
          {/* Sidebar */}
          <aside className="privacy-sidebar">

            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--muted-text)', marginBottom: '0.875rem' }}>
              Content
            </div>
            <nav>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <li><a href="#overview" style={{ padding: '3px 0' }}>Overview</a></li>
                <li><a href="#information-we-collect" style={{ padding: '3px 0' }}>Information We Collect</a></li>
                <li><a href="#how-we-use-your-information" style={{ padding: '3px 0' }}>How We Use It</a></li>
                <li><a href="#data-sharing-and-disclosure" style={{ padding: '3px 0' }}>Data Sharing</a></li>
                <li><a href="#data-security" style={{ padding: '3px 0' }}>Data Security</a></li>
                <li><a href="#third-party-services" style={{ padding: '3px 0' }}>Third-Party Services</a></li>
                <li><a href="#advertising" style={{ padding: '3px 0' }}>Advertising</a></li>
                <li><a href="#contact-us" style={{ padding: '3px 0' }}>Contact Us</a></li>
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="privacy-main">
            <h1>Privacy Policy</h1>
            <p className="privacy-meta">Last updated: 15 June 2026.</p>

            <h2 id="overview">Overview</h2>
            <p>
              Compare Cloud Costs ("we," "us," "our," or "Company") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information
              when you use our website and services.
            </p>

            <h2 id="information-we-collect">Information We Collect</h2>
            <h3>Usage Data</h3>
            <p>When you use Compare Cloud Costs, we automatically collect certain information about your interactions:</p>
            <ul>
              <li>Pages visited and time spent on each page</li>
              <li>Filters and search parameters you use when comparing cloud pricing</li>
              <li>Device information (browser type, operating system)</li>
              <li>IP address (anonymized for analytics purposes)</li>
              <li>Referral source</li>
            </ul>
            <h3>Information You Provide</h3>
            <p>
              We do not require you to create an account or provide personal information to use our service.
              Any information you voluntarily provide (such as through contact forms or emails) will be used
              only for the purpose you provided it.
            </p>
            <h3>Cookies and Tracking</h3>
            <p>We use cookies for essential functionality, as well as tracking technologies for analytics and advertising as described below.</p>

            <h2 id="how-we-use-your-information">How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Improve and optimize our pricing data and user experience</li>
              <li>Understand how users interact with our platform</li>
              <li>Debug and troubleshoot technical issues</li>
              <li>Generate aggregated analytics (never identifying individuals)</li>
            </ul>

            <h2 id="data-sharing-and-disclosure">Data Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share
              aggregated, anonymized data with partners to improve our services, but this data cannot identify you.
            </p>
            <p>We may disclose information when required by law, regulation, or legitimate legal process.</p>

            <h2 id="data-security">Data Security</h2>
            <p>
              We take reasonable measures to protect information from unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              You use our service at your own risk.
            </p>

            <h2 id="third-party-services">Third-Party Services</h2>
            <p>Our platform uses the following services:</p>
            <ul>
              <li><strong>Cloud Providers</strong>: AWS, Azure, Google Cloud, Oracle Cloud APIs (for pricing data only)</li>
              <li><strong>Payment Processing</strong>: We use third-party payment processors (e.g., Intuit) for voluntary donations. We do not store or process your credit card information directly.</li>
              <li><strong>Analytics</strong>: Basic analytics to understand usage patterns</li>
            </ul>
            <p>These services have their own privacy policies, and we encourage you to review them.</p>

            <h2 id="advertising">Advertising</h2>
            <p>
              We partner with Microsoft Clarity and Microsoft Advertising to capture how you use and interact with our website through behavioral metrics, heatmaps, and session replay to improve and market our products/services. Website usage data is captured using first and third-party cookies and other tracking technologies to determine the popularity of products/services and online activity. Additionally, we use this information for site optimization, fraud/security purposes, and advertising. For more information about how Microsoft collects and uses your data, visit the <a href="https://www.microsoft.com/privacy/privacystatement" target="_blank" rel="noopener noreferrer">Microsoft Privacy Statement</a>.
            </p>

            <h2 id="changes">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes
              by updating the "Last updated" date above.
            </p>

            <h2 id="contact-us">Contact Us</h2>
            <p>
              For questions about this Privacy Policy or our privacy practices, please email us at{' '}
              <a href="mailto:hello@comparecloudcosts.com">hello@comparecloudcosts.com</a>.
            </p>

            <hr />
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-text)' }}>
              <a href="/terms">Terms of Use</a>
              {' · '}
              <a href="/about">About Us</a>
              {' · '}
              <a href="mailto:hello@comparecloudcosts.com">Contact Us</a>
              {' · '}
              © 2026 Co-Sell Plus LLC. All rights reserved.
            </p>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
