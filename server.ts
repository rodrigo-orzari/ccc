import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import cron from 'node-cron';
import crypto from 'crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PricingPipeline, PriceDriftResult } from './src/services/pricing_pipeline.ts';
import { DatabasePricingPipeline } from './src/services/database_pipeline.ts';
import { ServerlessPricingPipeline } from './src/services/serverless_pipeline.ts';
import { ContainersPricingPipeline } from './src/services/containers_pipeline.ts';
import { NetworkingPricingPipeline } from './src/services/networking_pipeline.ts';
import { sendPriceDriftEmail, sendStalenessEmail, StaleDataAlert } from './src/services/mailer.ts';

dotenv.config();

const { Pool } = pg;

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Parse DATABASE_URL manually so pg never sees the sslmode parameter,
  // which in pg 8.x overrides rejectUnauthorized when set to 'require'.
  function parseDbUrl(url: string) {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: u.port ? parseInt(u.port) : 5432,
      database: u.pathname.replace(/^\//, ''),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
    };
  }

  // PostgreSQL Connection Pool
  const pool = new Pool({
    ...(process.env.DATABASE_URL ? parseDbUrl(process.env.DATABASE_URL) : {}),
    ssl: process.env.DATABASE_CA_CERT
      ? {
          rejectUnauthorized: false,
          // Use the provided CA certificate (base64-encoded)
          ca: [Buffer.from(process.env.DATABASE_CA_CERT, 'base64')],
        }
      : {
          rejectUnauthorized: true,
        },
  });

  // Security Hardening: Helmet adds standard HTTP security headers
  app.use(helmet());

  // Security Hardening: Restrict CORS
  const allowedOrigins = ['https://comparecloudcosts.com', 'https://www.comparecloudcosts.com'];
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      // or if the origin is in our allowed list or localhost (for development)
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));
  app.use(express.json());

  // Security Hardening: Rate Limiting
  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
    message: 'Too many requests from this IP, please try again after a minute',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  // ✅ Admin Authentication Middleware
  function requireAdminAuth(req: any, res: any, next: any) {
    const adminToken = req.headers['x-admin-token'] as string;
    const expectedToken = process.env.ADMIN_API_KEY;

    if (!adminToken || !expectedToken) {
      return res.status(401).json({
        error: 'Unauthorized: Missing X-Admin-Token header',
      });
    }

    // Security Hardening: Use native constant-time comparison to prevent timing attacks
    try {
      const a = Buffer.from(adminToken);
      const b = Buffer.from(expectedToken);
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return res.status(403).json({
          error: 'Forbidden: Invalid admin token',
        });
      }
    } catch (err) {
      return res.status(403).json({
        error: 'Forbidden: Invalid admin token format',
      });
    }

    next();
  }

  // Function to initialize database schema
  const initDb = async () => {
    try {
      const schemaPath = path.join(process.cwd(), 'src/db/schema.sql');
      if (!fs.existsSync(schemaPath)) return false;
      const schema = fs.readFileSync(schemaPath, 'utf8');
      const client = await pool.connect();
      await client.query(schema);

      // Safety: Add columns if they don't exist (since CREATE TABLE IF NOT EXISTS doesn't update schema)
      await client.query(`
        ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS cpu_vendor VARCHAR(50);
        ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS gpu_count INTEGER DEFAULT 0;
        ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS category VARCHAR(50);
        ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS attributes JSONB;
        ALTER TABLE pricing_records ADD COLUMN IF NOT EXISTS data_source VARCHAR(20) DEFAULT 'live_api';
      `);

      // Tag all known compute services so productType filtering works correctly.
      // Database services get tagged 'database' when DatabasePricingPipeline runs.
      await client.query(`
        UPDATE services SET category = 'compute'
        WHERE name IN ('EC2', 'Virtual Machines', 'Compute Engine', 'OCI Compute', 'Droplets')
          AND (category IS NULL OR category = 'Compute');
      `);

      // Update provider names to preferred display names
      await client.query(`
        UPDATE providers SET name = 'AWS' WHERE slug = 'aws';
        UPDATE providers SET name = 'Azure' WHERE slug = 'azure';
        UPDATE providers SET name = 'Google' WHERE slug = 'gcp';
        UPDATE providers SET name = 'Oracle' WHERE slug = 'oracle';

        -- Migrate architecture names
        UPDATE pricing_records SET arch = 'x86 64' WHERE arch = 'x86_64' OR arch = 'x86';
        UPDATE pricing_records SET arch = 'ARM' WHERE arch = 'ARM64';

        -- Refine CPU Vendor associations
        UPDATE pricing_records SET cpu_vendor = 'AWS' WHERE instance_type ILIKE '%graviton%' OR instance_type ~* '[a-z][0-9]g\\..*';
        UPDATE pricing_records SET cpu_vendor = 'Ampere' WHERE instance_type ILIKE '%ampere%' OR instance_type ILIKE '%altra%' OR instance_type ILIKE 't2a%';
        UPDATE pricing_records SET cpu_vendor = 'AMD' WHERE instance_type ILIKE '%epyc%' OR instance_type ILIKE '%amd%' OR instance_type ILIKE 't2d%' OR instance_type ~* '[a-z][0-9]a\\..*';

        -- Backfill gpu_count for legacy rows that were tagged with category='GPU' but missing the flag
        UPDATE pricing_records SET gpu_count = 1 WHERE category = 'GPU' AND (gpu_count IS NULL OR gpu_count = 0);

        -- Reclassify any legacy category='GPU' rows by memory/vCPU ratio (GPU is now a capability, not a category)
        UPDATE pricing_records SET category =
          CASE
            WHEN (CAST(memory_gb AS FLOAT) / NULLIF(vcpus, 0)) <= 2.1 THEN 'Compute optimized'
            WHEN (CAST(memory_gb AS FLOAT) / NULLIF(vcpus, 0)) >= 7.5 THEN 'Memory optimized'
            ELSE 'General purpose'
          END
        WHERE category = 'GPU';
      `);

      client.release();
      console.log('✅ Database schema initialized successfully.');
      return true;
    } catch (err) {
      console.error('❌ Failed to initialize database schema:', err);
      return false;
    }
  };

  let pipelineStatus = {
    running: false,
    lastRun: null as Date | null,
    lastResult: null as any
  };

  // 1. Initial Auto-Init
  if (process.env.DATABASE_URL) {
    initDb().then(async (success) => {
      if (success) {
        // In production, skip auto-fetching to ensure health checks pass during deployment.
        // Use the scheduled cron job or the /api/admin/fetch-pricing endpoint instead.
        if (process.env.NODE_ENV === 'production') {
          console.log('📌 Production mode: skipping auto-pricing fetch. Use /api/admin/fetch-pricing to fetch data.');
          return;
        }

        // In development, check if we have data, if not, trigger a fetch "now"
        try {
          const client = await pool.connect();
          const res = await client.query(`
            SELECT p.slug, COUNT(pr.id) as count
            FROM providers p
            LEFT JOIN services s ON s.provider_id = p.id
            LEFT JOIN pricing_records pr ON pr.service_id = s.id
            GROUP BY p.slug
          `);
          client.release();

          const needsFetch = res.rows.some(r => parseInt(r.count) < 5);

          if (needsFetch) {
            console.log('🚀 Some providers have sparse data. Triggering pricing update...');
            pipelineStatus.running = true;
            const pipeline = new PricingPipeline(pool);
            pipeline.run().then(results => {
              pipelineStatus.running = false;
              pipelineStatus.lastRun = new Date();
              pipelineStatus.lastResult = results;
              console.log('✅ Pipeline fetch completed:', results);
            }).catch(err => {
              pipelineStatus.running = false;
              pipelineStatus.lastResult = { error: err.message };
            });
          }
        } catch (err) {
          console.error('❌ Error checking database state:', err);
        }
      }
    });
  } else {
    console.warn('⚠️ DATABASE_URL is not set. Database functionality will be limited.');
  }

  // 2. Automated Background Jobs (Runs every Sunday at midnight)
  cron.schedule('0 0 * * 0', async () => {
    console.log('🕒 Starting scheduled pricing pipeline update...');
    try {
      const allDriftAlerts: PriceDriftResult[] = [];
      const pipeline = new PricingPipeline(pool);
      const results = await pipeline.run();
      for (const r of results) {
        if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
      }
      if (allDriftAlerts.length > 0) {
        await sendPriceDriftEmail(allDriftAlerts).catch(err =>
          console.error('❌ Failed to send price drift email:', err)
        );
      }
      console.log('✅ Scheduled pipeline completed:', results);
    } catch (err) {
      console.error('❌ Scheduled pipeline failed:', err);
    }

    // Staleness check — alert if any static-config service hasn't been updated in >7 days
    try {
      const client = await pool.connect();
      const staleRes = await client.query<{ provider: string; service: string; data_source: string; last_updated: Date }>(`
        SELECT p.slug AS provider, s.name AS service, pr.data_source, MAX(pr.updated_at) AS last_updated
        FROM pricing_records pr
        JOIN services s ON pr.service_id = s.id
        JOIN providers p ON s.provider_id = p.id
        WHERE pr.data_source = 'static_config'
        GROUP BY p.slug, s.name, pr.data_source
        HAVING MAX(pr.updated_at) < NOW() - INTERVAL '7 days'
      `);
      client.release();

      if (staleRes.rows.length > 0) {
        const staleAlerts: StaleDataAlert[] = staleRes.rows.map(row => ({
          provider: row.provider,
          service: row.service,
          dataSource: row.data_source,
          lastUpdated: row.last_updated,
          daysSinceUpdate: Math.floor((Date.now() - row.last_updated.getTime()) / 86_400_000),
        }));
        await sendStalenessEmail(staleAlerts).catch(err =>
          console.error('❌ Failed to send staleness email:', err)
        );
      }
    } catch (err) {
      console.error('❌ Staleness check failed:', err);
    }
  });

  // API Routes
  app.get('/api/ping', apiLimiter, (req, res) => {
    res.json({ status: 'pong', env: process.env.NODE_ENV, timestamp: new Date().toISOString() });
  });

  app.get('/api/health', apiLimiter, async (req, res) => {
    try {
      const productType = (req.query.productType as string) || '';
      const client = await pool.connect();

      // Apply all filters via buildPricingFilters so the per-provider totals
      // reflect the current filter state. This ensures the "of X" numbers in the UI
      // match the filtered pool.
      const { whereClause, values } = buildPricingFilters(req.query);

      const countRes = await client.query(
        `SELECT COUNT(*) FROM pricing_records pr
         JOIN services s ON pr.service_id = s.id
         WHERE 1=1 ${whereClause}`,
        values
      );
      const providerRes = await client.query(`
        SELECT p.slug, COUNT(pr.id) as count
        FROM providers p
        LEFT JOIN services s ON s.provider_id = p.id
        LEFT JOIN pricing_records pr ON pr.service_id = s.id
        WHERE 1=1 ${whereClause}
        GROUP BY p.slug
      `, values);
      const lastUpdatedRes = await client.query('SELECT MAX(updated_at) as last_updated FROM pricing_records');
      client.release();
      res.json({
        status: 'ok',
        database: 'connected',
        total_records: parseInt(countRes.rows[0].count),
        by_provider: providerRes.rows,
        last_updated: lastUpdatedRes.rows[0].last_updated
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // Init DB Route (Like --create-db-only)
  // ✅ Protected with authentication
  app.post('/api/admin/init-db', requireAdminAuth, async (req, res) => {
    const success = await initDb();
    if (success) {
      res.json({ message: 'Database initialized successfully.' });
    } else {
      res.status(500).json({ error: 'Failed to initialize database.' });
    }
  });

  // Run Pipeline Route — runs both compute and database pipelines.
  // Pass ?type=compute or ?type=database to run only one.
  // ✅ Protected with authentication
  app.post('/api/admin/fetch-pricing', requireAdminAuth, async (req, res) => {
    try {
      const type = (req.query.type as string) || 'all';
      const results: any[] = [];
      const allDriftAlerts: PriceDriftResult[] = [];

      if (type === 'all' || type === 'compute') {
        const pipeline = new PricingPipeline(pool);
        const computeResults = await pipeline.run();
        for (const r of computeResults) {
          if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
          results.push({ ...r, pipeline: 'compute' });
        }
      }

      if (type === 'all' || type === 'database') {
        const dbPipeline = new DatabasePricingPipeline(pool);
        const dbResults = await dbPipeline.run();
        for (const r of dbResults) {
          if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
          results.push({ ...r, pipeline: 'database' });
        }
      }

      if (type === 'all' || type === 'serverless') {
        const serverlessPipeline = new ServerlessPricingPipeline(pool);
        const serverlessResults = await serverlessPipeline.run();
        for (const r of serverlessResults) {
          if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
          results.push({ ...r, pipeline: 'serverless' });
        }
      }

      if (type === 'all' || type === 'networking') {
        const networkingPipeline = new NetworkingPricingPipeline(pool);
        const networkingResults = await networkingPipeline.run();
        for (const r of networkingResults) {
          if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
          results.push({ ...r, pipeline: 'networking' });
        }
      }

      if (type === 'all' || type === 'containers') {
        const containersPipeline = new ContainersPricingPipeline(pool);
        const containersResults = await containersPipeline.run();
        for (const r of containersResults) {
          if (r.driftAlerts) allDriftAlerts.push(...r.driftAlerts);
          results.push({ ...r, pipeline: 'containers' });
        }
      }

      // Refresh schema migrations / column backfills after any fetch
      await initDb();

      // Send drift email if any significant price changes were detected
      if (allDriftAlerts.length > 0) {
        sendPriceDriftEmail(allDriftAlerts).catch(err =>
          console.error('❌ Failed to send price drift email:', err)
        );
      }

      res.json({ message: 'Pipeline run completed and data migrated', results, driftAlerts: allDriftAlerts });
    } catch (err: any) {
      res.status(500).json({ error: 'Pipeline failed', details: err.message });
    }
  });

  // Build the WHERE-clause fragment + values for pricing filters (shared between
  // /api/pricing and /api/pricing/counts so filter behaviour stays consistent).

  // ✅ Input validation constants
  const MAX_FILTER_ITEMS = 50;
  const MAX_SEARCH_LENGTH = 200;
  const VALID_PRODUCT_TYPES = ['compute', 'database', 'serverless', 'networking', 'containers', 'data-analytics', 'ai'];

  // ✅ Helper: Safely split and validate comma-separated lists
  function parseFilterList(input: string | undefined, maxItems = MAX_FILTER_ITEMS): string[] {
    if (!input) return [];

    const items = input
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    if (items.length > maxItems) {
      throw new Error(`Filter list exceeds maximum of ${maxItems} items (got ${items.length})`);
    }

    // Sanitize: reject items with suspicious patterns
    for (const item of items) {
      if (item.length > 100 || /[;'"\\]/.test(item)) {
        throw new Error(`Invalid filter value: "${item}"`);
      }
    }

    return items;
  }

  function buildPricingFilters(query: any) {
    try {
      const {
        provider, geography, os, arch, cpuVendor, gpu, category,
        minVcpu, maxVcpu, minMemory, maxMemory, minPrice, maxPrice, search,
        // Database-specific filters
        productType, engine, deploymentType, haMode,
        // Serverless-specific filters
        language, coldStart, timeout, memoryConfig, freeTier,
        billingGranularity, executionModel, provisionedConcurrency, ephemeralStorage,
        // Containers-specific filters
        orchestrator, computeType, architecture,
        // Data & Analytics filters
        tier,
        // Networking filters
        networkingService,
      } = query;

      const conditions: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      // productType scopes the query to compute or database services.
      // Defaults to 'compute' so the existing VM dashboard is unaffected.
      const resolvedProductType =
        productType && VALID_PRODUCT_TYPES.includes(productType as string)
          ? (productType as string)
          : 'compute';
      conditions.push(`s.category = $${paramCount++}`);
      values.push(resolvedProductType);

      // ✅ Validate provider filter (use s.provider_id in subquery)
      const providers = parseFilterList(provider as string);
      if (providers.length > 0) {
        conditions.push(`s.provider_id IN (SELECT id FROM providers WHERE slug = ANY($${paramCount++}))`);
        values.push(providers);
      }

      // ✅ Validate geography filter
      const geographies = parseFilterList(geography as string);
      if (geographies.length > 0) {
        conditions.push(`pr.geography = ANY($${paramCount++})`);
        values.push(geographies);
      }

      // OS / arch / CPU / GPU only apply to the compute product type
      if (resolvedProductType === 'compute') {
        const osFilters = parseFilterList(os as string);
        if (osFilters.length > 0) {
          conditions.push(`pr.os = ANY($${paramCount++})`);
          values.push(osFilters);
        }

        const archFilters = parseFilterList(arch as string).map((a: string) =>
          a === 'x86' ? 'x86 64' : a
        );
        if (archFilters.length > 0) {
          conditions.push(`pr.arch = ANY($${paramCount++})`);
          values.push(archFilters);
        }

        const cpuVendorFilters = parseFilterList(cpuVendor as string);
        if (cpuVendorFilters.length > 0) {
          conditions.push(`pr.cpu_vendor = ANY($${paramCount++})`);
          values.push(cpuVendorFilters);
        }

        if (gpu === 'true') conditions.push(`pr.gpu_count > 0`);
        else if (gpu === 'false') conditions.push(`pr.gpu_count = 0`);
      }

      // ✅ Validate category filter
      if (category && category !== 'All categories') {
        const categories = parseFilterList(category as string);
        if (categories.length > 0) {
          conditions.push(`pr.category = ANY($${paramCount++})`);
          values.push(categories);
        }
      }

      // ✅ Validate database-specific JSONB attribute filters
      const engineFilters = parseFilterList(engine as string);
      if (engineFilters.length > 0) {
        conditions.push(`pr.attributes->>'engine' = ANY($${paramCount++})`);
        values.push(engineFilters);
      }

      const deploymentTypeFilters = parseFilterList(deploymentType as string);
      if (deploymentTypeFilters.length > 0) {
        conditions.push(`pr.attributes->>'deployment_type' = ANY($${paramCount++})`);
        values.push(deploymentTypeFilters);
      }

      const haModeFilters = parseFilterList(haMode as string);
      if (haModeFilters.length > 0) {
        conditions.push(`pr.attributes->>'ha_mode' = ANY($${paramCount++})`);
        values.push(haModeFilters);
      }

      // ✅ Validate data-analytics specific JSONB attribute filters
      const tierFilters = parseFilterList(tier as string);
      if (tierFilters.length > 0) {
        conditions.push(`pr.attributes->>'tier' = ANY($${paramCount++})`);
        values.push(tierFilters);
      }

      // ✅ Validate serverless-specific language filter
      const languages = parseFilterList(language as string);
      if (languages.length > 0) {
        conditions.push(`pr.attributes->'supportedLanguages' ?| $${paramCount++}`);
        values.push(languages);
      }

      // ✅ Validate networking service filter
      const networkingServices = parseFilterList(networkingService as string);
      if (networkingServices.length > 0) {
        conditions.push(`s.name = ANY($${paramCount++})`);
        values.push(networkingServices);
      }

      // ✅ Validate serverless-specific cold start filter
      if (coldStart) {
        const coldStartOptions = parseFilterList(coldStart as string);
        const coldStartConditions: string[] = [];

        for (const opt of coldStartOptions) {
          if (opt.includes('Fast')) {
            coldStartConditions.push(
              `(pr.attributes->>'cold_start_overhead_ms')::int < 100`
            );
          } else if (opt.includes('Medium')) {
            coldStartConditions.push(
              `(pr.attributes->>'cold_start_overhead_ms')::int BETWEEN 100 AND 200`
            );
          } else if (opt.includes('Slow')) {
            coldStartConditions.push(
              `(pr.attributes->>'cold_start_overhead_ms')::int > 200`
            );
          }
        }

        if (coldStartConditions.length > 0) {
          conditions.push(`(${coldStartConditions.join(' OR ')})`);
        }
      }

      // ✅ Validate search filter with length check
      if (search) {
        const searchStr = search as string;
        if (searchStr.length > MAX_SEARCH_LENGTH) {
          throw new Error(`Search string exceeds ${MAX_SEARCH_LENGTH} characters`);
        }
        conditions.push(`pr.instance_type ILIKE $${paramCount++}`);
        values.push(`%${searchStr}%`);
      }

      // Ensure serverless product type includes DigitalOcean (which uses 'serverless' category)
    // DigitalOcean Functions are stored with service category 'serverless'
    if (resolvedProductType === 'serverless') {
      // Already filtered by s.category = 'serverless' above
    }

    // Serverless-specific timeout filter
    if (timeout) {
      const timeoutOptions = (timeout as string).split(',');
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

    // Serverless-specific memory configuration filter
    if (memoryConfig) {
      const memoryOptions = (memoryConfig as string).split(',');
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

    // Serverless-specific free tier filter
    if (freeTier) {
      const freeTierOptions = (freeTier as string).split(',');
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

    // Serverless-specific execution model filter
    if (executionModel) {
      const modelOptions = (executionModel as string).split(',');
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

    // Serverless-specific billing granularity filter
    if (billingGranularity && resolvedProductType === 'serverless') {
      const granularityOptions = (billingGranularity as string).split(',').map(s => s.replace('ms', ''));
      conditions.push(`pr.attributes->>'billing_granularity_ms' = ANY($${paramCount++})`);
      values.push(granularityOptions);
    }

    // Serverless-specific provisioned concurrency filter
    if (provisionedConcurrency) {
      const concurrencyOptions = (provisionedConcurrency as string).split(',');
      conditions.push(`pr.attributes->>'provisioned_concurrency_support' = ANY($${paramCount++})`);
      values.push(concurrencyOptions);
    }

    // Serverless-specific ephemeral storage filter
    if (ephemeralStorage) {
      const storageOptions = (ephemeralStorage as string).split(',');
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

    // Containers-specific filters
    if (orchestrator) {
      conditions.push(`pr.attributes->>'orchestrator' = ANY($${paramCount++})`);
      values.push((orchestrator as string).split(','));
    }
    if (computeType) {
      conditions.push(`pr.attributes->>'compute_type' = ANY($${paramCount++})`);
      values.push((computeType as string).split(','));
    }
    if (architecture) {
      conditions.push(`pr.attributes->>'architecture' = ANY($${paramCount++})`);
      values.push((architecture as string).split(','));
    }
    if (billingGranularity && resolvedProductType === 'containers') {
      conditions.push(`pr.attributes->>'billing_granularity' = ANY($${paramCount++})`);
      values.push((billingGranularity as string).split(','));
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

  // Per-provider counts respecting current filters (drives the summary cards)
  app.get('/api/pricing/counts', apiLimiter, async (req, res) => {
    try {
      const { whereClause, values } = buildPricingFilters(req.query);
      const query = `
        SELECT p.slug, COUNT(pr.id) as count
        FROM providers p
        LEFT JOIN services s ON s.provider_id = p.id
        LEFT JOIN pricing_records pr ON pr.service_id = s.id
        WHERE 1=1 ${whereClause}
        GROUP BY p.slug
      `;
      const client = await pool.connect();
      const result = await client.query(query, values);
      client.release();
      res.json(result.rows);
    } catch (err: any) {
      console.error('Counts API error:', err);
      res.status(500).json({ error: 'Failed to fetch counts', details: err.message });
    }
  });

  // Fetch Pricing Data for Frontend with Filtering
  app.get('/api/pricing', apiLimiter, async (req, res) => {
    try {
      const isAggregated = req.query.aggregate === 'true';

      let selectClause = `
        p.name as provider,
        s.name as service,
        r.slug as region,
        pr.instance_type,
        pr.vcpus,
        pr.memory_gb,
        pr.arch,
        pr.os,
        pr.cpu_vendor,
        pr.gpu_count,
        pr.geography,
        pr.price_per_unit,
        pr.unit,
        pr.category,
        pr.attributes,
        pr.data_source,
        pr.updated_at
      `;

      if (isAggregated) {
        selectClause = `
          p.name as provider,
          'Various' as service,
          'Various' as region,
          pr.instance_type,
          pr.vcpus,
          pr.memory_gb,
          pr.arch,
          pr.os,
          pr.cpu_vendor,
          pr.gpu_count,
          'Various' as geography,
          MIN(pr.price_per_unit) as min_price,
          AVG(pr.price_per_unit) as avg_price,
          MAX(pr.price_per_unit) as max_price,
          MIN(pr.price_per_unit) as price_per_unit,
          pr.unit,
          pr.category,
          MAX(pr.updated_at) as updated_at,
          MAX(pr.attributes::text)::jsonb as attributes,
          MAX(pr.data_source) as data_source
        `;
      }

      let query = `
        SELECT ${selectClause}
        FROM pricing_records pr
        JOIN services s ON pr.service_id = s.id
        JOIN regions r ON pr.region_id = r.id
        JOIN providers p ON s.provider_id = p.id
        WHERE 1=1
      `;

      const { whereClause, values } = buildPricingFilters(req.query);
      query += ' ' + whereClause;

      if (isAggregated) {
        query += `
          GROUP BY
            p.name, pr.instance_type, pr.vcpus, pr.memory_gb,
            pr.arch, pr.os, pr.cpu_vendor, pr.gpu_count, pr.category, pr.unit
          ORDER BY avg_price ASC
          LIMIT 1000
        `;
      } else {
        query += ` ORDER BY pr.price_per_unit ASC LIMIT 1000`;
      }

      const client = await pool.connect();
      console.log('SQL Query:', query);
      console.log('SQL Params:', values);
      const result = await client.query(query, values);
      client.release();
      res.json(result.rows);
    } catch (err: any) {
      console.error('API Error:', err);
      res.status(500).json({ error: 'Failed to fetch pricing data', details: err.message });
    }
  });

  // Vite middleware for development
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`Mode: ${isProduction ? 'Production' : 'Development'}`);

  if (!isProduction) {
    console.log('Starting Vite in middleware mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    console.log(`Serving static files from: ${distPath}`);

    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          console.error(`Index file not found at: ${indexPath}`);
          res.status(404).send('Application not built correctly. index.html missing in dist.');
        }
      });
    } else {
      console.error(`Dist directory not found at: ${distPath}`);
      app.get('*', (req, res) => {
        res.status(404).send('Application not built. dist directory missing.');
      });
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer().catch((err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
