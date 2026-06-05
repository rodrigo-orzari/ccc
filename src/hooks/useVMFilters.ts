import { useState } from 'react';

const CATEGORIES = ['General purpose', 'Compute optimized', 'Memory optimized', 'Storage optimized', 'Burstable', 'HPC'];
const OS_TYPES = ['Linux', 'Windows'];
const CPU_PROFILES = [
  { id: 'intel-x86', label: 'Intel (x86)', vendor: 'Intel', arch: 'x86 64' },
  { id: 'amd-x86', label: 'AMD (x86)', vendor: 'AMD', arch: 'x86 64' },
  { id: 'aws-arm', label: 'AWS Graviton (ARM)', vendor: 'AWS', arch: 'ARM' },
  { id: 'ampere-arm', label: 'Ampere (ARM)', vendor: 'Ampere', arch: 'ARM' },
];

/**
 * VM/Compute-specific filter state
 */
export function useVMFilters() {
  const [selectedCategory, setSelectedCategory] = useState<string[]>([...CATEGORIES]);
  const [selectedOS, setSelectedOS] = useState<string[]>([...OS_TYPES]);
  const [selectedCpu, setSelectedCpu] = useState<string[]>(CPU_PROFILES.map(p => p.id));
  const [gpuIncluded, setGpuIncluded] = useState(true);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedOS,
    setSelectedOS,
    selectedCpu,
    setSelectedCpu,
    gpuIncluded,
    setGpuIncluded,
  };
}
