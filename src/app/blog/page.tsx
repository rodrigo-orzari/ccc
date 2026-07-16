import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Footer, ProductTypeSelector } from '@/components';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | CompareCloudCosts',
  description: 'Latest insights on cloud pricing, FinOps, and architecture from the CompareCloudCosts team.',
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
      <style>{`
        :root {
          --bg: #ffffff;
          --surface: #ffffff;
          --border: #e5e5e5;
          --text: #171717;
          --muted: #737373;
          --row-hover: #fafafa;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #000000;
            --surface: #000000;
            --border: #262626;
            --text: #e5e7eb;
            --muted: #a3a3a3;
            --row-hover: #0a0a0a;
          }
        }
      `}</style>
      
      <ProductTypeSelector activeProductType={'' as any} />

      <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[var(--text)]">
              Blog
            </h1>
            <p className="text-[var(--muted)] text-sm leading-relaxed max-w-3xl">
              Insights, analysis, and news on cloud pricing, architecture showdowns, and FinOps strategies.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--border)] mb-8" />

          {/* Sponsorship Box */}
          <div className="mb-8 border-2 border-dashed border-[var(--border)] rounded bg-[var(--row-hover)] p-6 flex flex-col items-center gap-3 text-center">
            <div>
              <h3 className="text-sm font-bold text-[var(--text)] mb-1 flex items-center justify-center gap-2">
                <span className="text-2xl">🤝</span> Sponsor the Blog
              </h3>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                Have your company featured as a sponsor of this page. Reach thousands of cloud decision-makers exploring pricing strategies. Visit <Link href="/docs#advertising" className="text-[#2563eb] dark:text-[#818cf8] hover:underline font-bold">Advertising with Us in the Documentation</Link> or contact hello@comparecloudcosts.com.
              </p>
              <p className="text-[11px] text-[var(--muted)] mt-1.5 opacity-80">
                Banner spec: 1200 × 200px (6:1 ratio) · PNG, JPG, or WebP. See the <Link href="/docs#advertising-specs" className="underline hover:text-[var(--text)]">Docs</Link> for detailed instructions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                <article className="border border-[var(--border)] rounded p-4 h-full flex flex-col bg-[var(--surface)] hover:border-[var(--text)] transition-colors">
                  <div className="mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-[15px] font-bold mb-2 text-[var(--text)] group-hover:text-[#2563eb] dark:group-hover:text-[#818cf8] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-[var(--muted)] text-[11px] mb-3 flex-1 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-2 border-t border-[var(--border)] flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[#2563eb] transition-colors">
                    <span>{post.author || 'CCC Team'}</span>
                    <span className="flex items-center">Read <svg className="ml-1" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></span>
                  </div>
                </article>
              </Link>
            ))}
            
            {posts.length === 0 && (
              <div className="col-span-full py-12 text-[var(--muted)] text-sm">
                No blog posts found. Stay tuned!
              </div>
            )}
          </div>
        </main>

      <Footer />
    </div>
  );
}
