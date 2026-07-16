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

      <div className="flex-1 overflow-auto flex flex-col">
        <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[1200px] mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4 text-[var(--text)]">
              CompareCloudCosts Blog
            </h1>
            <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
              Insights, analysis, and news on cloud pricing, architecture showdowns, and FinOps strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                <article className="border border-[var(--border)] rounded-xl p-6 h-full flex flex-col bg-[var(--surface)] hover:border-[#2563eb] dark:hover:border-[#818cf8] transition-colors">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-[var(--text)] group-hover:text-[#2563eb] dark:group-hover:text-[#818cf8] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[var(--muted)] mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between text-sm text-[var(--muted)]">
                    <span className="font-medium">{post.author || 'CCC Team'}</span>
                    <span className="group-hover:text-[#2563eb] dark:group-hover:text-[#818cf8] transition-colors font-medium">Read more &rarr;</span>
                  </div>
                </article>
              </Link>
            ))}
            
            {posts.length === 0 && (
              <div className="col-span-full text-center py-12 text-[var(--muted)]">
                No blog posts found. Stay tuned!
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
