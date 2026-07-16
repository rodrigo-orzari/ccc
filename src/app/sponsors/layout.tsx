import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Sponsors | CompareCloudCosts',
  description:
    'Meet the companies that support CompareCloudCosts and keep our data free and accessible for the cloud engineering community.',
  alternates: { canonical: '/sponsors' },
};

export default function SponsorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
