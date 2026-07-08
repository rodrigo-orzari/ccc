import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'How to use Compare Cloud Costs: product categories, supported providers, pricing accuracy, use cases, and how our data is sourced and normalized.',
  alternates: { canonical: '/docs' },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
