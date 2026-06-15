import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';
// Cache for 10 minutes to balance freshness with performance
export const revalidate = 600; 

export async function GET() {
  try {
    const query = `
      SELECT
        ARRAY_AGG(DISTINCT geography) FILTER (WHERE geography IS NOT NULL AND geography != '') as geographies,
        ARRAY_AGG(DISTINCT os) FILTER (WHERE os IS NOT NULL AND os != '') as os_types,
        ARRAY_AGG(DISTINCT arch) FILTER (WHERE arch IS NOT NULL AND arch != '') as architectures,
        ARRAY_AGG(DISTINCT cpu_vendor) FILTER (WHERE cpu_vendor IS NOT NULL AND cpu_vendor != '') as cpu_vendors,
        ARRAY_AGG(DISTINCT category) FILTER (WHERE category IS NOT NULL AND category != '') as categories,
        ARRAY_AGG(DISTINCT attributes->>'engine') FILTER (WHERE attributes->>'engine' IS NOT NULL) as engines,
        ARRAY_AGG(DISTINCT attributes->>'deployment_type') FILTER (WHERE attributes->>'deployment_type' IS NOT NULL) as deployment_types,
        ARRAY_AGG(DISTINCT attributes->>'ha_mode') FILTER (WHERE attributes->>'ha_mode' IS NOT NULL) as ha_modes,
        ARRAY_AGG(DISTINCT attributes->>'tier') FILTER (WHERE attributes->>'tier' IS NOT NULL) as tiers,
        ARRAY_AGG(DISTINCT attributes->>'modelTier') FILTER (WHERE attributes->>'modelTier' IS NOT NULL) as ai_model_tiers,
        ARRAY_AGG(DISTINCT attributes->>'contextWindowK') FILTER (WHERE attributes->>'contextWindowK' IS NOT NULL) as ai_context_windows,
        ARRAY_AGG(DISTINCT attributes->>'multimodal') FILTER (WHERE attributes->>'multimodal' IS NOT NULL) as ai_multimodal,
        ARRAY_AGG(DISTINCT attributes->>'orchestrator') FILTER (WHERE attributes->>'orchestrator' IS NOT NULL) as orchestrators,
        ARRAY_AGG(DISTINCT attributes->>'compute_type') FILTER (WHERE attributes->>'compute_type' IS NOT NULL) as container_compute_types,
        ARRAY_AGG(DISTINCT attributes->>'architecture') FILTER (WHERE attributes->>'architecture' IS NOT NULL) as container_architectures,
        ARRAY_AGG(DISTINCT attributes->>'billing_granularity') FILTER (WHERE attributes->>'billing_granularity' IS NOT NULL) as billing_granularities,
        ARRAY_AGG(DISTINCT attributes->>'execution_model') FILTER (WHERE attributes->>'execution_model' IS NOT NULL) as execution_models,
        ARRAY_AGG(DISTINCT attributes->>'provisioned_concurrency_support') FILTER (WHERE attributes->>'provisioned_concurrency_support' IS NOT NULL) as provisioned_concurrency,
        ARRAY_AGG(DISTINCT attributes->>'transfer_tier') FILTER (WHERE attributes->>'transfer_tier' IS NOT NULL) as transfer_tiers,
        ARRAY_AGG(DISTINCT attributes->>'destination') FILTER (WHERE attributes->>'destination' IS NOT NULL) as destinations
      FROM pricing_records;
    `;
    
    // Serverless supportedLanguages is an array, we unnest and aggregate separately
    // NOTE: some DBs might not have jsonb array for supportedLanguages if it was missing
    const langQuery = `
      SELECT ARRAY_AGG(DISTINCT lang) as serverless_languages
      FROM pricing_records, jsonb_array_elements_text(CASE WHEN jsonb_typeof(attributes->'supportedLanguages') = 'array' THEN attributes->'supportedLanguages' ELSE '[]'::jsonb END) as lang
      WHERE attributes->'supportedLanguages' IS NOT NULL
    `;

    const [mainResult] = await sql.unsafe(query);
    const [langResult] = await sql.unsafe(langQuery);

    const mergedResult = {
      ...mainResult,
      serverless_languages: langResult?.serverless_languages || []
    };

    return NextResponse.json(mergedResult);
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch dynamic filters', details: err.message }, { status: 500 });
  }
}
