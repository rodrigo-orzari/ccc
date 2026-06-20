import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Providers from './providers';

import { DonationModal } from '@/components';

export const metadata: Metadata = {
  metadataBase: new URL('https://comparecloudcosts.com'),
  title: {
    default: 'Compare Cloud Costs - AWS, Azure, Google Cloud Pricing',
    template: '%s | Compare Cloud Costs',
  },
  description: 'Compare compute, database, and serverless pricing across AWS, Azure, Google Cloud, Oracle, and DigitalOcean.',
  keywords: ['Cloud Computing', 'AWS Pricing', 'Azure Pricing', 'Google Cloud Pricing', 'Cloud Cost Comparison', 'FinOps', 'Cloud Databases', 'Serverless Pricing'],
  authors: [{ name: 'Compare Cloud Costs' }],
  creator: 'Compare Cloud Costs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://comparecloudcosts.com',
    title: 'Compare Cloud Costs - AWS, Azure, Google Cloud Pricing',
    description: 'Instantly compare compute, database, and serverless pricing across major cloud providers.',
    siteName: 'Compare Cloud Costs',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Compare Cloud Costs Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Cloud Costs',
    description: 'Instantly compare compute, database, and serverless pricing across major cloud providers.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
