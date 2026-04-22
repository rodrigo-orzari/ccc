import React, { useState, useEffect } from 'react';
import { Database, Server, Terminal, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface DbStatus {
  time?: string;
  error?: string;
  details?: string;
}

export default function App() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dbData, setDbData] = useState<DbStatus | null>(null);

  const checkConnection = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      
      if (response.ok) {
        setDbData(data);
        setStatus('success');
      } else {
        setDbData(data);
        setStatus('error');
      }
    } catch (err: any) {
      setDbData({ error: 'Failed to connect to the backend server.', details: err.message });
      setStatus('error');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Database size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Postgres Full-Stack Starter
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A production-ready environment connecting a Node.js Express backend with a PostgreSQL database and React frontend.
          </p>
        </motion.header>

        {/* Connection Status Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'} border`}>
                {status === 'loading' ? <Loader2 className="animate-spin" /> : (status === 'success' ? <CheckCircle2 /> : <AlertCircle />)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Database Connection Status</h2>
                <p className="text-slate-400 text-sm">Testing connectivity to your PostgreSQL instance</p>
              </div>
            </div>
            <button 
              onClick={checkConnection}
              disabled={status === 'loading'}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
              {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
              Refresh Connection
            </button>
          </div>

          {/* Results Area */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 p-6">
            <div className="flex items-center gap-2 text-slate-500 mb-4 border-b border-slate-900 pb-2">
              <Terminal size={14} />
              <span className="text-xs font-mono uppercase tracking-wider">Server Logs</span>
            </div>
            
            {status === 'loading' ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500 italic">
                <Loader2 className="animate-spin mb-4" />
                <span>Pinging database server...</span>
              </div>
            ) : status === 'error' ? (
              <div className="space-y-4">
                <div className="text-red-400 font-mono text-sm leading-relaxed">
                  <p className="font-bold mb-2">&gt; ERROR: {dbData?.error || 'Database connection failed'}</p>
                  <p className="opacity-80">{dbData?.details || 'Ensure DATABASE_URL is set correctly in your environment variables.'}</p>
                </div>
                <div className="p-4 bg-red-400/5 rounded-lg border border-red-400/10 text-xs text-red-300/60 leading-relaxed">
                  Tip: Go to the "Secrets" panel in the AI Studio sidebar and add a variable named <code className="text-red-300 select-all font-bold">DATABASE_URL</code> with your connection string.
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-emerald-400 font-mono text-sm">
                <p>&gt; Connection established successfully</p>
                <p>&gt; Response from Postgres: <span className="text-white">{dbData?.time}</span></p>
                <p className="text-slate-500">&gt; Pool active and ready for queries.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:border-indigo-500/30 transition-colors group"
          >
            <div className="p-2 w-fit rounded-lg bg-indigo-500/10 text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Server size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Express Backend</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Native TypeScript server running with tsx. Features automatic environment handling and proxy middleware for Vite.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:border-emerald-500/30 transition-colors group"
          >
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Database size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Postgres Ready</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pre-configured with <code className="text-emerald-300">pg</code> pool for efficient connection management. SSL enabled by default for cloud providers.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

