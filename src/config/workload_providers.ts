import { WorkloadDefinition, ProductType } from '@/types';
import { DEFAULT_PRIORITIES } from './workload_priorities';
import { PROVIDER_CATEGORY_SCOPE } from './index';

// The six general-purpose hyperscalers — can plausibly supply every component
// in any workload, so they always get a full-stack column.
export const HYPERSCALER_IDS = ['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'alibaba'] as const;

// Specialized providers (OpenAI, Anthropic, Cloudflare, vector DBs, …) that
// are scoped (PROVIDER_CATEGORY_SCOPE) into at least one product type this
// workload actually uses — e.g. OpenAI/Anthropic for a workload with an 'ai'
// component, Cloudflare for one with 'networking'/'security'/'app-hosting'.
// These get their own column too, but it's honestly PARTIAL: components
// outside the provider's scope show "Not offered" (a structural fact from
// PROVIDER_CATEGORY_SCOPE, not a data gap), same "X of Y tracked" treatment
// the UI already uses for hyperscaler ingestion gaps.
//
// Computed against DEFAULT_PRIORITIES rather than the live priority sliders:
// which PRODUCT TYPES a workload uses is stable (only whether a given
// component is included at all varies with priorities, e.g. security add-ons
// below medium), so columns don't jump around as the user adjusts sliders.
export function specializedProviderIdsForWorkload(workload: WorkloadDefinition): string[] {
  const productTypes = new Set<ProductType>(
    workload.components
      .map(c => c.getRequirements(DEFAULT_PRIORITIES)?.productType)
      .filter((t): t is ProductType => Boolean(t))
  );
  return Object.entries(PROVIDER_CATEGORY_SCOPE)
    .filter(([, scope]) => scope.some(s => productTypes.has(s as ProductType)))
    .map(([id]) => id);
}

// Full provider column list for a workload's comparison table: hyperscalers
// first, then applicable specialized providers.
export function providerIdsForWorkload(workload: WorkloadDefinition): string[] {
  return [...HYPERSCALER_IDS, ...specializedProviderIdsForWorkload(workload)];
}
