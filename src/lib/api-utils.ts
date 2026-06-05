import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from './db.ts';
import path from 'path';
import fs from 'fs';

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
const VALID_PRODUCT_TYPES = ['compute', 'database', 'serverless', 'networking', 'containers', 'data-analytics', 'ai'];

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
      provider, geography, os, arch, cpuVendor, gpu, category,
      minVcpu, maxVcpu, minMemory, maxMemory, minPrice, maxPrice, search,
      product,
      dbFamilies, engines, deploymentTypes, haModes,
      serverlessLanguages, serverlessColdStart, serverlessTimeout, serverlessMemoryConfig, serverlessFreeTier,
      serverlessGranularity, serverlessExecutionModel, serverlessProvisionedConcurrency, serverlessEphemeralStorage,
      containersOrchestrators, containersComputeTypes, containersArchitectures, containersBillingGranularity, containersGpuIncluded,
      analyticsEngines, analyticsDeploymentTypes, analyticsTiers,
      networkingService, networkingConnectionTypes, networkingRoutingTypes, networkingHaSupport, networkingVpcSupport, networkingTransferDirections,
    } = query;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const resolvedProductType =
      product && VALID_PRODUCT_TYPES.includes(product as string)
        ? (product as string)
        : 'compute';
        
    conditions.push(`s.category = $${paramCount++}`);
    values.push(resolvedProductType === 'data-analytics' ? 'data_warehouse' : resolvedProductType);

    const providers = parseFilterList(provider as string);
    if (providers.length > 0) {
      conditions.push(`s.provider_id IN (SELECT id FROM providers WHERE slug = ANY($${paramCount++}))`);
      values.push(providers);
    }

    const geographies = parseFilterList(geography as string).map((s: string) => s.toLowerCase());
    if (geographies.length > 0) {
      conditions.push(`LOWER(pr.geography) = ANY($${paramCount++})`);
      values.push(geographies);
    }

    if (resolvedProductType === 'compute') {
      const osFilters = parseFilterList(os as string).map((s: string) => s.toLowerCase());
      if (osFilters.length > 0) {
        conditions.push(`LOWER(pr.os) = ANY($${paramCount++})`);
        values.push(osFilters);
      }

      const archFilters = parseFilterList(arch as string).map((a: string) =>
        (a === 'x86' ? 'x86 64' : a).toLowerCase()
      );
      if (archFilters.length > 0) {
        conditions.push(`LOWER(pr.arch) = ANY($${paramCount++})`);
        values.push(archFilters);
      }

      const cpuVendorFilters = parseFilterList(cpuVendor as string).map((s: string) => s.toLowerCase());
      if (cpuVendorFilters.length > 0) {
        conditions.push(`LOWER(pr.cpu_vendor) = ANY($${paramCount++})`);
        values.push(cpuVendorFilters);
      }

      if (gpu === 'true') conditions.push(`pr.gpu_count > 0`);
      else if (gpu === 'false') conditions.push(`pr.gpu_count = 0`);
    }

    const categoriesFilter = parseFilterList((category || dbFamilies) as string).map((s: string) => s.toLowerCase());
    if (categoriesFilter.length > 0) {
      conditions.push(`LOWER(pr.category) = ANY($${paramCount++})`);
      values.push(categoriesFilter);
    }

    // Database & Analytics product type filters
    if (resolvedProductType === 'database' || resolvedProductType === 'data-analytics') {
      const engineFiltersRaw = parseFilterList((engines || analyticsEngines) as string).map((s: string) => s.toLowerCase());
      if (engineFiltersRaw.length > 0) {
        let engineFilters = new Set(engineFiltersRaw);
        if (engineFilters.has('native')) {
          engineFilters.delete('native');
          engineFilters.add('bigquery');
          engineFilters.add('redshift');
          engineFilters.add('synapse');
        }
        conditions.push(`LOWER(pr.attributes->>'engine') = ANY($${paramCount++})`);
        values.push(Array.from(engineFilters));
      }

      const deploymentTypeFilters = parseFilterList((deploymentTypes || analyticsDeploymentTypes) as string).map((s: string) => s.toLowerCase());
      if (deploymentTypeFilters.length > 0) {
        conditions.push(`LOWER(pr.attributes->>'deployment_type') = ANY($${paramCount++})`);
        values.push(deploymentTypeFilters);
      }

      // Database family filtering (Relational vs NoSQL) - only for 'database' type
      if (resolvedProductType === 'database') {
        const dbFamilyFilters = parseFilterList(dbFamilies as string);
        if (dbFamilyFilters.length > 0) {
          const familyConditions: string[] = [];

          // Map family types to engine lists
          const relationalEngines = ['PostgreSQL', 'MySQL', 'MariaDB', 'SQL Server', 'Oracle DB'];
          const noSqlEngines = ['Cosmos DB', 'MongoDB', 'Redis', 'Valkey', 'DB2'];

          for (const family of dbFamilyFilters) {
            if (family.toLowerCase() === 'relational') {
              familyConditions.push(`LOWER(pr.attributes->>'engine') = ANY($${paramCount})`);
              values.push(relationalEngines.map(e => e.toLowerCase()));
              paramCount++;
            } else if (family.toLowerCase() === 'nosql') {
              familyConditions.push(`LOWER(pr.attributes->>'engine') = ANY($${paramCount})`);
              values.push(noSqlEngines.map(e => e.toLowerCase()));
              paramCount++;
            }
          }

          if (familyConditions.length > 0) {
            conditions.push(`(${familyConditions.join(' OR ')})`);
          }
        }

        const haModeFilters = parseFilterList(haModes as string).map((s: string) => s.toLowerCase());
        if (haModeFilters.length > 0) {
          conditions.push(`LOWER(pr.attributes->>'ha_mode') = ANY($${paramCount++})`);
          values.push(haModeFilters);
        }
      }

      // Analytics tier filtering - only for 'data-analytics' type
      if (resolvedProductType === 'data-analytics') {
        const tierFilters = parseFilterList(analyticsTiers as string).map((s: string) => s.toLowerCase());
        if (tierFilters.length > 0) {
          conditions.push(`LOWER(pr.attributes->>'tier') = ANY($${paramCount++})`);
          values.push(tierFilters);
        }
      }
    }

    // Serverless product type filters
    if (resolvedProductType === 'serverless') {
      const languages = parseFilterList(serverlessLanguages as string);
      if (languages.length > 0) {
        conditions.push(`pr.attributes->'supportedLanguages' ?| $${paramCount++}`);
        values.push(languages);
      }

      if (serverlessColdStart) {
        const coldStartOptions = parseFilterList(serverlessColdStart as string);
        const coldStartConditions: string[] = [];

        for (const opt of coldStartOptions) {
          if (opt.includes('Fast')) {
            coldStartConditions.push(`(pr.attributes->>'cold_start_overhead_ms')::int < 100`);
          } else if (opt.includes('Medium')) {
            coldStartConditions.push(`(pr.attributes->>'cold_start_overhead_ms')::int BETWEEN 100 AND 200`);
          } else if (opt.includes('Slow')) {
            coldStartConditions.push(`(pr.attributes->>'cold_start_overhead_ms')::int > 200`);
          }
        }

        if (coldStartConditions.length > 0) {
          conditions.push(`(${coldStartConditions.join(' OR ')})`);
        }
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
      const networkingServices = parseFilterList(networkingService as string);
      if (networkingServices.length > 0) {
        conditions.push(`s.name = ANY($${paramCount++})`);
        values.push(networkingServices);
      }

      const networkingConnectionTypesFilters = parseFilterList(networkingConnectionTypes as string);
      if (networkingConnectionTypesFilters.length > 0) {
        conditions.push(`pr.attributes->>'connection_type' = ANY($${paramCount++})`);
        values.push(networkingConnectionTypesFilters);
      }

      const networkingRoutingTypesFilters = parseFilterList(networkingRoutingTypes as string);
      if (networkingRoutingTypesFilters.length > 0) {
        conditions.push(`pr.attributes->>'routing_type' = ANY($${paramCount++})`);
        values.push(networkingRoutingTypesFilters);
      }

      const networkingHaSupportFilters = parseFilterList(networkingHaSupport as string);
      if (networkingHaSupportFilters.length > 0) {
        conditions.push(`pr.attributes->>'ha_support' = ANY($${paramCount++})`);
        values.push(networkingHaSupportFilters);
      }

      const networkingVpcSupportFilters = parseFilterList(networkingVpcSupport as string);
      if (networkingVpcSupportFilters.length > 0) {
        conditions.push(`pr.attributes->>'vpc_support' = ANY($${paramCount++})`);
        values.push(networkingVpcSupportFilters);
      }

      const networkingTransferDirectionsFilters = parseFilterList(networkingTransferDirections as string);
      if (networkingTransferDirectionsFilters.length > 0) {
        conditions.push(`pr.attributes->>'transfer_direction' = ANY($${paramCount++})`);
        values.push(networkingTransferDirectionsFilters);
      }
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
        conditions.push(`pr.attributes->>'billing_granularity' = ANY($${paramCount++})`);
        values.push((containersBillingGranularity as string).split(','));
      }

      // Containers GPU filtering
      if (containersGpuIncluded === 'true') {
        conditions.push(`pr.gpu_count > 0`);
      } else if (containersGpuIncluded === 'false') {
        conditions.push(`pr.gpu_count = 0`);
      }
    }

    if (minVcpu && resolvedProductType !== 'networking' && resolvedProductType !== 'serverless') {
      conditions.push(`pr.vcpus >= $${paramCount++}`);
      values.push(minVcpu);
    }
    if (maxVcpu && resolvedProductType !== 'networking' && resolvedProductType !== 'serverless') {
      conditions.push(`pr.vcpus <= $${paramCount++}`);
      values.push(maxVcpu);
    }
    if (minMemory && resolvedProductType !== 'networking' && resolvedProductType !== 'serverless') {
      conditions.push(`pr.memory_gb >= $${paramCount++}`);
      values.push(minMemory);
    }
    if (maxMemory && resolvedProductType !== 'networking' && resolvedProductType !== 'serverless') {
      conditions.push(`pr.memory_gb <= $${paramCount++}`);
      values.push(maxMemory);
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
