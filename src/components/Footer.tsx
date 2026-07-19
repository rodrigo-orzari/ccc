'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#050505] py-2 px-4 shrink-0 z-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-medium text-[#737373] dark:text-[#a3a3a3]">
          <a
            href="https://connect.intuit.com/pay/comparecloudcosts/scs-v1-824a8961cf5a42edb4a9669eadc326d633c0e43cb25c449994ebf699ef3f754543e8bdeece91480e82e233bb2fd5f5c5-0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Buy me a coffee ☕
          </a>
        </div>
        <div className="text-[9px] text-[#a3a3a3] dark:text-[#737373]">
          &copy; {new Date().getFullYear()} Co-Sell Plus LLC. Compare Cloud Costs is a Co-Sell Plus LLC product.
        </div>
      </div>
    </footer>
  );
}
