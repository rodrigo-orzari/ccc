import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cloud Datacenter & Region Map',
  description:
    'Explore and compare cloud datacenter regions and availability zones across AWS, Azure, Google Cloud, Oracle, DigitalOcean, and Alibaba Cloud on an interactive world map.',
  alternates: { canonical: '/datacenters' },
};

export default function DatacentersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
