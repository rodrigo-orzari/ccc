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

-- Initial Data
INSERT INTO providers (slug, name) VALUES
('aws', 'AWS'),
('azure', 'Azure'),
('gcp', 'Google'),
('oracle', 'Oracle'),
('digitalocean', 'DigitalOcean')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
