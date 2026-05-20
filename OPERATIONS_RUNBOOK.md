# Compare Cloud Costs: Operations Runbook

**Purpose**: Quick reference guide for deploying, monitoring, troubleshooting, and maintaining the Compare Cloud Costs application in production.

**Audience**: DevOps, Backend, and on-call engineers

**Last Updated**: 2026-05-20

---

## 1. Prerequisites & Access

### Required Access
- [ ] GitHub repository (`rodrigo-orzari/comparecloudcosts` or similar)
- [ ] DigitalOcean account with App Platform access
- [ ] PostgreSQL database connection credentials
- [ ] SMTP server credentials (for email alerts)
- [ ] AWS/Azure/GCP/Oracle API keys (optional, for live pricing fetch)
- [ ] DigitalOcean API token (optional, for live DigitalOcean pricing)

### Local Development Prerequisites
```bash
# Node.js 18+
node --version  # v18.0.0 or higher

# npm 9+
npm --version   # v9.0.0 or higher

# Optional: PostgreSQL client tools (for direct DB access)
which psql      # /usr/local/bin/psql (or similar)
```

---

## 2. Local Development Setup

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/[org]/comparecloudcosts.git
cd comparecloudcosts

# 2. Install dependencies
npm install

# 3. Create .env file from template
cp .env.example .env

# 4. Edit .env with local PostgreSQL connection
vi .env
# DATABASE_URL=postgres://user:password@localhost:5432/ccc_dev
```

### Starting Development Server

```bash
# Start dev server (Vite + Express middleware)
npm run dev

# Expected output:
# VITE v6.2.0  ready in XXX ms
# ➜  Local:   http://localhost:3000/
# ➜  Modules: http://localhost:5173/

# Open browser
open http://localhost:3000
```

**Development Mode Behavior**:
- React Fast Refresh enabled (file changes → instant HMR)
- API routes served from Express middleware
- Database auto-initialized on first request (if `DATABASE_URL` set and DB empty)
- Pricing data auto-fetched on startup if less than 5 records per provider
- Console shows detailed logs for debugging

### Type Checking

```bash
# Run TypeScript compiler (no emit, just check)
npm run lint

# Should output:
# No errors in TypeScript compilation

# If errors, fix them before committing
```

---

## 3. Building for Production

### Build Process

```bash
# Clean previous builds
npm run clean

# Build (Vite frontend + type-check)
npm run build

# Expected output:
# dist/
#   ├── index.html
#   ├── assets/
#   │   ├── index-[hash].js       (~150 KB minified)
#   │   └── index-[hash].css      (~50 KB minified)
#   └── vite.svg
#
# ✓ YYYY files built in XXX ms

# Verify build is valid
ls -la dist/index.html  # Should exist
ls -la dist/assets/     # Should contain .js and .css files
```

### Testing Production Build Locally

```bash
# 1. Set environment to production
export NODE_ENV=production

# 2. Start server (runs compiled Express + serves dist/)
npm run start

# Expected output:
# Mode: Production
# Serving static files from: /path/to/dist
# Server running on http://localhost:3000

# 3. Test API routes
curl http://localhost:3000/api/ping
# {"status":"pong","env":"production","timestamp":"2026-05-20T..."}

# 4. Verify static assets served
curl http://localhost:3000/ | grep -c "script"  # Should find <script> tags

# 5. Test database connectivity
curl http://localhost:3000/api/health | jq .
# {"status":"ok","database":"connected","total_records":...}
```

---

## 4. Deployment to DigitalOcean

### Prerequisites

```bash
# Ensure all changes committed
git status              # Should be clean
git log -1 --oneline   # Verify latest commit

# Run final checks
npm run lint            # No TypeScript errors
npm run build           # Build succeeds
rm -rf dist/            # Clean up for deployment
```

### Deployment Flow

```bash
# Push to main branch (DigitalOcean auto-triggers webhook)
git push origin main

# Monitor deployment in DigitalOcean Console
# 1. Go to DigitalOcean Dashboard → Apps
# 2. Click "comparecloudcosts" app
# 3. Wait for Build & Deploy phase to complete (5-10 minutes)
# 4. Check "Deployment History" tab for status

# Verify deployment successful
curl https://comparecloudcosts.com/api/ping
# {"status":"pong","env":"production"...}
```

### Rollback Procedure (If Deployment Fails)

```bash
# 1. Identify last successful commit
git log --oneline | head -10

# 2. Revert to previous working commit
git revert HEAD --no-edit

# 3. Push revert commit
git push origin main

# 4. Monitor deployment (will auto-trigger)
# DigitalOcean re-deploys previous version

# 5. Investigate root cause of failure
git diff HEAD~1 HEAD  # See what caused issue
git log -p -1        # Review full commit diff
```

---

## 5. Environment Configuration

### Environment Variables (DigitalOcean Secrets)

**Required** (must be set for production):

```bash
# PostgreSQL Database Connection
DATABASE_URL=postgres://user:password@host:5432/ccc_prod

# Example:
# DATABASE_URL=postgres://cccuser:secure_password@db.ondigitalocean.com:25060/defaultdb?sslmode=require
```

**Optional** (enhance functionality):

```bash
# Node environment (auto-set by DigitalOcean: 'production')
NODE_ENV=production

# Port (auto-set by DigitalOcean: 3000)
PORT=3000

# Application URL (for self-referential links, OAuth callbacks)
APP_URL=https://comparecloudcosts.com

# Email Configuration (for price drift & staleness alerts)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@comparecloudcosts.com
SMTP_PASS=secure_password
SMTP_TO=ops@comparecloudcosts.com

# API Keys (for live pricing fetch)
DIGITALOCEAN_API_TOKEN=dop_v1_...
# AWS/Azure/GCP credentials are usually sourced from environment (IAM roles)
```

### Setting Secrets in DigitalOcean

```bash
# 1. DigitalOcean Dashboard → Apps → comparecloudcosts
# 2. Settings tab → Environment Variables
# 3. Add new variable:
#    Key: DATABASE_URL
#    Value: postgres://...
#    Scope: Runtime only
# 4. Click "Save" → triggers redeploy

# Verify via App logs
# Deployment logs should show "Environment configured" message
```

---

## 6. Database Management

### Connecting to Production Database

```bash
# Using psql (PostgreSQL client)
psql "postgres://user:password@host:5432/ccc_prod"

# Or with DigitalOcean managed connection
psql $DATABASE_URL

# Common commands:
\dt                              # List all tables
\d pricing_records              # Show schema for pricing_records
SELECT COUNT(*) FROM pricing_records;  # Row count
SELECT DISTINCT geography FROM pricing_records;  # Unique values
```

### Database Schema Initialization

**Automatic**: Runs on app startup via `initDb()` in `server.ts`

**Manual** (if needed):

```bash
# Trigger via admin API endpoint
curl -X POST https://comparecloudcosts.com/api/admin/init-db

# Response:
# {"message":"Database initialized successfully."}

# Or manually run schema.sql
psql $DATABASE_URL < src/db/schema.sql
```

### Database Backup

```bash
# DigitalOcean Managed Database handles daily automatic backups
# Accessible via: DigitalOcean Console → Databases → [DB] → Backups

# Manual backup (if needed)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql $DATABASE_URL < backup_20260520_120000.sql
```

---

## 7. Pricing Data Management

### Manual Pricing Fetch

**Trigger via admin endpoint**:

```bash
# Fetch all data (compute + database + serverless)
curl -X POST https://comparecloudcosts.com/api/admin/fetch-pricing

# Fetch only compute instances
curl -X POST "https://comparecloudcosts.com/api/admin/fetch-pricing?type=compute"

# Fetch only database pricing
curl -X POST "https://comparecloudcosts.com/api/admin/fetch-pricing?type=database"

# Response:
# {
#   "message": "Pipeline run completed and data migrated",
#   "results": [
#     {
#       "provider": "AWS",
#       "adapter": "AWSAdapter",
#       "pipeline": "compute",
#       "recordsInserted": 5432,
#       "driftAlerts": [
#         {
#           "provider": "AWS",
#           "service": "EC2",
#           "instanceType": "t3.medium",
#           "oldPrice": 0.0416,
#           "newPrice": 0.0500,
#           "pctChange": 20.2
#         }
#       ]
#     },
#     ...
#   ]
# }
```

**Monitor execution**:
- Check DigitalOcean app logs during fetch
- Watch for "Pipeline fetch completed" message
- Review drift alerts in response

### Scheduled Pricing Update (Cron)

```
Runs: Every Sunday at 00:00 UTC
Job: PricingPipeline + DatabasePricingPipeline + ServerlessPricingPipeline

If driftAlerts detected (>20% price change):
  → sendPriceDriftEmail() to ops team

If static_config data >7 days old:
  → sendStalenessEmail() reminder
```

**View cron logs**:
```bash
# In DigitalOcean App Logs, search for:
grep "🕒 Starting scheduled pricing" /var/log/...
grep "✅ Scheduled pipeline completed" /var/log/...
```

---

## 8. Monitoring & Alerting

### Health Checks

**Application Health** (Automatic, every 30 seconds):

```bash
curl -I https://comparecloudcosts.com/api/health

# HTTP 200 OK → Healthy
# HTTP 500 → Unhealthy (DigitalOcean auto-restarts container)
```

**Manual Health Verification**:

```bash
# API is responsive
curl https://comparecloudcosts.com/api/ping

# Database is connected
curl https://comparecloudcosts.com/api/health | jq .database

# Pricing data is present
curl https://comparecloudcosts.com/api/pricing?provider=aws | jq 'length'
# Should return > 100
```

### Monitoring Dashboards (DigitalOcean)

**Metrics Tab**:
- CPU Usage (should be <20% at rest)
- Memory Usage (should be <200 MB)
- Response Time (should be <500 ms median)
- Request Count (varies by traffic)

**Alerts** (Configure if not already set):
- ✅ CPU > 80% for 5 minutes
- ✅ Memory > 512 MB for 5 minutes
- ✅ Error rate > 5% for 5 minutes
- ✅ Response time > 1000 ms (p95) for 5 minutes

### Email Alerts

**Drift Alerts**: Sent automatically when prices change >20%
- Subject: "Price Drift Detected"
- Recipients: `$SMTP_TO` env var
- Content: List of affected instances with old/new prices

**Staleness Alerts**: Sent if static configs haven't been updated >7 days
- Subject: "Pricing Data Staleness Warning"
- Content: List of providers/services and days since last update

---

## 9. Troubleshooting Guide

### Issue: "Database connection failed"

**Symptom**: 
```
GET /api/health returns {"status":"error","message":"...connect ECONNREFUSED..."}
```

**Diagnosis**:
```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# Test connection manually
psql $DATABASE_URL -c "SELECT 1;"

# Check DigitalOcean database is running
# Dashboard → Databases → [DB name] → Status should be "Active"
```

**Resolution**:
1. Verify `DATABASE_URL` in DigitalOcean Secrets
2. Ensure database firewall allows app IP (usually auto-configured)
3. Restart app: DigitalOcean Dashboard → Apps → comparecloudcosts → "Restart"

---

### Issue: "Pricing data is stale (no updates in X days)"

**Symptom**:
- Email alert: "Pricing Data Staleness Warning"
- API returns old data with `data_source: 'static_config'` timestamp from weeks ago

**Diagnosis**:
```bash
# Check when last pricing fetch occurred
curl https://comparecloudcosts.com/api/health | jq .last_updated

# Check which providers have stale data
psql $DATABASE_URL -c "
  SELECT p.slug, MAX(pr.updated_at) AS last_updated
  FROM pricing_records pr
  JOIN services s ON pr.service_id = s.id
  JOIN providers p ON s.provider_id = p.id
  GROUP BY p.slug
  ORDER BY last_updated ASC;
"
```

**Resolution**:
1. Manually trigger pricing fetch:
   ```bash
   curl -X POST https://comparecloudcosts.com/api/admin/fetch-pricing
   ```

2. Check logs for errors:
   ```
   DigitalOcean Logs → Search "Pipeline" or "Error"
   ```

3. If live APIs are down, static configs will be used (expected behavior)

---

### Issue: "High CPU/Memory usage"

**Symptom**:
- DigitalOcean Metrics show CPU >60%, Memory >300 MB
- User complaints of slow page load

**Diagnosis**:
```bash
# Check if large query is running
psql $DATABASE_URL -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 5;"

# Check app logs for slow queries
# Dashboard → Logs → Search "slow query"
```

**Resolution**:
1. If recent deploy, rollback:
   ```bash
   git revert HEAD --no-edit && git push origin main
   ```

2. If pricing pipeline running, wait for completion (~5-10 minutes)

3. Otherwise, restart app:
   ```
   DigitalOcean Dashboard → Apps → Restart App
   ```

4. Check for missing database indexes and add if needed:
   ```sql
   CREATE INDEX idx_pricing_geography ON pricing_records(geography);
   CREATE INDEX idx_pricing_price ON pricing_records(price_per_unit);
   CREATE INDEX idx_services_category ON services(category);
   ```

---

### Issue: "API returns 404 Not Found"

**Symptom**:
```
curl https://comparecloudcosts.com/api/pricing
404 Not Found
```

**Diagnosis**:
```bash
# Check app is running
curl https://comparecloudcosts.com/api/ping  # Should return 200

# Check logs for routing errors
# Dashboard → Logs → Search "404"
```

**Resolution**:
1. Verify endpoint URL (check against server.ts routes)
2. Ensure correct HTTP method (GET vs POST)
3. Restart app if routes not recognized

---

### Issue: "Email alerts not being sent"

**Symptom**:
- Price drift detected but no email received
- Console log shows: "Failed to send price drift email"

**Diagnosis**:
```bash
# Check SMTP credentials in DigitalOcean Secrets
echo $SMTP_HOST
echo $SMTP_PORT
echo $SMTP_USER
echo $SMTP_TO

# Verify app logs for errors
# Dashboard → Logs → Search "Failed to send"
```

**Resolution**:
1. Verify `SMTP_*` environment variables are set
2. Test email server manually:
   ```bash
   telnet $SMTP_HOST $SMTP_PORT  # Should connect
   ```
3. Check credentials with email provider (Gmail, SendGrid, etc.)
4. Restart app for env changes to take effect

---

## 10. Performance Tuning

### Database Query Optimization

**Slow Query Identification**:

```bash
# Enable slow query logging
psql $DATABASE_URL -c "ALTER SYSTEM SET log_min_duration_statement = 1000;"
# (logs queries taking >1000ms)

# View current slow queries
psql $DATABASE_URL -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC;"
```

**Common Optimizations**:

1. **Add indexes** on frequently filtered columns:
   ```sql
   CREATE INDEX idx_pricing_provider_geography 
   ON pricing_records(service_id, geography);
   
   CREATE INDEX idx_pricing_price_range
   ON pricing_records(price_per_unit);
   
   CREATE INDEX idx_pricing_updated_at
   ON pricing_records(updated_at);
   ```

2. **ANALYZE table** to update statistics:
   ```sql
   ANALYZE pricing_records;
   ```

3. **Paginate large result sets** (add LIMIT/OFFSET):
   ```sql
   SELECT ... LIMIT 100 OFFSET 0;
   SELECT ... LIMIT 100 OFFSET 100;
   ```

### Frontend Performance

**Measure bundle size**:
```bash
npm run build

# Output: Check "dist/" folder size
du -sh dist/
# Should be <1 MB

# Check individual asset sizes
ls -lh dist/assets/
# index-*.js should be <250 KB
# index-*.css should be <100 KB
```

**Enable compression**:
- DigitalOcean auto-gzips responses (already enabled)
- Verify: `curl -I https://... | grep Content-Encoding` → gzip

---

## 11. Disaster Recovery

### Data Loss Scenario

**If database is corrupted or deleted**:

1. **Restore from backup**:
   ```bash
   # DigitalOcean Databases → Backups tab
   # Click "Restore" on a recent backup
   # (Creates new database instance)
   ```

2. **Update DATABASE_URL** to point to restored database:
   ```
   DigitalOcean Dashboard → Apps → Environment Variables
   Update DATABASE_URL → Save (triggers redeploy)
   ```

3. **Verify data restored**:
   ```bash
   curl https://comparecloudcosts.com/api/health | jq .total_records
   ```

### Application Outage Scenario

**If app crashes or becomes unresponsive**:

1. **Check deployment logs**:
   ```
   DigitalOcean Dashboard → Apps → Deployment History
   Review latest deployment for errors
   ```

2. **Restart app**:
   ```
   DigitalOcean Dashboard → Apps → "Restart App" button
   (Triggers container restart, takes ~1-2 minutes)
   ```

3. **If restart fails**, rollback code:
   ```bash
   git revert HEAD --no-edit
   git push origin main
   (DigitalOcean auto-redeploys)
   ```

4. **Contact support** if issue persists:
   - DigitalOcean Support: dashboard.digitalocean.com/support
   - Provide: Deployment logs, error messages, timing of incident

---

## 12. Security Hardening Checklist

- [ ] `DATABASE_URL` is a secret (not in code or logs)
- [ ] SMTP credentials are secrets (not in code)
- [ ] API keys (AWS/Azure/GCP) are secrets or use IAM roles
- [ ] SSL/TLS enabled (DigitalOcean auto-provides)
- [ ] CORS configured appropriately (currently open, consider restricting)
- [ ] Rate limiting implemented on public APIs
- [ ] No sensitive data logged to console
- [ ] Input validation on all API endpoints
- [ ] SQL injection prevention: all queries use parameterized statements
- [ ] Secrets rotated regularly (quarterly recommended)
- [ ] Database backups encrypted and tested for restore
- [ ] App logs retained (at least 30 days)

---

## 13. Change Management Procedure

### Process for Code Changes

1. **Branch & Develop**:
   ```bash
   git checkout -b feature/my-feature
   npm install  # if deps changed
   npm run dev  # test locally
   npm run lint # type-check
   ```

2. **Commit & Push**:
   ```bash
   git add .
   git commit -m "feat: descriptive message"
   git push origin feature/my-feature
   ```

3. **Create Pull Request**:
   - GitHub: Open PR, request review
   - Add description: what changed, why, testing done

4. **Code Review**:
   - At least one approval required
   - Address feedback and re-request review

5. **Merge**:
   ```bash
   git merge feature/my-feature
   git push origin main
   # DigitalOcean auto-triggers deployment
   ```

6. **Monitor Deployment**:
   ```bash
   # Watch DigitalOcean logs for errors
   # Test critical paths: /api/health, /api/pricing
   # Monitor metrics: CPU, Memory, Response Time
   ```

### Deployment Approvals

| Change Type | Approval | Risk | Timing |
|------------|----------|------|--------|
| Bug fix | 1 reviewer | Low | Anytime |
| Feature | 2 reviewers | Medium | Agreed window |
| Database schema change | 2 reviewers + DBA | High | Planned maintenance |
| Config change | 1 reviewer | Low | Anytime |
| Dependency upgrade | 1 reviewer | Medium | Agreed window |

---

## 14. Quick Reference: Common Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server (localhost:3000)
npm run lint            # Type-check code
npm run build           # Build for production

# Production
npm run start           # Start production server
npm run ingest          # Trigger pricing pipeline (manual)

# Database
psql $DATABASE_URL     # Connect to database
pg_dump $DATABASE_URL > backup.sql  # Backup database

# Curl examples
curl https://comparecloudcosts.com/api/ping
curl https://comparecloudcosts.com/api/health
curl "https://comparecloudcosts.com/api/pricing?provider=aws"
curl -X POST https://comparecloudcosts.com/api/admin/fetch-pricing

# Git
git status             # Check uncommitted changes
git log -1 --oneline   # Show last commit
git diff HEAD~1        # See what changed in current commit
git revert HEAD        # Undo last commit (safe way)
git push origin main   # Deploy (DigitalOcean auto-triggers)
```

---

## 15. Contact & Escalation

**Primary Contact**: Rodrigo Orzari (rodrigo.orzari@outlook.com)

**On-Call Rotation**:
- Check: [Oncall schedule / Pagerduty / etc.]

**Escalation Path**:
1. Check logs for obvious errors
2. Restart app (often fixes transient issues)
3. Contact primary maintainer
4. Contact DigitalOcean support for infrastructure issues

**Support Channels**:
- Email: hello@comparecloudcosts.com (user support)
- GitHub Issues: Feature requests, bug reports
- Slack: [Channel name] (internal team)

---

**Document Revision**: v1.0  
**Last Updated**: 2026-05-20  
**Next Review**: 2026-08-20 (quarterly)
