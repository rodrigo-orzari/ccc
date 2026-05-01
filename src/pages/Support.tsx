import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

const SupportPage: React.FC = () => {
  const content = `
# Support This Project

CloudCompareCosts is free and open-source. Running the servers and maintaining the data pipelines costs money.

## How you can help

### 1. Give us a Star ⭐️
If you find this useful, star the project on GitHub.

### 2. Contribute Code 💻
We are always looking for contributors to help with new features or data providers.

### 3. Spread the Word 📣
Share this tool with your colleagues and on social media!

## Roadmap
- [ ] Add Storage pricing
- [ ] Add Database comparison
- [ ] Add Serverless & Containers
- [ ] Multi-currency support

Thank you for your support! ❤️
`;

  return <MarkdownPage title="Support This Project" content={content} />;
};

export default SupportPage;
