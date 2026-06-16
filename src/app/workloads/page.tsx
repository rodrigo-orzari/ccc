'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Footer, WorkloadHeader } from '@/components';
import { WORKLOADS } from '@/config/workloads';

export default function WorkloadsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkloads = WORKLOADS.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8ff] dark:bg-[#06060f] text-[#111827] dark:text-[#f1f5f9] font-sans">
      <div className="fixed top-0 left-0 right-0 z-50">
        <WorkloadHeader />
      </div>

      <div className="flex flex-1 w-full mt-[44px]">
        {/* Sidebar Navigation */}
        <aside className="fixed top-[44px] left-0 w-[280px] h-[calc(100vh-44px-40px)] pb-10 overflow-y-auto border-r border-[#dde0f0] dark:border-[#1e1e38] p-8 hidden md:block bg-[#f7f8ff] dark:bg-[#06060f] z-40">
          <h4 className="text-[11px] text-[#6b7280] dark:text-[#71717a] uppercase tracking-wider mb-4 font-bold">Content</h4>
          <nav>
            <ul className="space-y-3">
              {WORKLOADS.map(w => (
                <li key={w.id}>
                  <Link 
                    href={`/workloads/${w.id}`} 
                    className="text-[13px] text-[#111827] dark:text-[#f1f5f9] hover:text-[#2563eb] dark:hover:text-[#818cf8] transition-colors line-clamp-1 font-medium" 
                    title={w.name}
                  >
                    {w.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col md:ml-[280px] min-h-[calc(100vh-44px)] pb-12">
          <main className="flex-1 p-8 lg:p-12 pb-20 w-full max-w-[1200px] mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-3 tracking-tight">Cloud Starter Kits & Workloads</h2>
                <p className="text-[#6b7280] dark:text-[#71717a] max-w-2xl text-[15px] leading-relaxed">
                  Choose a conceptual architecture below to calculate the total cross-cloud cost based on your specific scale and requirements.
                </p>
              </div>
              <div className="relative w-full md:w-80 shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search workloads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#0c0c1e] border border-[#dde0f0] dark:border-[#1e1e38] text-[#111827] dark:text-[#f1f5f9] text-[13px] rounded-lg pl-9 pr-4 py-2 focus:ring-1 focus:ring-[#2563eb] dark:focus:ring-[#818cf8] focus:border-[#2563eb] dark:focus:border-[#818cf8] placeholder-[#6b7280] dark:placeholder-[#71717a] transition-all outline-none"
                />
              </div>
            </div>

            {filteredWorkloads.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#0c0c1e] rounded-xl border border-[#dde0f0] dark:border-[#1e1e38] border-dashed shadow-sm">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-[#111827] dark:text-[#f1f5f9]">No workloads found</h3>
                <p className="text-[#6b7280] dark:text-[#71717a] mt-1 text-sm">Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkloads.map((workload) => (
                <Link 
                  key={workload.id} 
                  href={`/workloads/${workload.id}`}
                  className="bg-white dark:bg-[#0c0c1e] border border-[#dde0f0] dark:border-[#1e1e38] rounded-xl p-6 hover:border-[#2563eb] dark:hover:border-[#818cf8] hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)] transition-all flex flex-col group cursor-pointer"
                >
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">
                    {workload.icon}
                  </div>
                  {/* Truncated header to force one line */}
                  <h3 className="text-base font-bold mb-2 truncate group-hover:text-[#2563eb] dark:group-hover:text-[#818cf8] transition-colors" title={workload.name}>
                    {workload.name}
                  </h3>
                  <p className="text-[#6b7280] dark:text-[#71717a] text-[13px] mb-6 flex-1 line-clamp-2">
                    {workload.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-[#dde0f0] dark:border-[#1e1e38] text-[13px] font-bold text-[#2563eb] dark:text-[#818cf8] flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
                    Configure & Compare <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </Link>
              ))}
              </div>
            )}
          </main>

          <div className="fixed bottom-0 left-0 right-0 z-50">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
;
}
