import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

const PrivacyPolicyPage: React.FC = () => {
  const content = `
# Privacy Policy

_Last updated: 5 May 2026._

## Overview

Compare Cloud Costs ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when you use our website and services.

## Information We Collect

### Usage Data
When you use Compare Cloud Costs, we automatically collect certain information about your interactions:
- Pages visited and time spent on each page
- Filters and search parameters you use when comparing cloud pricing
- Device information (browser type, operating system)
- IP address (anonymized for analytics purposes)
- Referral source

### Information You Provide
We do not require you to create an account or provide personal information to use our service. Any information you voluntarily provide (such as through contact forms or emails) will be used only for the purpose you provided it.

### Cookies and Tracking
We use minimal cookies for essential functionality only. We do not use cookies for tracking or advertising purposes.

## How We Use Your Information

We use collected information to:
- Improve and optimize our pricing data and user experience
- Understand how users interact with our platform
- Debug and troubleshoot technical issues
- Generate aggregated analytics (never identifying individuals)

## Data Sharing and Disclosure

We do not sell, trade, or rent your personal information to third parties. We may share aggregated, anonymized data with partners to improve our services, but this data cannot identify you.

We may disclose information when required by law, regulation, or legitimate legal process.

## Data Security

We take reasonable measures to protect information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure. You use our service at your own risk.

## Third-Party Services

Our platform uses the following services:
- **Cloud Providers**: AWS, Azure, Google Cloud, Oracle Cloud APIs (for pricing data only)
- **Analytics**: Basic analytics to understand usage patterns

These services have their own privacy policies, and we encourage you to review them.

## Advertising

Currently, we do not serve third-party advertisements on this platform.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last updated" date above.

## Contact Us

For questions about this Privacy Policy or our privacy practices, please email us at [hello@comparecloudcosts.com](mailto:hello@comparecloudcosts.com).

---

[Terms of Use](/terms) | [About Us](/about) | [Contact Us](mailto:hello@comparecloudcosts.com)

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

          .privacy-container {
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

      <div className="privacy-container" id="privacy-policy">
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
              <li style={{ marginBottom: '0.6rem' }}><a href="#overview">Overview</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#information-we-collect">Information We Collect</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#how-we-use-your-information">How We Use Your Information</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#data-sharing-and-disclosure">Data Sharing</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#data-security">Data Security</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#third-party-services">Third-Party Services</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#advertising">Advertising</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#contact-us">Contact Us</a></li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
            Privacy Policy
          </h1>
          <div className="prose">
            <MarkdownPage title="" content={content} />
          </div>
        </main>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
