import type { Metadata } from 'next';
import { WORKLOADS } from '@/config/workloads';

const baseUrl = 'https://comparecloudcosts.com';

export function generateStaticParams() {
  return WORKLOADS.map((w) => ({ id: w.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const workload = WORKLOADS.find((w) => w.id === id);

  if (!workload) {
    return {
      title: 'Workload Cost Calculator',
      description:
        'Compare the cost of common cloud architectures across AWS, Azure, Google Cloud, Oracle, DigitalOcean, and Alibaba Cloud.',
      alternates: { canonical: `/workloads/${id}` },
    };
  }

  const title = `${workload.name} — Cloud Cost Comparison`;
  const description = `${workload.description} Compare pricing for this workload across AWS, Azure, Google Cloud, Oracle, DigitalOcean, and Alibaba Cloud.`;

  return {
    title,
    description,
    alternates: { canonical: `/workloads/${workload.id}` },
    openGraph: {
      title: `${title} | Compare Cloud Costs`,
      description,
      url: `${baseUrl}/workloads/${workload.id}`,
      type: 'article',
    },
  };
}

export default async function WorkloadLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workload = WORKLOADS.find((w) => w.id === id);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Workloads', item: `${baseUrl}/workloads` },
      ...(workload
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: workload.name,
              item: `${baseUrl}/workloads/${workload.id}`,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
