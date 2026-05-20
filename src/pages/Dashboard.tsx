import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Download,
  ChevronDown,
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
  data_source?: string;
  attributes?: {
    engine?: string;
    engine_version?: string;
    deployment_type?: string;
    ha_mode?: string;
    storage_type?: string;
    workload?: string;
    tier?: string;
    cold_start_overhead_ms?: string | number;
    timeout_seconds?: string | number;
    memory_configuration?: string;
    free_invocations_per_month?: string | number;
  };
}

type ProductType = 'vm' | 'database' | 'serverless';

const PROVIDERS: { id: string; name: string; color: string; soon?: boolean }[] = [
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

// Database-view constants
const DB_FAMILIES = ['Relational', 'NoSQL'];
const DB_ENGINES = ['PostgreSQL', 'MySQL', 'MariaDB', 'SQL Server', 'Oracle DB', 'Cosmos DB', 'MongoDB', 'Redis', 'Valkey', 'DB2'];
const DEPLOYMENT_TYPES = ['Provisioned', 'Serverless'];
const HA_MODES = ['Single AZ', 'Multi AZ', 'Zone Redundant', 'Multi Region', 'Geo Redundant'];

// Serverless-view constants
const SERVERLESS_LANGUAGES = ['Python', 'Node.js', 'Go', 'Java', 'C#', 'Ruby', 'JavaScript', 'PHP', 'Rust', 'PowerShell', 'TypeScript', 'Any (Container)'];
const SERVERLESS_COLD_START_OPTIONS = ['Fast < 100', 'Medium 100-200', 'Slow > 200'];
const SERVERLESS_TIMEOUT_OPTIONS = ['Short (5)', 'Medium (10)', 'Long (15+)'];
const SERVERLESS_MEMORY_CONFIG_OPTIONS = ['Configurable', 'Tiers', 'Automatic'];
const SERVERLESS_FREE_TIER_OPTIONS = ['Included', 'Not included'];

const DEFAULT_VCPU_RANGE   = { min: 0,   max: 320 };
const DEFAULT_MEMORY_RANGE = { min: 0,   max: 3200 };
const DEFAULT_PRICE_RANGE  = { min: 0,   max: 510 };

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
  const [activeProductType, setActiveProductType] = useState<ProductType>('vm');

  const [selectedProviders, setSelectedProviders] = useState<string[]>(PROVIDERS.filter(p => !p.soon).map(p => p.id));
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([...GEOGRAPHIES]);
  const [selectedOS, setSelectedOS] = useState<string[]>([...OS_TYPES]);
  const [selectedCpu, setSelectedCpu] = useState<string[]>(CPU_PROFILES.map(p => p.id));
  const [selectedCategory, setSelectedCategory] = useState<string[]>([...CATEGORIES]);
  // gpuIncluded uses INCLUSION semantics matching every other pill in the
  // sidebar: true = GPU instances are included in the result set (default,
  // selected pill); false = GPU instances are excluded. This is intentionally
  // a flip of the older "gpu-only" mode — the GPU pill is now just one of
  // the CPU | GPU section's filter chips, and Select All / Clear All operate
  // on it like every other chip.
  const [gpuIncluded, setGpuIncluded] = useState(true);

  // Database-specific filter state
  const [selectedDbFamilies, setSelectedDbFamilies] = useState<string[]>([...DB_FAMILIES]);
  const [selectedEngines, setSelectedEngines] = useState<string[]>([...DB_ENGINES]);
  const [selectedDeploymentTypes, setSelectedDeploymentTypes] = useState<string[]>([...DEPLOYMENT_TYPES]);
  const [selectedHaModes, setSelectedHaModes] = useState<string[]>([...HA_MODES]);

  // Serverless-specific filter state
  const [selectedServerlessLanguages, setSelectedServerlessLanguages] = useState<string[]>([...SERVERLESS_LANGUAGES]);
  const [selectedServerlessColdStart, setSelectedServerlessColdStart] = useState<string[]>([...SERVERLESS_COLD_START_OPTIONS]);
  const [selectedServerlessTimeout, setSelectedServerlessTimeout] = useState<string[]>([...SERVERLESS_TIMEOUT_OPTIONS]);
  const [selectedServerlessMemoryConfig, setSelectedServerlessMemoryConfig] = useState<string[]>([...SERVERLESS_MEMORY_CONFIG_OPTIONS]);
  const [selectedServerlessFreeTier, setSelectedServerlessFreeTier] = useState<string[]>([...SERVERLESS_FREE_TIER_OPTIONS]);

  const [vCpuRange, setVCpuRange] = useState({ ...DEFAULT_VCPU_RANGE });
  const [memoryRange, setMemoryRange] = useState({ ...DEFAULT_MEMORY_RANGE });
  const [priceRange, setPriceRange] = useState({ ...DEFAULT_PRICE_RANGE });
  const [search, setSearch] = useState('');
  const [showAggregation, setShowAggregation] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PricingRecord | string, direction: 'asc' | 'desc' }>({ key: 'price_per_unit', direction: 'asc' });

  const [data, setData] = useState<PricingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ total: number, providers: any[], lastUpdated: string | null } | null>(null);
  const [providerCounts, setProviderCounts] = useState<Record<string, number>>({});

  // Column resize state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    provider: 120,
    instance_type: 160,
    engine_category: 130,
    db_family_cpu_vendor: 150,
    deployment_arch: 130,
    ha_mode_os: 120,
    gpu: 70,
    geography: 130,
    vcpus: 80,
    memory_gb: 100,
    price_per_unit: 130,
    source: 80,
  });
  const [resizingColumnId, setResizingColumnId] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  // True when the pointer actually moved during a resize drag. Used to suppress
  // the th onClick sort that would otherwise fire after every mouseup.
  const resizeDraggedRef = useRef(false);

  // Tracks which product types have already been auto-fitted so we only run
  // the initial column-width measurement once per tab switch per page session.
  const autoSizedFor = useRef(new Set<ProductType>());

  // Ref + state for the table scroll container, used to detect whether there
  // is actual horizontal overflow and to show / hide the right-edge fade hint.
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  // Sum of active column widths. The GPU column only exists in VM view, so
  // exclude it from the DB view total to avoid a 70px phantom gap.
  const totalTableWidth = useMemo(() => {
    const keys = Object.keys(columnWidths).filter(
      k => k !== 'gpu' || activeProductType === 'vm'
    );
    return keys.reduce((sum, k) => sum + columnWidths[k], 0);
  }, [columnWidths, activeProductType]);

  // Sidebar section expand/collapse state — all expanded by default; user can
  // collapse top sections to make the bottom ones (vCPU/Memory/Price sliders)
  // more discoverable.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    provider: true,
    pricing: true,
    category: true,
    geography: true,
    os: true,
    cpu: true,
    specs: true,
    dbFamily: true,
    engine: true,
    deploymentType: true,
    haMode: true,
    languages: true,
    coldStart: true,
    timeout: true,
    memoryConfig: true,
    freeTier: true,
  });
  const toggleSection = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  // Load column widths from localStorage on mount.
  // Merge over defaults so any new columns added after the user's last visit
  // still get their initial widths (e.g. the gpu column added in a later deploy).
  useEffect(() => {
    const stored = localStorage.getItem('comparecloudcosts_columnWidths');
    if (stored) {
      try {
        setColumnWidths(prev => ({ ...prev, ...JSON.parse(stored) }));
      } catch (e) {
        console.error('Failed to parse stored column widths:', e);
      }
    }
  }, []);

  // Save column widths to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('comparecloudcosts_columnWidths', JSON.stringify(columnWidths));
  }, [columnWidths]);

  // Auto-fit all column widths to actual rendered content on the first data
  // load for each product type. Two nested rAFs ensure the DOM has fully
  // painted before we measure scrollWidth so long SKU names are captured.
  useEffect(() => {
    if (loading || data.length === 0) return;
    if (autoSizedFor.current.has(activeProductType)) return;

    let raf1: number, raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const colIds = [
          'provider', 'instance_type', 'engine_category', 'db_family_cpu_vendor',
          'deployment_arch', 'ha_mode_os', 'geography', 'vcpus', 'memory_gb',
          'price_per_unit', 'source',
        ];
        if (activeProductType === 'vm') colIds.push('gpu');

        const newWidths: Record<string, number> = {};
        for (const colId of colIds) {
          const cells = document.querySelectorAll<HTMLElement>(`[data-col="${colId}"]`);
          
          // Temporarily remove fixed widths to measure natural content width
          const originalStyles: {el: HTMLElement, width: string, minWidth: string}[] = [];
          cells.forEach(el => {
            originalStyles.push({ el, width: el.style.width, minWidth: el.style.minWidth });
            el.style.width = 'auto';
            el.style.minWidth = 'auto';
          });

          let max = 60;
          // Add a small buffer (24px) for padding/borders to ensure proportional but not cramped fit
          cells.forEach(el => { max = Math.max(max, el.scrollWidth + 24); });
          newWidths[colId] = max;

          // Restore styles
          originalStyles.forEach(({el, width, minWidth}) => {
            el.style.width = width;
            el.style.minWidth = minWidth;
          });
        }
        setColumnWidths(prev => ({ ...prev, ...newWidths }));
        autoSizedFor.current.add(activeProductType);
      });
    });

    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [loading, data, activeProductType]);

  // Watch the table scroll container for horizontal overflow + scroll position.
  // The fade-right hint is shown when the inner content is wider than the
  // container AND the user hasn't yet scrolled to the right edge. This is a
  // belt-and-suspenders fallback for environments where the native scrollbar
  // doesn't render visibly (macOS overlay scrollbars, etc.).
  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;

    const update = () => {
      const overflow = el.scrollWidth > el.clientWidth + 1;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      setHasHorizontalOverflow(overflow);
      setScrolledToEnd(atEnd);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [totalTableWidth, data.length, activeProductType]);

  const sortData = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...data].sort((a, b) => {
      // Handle nested attributes (e.g., 'attributes.engine')
      let valA: any = '';
      let valB: any = '';

      if (key.includes('.')) {
        const parts = key.split('.');
        valA = a[parts[0] as keyof PricingRecord]?.[parts[1]] ?? '';
        valB = b[parts[0] as keyof PricingRecord]?.[parts[1]] ?? '';
      } else {
        valA = a[key as keyof PricingRecord] ?? '';
        valB = b[key as keyof PricingRecord] ?? '';
      }

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

  const handleResizeMouseDown = (columnId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizeDraggedRef.current = false;
    setResizingColumnId(columnId);
    setResizeStartX(e.clientX);
  };

  // Sort click that no-ops when the user just finished a resize drag.
  // Not memoized — must close over the current sortData so it sees fresh data.
  const handleHeaderClick = (key: string) => {
    if (resizeDraggedRef.current) { resizeDraggedRef.current = false; return; }
    sortData(key);
  };

  // Double-click on a resize handle → auto-fit column to widest visible cell.
  const handleResizeDoubleClick = useCallback((columnId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const cells = document.querySelectorAll<HTMLElement>(`[data-col="${columnId}"]`);
    
    const originalStyles: {el: HTMLElement, width: string, minWidth: string}[] = [];
    cells.forEach(el => {
      originalStyles.push({ el, width: el.style.width, minWidth: el.style.minWidth });
      el.style.width = 'auto';
      el.style.minWidth = 'auto';
    });

    let max = 60;
    cells.forEach(el => { max = Math.max(max, el.scrollWidth + 24); });

    originalStyles.forEach(({el, width, minWidth}) => {
      el.style.width = width;
      el.style.minWidth = minWidth;
    });

    setColumnWidths(prev => ({ ...prev, [columnId]: max }));
  }, []);

  const SortIcon = ({ sortKey }: { sortKey: string }) => {
    const isActive = sortConfig.key === sortKey;
    return (
      <span className={`ml-1 inline-block transition-opacity ${isActive ? 'opacity-100' : 'opacity-25'}`}>
        {isActive ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    );
  };

  useEffect(() => {
    if (!resizingColumnId) return;

    const handleMouseMove = (e: MouseEvent) => {
      resizeDraggedRef.current = true;
      const delta = e.clientX - resizeStartX;
      const currentWidth = columnWidths[resizingColumnId];
      const newWidth = Math.max(80, Math.min(400, currentWidth + delta));

      setColumnWidths(prev => ({
        ...prev,
        [resizingColumnId]: newWidth
      }));
      setResizeStartX(e.clientX);
    };

    const handleMouseUp = () => {
      setResizingColumnId(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumnId, resizeStartX, columnWidths]);

  useEffect(() => {
    const isDb = activeProductType === 'database';
    const isVm = activeProductType === 'vm';
    const isServerless = activeProductType === 'serverless';

    // Build query params with all active filters to get counts that reflect
    // the current filter state (ensures "of X" numbers are correct in the UI)
    const params = new URLSearchParams();
    params.append('productType', isDb ? 'database' : (isServerless ? 'serverless' : 'compute'));
    if (selectedGeographies.length > 0 && selectedGeographies.length < GEOGRAPHIES.length) {
      params.append('geography', selectedGeographies.join(','));
    }

    if (isDb) {
      if (selectedDbFamilies.length > 0 && selectedDbFamilies.length < DB_FAMILIES.length) {
        params.append('category', selectedDbFamilies.join(','));
      }
      if (selectedEngines.length > 0 && selectedEngines.length < DB_ENGINES.length) {
        params.append('engine', selectedEngines.join(','));
      }
      if (selectedDeploymentTypes.length > 0 && selectedDeploymentTypes.length < DEPLOYMENT_TYPES.length) {
        params.append('deploymentType', selectedDeploymentTypes.join(','));
      }
      if (selectedHaModes.length > 0 && selectedHaModes.length < HA_MODES.length) {
        params.append('haMode', selectedHaModes.join(','));
      }
    } else if (isVm) {
      if (selectedOS.length > 0 && selectedOS.length < OS_TYPES.length) {
        params.append('os', selectedOS.join(','));
      }
      if (selectedCpu.length > 0 && selectedCpu.length < CPU_PROFILES.length) {
        const vendors = [...new Set(selectedCpu.map(id => CPU_PROFILES.find(p => p.id === id)!.vendor))];
        params.append('cpuVendor', vendors.join(','));
      }
      if (selectedCategory.length > 0 && selectedCategory.length < CATEGORIES.length) {
        params.append('category', selectedCategory.join(','));
      }
      // Inclusion semantics: only push a gpu filter when the user has
      // *excluded* GPU instances (pill deselected). Default state =
      // included = no filter = show all (with or without GPU).
      if (!gpuIncluded) {
        params.append('gpu', 'false');
      }
    } else if (isServerless) {
      if (selectedServerlessLanguages.length > 0 && selectedServerlessLanguages.length < SERVERLESS_LANGUAGES.length) {
        params.append('language', selectedServerlessLanguages.join(','));
      }
      if (selectedServerlessColdStart.length > 0 && selectedServerlessColdStart.length < SERVERLESS_COLD_START_OPTIONS.length) {
        params.append('coldStart', selectedServerlessColdStart.join(','));
      }
      if (selectedServerlessTimeout.length > 0 && selectedServerlessTimeout.length < SERVERLESS_TIMEOUT_OPTIONS.length) {
        params.append('timeout', selectedServerlessTimeout.join(','));
      }
      if (selectedServerlessMemoryConfig.length > 0 && selectedServerlessMemoryConfig.length < SERVERLESS_MEMORY_CONFIG_OPTIONS.length) {
        params.append('memoryConfig', selectedServerlessMemoryConfig.join(','));
      }
      if (selectedServerlessFreeTier.length > 0 && selectedServerlessFreeTier.length < SERVERLESS_FREE_TIER_OPTIONS.length) {
        params.append('freeTier', selectedServerlessFreeTier.join(','));
      }
    }

    params.append('minVcpu', vCpuRange.min.toString());
    params.append('maxVcpu', vCpuRange.max.toString());
    params.append('minMemory', memoryRange.min.toString());
    params.append('maxMemory', memoryRange.max.toString());
    params.append('minPrice', priceRange.min.toString());
    params.append('maxPrice', priceRange.max.toString());

    fetch(`/api/health?${params.toString()}`)
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
  }, [
    activeProductType,
    selectedGeographies, selectedOS, selectedCpu, selectedCategory, gpuIncluded,
    selectedDbFamilies, selectedEngines, selectedDeploymentTypes, selectedHaModes,
    selectedServerlessLanguages, selectedServerlessColdStart, selectedServerlessTimeout, selectedServerlessMemoryConfig, selectedServerlessFreeTier,
    vCpuRange, memoryRange, priceRange,
  ]);

  const fetchFilteredData = useCallback(async () => {
    const isDb = activeProductType === 'database';
    const isVm = activeProductType === 'vm';
    const isServerless = activeProductType === 'serverless';

    // Guard: require at least one selection in every active filter
    if (selectedProviders.length === 0 || selectedGeographies.length === 0) {
      setData([]);
      setProviderCounts({});
      setLoading(false);
      return;
    }
    if (isVm && (selectedOS.length === 0 || selectedCpu.length === 0 || selectedCategory.length === 0)) {
      setData([]);
      setProviderCounts({});
      setLoading(false);
      return;
    }
    if (isDb && (selectedDbFamilies.length === 0 || selectedEngines.length === 0 || selectedDeploymentTypes.length === 0 || selectedHaModes.length === 0)) {
      setData([]);
      setProviderCounts({});
      setLoading(false);
      return;
    }
    if (isServerless && (
      selectedServerlessLanguages.length === 0 ||
      selectedServerlessColdStart.length === 0 ||
      selectedServerlessTimeout.length === 0 ||
      selectedServerlessMemoryConfig.length === 0 ||
      selectedServerlessFreeTier.length === 0
    )) {
      setData([]);
      setProviderCounts({});
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const baseParams = new URLSearchParams();
      baseParams.append('productType', isDb ? 'database' : (isServerless ? 'serverless' : 'compute'));
      if (selectedGeographies.length > 0 && selectedGeographies.length < GEOGRAPHIES.length) baseParams.append('geography', selectedGeographies.join(','));

      if (isDb) {
        // DB-specific filters
        if (selectedDbFamilies.length > 0 && selectedDbFamilies.length < DB_FAMILIES.length) {
          baseParams.append('category', selectedDbFamilies.join(','));
        }
        if (selectedEngines.length > 0 && selectedEngines.length < DB_ENGINES.length) {
          baseParams.append('engine', selectedEngines.join(','));
        }
        if (selectedDeploymentTypes.length > 0 && selectedDeploymentTypes.length < DEPLOYMENT_TYPES.length) {
          baseParams.append('deploymentType', selectedDeploymentTypes.join(','));
        }
        if (selectedHaModes.length > 0 && selectedHaModes.length < HA_MODES.length) {
          baseParams.append('haMode', selectedHaModes.join(','));
        }
      } else if (isVm) {
        // VM-specific filters
        if (selectedOS.length > 0 && selectedOS.length < OS_TYPES.length) baseParams.append('os', selectedOS.join(','));
        if (selectedCpu.length > 0 && selectedCpu.length < CPU_PROFILES.length) {
          const vendors = [...new Set(selectedCpu.map(id => CPU_PROFILES.find(p => p.id === id)!.vendor))];
          baseParams.append('cpuVendor', vendors.join(','));
        }
        if (selectedCategory.length > 0 && selectedCategory.length < CATEGORIES.length) {
          baseParams.append('category', selectedCategory.join(','));
        }
        // Inclusion semantics — see useState init for gpuIncluded.
        if (!gpuIncluded) {
          baseParams.append('gpu', 'false');
        }
      } else if (isServerless) {
        // Serverless-specific filters
        if (selectedServerlessLanguages.length > 0 && selectedServerlessLanguages.length < SERVERLESS_LANGUAGES.length) {
          baseParams.append('language', selectedServerlessLanguages.join(','));
        }
        if (selectedServerlessColdStart.length > 0 && selectedServerlessColdStart.length < SERVERLESS_COLD_START_OPTIONS.length) {
          baseParams.append('coldStart', selectedServerlessColdStart.join(','));
        }
        if (selectedServerlessTimeout.length > 0 && selectedServerlessTimeout.length < SERVERLESS_TIMEOUT_OPTIONS.length) {
          baseParams.append('timeout', selectedServerlessTimeout.join(','));
        }
        if (selectedServerlessMemoryConfig.length > 0 && selectedServerlessMemoryConfig.length < SERVERLESS_MEMORY_CONFIG_OPTIONS.length) {
          baseParams.append('memoryConfig', selectedServerlessMemoryConfig.join(','));
        }
        if (selectedServerlessFreeTier.length > 0 && selectedServerlessFreeTier.length < SERVERLESS_FREE_TIER_OPTIONS.length) {
          baseParams.append('freeTier', selectedServerlessFreeTier.join(','));
        }
      }

      baseParams.append('minVcpu', vCpuRange.min.toString());
      baseParams.append('maxVcpu', vCpuRange.max.toString());
      baseParams.append('minMemory', memoryRange.min.toString());
      baseParams.append('maxMemory', memoryRange.max.toString());
      baseParams.append('minPrice', priceRange.min.toString());
      baseParams.append('maxPrice', priceRange.max.toString());
      baseParams.append('search', search);

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
  }, [
    activeProductType,
    selectedProviders, selectedGeographies,
    selectedOS, selectedCpu, selectedCategory, gpuIncluded,
    selectedDbFamilies, selectedEngines, selectedDeploymentTypes, selectedHaModes,
    selectedServerlessLanguages, selectedServerlessColdStart, selectedServerlessTimeout, selectedServerlessMemoryConfig, selectedServerlessFreeTier,
    vCpuRange, memoryRange, priceRange, search, showAggregation,
  ]);

  useEffect(() => {
    const timeout = setTimeout(fetchFilteredData, 300);
    return () => clearTimeout(timeout);
  }, [fetchFilteredData]);

  // Truthful total across the providers the user has currently selected. Sums
  // the per-provider counts from /api/pricing/counts (which already respect
  // every other filter). Used by the toolbar so the displayed total reflects
  // the actual filtered pool — even when the table is capped at 1,000 rows.
  const totalFilteredCount = useMemo(() => {
    return selectedProviders.reduce((sum, providerId) => sum + (providerCounts[providerId] || 0), 0);
  }, [selectedProviders, providerCounts]);

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
              Multi-cloud price comparison made it easier.
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {dbStatus?.lastUpdated && (
            <span className="text-xs text-[#737373] flex items-center gap-1">
              Price information as of {new Date(dbStatus.lastUpdated).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
          )}
        </div>
      </nav>

      {/* Capabilities Sub-header */}
      <div className="h-10 border-b border-[#e5e5e5] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#080808] flex items-center px-4 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveProductType('vm')}
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
              activeProductType === 'vm'
                ? 'bg-white dark:bg-[#171717] shadow-sm border-[#e5e5e5] dark:border-[#262626] cursor-default'
                : 'border-transparent text-[#737373] hover:text-black dark:hover:text-white opacity-60 hover:opacity-100'
            }`}
          >
            <span className={`text-xs font-bold flex items-center gap-1.5 ${activeProductType !== 'vm' ? 'font-medium' : ''}`}>
              🖥️ Virtual Machines
            </span>
          </button>

          <button
            onClick={() => setActiveProductType('database')}
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
              activeProductType === 'database'
                ? 'bg-white dark:bg-[#171717] shadow-sm border-[#e5e5e5] dark:border-[#262626] cursor-default'
                : 'border-transparent text-[#737373] hover:text-black dark:hover:text-white opacity-60 hover:opacity-100'
            }`}
          >
            <span className="text-xs font-bold flex items-center gap-1.5">
              🗄️ Databases
            </span>
          </button>

          <button
            onClick={() => setActiveProductType('serverless')}
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
              activeProductType === 'serverless'
                ? 'bg-white dark:bg-[#171717] shadow-sm border-[#e5e5e5] dark:border-[#262626] cursor-default'
                : 'border-transparent text-[#737373] hover:text-black dark:hover:text-white opacity-60 hover:opacity-100'
            }`}
          >
            <span className={`text-xs font-bold flex items-center gap-1.5 ${activeProductType !== 'serverless' ? 'font-medium' : ''}`}>
              ⚡ Serverless
            </span>
          </button>

          <div className="flex items-center gap-2 group opacity-60">
            <span className="text-xs font-medium text-[#737373] flex items-center gap-1.5">
              💾 Storage
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
                <h2 className="m-0">
                  <button
                    onClick={() => toggleSection('provider')}
                    className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ChevronDown size={10} className={`transition-transform ${expanded.provider ? '' : '-rotate-90'}`} />
                    Provider <span title="Cloud providers offering virtual machine pricing. Click a provider tile or chip to filter." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                  </button>
                </h2>
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
              {expanded.provider && (
              <div className="flex flex-wrap gap-2">
                {PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    disabled={p.soon}
                    onClick={() => {
                      if (p.soon) return;
                      toggleFilter(selectedProviders, setSelectedProviders, p.id);
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border flex items-center ${
                      p.soon
                      ? 'bg-transparent text-[#737373] border-[#e5e5e5] dark:border-[#262626] cursor-not-allowed opacity-60'
                      : selectedProviders.includes(p.id)
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'
                    }`}
                  >
                    {p.name}
                    {p.soon && <span className="bg-[#737373] text-white text-[7px] px-1 rounded ml-1">SOON</span>}
                  </button>
                ))}
              </div>
              )}
            </section>

            {activeProductType === 'vm' && (
              <>
                {/* ── VM: Category ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('category')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.category ? '' : '-rotate-90'}`} />
                        Category <span title="Instance type purpose, derived from each cloud's published instance families." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedCategory.length === CATEGORIES.length ? setSelectedCategory([]) : setSelectedCategory([...CATEGORIES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedCategory.length === CATEGORIES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedCategory.length === CATEGORIES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.category && (
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(category => (
                      <button key={category} onClick={() => toggleFilter(selectedCategory, setSelectedCategory, category)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedCategory.includes(category) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {category}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── VM: Geography ── */}
                <section className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('geography')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.geography ? '' : '-rotate-90'}`} />
                        Geography <span title="Geographic region where the VM runs." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedGeographies.length === GEOGRAPHIES.length ? setSelectedGeographies([]) : setSelectedGeographies([...GEOGRAPHIES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedGeographies.length === GEOGRAPHIES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedGeographies.length === GEOGRAPHIES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.geography && (
                  <div className="flex flex-wrap gap-2">
                    {GEOGRAPHIES.map(geo => (
                      <button key={geo} onClick={() => toggleFilter(selectedGeographies, setSelectedGeographies, geo)}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all border ${selectedGeographies.includes(geo) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {geo}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── VM: Operating System ── */}
                <section className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('os')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.os ? '' : '-rotate-90'}`} />
                        Operating System <span title="The operating system running on the VM." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedOS.length === OS_TYPES.length ? setSelectedOS([]) : setSelectedOS([...OS_TYPES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedOS.length === OS_TYPES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedOS.length === OS_TYPES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.os && (
                  <div className="flex flex-wrap gap-2">
                    {OS_TYPES.map(os => (
                      <button key={os} onClick={() => toggleFilter(selectedOS, setSelectedOS, os)}
                        className={`px-4 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedOS.includes(os) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {os}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── VM: CPU | GPU ── */}
                <section className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('cpu')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.cpu ? '' : '-rotate-90'}`} />
                        CPU | GPU <span title="Processor vendor, architecture, and GPU accelerator." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => {
                        // GPU pill is treated as just another chip in this section,
                        // so "all selected" means every CPU profile is in AND the
                        // GPU pill is on. Clear All turns every chip in the
                        // section off — including GPU — to match the other
                        // sidebar sections' Clear All behaviour.
                        const allSelected = selectedCpu.length === CPU_PROFILES.length && gpuIncluded;
                        if (allSelected) { setSelectedCpu([]); setGpuIncluded(false); }
                        else { setSelectedCpu(CPU_PROFILES.map(p => p.id)); setGpuIncluded(true); }
                      }} className={`text-[10px] font-bold uppercase transition-colors ${selectedCpu.length === CPU_PROFILES.length && gpuIncluded ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedCpu.length === CPU_PROFILES.length && gpuIncluded ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.cpu && (
                  <div className="flex flex-wrap gap-2">
                    {CPU_PROFILES.map(profile => (
                      <button key={profile.id} onClick={() => toggleFilter(selectedCpu, setSelectedCpu, profile.id)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedCpu.includes(profile.id) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {profile.label}
                      </button>
                    ))}
                    <button
                      title="Include GPU instances in the results. Deselect to exclude GPU instances."
                      onClick={() => setGpuIncluded(v => !v)}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${gpuIncluded ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                      GPU
                    </button>
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
              </>
            )}

            {activeProductType === 'database' && (
              <>
                {/* ── DB: DB Family ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('dbFamily')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.dbFamily ? '' : '-rotate-90'}`} />
                        DATABASE FAMILY <span title="The broad category of the database system: Relational (SQL-based) or NoSQL." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedDbFamilies.length === DB_FAMILIES.length ? setSelectedDbFamilies([]) : setSelectedDbFamilies([...DB_FAMILIES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedDbFamilies.length === DB_FAMILIES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedDbFamilies.length === DB_FAMILIES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.dbFamily && (
                  <div className="flex flex-wrap gap-2">
                    {DB_FAMILIES.map(f => (
                      <button key={f} onClick={() => toggleFilter(selectedDbFamilies, setSelectedDbFamilies, f)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedDbFamilies.includes(f) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── DB: Geography ── */}
                <section className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('geography')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.geography ? '' : '-rotate-90'}`} />
                        Geography <span title="Geographic region where the database is deployed." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedGeographies.length === GEOGRAPHIES.length ? setSelectedGeographies([]) : setSelectedGeographies([...GEOGRAPHIES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedGeographies.length === GEOGRAPHIES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedGeographies.length === GEOGRAPHIES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.geography && (
                  <div className="flex flex-wrap gap-2">
                    {GEOGRAPHIES.map(geo => (
                      <button key={geo} onClick={() => toggleFilter(selectedGeographies, setSelectedGeographies, geo)}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all border ${selectedGeographies.includes(geo) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {geo}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── DB: Engine ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('engine')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.engine ? '' : '-rotate-90'}`} />
                        DATABASE ENGINE <span title="The database engine: PostgreSQL, MySQL, SQL Server, Oracle DB, etc." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedEngines.length === DB_ENGINES.length ? setSelectedEngines([]) : setSelectedEngines([...DB_ENGINES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedEngines.length === DB_ENGINES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedEngines.length === DB_ENGINES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.engine && (
                  <div className="flex flex-wrap gap-2">
                    {DB_ENGINES.map(eng => (
                      <button key={eng} onClick={() => toggleFilter(selectedEngines, setSelectedEngines, eng)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedEngines.includes(eng) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {eng}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── DB: Deployment Type ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('deploymentType')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.deploymentType ? '' : '-rotate-90'}`} />
                        Deployment <span title="Provisioned: fixed instance size billed hourly. Serverless: auto-scales, billed per compute unit consumed." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedDeploymentTypes.length === DEPLOYMENT_TYPES.length ? setSelectedDeploymentTypes([]) : setSelectedDeploymentTypes([...DEPLOYMENT_TYPES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedDeploymentTypes.length === DEPLOYMENT_TYPES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedDeploymentTypes.length === DEPLOYMENT_TYPES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.deploymentType && (
                  <div className="flex flex-wrap gap-2">
                    {DEPLOYMENT_TYPES.map(dt => (
                      <button key={dt} onClick={() => toggleFilter(selectedDeploymentTypes, setSelectedDeploymentTypes, dt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedDeploymentTypes.includes(dt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {dt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* ── DB: HA Mode ── */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('haMode')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.haMode ? '' : '-rotate-90'}`} />
                        HIGH-AVAILABILITY <span title="High-availability configuration: Single AZ (no redundancy), Multi AZ (same-region standby), Zone Redundant, or Multi Region (geo-redundant)." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedHaModes.length === HA_MODES.length ? setSelectedHaModes([]) : setSelectedHaModes([...HA_MODES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedHaModes.length === HA_MODES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedHaModes.length === HA_MODES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.haMode && (
                  <div className="flex flex-wrap gap-2">
                    {HA_MODES.map(hm => (
                      <button key={hm} onClick={() => toggleFilter(selectedHaModes, setSelectedHaModes, hm)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedHaModes.includes(hm) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {hm}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
              </>
            )}

            {/* Serverless: Language Filter */}
            {activeProductType === 'serverless' && (
              <>
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('languages')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.languages ? '' : '-rotate-90'}`} />
                        Language Support <span title="Filter by programming language runtime: Python, Node.js, Go, Java, C#, Ruby, JavaScript, PHP, PowerShell, Rust, TypeScript, or container-based deployments." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessLanguages.length === SERVERLESS_LANGUAGES.length ? setSelectedServerlessLanguages([]) : setSelectedServerlessLanguages([...SERVERLESS_LANGUAGES]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessLanguages.length === SERVERLESS_LANGUAGES.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessLanguages.length === SERVERLESS_LANGUAGES.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.languages && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_LANGUAGES.map(lang => (
                      <button key={lang} onClick={() => toggleFilter(selectedServerlessLanguages, setSelectedServerlessLanguages, lang)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessLanguages.includes(lang) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {lang}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* Serverless: Cold Start Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('coldStart')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.coldStart ? '' : '-rotate-90'}`} />
                        Cold Start (MS) <span title="Filter by cold start latency: Fast (< 100ms), Medium (100-200ms), or Slow (> 200ms)." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessColdStart.length === SERVERLESS_COLD_START_OPTIONS.length ? setSelectedServerlessColdStart([]) : setSelectedServerlessColdStart([...SERVERLESS_COLD_START_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessColdStart.length === SERVERLESS_COLD_START_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessColdStart.length === SERVERLESS_COLD_START_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.coldStart && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_COLD_START_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessColdStart, setSelectedServerlessColdStart, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessColdStart.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* Serverless: Timeout Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('timeout')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.timeout ? '' : '-rotate-90'}`} />
                        Timeout (Min) <span title="Filter by execution timeout: Short (5), Medium (10), or Long (15+)." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessTimeout.length === SERVERLESS_TIMEOUT_OPTIONS.length ? setSelectedServerlessTimeout([]) : setSelectedServerlessTimeout([...SERVERLESS_TIMEOUT_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessTimeout.length === SERVERLESS_TIMEOUT_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessTimeout.length === SERVERLESS_TIMEOUT_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.timeout && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_TIMEOUT_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessTimeout, setSelectedServerlessTimeout, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessTimeout.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* Serverless: Memory Configuration Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('memoryConfig')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.memoryConfig ? '' : '-rotate-90'}`} />
                        Memory Config <span title="Filter by memory configuration: Configurable, Tiers, or Automatic." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessMemoryConfig.length === SERVERLESS_MEMORY_CONFIG_OPTIONS.length ? setSelectedServerlessMemoryConfig([]) : setSelectedServerlessMemoryConfig([...SERVERLESS_MEMORY_CONFIG_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessMemoryConfig.length === SERVERLESS_MEMORY_CONFIG_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessMemoryConfig.length === SERVERLESS_MEMORY_CONFIG_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.memoryConfig && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_MEMORY_CONFIG_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessMemoryConfig, setSelectedServerlessMemoryConfig, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessMemoryConfig.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

                {/* Serverless: Free Tier Filter */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0">
                      <button onClick={() => toggleSection('freeTier')} className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                        <ChevronDown size={10} className={`transition-transform ${expanded.freeTier ? '' : '-rotate-90'}`} />
                        Free Tier <span title="Filter by free tier availability: Included or Not included." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                      </button>
                    </h2>
                    <button onClick={() => { selectedServerlessFreeTier.length === SERVERLESS_FREE_TIER_OPTIONS.length ? setSelectedServerlessFreeTier([]) : setSelectedServerlessFreeTier([...SERVERLESS_FREE_TIER_OPTIONS]); }} className={`text-[10px] font-bold uppercase transition-colors ${selectedServerlessFreeTier.length === SERVERLESS_FREE_TIER_OPTIONS.length ? 'text-black dark:text-white' : 'text-[#737373] hover:text-black dark:hover:text-white'}`}>
                      {selectedServerlessFreeTier.length === SERVERLESS_FREE_TIER_OPTIONS.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {expanded.freeTier && (
                  <div className="flex flex-wrap gap-2">
                    {SERVERLESS_FREE_TIER_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => toggleFilter(selectedServerlessFreeTier, setSelectedServerlessFreeTier, opt)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all border ${selectedServerlessFreeTier.includes(opt) ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  )}
                </section>

                <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />
              </>
            )}

            {/* Range Sliders Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="m-0">
                  <button
                    onClick={() => toggleSection('specs')}
                    className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ChevronDown size={10} className={`transition-transform ${expanded.specs ? '' : '-rotate-90'}`} />
                    Specs & Price <span title="Filter by vCPU count, memory size (GB), and hourly price ($). Prices are on-demand (PAYG) USD." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                  </button>
                </h2>
                <button
                  onClick={() => {
                    setVCpuRange({ ...DEFAULT_VCPU_RANGE });
                    setMemoryRange({ ...DEFAULT_MEMORY_RANGE });
                    setPriceRange({ ...DEFAULT_PRICE_RANGE });
                  }}
                  className={`text-[10px] font-bold uppercase transition-colors ${
                    vCpuRange.min !== DEFAULT_VCPU_RANGE.min || vCpuRange.max !== DEFAULT_VCPU_RANGE.max ||
                    memoryRange.min !== DEFAULT_MEMORY_RANGE.min || memoryRange.max !== DEFAULT_MEMORY_RANGE.max ||
                    priceRange.min !== DEFAULT_PRICE_RANGE.min || priceRange.max !== DEFAULT_PRICE_RANGE.max
                      ? 'text-black dark:text-white'
                      : 'text-[#737373] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Clear All
                </button>
              </div>
              {expanded.specs && (
              <div className="space-y-8 px-1">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[#737373]">vCPU</div>
                  <RangeSlider
                    min={DEFAULT_VCPU_RANGE.min}
                    max={DEFAULT_VCPU_RANGE.max}
                    value={vCpuRange}
                    onChange={setVCpuRange}
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[#737373]">Memory (GB)</div>
                  <RangeSlider
                    min={DEFAULT_MEMORY_RANGE.min}
                    max={DEFAULT_MEMORY_RANGE.max}
                    value={memoryRange}
                    onChange={setMemoryRange}
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[#737373]">Hourly price ($)</div>
                  <RangeSlider
                    min={DEFAULT_PRICE_RANGE.min}
                    max={DEFAULT_PRICE_RANGE.max}
                    step={0.1}
                    unit="$"
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                </div>
              </div>
              )}
            </section>

            <div className="h-px bg-[#e5e5e5] dark:bg-[#1f1f1f] mx-1" />

            {/* Pricing Mode Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="m-0">
                  <button
                    onClick={() => toggleSection('pricing')}
                    className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ChevronDown size={10} className={`transition-transform ${expanded.pricing ? '' : '-rotate-90'}`} />
                    PAYG OR YEARLY PRICE <span title="PAYG shows the on-demand hourly price. Yearly multiplies the hourly price by 8,760 hours for a rough annual estimate (no committed-use discounts applied)." onClick={(e) => e.stopPropagation()}><Info size={10} className="cursor-help" /></span>
                  </button>
                </h2>
              </div>
              {expanded.pricing && (
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
              )}
            </section>
          </div>
        </aside>


        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col bg-white dark:bg-[#000000]">

          {/* Ad Slot — reserved space for a leaderboard ad (e.g. Google AdSense
              728×90 / 970×90). Drop the ad markup inside the inner div when
              ready. Sized to standard leaderboard height so ad insertion
              doesn't cause layout shift. */}
          <div className="px-4 py-4">
            <div
              data-ad-slot="leaderboard-top"
              className="w-full h-[90px] flex items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a] border border-dashed border-[#e5e5e5] dark:border-[#262626] rounded text-[10px] font-medium uppercase tracking-widest text-[#a3a3a3] dark:text-[#525252]"
            >
              Advertisement
            </div>
          </div>

          {/* Provider Summary Cards */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-px bg-[#e5e5e5] dark:bg-[#262626]">
            {PROVIDERS.filter(p => !p.soon).map(p => {
              const activeNonSoon = PROVIDERS.filter(pr => !pr.soon).map(pr => pr.id);
              const isSelected = selectedProviders.length === activeNonSoon.length || selectedProviders.includes(p.id);

              const filteredCount = providerCounts[p.id];
              const dbProvider = dbStatus?.providers.find(dp => dp.slug === p.id || dp.slug === p.name.toLowerCase());
              const dbCount = dbProvider ? parseInt(dbProvider.count) : 0;
              // Deselected providers contribute 0 to the visible pool. For selected
              // providers, prefer the filter-aware count; fall back to the DB total
              // before the first fetch resolves.
              const displayCount = isSelected ? (filteredCount !== undefined ? filteredCount : dbCount) : 0;

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
                    {/* Provider label uses the same rounded-pill treatment as
                        the Provider column in the table — same colour token,
                        same shape, same uppercase styling — so the cards and
                        the table read as one coherent visual system. */}
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                      style={{ color: p.color, borderColor: p.color + '50', backgroundColor: p.color + '18' }}
                    >
                      {p.name}
                    </span>
                    {p.soon && <span className="text-[7px] font-bold bg-[#737373] text-white px-1 rounded ml-1 border border-white/20">SOON</span>}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-black dark:text-white">{p.soon ? '-' : displayCount.toLocaleString()}</span>
                    {!p.soon && (
                      <span className="text-[10px] text-[#737373] font-medium uppercase tracking-tighter">
                        of {dbCount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Toolbar */}
          <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-[#000000] border-b border-[#e5e5e5] dark:border-[#262626]">
            <div className="flex items-center gap-6">
              <span className="text-xl font-bold text-black dark:text-white shrink-0">
                {totalFilteredCount.toLocaleString()}
                {totalFilteredCount > data.length && data.length > 0 && (
                  <span className="ml-2 text-[10px] font-normal text-[#a3a3a3]">(top {data.length.toLocaleString()} shown)</span>
                )}
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
              <span className="text-[10px] text-[#737373] dark:text-[#525252] font-medium">Click a column header to sort</span>

              <button className="flex items-center gap-2 text-[10px] font-bold text-[#737373] dark:text-[#a3a3a3] border border-[#e5e5e5] dark:border-[#262626] px-3 py-1.5 rounded hover:bg-[#f5f5f5] dark:hover:bg-[#171717] transition-all">
                <Download size={12} /> Export
              </button>
            </div>
          </div>

          {/* Main Pricing Table */}
          {/* minHeight:0 — flex-1 defaults to min-height:auto which lets this
              div grow to fit all rows; the parent's overflow-hidden then clips
              the bottom edge (where the horizontal scrollbar lives). Forcing
              minHeight:0 keeps the div inside the parent's bounds so the h-scroll
              bar stays at the bottom of the viewport, not buried under content.
              overflowX:scroll — always reserve the h-scrollbar track so it's
              visible even before the user discovers there's more to the right.
              scroll-fade-right (conditional) — adds a right-edge fade as a
              fallback hint for browsers that hide the native scrollbar. */}
          <div
            ref={tableScrollRef}
            className={`flex-1 custom-scrollbar ${hasHorizontalOverflow && !scrolledToEnd ? 'scroll-fade-right' : ''}`}
            style={{ minHeight: 0, overflowY: 'auto', overflowX: 'scroll' }}
          >
            {/* Explicit-width block wrapper so overflow-auto reliably detects
                horizontal overflow and shows the scrollbar in all browsers. */}
            <div style={{ width: totalTableWidth }}>
              <table className="border-collapse w-full" style={{ tableLayout: 'fixed' }}>
                <thead className="sticky top-0 bg-white dark:bg-[#000000] z-10 border-b border-[#e5e5e5] dark:border-[#262626]">
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-[#171717] dark:text-[#e5e5e5]">
                    <th data-col="provider" onClick={() => handleHeaderClick('provider')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('provider', e); }} style={{ width: columnWidths['provider'], minWidth: columnWidths['provider'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                      Provider <SortIcon sortKey="provider" />
                      <div onMouseDown={(e) => handleResizeMouseDown('provider', e)} onDoubleClick={(e) => handleResizeDoubleClick('provider', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                    </th>
                    <th data-col="instance_type" onClick={() => handleHeaderClick('instance_type')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('instance_type', e); }} style={{ width: columnWidths['instance_type'], minWidth: columnWidths['instance_type'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                      SKU <SortIcon sortKey="instance_type" />
                      <div onMouseDown={(e) => handleResizeMouseDown('instance_type', e)} onDoubleClick={(e) => handleResizeDoubleClick('instance_type', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                    </th>
                    {activeProductType === 'database' ? (
                      <>
                        <th data-col="engine_category" onClick={() => handleHeaderClick('attributes.engine')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('engine_category', e); }} style={{ width: columnWidths['engine_category'], minWidth: columnWidths['engine_category'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Engine <SortIcon sortKey="attributes.engine" />
                          <div onMouseDown={(e) => handleResizeMouseDown('engine_category', e)} onDoubleClick={(e) => handleResizeDoubleClick('engine_category', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                        <th data-col="db_family_cpu_vendor" onClick={() => handleHeaderClick('attributes.tier')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('db_family_cpu_vendor', e); }} style={{ width: columnWidths['db_family_cpu_vendor'], minWidth: columnWidths['db_family_cpu_vendor'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Tier <SortIcon sortKey="attributes.tier" />
                          <div onMouseDown={(e) => handleResizeMouseDown('db_family_cpu_vendor', e)} onDoubleClick={(e) => handleResizeDoubleClick('db_family_cpu_vendor', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                        <th data-col="deployment_arch" onClick={() => handleHeaderClick('attributes.deployment_type')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('deployment_arch', e); }} style={{ width: columnWidths['deployment_arch'], minWidth: columnWidths['deployment_arch'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Deployment <SortIcon sortKey="attributes.deployment_type" />
                          <div onMouseDown={(e) => handleResizeMouseDown('deployment_arch', e)} onDoubleClick={(e) => handleResizeDoubleClick('deployment_arch', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                        <th data-col="ha_mode_os" onClick={() => handleHeaderClick('attributes.ha_mode')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('ha_mode_os', e); }} style={{ width: columnWidths['ha_mode_os'], minWidth: columnWidths['ha_mode_os'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          HA Mode <SortIcon sortKey="attributes.ha_mode" />
                          <div onMouseDown={(e) => handleResizeMouseDown('ha_mode_os', e)} onDoubleClick={(e) => handleResizeDoubleClick('ha_mode_os', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                      </>
                    ) : activeProductType === 'serverless' ? (
                      <>
                        <th data-col="engine_category" onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('engine_category', e); }} style={{ width: columnWidths['engine_category'], minWidth: columnWidths['engine_category'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Cold Start (ms)
                          <div onMouseDown={(e) => handleResizeMouseDown('engine_category', e)} onDoubleClick={(e) => handleResizeDoubleClick('engine_category', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                        <th data-col="db_family_cpu_vendor" onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('db_family_cpu_vendor', e); }} style={{ width: columnWidths['db_family_cpu_vendor'], minWidth: columnWidths['db_family_cpu_vendor'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Timeout (sec)
                          <div onMouseDown={(e) => handleResizeMouseDown('db_family_cpu_vendor', e)} onDoubleClick={(e) => handleResizeDoubleClick('db_family_cpu_vendor', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                        <th data-col="deployment_arch" onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('deployment_arch', e); }} style={{ width: columnWidths['deployment_arch'], minWidth: columnWidths['deployment_arch'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Memory Config
                          <div onMouseDown={(e) => handleResizeMouseDown('deployment_arch', e)} onDoubleClick={(e) => handleResizeDoubleClick('deployment_arch', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                        <th data-col="ha_mode_os" onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('ha_mode_os', e); }} style={{ width: columnWidths['ha_mode_os'], minWidth: columnWidths['ha_mode_os'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Free Tier
                          <div onMouseDown={(e) => handleResizeMouseDown('ha_mode_os', e)} onDoubleClick={(e) => handleResizeDoubleClick('ha_mode_os', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                      </>
                    ) : (
                      <>
                        <th data-col="engine_category" onClick={() => handleHeaderClick('category')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('engine_category', e); }} style={{ width: columnWidths['engine_category'], minWidth: columnWidths['engine_category'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Category <SortIcon sortKey="category" />
                          <div onMouseDown={(e) => handleResizeMouseDown('engine_category', e)} onDoubleClick={(e) => handleResizeDoubleClick('engine_category', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                        <th data-col="db_family_cpu_vendor" onClick={() => handleHeaderClick('cpu_vendor')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('db_family_cpu_vendor', e); }} style={{ width: columnWidths['db_family_cpu_vendor'], minWidth: columnWidths['db_family_cpu_vendor'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          CPU Vendor <SortIcon sortKey="cpu_vendor" />
                          <div onMouseDown={(e) => handleResizeMouseDown('db_family_cpu_vendor', e)} onDoubleClick={(e) => handleResizeDoubleClick('db_family_cpu_vendor', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                        <th data-col="deployment_arch" onClick={() => handleHeaderClick('arch')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('deployment_arch', e); }} style={{ width: columnWidths['deployment_arch'], minWidth: columnWidths['deployment_arch'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          Arch <SortIcon sortKey="arch" />
                          <div onMouseDown={(e) => handleResizeMouseDown('deployment_arch', e)} onDoubleClick={(e) => handleResizeDoubleClick('deployment_arch', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                        <th data-col="ha_mode_os" onClick={() => handleHeaderClick('os')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('ha_mode_os', e); }} style={{ width: columnWidths['ha_mode_os'], minWidth: columnWidths['ha_mode_os'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          OS <SortIcon sortKey="os" />
                          <div onMouseDown={(e) => handleResizeMouseDown('ha_mode_os', e)} onDoubleClick={(e) => handleResizeDoubleClick('ha_mode_os', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                        <th data-col="gpu" onClick={() => handleHeaderClick('gpu_count')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('gpu', e); }} style={{ width: columnWidths['gpu'], minWidth: columnWidths['gpu'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                          GPU <SortIcon sortKey="gpu_count" />
                          <div onMouseDown={(e) => handleResizeMouseDown('gpu', e)} onDoubleClick={(e) => handleResizeDoubleClick('gpu', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                        </th>
                      </>
                    )}
                    <th data-col="geography" onClick={() => handleHeaderClick('geography')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('geography', e); }} style={{ width: columnWidths['geography'], minWidth: columnWidths['geography'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                      Geo <SortIcon sortKey="geography" />
                      <div onMouseDown={(e) => handleResizeMouseDown('geography', e)} onDoubleClick={(e) => handleResizeDoubleClick('geography', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                    </th>
                    <th data-col="vcpus" onClick={() => handleHeaderClick('vcpus')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('vcpus', e); }} style={{ width: columnWidths['vcpus'], minWidth: columnWidths['vcpus'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                      vCPU <SortIcon sortKey="vcpus" />
                      <div onMouseDown={(e) => handleResizeMouseDown('vcpus', e)} onDoubleClick={(e) => handleResizeDoubleClick('vcpus', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                    </th>
                    <th data-col="memory_gb" onClick={() => handleHeaderClick('memory_gb')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('memory_gb', e); }} style={{ width: columnWidths['memory_gb'], minWidth: columnWidths['memory_gb'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                      Memory (GB) <SortIcon sortKey="memory_gb" />
                      <div onMouseDown={(e) => handleResizeMouseDown('memory_gb', e)} onDoubleClick={(e) => handleResizeDoubleClick('memory_gb', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                    </th>
                    <th data-col="price_per_unit" onClick={() => handleHeaderClick('price_per_unit')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('price_per_unit', e); }} style={{ width: columnWidths['price_per_unit'], minWidth: columnWidths['price_per_unit'] }} className="px-6 py-4 text-center font-bold text-black dark:text-white whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity relative" title="Double-click to auto-fit column width">
                      {showAggregation ? 'Yearly price ($)' : 'Hourly price ($)'} <SortIcon sortKey="price_per_unit" />
                      <div onMouseDown={(e) => handleResizeMouseDown('price_per_unit', e)} onDoubleClick={(e) => handleResizeDoubleClick('price_per_unit', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                    </th>
                    <th data-col="source" onClick={() => handleHeaderClick('data_source')} onDoubleClick={(e) => { e.stopPropagation(); handleResizeDoubleClick('source', e); }} style={{ width: columnWidths['source'], minWidth: columnWidths['source'] }} className="px-6 py-4 text-center font-bold whitespace-nowrap cursor-pointer hover:text-black dark:hover:text-white transition-colors relative" title="Double-click to auto-fit column width">
                      Source <SortIcon sortKey="data_source" />
                      <div onMouseDown={(e) => handleResizeMouseDown('source', e)} onDoubleClick={(e) => handleResizeDoubleClick('source', e)} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize bg-[#e5e5e5] dark:bg-[#262626] hover:bg-[#0069FF] transition-colors z-10" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f5] dark:divide-[#181818]">
                  {loading ? (
                    Array.from({ length: 15 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 12 }).map((_, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-3 bg-[#f5f5f5] dark:bg-[#171717] rounded w-16 mx-auto"></div></td>
                        ))}
                      </tr>
                    ))
                  ) : data.length > 0 ? (
                    data.map((record, index) => (
                      <tr key={index} className={`transition-colors group ${index % 2 === 0 ? 'bg-white dark:bg-[#000000]' : 'bg-[#f7f7f7] dark:bg-[#0a0a0a]'} hover:bg-[#eef2ff] dark:hover:bg-[#111827]`}>
                        {/* Provider — shared */}
                        <td data-col="provider" style={{ width: columnWidths['provider'], minWidth: columnWidths['provider'] }} className="px-6 py-4 whitespace-nowrap text-center">
                          {(() => {
                            const color = PROVIDERS.find(p => (record.provider || '').toLowerCase() === p.id || record.provider === p.name)?.color ?? '#525252';
                            return (
                              <span
                                className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border"
                                style={{ color, borderColor: color + '50', backgroundColor: color + '18' }}
                              >
                                {record.provider}
                              </span>
                            );
                          })()}
                        </td>
                        {/* SKU — shared */}
                        <td data-col="instance_type" style={{ width: columnWidths['instance_type'], minWidth: columnWidths['instance_type'] }} className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-xs font-bold text-black dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">{record.instance_type}</span>
                        </td>
                        {/* Middle 4 columns — differ by product type */}
                        {activeProductType === 'database' ? (
                          <>
                            <td data-col="engine_category" style={{ width: columnWidths['engine_category'], minWidth: columnWidths['engine_category'] }} className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.engine || '—'}</span>
                            </td>
                            <td data-col="db_family_cpu_vendor" style={{ width: columnWidths['db_family_cpu_vendor'], minWidth: columnWidths['db_family_cpu_vendor'] }} className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.tier || '—'}</span>
                            </td>
                            <td data-col="deployment_arch" style={{ width: columnWidths['deployment_arch'], minWidth: columnWidths['deployment_arch'] }} className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest ${
                                record.attributes?.deployment_type === 'Serverless'
                                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                                  : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]'
                              }`}>{record.attributes?.deployment_type || 'Provisioned'}</span>
                            </td>
                            <td data-col="ha_mode_os" style={{ width: columnWidths['ha_mode_os'], minWidth: columnWidths['ha_mode_os'] }} className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.ha_mode || '—'}</span>
                            </td>
                          </>
                        ) : activeProductType === 'serverless' ? (
                          <>
                            <td data-col="engine_category" style={{ width: columnWidths['engine_category'], minWidth: columnWidths['engine_category'] }} className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.cold_start_overhead_ms || '—'}</span>
                            </td>
                            <td data-col="db_family_cpu_vendor" style={{ width: columnWidths['db_family_cpu_vendor'], minWidth: columnWidths['db_family_cpu_vendor'] }} className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.timeout_seconds || '—'}</span>
                            </td>
                            <td data-col="deployment_arch" style={{ width: columnWidths['deployment_arch'], minWidth: columnWidths['deployment_arch'] }} className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.attributes?.memory_configuration || '—'}</span>
                            </td>
                            <td data-col="ha_mode_os" style={{ width: columnWidths['ha_mode_os'], minWidth: columnWidths['ha_mode_os'] }} className="px-6 py-4 whitespace-nowrap text-center">
                              {(() => {
                                const freeInvocations = record.attributes?.free_invocations_per_month;
                                const hasFreeTier = freeInvocations && Number(freeInvocations) > 0;
                                return (
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest ${
                                    hasFreeTier
                                      ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
                                      : 'bg-[#f5f5f5] dark:bg-[#171717] text-[#737373] border-[#e5e5e5] dark:border-[#262626]'
                                  }`}>
                                    {hasFreeTier ? 'Yes' : 'No'}
                                  </span>
                                );
                              })()}
                            </td>
                          </>
                        ) : (
                          <>
                            <td data-col="engine_category" style={{ width: columnWidths['engine_category'], minWidth: columnWidths['engine_category'] }} className="px-6 py-4 text-center whitespace-nowrap">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.category || 'General purpose'}</span>
                            </td>
                            <td data-col="db_family_cpu_vendor" style={{ width: columnWidths['db_family_cpu_vendor'], minWidth: columnWidths['db_family_cpu_vendor'] }} className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373] dark:text-[#a3a3a3]">{record.cpu_vendor}</span>
                            </td>
                            <td data-col="deployment_arch" style={{ width: columnWidths['deployment_arch'], minWidth: columnWidths['deployment_arch'] }} className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">
                                {record.arch === 'x86 64' ? 'x86' : record.arch}
                              </span>
                            </td>
                            <td data-col="ha_mode_os" style={{ width: columnWidths['ha_mode_os'], minWidth: columnWidths['ha_mode_os'] }} className="px-6 py-4 font-bold text-[#737373] text-[10px] uppercase text-center whitespace-nowrap">{record.os}</td>
                            <td data-col="gpu" style={{ width: columnWidths['gpu'], minWidth: columnWidths['gpu'] }} className="px-6 py-4 text-center whitespace-nowrap">
                              {record.gpu_count > 0
                                ? <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-bold border border-blue-500/20 uppercase tracking-widest">GPU</span>
                                : <span className="text-[10px] font-bold text-[#d4d4d4] dark:text-[#404040]">—</span>
                              }
                            </td>
                          </>
                        )}
                        {/* Geography, vCPU, Memory, Price — shared */}
                        <td data-col="geography" style={{ width: columnWidths['geography'], minWidth: columnWidths['geography'] }} className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.geography}</span>
                        </td>
                        <td data-col="vcpus" style={{ width: columnWidths['vcpus'], minWidth: columnWidths['vcpus'] }} className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.vcpus || '—'}</span>
                        </td>
                        <td data-col="memory_gb" style={{ width: columnWidths['memory_gb'], minWidth: columnWidths['memory_gb'] }} className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{record.memory_gb || '—'}</span>
                        </td>
                        <td data-col="price_per_unit" style={{ width: columnWidths['price_per_unit'], minWidth: columnWidths['price_per_unit'] }} className="px-6 py-4 text-center whitespace-nowrap">
                          <span className="text-xs font-bold text-black dark:text-white">
                            {showAggregation
                              ? `$${(parseFloat(record.price_per_unit) * 8760).toFixed(2)}`
                              : `$${parseFloat(record.price_per_unit).toFixed(4)}`}
                          </span>
                        </td>
                        <td data-col="source" style={{ width: columnWidths['source'], minWidth: columnWidths['source'] }} className="px-6 py-4 text-center whitespace-nowrap">
                          {record.data_source === 'static_config' ? (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Static</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-widest bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">API</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="px-6 py-32 text-center text-[#737373] dark:text-[#525252] italic text-sm">
                        <div className="flex flex-col items-center gap-4">
                          <span>No matches for your filters.</span>
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

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#050505] py-5 px-6 shrink-0 z-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <Link to="/" className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">
                  <span className="text-[#0069FF]">compare</span>
                  <span className="text-black dark:text-white">cloud</span>
                  <span className="text-[#00BCFF]">costs</span>
                </span>
              </Link>
              <p className="text-[11px] text-[#737373] dark:text-[#a3a3a3] text-center md:text-left max-w-md mt-1 leading-relaxed">
                Compare Cloud Costs (CCC) is a multi-cloud pricing comparison tool that aggregates pricing for our most popular services including database, compute, storage, containers, and serverless across AWS, Microsoft Azure, Google Cloud, Oracle, and DigitalOcean.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#737373] dark:text-[#a3a3a3]">
              <Link to="/about" className="hover:text-black dark:hover:text-white transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms of Use</Link>
              <a href="mailto:hello@comparecloudcosts.com" className="hover:text-black dark:hover:text-white transition-colors">Contact</a>
              
              <a 
                href="https://www.digitalocean.com/?refcode=23d2b384f3b1&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors bg-[#f5f5f5] dark:bg-[#171717] px-2.5 py-1 rounded border border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]"
              >
                <svg className="w-3.5 h-3.5 fill-[#0080FF]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.04 0C5.408-.02.005 5.37.005 11.992h4.638c0-4.923 4.882-8.731 10.064-6.855a6.95 6.95 0 014.147 4.148c1.889 5.177-1.924 10.055-6.84 10.064v-4.61H7.391v4.623h4.61V24c7.86 0 13.967-7.588 11.397-15.83-1.115-3.59-3.985-6.446-7.575-7.575A12.8 12.8 0 0012.039 0zM7.39 19.362H3.828v3.564H7.39zm-3.563 0v-2.978H.85v2.978z"/>
                </svg>
                DigitalOcean
              </a>

              <a 
                href="https://github.com/rodrigo-orzari/ccc" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors bg-[#f5f5f5] dark:bg-[#171717] px-2.5 py-1 rounded border border-[#e5e5e5] dark:border-[#262626] hover:border-[#a3a3a3] dark:hover:border-[#404040]"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
          
          <div className="border-t border-[#e5e5e5]/50 dark:border-[#262626]/50 pt-4 flex justify-center">
            <p className="text-[10px] text-[#a3a3a3] dark:text-[#525252] text-center">
              © 2026 <a href="https://www.linkedin.com/in/rodrigoorzari/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors underline decoration-dotted">Rodrigo Orzari</a>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Scrollbar — clearly visible track + brighter thumb so users can see
           that more content exists in either direction.

           CRITICAL: do NOT set the standard scrollbar-width or scrollbar-color
           properties on .custom-scrollbar. In Chromium, setting either of those
           routes the element into the modern CSS scrollbar pipeline, which on
           macOS produces an OVERLAY scrollbar that takes 0px of layout space
           and disables every ::-webkit-scrollbar rule below. Verified live on
           Chrome 147 / macOS: removing scrollbar-width:auto restored a 14px
           layout-reserved scrollbar; reintroducing it collapsed it back to 0.

           Firefox (and any other browser without ::-webkit-scrollbar support)
           still gets a styled scrollbar via the @supports block below — we
           only enable the standard properties when webkit pseudo-elements
           are NOT supported, so the two paths never collide. */
        @supports not selector(::-webkit-scrollbar) {
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #737373 #d4d4d4;
          }
          @media (prefers-color-scheme: dark) {
            .custom-scrollbar {
              scrollbar-color: #a3a3a3 #262626;
            }
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 14px !important;
          height: 14px !important;
          -webkit-appearance: none !important;
          background: #d4d4d4 !important;
        }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar { background: #262626 !important; }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #d4d4d4 !important;
          border-top: 1px solid #a3a3a3 !important;
          border-left: 1px solid #a3a3a3 !important;
        }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #262626 !important;
            border-top: 1px solid #404040 !important;
            border-left: 1px solid #404040 !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #737373 !important;
          border-radius: 7px !important;
          border: 2px solid #d4d4d4 !important;
          min-width: 40px !important;
          min-height: 40px !important;
        }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #a3a3a3 !important;
            border: 2px solid #262626 !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #525252 !important; }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4d4d4 !important; }
        }
        .custom-scrollbar::-webkit-scrollbar-corner { background: #d4d4d4 !important; }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-corner { background: #262626 !important; }
        }

        /* Fallback right-edge fade gradient so users know they can scroll right
           even on systems / browsers where the native scrollbar won't render. */
        .scroll-fade-right {
          position: relative;
        }
        .scroll-fade-right::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 100%;
          pointer-events: none;
          background: linear-gradient(to right, rgba(255,255,255,0), rgba(0,0,0,0.12));
          z-index: 5;
        }
        @media (prefers-color-scheme: dark) {
          .scroll-fade-right::after {
            background: linear-gradient(to right, rgba(0,0,0,0), rgba(255,255,255,0.18));
          }
        }

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
