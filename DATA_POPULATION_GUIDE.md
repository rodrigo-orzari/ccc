# Data Population & Troubleshooting Guide

This guide walks you through populating the Compare Cloud Costs database with pricing data from all cloud providers.

---

## Step 1: Verify Database Connection

### Check if PostgreSQL is Running

```bash
# Test your DATABASE_URL connection
psql "YOUR_DATABASE_URL" -c "SELECT version();"
```

Expected output:
```
 PostgreSQL 14.x (DigitalOcean Managed Database vX.X)
```

If this fails:
- Verify DATABASE_URL in `.env` is correct
- Check that your PostgreSQL host is accessible
- If using DigitalOcean, verify firewall allows your IP
- If using a CA certificate, ensure DATABASE_CA_CERT is base64-encoded

### Verify Your .env File

```bash
# Make sure you have a .env file in the root directory
ls -la .env

# Check that DATABASE_URL and ADMIN_API_KEY are set
grep -E "DATABASE_URL|ADMIN_API_KEY" .env
```

### Grant Database Permissions (One-Time Setup)

If you're using a managed database service (DigitalOcean, AWS RDS, etc.) with separate admin and app users, you need to grant permissions **once**.

Connect as the **admin user** (e.g., `doadmin` on DigitalOcean):

```bash
psql "postgresql://doadmin:ADMIN_PASSWORD@your-host:5432/ccc?sslmode=require"
```

Then run these SQL commands:

```sql
-- Grant schema permissions
GRANT USAGE ON SCHEMA public TO "ccc-db";
GRANT CREATE ON SCHEMA public TO "ccc-db";

-- Transfer ownership of existing tables
ALTER TABLE providers OWNER TO "ccc-db";
ALTER TABLE regions OWNER TO "ccc-db";
ALTER TABLE pricing_records OWNER TO "ccc-db";

-- Transfer ownership of sequences
ALTER SEQUENCE providers_id_seq OWNER TO "ccc-db";
ALTER SEQUENCE regions_id_seq OWNER TO "ccc-db";
ALTER SEQUENCE pricing_records_id_seq OWNER TO "ccc-db";

-- Set default permissions for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "ccc-db";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "ccc-db";
```

Exit with `\q`. **These changes are permanent and only need to be done once.**

---

## Step 2: Initialize the Database Schema

### Option A: Via HTTP API (Recommended for Testing)

```bash
# Start the dev server first (in another terminal)
npm run dev

# Then call the admin endpoint (requires ADMIN_API_KEY)
curl -X POST http://localhost:3000/api/admin/init-db \
  -H "X-Admin-Token: YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "message": "Database initialization complete",
  "timestamp": "2026-06-01T12:34:56Z"
}
```

### Option B: Via CLI Command

```bash
# From project root
NODE_ENV=development npx tsx src/services/ingest.ts --init
```

### Verify Schema Was Created

```bash
# Connect to your database and check tables exist
psql "YOUR_DATABASE_URL" -c "\dt"
```

Expected tables:
```
            List of relations
 Schema |       Name       | Type  | Owner
--------+------------------+-------+-------
 public | pricing_records  | table | user
 public | providers        | table | user
 public | regions          | table | user
 public | services         | table | user
```

---

## Step 3: Fetch Pricing Data for All Categories

### Option A: Via HTTP API (Easiest)

Start the dev server (if not already running):

```bash
npm run dev
```

Then trigger each pipeline:

#### 1. Virtual Machines (Compute)

```bash
curl -X POST http://localhost:3000/api/admin/fetch-pricing \
  -H "X-Admin-Token: YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"pipelineType": "vm"}'
```

Expected: Fetches pricing from AWS EC2, Azure VMs, GCP Compute Engine, Oracle Compute, DigitalOcean Droplets.

#### 2. Databases

```bash
curl -X POST http://localhost:3000/api/admin/fetch-pricing \
  -H "X-Admin-Token: YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"pipelineType": "database"}'
```

Expected: Fetches pricing from RDS, Cloud SQL, Azure Database, Oracle DB, DigitalOcean Databases.

#### 3. Serverless (Compute)

```bash
curl -X POST http://localhost:3000/api/admin/fetch-pricing \
  -H "X-Admin-Token: YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"pipelineType": "serverless"}'
```

Expected: Fetches Lambda, Cloud Functions, Azure Functions pricing.

#### 4. All Pipelines (Fetch Everything)

```bash
curl -X POST http://localhost:3000/api/admin/fetch-pricing \
  -H "X-Admin-Token: YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"pipelineType": "all"}'
```

Watch the logs for progress:
```
✅ VM Pricing Pipeline started
✅ Fetched AWS EC2 pricing (n instances)
✅ Fetched Azure VM pricing (n instances)
...
✅ Database Pricing Pipeline started
...
✅ Serverless Pricing Pipeline started
...
```

### Option B: Via CLI Command (Direct)

```bash
# Fetch all pipelines at once
NODE_ENV=development npx tsx src/services/ingest.ts

# Or fetch specific pipelines
NODE_ENV=development npx tsx src/services/ingest.ts --vm
NODE_ENV=development npx tsx src/services/ingest.ts --database
NODE_ENV=development npx tsx src/services/ingest.ts --serverless
```

---

## Step 4: Verify Data Was Populated

### Check Row Counts by Category

```bash
psql "YOUR_DATABASE_URL" << EOF
SELECT 
  (SELECT COUNT(*) FROM pricing_records WHERE service LIKE '%EC2%' OR service LIKE '%VM%' OR service LIKE '%Droplet%') as vm_count,
  (SELECT COUNT(*) FROM pricing_records WHERE service LIKE '%RDS%' OR service LIKE '%Cloud SQL%' OR service LIKE '%Database%') as db_count,
  (SELECT COUNT(*) FROM pricing_records WHERE service LIKE '%Lambda%' OR service LIKE '%Functions%') as serverless_count,
  (SELECT COUNT(*) FROM pricing_records) as total_count;
EOF
```

Expected output:
```
 vm_count | db_count | serverless_count | total_count
----------+----------+------------------+-------------
    2500+ |   800+   |      300+        |    3600+
```

### Check Providers

```bash
psql "YOUR_DATABASE_URL" -c "SELECT id, name FROM providers ORDER BY name;"
```

Expected:
```
      id       |    name
---------------+------------
 aws           | AWS
 azure         | Azure
 digitalocean  | DigitalOcean
 gcp           | Google Cloud
 oracle        | Oracle
```

### Check Regions

```bash
psql "YOUR_DATABASE_URL" -c "SELECT DISTINCT geography FROM pricing_records LIMIT 10;"
```

Expected:
```
       geography
--------------------
 N. America
 S. America
 W. Europe
 N. Europe
 Asia Pacific
 Australia
```

### Check Sample Records

```bash
psql "YOUR_DATABASE_URL" -c "SELECT provider, instance_type, vcpus, memory_gb, price_per_unit FROM pricing_records LIMIT 5;"
```

Expected:
```
 provider |    instance_type     | vcpus | memory_gb | price_per_unit
----------+----------------------+-------+-----------+----------------
 aws      | t3.small             |     2 |         2 | 0.0234
 azure    | Standard_B1s         |     1 |      1.75 | 0.012
 gcp      | e2-small             |     2 |         2 | 0.0235
 ...
```

---

## Step 5: View Data in the Dashboard

### Local Development

```bash
npm run dev
```

Open http://localhost:3000

Select filters:
- **Providers**: Check AWS, Azure, Google, Oracle, DigitalOcean
- **Geography**: Choose "N. America" or "W. Europe"
- **Category**: Select "General purpose" or "Compute optimized"

You should now see pricing rows in the table.

---

## Troubleshooting

### No Data Appearing in Dashboard

1. **Check if schema exists**
   ```bash
   psql "YOUR_DATABASE_URL" -c "\dt"
   ```
   If no tables, run `npm run dev` → `curl /api/admin/init-db`

2. **Check if pricing_records table is empty**
   ```bash
   psql "YOUR_DATABASE_URL" -c "SELECT COUNT(*) FROM pricing_records;"
   ```
   If 0, run the fetch pipelines (Step 3)

3. **Check database logs**
   ```bash
   npm run dev
   # Watch for errors like "Cannot connect to database" or "Certificate verify failed"
   ```

4. **Verify ADMIN_API_KEY is correct**
   ```bash
   # Check your .env file
   grep ADMIN_API_KEY .env
   
   # Use the exact value in your curl commands
   ```

### "Certificate verify failed" Error

This means your database requires TLS but DATABASE_CA_CERT is not set.

```bash
# Obtain your CA certificate (from DigitalOcean, AWS, etc.)
# Convert to base64
cat /path/to/ca-certificate.pem | base64 -w 0

# Add to .env
echo "DATABASE_CA_CERT=\"<paste-base64-string-here>\"" >> .env
```

Then restart: `npm run dev`

### "Connection refused" Error

Database is not reachable.

```bash
# Verify connection string
psql "YOUR_DATABASE_URL" -c "SELECT version();"

# Common issues:
# - Wrong host/port in DATABASE_URL
# - Database is not running
# - Firewall blocks your IP (check DigitalOcean firewall settings)
```

### API Endpoint Returns 401 Unauthorized

ADMIN_API_KEY header is missing or incorrect.

```bash
# Check .env has ADMIN_API_KEY set
grep ADMIN_API_KEY .env

# Verify you're sending the exact value
curl http://localhost:3000/api/admin/init-db \
  -H "X-Admin-Token: $(grep ADMIN_API_KEY .env | cut -d= -f2 | tr -d '\"')"
```

### Fetch Pipeline Runs But No Data Appears

Check server logs for errors:

```bash
npm run dev
# Watch for messages like:
# ❌ AWS adapter failed: Rate limit exceeded
# ❌ GCP adapter failed: Invalid credentials
```

**Common causes:**
- Cloud provider API rate limits (retry after 1 hour)
- API credentials missing or expired
- Network connectivity issues

---

## Full Workflow (Start to Finish)

```bash
# 1. Verify .env is configured
cat .env | grep DATABASE_URL

# 2. Test database connection
psql "YOUR_DATABASE_URL" -c "SELECT version();"

# 3. Start dev server
npm run dev
# (leave this running)

# 4. In another terminal, initialize schema
curl -X POST http://localhost:3000/api/admin/init-db \
  -H "X-Admin-Token: $(grep ADMIN_API_KEY .env | cut -d= -f2 | tr -d '\"')"

# 5. Fetch all pricing data
curl -X POST http://localhost:3000/api/admin/fetch-pricing \
  -H "X-Admin-Token: $(grep ADMIN_API_KEY .env | cut -d= -f2 | tr -d '\"')" \
  -H "Content-Type: application/json" \
  -d '{"pipelineType": "all"}'

# 6. Wait 2-5 minutes (depends on API response times)
# Watch server logs for completion

# 7. Verify data
psql "YOUR_DATABASE_URL" -c "SELECT COUNT(*) FROM pricing_records;"

# 8. Open browser
# http://localhost:3000
# Select filters and view data
```

---

## Performance Notes

**First fetch times:**
- AWS EC2: ~1-2 minutes (2,500+ instances)
- Azure VMs: ~2-3 minutes (1,500+ instances)
- GCP Compute: ~2-3 minutes (1,200+ instances)
- Oracle Compute: ~1 minute (400+ instances)
- DigitalOcean: ~30 seconds (static config, no API call)
- Databases: ~1-2 minutes
- Serverless: ~30 seconds

**Total: 8-15 minutes for complete first fetch**

Subsequent fetches (daily cron job) take half the time because only changed records are updated.

---

## Need Help?

If data still doesn't appear:

1. Check server logs: `npm run dev` and look for errors
2. Verify database connection: `psql "YOUR_DATABASE_URL" -c "SELECT COUNT(*) FROM pricing_records;"`
3. Check ADMIN_API_KEY: `grep ADMIN_API_KEY .env`
4. Review [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md) for security setup
5. Read [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) for input validation details
