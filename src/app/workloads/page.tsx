'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Footer, ProductTypeSelector } from '@/components';
import { WORKLOADS } from '@/config/workloads';
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
      <ProductTypeSelector activeProductType={"workloads" as any} />

      <div className="flex-1 overflow-auto flex flex-col">
        <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1600px] mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-[#171717] dark:text-[#e5e7eb]">
                Cloud Workloads
              </h1>
              <p className="text-[#737373] max-w-2xl text-sm leading-relaxed">
                Choose a conceptual architecture below to calculate the total cross-cloud cost based on your specific scale and requirements.
              </p>
            </div>
            <div className="relative w-full md:w-80 shrink-0">
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

          {/* Summary cards — mirrors the Status page's summary-cards pattern */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-[#e5e5e5] dark:bg-[#262626] border border-[#e5e5e5] dark:border-[#262626] rounded-lg overflow-hidden mb-8">
            <div className="bg-white dark:bg-[#000000] p-4">
              <div className="text-[11px] uppercase tracking-wide font-semibold text-[#737373] mb-1">Total Workloads</div>
              <div className="text-2xl font-extrabold text-[#171717] dark:text-[#e5e7eb] leading-none">{WORKLOADS.length}</div>
              <div className="text-[11px] text-[#737373] mt-1">conceptual architectures</div>
            </div>
            {PRODUCT_TYPE_ORDER.filter(pt => categoryCounts[pt]).map(pt => (
              <div key={pt} className="bg-white dark:bg-[#000000] p-4">
                <div className="text-[11px] uppercase tracking-wide font-semibold text-[#737373] mb-1">{PRODUCT_TYPE_LABELS[pt]}</div>
                <div className="text-2xl font-extrabold text-[#171717] dark:text-[#e5e7eb] leading-none">{categoryCounts[pt]}</div>
                <div className="text-[11px] text-[#737373] mt-1">workload{categoryCounts[pt] === 1 ? '' : 's'}</div>
              </div>
            ))}
          </div>

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
