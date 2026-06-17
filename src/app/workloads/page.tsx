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
    <div className="flex flex-col h-screen bg-white dark:bg-[#000000] text-[#171717] dark:text-[#e5e7eb] font-sans overflow-hidden">
      <ProductTypeSelector activeProductType={"workloads" as any} />

      <div className="flex-1 overflow-auto flex flex-col">
        <div className="flex flex-1 w-full">
        {/* Sidebar — hierarchical structure like docs */}
        <aside className="w-[280px] border-r border-[#e5e5e5] dark:border-[#262626] p-6 hidden md:block bg-white dark:bg-[#000000] overflow-y-auto">
          <h2 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-6">
            Content
          </h2>
          <nav>
            <ul className="space-y-5">
              {/* Web Applications */}
              <li>
                <h3 className="text-[11px] font-bold text-[#171717] dark:text-[#e5e7eb] mb-2.5 uppercase tracking-wide">
                  Web Applications
                </h3>
                <ul className="space-y-1.5 pl-2">
                  {WORKLOADS.filter(w => ['serverless-web-app', '3-tier-web', 'ecommerce-microservices', 'k8s-app-platform', 'saas-paas-app'].includes(w.id)).map(w => (
                    <li key={w.id}>
                      <Link
                        href={`/workloads/${w.id}`}
                        className="text-[12px] text-[#737373] hover:text-[#2563eb] dark:hover:text-[#818cf8] transition-colors line-clamp-1"
                        title={w.name}
                        style={{ textDecoration: 'none' }}
                      >
                        {w.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Data & Analytics */}
              <li>
                <h3 className="text-[11px] font-bold text-[#171717] dark:text-[#e5e7eb] mb-2.5 uppercase tracking-wide">
                  Data & Analytics
                </h3>
                <ul className="space-y-1.5 pl-2">
                  {WORKLOADS.filter(w => ['streaming-analytics', 'data-warehouse-bi'].includes(w.id)).map(w => (
                    <li key={w.id}>
                      <Link
                        href={`/workloads/${w.id}`}
                        className="text-[12px] text-[#737373] hover:text-[#2563eb] dark:hover:text-[#818cf8] transition-colors line-clamp-1"
                        title={w.name}
                        style={{ textDecoration: 'none' }}
                      >
                        {w.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Machine Learning */}
              <li>
                <h3 className="text-[11px] font-bold text-[#171717] dark:text-[#e5e7eb] mb-2.5 uppercase tracking-wide">
                  Machine Learning
                </h3>
                <ul className="space-y-1.5 pl-2">
                  {WORKLOADS.filter(w => ['ml-training-hosting'].includes(w.id)).map(w => (
                    <li key={w.id}>
                      <Link
                        href={`/workloads/${w.id}`}
                        className="text-[12px] text-[#737373] hover:text-[#2563eb] dark:hover:text-[#818cf8] transition-colors line-clamp-1"
                        title={w.name}
                        style={{ textDecoration: 'none' }}
                      >
                        {w.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Infrastructure */}
              <li>
                <h3 className="text-[11px] font-bold text-[#171717] dark:text-[#e5e7eb] mb-2.5 uppercase tracking-wide">
                  Infrastructure
                </h3>
                <ul className="space-y-1.5 pl-2">
                  {WORKLOADS.filter(w => ['hpc-scientific'].includes(w.id)).map(w => (
                    <li key={w.id}>
                      <Link
                        href={`/workloads/${w.id}`}
                        className="text-[12px] text-[#737373] hover:text-[#2563eb] dark:hover:text-[#818cf8] transition-colors line-clamp-1"
                        title={w.name}
                        style={{ textDecoration: 'none' }}
                      >
                        {w.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1200px] mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[16px] font-bold mb-2 text-[#171717] dark:text-[#e5e7eb]">
                Cloud Workloads
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
      </div>

      <Footer />
    </div>
  );
}
