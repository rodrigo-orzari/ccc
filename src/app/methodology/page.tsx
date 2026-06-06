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

## Data Visualizations
- **In-Table Micro-Visualizations**: The horizontal color bars beneath instance prices represent the relative magnitude of that price compared to the absolute highest price currently displayed in your active filter. The most expensive instance defines the 100% width baseline.
- **Efficiency Scatter Plots**: The Price vs. RAM chart is designed to reveal the "efficiency frontier." Instances grouped in the bottom-right quadrant offer the highest resources (e.g., RAM) at the lowest price within your active dataset.

*Last updated: June 2026*
`;

  return <MarkdownPage title="Methodology" content={content} />;
};

export default MethodologyPage;
