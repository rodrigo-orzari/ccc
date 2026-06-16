'use client';

import React from 'react';
import Link from 'next/link';

const SITE_URL = 'https://comparecloudcosts.com';
const SHARE_TEXT = 'Check this out, comparecloudcosts.com is a tool that helps you compare prices of services across AWS, Microsoft, Google, Oracle, DigitalOcean, and Alibaba. #FinOps #CCC';

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function WorkloadHeader() {
  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const shareOnX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <header className="bg-[#eef0fc] dark:bg-[#0c0c1e] border-b border-[#dde0f0] dark:border-[#1e1e38] h-[44px] px-[1.5rem] flex justify-between items-center w-full">
      <Link 
        href="/" 
        className="hover:opacity-80 transition-opacity flex items-center gap-1"
        style={{ textDecoration: 'none' }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text, #111827)', letterSpacing: '-0.01em' }} className="dark:text-[#f1f5f9]">
          &larr; Compare Cloud Costs
        </span>
      </Link>
      
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 10, fontWeight: 500, color: '#6b7280', whiteSpace: 'nowrap' }} className="hidden sm:inline dark:text-[#71717a]">
          Share with friends and family
        </span>
        <button onClick={shareOnLinkedIn} className="text-[#6b7280] hover:text-[#0A66C2] dark:text-[#71717a] transition-colors bg-transparent border-none cursor-pointer flex items-center p-0" title="Share on LinkedIn">
          <LinkedInIcon />
        </button>
        <button onClick={shareOnX} className="text-[#6b7280] hover:text-[#111827] dark:hover:text-[#f1f5f9] dark:text-[#71717a] transition-colors bg-transparent border-none cursor-pointer flex items-center p-0" title="Share on X">
          <XIcon />
        </button>
      </div>
    </header>
  );
}
