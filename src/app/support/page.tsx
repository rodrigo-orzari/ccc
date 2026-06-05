'use client';
import React from 'react';
import MarkdownPage from '@/components/MarkdownPage';

const SupportPage: React.FC = () => {
  const content = `
# Support This Project

CompareCloudCosts.com is free to use. Running the servers and maintaining the data pipelines costs money.

## How you can help

### 1. Spread the Word 📣
Share this tool with your colleagues and on social media!

### 2. Send Feedback 💬
Found a data issue or have a feature request? Email us at [hello@comparecloudcosts.com](mailto:hello@comparecloudcosts.com).

## Roadmap
- [x] Virtual Machine comparison
- [x] Managed Database comparison
- [ ] Storage pricing
- [ ] Serverless & Containers
- [ ] Multi-currency support

Thank you for your support! ❤️
`;

  return <MarkdownPage title="Support This Project" content={content} />;
};

export default SupportPage;
