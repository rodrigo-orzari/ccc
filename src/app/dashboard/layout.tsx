import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Cloud Costs in Minutes, Not Days',
  description:
    'See what compute, databases, and serverless actually cost on AWS, Azure, Google Cloud, Oracle, DigitalOcean, Alibaba Cloud, and 8 specialized providers — side by side, updated weekly.',
  alternates: { canonical: '/dashboard' },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
