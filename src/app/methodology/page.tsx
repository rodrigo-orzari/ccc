'use client';
import React from 'react';
import MarkdownPage from '@/components/MarkdownPage';

const MethodologyPage: React.FC = () => {
  const content = `
# Pricing Methodology

Our goal is to provide the most accurate and up-to-date cloud pricing data available.

## Data Sourcing
We fetch pricing data directly from official cloud provider APIs:
- **AWS**: Price List API
- **Azure**: Retail Prices API
- **Google Cloud**: Cloud Billing Catalog API
- **Oracle Cloud**: Usage and Billing APIs
- **DigitalOcean**: API v2

## Update Frequency
The database is refreshed every 24 hours to capture any changes in regional pricing or new instance launches.

## Pricing Calculations
- **PAYG**: Standard On-Demand hourly rates.
- **Aggregation**: For some comparisons, we average regional prices to give a simplified global view.

*Last updated: April 2026*
`;

  return <MarkdownPage title="Methodology" content={content} />;
};

export default MethodologyPage;
