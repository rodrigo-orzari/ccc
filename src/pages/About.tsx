import React from 'react';
import MarkdownPage from '../components/MarkdownPage';

const AboutPage: React.FC = () => {
  const content = `
# About CloudCompareCosts

**CloudCompareCosts** is an open-source tool designed to help developers and architects understand the real costs of cloud infrastructure.

## Why we built this
Cloud providers often hide their pricing behind complex calculators and regional variations. We believe in transparency and simplicity.

## Features
- **Global Comparison**: See prices across different geographies.
- **Unified Filtering**: Filter by vCPU, Memory, OS, and Architecture regardless of the provider.
- **Real-time Data**: Directly synced with official price lists.

## Community driven
This project is built for the community. If you find discrepancies or want to see a new provider, feel free to contribute.
`;

  return <MarkdownPage title="What is CloudCompareCosts?" content={content} />;
};

export default AboutPage;
