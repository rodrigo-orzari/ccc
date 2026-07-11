'use client';
import React from 'react';
import Link from 'next/link';
import { Footer, ProductTypeSelector } from "@/components";

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const BackToTop = () => (
  <p style={{ marginTop: '1.5rem' }}>
    <a
      href="#top"
      style={{ color: 'var(--link-color)', fontSize: '0.875rem', textDecoration: 'none' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}
    >
      ↑ Go back to the top
    </a>
  </p>
);

// Section heading with a click-to-copy deep link to that section.
const CopyHeading: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const [copied, setCopied] = React.useState(false);
  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    const done = () => {
      setCopied(true);
      window.history.replaceState(null, '', `#${id}`);
      setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(done);
    } else {
      done();
    }
  };
  return (
    <h2 id={id} className="docs-h2">
      {children}
      <button
        type="button"
        onClick={copyLink}
        className={`docs-h2-anchor${copied ? ' copied' : ''}`}
        aria-label={`Copy link to the ${typeof children === 'string' ? children : 'section'} section`}
        title="Copy link to this section"
      >
        {copied ? '✓ Copied' : '🔗 Copy link'}
      </button>
    </h2>
  );
};

const AboutPage: React.FC = () => {
  return (
    <>
      <style>
        {`
          :root {
            --bg-color: #f7f8ff;
            --text-color: #1a1a1a;
            --sidebar-bg: #eef0fc;
            --border-color: #dde0f0;
            --link-color: #2563eb;
            --muted-text: #6b7280;
            --divider-color: #dde0f0;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-color: #06060f;
              --text-color: #f1f5f9;
              --sidebar-bg: #0c0c1e;
              --border-color: #1e1e38;
              --link-color: #818cf8;
              --muted-text: #94a3b8;
              --divider-color: #1e1e38;
            }
          }

          .about-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: var(--bg-color);
          }

          .about-container {
            display: flex;
            flex: 1;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
          }

          .about-topnav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.5rem;
            height: 44px;
            border-bottom: 1px solid var(--border-color);
            background-color: var(--sidebar-bg);
            position: sticky;
            top: 0;
            z-index: 50;
            flex-shrink: 0;
          }

          .sidebar {
            width: 280px;
            border-right: 1px solid var(--border-color);
            padding: 2rem 1.5rem;
            position: fixed;
            top: 44px;
            height: calc(100vh - 44px - 48px);
            overflow-y: auto;
            background-color: var(--sidebar-bg);
          }

          .sidebar a {
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: color 0.2s;
            display: block;
          }

          .sidebar a:hover {
            color: var(--link-color);
          }

          .main-content {
            margin-left: 280px;
            flex: 1;
            padding: 3rem 4rem 5rem;
            max-width: 850px;
            line-height: 1.7;
          }

          .main-content h1 {
            font-size: 2.25rem;
            font-weight: 800;
            margin: 0 0 0.5rem;
            letter-spacing: -0.02em;
          }

          .prose h2 {
            color: var(--text-color);
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0 0 0.75rem;
            letter-spacing: -0.01em;
            scroll-margin-top: 2rem;
          }

          .prose h2.docs-h2 {
            display: flex;
            align-items: center;
            gap: 0.4rem;
          }

          .docs-h2-anchor {
            opacity: 0.3;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--muted-text);
            font-size: 0.7rem;
            font-weight: 600;
            line-height: 1;
            padding: 3px 6px;
            border-radius: 4px;
            transition: opacity 0.15s, background 0.15s, color 0.15s;
            white-space: nowrap;
          }
          .docs-h2:hover .docs-h2-anchor { opacity: 0.75; }
          .docs-h2-anchor:hover { opacity: 1 !important; background: var(--border-color); color: var(--text-color); }
          .docs-h2-anchor.copied { opacity: 1 !important; color: #16a34a; }

          .prose h3 {
            color: var(--text-color);
            font-size: 1rem;
            font-weight: 700;
            margin: 1.5rem 0 0.5rem;
            scroll-margin-top: 2rem;
          }

          .prose p { margin: 0 0 1rem; color: var(--text-color); }
          .prose a { color: var(--link-color); text-decoration: none; }
          .prose a:hover { text-decoration: underline; }
          .prose strong { font-weight: 700; }

          .about-section {
            margin-bottom: 0;
            padding-top: 2.5rem;
            border-top: 1px solid var(--divider-color);
          }
          .about-section:first-of-type {
            border-top: none;
            padding-top: 0;
          }

          .prose blockquote {
            border-left: 4px solid #f59e0b;
            background-color: #fffbeb;
            padding: 1rem 1.25rem;
            margin: 1.5rem 0;
            border-radius: 0 0.375rem 0.375rem 0;
            font-size: 0.875rem;
          }

          @media (prefers-color-scheme: dark) {
            .prose blockquote {
              background-color: #1c1a0f;
            }
          }

          .about-wrapper > footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
          }

          @media (max-width: 768px) {
            .sidebar { display: none; }
            .main-content { margin-left: 0; padding: 2rem 1.5rem 5rem; }
          }
        `}
      </style>

      <div className="about-wrapper">
        <ProductTypeSelector />
        <div className="about-container" id="top">
          <aside className="sidebar">
            <h4 style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1, margin: 0, marginBottom: '1rem' }}>
              Content
            </h4>
            <nav>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <li><a href="#about-compare-cloud-costs-ccc" style={{ padding: '3px 0' }}>About CCC</a></li>
                <li><a href="#why-we-built-this" style={{ padding: '3px 0' }}>Why we built this</a></li>
                <li><a href="#key-capabilities" style={{ padding: '3px 0' }}>Key Capabilities</a></li>
                <li><a href="#who-is-ccc-for" style={{ padding: '3px 0' }}>Who is CCC for?</a></li>
                <li><a href="#about-the-creator" style={{ padding: '3px 0' }}>About the Creator</a></li>
              </ul>
            </nav>
          </aside>

          <main className="main-content">
            <h1>What is CompareCloudCosts.com?</h1>
            <div className="prose">

              {/* About CCC */}
              <div className="about-section">
                <CopyHeading id="about-compare-cloud-costs-ccc">About Compare Cloud Costs (CCC)</CopyHeading>
                <p>
                  comparecloudcosts.com (CCC) is a comprehensive cloud pricing intelligence platform that makes
                  comparing infrastructure costs across multiple cloud providers effortless. By normalizing and
                  aggregating pricing data from AWS, Microsoft Azure, Google Cloud, Oracle Cloud, DigitalOcean,
                  Alibaba Cloud, and emerging alternatives, CCC enables teams to perform side-by-side **AWS vs Azure vs Google Cloud pricing calculator** comparisons, helping you make confident, data-driven
                  architectural decisions and optimize cloud spend before deployment.
                </p>
                <BackToTop />
              </div>

              {/* Why we built this */}
              <div className="about-section">
                <CopyHeading id="why-we-built-this">Why we built this</CopyHeading>
                <p>
                  Cloud computing has revolutionized how we build and scale technology, but it has also introduced
                  a new challenge: pricing complexity. While cloud providers offer individual calculators and
                  purchase agreements, calculating the True Cost of Ownership (TCO) for a modern infrastructure
                  remains a monumental task. If you've ever tried building a **cloud provider price comparison** spreadsheet, you know how quickly details like regional variances and compute tier differences become overwhelming.
                </p>

                <h3 id="the-cloud-pricing-maze">The Cloud Pricing Maze</h3>
                <p>
                  Users can find exact pricing for one provider in isolation, but comparing those costs
                  side-by-side requires navigating disparate calculators and performing exhaustive individual
                  studies. Data is scattered across different rate cards and service models, making an
                  "apples-to-apples" comparison nearly impossible without manual normalization. CCC solves this by providing a unified **cloud cost comparison table** covering VMs, database instances, and storage fees in one view.
                </p>
                <p>
                  Many organizations rely on traditional FinOps solutions that provide an "after-the-fact" view of
                  spending. While these help optimize existing spend, they don't provide the proactive,
                  comparative clarity needed before a workload is deployed.
                </p>
                <p>
                  Furthermore, the modern landscape is increasingly multi-cloud. Companies run workloads across
                  different cloud providers simultaneously to achieve specific performance, redundancy, or
                  strategic goals. Many organizations find themselves overpaying because they lacked a unified,
                  cross-provider view during the planning phase. CCC provides **multi-cloud cost optimization** visibility directly at the design phase.
                </p>
                <BackToTop />
              </div>

              {/* Key Capabilities */}
              <div className="about-section">
                <CopyHeading id="key-capabilities">Key Capabilities</CopyHeading>
                <p>
                  comparecloudcosts.com (CCC) was built to bridge the gap between fragmented provider pricing data
                  and actionable architectural intelligence.
                </p>

                <h3 id="comprehensive-product-coverage">Comprehensive Product Coverage</h3>
                <p>
                  Access pricing for 10+ product categories spanning compute (VMs, containers, serverless,
                  Kubernetes), databases (relational, NoSQL, data warehouses), networking, storage, security, app
                  hosting, and AI/ML services. Compare how workload composition and architecture choices impact
                  total cost across providers.
                </p>

                <h3 id="multi-cloud-analysis-at-scale">Multi-Cloud Analysis at Scale</h3>
                <p>
                  Compare identical configurations across AWS, Azure, Google Cloud, Oracle, DigitalOcean, Alibaba
                  Cloud, and 4+ additional providers in a single normalized view. Adjust specs, region, and
                  commitment options to see how costs shift across the entire provider ecosystem.
                </p>

                <h3 id="global-infrastructure-intelligence">Global Infrastructure Intelligence</h3>
                <p>
                  Explore the <Link href="/datacenters">Datacenters</Link> page to understand each provider's
                  physical footprint — region availability, edge presence, redundancy posture, and government
                  cloud offerings — independent of pricing. Make architectural decisions based on both cost{' '}
                  <em>and</em> geographic reach.
                </p>

                <h3 id="frequently-updated-pricing">Frequently Updated Pricing</h3>
                <p>
                  Our automated pricing pipelines (spanning live APIs, static configs, and manual verification)
                  refresh data on a weekly basis. Each record is timestamped so you know exactly when it was last
                  ingested. The <Link href="/status">Status</Link> page shows current coverage, data freshness,
                  and pipeline health.
                </p>

                <h3 id="granular-cost-breakdown">Granular Cost Breakdown</h3>
                <p>
                  Drill into compute, storage, networking, and licensing costs independently. See exactly how
                  vCPU count, memory, region, commitment level, and workload type impact price — so architectural
                  trade-offs are financially transparent.
                </p>

                <h3 id="proactive-workload-planning">Proactive Workload Planning</h3>
                <p>
                  Model complete workloads before deployment. Pre-built workload templates (e.g., "High-Traffic
                  Web App", "RAG / AI Knowledge Base", "Compliance-Ready Database") show you the total cost of
                  all components together across providers. Complement reactive FinOps tools with pre-purchase
                  architectural cost modeling.
                </p>
                <BackToTop />
              </div>

              {/* Who is CCC for? */}
              <div className="about-section">
                <CopyHeading id="who-is-ccc-for">Who is CCC for?</CopyHeading>

                <h3 id="it-managers-and-ctos">IT Managers and CTOs</h3>
                <p>
                  IT leaders use CCC during the architectural planning phase to estimate the total cost of
                  ownership (TCO) for new workloads. By seeing "apples-to-apples" cost comparisons for compute,
                  databases, and networking, they can justify budget requests, avoid vendor lock-in, and select
                  the most cost-effective cloud provider for their specific performance needs.
                </p>

                <h3 id="cloud-provider-sales">Cloud Provider Sales</h3>
                <p>
                  Cloud sales professionals leverage CCC as an independent, third-party benchmark to demonstrate
                  the competitive pricing of their offerings. For example, a sales representative can quickly show
                  a prospective client how their pricing for a specific database or compute instance stacks up
                  against competitors, helping to close deals based on transparent cost advantages.
                </p>

                <h3 id="product-owners">Product Owners</h3>
                <p>
                  Product Owners use CCC to align product roadmaps with infrastructure budgets. By easily
                  comparing the cost implications of introducing new features (e.g., adding an AI inference
                  endpoint or switching to a NoSQL database), Product Owners can make data-backed decisions that
                  balance product innovation with operational profitability.
                </p>

                <h3 id="managed-service-providers-msps">Managed Service Providers (MSPs)</h3>
                <p>
                  MSPs managing infrastructure for multiple clients use CCC to design optimized, cost-effective
                  environments. Whether migrating a client from on-premises to the cloud or optimizing an existing
                  cloud footprint, CCC allows MSPs to rapidly evaluate different providers and present compelling,
                  cost-optimized proposals to their clients, thereby increasing their margins and value-add.
                </p>

                <h3 id="consulting-companies-cloud-deployment-specialists">Consulting Companies (Cloud Deployment Specialists)</h3>
                <p>
                  Cloud consultants and architects use CCC as a foundational tool during the discovery and design
                  phases of a digital transformation project. It allows them to quickly model out multi-cloud
                  scenarios, provide clients with accurate directional estimates, and design architectures that
                  balance performance requirements with strict budget constraints.
                </p>
                <BackToTop />
              </div>

              {/* About the Creator */}
              <div className="about-section">
                <CopyHeading id="about-the-creator">About the Creator</CopyHeading>
                <p>
                  Hi, I'm <strong>Rodrigo Orzari</strong>{' '}
                  <a
                    href="https://www.linkedin.com/in/rodrigoorzari/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Rodrigo Orzari on LinkedIn"
                    title="Connect with me on LinkedIn"
                    style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', color: 'var(--link-color)' }}
                  >
                    <LinkedInIcon />
                  </a>.
                </p>
                <p>
                  I built comparecloudcosts.com as a passion project to deepen my understanding of modern tech
                  stacks and artificial intelligence—transitioning from "vibe-coding" to actively integrating AI
                  into production-grade applications.
                </p>
                <p>
                  The core motivation behind this tool was to solve a very specific, painful problem for the
                  professionals mentioned above. Instead of forcing IT leaders, sales reps, and consultants to
                  manually hunt down prices across every individual cloud provider's rate card, I wanted to
                  provide a seamless, "apples-to-apples" comparison. CCC makes it significantly easier to navigate
                  complex pricing models and make informed architectural choices without the headache of manual
                  spreadsheet normalization.
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted-text)' }}>
                  For notes on data accuracy, coverage, and official provider calculators, see{' '}
                  <Link href="/docs#accuracy">Pricing Data — Accuracy &amp; freshness</Link> in the docs.
                </p>
                <BackToTop />
              </div>

            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
