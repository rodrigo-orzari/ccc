import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Download,
  ChevronDown,
  ArrowRight,
  Info,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingRecord {
  provider: string;
  service: string;
  region: string;
  instance_type: string;
  vcpus: number;
  memory_gb: number;
  arch: string;
  os: string;
  cpu_vendor: string;
  gpu_count: number;
  geography: string;
  category: string;
  price_per_unit: string;
  unit: string;
  min_price?: string;
  avg_price?: string;
  max_price?: string;
}

const PROVIDERS = [
  { id: 'aws', name: 'AWS', color: '#FF9900' },
  { id: 'azure', name: 'Azure', color: '#00BCFF' },
  { id: 'gcp', name: 'Google', color: '#34A853' },
  { id: 'oracle', name: 'Oracle', color: '#F80000' },
  { id: 'digitalocean', name: 'DigitalOcean', color: '#0069FF' },
];

const GEOGRAPHIES = ['N. America', 'S. America', 'W. Europe', 'N. Europe', 'Mid East & Africa', 'Asia Pacific', 'Australia'];
const OS_TYPES = ['Linux', 'Windows'];
const CPU_PROFILES = [
  { id: 'intel-x86', label: 'Intel (x86)', vendor: 'Intel', arch: 'x86 64' },
  { id: 'amd-x86', label: 'AMD (x86)', vendor: 'AMD', arch: 'x86 64' },
  { id: 'aws-arm', label: 'AWS Graviton (ARM)', vendor: 'AWS', arch: 'ARM' },
  { id: 'ampere-arm', label: 'Ampere (ARM)', vendor: 'Ampere', arch: 'ARM' },
];
const CATEGORIES = ['General purpose', 'Compute optimized', 'Memory optimized', 'Storage optimized', 'Burstable', 'HPC'];
const GPU_OPTIONS = ['With GPU', 'Without GPU'];

const RangeSlider = ({ min, max, value, onChange, step = 1, unit = '' }: {
  min: number,
  max: number,
  value: { min: number, max: number },
  onChange: (val: { min: number, max: number }) => void,
  step?: number,
  unit?: string
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-bold text-[#737373]">
        <span>Min <span className="ml-1 font-mono font-medium text-black dark:text-white">{unit}{value.min}{!unit && ' '}</span></span>
        <span>Max <span className="ml-1 font-mono font-medium text-black dark:text-white">{unit}{value.max}{!unit && ' '}</span></span>
      </div>
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div className="absolute w-full h-1 bg-[#262626] rounded-full" />

        {/* Active Range Highlight */}
        <div
          className="absolute h-1 bg-white rounded-full pointer-events-none"
          style={{
            left: `${((value.min - min) / (max - min)) * 100}%`,
            right: `${100 - ((value.max - min) / (max - min)) * 100}%`
          }}
        />

        {/* Min Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), value.max - step);
            onChange({ ...value, min: val });
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 slider-input-min"
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), value.min + step);
            onChange({ ...value, max: val });
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 slider-input-max"
        />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [selectedProviders, setSelectedProviders] = useState<string[]>(PROVIDERS.filter(p => !p.soon).map(p => p.id));
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([...GEOGRAPHIES]);
  const [selectedOS, setSelectedOS] = useState<string[]>([...OS_TYPES]);
  const [selectedCpu, setSelectedCpu] = useState<string[]>(CPU_PROFILES.map(p => p.id));
  const [selectedCategory, setSelectedCategory] = useState<string[]>([...CATEGORIES]);
  const [selectedGpu, setSelectedGpu] = useState<string[]>([...GPU_OPTIONS]);
  const [vCpuRange, setVCpuRange] = useState({ min: 1, max: 128 });
  const [memoryRange, setMemoryRange] = useState({ min: 0, max: 440 });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 510 });
  const [search, setSearch] = useState('');
  const [showAggregation, setShowAggregation] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PricingRecord | string, direction: 'asc' | 'desc' }>({ key: 'price_per_unit', direction: 'asc' });

  const [data, setData] = useState<PricingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ total: number, providers: any[], lastUpdated: string | null } | null>(null);
  const [providerCounts, setProviderCounts] = useState<Record<string, number>>({});

  const sortData = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...data].sort((a, b) => {
      let valA: any = a[key as keyof PricingRecord] ?? '';
      let valB: any = b[key as keyof PricingRecord] ?? '';

      const numericKeys = ['vcpus', 'memory_gb', 'price_per_unit', 'avg_price', 'min_price', 'max_price'];
      if (numericKeys.includes(key)) {
        valA = parseFloat(valA.toString().replace(/[^0-9.-]+/g, "")) || 0;
        valB = parseFloat(valB.toString().replace(/[^0-9.-]+/g, "")) || 0;
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sorted);
  };

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(status => {
        console.log('📊 Database Status:', status);
        setDbStatus({
          total: status.total_records || 0,
          providers: status.by_provider || [],
          lastUpdated: status.last_updated || null
        });
      })
      .catch(err => console.error('❌ Database health check failed:', err));
  }, []);

  const fetchFilteredData = useCallback(async () => {
    if (
      selectedProviders.length === 0 ||
      selectedGeographies.length === 0 ||
      selectedOS.length === 0 ||
      selectedCpu.length === 0 ||
      selectedCategory.length === 0 ||
      selectedGpu.length === 0
    ) {
      setData([]);
      setProviderCounts({});
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Common filter params shared by /api/pricing and /api/pricing/counts.
      // The counts endpoint reflects "what would be available per provider" so it
      // intentionally ignores the provider filter (otherwise unselected providers'
      // cards would always show 0).
      const baseParams = new URLSearchParams();
      if (selectedGeographies.length > 0) baseParams.append('geography', selectedGeographies.join(','));
      if (selectedOS.length > 0) baseParams.append('os', selectedOS.join(','));
      if (selectedCpu.length > 0 && selectedCpu.length < CPU_PROFILES.length) {
        const vendors = [...new Set(selectedCpu.map(id => CPU_PROFILES.find(p => p.id === id)!.vendor))];
        baseParams.append('cpuVendor', vendors.join(','));
      }
      if (selectedCategory.length > 0 && selectedCategory.length < CATEGORIES.length) {
        baseParams.append('category', selectedCategory.join(','));
      }
      if (selectedGpu.length === 1) {
        baseParams.append('gpu', selectedGpu[0] === 'With GPU' ? 'true' : 'false');
      }
      baseParams.append('minVcpu', vCpuRange.min.toString());
      baseParams.append('maxVcpu', vCpuRange.max.toString());
      baseParams.append('minMemory', memoryRange.min.toString());
      baseParams.append('maxMemory', memoryRange.max.toString());
      baseParams.append('minPrice', priceRange.min.toString());
      baseParams.append('maxPrice', priceRange.max.toString());
      baseParams.append('search', search);

      // Pricing query adds the provider filter on top of baseParams.
      const pricingParams = new URLSearchParams(baseParams);
      pricingParams.append('provider', selectedProviders.join(','));

      const [pricingRes, countsRes] = await Promise.all([
        fetch(`/api/pricing?${pricingParams.toString()}`),
        fetch(`/api/pricing/counts?${baseParams.toString()}`)
      ]);

      if (!pricingRes.ok) {
        throw new Error(`Server returned ${pricingRes.status}: ${pricingRes.statusText}`);
      }

      const result = await pricingRes.json();
      console.log(`✅ Fetched ${result.length} pricing records`);

      if (Array.isArray(result)) {
        setData(result);
      } else {
        console.error('API Error:', result.error || result);
        setData([]);
      }

      if (countsRes.ok) {
        const countsRows: { slug: string, count: string }[] = await countsRes.json();
        const countsMap: Record<string, number> = {};
        countsRows.forEach(r => { countsMap[r.slug] = parseInt(r.count) || 0; });
        setProviderCounts(countsMap);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setData([]);
      setProviderCounts({});
    } finally {
      setLoading(false);
    }
  }, [selectedProviders, selectedGeographies, selectedOS, selectedCpu, selectedCategory, selectedGpu, vCpuRange, memoryRange, priceRange, search, showAggregation]);

  useEffect(() => {
    const timeout = setTimeout(fetchFilteredData, 300);
    return () => clearTimeout(timeout);
  }, [fetchFilteredData]);

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#000000] text-[#171717] dark:text-[#e5e7eb] font-sans overflow-hidden transition-colors duration-300">

      {/* Top Navbar */}
      <nav className="h-14 border-b border-[#e5e5e5] dark:border-[#262626] flex items-center px-4 justify-between bg-white dark:bg-[#000000] shrink-0 z-20">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="font-bold text-lg tracking-tight">
                <span className="text-[#0069FF]">compare</span>
                <span className="text-black dark:text-white">cloud</span>
                <span className="text-[#00BCFF]">costs</span>
              </span>
            </div>
            <div className="w-px h-6 bg-[#e5e5e5] dark:bg-[#262626] mx-1 hidden sm:block" />
            <span className="text-xs text-[#737373] hidden lg:block">
              Know how much it will cost before getting an invoice.
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 ml-2">
            <Link to="/methodology" className="text-xs text-[#737373] flex items-center gap-1 hover:text-black dark:hover:text-white">
              Know the methodology <Maximize2 size={10} />
            </Link>
            <div className="w-px h-3 bg-[#e5e5e5] dark:border-[#262626]" />
            <Link to="/about" className="text-xs text-[#737373] flex items-center gap-1 hover:text-black dark:hover:text-white">
              What is CloudCompareCosts? <Maximize2 size={10} />
            </Link>
            <div className="w-px h-3 bg-[#e5e5e5] dark:border-[#262626]" />
            <a href="mailto:hello@comparecloudcosts.com" className="text-xs font-bold text-[#737373] flex items-center gap-1 hover:text-black dark:hover:text-white">
              Questions or feedback? <ArrowRight size={10} />
            </a>
          </div>
        </div>
      </nav>

      {/* Capabilities Sub-header */}
      <div className="h-10 border-b border-[#e5e5e5] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#080808] flex items-center px-4 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#171717] rounded shadow-sm border border-[#e5e5e5] dark:border-[#262626] cursor-default">
            <span className="text-xs font-bold flex items-center gap-1.5">
              🖥️ Virtual Machines
            </span>
          </div>

          <div className="flex items-center gap-2 group opacity-60">
            <span className="text-xs font-medium text-[#737373] flex items-center gap-1.5">
              🗄️ Databases
              <span className="text-[8px] font-bold bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] px-1 rounded uppercase tracking-tighter">Soon</span>
            </span>
          </div>

          <div className="flex items-center gap-2 group opacity-60">
            <span className="text-xs font-medium text-[#737373] flex items-center gap-1.5">
              💾 Storage
              <span className="text-[8px] font-bold bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] px-1 rounded uppercase tracking-tighter">Soon</span>
            </span>
          </div>

          <div className="flex items-center gap-2 group opacity-60">
            <span className="text-xs font-medium text-[#737373] flex items-center gap-1.5">
              ⚡ Serverless
              <span className="text-[8px] font-bold bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] px-1 rounded uppercase tracking-tighter">Soon</span>
            </span>
          </div>

          <div className="flex items-center gap-2 group opacity-60">
            <span className="text-xs font-medium text-[#737373] flex items-center gap-1.5">
              📦 Containers
              <span className="text-[8px] font-bold bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] px-1 rounded uppercase tracking-tighter">Soon</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar Filters */}
        <aside className="w-72 border-r border-[#e5e5e5] dark:border-[#262626] flex flex-col shrink-0 overflow-y-auto bg-white dark:bg-[#000000] custom-scrollbar pb-10">
          <div className="p-4 space-y-8">

            {/* Providers Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5">
                  Provider <Info size={10} />
                </h3>
                <button
                  onClick={() => {
                    if (selectedProviders.length === PROVIDERS.filter(p => !p.soon).length) {
                      setSelectedProviders([]);
                    } else {
                      setSelectedProviders(PROVIDERS.filter(p => !p.soon).map(p => p.id));
                    }
                  }}
                  className={`text-[10px] font-bold uppercase transition-colors ${selectedProviders.length === PROVIDERS.filter(p => !p.soon).length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}
                >
                  {selectedProviders.length === PROVIDERS.filter(p => !p.soon).length ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    disabled={p.soon}
                    onClick={() => {
                      if (p.soon) return;
                      toggleFilter(selectedProviders, setSelectedProviders, p.id);
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border flex items-center gap-2 ${
                      p.soon
                      ? 'bg-transparent text-[#737373] border-[#e5e5e5] dark:border-[#262626] cursor-not-allowed opacity-60'
                      : selectedProviders.includes(p.id)
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                    {p.soon && <span className="bg-[#737373] text-white text-[7px] px-1 rounded ml-1">SOON</span>}
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            {/* Pricing Mode Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5">
                  PAYG OR YEARLY PRICE <Info size={10} />
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowAggregation(false)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                    !showAggregation
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                  }`}
                >
                  PAYG
                </button>
                <button
                  onClick={() => setShowAggregation(true)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                    showAggregation
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            {/* Category Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5">
                  Category <Info size={10} />
                </h3>
                <button
                  onClick={() => {
                    if (selectedCategory.length === CATEGORIES.length) {
                      setSelectedCategory([]);
                    } else {
                      setSelectedCategory([...CATEGORIES]);
                    }
                  }}
                  className={`text-[10px] font-bold uppercase transition-colors ${selectedCategory.length === CATEGORIES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}
                >
                  {selectedCategory.length === CATEGORIES.length ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleFilter(selectedCategory, setSelectedCategory, category)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                      selectedCategory.includes(category)
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            {/* Geography Section */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5">
                  Geography <Info size={10} />
                </h3>
                <button
                  onClick={() => {
                    if (selectedGeographies.length === GEOGRAPHIES.length) {
                      setSelectedGeographies([]);
                    } else {
                      setSelectedGeographies([...GEOGRAPHIES]);
                    }
                  }}
                  className={`text-[10px] font-bold uppercase transition-colors ${selectedGeographies.length === GEOGRAPHIES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}
                >
                  {selectedGeographies.length === GEOGRAPHIES.length ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {GEOGRAPHIES.map(geo => (
                  <button
                    key={geo}
                    onClick={() => toggleFilter(selectedGeographies, setSelectedGeographies, geo)}
                    className={`px-3 py-1 rounded text-[10px] font-bold transition-all border ${
                      selectedGeographies.includes(geo)
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {geo}
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            {/* Operating System Section */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5">
                  Operating System <Info size={10} />
                </h3>
                <button
                  onClick={() => {
                    if (selectedOS.length === OS_TYPES.length) {
                      setSelectedOS([]);
                    } else {
                      setSelectedOS([...OS_TYPES]);
                    }
                  }}
                  className={`text-[10px] font-bold uppercase transition-colors ${selectedOS.length === OS_TYPES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}
                >
                  {selectedOS.length === OS_TYPES.length ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {OS_TYPES.map(os => (
                  <button
                    key={os}
                    onClick={() => toggleFilter(selectedOS, setSelectedOS, os)}
                    className={`px-4 py-1.5 rounded text-[10px] font-bold transition-all border ${
                      selectedOS.includes(os)
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {os}
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            {/* CPU Section */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5">
                  CPU <Info size={10} />
                </h3>
                <button
                  onClick={() => {
                    if (selectedCpu.length === CPU_PROFILES.length) {
                      setSelectedCpu([]);
                    } else {
                      setSelectedCpu(CPU_PROFILES.map(p => p.id));
                    }
                  }}
                  className={`text-[10px] font-bold uppercase transition-colors ${selectedCpu.length === CPU_PROFILES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}
                >
                  {selectedCpu.length === CPU_PROFILES.length ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {CPU_PROFILES.map(profile => (
                  <button
                    key={profile.id}
                    onClick={() => toggleFilter(selectedCpu, setSelectedCpu, profile.id)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                      selectedCpu.includes(profile.id)
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {profile.label}
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            {/* GPU Section */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5">
                  GPU <Info size={10} />
                </h3>
                <button
                  onClick={() => {
                    if (selectedGpu.length === GPU_OPTIONS.length) {
                      setSelectedGpu([]);
                    } else {
                      setSelectedGpu([...GPU_OPTIONS]);
                    }
                  }}
                  className={`text-[10px] font-bold uppercase transition-colors ${selectedGpu.length === GPU_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}
                >
                  {selectedGpu.length === GPU_OPTIONS.length ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {GPU_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleFilter(selectedGpu, setSelectedGpu, opt)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${
                      selectedGpu.includes(opt)
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            {/* Range Sliders Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5">
                  Specs & Price <Info size={10} />
                </h3>
              </div>
              <div className="space-y-8 px-1">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[#737373]">vCPU</div>
                  <RangeSlider
                    min={1}
                    max={128}
                    value={vCpuRange}
                    onChange={setVCpuRange}
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[#737373]">Memory (GB)</div>
                  <RangeSlider
                    min={0}
                    max={440}
                    value={memoryRange}
                    onChange={setMemoryRange}
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[#737373]">Hourly price ($)</div>
                  <RangeSlider
                    min={0}
                    max={510}
                    step={0.1}
                    unit="$"
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                </div>
              </div>
            </section>
          </div>
        </aside>


        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-white dark:bg-[#000000] overflow-hidden">

          {/* Provider Summary Cards */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-px bg-[#e5e5e5] dark:bg-[#262626]">
            {PROVIDERS.filter(p => !p.soon).map(p => {
              const filteredCount = providerCounts[p.id];
              const dbProvider = dbStatus?.providers.find(dp => dp.slug === p.id || dp.slug === p.name.toLowerCase());
              const dbCount = dbProvider ? parseInt(dbProvider.count) : 0;
              // Prefer the filter-aware count from /api/pricing/counts; fall back to total
              // DB count before the first fetch resolves.
              const displayCount = filteredCount !== undefined ? filteredCount : dbCount;

              const activeNonSoon = PROVIDERS.filter(pr => !pr.soon).map(pr => pr.id);
              const isSelected = selectedProviders.length === activeNonSoon.length || selectedProviders.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (p.soon) return;
                    if (selectedProviders.includes(p.id) && selectedProviders.length === 1) {
                      setSelectedProviders(activeNonSoon);
                    } else {
                      setSelectedProviders([p.id]);
                    }
                  }}
                  className={`bg-white dark:bg-[#000000] p-4 group transition-all border-b-2 ${
                    p.soon ? 'cursor-default opacity-40 grayscale' : 'cursor-pointer'
                  } ${
                    isSelected ? 'border-black dark:border-white' : 'border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{p.name}</span>
                    {p.soon && <span className="text-[7px] font-bold bg-[#737373] text-white px-1 rounded ml-1 border border-white/20">SOON</span>}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-black dark:text-white">{p.soon ? '-' : displayCount}</span>
                    <span className="text-[10px] text-[#737373] font-medium uppercase tracking-tighter">instances</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Toolbar */}
          <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-[#000000] border-b border-[#e5e5e5] dark:border-[#262626]">
            <div className="flex items-center gap-6">
              <span className="text-xl font-bold text-black dark:text-white shrink-0">
                {data.length} <span className="text-[#737373] dark:text-[#a3a3a3] font-normal text-base">instances</span>
                {data.length === 1000 && <span className="ml-2 text-[10px] font-normal text-[#a3a3a3]">(top 1,000 shown)</span>}
              </span>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#f5f5f5] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded px-10 py-2 text-xs w-48 md:w-64 focus:outline-none focus:border-black/10 dark:focus:border-white/20 transition-all placeholder:text-[#a3a3a3]"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              {dbStatus?.lastUpdated && (
                <span className="text-[10px] text-[#737373] dark:text-[#525252] font-medium">
                  Price information as of {new Date(dbStatus.lastUpdated).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              )}
              <span className="text-[10px] text-[#737373] dark:text-[#525252] font-medium">Click a column header to sort</span>

              <button className="flex items-center gap-2 text-[10px] font-bold text-[#737373] dark:text-[#a3a3a3] border border-[#e5e5e5] dark:border-[#262626] px-3 py-1.5 rounded hover:bg-[#f5f5f5] dark:hover:bg-[#171717] transition-all">
                <Download size={12} /> Export CSV
              </button>
            </div>
          </div>

          {/* Main Pricing Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            <div className="min-w-fit">
              <table className="min-w-full border-collapse">
                <thead className="sticky top-0 bg-white dark:bg-[#000000] z-10 border-b border-[#e5e5e5] dark:border-[#262626]">
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-[#171717] dark:text-[#e5e5e5]">
                    <th onClick={() => sortData('provider')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                      Provider <ChevronDown size={8} className={`inline ml-1 transition-transform ${sortConfig.key === 'provider' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    </th>
                    <th onClick={() => sortData('instance_type')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                      Instance <ChevronDown size={8} className={`inline ml-1 transition-transform ${sortConfig.key === 'instance_type' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    </th>
                    <th className="px-6 py-4 text-center font-bold whitespace-nowrap">Category</th>
                    <th className="px-6 py-4 text-center font-bold whitespace-nowrap">CPU Vendor</th>
                    <th className="px-6 py-4 text-center font-bold whitespace-nowrap">Arch</th>
                    <th className="px-6 py-4 text-center font-bold whitespace-nowrap">OS</th>
                    <th onClick={() => sortData('geography')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                      Geography <ChevronDown size={8} className={`inline ml-1 transition-transform ${sortConfig.key === 'geography' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    </th>
                    <th onClick={() => sortData('vcpus')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                      vCPU <ChevronDown size={8} className={`inline ml-1 transition-transform ${sortConfig.key === 'vcpus' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    </th>
                    <th onClick={() => sortData('memory_gb')} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                      Memory <ChevronDown size={8} className={`inline ml-1 transition-transform ${sortConfig.key === 'memory_gb' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    </th>
                    <th onClick={() => sortData('price_per_unit')} className="px-6 py-4 text-center font-bold text-black dark:text-white whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity">
                      {showAggregation ? 'Yearly price ($)' : 'Hourly price ($)'} <ChevronDown size={8} className={`inline ml-1 transition-transform ${sortConfig.key === 'price_per_unit' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f5] dark:divide-[#181818]">
                  {loading ? (
                    Array.from({ length: 15 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 11 }).map((_, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-3 bg-[#f5f5f5] dark:bg-[#171717] rounded w-16 mx-auto"></div></td>
                        ))}
                      </tr>
                    ))
                  ) : data.length > 0 ? (
                    data.map((record, index) => (
                      <tr key={index} className={`transition-colors group ${index % 2 === 0 ? 'bg-white dark:bg-[#000000]' : 'bg-[#f7f7f7] dark:bg-[#0a0a0a]'} hover:bg-[#eef2ff] dark:hover:bg-[#111827]`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: PROVIDERS.find(p => (record.provider || '').toLowerCase() === p.id || record.provider === p.name)?.color || '#525252' }}
                            />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373] dark:text-[#a3a3a3]">
                              {record.provider}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-xs font-bold text-black dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">{record.instance_type}</span>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.category || 'General purpose'}</span>
                            {record.gpu_count > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-bold border border-blue-500/20 uppercase tracking-widest">GPU</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373] dark:text-[#a3a3a3]">{record.cpu_vendor}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.arch}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-[#737373] text-[10px] uppercase text-center whitespace-nowrap">{record.os}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.geography}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.vcpus}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.memory_gb} GB</span>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className="text-xs font-bold text-black dark:text-white">
                            {showAggregation
                              ? `$${(parseFloat(record.price_per_unit) * 8760).toFixed(2)}`
                              : `$${parseFloat(record.price_per_unit).toFixed(4)}`}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-6 py-32 text-center text-[#737373] dark:text-[#525252] italic text-sm">
                        <div className="flex flex-col items-center gap-4">
                          <span>No instances match your filters.</span>
                          {dbStatus && dbStatus.total === 0 && (
                            <div className="p-4 border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 rounded-lg max-w-md">
                              <p className="text-amber-800 dark:text-amber-400 font-bold mb-1">⚠️ Database is empty</p>
                              <p className="text-amber-700 dark:text-amber-500 text-xs not-italic">
                                It looks like the pricing data hasn't been ingested yet.
                                The pipeline runs automatically, but if this persists, try clicking "Support this project" to learn more.
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #262626; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a3a3a3; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #404040; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        input[type="range"].absolute {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
        }

        input[type="range"].absolute::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          border: 1px solid #d4d4d4;
        }

        .dark input[type="range"].absolute::-webkit-slider-thumb {
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          border: 1px solid #404040;
        }

        input[type="range"].absolute::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: auto;
          border: 1px solid #d4d4d4;
        }

        .dark input[type="range"].absolute::-moz-range-thumb {
          border: 1px solid #404040;
        }

        .slider-input-min {
          z-index: 30;
        }

        .slider-input-max {
          z-index: 20;
        }
      `}} />
    </div>
  );
}
