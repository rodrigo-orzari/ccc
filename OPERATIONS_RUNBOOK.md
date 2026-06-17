# CCC Operations Runbook

## First Deployment (DigitalOcean App Platform)

### Step 1 — Create the app

1. Fork this repository
2. Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps) → **Create App**
3. Connect your fork
4. Set **Build Command** → `npm run build`
5. Set **Run Command** → `npm run start`
6. Add a **Dev Database** component (Postgres 14+) or attach an existing managed cluster

### Step 2 — Environment variables

Set the following in your app's **Settings → App-Level Environment Variables**:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Provided automatically if you attach a DO Managed DB |
| `DATABASE_CA_CERT` | Base64-encoded CA certificate (see below) |
| `ADMIN_API_KEY` | Generate with `openssl rand -hex 32` |
| `NODE_ENV` | `production` |
| `APP_URL` | Your app's domain (e.g. `https://comparecloudcosts.com`) |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins for CORS (set to your domain) |
| `SMTP_HOST` | (Optional) Email server host for price drift alerts |
| `SMTP_PORT` | (Optional) Email server port |
| `SMTP_USER` | (Optional) Email server username |
| `SMTP_PASS` | (Optional) Email server password |
| `ALERT_EMAIL_TO` | (Optional) Where price drift alerts should be sent |

### Step 3 — Get the CA certificate (DigitalOcean Managed DB)

1. Go to your database cluster → **Connection Details** tab
2. Scroll to **CA Certificate** → click **Download**
3. Encode it to base64:
   ```bash
   cat /path/to/ca-certificate.crt | base64 | tr -d '\n'
   ```
4. Paste the output as the value of `DATABASE_CA_CERT`

### Step 4 — Initialize the schema

After your first successful deploy:

```bash
curl -X POST https://your-app.ondigitalocean.app/api/admin/init-db \
  -H "X-Admin-Token: $ADMIN_API_KEY"
```

This creates the tables (`providers`, `regions`, `services`, `pricing_records`) and applies any pending migrations. It is **idempotent** — safe to re-run.

### Step 5 — Populate pricing data

```bash
curl -X POST "https://your-app.ondigitalocean.app/api/admin/fetch-pricing?type=all" \
  -H "X-Admin-Token: $ADMIN_API_KEY"
```

This triggers all 9 pricing pipelines (VM, Database, Serverless, Containers, Networking, Data Analytics, AI, Storage, App Hosting). Expect 3–15 minutes. You can check progress via:

```bash
curl https://your-app.ondigitalocean.app/api/status
curl https://your-app.ondigitalocean.app/api/health
```

### Step 6 — (Optional) Run the background worker

The cron scheduler re-runs the VM pipeline every Sunday at midnight UTC:

```bash
npm run worker
```

On DigitalOcean App Platform, add a **Worker** component pointing to `npm run worker` to keep it running. For full pipeline refreshes, use the admin endpoint instead.

---

## Database TLS/SSL Connection Issues

### Problem: "certificate verify failed" or SSL handshake errors

**Root Cause:** Your PostgreSQL database requires certificate validation but no CA certificate was provided, or the certificate is invalid.

### Solution

1. **Obtain your database CA certificate:**
   ```bash
   # DigitalOcean: Download from DB cluster → Connection Details → CA Certificate
   # AWS RDS: wget https://truststore.amazonaws.com/global/global-bundle.pem
   # Azure Database for PostgreSQL: wget https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt
   ```

2. **Encode the certificate to base64:**
   ```bash
   cat /path/to/certificate.pem | base64 | tr -d '\n'
   ```

3. **Set the environment variable:**
   ```bash
   export DATABASE_CA_CERT="[paste-entire-base64-string-here]"
   ```

4. **Verify the connection:**
   ```bash
   npm run dev
   # Watch for: "Database connection established" in logs
   ```

### Debugging

```bash
# Detailed TLS logging
NODE_DEBUG=tls npm run dev

# Test raw connection
psql "$DATABASE_URL" -c "SELECT version();"

# Verify certificate expiration
openssl x509 -in certificate.pem -noout -dates
```

---

## Admin API Reference

All `/api/admin/*` endpoints require the `X-Admin-Token` header matching `ADMIN_API_KEY`.

| Endpoint | Description |
|---|---|
| `POST /api/admin/init-db` | Run schema migrations (idempotent) |
| `POST /api/admin/fetch-pricing?type=all` | Trigger all pricing pipelines |
| `POST /api/admin/fetch-pricing?type=compute` | VM / compute pipeline only |
| `POST /api/admin/fetch-pricing?type=database` | Database pipeline only |
| `POST /api/admin/fetch-pricing?type=serverless` | Serverless pipeline only |
| `POST /api/admin/fetch-pricing?type=containers` | Containers pipeline only |
| `POST /api/admin/fetch-pricing?type=networking` | Networking pipeline only |
| `POST /api/admin/fetch-pricing?type=data-analytics` | Data Analytics pipeline only |
| `POST /api/admin/fetch-pricing?type=ai` | AI pipeline only |
| `POST /api/admin/fetch-pricing?type=storage` | Storage pipeline only |

```bash
# Usage example — always pass token as an environment variable reference
curl -X POST "https://your-app.ondigitalocean.app/api/admin/fetch-pricing?type=all" \
  -H "X-Admin-Token: $ADMIN_API_KEY"
```

### Generating a Secure Admin API Key

```bash
openssl rand -hex 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Token Security

Tokens are compared using constant-time comparison to prevent timing attacks (see `src/app/api/admin/fetch-pricing/route.ts`).

---

## Database Schema Migrations

Schema migrations run automatically when you call `POST /api/admin/init-db`. The migration runner is in `src/lib/api-utils.ts` → `initDb()`.

Migrations use `ALTER TABLE … ADD COLUMN IF NOT EXISTS` — you **never need to drop and recreate the database**. Adding a new column:

1. Add the `ALTER TABLE` statement to `initDb()` in `src/lib/api-utils.ts`
2. Add the column to `src/db/schema.sql` for documentation / fresh installs
3. Deploy and call `POST /api/admin/init-db`

Current custom columns beyond the base schema:

| Column | Table | Purpose |
|---|---|---|
| `previous_price_per_unit` | `pricing_records` | Stores the price from the prior ingestion run for trend indicators (▲/▼/●) |

---

## Price Change Trend Indicators

Each pricing record shows a trend arrow (▲/▼/●) comparing the current price to the previous ingestion run.

**How it works:**
1. Before the DELETE+INSERT cycle, `saveRecords()` reads all existing prices into `oldPriceMap`
2. On INSERT, each new row gets `previous_price_per_unit = oldPriceMap.get(instanceType)`
3. The UI reads both columns and renders the indicator

**Important:** Two consecutive ingests are required before arrows appear:
- First ingest: `previous_price_per_unit = NULL` → all ● (grey)
- Second ingest: `previous_price_per_unit` = prices from first ingest → colored arrows

---

## Filter Input Validation

### Valid Product Types (10 total)

| Type key | Category |
|---|---|
| `vm` | Virtual Machines |
| `database` | Databases |
| `serverless` | Serverless |
| `containers` | Containers |
| `networking` | Networking |
| `data-analytics` | Data & Analytics |
| `ai` | AI |
| `storage` | Storage |
| `app-hosting` | App Hosting |
| `workloads` | Workloads (composite estimator) |

### Query Filter Constraints

| Constraint | Value |
|---|---|
| Max items per filter | 50 |
| Max search string length | 200 characters |
| Blocked characters | `;`, `'`, `"`, `\` (SQL injection prevention) |

### Examples

**Valid:**
```
GET /api/pricing?product_type=vm&provider=aws,gcp&region=us-east-1,eu-west-1
GET /api/pricing?product_type=database&search=db.t3.medium
```

**Blocked (returns 400):**
```
GET /api/pricing?product_type=vm&provider=aws;DROP TABLE
GET /api/pricing?search=test' OR '1'='1
```

---

## Common Issues

### "Invalid filter parameters"

1. No filter has more than 50 items
2. Search strings are under 200 characters
3. Filter values do not contain `;`, `'`, `"`, or `\`
4. `product_type` is one of the 10 valid values listed above

### Admin endpoints return 401

1. `X-Admin-Token` header is present in the request
2. Token value matches `ADMIN_API_KEY` exactly (no surrounding quotes)

### Database connection hangs

1. `DATABASE_URL` is correct
2. Firewall allows connections to the database host
3. Database is running and accessible
4. If using a CA certificate: it is valid, not expired, and fully base64-encoded (no line breaks)

### All prices show ● grey arrows after ingest

Expected behavior on first run — `previous_price_per_unit` is NULL until a second ingest runs. Run the pipeline a second time to populate the comparison baseline.

### Pricing data is missing for a product category

Check pipeline status:
```bash
curl https://your-app.ondigitalocean.app/api/status
```

Re-trigger the specific pipeline:
```bash
curl -X POST "https://your-app.ondigitalocean.app/api/admin/fetch-pricing?type=ai" \
  -H "X-Admin-Token: $ADMIN_API_KEY"
```

---

## Logging

| Log message | Meaning |
|---|---|
| `Database connection established` | PostgreSQL is connected |
| `[Pipeline] Saved N records for provider X` | Successful ingest |
| `Certificate verification failed` | CA certificate is missing or invalid |
| `ECONNREFUSED` | Database is not reachable |
| `Filter validation error` | Input validation caught a blocked query |
| `Price drift detected: X changed by Y%` | Triggers email alert if drift > 20% |

---

## Deployment Checklist

### Before going to production

- [ ] `DATABASE_URL` points to production database
- [ ] `DATABASE_CA_CERT` is set and valid (if your DB requires TLS)
- [ ] `ADMIN_API_KEY` is a secure random string (`openssl rand -hex 32`)
- [ ] `NODE_ENV=production`
- [ ] `APP_URL` points to your domain
- [ ] `ALLOWED_ORIGINS` is set (do NOT leave empty in production)
- [ ] SMTP credentials are configured if you want price drift email alerts
- [ ] All secrets are in your platform's secrets manager — NOT in `.env` files

### Files / patterns never to commit

- `.env`
- Any file containing a literal `DATABASE_URL` with credentials
- Any file containing a literal `ADMIN_API_KEY` value
- `SMTP_PASS`
- Cloud provider API tokens or service account keys

---

## Security Best Practices

1. **Rotate `ADMIN_API_KEY` quarterly**
2. **Never commit `.env` files** — `.gitignore` covers this but double-check
3. **Use HTTPS in production** — `NODE_TLS_REJECT_UNAUTHORIZED` is never disabled
4. **Set `ALLOWED_ORIGINS`** in production to prevent CSRF
5. **Review database logs** periodically for suspicious queries
6. **Keep dependencies updated** — run `npm audit fix` after dependency updates
7. **See `SECURITY_AUDIT.md` and `SECURITY_FIXES.md`** before touching auth or DB logic
