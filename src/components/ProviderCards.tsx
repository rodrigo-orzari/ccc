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
    <div className="px-4 py-2 lg:px-6 lg:py-2.5 bg-white dark:bg-[#0a0a18] flex justify-center">
      <div className="flex flex-row gap-2 flex-wrap items-center justify-center">
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
                className={`px-2.5 py-1.5 rounded border cursor-pointer group transition-opacity flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white dark:bg-[#0a0a18] border-[#dde0f0] dark:border-[#1e1e38]'
                    : 'opacity-50 hover:opacity-75 bg-white dark:bg-[#0a0a18] border-[#dde0f0] dark:border-[#1e1e38]'
                }`}
              >
                <span
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: p.color }}
                >
                  {p.name}
                </span>
                <span className="text-[13px] font-black text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">{displayCount.toLocaleString()}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
