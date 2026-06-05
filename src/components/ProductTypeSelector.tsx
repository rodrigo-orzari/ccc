'use client';

import React from 'react';
import type { ProductType } from '@/types';

const PRODUCT_TYPES: { id: ProductType; label: string; emoji: string; soon?: boolean }[] = [
  { id: 'vm', label: 'Virtual Machines', emoji: '🖥️' },
  { id: 'database', label: 'Databases', emoji: '🗄️' },
  { id: 'serverless', label: 'Serverless', emoji: '⚡' },
  { id: 'containers', label: 'Containers', emoji: '📦' },
  { id: 'networking', label: 'Networking', emoji: '🌐' },
  { id: 'data-analytics', label: 'Data & Analytics', emoji: '📊' },
  { id: 'ai', label: 'Artificial Intelligence', emoji: '🧠', soon: true },
];

interface ProductTypeSelectorProps {
  activeProductType: ProductType;
  onProductTypeChange: (type: ProductType) => void;
}

export default function ProductTypeSelector({
  activeProductType,
  onProductTypeChange,
}: ProductTypeSelectorProps) {
  return (
    <div className="h-10 border-b border-[#e5e5e5] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#080808] flex items-center px-4 overflow-x-auto no-scrollbar shrink-0">
      <div className="flex items-center gap-6">
        {PRODUCT_TYPES.map(product => (
          <button
            key={product.id}
            onClick={() => !product.soon && onProductTypeChange(product.id)}
            disabled={product.soon}
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
              activeProductType === product.id
                ? 'bg-white dark:bg-[#171717] shadow-sm border-[#e5e5e5] dark:border-[#262626] cursor-default'
                : 'border-transparent text-[#737373] hover:text-black dark:hover:text-white opacity-60 hover:opacity-100'
            } ${product.soon ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <span className={`text-xs font-bold flex items-center gap-1.5 ${activeProductType !== product.id ? 'font-medium' : ''}`}>
              {product.emoji} {product.label}
            </span>
            {product.soon && (
              <span className="text-[8px] font-bold bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] px-1 rounded uppercase tracking-tighter">
                Soon
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
