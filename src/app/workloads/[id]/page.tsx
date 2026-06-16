'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Footer, WorkloadHeader } from '@/components';
import { WORKLOADS } from '@/config/workloads';
import { WorkloadDefinition } from '@/types';

function ArchitectureDiagram({ workload }: { workload: WorkloadDefinition }) {
  return (
    <div className="bg-[#eef0fc] dark:bg-[#0c0c1e] border border-[#dde0f0] dark:border-[#1e1e38] rounded-lg p-6 mb-8 flex flex-col items-center overflow-x-auto">
      <h3 className="text-sm font-semibold text-[#6b7280] dark:text-[#71717a] uppercase tracking-wider mb-6 w-full text-left">
        Full Stack Architecture
      </h3>
      <div className="flex flex-col items-center">
        <div className="bg-[#dde0f0] dark:bg-[#1e1e38] text-sm py-2 px-6 rounded shadow mb-4">
          <span className="font-medium text-[#111827] dark:text-[#f1f5f9]">Users / API</span>
        </div>
        
        {workload.components.map((component, idx) => (
          <React.Fragment key={component.id}>
            <div className="text-[#6b7280] dark:text-[#71717a] mb-4">&darr;</div>
            <div className="bg-[#f7f8ff] dark:bg-[#06060f] border border-[#dde0f0] dark:border-[#1e1e38] rounded-lg py-4 px-6 shadow-lg min-w-[250px] flex items-center space-x-4">
              <div className="text-3xl text-[#2563eb] dark:text-[#818cf8] bg-blue-500/10 p-3 rounded-full">
                {component.icon}
              </div>
              <div>
                <div className="font-semibold text-[#111827] dark:text-[#f1f5f9]">{component.name}</div>
                <div className="text-xs text-[#6b7280] dark:text-[#71717a]">{component.description}</div>
              </div>
            </div>
          </React.Fragment>
        ))}
        
        <div className="text-[#6b7280] dark:text-[#71717a] my-4">&darr;</div>
        <div className="bg-[#dde0f0] dark:bg-[#1e1e38] text-sm py-2 px-6 rounded shadow">
          <span className="font-medium text-[#111827] dark:text-[#f1f5f9]">Result / Response</span>
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
  const [region, setRegion] = useState('Global');
  const [pricingModel, setPricingModel] = useState<'PAYG' | 'Yearly'>('PAYG');

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
          body: JSON.stringify({ workloadId: workload.id, parameters, region }),
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
  }, [parameters, region, workload]);

  if (!workload) return <div className="p-8 text-center">Workload not found</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8ff] dark:bg-[#06060f] text-[#111827] dark:text-[#f1f5f9] font-sans">
      <WorkloadHeader />

      <main className="flex-1 p-6 md:p-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Filters & Parameters */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          
          {/* Pricing Model Toggle */}
          <div className="bg-[#eef0fc] dark:bg-[#0c0c1e] border border-[#dde0f0] dark:border-[#1e1e38] rounded-lg p-6">
            <h3 className="text-[10px] font-bold mb-4 border-b border-[#dde0f0] dark:border-[#1e1e38] pb-2 uppercase tracking-widest text-[#737373]">Pricing Model</h3>
            <div className="flex bg-[#dde0f0] dark:bg-[#1e1e38] rounded p-1 mb-2">
              <button
                onClick={() => setPricingModel('PAYG')}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${pricingModel === 'PAYG' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}
              >
                PAYG
              </button>
              <button
                onClick={() => setPricingModel('Yearly')}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${pricingModel === 'Yearly' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}
              >
                Yearly
              </button>
            </div>
            <p className="text-[10px] text-[#6b7280] dark:text-[#71717a] mt-2 leading-relaxed">
              PAYG shows the monthly on-demand cost. Yearly multiplies this by 12 (no committed-use discounts applied).
            </p>
          </div>

          {/* Region Selector */}
          <div className="bg-[#eef0fc] dark:bg-[#0c0c1e] border border-[#dde0f0] dark:border-[#1e1e38] rounded-lg p-6">
            <h3 className="text-[10px] font-bold mb-4 border-b border-[#dde0f0] dark:border-[#1e1e38] pb-2 uppercase tracking-widest text-[#737373]">Region</h3>
            <div className="flex flex-wrap gap-2">
              {['Global', 'US East', 'US West', 'Europe', 'Asia Pacific', 'South America'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setRegion(opt)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                    region === opt
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#eef0fc] dark:bg-[#0c0c1e] border border-[#dde0f0] dark:border-[#1e1e38] rounded-lg p-6">
            <h3 className="text-[10px] font-bold mb-4 border-b border-[#dde0f0] dark:border-[#1e1e38] pb-2 uppercase tracking-widest text-[#737373]">Workload Scale</h3>
            <div className="space-y-6">
              {workload.parameters.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-[#111827] dark:text-[#f1f5f9]">{p.label}</label>
                    <span className="text-[10px] font-bold bg-[#dde0f0] dark:bg-[#1e1e38] px-2 py-1 rounded text-[#111827] dark:text-[#f1f5f9]">
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
                    className="w-full accent-[#2563eb] dark:accent-[#818cf8] cursor-pointer h-1.5 bg-[#dde0f0] dark:bg-[#1e1e38] rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-[#6b7280] dark:text-[#71717a] mt-1 font-mono">
                    <span>{p.min}</span>
                    <span>{p.max}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Content: Pricing Table */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="bg-[#eef0fc] dark:bg-[#0c0c1e] border border-[#dde0f0] dark:border-[#1e1e38] rounded-lg p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-1">Total {pricingModel === 'Yearly' ? 'Yearly' : 'Monthly'} Cost</h3>
            <p className="text-sm text-[#6b7280] dark:text-[#71717a] mb-6">Cheapest matching components aggregated across providers</p>
            
            {loading && !results ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb] dark:border-[#818cf8]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-[#dde0f0] dark:border-[#1e1e38] text-sm text-[#6b7280] dark:text-[#71717a]">
                      <th className="py-3 px-4 font-semibold uppercase tracking-wider text-xs">Service</th>
                      {['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'alibaba'].map(provider => (
                        <th key={provider} className="py-3 px-4 font-semibold tracking-wider text-xs">
                          <div className="flex items-center space-x-2 border border-[#dde0f0] dark:border-[#1e1e38] rounded px-2 py-1 w-max bg-[#f7f8ff] dark:bg-[#06060f]">
                            <img src={`/providers/${provider}.svg`} alt={provider} className="w-4 h-4 rounded-sm object-contain bg-white p-0.5" onError={(e) => e.currentTarget.style.display='none'} />
                            <span className="capitalize">{provider === 'aws' ? 'AWS' : provider === 'gcp' ? 'Google' : provider === 'digitalocean' ? 'DO' : provider}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dde0f0] dark:divide-[#1e1e38]">
                    {workload.components.map(c => {
                      const multiplier = pricingModel === 'Yearly' ? 12 : 1;
                      return (
                        <tr key={c.id} className="hover:bg-[#e8eaf8] dark:hover:bg-[#10102a] transition-colors">
                          <td className="py-4 px-4 font-medium text-[#111827] dark:text-[#f1f5f9] flex items-center space-x-2">
                            <span>{c.icon}</span>
                            <span>{c.name}</span>
                          </td>
                          {['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'alibaba'].map(provider => {
                            if (!results || !results[provider]) {
                              return <td key={provider} className="py-4 px-4">...</td>;
                            }
                            const comp = results[provider].components.find((x: any) => x.componentId === c.id);
                            if (!comp || comp.monthlyPrice === 0) {
                              return <td key={provider} className="py-4 px-4 text-[#6b7280] dark:text-[#71717a] text-sm">Unavailable</td>;
                            }
                            return (
                              <td key={provider} className="py-4 px-4">
                                <div className="text-sm text-[#111827] dark:text-[#f1f5f9]">${(comp.monthlyPrice * multiplier).toFixed(2)}</div>
                                <div className="text-xs text-[#6b7280] dark:text-[#71717a] max-w-[120px] truncate" title={comp.instanceType}>
                                  {comp.quantity > 1 ? `${comp.quantity}x ` : ''}{comp.instanceType}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    
                    {/* Total Row */}
                    <tr className="bg-[#eef0fc] dark:bg-[#0c0c1e] border-t-2 border-[#dde0f0] dark:border-[#1e1e38]">
                      <td className="py-4 px-4 font-bold text-[#111827] dark:text-[#f1f5f9] uppercase tracking-wider text-xs">
                        Total / {pricingModel === 'Yearly' ? 'Year' : 'Month'}
                      </td>
                      {['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'alibaba'].map(provider => {
                        if (!results || !results[provider]) return <td key={provider} className="py-4 px-4"></td>;
                        const pData = results[provider];
                        const isUnavailable = pData.components.some((c: any) => c.monthlyPrice === 0 && c.instanceType !== 'Not available');
                        const multiplier = pricingModel === 'Yearly' ? 12 : 1;
                        return (
                          <td key={provider} className="py-4 px-4 text-left font-bold text-lg">
                            {isUnavailable || pData.total === 0 ? (
                              <span className="text-[#6b7280] dark:text-[#71717a]">N/A</span>
                            ) : (
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-purple-500 dark:from-blue-400 dark:to-purple-400">
                                ${(pData.total * multiplier).toFixed(2)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Content: Diagram */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          <ArchitectureDiagram workload={workload} />
        </div>

      </main>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 mb-8">
         <div className="bg-[#eef0fc]/50 dark:bg-[#0c0c1e]/50 border border-[#dde0f0] dark:border-[#1e1e38] rounded p-4 text-xs text-[#6b7280] dark:text-[#71717a]">
            <strong className="text-[#111827] dark:text-[#f1f5f9]">Assumptions & Disclaimer:</strong> This architecture calculator is conceptual and designed for comparison purposes. The algorithm auto-selects the cheapest matching general-purpose infrastructure components available in our database that satisfy the raw memory and compute minimums derived from your scale parameters. It does not account for complex licensing, bandwidth egress fees, custom integrations, or specific platform limitations. Please consult official provider documentation for exact sizing before production deployments.
         </div>
      </div>

      <Footer />
    </div>
  );
}
