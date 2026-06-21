'use client';

import React from 'react';

interface ProviderCardProps {
  id: string;
  name: string;
  color: string;
  soon?: boolean;
  isSelected: boolean;
  displayCount: number;
  onSelect: (providerId: string, soon?: boolean) => void;
}

interface DBStatusProvider {
  slug: string;
  count: string | number;
}

interface ProviderCardsProps {
  providers: { id: string; name: string; color: string; soon?: boolean }[];
  selectedProviders: string[];
  providerCounts: Record<string, number>;
  dbStatusProviders?: DBStatusProvider[];
  isInitialFetch?: boolean;
  onProviderSelect: (providerId: string) => void;
}

export default function ProviderCards({
  providers,
  selectedProviders,
  providerCounts,
  dbStatusProviders = [],
  isInitialFetch = false,
  onProviderSelect,
}: ProviderCardsProps) {
  const activeNonSoon = providers.filter(p => !p.soon).map(p => p.id);

  return (
    <div className="p-4 lg:p-6 bg-white dark:bg-[#0a0a18]">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-row gap-px rounded overflow-hidden border border-[#dde0f0] dark:border-[#1e1e38]" style={{ background: 'var(--border-color, #dde0f0)' }}>
        {[...providers]
          .filter(p => !p.soon)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((p, idx) => {
            const isSelected = selectedProviders.length === activeNonSoon.length || selectedProviders.includes(p.id);
            const filteredCount = providerCounts[p.id];
            const dbProvider = dbStatusProviders?.find(dp => dp.slug === p.id || dp.slug === p.name.toLowerCase());
            const dbCount = dbProvider ? (typeof dbProvider.count === 'string' ? parseInt(dbProvider.count) : dbProvider.count) : 0;
            const displayCount = isSelected ? (isInitialFetch ? dbCount : filteredCount || 0) : 0;

            return (
              <div
                key={p.id}
                onClick={() => {
                  if (selectedProviders.includes(p.id) && selectedProviders.length === 1) {
                    onProviderSelect(p.id);
                  } else {
                    onProviderSelect(p.id);
                  }
                }}
                className={`lg:flex-1 min-w-0 bg-white dark:bg-[#0a0a18] px-3 py-3 lg:px-4 lg:py-3.5 flex flex-col gap-2 cursor-pointer group transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                }`}
              >
                <span
                  className="px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest border w-fit"
                  style={{ color: p.color, borderColor: p.color + '40', backgroundColor: p.color + '10' }}
                >
                  {p.name}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[20px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums leading-none">{displayCount.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
