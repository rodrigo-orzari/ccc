import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';
// Cache for 10 minutes to balance freshness with performance
export const revalidate = 600; 

export async function GET() {
  try {
    const query = `
      SELECT
        ARRAY_AGG(DISTINCT pr.geography) FILTER (WHERE pr.geography IS NOT NULL AND pr.geography != '' AND pr.geography != 'N/A' AND pr.geography != 'n/a') as geographies,
        ARRAY_AGG(DISTINCT pr.os) FILTER (WHERE pr.os IS NOT NULL AND pr.os != '' AND pr.os != 'N/A' AND pr.os != 'n/a') as os_types,
        ARRAY_AGG(DISTINCT pr.arch) FILTER (WHERE pr.arch IS NOT NULL AND pr.arch != '' AND pr.arch != 'N/A' AND pr.arch != 'n/a') as architectures,
        ARRAY_AGG(DISTINCT pr.cpu_vendor) FILTER (WHERE pr.cpu_vendor IS NOT NULL AND pr.cpu_vendor != '' AND pr.cpu_vendor != 'N/A' AND pr.cpu_vendor != 'n/a') as cpu_vendors,
        ARRAY_AGG(DISTINCT pr.category) FILTER (WHERE pr.category IS NOT NULL AND pr.category != '' AND s.category = 'compute') as categories,
        ARRAY_AGG(DISTINCT pr.category) FILTER (WHERE pr.category IS NOT NULL AND pr.category != '' AND s.category = 'database') as db_families,
        ARRAY_AGG(DISTINCT pr.category) FILTER (WHERE pr.category IS NOT NULL AND pr.category != '' AND s.category = 'networking') as networking_services,
        ARRAY_AGG(DISTINCT pr.category) FILTER (WHERE pr.category IS NOT NULL AND pr.category != '' AND s.category = 'storage') as storage_categories,
        ARRAY_AGG(DISTINCT pr.category) FILTER (WHERE pr.category IS NOT NULL AND pr.category != '' AND s.category = 'integration') as integration_categories,
        ARRAY_AGG(DISTINCT pr.attributes->>'redundancy') FILTER (WHERE pr.attributes->>'redundancy' IS NOT NULL) as storage_redundancies,
        ARRAY_AGG(DISTINCT pr.attributes->>'media') FILTER (WHERE pr.attributes->>'media' IS NOT NULL) as storage_media,
        ARRAY_AGG(DISTINCT pr.attributes->>'tier') FILTER (WHERE pr.attributes->>'tier' IS NOT NULL) as storage_tiers,
        ARRAY_AGG(DISTINCT pr.attributes->>'tier') FILTER (WHERE pr.attributes->>'tier' IS NOT NULL AND s.category = 'app-hosting') as app_hosting_tiers,
        ARRAY_AGG(DISTINCT pr.attributes->>'compute_type') FILTER (WHERE pr.attributes->>'compute_type' IS NOT NULL AND s.category = 'app-hosting') as app_hosting_compute_types,
        ARRAY_AGG(DISTINCT pr.attributes->>'tier') FILTER (WHERE pr.attributes->>'tier' IS NOT NULL AND s.category = 'integration') as integration_tiers,
        ARRAY_AGG(DISTINCT pr.attributes->>'engine') FILTER (WHERE pr.attributes->>'engine' IS NOT NULL) as engines,
        ARRAY_AGG(DISTINCT pr.attributes->>'deployment_type') FILTER (WHERE pr.attributes->>'deployment_type' IS NOT NULL) as deployment_types,
        ARRAY_AGG(DISTINCT pr.attributes->>'ha_mode') FILTER (WHERE pr.attributes->>'ha_mode' IS NOT NULL) as ha_modes,
        ARRAY_AGG(DISTINCT pr.attributes->>'tier') FILTER (WHERE pr.attributes->>'tier' IS NOT NULL) as tiers,
        ARRAY_AGG(DISTINCT pr.attributes->>'modelTier') FILTER (WHERE pr.attributes->>'modelTier' IS NOT NULL) as ai_model_tiers,
        ARRAY_AGG(DISTINCT pr.attributes->>'contextWindowK') FILTER (WHERE pr.attributes->>'contextWindowK' IS NOT NULL) as ai_context_windows,
        ARRAY_AGG(DISTINCT pr.attributes->>'multimodal') FILTER (WHERE pr.attributes->>'multimodal' IS NOT NULL) as ai_multimodal,
        ARRAY_AGG(DISTINCT pr.attributes->>'orchestrator') FILTER (WHERE pr.attributes->>'orchestrator' IS NOT NULL) as orchestrators,
        ARRAY_AGG(DISTINCT pr.attributes->>'compute_type') FILTER (WHERE pr.attributes->>'compute_type' IS NOT NULL) as container_compute_types,
        ARRAY_AGG(DISTINCT pr.attributes->>'architecture') FILTER (WHERE pr.attributes->>'architecture' IS NOT NULL) as container_architectures,
        ARRAY_AGG(DISTINCT pr.attributes->>'billing_granularity') FILTER (WHERE pr.attributes->>'billing_granularity' IS NOT NULL) as billing_granularities,
        ARRAY_AGG(DISTINCT pr.attributes->>'execution_model') FILTER (WHERE pr.attributes->>'execution_model' IS NOT NULL) as execution_models,
        ARRAY_AGG(DISTINCT pr.attributes->>'provisioned_concurrency_support') FILTER (WHERE pr.attributes->>'provisioned_concurrency_support' IS NOT NULL) as provisioned_concurrency,
        ARRAY_AGG(DISTINCT pr.attributes->>'transfer_tier') FILTER (WHERE pr.attributes->>'transfer_tier' IS NOT NULL) as transfer_tiers,
        ARRAY_AGG(DISTINCT pr.attributes->>'destination') FILTER (WHERE pr.attributes->>'destination' IS NOT NULL) as destinations
      FROM pricing_records pr
      LEFT JOIN services s ON s.id = pr.service_id;
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
