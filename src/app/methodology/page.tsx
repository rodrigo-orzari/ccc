'use client';
import React from 'react';
import MarkdownPage from '@/components/MarkdownPage';
import Footer from '@/components/Footer';

const MethodologyPage: React.FC = () => {
  const content = `
This page explains how we collect, refresh, and normalize pricing data.

## Data Sourcing
We fetch pricing data directly from official cloud provider APIs:
- **AWS**: Price List API
- **Azure**: Retail Prices API
- **Google Cloud**: Cloud Billing Catalog API
- **Oracle Cloud**: Usage and Billing APIs
- **DigitalOcean**: API v2
- **Alibaba Cloud**: OpenAPI pricing catalog

## Update Frequency
Pricing data is fetched automatically on a weekly basis. When a live fetch fails, the tool falls back to a curated static configuration that is updated manually.

## Pricing Calculations
- **PAYG**: Standard On-Demand hourly rates.
- **Aggregation**: For some comparisons, we average regional prices to give a simplified global view.

## Data Visualizations
- **In-Table Micro-Visualizations**: The horizontal color bars beneath instance prices represent the relative magnitude of that price compared to the absolute highest price currently displayed in your active filter. The most expensive instance defines the 100% width baseline.
- **Efficiency Scatter Plots**: The Price vs. RAM chart is designed to reveal the "efficiency frontier." Instances grouped in the bottom-right quadrant offer the highest resources (e.g., RAM) at the lowest price within your active dataset.

*Last updated: June 2026*
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
          <MarkdownPage title="Pricing Methodology" content={content} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MethodologyPage;
