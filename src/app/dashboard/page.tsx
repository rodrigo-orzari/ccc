'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Legend
} from 'recharts';
import { Server, Database, Zap, ArrowRight, Activity, Cloud, TrendingDown } from 'lucide-react';
import { Footer } from '@/components';

// --- MOCK DATA FOR CHARTS ---

const heroTrendData = [
  { month: 'Jan', aws: 0.15, azure: 0.145, gcp: 0.13 },
  { month: 'Feb', aws: 0.15, azure: 0.145, gcp: 0.13 },
  { month: 'Mar', aws: 0.142, azure: 0.140, gcp: 0.125 },
  { month: 'Apr', aws: 0.142, azure: 0.140, gcp: 0.125 },
  { month: 'May', aws: 0.142, azure: 0.138, gcp: 0.125 },
  { month: 'Jun', aws: 0.138, azure: 0.138, gcp: 0.12 },
  { month: 'Jul', aws: 0.138, azure: 0.135, gcp: 0.12 },
  { month: 'Aug', aws: 0.135, azure: 0.135, gcp: 0.118 },
  { month: 'Sep', aws: 0.135, azure: 0.130, gcp: 0.118 },
  { month: 'Oct', aws: 0.130, azure: 0.130, gcp: 0.115 },
  { month: 'Nov', aws: 0.130, azure: 0.128, gcp: 0.115 },
  { month: 'Dec', aws: 0.125, azure: 0.125, gcp: 0.110 },
];

const scatterDataAWS = Array.from({ length: 20 }, () => ({ vcpu: Math.random() * 64, price: Math.random() * 2 }));
const scatterDataAzure = Array.from({ length: 20 }, () => ({ vcpu: Math.random() * 64, price: Math.random() * 2.2 }));
const scatterDataGCP = Array.from({ length: 20 }, () => ({ vcpu: Math.random() * 64, price: Math.random() * 1.8 }));

const radarData = [
  { metric: 'Compute Cost', AWS: 100, Azure: 95, GCP: 85, fullMark: 100 },
  { metric: 'Storage IOPS', AWS: 80, Azure: 100, GCP: 90, fullMark: 100 },
  { metric: 'HA Overhead', AWS: 90, Azure: 85, GCP: 80, fullMark: 100 },
  { metric: 'Network Egress', AWS: 100, Azure: 100, GCP: 75, fullMark: 100 },
  { metric: 'Base Fee', AWS: 85, Azure: 90, GCP: 85, fullMark: 100 },
];

const serverlessData = [
  { provider: 'AWS', cost: 0.20 },
  { provider: 'Azure', cost: 0.20 },
  { provider: 'GCP', cost: 0.40 },
  { provider: 'Oracle', cost: 0.14 },
];

// --- COMPONENT ---

export default function DashboardPreviewPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#06060f] text-gray-100 font-sans overflow-x-hidden selection:bg-blue-500/30">
      
      {/* NAVIGATION / HEADER MOCK */}
      <nav className="w-full border-b border-white/5 bg-white/[0.02] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-lg tracking-tight">CompareCloudCosts</span>
          </div>
          <Link href="/" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium text-sm hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center z-10">
        
        {/* Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">
            Find the Best Cloud Value.<br className="hidden md:block" /> Instantly.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing your infrastructure bills. Compare highly accurate directional pricing for compute, databases, and serverless across the world's top cloud providers.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/" className="group flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all">
              Start Comparing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* HERO CHART (Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-5xl mt-20 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
                Global Compute Price Trend
              </h3>
              <p className="text-sm text-gray-400">Average Hourly Rate for 4 vCPU / 16GB RAM (USD)</p>
            </div>
            <div className="flex gap-4 text-sm font-medium">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#FF9900]" /> AWS</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#0078D4]" /> Azure</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#EA4335]" /> GCP</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heroTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickMargin={10} axisLine={false} />
                <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e1e38', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${value.toFixed(3)}`, '']}
                />
                <Line type="monotone" dataKey="aws" name="AWS" stroke="#FF9900" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="azure" name="Azure" stroke="#0078D4" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="gcp" name="GCP" stroke="#EA4335" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* LIVE TICKER */}
      <div className="w-full border-y border-white/5 bg-white/[0.02] py-3 overflow-hidden flex whitespace-nowrap mb-20">
        <div className="animate-[ticker_30s_linear_infinite] flex gap-12 items-center text-sm font-medium text-gray-400">
          <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" /> Over 15,000 instances tracked</span>
          <span className="flex items-center gap-2"><TrendingDown className="w-4 h-4 text-emerald-400" /> Azure Synapse is 15% cheaper than BigQuery for 100 CU</span>
          <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-purple-400" /> Serverless execution times normalized across 5 providers</span>
          <span className="flex items-center gap-2"><Database className="w-4 h-4 text-orange-400" /> Oracle Cloud databases offer competitive IOPS rates</span>
          <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" /> Over 15,000 instances tracked</span>
          <span className="flex items-center gap-2"><TrendingDown className="w-4 h-4 text-emerald-400" /> Azure Synapse is 15% cheaper than BigQuery for 100 CU</span>
        </div>
      </div>

      {/* BENTO BOX GRID */}
      <section className="max-w-7xl mx-auto px-6 mb-32 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COMPUTE */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl group hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl"><Server className="w-6 h-6 text-blue-400" /></div>
              <h3 className="text-xl font-bold">Compute</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">Massive variance in vCPU performance-per-dollar.</p>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <XAxis type="number" dataKey="vcpu" name="vCPU" hide />
                  <YAxis type="number" dataKey="price" name="Price" hide />
                  <Scatter name="AWS" data={scatterDataAWS} fill="#FF9900" opacity={0.6} />
                  <Scatter name="Azure" data={scatterDataAzure} fill="#0078D4" opacity={0.6} />
                  <Scatter name="GCP" data={scatterDataGCP} fill="#EA4335" opacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* DATABASES */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl group hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl"><Database className="w-6 h-6 text-purple-400" /></div>
              <h3 className="text-xl font-bold">Databases</h3>
            </div>
            <p className="text-sm text-gray-400 mb-2">Total Cost profiles for managed PostgreSQL.</p>
            <div className="h-[220px] w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                  <Radar name="AWS" dataKey="AWS" stroke="#FF9900" fill="#FF9900" fillOpacity={0.2} />
                  <Radar name="Azure" dataKey="Azure" stroke="#0078D4" fill="#0078D4" fillOpacity={0.2} />
                  <Radar name="GCP" dataKey="GCP" stroke="#EA4335" fill="#EA4335" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* SERVERLESS */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl group hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/20 rounded-xl"><Zap className="w-6 h-6 text-emerald-400" /></div>
              <h3 className="text-xl font-bold">Serverless</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">Cost per 1 Million Invocations (USD).</p>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serverlessData} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="provider" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: '#1e1e38', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="cost" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
      
      {/* Custom Styles for ticker animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </main>
  );
}
