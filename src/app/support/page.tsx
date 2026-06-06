'use client';
import React from 'react';
import MarkdownPage from '@/components/MarkdownPage';
import Footer from '@/components/Footer';

const SupportPage: React.FC = () => {
  const content = `
CompareCloudCosts.com is free to use. Running the servers and maintaining the data pipelines costs money.

## How you can help

### 1. Spread the Word 📣
Share this tool with your colleagues and on social media!

### 2. Send Feedback 💬
Found a data issue or have a feature request? Email us at [hello@comparecloudcosts.com](mailto:hello@comparecloudcosts.com).

## Roadmap
- [x] Virtual Machine comparison
- [x] Managed Database comparison
- [x] Serverless & Containers
- [ ] Storage pricing
- [ ] Multi-currency support

Thank you for your support! ❤️
`;

  return (
    <>
      <style>{`
        :root {
          --mpage-bg: #f7f8ff;
        }
        @media (prefers-color-scheme: dark) {
          :root { --mpage-bg: #06060f; }
        }
        .mpage-wrapper {
          min-height: 100vh;
          background-color: var(--mpage-bg);
          display: flex;
          flex-direction: column;
        }
        .mpage-content {
          flex: 1;
          padding-bottom: 5rem;
        }
        .mpage-wrapper > footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }
      `}</style>
      <div className="mpage-wrapper">
        <div className="mpage-content">
          <MarkdownPage title="Support This Project" content={content} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SupportPage;
