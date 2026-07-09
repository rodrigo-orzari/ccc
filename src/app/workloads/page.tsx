'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Footer, ProductTypeSelector, DonationModal } from '@/components';
import { WORKLOADS } from '@/config/workloads';
import { WORKLOADS_LISTING_SPONSOR } from '@/config';
import type { ProductType } from '@/types';

const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  vm: 'Virtual Machines',
  database: 'Databases',
  serverless: 'Serverless',
  containers: 'Containers',
  networking: 'Networking',
  'data-analytics': 'Data & Analytics',
  storage: 'Storage',
  ai: 'Artificial Intelligence',
  'app-hosting': 'App Hosting',
  security: 'Security & Identity',
};

const PRODUCT_TYPE_ORDER: ProductType[] = ['vm', 'database', 'serverless', 'containers', 'networking', 'data-analytics', 'storage', 'ai', 'app-hosting', 'security'];

export default function WorkloadsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkloads = WORKLOADS.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ProductType, number>> = {};
    WORKLOADS.forEach(w => {
      const categoriesInWorkload = new Set(w.components.map(c => c.getRequirements({}).productType));
      categoriesInWorkload.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#000000] text-[#171717] dark:text-[#e5e7eb] font-sans overflow-hidden">
      <DonationModal showOn="workloads" />
      <ProductTypeSelector activeProductType={"workloads" as any} />

      <div className="flex-1 overflow-auto flex flex-col">
        <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[#171717] dark:text-[#e5e7eb]">
              Cloud Workloads
            </h1>
            <p className="text-[#737373] dark:text-[#a3a3a3] max-w-4xl text-sm leading-relaxed">
              Choose a conceptual architecture below to calculate the total cross-cloud cost based on your specific scale and requirements. If you'd like us to create a workload template for a specific architecture or use case, we'd love to hear from you. Tell us what you need to compare.{' '}
              <a href="mailto:hello@comparecloudcosts.com?subject=New%20Workload%20Request" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold">
                📧 hello@comparecloudcosts.com
              </a>
            </p>
          </div>

          <div className="mb-6 w-full max-w-sm">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-3 w-3 text-[#737373]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search workloads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] text-[#171717] dark:text-[#e5e7eb] text-[11px] rounded pl-8 pr-3 py-1.5 focus:border-black dark:focus:border-white placeholder-[#737373] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e5e5e5] dark:bg-[#262626] mb-8" />

          {/* Sponsorship Box — renders WORKLOADS_LISTING_SPONSOR's 1200×200 banner when set,
              otherwise falls back to the "become a sponsor" pitch. */}
          {WORKLOADS_LISTING_SPONSOR ? (
            <a
              href={WORKLOADS_LISTING_SPONSOR.linkUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mb-8 block rounded overflow-hidden border border-[#e5e5e5] dark:border-[#262626]"
            >
              <img
                src={WORKLOADS_LISTING_SPONSOR.imageUrl}
                alt={`Sponsored by ${WORKLOADS_LISTING_SPONSOR.companyName}`}
                width={1200}
                height={200}
                className="w-full h-auto aspect-[6/1] object-cover"
              />
            </a>
          ) : (
            <div className="mb-8 border-2 border-dashed border-[#d1d5db] dark:border-[#404040] rounded bg-gradient-to-br from-[#f9fafb] dark:from-[#0f1117] to-[#f3f4f6] dark:to-[#161b22] p-6 flex flex-col items-center gap-3 text-center">
              <span className="text-2xl">🤝</span>
              <div>
                <h3 className="text-sm font-bold text-[#171717] dark:text-[#f1f5f9] mb-1">
                  Sponsor a Workload
                </h3>
                <p className="text-[13px] text-[#737373] dark:text-[#a3a3a3] leading-relaxed">
                  Each workload page below has a dedicated sponsorship slot. Get your company featured on the architectures most relevant to your product, in front of engineers actively comparing cloud costs for that exact use case.
                </p>
                <p className="text-[12px] font-bold text-[#171717] dark:text-[#e5e7eb] mt-2">
                  📧 <a href="mailto:hello@comparecloudcosts.com" className="text-[#2563eb] dark:text-[#818cf8] hover:underline">hello@comparecloudcosts.com</a>
                </p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-[#e5e5e5] dark:bg-[#262626] mb-8" />

          {filteredWorkloads.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#e5e5e5] dark:border-[#262626] rounded">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#737373]">No workloads found</h3>
              <p className="text-[#737373] mt-1 text-[11px]">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredWorkloads.map((workload) => (
                <Link
                  key={workload.id}
                  href={`/workloads/${workload.id}`}
                  className="bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded p-3 hover:border-black dark:hover:border-white transition-colors flex flex-col group cursor-pointer"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="text-lg mb-2">{workload.icon}</div>
                  <h3 className="text-[13px] font-bold mb-1.5 text-[#171717] dark:text-[#e5e7eb] truncate" title={workload.name}>
                    {workload.name}
                  </h3>
                  <p className="text-[#737373] text-[11px] mb-3 flex-1 line-clamp-2 leading-relaxed">
                    {workload.description}
                  </p>
                  <div className="mt-auto pt-2 border-t border-[#e5e5e5] dark:border-[#262626] text-[9px] font-bold uppercase tracking-widest text-[#737373] group-hover:text-black dark:group-hover:text-white transition-colors flex justify-between items-center">
                    Configure &amp; Compare <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
