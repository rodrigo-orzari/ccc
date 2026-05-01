import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MarkdownPageProps {
  title: string;
  content: string;
}

const MarkdownPage: React.FC<MarkdownPageProps> = ({ title, content }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-[#737373] hover:text-black dark:hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Comparison
      </Link>

      <h1 className="text-4xl font-bold mb-8 text-black dark:text-white tracking-tight">{title}</h1>

      <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-a:text-[#0069FF] hover:prose-a:underline">
        <div className="markdown-body">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

export default MarkdownPage;
