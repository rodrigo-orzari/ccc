import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { Footer, ProductTypeSelector } from '@/components';
import { getPostBySlug, getPostSlugs } from '@/lib/blog';

// Generate static routes for all posts at build time
export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ''),
  }));
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | CompareCloudCosts',
    };
  }

  return {
    title: `${post.title} | CompareCloudCosts Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

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

      <main className="flex-1 p-8 lg:p-10 pb-20 w-full max-w-[900px] mx-auto">
          
          <div className="mb-8 pb-8 border-b border-[var(--border)]">
            <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-[#2563eb] dark:text-[#818cf8] hover:underline mb-6">
              &larr; Back to Blog
            </Link>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--text)] leading-tight">
              {post.title}
            </h1>
            {post.subtitle && (
              <h2 className="text-xl md:text-2xl text-[var(--muted)] mb-6 font-medium">
                {post.subtitle}
              </h2>
            )}
            
            <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
              <span className="font-semibold">{post.author || 'CCC Team'}</span>
              <span>•</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
          </div>

          <article className="prose prose-slate dark:prose-invert text-[0.9375rem] leading-[1.7] max-w-none prose-a:text-[#2563eb] dark:prose-a:text-[#818cf8] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>
          
          {/* Divider */}
          <div className="h-px bg-[var(--border)] my-12" />

          {/* Disclaimer */}
          <div className="text-[11px] text-[#737373] dark:text-[#a3a3a3] leading-relaxed">
            <strong className="text-[#171717] dark:text-[#e5e7eb] uppercase tracking-widest text-[10px]">Disclaimer:</strong>{' '}
            Price data may be delayed, incomplete, or imprecise. The data on this platform serves as a directional indicator, and comparecloudcosts.com makes no warranties regarding accuracy. Please consult the{' '}
            <Link href="/terms" className="underline hover:text-[#171717] dark:hover:text-[#e5e7eb]">Terms of Use</Link> for more information regarding data completeness and coverage.
          </div>
          
        </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>
    </div>
  );
}
