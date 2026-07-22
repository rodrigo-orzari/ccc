'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Footer, Sidebar, DigitalOceanReferralModal, CopyHeading } from '@/components';
import { CERTIFICATIONS_SPONSOR } from '@/config';
import {
  FileUp,
  Cpu,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  Receipt,
  FileSpreadsheet,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

const EVALUATED_BILLS_PROVIDERS = [
  { id: 'aws', name: 'AWS', color: '#FF9900', count: 0 },
  { id: 'azure', name: 'Azure', color: '#00BCFF', count: 0 },
  { id: 'gcp', name: 'Google', color: '#34A853', count: 0 },
  { id: 'digitalocean', name: 'DigitalOcean', color: '#0069FF', count: 0 },
  { id: 'oracle', name: 'Oracle', color: '#F80000', count: 0 },
  { id: 'alibaba', name: 'Alibaba', color: '#FF6A00', count: 0 },
];

const FAQ_ITEMS = [
  {
    question: 'Is my financial or invoice data stored permanently?',
    answer: 'No. Compare Cloud Costs adheres to a strict zero-persistence policy for uploaded bills. Invoices are parsed ephemerally in volatile memory to extract resource specs (vCPU, RAM, storage, DB engines) and are destroyed immediately upon calculation.',
  },
  {
    question: 'How much will the Bring Your Bill service cost?',
    answer: 'The Bring Your Bill tool is free while in preview. Users can access the feature using promotional activation codes during our preview release in exchange for brief feedback on match quality.',
  },
  {
    question: 'Which cloud providers and file formats are supported?',
    answer: 'We support invoices and cost export files from AWS (Cost & Usage Reports, PDF invoices), Microsoft Azure (Enterprise Agreement CSV, PDF bills), Google Cloud Platform (Billing export CSV), DigitalOcean (Itemized PDF), and Oracle Cloud Infrastructure (OCI Cost Reports).',
  },
  {
    question: 'How does the cross-cloud SKU matching engine work?',
    answer: 'Our parsing engine normalizes complex provider line items into standardized compute, database, storage, and networking requirements. It then queries our live 10,000+ SKU pricing database to identify equivalent or higher-performing instance configurations across alternative providers.',
  },
  {
    question: 'How can I access the feature preview?',
    answer: 'During the preview phase, early access is granted using promotional activation codes. Simply enter your code on the upload screen to unlock full bill analysis and CSV report exports.',
  },
];

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="bg-[#f7f8ff] dark:bg-[#06060f] border border-[var(--border)] rounded-lg overflow-hidden divide-y divide-[var(--border)]">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="transition-colors">
            <button
              onClick={() => toggleIndex(idx)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[var(--row-hover)] transition-colors focus:outline-none cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="text-xs lg:text-sm font-bold text-[var(--text)] flex items-center gap-2.5">
                <HelpCircle size={16} className="text-[#2563eb] dark:text-[#818cf8] shrink-0" />
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`text-[var(--muted)] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#2563eb] dark:text-[#818cf8]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-1 text-xs text-[var(--muted)] leading-relaxed pl-11">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BringYourBillPage() {
  const totalEvaluated = EVALUATED_BILLS_PROVIDERS.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="cc-page flex flex-col lg:flex-row min-h-[100dvh] lg:h-screen bg-[var(--bg)] text-[var(--text)] font-sans lg:overflow-hidden">
      <style>{`
        .cc-page {
          --bg: #ffffff;
          --surface: #ffffff;
          --border: #e5e5e5;
          --text: #171717;
          --muted: #737373;
          --row-hover: #fafafa;
        }
        @media (prefers-color-scheme: dark) {
          .cc-page {
            --bg: #000000;
            --surface: #000000;
            --border: #262626;
            --text: #e5e7eb;
            --muted: #a3a3a3;
            --row-hover: #0a0a0a;
          }
        }
      `}</style>
      <Sidebar activeProductType={'bill' as any} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto flex flex-col">
          <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1600px] mx-auto">
            {/* Header — Compliance & Datacenters style rich intro paragraph */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-[var(--text)]">Bring Your Bill</h1>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#2563eb]/10 text-[#2563eb] dark:text-[#818cf8] border border-[#2563eb]/20">
                  Feature Preview
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#d97706] dark:text-[#fbbf24] border border-[#f59e0b]/20">
                  Soon
                </span>
              </div>
              <p className="text-[#737373] dark:text-[#a3a3a3] text-sm leading-relaxed max-w-5xl">
                We are building an automated <strong>Cloud Provider Bill Analyzer &amp; Cross-Cloud Optimization Engine</strong> for Compare Cloud Costs users. Whether you have committed to a primary cloud provider or are seeking fresh perspectives to optimize your infrastructure spend, our engine provides instant best-match alternatives cross-referenced against our live 10,000+ SKU database (check sync state on our <Link href="/status" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold">Status</Link> page). Simply upload your official PDF, CSV, or JSON invoice from <strong>AWS, Azure, Google Cloud, DigitalOcean, or Oracle Cloud</strong> to evaluate equivalent compute, storage, and database configurations with zero persistent data retention. Comparing global physical presence instead? Visit{' '}
                <Link href="/datacenters" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold">Datacenters</Link>{' '}
                to explore regions, or check{' '}
                <Link href="/certifications" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-semibold">Compliance</Link>{' '}
                to review regulatory security standards across providers.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* Sponsorship Box — identical look and feel to Compliance page */}
            {CERTIFICATIONS_SPONSOR ? (
              <a
                href={CERTIFICATIONS_SPONSOR.linkUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mb-8 block rounded overflow-hidden border border-[var(--border)]"
              >
                <img
                  src={CERTIFICATIONS_SPONSOR.imageUrl}
                  alt={`Sponsored by ${CERTIFICATIONS_SPONSOR.companyName}`}
                  width={1200}
                  height={200}
                  className="w-full h-auto aspect-[6/1] object-cover"
                />
              </a>
            ) : (
              <div className="mb-8 border-2 border-dashed border-[var(--border)] rounded bg-[#f7f8ff] dark:bg-[#06060f] p-6 flex flex-col items-center gap-3 text-center">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text)] mb-1 flex items-center justify-center gap-2">
                    Sponsor This Page
                  </h3>
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                    Sponsor this page. Your brand in front of engineers and architects comparing cloud pricing. See <Link href="/docs#advertising" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-bold">Advertising with us</Link>, or email hello@comparecloudcosts.com.
                  </p>
                  <p className="text-[11px] text-[var(--muted)] mt-1.5 opacity-80">
                    Banner spec: 1200 × 200px (6:1 ratio) · PNG, JPG, or WebP. See the <Link href="/docs#advertising-specs" className="underline hover:text-[var(--text)]">Docs</Link> for detailed instructions.
                  </p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* Summary Box — Evaluated Bills Counter by Provider (All zeroes for initial state) */}
            <div className="mb-2">
              <CopyHeading id="evaluated-bills" className="text-xl font-bold mb-1 text-[var(--text)] scroll-mt-6">
                Evaluated bills by cloud provider
              </CopyHeading>
              <span className="text-[10px] text-[var(--muted)]">
                {`Total of ${totalEvaluated.toLocaleString()} cloud invoices evaluated and cross-matched across providers over time during preview.`}
              </span>
            </div>
            <div
              className="grid gap-px rounded-lg overflow-x-auto border border-[var(--border)] bg-[var(--border)] mb-8 scrollbar-thin"
              style={{ gridAutoFlow: 'column', gridAutoColumns: 'minmax(140px, 1fr)' }}
            >
              {EVALUATED_BILLS_PROVIDERS.map((p) => (
                <div key={p.id} className="px-4 py-3.5 bg-[#f7f8ff] dark:bg-[#06060f]">
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-1.5 truncate" style={{ color: p.color }}>
                    {p.name}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black leading-none text-[var(--text)] tabular-nums">{p.count.toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* Hero Cross-Reference Feature Box */}
            <div className="mb-8 p-6 lg:p-8 rounded-xl bg-[#f7f8ff] dark:bg-[#06060f] border border-[var(--border)] shadow-sm relative overflow-hidden">
              <div className="w-full">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#2563eb]/10 text-[#2563eb] dark:text-[#818cf8] text-xs font-bold mb-3 border border-[#2563eb]/20">
                  <Sparkles size={14} /> Free While In Preview
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold mb-3 text-[var(--text)] tracking-tight">
                  Cross-Reference Invoices Across Cloud Providers
                </h2>
                <p className="text-sm text-[#737373] dark:text-[#a3a3a3] leading-relaxed w-full">
                  Even when committed to a primary cloud provider, exploring new perspectives helps engineering and finance teams maximize the ROI of their cloud investments. Our upcoming engine extracts vCPU allocations, RAM specs, storage tiers, database topologies, and network egress bandwidth from your existing invoice, matching every line item against equivalent infrastructure offerings across competing cloud platforms.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <span>Free access during preview</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <span>Zero persistent data retention</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <span>Exportable CSV &amp; PDF reports</span>
                </div>
              </div>
            </div>

            {/* Divider between Cross-Reference Box and How It Works */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* How It Works Section */}
            <div className="mb-10">
              <CopyHeading id="how-it-works" className="text-xl font-bold text-[var(--text)] mb-2">
                How It Works
              </CopyHeading>
              <p className="text-sm text-[#737373] dark:text-[#a3a3a3] mb-6 max-w-5xl leading-relaxed">
                Our bill cross-referencing workflow operates in three streamlined steps, converting raw cloud invoices into actionable optimization tables without exposing or saving your private financial data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="bg-[#f7f8ff] dark:bg-[#06060f] border border-[var(--border)] rounded-lg p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-[#2563eb] dark:text-[#818cf8]">01.</span>
                      <FileUp size={18} className="text-[var(--text)]" />
                      <h3 className="text-sm font-bold text-[var(--text)]">Upload Invoice</h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      Upload your official AWS Cost &amp; Usage Report (CUR), Azure PDF Invoice, or Google Cloud CSV export. The parser handles structured and unstructured billing documents.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] text-[var(--muted)] font-mono">
                    Supported: AWS, Azure, GCP, OCI
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[#f7f8ff] dark:bg-[#06060f] border border-[var(--border)] rounded-lg p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-[#2563eb] dark:text-[#818cf8]">02.</span>
                      <Cpu size={18} className="text-[var(--text)]" />
                      <h3 className="text-sm font-bold text-[var(--text)]">Cross-Match SKUs</h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      Our engine normalizes resource specifications (vCPUs, RAM, IOPS, DB engines) and evaluates equivalent configurations across all supported alternative cloud providers.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] text-[var(--muted)] font-mono flex items-center justify-between">
                    <span>10,000+ SKUs</span>
                    <Link href="/status" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-sans font-semibold">View Status →</Link>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[#f7f8ff] dark:bg-[#06060f] border border-[var(--border)] rounded-lg p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-[#2563eb] dark:text-[#818cf8]">03.</span>
                      <FileSpreadsheet size={18} className="text-[var(--text)]" />
                      <h3 className="text-sm font-bold text-[var(--text)]">Export &amp; Optimize</h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      Review a detailed line-by-line comparison matrix displaying potential monthly savings, alternative instance specs, and download custom CSV reports for your team.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] text-[var(--muted)] font-mono">
                    Download PDF / CSV / Excel reports
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* Key Capabilities Grid */}
            <div className="mb-10">
              <CopyHeading id="capabilities" className="text-xl font-bold text-[var(--text)] mb-2">
                Core Engine Capabilities
              </CopyHeading>
              <p className="text-sm text-[#737373] dark:text-[#a3a3a3] mb-6 max-w-5xl leading-relaxed">
                Designed for cloud financial analysts and infrastructure architects seeking directional multi-cloud cost benchmarks and fresh perspectives without privacy compromises.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[#f7f8ff] dark:bg-[#06060f] border border-[var(--border)] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-[#2563eb] dark:text-[#818cf8]">
                    <ShieldCheck size={18} />
                    <h4 className="text-xs font-bold text-[var(--text)]">Ephemeral Document Processing</h4>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Zero raw invoice retention. Invoices are parsed in volatile memory and purged immediately after generating your comparative analysis report.
                  </p>
                </div>

                <div className="bg-[#f7f8ff] dark:bg-[#06060f] border border-[var(--border)] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-[#2563eb] dark:text-[#818cf8]">
                    <Zap size={18} />
                    <h4 className="text-xs font-bold text-[var(--text)]">Multi-Provider Mapping</h4>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Maps AWS EC2, RDS, S3, and Lambda line items to equivalent services across Azure, Google Cloud, DigitalOcean, and Oracle Cloud Infrastructure.
                  </p>
                </div>

                <div className="bg-[#f7f8ff] dark:bg-[#06060f] border border-[var(--border)] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-[#2563eb] dark:text-[#818cf8]">
                    <Lock size={18} />
                    <h4 className="text-xs font-bold text-[var(--text)]">Preview Access</h4>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Early access is completely free while in preview using promotional activation codes in exchange for feedback on match quality and user experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* Collapsible FAQ Accordion Box */}
            <div className="mb-10">
              <CopyHeading id="faq" className="text-xl font-bold text-[var(--text)] mb-2">
                Frequently Asked Questions
              </CopyHeading>
              <p className="text-sm text-[#737373] dark:text-[#a3a3a3] mb-6 max-w-5xl leading-relaxed">
                Common questions regarding security, invoice document handling, and directional cross-cloud pricing benchmarks during the preview release.
              </p>

              <FaqAccordion />
            </div>

          </main>

          {/* Top Divider */}
          <div className="w-full max-w-[1600px] mx-auto px-8 lg:px-10 mb-8">
            <div className="h-px bg-[var(--border)]" />
          </div>

          {/* Disclaimer */}
          <div className="w-full max-w-[1600px] mx-auto px-8 lg:px-10 pb-8">
            <blockquote className="border-l-4 border-[#e5e5e5] dark:border-[#262626] pl-4 my-6 text-[12px] text-[#737373] dark:text-[#a3a3a3] italic">
              <strong>Disclaimer:</strong>{' '}
              Bring Your Bill analysis estimates and cross-cloud cost comparisons serve as directional indicators derived from public pricing APIs. Uploaded invoices are processed ephemerally without persistent storage. Compare Cloud Costs makes no warranties regarding billing accuracy or provider-specific enterprise discounts. Please consult the <Link href="/terms" className="underline hover:text-[#171717] dark:hover:text-[#e5e7eb]">Terms of Use</Link> for more information regarding data completeness and coverage.
            </blockquote>
          </div>
        </div>

        <Footer />
      </div>
      <DigitalOceanReferralModal />
    </div>
  );
}
