'use client';

import React from 'react';
import { Search, Download } from 'lucide-react';

interface TableToolbarProps {
  totalFilteredCount: number;
  dataLength: number;
  search: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  isExporting?: boolean;
}

export default function TableToolbar({
  totalFilteredCount,
  dataLength,
  search,
  onSearchChange,
  onExport,
  isExporting = false,
}: TableToolbarProps) {
  return (
    <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-[#000000] border-b border-[#e5e5e5] dark:border-[#262626]">
      <div className="flex items-center gap-6">
        <span className="text-xl font-bold text-black dark:text-white shrink-0">
          {totalFilteredCount.toLocaleString()}
          {totalFilteredCount > dataLength && dataLength > 0 && (
            <span className="ml-2 text-[10px] font-normal text-[#a3a3a3]">(top {dataLength.toLocaleString()} shown)</span>
          )}
        </span>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded px-10 py-2 text-xs w-48 md:w-64 focus:outline-none focus:border-black/10 dark:focus:border-white/20 transition-all placeholder:text-[#a3a3a3]"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-[#737373] dark:text-[#525252] font-medium">Click a column header to sort</span>

        <button
          onClick={onExport}
          disabled={dataLength === 0 || isExporting}
          className="flex items-center gap-2 text-[10px] font-bold text-[#737373] dark:text-[#a3a3a3] border border-[#e5e5e5] dark:border-[#262626] px-3 py-1.5 rounded hover:bg-[#f5f5f5] dark:hover:bg-[#171717] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={12} /> {isExporting ? 'Exporting...' : 'Export'}
        </button>
      </div>
    </div>
  );
}
