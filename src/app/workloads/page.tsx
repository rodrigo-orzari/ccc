'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components';
import { WORKLOADS } from '@/config/workloads';

export default function WorkloadsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkloads = WORKLOADS.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8ff] dark:bg-[#06060f] text-[#111827] dark:text-[#f1f5f9] font-sans">
      <header className="bg-[#eef0fc] dark:bg-[#0c0c1e] border-b border-[#dde0f0] dark:border-[#1e1e38] py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Compare Cloud Costs
          </h1>
          <p className="text-sm text-gray-400">Workload Architecture Catalog</p>
        </div>
        <Link 
          href="/" 
          className="px-4 py-2 bg-[#f7f8ff] dark:bg-[#10102a] border border-[#dde0f0] dark:border-[#1e1e38] hover:bg-[#e8eaf8] dark:hover:bg-[#1e1e38] text-sm font-medium rounded transition-colors"
        >
          &larr; Back to Services
        </Link>
      </header>

      <main className="flex-1 p-8 max-w-[1100px] mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Cloud Starter Kits & Workloads</h2>
            <p className="text-[#6b7280] dark:text-[#71717a] max-w-3xl">
              Choose a conceptual architecture below to calculate the total cross-cloud cost based on your specific scale and requirements.
            </p>
          </div>
          <div className="relative w-full md:w-72 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search workloads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#eef0fc] dark:bg-[#0c0c1e] border border-[#dde0f0] dark:border-[#1e1e38] text-[#111827] dark:text-[#f1f5f9] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-[#2563eb] dark:focus:ring-[#818cf8] focus:border-[#2563eb] dark:focus:border-[#818cf8] placeholder-[#6b7280] dark:placeholder-[#71717a] transition-colors"
            />
          </div>
        </div>

        {filteredWorkloads.length === 0 ? (
          <div className="text-center py-12 bg-[#eef0fc] dark:bg-[#0c0c1e] rounded-lg border border-[#dde0f0] dark:border-[#1e1e38] border-dashed">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-[#111827] dark:text-[#f1f5f9]">No workloads found</h3>
            <p className="text-[#6b7280] dark:text-[#71717a] mt-2">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkloads.map((workload) => (
            <Link 
              key={workload.id} 
              href={`/workloads/${workload.id}`}
              className="bg-[#eef0fc] dark:bg-[#0c0c1e] border border-[#dde0f0] dark:border-[#1e1e38] rounded-lg p-6 hover:border-[#2563eb] dark:hover:border-[#818cf8] transition-all flex flex-col group cursor-pointer"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">
                {workload.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[#2563eb] dark:group-hover:text-[#818cf8] transition-colors">
                {workload.name}
              </h3>
              <p className="text-[#6b7280] dark:text-[#71717a] text-sm mb-6 flex-1">
                {workload.description}
              </p>
              
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#6b7280] dark:text-[#71717a] uppercase tracking-wider">Architecture</p>
                <div className="flex items-center space-x-2 text-sm text-[#111827] dark:text-[#f1f5f9]">
                  {workload.components.map((c, i) => (
                    <React.Fragment key={c.id}>
                      <span title={c.name}>{c.icon}</span>
                      {i < workload.components.length - 1 && <span className="text-[#6b7280] dark:text-[#71717a] text-xs">&rarr;</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#dde0f0] dark:border-[#1e1e38] text-sm font-medium text-[#2563eb] dark:text-[#818cf8] flex justify-between items-center">
                Configure & Compare <span>&rarr;</span>
              </div>
            </Link>
          ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
