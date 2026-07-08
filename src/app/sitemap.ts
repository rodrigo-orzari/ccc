import { MetadataRoute } from 'next';
import { WORKLOADS } from '@/config/workloads';

const baseUrl = 'https://comparecloudcosts.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/dashboard`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/workloads`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/datacenters`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/docs`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/methodology`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/status`, lastModified, changeFrequency: 'daily', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // One entry per workload calculator — generated from the canonical WORKLOADS
  // config so the sitemap can never drift out of sync with the catalog.
  const workloadRoutes: MetadataRoute.Sitemap = WORKLOADS.map((w) => ({
    url: `${baseUrl}/workloads/${w.id}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...workloadRoutes];
}
