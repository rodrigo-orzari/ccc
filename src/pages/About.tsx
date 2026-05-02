import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

const AboutPage: React.FC = () => {
  const content = `
**CompareCloudCosts.com** is an open-source tool designed to help developers and architects understand the real costs of cloud infrastructure.

## Why we built this
Cloud providers often hide their pricing behind complex calculators and regional variations. We believe in transparency and simplicity.

## Features
- **Global Comparison**: See prices across different geographies.
- **Unified Filtering**: Filter by vCPU, Memory, OS, and Architecture regardless of the provider.
- **Real-time Data**: Directly synced with official price lists.

## Privacy Policy

_Last updated: 1 May 2026._

CompareCloudCosts.com is a free, public price-comparison tool. We aim to collect as little information about visitors as possible.

### Information we collect
- **No account required.** You can use the site without signing up or logging in.
- **No personal information stored.** We do not ask for your name, email, address, or any other identifying information.
- **Server logs.** Our hosting provider records standard request logs for operational and security purposes.

### Third-party advertising
This site displays advertisements served by Google AdSense. Google and its partners may use cookies and other identifiers to serve and personalise ads.

### Cookies
In addition to advertising cookies, the site may set minimal first-party cookies for basic functionality.

### Children
This site is not directed at children under 13 and we do not knowingly collect information from children.

### Changes to this policy
If we update this policy, we will revise the "Last updated" date. Continued use of the site constitutes acceptance of the updated policy.

### Contact
Questions about this policy? Email [hello@comparecloudcosts.com](mailto:hello@comparecloudcosts.com).
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
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-color: #0f172a;
              --text-color: #f1f5f9;
              --sidebar-bg: #1e293b;
              --border-color: #334155;
              --link-color: #60a5fa;
              --muted-text: #94a3b8;
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
            margin-top: 2rem;
          }

          @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 2rem; }
          }
        `}
      </style>

      <div className="about-container">
        <aside className="sidebar">
          <h4 style={{ fontSize: '0.75rem', color: 'var(--muted-text)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            In this article
          </h4>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.6rem' }}><a href="#why-we-built-this">Why we built this</a></li>
              <li style={{ marginBottom: '0.6rem' }}><a href="#features">Features</a></li>
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
