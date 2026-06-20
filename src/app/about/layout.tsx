import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn why we built Compare Cloud Costs, our mission, and who it is designed for.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
