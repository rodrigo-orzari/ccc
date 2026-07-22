'use client';

import React from 'react';
import Link from 'next/link';
import { Footer, Sidebar, DigitalOceanReferralModal, CopyHeading } from '@/components';
import { WORKLOADS_LISTING_SPONSOR } from '@/config';
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
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export default function BringYourBillPage() {
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
            {/* Header — Compliance style intro paragraph */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-[var(--text)]">Bring Your Bill</h1>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#2563eb]/10 text-[#2563eb] dark:text-[#818cf8] border border-[#2563eb]/20">
                  Feature Preview
                </span>
              </div>
              <p className="text-[#737373] dark:text-[#a3a3a3] text-sm leading-relaxed max-w-4xl">
                We are building an automated <strong>Cloud Provider Bill Analyzer &amp; Cross-Cloud Optimization Engine</strong> for Compare Cloud Costs users. Simply upload your PDF, CSV, or JSON invoice from <strong>AWS, Azure, Google Cloud, or Oracle Cloud</strong> and receive instant best-match alternatives cross-referenced against our live 10,000+ SKU database.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mb-8" />

            {/* Sponsorship Box */}
            {WORKLOADS_LISTING_SPONSOR?.imageUrl ? (
              <div className="mb-8">
                <a
                  href={WORKLOADS_LISTING_SPONSOR.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-[var(--border)] hover:opacity-95 transition-opacity"
                >
                  <img
                    src={WORKLOADS_LISTING_SPONSOR.imageUrl}
                    alt={WORKLOADS_LISTING_SPONSOR.companyName}
                    className="w-full h-auto max-h-[200px] object-cover"
                  />
                </a>
              </div>
            ) : (
              <div className="mb-8 p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-[#2563eb]/10 text-[#2563eb] dark:text-[#818cf8]">
                    <Receipt size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[var(--text)]">Sponsor Cloud Price Intelligence</h3>
                    <p className="text-[11px] text-[var(--muted)]">Reach thousands of DevOps leads, cloud architects, and CTOs comparing infrastructure costs daily.</p>
                  </div>
                </div>
                <Link
                  href="/sponsors"
                  className="shrink-0 text-xs font-bold px-3 py-1.5 rounded bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
                >
                  Become a Sponsor →
                </Link>
              </div>
            )}

            {/* Hero Feature Banner */}
            <div className="mb-10 p-6 lg:p-8 rounded-xl bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] dark:from-[#090d16] dark:to-[#0f172a] border border-[#cbd5e1] dark:border-[#1e293b] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Receipt size={180} />
              </div>
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#2563eb]/10 text-[#2563eb] dark:text-[#818cf8] text-xs font-bold mb-3">
                  <Sparkles size={14} /> Coming to Compare Cloud Costs
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold mb-3 text-[var(--text)] tracking-tight">
                  Cross-Reference Your Invoices in Seconds
                </h2>
                <p className="text-xs lg:text-sm text-[var(--muted)] mb-6 leading-relaxed">
                  Cloud bills are dense, complex, and filled with cryptic SKUs. Our upcoming bill analyzer extracts vCPU, RAM, storage tiers, database engine configurations, and egress usage, then computes your exact equivalent monthly spend across alternative cloud platforms.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--muted)]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Pay-Per-Bill ($2.99) &amp; Beta Code Access</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Zero Data Retention</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Instant CSV &amp; PDF Export</span>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="mb-12">
              <CopyHeading id="how-it-works" className="text-lg font-bold text-[var(--text)] mb-4">
                How It Works
              </CopyHeading>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-[#2563eb]/10 text-[#2563eb] dark:text-[#818cf8] flex items-center justify-center font-bold text-xs mb-3">
                      01
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileUp size={18} className="text-[var(--text)]" />
                      <h3 className="text-sm font-bold text-[var(--text)]">Upload Invoice</h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      Drop your official AWS, Azure, GCP, or OCI PDF invoice, CSV itemized export, or JSON cost report into the secure parser.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] text-[var(--muted)] font-mono">
                    Supported: AWS CUR, Azure Invoices, GCP Cost Export
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-[#2563eb]/10 text-[#2563eb] dark:text-[#818cf8] flex items-center justify-center font-bold text-xs mb-3">
                      02
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu size={18} className="text-[var(--text)]" />
                      <h3 className="text-sm font-bold text-[var(--text)]">Cross-Match SKUs</h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      Our engine automatically normalizes infrastructure specifications (vCPUs, RAM, IOPS, DB engines) and matches them against equivalent products.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] text-[var(--muted)] font-mono">
                    Cross-referenced against 10,000+ live prices
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-[#2563eb]/10 text-[#2563eb] dark:text-[#818cf8] flex items-center justify-center font-bold text-xs mb-3">
                      03
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileSpreadsheet size={18} className="text-[var(--text)]" />
                      <h3 className="text-sm font-bold text-[var(--text)]">Export &amp; Optimize</h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      Review a detailed line-by-line comparison table with potential monthly savings, alternative providers, and export full reports.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] text-[var(--muted)] font-mono">
                    Download PDF / CSV / Excel reports
                  </div>
                </div>
              </div>
            </div>

            {/* Key Capabilities Grid */}
            <div className="mb-12">
              <CopyHeading id="capabilities" className="text-lg font-bold text-[var(--text)] mb-4">
                Core Engine Capabilities
              </CopyHeading>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-[#2563eb] dark:text-[#818cf8]">
                    <ShieldCheck size={18} />
                    <h4 className="text-xs font-bold text-[var(--text)]">Ephemeral Processing</h4>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Zero raw invoice retention. Invoices are parsed in ephemeral memory and discarded immediately after rendering your report.
                  </p>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-[#2563eb] dark:text-[#818cf8]">
                    <Zap size={18} />
                    <h4 className="text-xs font-bold text-[var(--text)]">Multi-Provider Mapping</h4>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Maps AWS EC2, RDS, S3, and Lambda line items to equivalent services across Azure, Google Cloud, DigitalOcean, and Oracle.
                  </p>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-[#2563eb] dark:text-[#818cf8]">
                    <Lock size={18} />
                    <h4 className="text-xs font-bold text-[var(--text)]">Beta Activation Access</h4>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Early beta access available via promotional activation codes in exchange for quick user feedback on matching accuracy.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy & FAQs */}
            <div className="mb-12">
              <CopyHeading id="faq" className="text-lg font-bold text-[var(--text)] mb-4">
                Frequently Asked Questions
              </CopyHeading>

              <div className="space-y-4">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
                  <h4 className="text-xs font-bold text-[var(--text)] mb-1 flex items-center gap-2">
                    <HelpCircle size={14} className="text-[#2563eb]" />
                    Is my financial or invoice data stored permanently?
                  </h4>
                  <p className="text-xs text-[var(--muted)] leading-relaxed pl-6">
                    No. Compare Cloud Costs adheres to a strict zero-persistence policy for uploaded bills. Uploaded files are processed ephemerally in memory to extract resource specs and are destroyed immediately upon calculation.
                  </p>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
                  <h4 className="text-xs font-bold text-[var(--text)] mb-1 flex items-center gap-2">
                    <HelpCircle size={14} className="text-[#2563eb]" />
                    How will pricing work once launched?
                  </h4>
                  <p className="text-xs text-[var(--muted)] leading-relaxed pl-6">
                    Bring Your Bill operates on a simple pay-as-you-go model ($2.99 per bill comparison). During the upcoming Beta release, users can access the feature for free using an activation code in exchange for brief feedback.
                  </p>
                </div>
              </div>
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
