import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from './db.ts';
import path from 'path';
import fs from 'fs';
import { DB_FAMILY_MAPPINGS } from '../config/index';

// ✅ Admin Authentication Logic
export function requireAdminAuth(req: NextRequest): NextResponse | null {
  const adminToken = req.headers.get('x-admin-token');
  const expectedToken = process.env.ADMIN_API_KEY;

  if (!adminToken || !expectedToken) {
    return NextResponse.json({ error: 'Unauthorized: Missing X-Admin-Token header' }, { status: 401 });
  }

  try {
    const a = Buffer.from(adminToken);
    const b = Buffer.from(expectedToken);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ error: 'Forbidden: Invalid admin token' }, { status: 403 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Forbidden: Invalid admin token format' }, { status: 403 });
  }

  return null; // OK
}

// ✅ Database Initialization
export const initDb = async () => {
  try {
    const schemaPath = path.join(process.cwd(), 'src/db/schema.sql');
    if (!fs.existsSync(schemaPath)) return false;
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await sql.unsafe(schema);

    // Safety: Add columns if they don't exist
    await sql.unsafe(`
      ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS cpu_vendor VARCHAR(50);
      ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS gpu_count INTEGER DEFAULT 0;
      ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS category VARCHAR(50);
      ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS attributes JSONB;
      ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS data_source VARCHAR(20) DEFAULT 'live_api';
      ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS previous_price_per_unit NUMERIC(15, 6);

      -- See schema.sql for why engine/ha_mode (from attributes JSONB) are part of this key.
      CREATE UNIQUE INDEX IF NOT EXISTS pricing_records_unique_key
      ON pricing_records (
          service_id, region_id, instance_type, os, arch,
          (COALESCE(attributes->>'engine', '')),
          (COALESCE(attributes->>'ha_mode', ''))
      );
    `);

    await sql.unsafe(`
      UPDATE services SET category = 'compute'
      WHERE name IN ('EC2', 'Virtual Machines', 'Compute Engine', 'OCI Compute', 'Droplets')
        AND (category IS NULL OR category = 'Compute');
    `);

    await sql.unsafe(`
      UPDATE providers SET name = 'AWS' WHERE slug = 'aws';
      UPDATE providers SET name = 'Azure' WHERE slug = 'azure';
      UPDATE providers SET name = 'Google' WHERE slug = 'gcp';
      UPDATE providers SET name = 'Oracle' WHERE slug = 'oracle';

      UPDATE pricing_records SET arch = 'x86 64' WHERE arch = 'x86_64' OR arch = 'x86';
      UPDATE pricing_records SET arch = 'ARM' WHERE arch = 'ARM64';

      UPDATE pricing_records SET cpu_vendor = 'AWS' WHERE instance_type ILIKE '%graviton%' OR instance_type ~* '[a-z][0-9]g\\\\..*';
      UPDATE pricing_records SET cpu_vendor = 'Ampere' WHERE instance_type ILIKE '%ampere%' OR instance_type ILIKE '%altra%' OR instance_type ILIKE 't2a%';
      UPDATE pricing_records SET cpu_vendor = 'AMD' WHERE instance_type ILIKE '%epyc%' OR instance_type ILIKE '%amd%' OR instance_type ILIKE 't2d%' OR instance_type ~* '[a-z][0-9]a\\\\..*';

      UPDATE pricing_records SET gpu_count = 1 WHERE category = 'GPU' AND (gpu_count IS NULL OR gpu_count = 0);

      UPDATE pricing_records SET category =
        CASE
          WHEN (CAST(memory_gb AS FLOAT) / NULLIF(vcpus, 0)) <= 2.1 THEN 'Compute optimized'
          WHEN (CAST(memory_gb AS FLOAT) / NULLIF(vcpus, 0)) >= 7.5 THEN 'Memory optimized'
          ELSE 'General purpose'
        END
      WHERE category = 'GPU';

      -- Fix database categories
      UPDATE pricing_records SET category = 'In-memory' WHERE category = 'Relational' AND attributes->>'engine' IN ('Redis', 'Memcached', 'Valkey');
      UPDATE pricing_records SET category = 'NoSQL' WHERE category = 'Relational' AND attributes->>'engine' IN ('MongoDB', 'Cassandra', 'DynamoDB', 'Cosmos DB');

      -- Fix streaming categories
      UPDATE pricing_records SET category = 'Streaming' WHERE service_id IN (SELECT id FROM services WHERE category='data_warehouse') AND (instance_type ILIKE '%Kafka%' OR instance_type ILIKE '%Kinesis%' OR instance_type ILIKE '%Event%' OR instance_type ILIKE '%Pub/Sub%' OR instance_type ILIKE '%Streaming%');

      -- Tag remaining data_warehouse rows (Redshift, BigQuery, Synapse, Snowflake, MaxCompute, etc.)
      -- as 'Warehouse' so the Data Warehouse workload component doesn't accidentally match Streaming rows.
      UPDATE pricing_records SET category = 'Warehouse' WHERE service_id IN (SELECT id FROM services WHERE category='data_warehouse') AND category != 'Streaming';
    `);

    console.log('✅ Database schema initialized successfully.');
    return true;
  } catch (err) {
    console.error('❌ Failed to initialize database schema:', err);
    return false;
  }
};

const MAX_FILTER_ITEMS = 50;
const MAX_SEARCH_LENGTH = 200;
const VALID_PRODUCT_TYPES = ['compute', 'gpu', 'database', 'serverless', 'networking', 'containers', 'data-analytics', 'ai', 'storage', 'app-hosting', 'security', 'integration'];

function parseFilterList(input: string | undefined, maxItems = MAX_FILTER_ITEMS): string[] {
  if (!input) return [];

  const items = input
    .split(',')
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);

  if (items.length > maxItems) {
    throw new Error(`Filter list exceeds maximum of ${maxItems} items (got ${items.length})`);
  }

  for (const item of items) {
    if (item.length > 100 || /[;'"\\\\]/.test(item)) {
      throw new Error(`Invalid filter value: "${item}"`);
    }
  }

  return items;
}

export function buildPricingFilters(query: any) {
  try {
    const {
      provider, geography, os, arch, cpuVendor, gpu, gpuModel, category, pricing_model,
      minVcpu, maxVcpu, minMemory, maxMemory, minPrice, maxPrice, minGpuCount, maxGpuCount, search,
      product,
      dbFamilies, engines, deploymentTypes, haModes,
      serverlessLanguages, serverlessColdStart, serverlessTimeout, serverlessMemoryConfig, serverlessFreeTier,
      serverlessGranularity, serverlessExecutionModel, serverlessProvisionedConcurrency, serverlessEphemeralStorage,
      serverlessMemory, serverlessArchitecture,
      containersOrchestrators, containersComputeTypes, containersArchitectures, containersBillingGranularity,
      analyticsEngines, analyticsDeploymentTypes, analyticsTiers,
      aiServiceTypes, aiModelTiers, aiContextWindows, aiMultimodalOptions,
      networkingService, networkingConnectionTypes, networkingRoutingTypes, networkingHaSupport, networkingVpcSupport, networkingTransferDirections,
      networkingBillingModels, networkingUsageTiers, networkingPortCapacities, networkingTransferScopes,
      storageTypes, storageTiers, storageRedundancy, storageMedia,
      securityService,
      appHostingTiers, appHostingComputeTypes,
      serverlessServiceTypes,
      integrationServices, integrationTiers,
      integrationSizes, integrationProtocols, integrationPricingModels,
    } = query;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Helper for the very common "LOWER(<expr>) = ANY($n)" filter shape: parse a
    // comma-separated list (via the same validation as everything else), optionally
    // lowercase it, and register exactly one positional param. `extra` appends fixed
    // values that should always match (e.g. 'n/a','none' for un-normalized rows).
    // Absent/empty input adds nothing and consumes no param — identical to the old
    // hand-written blocks, so param numbering is preserved.
    const addInFilter = (
      raw: string | undefined,
      expr: string,
      opts: { lower?: boolean; extra?: string[] } = {}
    ) => {
      const { lower = true, extra = [] } = opts;
      const parsed = parseFilterList(raw as string);
      const items = lower ? parsed.map((s: string) => s.toLowerCase()) : parsed;
      if (items.length > 0) {
        conditions.push(`${expr} = ANY($${paramCount++})`);
        values.push([...items, ...extra]);
      }
    };

    const resolvedProductType =
      product && VALID_PRODUCT_TYPES.includes(product as string)
        ? (product as string)
        : 'compute';
        
    // GPU Compute is its own product-type LENS, not its own services.category —
    // GPU instances are ingested as part of each provider's regular VM/compute
    // service (same EC2/Droplets/etc. rows as everything else), distinguished
    // only by gpu_count. So 'gpu' resolves to the same underlying service
    // category with gpu_count > 0, and 'compute' (VM) explicitly excludes
    // those rows so a GPU instance isn't shown — and priced — twice.
    conditions.push(`s.category = $${paramCount++}`);
    values.push(resolvedProductType === 'data-analytics' ? 'data_warehouse' : resolvedProductType === 'gpu' ? 'compute' : resolvedProductType);
    if (resolvedProductType === 'gpu') {
      conditions.push(`pr.gpu_count > 0`);
    } else if (resolvedProductType === 'compute') {
      conditions.push(`pr.gpu_count = 0`);
    }

    const providers = parseFilterList(provider as string);
    if (providers.length > 0) {
      conditions.push(`s.provider_id IN (SELECT id FROM providers WHERE slug = ANY($${paramCount++}))`);
      values.push(providers);
    }

    const geographies = parseFilterList(geography as string).map((s: string) => s.toLowerCase());
    if (geographies.length > 0) {
      // Always include 'global' as many services (like data transfer) are global
      geographies.push('global');
      
      // Fuzzy mappings for un-normalized regions often found in networking/serverless data
      if (geographies.includes('n. america')) {
        geographies.push('us east', 'us west', 'us central', 'us south', 'us-east', 'us-west', 'canada', 'north america', 'us');
      }
      if (geographies.includes('w. europe') || geographies.includes('n. europe')) {
        geographies.push('europe', 'eu-west', 'eu-central', 'eu-north', 'uk', 'ireland', 'frankfurt', 'london', 'paris', 'eu');
      }
      if (geographies.includes('asia pacific')) {
        geographies.push('asia', 'apac', 'tokyo', 'singapore', 'sydney', 'mumbai', 'seoul', 'osaka', 'hong kong');
      }
      if (geographies.includes('s. america')) {
        geographies.push('south america', 'sa-east', 'sao paulo');
      }

      conditions.push(`LOWER(pr.geography) = ANY($${paramCount++})`);
      values.push(geographies);
    }

    // Shared shape filters (OS/arch/CPU vendor) apply to both VM and GPU —
    // GPU rows are still real VM/Droplet/etc. instances underneath, just with
    // gpu_count > 0, so they carry the same os/arch/cpu_vendor columns.
    if (resolvedProductType === 'compute' || resolvedProductType === 'gpu') {
      addInFilter(os, 'LOWER(pr.os)');

      // arch has a special x86 -> 'x86 64' normalization, so it stays hand-written.
      const archFilters = parseFilterList(arch as string).map((a: string) =>
        (a === 'x86' ? 'x86 64' : a).toLowerCase()
      );
      if (archFilters.length > 0) {
        conditions.push(`LOWER(pr.arch) = ANY($${paramCount++})`);
        values.push(archFilters);
      }

      addInFilter(cpuVendor, 'LOWER(pr.cpu_vendor)');

      const pricingModels = parseFilterList(pricing_model as string).map((s: string) => s.toLowerCase());
      if (pricingModels.length > 0) {
        const wantsOnDemand = pricingModels.includes('on-demand');
        const wantsSpot = pricingModels.includes('spot / preemptible');

        if (wantsSpot && !wantsOnDemand) {
          conditions.push(`pr.attributes->>'purchaseOption' = 'Spot'`);
        } else if (wantsOnDemand && !wantsSpot) {
          conditions.push(`(pr.attributes->>'purchaseOption' IS NULL OR pr.attributes->>'purchaseOption' != 'Spot')`);
        }
        // If both or neither, no filter
      }
    }

    // VM-only: the compute-optimized/memory-optimized/etc. category chip.
    // GPU rows carry a category value too (inherited from the same
    // classifier), but it's not a meaningful facet for GPU shopping — GPU
    // Model (below) is the equivalent lens there.
    if (resolvedProductType === 'compute') {
      addInFilter(category, 'LOWER(pr.category)');
    }

    // GPU-only: filter by chip model (H100, A100 80GB, L4, …), read from the
    // attributes.gpu_model tag set at ingestion time (src/config/gpu_models.ts).
    if (resolvedProductType === 'gpu') {
      addInFilter(gpuModel, "LOWER(pr.attributes->>'gpu_model')");
    }

    // Database & Analytics product type filters
    if (resolvedProductType === 'database' || resolvedProductType === 'data-analytics') {
      // Use analyticsEngines exclusively for data-analytics (engines param carries DB engines like
      // PostgreSQL/MySQL which would produce zero results against analytics records like Databricks/Snowflake).
      const rawEngineParam = resolvedProductType === 'data-analytics' ? analyticsEngines : engines;
      const engineFiltersRaw = parseFilterList(rawEngineParam as string).map((s: string) => s.toLowerCase());
      if (engineFiltersRaw.length > 0) {
        let engineFilters = new Set(engineFiltersRaw);
        if (engineFilters.has('native')) {
          engineFilters.delete('native');
          // AWS
          engineFilters.add('redshift');
          // GCP
          engineFilters.add('bigquery');
          // Azure
          engineFilters.add('synapse');
          // Alibaba
          engineFilters.add('maxcompute');
          engineFilters.add('e-mapreduce');
          engineFilters.add('hologres');
          engineFilters.add('analyticdb for mysql');
          // Oracle
          engineFilters.add('oracle analytics cloud');
          engineFilters.add('oracle autonomous data warehouse');
          // DigitalOcean
          engineFilters.add('opensearch');
          engineFilters.add('kafka');
        }
        conditions.push(`LOWER(pr.attributes->>'engine') = ANY($${paramCount++})`);
        values.push(Array.from(engineFilters));
      }

      // Use the product-specific param. Collapsing with `||` let the database
      // `deploymentTypes` param mask the analytics one (same bug class that
      // previously broke analytics engines), making the analytics deployment
      // filter a no-op.
      const rawDeploymentParam = resolvedProductType === 'data-analytics' ? analyticsDeploymentTypes : deploymentTypes;
      addInFilter(rawDeploymentParam, `LOWER(pr.attributes->>'deployment_type')`);

      // Database family filtering (Relational vs NoSQL) - only for 'database' type
      if (resolvedProductType === 'database') {
        const dbFamilyFilters = parseFilterList(dbFamilies as string);
        if (dbFamilyFilters.length > 0) {
          const familyConditions: string[] = [];

          for (const family of dbFamilyFilters) {
            // Find engines for this family (case-insensitive match)
            const mappedFamily = Object.keys(DB_FAMILY_MAPPINGS).find(
              k => k.toLowerCase() === family.toLowerCase()
            );
            
            if (mappedFamily && DB_FAMILY_MAPPINGS[mappedFamily].length > 0) {
              familyConditions.push(`LOWER(pr.attributes->>'engine') = ANY($${paramCount})`);
              values.push(DB_FAMILY_MAPPINGS[mappedFamily].map(e => e.toLowerCase()));
              paramCount++;
            }
          }

          if (familyConditions.length > 0) {
            conditions.push(`(${familyConditions.join(' OR ')})`);
          }
        }

        addInFilter(haModes, `LOWER(pr.attributes->>'ha_mode')`);
      }

      // Analytics tier filtering - only for 'data-analytics' type
      if (resolvedProductType === 'data-analytics') {
        addInFilter(analyticsTiers, `LOWER(pr.attributes->>'tier')`);
      }
    }

    // AI product type filters
    if (resolvedProductType === 'ai') {
      addInFilter(aiServiceTypes, 'LOWER(s.name)');
      addInFilter(aiModelTiers, `LOWER(pr.attributes->>'modelTier')`);
      addInFilter(aiMultimodalOptions, `LOWER(pr.attributes->>'multimodal')`);

      if (aiContextWindows) {
        const windowOptions = parseFilterList(aiContextWindows as string);
        const windowConditions: string[] = [];

        for (const opt of windowOptions) {
          if (opt === '< 32K') {
            windowConditions.push(`(pr.attributes->>'contextWindowK')::int < 32`);
          } else if (opt === '32K - 128K') {
            windowConditions.push(`(pr.attributes->>'contextWindowK')::int BETWEEN 32 AND 128`);
          } else if (opt === '> 128K') {
            windowConditions.push(`(pr.attributes->>'contextWindowK')::int > 128`);
          } else if (opt === '1M+') {
            windowConditions.push(`(pr.attributes->>'contextWindowK')::int >= 1000`);
          }
        }

        if (windowConditions.length > 0) {
          conditions.push(`(${windowConditions.join(' OR ')})`);
        }
      }
    }

    // Serverless product type filters
    if (resolvedProductType === 'serverless') {
      addInFilter(serverlessServiceTypes, `LOWER(pr.attributes->>'service_type')`);

      const languages = parseFilterList(serverlessLanguages as string);
      if (languages.length > 0) {
        conditions.push(`pr.attributes->'supportedLanguages' ?| $${paramCount++}`);
        values.push(languages);
      }

      if (serverlessColdStart) {
        const coldStartOptions = parseFilterList(serverlessColdStart as string);
        const coldStartConditions: string[] = [];

        for (const opt of coldStartOptions) {
          if (opt.includes('<100')) {
            coldStartConditions.push(`(pr.attributes->>'cold_start_overhead_ms')::int < 100`);
          } else if (opt.includes('100-200')) {
            coldStartConditions.push(`(pr.attributes->>'cold_start_overhead_ms')::int BETWEEN 100 AND 200`);
          } else if (opt.includes('>200')) {
            coldStartConditions.push(`(pr.attributes->>'cold_start_overhead_ms')::int > 200`);
          }
        }

        if (coldStartConditions.length > 0) {
          conditions.push(`(${coldStartConditions.join(' OR ')})`);
        }
      }

      // Memory-size buckets → memory_gb ranges (the spec sliders are disabled for
      // serverless because the dataset tops out at ~10 GB).
      if (serverlessMemory) {
        const memoryOptions = parseFilterList(serverlessMemory as string);
        const memoryConditions: string[] = [];
        for (const opt of memoryOptions) {
          if (opt === '<= 512 MB') {
            memoryConditions.push(`pr.memory_gb <= 0.512`);
          } else if (opt === '512 MB - 2 GB') {
            memoryConditions.push(`(pr.memory_gb > 0.512 AND pr.memory_gb <= 2)`);
          } else if (opt === '2 - 4 GB') {
            memoryConditions.push(`(pr.memory_gb > 2 AND pr.memory_gb <= 4)`);
          } else if (opt === '> 4 GB') {
            memoryConditions.push(`pr.memory_gb > 4`);
          }
        }
        if (memoryConditions.length > 0) {
          conditions.push(`(${memoryConditions.join(' OR ')})`);
        }
      }

      // Architecture x86 / ARM → pr.arch ('x86 64' is stored with a space).
      const archOptions = parseFilterList(serverlessArchitecture as string).map((a: string) =>
        (a === 'x86' ? 'x86 64' : a).toLowerCase()
      );
      if (archOptions.length > 0) {
        conditions.push(`LOWER(pr.arch) = ANY($${paramCount++})`);
        values.push(archOptions);
      }
    }

    if (search) {
      const searchStr = search as string;
      if (searchStr.length > MAX_SEARCH_LENGTH) {
        throw new Error(`Search string exceeds ${MAX_SEARCH_LENGTH} characters`);
      }
      // Search across multiple fields: instance type, provider, region, service, category, and attributes
      const searchPattern = `%${searchStr}%`;
      const p1 = paramCount++;
      const p2 = paramCount++;
      const p3 = paramCount++;
      const p4 = paramCount++;
      const p5 = paramCount++;
      const p6 = paramCount++;

      conditions.push(`(
        pr.instance_type ILIKE $${p1} OR
        p.name ILIKE $${p2} OR
        r.slug ILIKE $${p3} OR
        s.name ILIKE $${p4} OR
        pr.category ILIKE $${p5} OR
        pr.attributes::text ILIKE $${p6}
      )`);

      values.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (serverlessTimeout && resolvedProductType === 'serverless') {
      const timeoutOptions = (serverlessTimeout as string).split(',');
      const timeoutConditions: string[] = [];

      for (const opt of timeoutOptions) {
        if (opt.includes('Short')) {
          timeoutConditions.push(`(pr.attributes->>'timeout_seconds')::int = 300`);
        } else if (opt.includes('Medium')) {
          timeoutConditions.push(`(pr.attributes->>'timeout_seconds')::int = 600`);
        } else if (opt.includes('Long')) {
          timeoutConditions.push(`(pr.attributes->>'timeout_seconds')::int >= 900`);
        }
      }

      if (timeoutConditions.length > 0) {
        conditions.push(`(${timeoutConditions.join(' OR ')})`);
      }
    }

    if (serverlessMemoryConfig && resolvedProductType === 'serverless') {
      const memoryOptions = (serverlessMemoryConfig as string).split(',');
      const memoryConditions: string[] = [];

      for (const opt of memoryOptions) {
        if (opt.includes('Configurable')) {
          memoryConditions.push(`pr.attributes->>'memory_configuration' = 'user-configurable'`);
        } else if (opt.includes('Tiers')) {
          memoryConditions.push(`pr.attributes->>'memory_configuration' = 'fixed-tiers'`);
        } else if (opt.includes('Automatic')) {
          memoryConditions.push(`pr.attributes->>'memory_configuration' = 'automatic'`);
        }
      }

      if (memoryConditions.length > 0) {
        conditions.push(`(${memoryConditions.join(' OR ')})`);
      }
    }

    if (serverlessFreeTier && resolvedProductType === 'serverless') {
      const freeTierOptions = (serverlessFreeTier as string).split(',');
      const freeTierConditions: string[] = [];

      for (const opt of freeTierOptions) {
        if (opt === 'Included' || opt === 'Yes') {
          freeTierConditions.push(`(pr.attributes->>'free_invocations_per_month' IS NOT NULL AND (pr.attributes->>'free_invocations_per_month')::bigint > 0)`);
        } else if (opt === 'Not included' || opt === 'No') {
          freeTierConditions.push(`(pr.attributes->>'free_invocations_per_month' IS NULL OR (pr.attributes->>'free_invocations_per_month')::bigint = 0)`);
        }
      }

      if (freeTierConditions.length > 0) {
        conditions.push(`(${freeTierConditions.join(' OR ')})`);
      }
    }

    if (serverlessExecutionModel && resolvedProductType === 'serverless') {
      const modelOptions = (serverlessExecutionModel as string).split(',');
      const modelConditions: string[] = [];
      for (const opt of modelOptions) {
        if (opt === 'Both') {
          modelConditions.push(`pr.attributes->>'execution_model' = 'Both'`);
        } else if (opt === 'Code (ZIP)') {
          modelConditions.push(`pr.attributes->>'execution_model' IN ('Both', 'Code (ZIP)')`);
        } else if (opt === 'Container Image') {
          modelConditions.push(`pr.attributes->>'execution_model' IN ('Both', 'Container Image')`);
        }
      }
      if (modelConditions.length > 0) {
        conditions.push(`(${modelConditions.join(' OR ')})`);
      }
    }

    if (serverlessGranularity && resolvedProductType === 'serverless') {
      const granularityOptions = (serverlessGranularity as string).split(',').map(s => s.replace('ms', ''));
      conditions.push(`pr.attributes->>'billing_granularity_ms' = ANY($${paramCount++})`);
      values.push(granularityOptions);
    }

    if (serverlessProvisionedConcurrency && resolvedProductType === 'serverless') {
      const concurrencyOptions = (serverlessProvisionedConcurrency as string).split(',');
      conditions.push(`pr.attributes->>'provisioned_concurrency_support' = ANY($${paramCount++})`);
      values.push(concurrencyOptions);
    }

    if (serverlessEphemeralStorage && resolvedProductType === 'serverless') {
      const storageOptions = (serverlessEphemeralStorage as string).split(',');
      const storageConditions: string[] = [];

      for (const opt of storageOptions) {
        if (opt === '< 1') {
          storageConditions.push(`(pr.attributes->>'max_ephemeral_storage_gb')::numeric < 1`);
        } else if (opt === '1 - 5') {
          storageConditions.push(`(pr.attributes->>'max_ephemeral_storage_gb')::numeric BETWEEN 1 AND 5`);
        } else if (opt === '> 5') {
          storageConditions.push(`(pr.attributes->>'max_ephemeral_storage_gb')::numeric > 5`);
        }
      }

      if (storageConditions.length > 0) {
        conditions.push(`(${storageConditions.join(' OR ')})`);
      }
    }

    // Networking product type filters
    if (resolvedProductType === 'networking') {
      // networkingService matches the real service name (case-sensitive), so no LOWER.
      addInFilter(networkingService, 's.name', { lower: false });

      // These attribute filters also match rows with un-normalized 'n/a'/'none' values.
      const NA = { extra: ['n/a', 'none'] };
      addInFilter(networkingConnectionTypes, `LOWER(pr.attributes->>'connection_type')`, NA);
      addInFilter(networkingRoutingTypes, `LOWER(pr.attributes->>'routing_type')`, NA);
      addInFilter(networkingHaSupport, `LOWER(pr.attributes->>'ha_support')`, NA);
      addInFilter(networkingVpcSupport, `LOWER(pr.attributes->>'vpc_support')`, NA);
      addInFilter(networkingTransferDirections, `LOWER(pr.attributes->>'transfer_direction')`, NA);

      addInFilter(networkingBillingModels, `LOWER(pr.attributes->>'billing_model')`);
      addInFilter(networkingUsageTiers, `LOWER(pr.attributes->>'usage_tier')`);
      addInFilter(networkingPortCapacities, `LOWER(pr.attributes->>'port_capacity')`);
      addInFilter(networkingTransferScopes, `LOWER(pr.attributes->>'transfer_scope')`);
    }

    // Security product type filters. securityService matches the real service
    // name (e.g. "Web Application Firewall (WAF)"), same pattern as networkingService —
    // this block was previously missing entirely, making the Security Service filter a no-op.
    if (resolvedProductType === 'security') {
      addInFilter(securityService, 's.name', { lower: false });
    }

    // Containers product type filters
    if (resolvedProductType === 'containers') {
      if (containersOrchestrators) {
        conditions.push(`LOWER(pr.attributes->>'orchestrator') = ANY($${paramCount++})`);
        values.push((containersOrchestrators as string).split(',').map((s: string) => s.toLowerCase()));
      }
      if (containersComputeTypes) {
        conditions.push(`LOWER(pr.attributes->>'compute_type') = ANY($${paramCount++})`);
        values.push((containersComputeTypes as string).split(',').map((s: string) => s.toLowerCase()));
      }
      if (containersArchitectures) {
        conditions.push(`LOWER(pr.attributes->>'architecture') = ANY($${paramCount++})`);
        values.push((containersArchitectures as string).split(',').map((s: string) => s.toLowerCase()));
      }
      if (containersBillingGranularity) {
        conditions.push(`LOWER(pr.attributes->>'billing_granularity') = ANY($${paramCount++})`);
        values.push((containersBillingGranularity as string).split(',').map((s: string) => s.toLowerCase()));
      }
    }

    // Storage product type filters (Object/Block/File/Archive). All driven by
    // attributes JSONB; capacity price is normalized to $/GB-month.
    if (resolvedProductType === 'storage') {
      addInFilter(storageTypes, `LOWER(pr.attributes->>'storage_type')`);
      addInFilter(storageTiers, `LOWER(pr.attributes->>'tier')`);
      addInFilter(storageRedundancy, `LOWER(pr.attributes->>'redundancy')`);
      addInFilter(storageMedia, `LOWER(pr.attributes->>'media')`);
    }

    if (resolvedProductType === 'app-hosting') {
      addInFilter(appHostingTiers, `LOWER(pr.attributes->>'tier')`);
      addInFilter(appHostingComputeTypes, `LOWER(pr.attributes->>'compute_type')`);
    }

    if (resolvedProductType === 'integration') {
      addInFilter(integrationServices, `LOWER(pr.attributes->>'service_type')`);
      addInFilter(integrationTiers, `LOWER(pr.attributes->>'tier')`);
      addInFilter(integrationPricingModels, `LOWER(pr.attributes->>'pricing_model')`);

      if (integrationSizes) {
        const sizeOptions = parseFilterList(integrationSizes as string);
        const sizeConditions: string[] = [];
        for (const opt of sizeOptions) {
          if (opt === '256 KB') {
            sizeConditions.push(`(pr.attributes->>'max_message_size_kb')::int <= 256`);
          } else if (opt === '1 MB') {
            sizeConditions.push(`(pr.attributes->>'max_message_size_kb')::int BETWEEN 257 AND 1024`);
          } else if (opt === '4 MB') {
            sizeConditions.push(`(pr.attributes->>'max_message_size_kb')::int BETWEEN 1025 AND 4096`);
          } else if (opt === '10 MB') {
            sizeConditions.push(`(pr.attributes->>'max_message_size_kb')::int BETWEEN 4097 AND 10240`);
          } else if (opt === '100 MB') {
            sizeConditions.push(`(pr.attributes->>'max_message_size_kb')::int > 10240`);
          }
        }
        if (sizeConditions.length > 0) {
          conditions.push(`(${sizeConditions.join(' OR ')})`);
        }
      }

      if (integrationProtocols) {
        const protocolOptions = parseFilterList(integrationProtocols as string).map(p => p.toLowerCase());
        const protocolConditions: string[] = [];
        for (const opt of protocolOptions) {
          protocolConditions.push(`LOWER(pr.attributes->>'protocols') LIKE $${paramCount++}`);
          values.push(`%${opt}%`);
        }
        if (protocolConditions.length > 0) {
          conditions.push(`(${protocolConditions.join(' OR ')})`);
        }
      }
    }

    const noComputeSliders = ['networking', 'serverless', 'ai', 'storage', 'app-hosting', 'integration'];

    if (minVcpu && !noComputeSliders.includes(resolvedProductType)) {
      conditions.push(`pr.vcpus >= $${paramCount++}`);
      values.push(minVcpu);
    }
    if (maxVcpu && !noComputeSliders.includes(resolvedProductType)) {
      conditions.push(`pr.vcpus <= $${paramCount++}`);
      values.push(maxVcpu);
    }
    if (minMemory && !noComputeSliders.includes(resolvedProductType)) {
      conditions.push(`pr.memory_gb >= $${paramCount++}`);
      values.push(minMemory);
    }
    if (maxMemory && !noComputeSliders.includes(resolvedProductType)) {
      conditions.push(`pr.memory_gb <= $${paramCount++}`);
      values.push(maxMemory);
    }
    if (minGpuCount && resolvedProductType === 'gpu') {
      conditions.push(`pr.gpu_count >= $${paramCount++}`);
      values.push(minGpuCount);
    }
    if (maxGpuCount && resolvedProductType === 'gpu') {
      conditions.push(`pr.gpu_count <= $${paramCount++}`);
      values.push(maxGpuCount);
    }
    if (minPrice) {
      conditions.push(`pr.price_per_unit >= $${paramCount++}`);
      values.push(minPrice);
    }
    if (maxPrice) {
      conditions.push(`pr.price_per_unit <= $${paramCount++}`);
      values.push(maxPrice);
    }

    return {
      whereClause: conditions.length ? 'AND ' + conditions.join(' AND ') : '',
      values,
      paramCount,
    };
  } catch (error: any) {
    console.error('❌ Filter validation error:', error.message);
    throw new Error(`Invalid filter parameters: ${error.message}`);
  }
}
