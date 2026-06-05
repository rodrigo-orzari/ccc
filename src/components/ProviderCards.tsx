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
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#e5e5e5] dark:bg-[#262626]">
      {providers
        .filter(p => !p.soon)
        .map(p => {
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
              className={`bg-white dark:bg-[#000000] py-2.5 px-4 flex items-center justify-between group transition-all border-b-2 cursor-pointer ${
                isSelected ? 'border-black dark:border-white' : 'border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                  style={{ color: p.color, borderColor: p.color + '50', backgroundColor: p.color + '18' }}
                >
                  {p.name}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-black dark:text-white">{displayCount.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
}
