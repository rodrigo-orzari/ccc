'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Footer } from '@/components';
import { WORKLOADS } from '@/config/workloads';
import { WorkloadDefinition, WorkloadParameter } from '@/types';

function ArchitectureDiagram({ workload }: { workload: WorkloadDefinition }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8 flex flex-col items-center overflow-x-auto">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 w-full text-left">
        Full Stack Architecture
      </h3>
      <div className="flex flex-col items-center">
        <div className="bg-gray-700 text-sm py-2 px-6 rounded shadow mb-4">
          <span className="font-medium text-gray-200">Users / API</span>
        </div>
        
        {workload.components.map((component, idx) => (
          <React.Fragment key={component.id}>
            <div className="text-gray-500 mb-4">&darr;</div>
            <div className="bg-gray-900 border border-gray-600 rounded-lg py-4 px-6 shadow-lg min-w-[250px] flex items-center space-x-4">
              <div className="text-3xl text-blue-400 bg-blue-500/10 p-3 rounded-full">
                {component.icon}
              </div>
              <div>
                <div className="font-semibold text-gray-100">{component.name}</div>
                <div className="text-xs text-gray-400">{component.description}</div>
              </div>
            </div>
          </React.Fragment>
        ))}
        
        <div className="text-gray-500 my-4">&darr;</div>
        <div className="bg-gray-700 text-sm py-2 px-6 rounded shadow">
          <span className="font-medium text-gray-200">Result / Response</span>
        </div>
      </div>
    </div>
  );
}

export default function WorkloadDetails() {
  const params = useParams();
  const id = params.id as string;
  const workload = WORKLOADS.find((w) => w.id === id);

  const [parameters, setParameters] = useState<Record<string, number>>({});
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Initialize defaults
  useEffect(() => {
    if (workload) {
      const initial: Record<string, number> = {};
      workload.parameters.forEach(p => {
        initial[p.id] = p.defaultValue;
      });
      setParameters(initial);
    }
  }, [workload]);

  // Fetch pricing
  useEffect(() => {
    if (!workload || Object.keys(parameters).length === 0) return;
    
    const fetchPricing = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/workloads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workloadId: workload.id, parameters }),
        });
        const data = await res.json();
        setResults(data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchPricing, 300);
    return () => clearTimeout(debounce);
  }, [parameters, workload]);

  if (!workload) return <div className="p-8 text-center">Workload not found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 border-b border-gray-700 py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Compare Cloud Costs
          </h1>
          <p className="text-sm text-gray-400">{workload.name}</p>
        </div>
        <Link 
          href="/workloads" 
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm font-medium rounded transition-colors"
        >
          &larr; Back to Catalog
        </Link>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Diagram & Parameters */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <ArchitectureDiagram workload={workload} />

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Workload Scale</h3>
            <div className="space-y-6">
              {workload.parameters.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-300">{p.label}</label>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {parameters[p.id]} {p.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={parameters[p.id] || p.defaultValue}
                    onChange={(e) => setParameters({...parameters, [p.id]: Number(e.target.value)})}
                    className="w-full accent-blue-500 cursor-pointer h-2 bg-gray-700 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{p.min}</span>
                    <span>{p.max}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Pricing Table */}
        <div className="lg:col-span-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-1">Total Monthly Cost</h3>
            <p className="text-sm text-gray-400 mb-6">Cheapest matching components aggregated across providers</p>
            
            {loading && !results ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-gray-700 text-sm text-gray-400">
                      <th className="py-3 px-4 font-semibold uppercase tracking-wider">Provider</th>
                      {workload.components.map(c => (
                        <th key={c.id} className="py-3 px-4 font-semibold uppercase tracking-wider">
                          {c.name}
                        </th>
                      ))}
                      <th className="py-3 px-4 font-bold text-blue-400 uppercase tracking-wider text-right">
                        Total / Month
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'alibaba'].map((provider) => {
                      if (!results || !results[provider]) return null;
                      const pData = results[provider];
                      
                      // Find if any component is unavailable
                      const isUnavailable = pData.components.some((c: any) => c.monthlyPrice === 0 && c.instanceType !== 'Not available');

                      return (
                        <tr key={provider} className="hover:bg-gray-700/50 transition-colors">
                          <td className="py-4 px-4 font-medium capitalize flex items-center space-x-2">
                            <img src={`/providers/${provider}.svg`} alt={provider} className="w-5 h-5 rounded-sm object-contain bg-white p-0.5" onError={(e) => e.currentTarget.style.display='none'} />
                            <span>{provider === 'aws' ? 'AWS' : provider === 'gcp' ? 'Google Cloud' : provider}</span>
                          </td>
                          
                          {workload.components.map(c => {
                            const comp = pData.components.find((x: any) => x.componentId === c.id);
                            if (!comp || comp.monthlyPrice === 0) {
                              return <td key={c.id} className="py-4 px-4 text-gray-500 text-sm">Unavailable</td>;
                            }
                            return (
                              <td key={c.id} className="py-4 px-4">
                                <div className="text-sm text-gray-200">${comp.monthlyPrice.toFixed(2)}</div>
                                <div className="text-xs text-gray-500 max-w-[150px] truncate" title={comp.instanceType}>
                                  {comp.quantity > 1 ? `${comp.quantity}x ` : ''}{comp.instanceType}
                                </div>
                              </td>
                            );
                          })}

                          <td className="py-4 px-4 text-right font-bold text-lg">
                            {isUnavailable || pData.total === 0 ? (
                              <span className="text-gray-500">N/A</span>
                            ) : (
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                ${pData.total.toFixed(2)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </main>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 mb-8">
         <div className="bg-gray-800/50 border border-gray-700/50 rounded p-4 text-xs text-gray-400">
            <strong className="text-gray-300">Assumptions & Disclaimer:</strong> This architecture calculator is conceptual and designed for comparison purposes. The algorithm auto-selects the cheapest matching general-purpose infrastructure components available in our database that satisfy the raw memory and compute minimums derived from your scale parameters. It does not account for complex licensing, bandwidth egress fees, custom integrations, or specific platform limitations. Please consult official provider documentation for exact sizing before production deployments.
         </div>
      </div>

      <Footer />
    </div>
  );
}
