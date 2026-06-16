'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function DonationModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  useEffect(() => {
    if (!pathname) return;

    // Check if the user has opted out of the popup permanently
    const hideDonationModal = localStorage.getItem('hideDonationModal');
    if (hideDonationModal === 'true') {
      return;
    }

    // Determine current context (workloads vs everywhere else)
    const context = pathname.startsWith('/workloads') ? 'workloads' : 'main';

    // Check if they already dismissed it in this context during this session
    const dismissedContext = sessionStorage.getItem(`hideDonationModal_${context}`);
    if (dismissedContext === 'true') {
      return;
    }

    // Otherwise, wait 1.5s and show it
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleYes = () => {
    if (doNotShowAgain) {
      localStorage.setItem('hideDonationModal', 'true');
    } else {
      // If they say yes but didn't check 'Do not show again', we still 
      // want to stop bugging them for this session in this context.
      const context = pathname?.startsWith('/workloads') ? 'workloads' : 'main';
      sessionStorage.setItem(`hideDonationModal_${context}`, 'true');
    }
    // Open the Intuit connect donation link in a new tab
    window.open(
      'https://connect.intuit.com/pay/comparecloudcosts/scs-v1-d4824657f6fd4f78a6856dc5e82dd2429767f2a940be417e91832e441461fa61acbb2640b33e45d295200d2aafb687ca',
      '_blank'
    );
    setIsOpen(false);
  };

  const handleNo = () => {
    if (doNotShowAgain) {
      localStorage.setItem('hideDonationModal', 'true');
    } else {
      const context = pathname?.startsWith('/workloads') ? 'workloads' : 'main';
      sessionStorage.setItem(`hideDonationModal_${context}`, 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded-xl shadow-2xl p-6 max-w-md w-full relative">
        <h2 className="text-xl font-bold text-black dark:text-white mb-4">Support comparecloudcosts.com ❤️</h2>
        
        <p className="text-sm text-[#404040] dark:text-[#a3a3a3] mb-4 leading-relaxed">
          You can help us keep comparecloudcosts.com as a free offering by making a <strong>$3.99 donation</strong>. 
          This takes over the costs of the API tokens, as well as the cloud computing infrastructure keeping this site alive.
        </p>

        <p className="text-sm text-[#404040] dark:text-[#a3a3a3] mb-6 italic border-l-2 border-[#e5e5e5] dark:border-[#262626] pl-3">
          Hey, just so you know, over <strong>30% of visitors</strong> in the last two months have made a donation to support the project. Every little bit helps us keep the lights on!
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleYes}
            className="w-full py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Yes, I'd like to donate $3.99
          </button>
          
          <button
            onClick={handleNo}
            className="w-full py-2.5 px-4 bg-[#f5f5f5] dark:bg-[#262626] text-[#404040] dark:text-[#a3a3a3] font-medium rounded-lg hover:bg-[#e5e5e5] dark:hover:bg-[#404040] transition-colors"
          >
            No, I don't want to support right now
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-[#737373]">
          <input
            type="checkbox"
            id="doNotShowAgain"
            checked={doNotShowAgain}
            onChange={(e) => setDoNotShowAgain(e.target.checked)}
            className="rounded border-[#d4d4d4] dark:border-[#404040] text-black focus:ring-black dark:bg-[#171717]"
          />
          <label htmlFor="doNotShowAgain" className="cursor-pointer select-none">
            Do not show this again
          </label>
        </div>
      </div>
    </div>
  );
}
