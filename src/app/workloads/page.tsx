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
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 border-b border-gray-700 py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Compare Cloud Costs
          </h1>
          <p className="text-sm text-gray-400">Workload Architecture Catalog</p>
        </div>
        <Link 
          href="/" 
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm font-medium rounded transition-colors"
        >
          &larr; Back to Services
        </Link>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Cloud Starter Kits & Workloads</h2>
            <p className="text-gray-400 max-w-3xl">
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
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 transition-colors"
            />
          </div>
        </div>

        {filteredWorkloads.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-300">No workloads found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkloads.map((workload) => (
            <Link 
              key={workload.id} 
              href={`/workloads/${workload.id}`}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all flex flex-col group cursor-pointer"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">
                {workload.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                {workload.name}
              </h3>
              <p className="text-gray-400 text-sm mb-6 flex-1">
                {workload.description}
              </p>
              
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Architecture</p>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  {workload.components.map((c, i) => (
                    <React.Fragment key={c.id}>
                      <span title={c.name}>{c.icon}</span>
                      {i < workload.components.length - 1 && <span className="text-gray-600 text-xs">&rarr;</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700 text-sm font-medium text-blue-400 flex justify-between items-center">
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
