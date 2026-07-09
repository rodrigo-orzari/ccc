import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cloud Compliance Certifications by Provider',
  description:
    'Compare which security, privacy, industry, and government compliance certifications — ISO 27001, SOC 2, PCI DSS, HIPAA, FedRAMP, GDPR, IRAP, C5 and more — AWS, Azure, Google Cloud, Oracle, Alibaba, Cloudflare, and DigitalOcean hold.',
  alternates: { canonical: '/certifications' },
};

export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
