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

export default function Footer() {
  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const shareOnX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <footer className="border-t border-[#e5e5e5] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#050505] py-2 px-4 shrink-0 z-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-medium text-[#737373] dark:text-[#a3a3a3]">
          <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">
            About
          </Link>
          <Link href="/docs" className="hover:text-black dark:hover:text-white transition-colors">
            Docs
          </Link>
          {/* Cloud Products page hidden from nav for now — still reachable at /cloud-products */}
          <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="/status" className="hover:text-black dark:hover:text-white transition-colors">
            Status
          </Link>
          <a href="mailto:hello@comparecloudcosts.com" className="hover:text-black dark:hover:text-white transition-colors">
            Contact
          </a>

          <a
            href="https://connect.intuit.com/pay/comparecloudcosts/scs-v1-824a8961cf5a42edb4a9669eadc326d633c0e43cb25c449994ebf699ef3f754543e8bdeece91480e82e233bb2fd5f5c5-0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Buy me a coffee ☕
          </a>

          <a
            href="https://www.digitalocean.com/?refcode=23d2b384f3b1&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg className="w-3 h-3 fill-[#0080FF]" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.04 0C5.408-.02.005 5.37.005 11.992h4.638c0-4.923 4.882-8.731 10.064-6.855a6.95 6.95 0 014.147 4.148c1.889 5.177-1.924 10.055-6.84 10.064v-4.61H7.391v4.623h4.61V24c7.86 0 13.967-7.588 11.397-15.83-1.115-3.59-3.985-6.446-7.575-7.575A12.8 12.8 0 0012.039 0zM7.39 19.362H3.828v3.564H7.39zm-3.563 0v-2.978H.85v2.978z" />
            </svg>
            DigitalOcean
          </a>

          <a
            href="https://github.com/rodrigo-orzari/ccc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </a>

          <span className="whitespace-nowrap hidden sm:inline">
            Share with friends and family
          </span>
          <button
            onClick={shareOnLinkedIn}
            title="Share on LinkedIn"
            className="text-[#737373] dark:text-[#a3a3a3] hover:text-[#0A66C2] transition-colors flex items-center"
          >
            <LinkedInIcon />
          </button>
          <button
            onClick={shareOnX}
            title="Share on X"
            className="text-[#737373] dark:text-[#a3a3a3] hover:text-black dark:hover:text-[#f7f8ff] transition-colors flex items-center"
          >
            <XIcon />
          </button>
        </div>
      </div>
    </footer>
  );
}
