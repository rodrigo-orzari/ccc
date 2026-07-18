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
  providers: { id: string; name: string; color: string; soon?: boolean; providerType?: 'hyperscaler' | 'specialized' }[];
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

  const renderGrid = (group: typeof providers) => (
    <div
      className="grid gap-px bg-[#dde0f0] dark:bg-[#1e1e38] border border-[#dde0f0] dark:border-[#1e1e38] rounded-lg overflow-hidden"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}
    >
      {[...group]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((p) => {
          const isSelected = selectedProviders.length === activeNonSoon.length || selectedProviders.includes(p.id);
          const filteredCount = providerCounts[p.id];
          const dbProvider = dbStatusProviders?.find(dp => dp.slug === p.id || dp.slug === p.name.toLowerCase());
          const dbCount = dbProvider ? (typeof dbProvider.count === 'string' ? parseInt(dbProvider.count) : dbProvider.count) : 0;
          const displayCount = isSelected ? (isInitialFetch ? dbCount : filteredCount || 0) : 0;

          return (
            <button
              key={p.id}
              onClick={() => onProviderSelect(p.id)}
              title={isSelected ? `Click to show only ${p.name}` : `Click to include ${p.name}`}
              className="text-left px-4 py-3 bg-white dark:bg-[#0a0a18] cursor-pointer transition-colors hover:bg-[#f7f8ff] dark:hover:bg-[#10102a]"
            >
              <div className={isSelected ? '' : 'opacity-40'}>
                <div
                  className="text-[11px] font-bold uppercase tracking-widest mb-1 truncate"
                  style={{ color: p.color }}
                >
                  {p.name}
                </div>
                <div className="text-2xl font-black leading-none text-[#1a1a2e] dark:text-[#f7f8ff] tabular-nums">
                  {displayCount.toLocaleString()}
                </div>
              </div>
            </button>
          );
        })}
    </div>
  );

  const nonSoon = providers.filter(p => !p.soon);
  const hyperscalers = nonSoon.filter(p => p.providerType !== 'specialized');
  const specialized = nonSoon.filter(p => p.providerType === 'specialized');

  return (
    <div className="px-4 py-3 lg:px-6 lg:py-4 bg-white dark:bg-[#0a0a18] space-y-3">
      {/* Provider summary — connected-card grid mirroring the Status page summary cards.
          Each card is click-to-filter; deselected providers are dimmed. Split into
          Cloud Platforms (hyperscalers) and Specialized Providers so e.g. OpenAI
          doesn't read as a peer of AWS. */}
      {hyperscalers.length > 0 && (
        <div className="space-y-1.5">
          {specialized.length > 0 && (
            <div className="text-[9px] font-bold text-[#a3a3a3] dark:text-[#525252] uppercase tracking-widest pl-0.5">
              Cloud Platforms
            </div>
          )}
          {renderGrid(hyperscalers)}
        </div>
      )}
      {specialized.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[9px] font-bold text-[#a3a3a3] dark:text-[#525252] uppercase tracking-widest pl-0.5">
            Specialized Providers
          </div>
          {renderGrid(specialized)}
        </div>
      )}
    </div>
  );
}
