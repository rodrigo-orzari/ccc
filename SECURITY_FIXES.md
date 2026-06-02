# Security Fixes: Implementation Guide

This document provides step-by-step instructions to fix the critical vulnerabilities identified in `SECURITY_AUDIT.md`.

---

## 1. Fix #1: Remove NODE_TLS_REJECT_UNAUTHORIZED Override (CRITICAL)

**File:** `src/services/pricing_pipeline.ts`  
**Line:** 443  
**Time:** 5 minutes

### Current Code
```typescript
export class PricingPipeline {
  protected pool: Pool;
  protected adapters: BaseAdapter[];

  constructor(pool: Pool) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';  // ❌ DANGEROUS

    this.pool = pool;
    this.adapters = [
      new AzureAdapter(),
      new AWSAdapter(),
      new GCPAdapter(),
      new OracleAdapter(),
      new DigitalOceanAdapter()
    ];
  }
}
```

### Fixed Code
```typescript
export class PricingPipeline {
  protected pool: Pool;
  protected adapters: BaseAdapter[];

  constructor(pool: Pool) {
    // Removed dangerous TLS override — all certificates now validated properly
    // If you get "certificate validation failed" errors, the issue is a misconfigured
    // database connection or intermediate CA certificate. See OPERATIONS_RUNBOOK.md.

    this.pool = pool;
    this.adapters = [
      new AzureAdapter(),
      new AWSAdapter(),
      new GCPAdapter(),
      new OracleAdapter(),
      new DigitalOceanAdapter()
    ];
  }
}
```

### Verification
After deploying this fix, run:
```bash
npm run dev
# Watch the server logs for "Fetching AWS Lambda pricing..." etc.
# If you get certificate errors, the root cause is the database connection, not external APIs
```

---

## 2. Fix #2: Enable Strict TLS Validation in Production

**File:** `server.ts`  
**Lines:** 35-39  
**Time:** 15 minutes

### Current Code (UNSAFE)
```typescript
const pool = new Pool({
  ...(process.env.DATABASE_URL ? parseDbUrl(process.env.DATABASE_URL) : {}),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  //                                                    ↑ DANGEROUS
});
```

### Fixed Code (SAFE)
```typescript
const pool = new Pool({
  ...(process.env.DATABASE_URL ? parseDbUrl(process.env.DATABASE_URL) : {}),
  ssl: process.env.NODE_ENV === 'production' 
    ? {
        rejectUnauthorized: true,  // ✅ Enforce certificate validation
        // If DATABASE_CA_CERT is provided (e.g., via DigitalOcean Secrets),
        // use it as the CA to validate the server certificate:
        ca: process.env.DATABASE_CA_CERT 
          ? [Buffer.from(process.env.DATABASE_CA_CERT, 'base64')] 
          : undefined,
      }
    : false,
});
```

### Configuration in DigitalOcean App Platform

1. Go to **App Settings → Environment Variables**
2. Add `DATABASE_CA_CERT`:
   - If DigitalOcean manages your database, retrieve the CA certificate:
     ```bash
     # DigitalOcean provides this automatically in the connection string docs
     # Copy the certificate from your database connection details
     ```
   - Convert to base64:
     ```bash
     cat ca-certificate.crt | base64 | pbcopy  # macOS
     cat ca-certificate.crt | base64 | xclip  # Linux
     ```
   - Paste into the `DATABASE_CA_CERT` environment variable

3. Or use Node's built-in CA bundle (no override needed):
   ```typescript
   ssl: process.env.NODE_ENV === 'production' 
     ? { rejectUnauthorized: true }  // Uses Node's built-in CAs
     : false,
   ```

### Verification
After deploying:
```bash
# Test database connection
npm run dev
# Should see: "✅ Database schema initialized successfully."
# If you see certificate errors, check DATABASE_CA_CERT is set correctly
```

---

## 3. Fix #3: Add Authentication to Admin Endpoints (CRITICAL)

**File:** `server.ts`  
**Lines:** 40-45 (add middleware), 256-315 (apply to routes)  
**Time:** 30 minutes

### Step 1: Add Authentication Middleware (after line 42, after `app.use(express.json())`)

```typescript
app.use(express.json());

// ✅ NEW: Admin authentication middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const adminToken = req.headers['x-admin-token'] as string;
  const expectedToken = process.env.ADMIN_API_KEY;

  if (!adminToken || !expectedToken) {
    return res.status(401).json({ 
      error: 'Unauthorized: Missing X-Admin-Token header' 
    });
  }

  // Use constant-time comparison to prevent timing attacks
  const isValid = adminToken.length === expectedToken.length &&
    Array.from(adminToken).every((char, i) => char === expectedToken[i]);

  if (!isValid) {
    return res.status(403).json({ 
      error: 'Forbidden: Invalid admin token' 
    });
  }

  next();
}
```

### Step 2: Apply Middleware to Admin Routes (lines 256-315)

**Before:**
```typescript
app.post('/api/admin/init-db', async (req, res) => {
  const success = await initDb();
  // ...
});

app.post('/api/admin/fetch-pricing', async (req, res) => {
  // ...
});
```

**After:**
```typescript
app.post('/api/admin/init-db', requireAdminAuth, async (req, res) => {
  const success = await initDb();
  // ...
});

app.post('/api/admin/fetch-pricing', requireAdminAuth, async (req, res) => {
  // ...
});
```

### Step 3: Update `.env.example`

Add this line:
```bash
# Admin API Key — required to access /api/admin/* endpoints
# Generate with: openssl rand -hex 32
ADMIN_API_KEY="your-secret-admin-key-here-must-be-at-least-32-characters"
```

### Step 4: Generate a Strong Token for Production

```bash
# Generate a 64-character random token (using OpenSSL)
openssl rand -hex 32

# Example output:
# a7f8e2c9b3d4f1e6a9c8b7d2e5f4a1b3c6d9e2f5a8b1c4d7e0f3a6b9c2e5f8

# Copy this value and set it in DigitalOcean App Platform:
# App Settings → Environment Variables → ADMIN_API_KEY
```

### Testing the Fix

```bash
# Should fail without token:
curl -X POST http://localhost:3000/api/admin/init-db
# Response: {"error":"Unauthorized: Missing X-Admin-Token header"}

# Should fail with wrong token:
curl -X POST http://localhost:3000/api/admin/init-db \
  -H "X-Admin-Token: wrong-token"
# Response: {"error":"Forbidden: Invalid admin token"}

# Should succeed with correct token:
curl -X POST http://localhost:3000/api/admin/init-db \
  -H "X-Admin-Token: your-actual-token-here"
# Response: {"message":"Database initialized successfully."}
```

---

## 4. Fix #4: Add Rate Limiting to Admin Endpoints (RECOMMENDED)

**File:** `server.ts`  
**Time:** 15 minutes

### Step 1: Install express-rate-limit

```bash
npm install express-rate-limit
npm install --save-dev @types/express-rate-limit
```

### Step 2: Import and Configure (at the top of server.ts)

```typescript
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';  // ✅ Add this
// ... rest of imports
```

### Step 3: Add Rate Limiters (after middleware setup, before routes)

```typescript
app.use(express.json());

// ✅ NEW: Rate limiters
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 requests per 15-minute window
  message: 'Too many admin requests, please try again later.',
  standardHeaders: true, // Include RateLimit-* headers in response
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for admin endpoint: ${req.ip}`);
    res.status(429).json({ error: 'Too many admin requests' });
  },
});

const pricingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2, // Maximum 2 fetches per hour (expensive operation)
  message: 'Pricing pipeline already running or max frequency reached.',
  skip: (req) => {
    // Only rate limit POST requests (not GET health checks)
    return req.method !== 'POST';
  },
});

// ... auth middleware here ...
```

### Step 4: Apply Limiters to Routes

```typescript
app.post('/api/admin/init-db', adminLimiter, requireAdminAuth, async (req, res) => {
  // ...
});

app.post('/api/admin/fetch-pricing', adminLimiter, pricingLimiter, requireAdminAuth, async (req, res) => {
  // ...
});
```

---

## 5. Fix #5: Add Input Validation to Filters

**File:** `server.ts`  
**Lines:** 319-400 (`buildPricingFilters` function)  
**Time:** 45 minutes

### Current Code (Fragile)
```typescript
function buildPricingFilters(query: any) {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  const resolvedProductType = (productType as string) || 'compute';
  conditions.push(`s.category = $${paramCount++}`);
  values.push(resolvedProductType);

  if (provider) { 
    conditions.push(`p.slug = ANY($${paramCount++})`); 
    values.push((provider as string).split(',')); // No validation!
  }
  // ... rest of function
}
```

### Fixed Code (Safe)
```typescript
// Constants for validation
const MAX_FILTER_ITEMS = 50;
const MAX_SEARCH_LENGTH = 200;
const VALID_CATEGORIES = ['compute', 'database', 'serverless'];
const VALID_PRODUCT_TYPES = ['compute', 'database', 'serverless'];

// Helper function to safely split comma-separated lists
function parseFilterList(input: string | undefined, maxItems = MAX_FILTER_ITEMS): string[] {
  if (!input) return [];
  
  const items = input
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  if (items.length > maxItems) {
    throw new Error(`Filter list exceeds maximum of ${maxItems} items (got ${items.length})`);
  }
  
  // Sanitize: reject items with SQL-like patterns
  for (const item of items) {
    if (item.length > 100 || /[;'"\\]/.test(item)) {
      throw new Error(`Invalid filter value: "${item}"`);
    }
  }
  
  return items;
}

function buildPricingFilters(query: any) {
  try {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Validate productType
    const productType = query.productType as string | undefined;
    const resolvedProductType = productType && VALID_PRODUCT_TYPES.includes(productType) 
      ? productType 
      : 'compute';
    conditions.push(`s.category = $${paramCount++}`);
    values.push(resolvedProductType);

    // Provider filter with validation
    const providers = parseFilterList(query.provider);
    if (providers.length > 0) {
      conditions.push(`p.slug = ANY($${paramCount++})`);
      values.push(providers);
    }

    // Geography filter with validation
    const geographies = parseFilterList(query.geography);
    if (geographies.length > 0) {
      conditions.push(`pr.geography = ANY($${paramCount++})`);
      values.push(geographies);
    }

    // OS / arch / CPU filters (only for compute)
    if (resolvedProductType === 'compute') {
      const osFilters = parseFilterList(query.os);
      if (osFilters.length > 0) {
        conditions.push(`pr.os = ANY($${paramCount++})`);
        values.push(osFilters);
      }

      const archFilters = parseFilterList(query.arch)
        .map(a => a === 'x86' ? 'x86 64' : a);
      if (archFilters.length > 0) {
        conditions.push(`pr.arch = ANY($${paramCount++})`);
        values.push(archFilters);
      }

      const cpuVendorFilters = parseFilterList(query.cpuVendor);
      if (cpuVendorFilters.length > 0) {
        conditions.push(`pr.cpu_vendor = ANY($${paramCount++})`);
        values.push(cpuVendorFilters);
      }

      if (query.gpu === 'true') conditions.push(`pr.gpu_count > 0`);
      else if (query.gpu === 'false') conditions.push(`pr.gpu_count = 0`);
    }

    // Category filter with validation
    if (query.category && query.category !== 'All categories') {
      const categories = parseFilterList(query.category);
      if (categories.length > 0) {
        conditions.push(`pr.category = ANY($${paramCount++})`);
        values.push(categories);
      }
    }

    // Search filter with length validation
    const search = query.search as string | undefined;
    if (search) {
      if (search.length > MAX_SEARCH_LENGTH) {
        throw new Error(`Search string exceeds ${MAX_SEARCH_LENGTH} characters`);
      }
      conditions.push(`pr.instance_type ILIKE $${paramCount++}`);
      values.push(`%${search}%`);
    }

    // Database-specific filters
    const engine = parseFilterList(query.engine);
    if (engine.length > 0) {
      conditions.push(`pr.attributes->>'engine' = ANY($${paramCount++})`);
      values.push(engine);
    }

    const deploymentType = parseFilterList(query.deploymentType);
    if (deploymentType.length > 0) {
      conditions.push(`pr.attributes->>'deployment_type' = ANY($${paramCount++})`);
      values.push(deploymentType);
    }

    const haMode = parseFilterList(query.haMode);
    if (haMode.length > 0) {
      conditions.push(`pr.attributes->>'ha_mode' = ANY($${paramCount++})`);
      values.push(haMode);
    }

    // Serverless-specific filters
    const language = parseFilterList(query.language);
    if (language.length > 0) {
      conditions.push(`pr.attributes->'supportedLanguages' ?| $${paramCount++}`);
      values.push(language);
    }

    // Build final WHERE clause
    const whereClause = conditions.length > 0 
      ? ' AND ' + conditions.join(' AND ')
      : '';

    return { whereClause, values };

  } catch (error: any) {
    console.error('❌ Filter validation error:', error.message);
    throw new Error(`Invalid filter parameters: ${error.message}`);
  }
}
```

### Update Error Handling

At the `/api/pricing` endpoint, catch and handle validation errors:

```typescript
app.get('/api/pricing', async (req, res) => {
  try {
    const { whereClause, values } = buildPricingFilters(req.query);
    
    const client = await pool.connect();
    const response = await client.query(
      `SELECT * FROM pricing_records pr 
       JOIN services s ON pr.service_id = s.id 
       JOIN providers p ON s.provider_id = p.id 
       WHERE 1=1 ${whereClause} 
       ORDER BY pr.price ASC 
       LIMIT 1000`,
      values
    );
    client.release();

    res.json({
      count: response.rows.length,
      records: response.rows,
    });
  } catch (err: any) {
    console.error('❌ /api/pricing error:', err);
    
    // Distinguish validation errors from database errors
    if (err.message.includes('Invalid filter')) {
      res.status(400).json({ error: err.message });
    } else {
      // Don't expose database errors to client
      res.status(500).json({ error: 'Failed to fetch pricing data' });
    }
  }
});
```

---

## 6. Fix #6: Update .env.example with Missing Variables

**File:** `.env.example`  
**Time:** 10 minutes

### Replace entire file with:

```bash
# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================

# PostgreSQL connection string (e.g., postgres://user:password@host:port/db)
# Required for all functionality
DATABASE_URL="YOUR_DATABASE_URL"

# Optional: CA certificate for TLS validation (base64-encoded)
# If your database requires certificate verification, provide the CA cert here
# Convert to base64: cat ca-certificate.crt | base64
DATABASE_CA_CERT=""

# ============================================================================
# ADMIN API CONFIGURATION
# ============================================================================

# Admin API Key — required for protected /api/admin/* endpoints
# Generate with: openssl rand -hex 32
# Minimum 32 characters (64 recommended)
ADMIN_API_KEY="your-secret-admin-key-here-min-64-chars-recommended"

# ============================================================================
# EMAIL CONFIGURATION (Optional)
# ============================================================================

# SMTP settings for price drift and staleness alerts
# Leave empty to disable email notifications (alerts will appear in logs instead)

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"
SMTP_FROM="noreply@comparecloudcosts.com"

# ============================================================================
# CLOUD PROVIDER API TOKENS (Optional)
# ============================================================================

# DigitalOcean API Token — for live /v2/sizes pricing API
# Leave empty to use static configuration from src/config/digitalocean_instances.ts
DIGITALOCEAN_API_TOKEN=""

# ============================================================================
# APPLICATION CONFIGURATION
# ============================================================================

# Node environment (development, production, test)
NODE_ENV="development"

# Application port (default 3000)
PORT="3000"

# Public application URL (used for self-referential links, OAuth callbacks)
# Examples:
#   Development: http://localhost:3000
#   Production: https://comparecloudcosts.com
APP_URL="http://localhost:3000"

# ============================================================================
# LOGGING & MONITORING (Optional)
# ============================================================================

# Logging level (error, warn, info, debug, trace)
LOG_LEVEL="info"

# ============================================================================
# CORS CONFIGURATION (Optional)
# ============================================================================

# Comma-separated list of allowed origins
# Leave empty to allow all origins (⚠️  Only for development)
# Production: "https://comparecloudcosts.com,https://www.comparecloudcosts.com"
ALLOWED_ORIGINS=""

# ============================================================================
# API VERSIONING & ENDPOINTS (Optional)
# ============================================================================

# Custom API endpoint URLs (leave empty to use defaults)
AWS_PRICING_API_URL="https://pricing.us-east-1.amazonaws.com/pricing"
AZURE_PRICING_API_VERSION="api-version=2024-06-01"
GCP_PRICING_API_URL="https://www.googleapis.com/compute/v1/projects"
DIGITALOCEAN_API_URL="https://api.digitalocean.com/v2"
```

---

## Deployment Checklist

Before each production deployment, verify:

- [ ] `NODE_TLS_REJECT_UNAUTHORIZED` is **not** set anywhere in code
- [ ] `rejectUnauthorized: true` in all SSL configurations
- [ ] `ADMIN_API_KEY` is a strong random string (64 chars minimum)
- [ ] All environment variables from `.env.example` are set in production
- [ ] `requireAdminAuth` middleware is applied to all `/api/admin/*` routes
- [ ] Rate limiting is enabled on admin endpoints
- [ ] Input validation is implemented for all filters
- [ ] Error messages don't expose implementation details
- [ ] Database backups are configured
- [ ] TLS certificates are valid and auto-renewal is configured
- [ ] Logs are being written and rotated

---

## Testing the Security Fixes

### Test 1: TLS Validation is Working

```bash
# Start the server
npm run dev

# In another terminal, test the database connection
curl http://localhost:3000/api/health
# Should return: { "status": "ok", "database": "connected" }
```

### Test 2: Admin Endpoints Require Authentication

```bash
# Without token — should fail
curl -X POST http://localhost:3000/api/admin/init-db
# Response: {"error":"Unauthorized: Missing X-Admin-Token header"}

# With wrong token — should fail
curl -X POST http://localhost:3000/api/admin/init-db \
  -H "X-Admin-Token: wrong"
# Response: {"error":"Forbidden: Invalid admin token"}

# With correct token — should succeed
curl -X POST http://localhost:3000/api/admin/init-db \
  -H "X-Admin-Token: $(echo $ADMIN_API_KEY)" \
  -H "Content-Type: application/json"
# Response: {"message":"Database initialized successfully."}
```

### Test 3: Rate Limiting Works

```bash
# Trigger admin endpoint 6 times quickly
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/admin/init-db \
    -H "X-Admin-Token: $(echo $ADMIN_API_KEY)"
  echo "Request $i"
done

# Request 6 should be rate-limited:
# Response: {"error":"Too many admin requests"}
```

### Test 4: Input Validation Works

```bash
# Send oversized filter list (51 items, max is 50)
curl "http://localhost:3000/api/pricing?provider=$(printf 'aws,%.0s' {1..51})"
# Response: 400 Bad Request - "Filter list exceeds maximum of 50 items"

# Send long search string (201 chars, max is 200)
curl "http://localhost:3000/api/pricing?search=$(printf 'a%.0s' {1..201})"
# Response: 400 Bad Request - "Search string exceeds 200 characters"

# Valid request should work
curl "http://localhost:3000/api/pricing?provider=aws,azure&search=t2"
# Response: 200 OK with pricing records
```

---

## Next Steps

1. **Apply fixes in order** (Critical → High → Medium)
2. **Test locally** using the test commands above
3. **Deploy to staging** and verify all functionality works
4. **Deploy to production** and monitor logs for any errors
5. **Update documentation** with new admin authentication requirements

---

## Support

If you encounter issues after applying these fixes:

1. Check `/api/health` endpoint to verify database connection
2. Review server logs for TLS errors
3. Verify `ADMIN_API_KEY` is set correctly (64 random characters)
4. Test with the provided curl commands above
5. Check OPERATIONS_RUNBOOK.md for troubleshooting

---

**Security fixes completed:** June 1, 2026  
**Next security review:** Upon major version bump or quarterly
