'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Footer, ProductTypeSelector } from '@/components';
import { WORKLOADS } from '@/config/workloads';

export default function WorkloadsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkloads = WORKLOADS.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#000000] text-[#171717] dark:text-[#e5e7eb] font-sans">
      <ProductTypeSelector activeProductType={"workloads" as any} />

      <div className="flex flex-1 w-full">
        {/* Sidebar — mirrors FilterSidebar pattern */}
        <aside className="w-[280px] border-r border-[#e5e5e5] dark:border-[#262626] p-6 hidden md:block bg-white dark:bg-[#000000]">
          <h2 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-4">
            All Workloads
          </h2>
          <nav>
            <ul className="space-y-2">
              {WORKLOADS.map(w => (
                <li key={w.id}>
                  <Link
                    href={`/workloads/${w.id}`}
                    className="flex items-center gap-2 text-[11px] font-bold text-[#737373] hover:text-black dark:hover:text-white transition-colors line-clamp-1 uppercase tracking-wider"
                    title={w.name}
                    style={{ textDecoration: 'none' }}
                  >
                    <span className="text-sm">{w.icon}</span>
                    <span className="truncate">{w.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1200px] mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[16px] font-bold mb-2 text-[#171717] dark:text-[#e5e7eb]">
                Cloud Starter Kits & Workloads
              </h1>
              <p className="text-[#737373] max-w-2xl text-[11px] leading-relaxed">
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

          {filteredWorkloads.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#e5e5e5] dark:border-[#262626] rounded">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#737373]">No workloads found</h3>
              <p className="text-[#737373] mt-1 text-[11px]">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkloads.map((workload) => (
                <Link
                  key={workload.id}
                  href={`/workloads/${workload.id}`}
                  className="bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded p-5 hover:border-black dark:hover:border-white transition-colors flex flex-col group cursor-pointer"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="text-2xl mb-3">{workload.icon}</div>
                  <h3 className="text-[13px] font-bold mb-2 text-[#171717] dark:text-[#e5e7eb] truncate" title={workload.name}>
                    {workload.name}
                  </h3>
                  <p className="text-[#737373] text-[11px] mb-5 flex-1 line-clamp-2 leading-relaxed">
                    {workload.description}
                  </p>
                  <div className="mt-auto pt-3 border-t border-[#e5e5e5] dark:border-[#262626] text-[10px] font-bold uppercase tracking-widest text-[#737373] group-hover:text-black dark:group-hover:text-white transition-colors flex justify-between items-center">
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
