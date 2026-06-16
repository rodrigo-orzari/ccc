import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Providers from './providers';

import { DonationModal } from '@/components';

export const metadata: Metadata = {
  title: 'comparecloudcosts.com - AWS, Azure, Google Cloud Pricing',
  description: 'Compare compute, database, and serverless pricing across AWS, Azure, Google Cloud, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "x5qbwzlke6");
          `}
        </Script>
      </head>
      <body className="bg-gray-900 text-gray-100 min-h-screen">
        <Providers>
          {children}
          <DonationModal />
        </Providers>
      </body>
    </html>
  );
}
