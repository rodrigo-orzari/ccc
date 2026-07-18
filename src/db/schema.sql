-- SQL Schema for Cloud Pricing Data

-- 1. Cloud Providers
CREATE TABLE IF NOT EXISTS providers (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL, -- 'aws', 'gcp', 'azure', etc.
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Cloud Regions
CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL, -- 'us-east-1', 'europe-west1', etc.
    display_name VARCHAR(200),
    UNIQUE(provider_id, slug)
);

-- 3. Cloud Services
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- 'compute', 'storage', 'database', etc.
    UNIQUE(provider_id, name)
);

-- 4. Pricing Records
CREATE TABLE IF NOT EXISTS pricing_records (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    region_id INTEGER REFERENCES regions(id) ON DELETE CASCADE,
    instance_type VARCHAR(100), -- 't3.medium', 'n1-standard-1', etc.
    vcpus FLOAT,
    memory_gb FLOAT,
    arch VARCHAR(50), -- 'x86_64', 'arm64'
    os VARCHAR(50), -- 'linux', 'windows'
    cpu_vendor VARCHAR(50), -- 'Intel', 'AMD', 'ARM', etc.
    gpu_count INTEGER DEFAULT 0,
    geography VARCHAR(100), -- 'N. America', 'Europe', etc.
    price_per_unit NUMERIC(15, 6) NOT NULL,
    unit VARCHAR(50) DEFAULT 'hourly',
    currency VARCHAR(10) DEFAULT 'USD',
    attributes JSONB, -- For extra metadata
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prevents the same instance/region/os/arch variant from being inserted twice.
-- attributes->>'engine' and ->>'ha_mode' are included (COALESCE'd to '' so NULLs
-- don't exempt rows from the check) because database_pipeline.ts holds os/arch
-- constant across DB engines (MySQL, PostgreSQL, SQL Server, etc.) and HA modes —
-- those rows are only distinguished via the attributes JSONB, not real columns.
DROP INDEX IF EXISTS pricing_records_unique_key;

-- Remove duplicate rows before creating the unique index.
-- Keeps the first row (lowest id) of each duplicate group, deletes the rest.
-- This is a no-op if no duplicates exist.
WITH duplicates AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY service_id, region_id, instance_type, os, arch,
                   COALESCE(attributes->>'engine', ''),
                   COALESCE(attributes->>'ha_mode', '')
      ORDER BY id
    ) as rn
  FROM pricing_records
)
DELETE FROM pricing_records
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

CREATE UNIQUE INDEX IF NOT EXISTS pricing_records_unique_key
ON pricing_records (
    service_id, region_id, instance_type, os, arch,
    (COALESCE(attributes->>'engine', '')),
    (COALESCE(attributes->>'ha_mode', ''))
);

-- Performance indexes for the /api/pricing and /api/pricing/counts hot path.
-- Every request filters on s.category and joins pricing_records -> services -> providers,
-- then filters pricing_records by geography/os/arch/cpu_vendor/category (all wrapped in
-- LOWER()) plus JSONB attributes. Without these, Postgres sequential-scans pricing_records
-- on every request. All are IF NOT EXISTS so this block is safe to re-run.

-- Join / foreign-key columns (Postgres does NOT auto-index FKs).
CREATE INDEX IF NOT EXISTS idx_pricing_service_id ON pricing_records (service_id);
CREATE INDEX IF NOT EXISTS idx_pricing_region_id ON pricing_records (region_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services (category);

-- ORDER BY price_per_unit ASC on every query.
CREATE INDEX IF NOT EXISTS idx_pricing_price ON pricing_records (price_per_unit);

-- Functional indexes matching the LOWER(col) = ANY(...) filter predicates.
CREATE INDEX IF NOT EXISTS idx_pricing_geography_lower ON pricing_records (LOWER(geography));
CREATE INDEX IF NOT EXISTS idx_pricing_category_lower ON pricing_records (LOWER(category));
CREATE INDEX IF NOT EXISTS idx_pricing_os_lower ON pricing_records (LOWER(os));
CREATE INDEX IF NOT EXISTS idx_pricing_arch_lower ON pricing_records (LOWER(arch));
CREATE INDEX IF NOT EXISTS idx_pricing_cpu_vendor_lower ON pricing_records (LOWER(cpu_vendor));

-- GPU filtering (gpu_count > 0 / = 0).
CREATE INDEX IF NOT EXISTS idx_pricing_gpu_count ON pricing_records (gpu_count);

-- JSONB attributes: GIN supports the `?|` containment filters (e.g. serverless languages);
-- the expression index accelerates the very common engine = ANY(...) database/analytics filter.
CREATE INDEX IF NOT EXISTS idx_pricing_attributes_gin ON pricing_records USING GIN (attributes);
CREATE INDEX IF NOT EXISTS idx_pricing_attr_engine_lower ON pricing_records (LOWER(attributes->>'engine'));

-- Initial Data
-- Only pricing providers are seeded here. Other providers (Cloudflare, OpenAI,
-- vector DBs) are auto-created via ensureProviderId() when their pipelines
-- first run, so they don't need to be seeded.
INSERT INTO providers (slug, name) VALUES
('aws', 'AWS'),
('azure', 'Azure'),
('gcp', 'Google'),
('oracle', 'Oracle'),
('digitalocean', 'DigitalOcean'),
('alibaba', 'Alibaba Cloud')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
