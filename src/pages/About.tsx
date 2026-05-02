import React from 'react';

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
- **Server logs.** Our hosting provider records standard request logs (IP address, user agent, timestamp, page requested) for operational and security purposes.

### Third-party advertising
This site displays advertisements served by Google AdSense. Google and its partners may use cookies and other identifiers to serve and personalise ads based on your browsing activity.

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '280px',
        borderRight: '1px solid #e5e7eb',
        padding: '2rem 1.5rem',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        backgroundColor: '#f9fafb'
      }}>
        <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '1rem' }}>
          In this article
        </h4>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#why-we-built-this" style={{ color: '#111827', textDecoration: 'none', fontSize: '0.9rem' }}>Why we built this</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#features" style={{ color: '#111827', textDecoration: 'none', fontSize: '0.9rem' }}>Features</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#privacy-policy" style={{ color: '#111827', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>Privacy Policy</a>
              <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginTop: '0.5rem' }}>
                <li style={{ marginBottom: '0.4rem' }}>
                  <a href="#information-we-collect" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.85rem' }}>Information we collect</a>
                </li>
                <li style={{ marginBottom: '0.4rem' }}>
                  <a href="#third-party-advertising" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.85rem' }}>Third-party advertising</a>
                </li>
                <li style={{ marginBottom: '0.4rem' }}>
                  <a href="#cookies" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.85rem' }}>Cookies</a>
                </li>
                <li style={{ marginBottom: '0.4rem' }}>
                  <a href="#contact" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.85rem' }}>Contact</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: '280px', flex: 1, padding: '3rem 4rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>
          What is CompareCloudCosts.com?
        </h1>
        <div className="prose">
          {/* Note: Your MarkdownPage component must handle ID generation for headers 
              (e.g., converting "Why we built this" to id="why-we-built-this") 
              for the anchor links to work. */}
          <MarkdownPage title="" content={content} />
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
