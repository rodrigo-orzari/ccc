import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find the Best Cloud Value',
  description:
    'Stop guessing your infrastructure bills. Compare accurate directional pricing for compute, databases, and serverless across the world’s top cloud providers.',
  alternates: { canonical: '/dashboard' },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
