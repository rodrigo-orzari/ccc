import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cloud Workload Cost Calculator',
  description:
    'Estimate and compare the cost of real-world architectures — serverless web apps, 3-tier stacks, Kubernetes platforms, ML training, data warehouses, and more — across AWS, Azure, Google Cloud, Oracle, DigitalOcean, and Alibaba Cloud.',
  alternates: { canonical: '/workloads' },
};

export default function WorkloadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
