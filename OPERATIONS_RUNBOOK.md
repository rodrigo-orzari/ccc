# CCC Operations Runbook

## Database TLS/SSL Connection Issues

### Problem: "certificate verify failed" or SSL handshake errors

**Root Cause:** Your PostgreSQL database requires certificate validation but no CA certificate was provided, or the certificate is invalid.

### Solution

1. **Obtain your database CA certificate:**
   ```bash
   # For DigitalOcean Managed Databases:
   # Download from: https://cloud.digitalocean.com/databases
   # Click your database → Connection Details → CA Certificate → Download

   # For AWS RDS:
   wget https://truststore.amazonaws.com/global/global-bundle.pem

   # For Azure Database for PostgreSQL:
   wget https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt

   # For Heroku Postgres:
   # CA certificate is embedded in the connection string
   ```

2. **Encode the certificate to base64:**
   ```bash
   cat /path/to/certificate.pem | base64 -w 0 > cert.b64
   ```

3. **Set the environment variable:**
   ```bash
   # Copy the entire output from cert.b64
   export DATABASE_CA_CERT="[paste-entire-base64-string-here]"
   ```

4. **Verify the connection:**
   ```bash
   npm run dev
   # Watch for: "Database connection established" in logs
   ```

### Debugging

- **Enable detailed TLS logging:**
  ```bash
  NODE_DEBUG=tls npm run dev
  ```

- **Test your connection string:**
  ```bash
  psql "your-connection-string" -c "SELECT version();"
  ```

- **Verify certificate expiration:**
  ```bash
  openssl x509 -in certificate.pem -noout -dates
  ```

---

## Admin API Authentication

### Protecting Admin Endpoints

All `/api/admin/*` endpoints require the `X-Admin-Token` header:

```bash
curl -X POST http://localhost:3000/api/admin/init-db \
  -H "X-Admin-Token: your-admin-api-key"
```

### Generating a Secure Admin API Key

```bash
# Generate a random 64-character hex string
openssl rand -hex 32

# Or use node:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Set in production:**
```bash
export ADMIN_API_KEY="[generated-key]"
```

### Token Comparison

Tokens are compared using constant-time comparison to prevent timing attacks:

```typescript
const isValid =
  adminToken.length === expectedToken.length &&
  Array.from(adminToken).every((char, i) => char === expectedToken[i]);
```

---

## Deployment Checklist

### Before going to production:

- [ ] **DATABASE_URL** is set to your production database
- [ ] **DATABASE_CA_CERT** is set (if your database requires it)
- [ ] **ADMIN_API_KEY** is set to a secure 64-character string
- [ ] **NODE_ENV** is set to `production`
- [ ] **APP_URL** points to your production domain
- [ ] **ALLOWED_ORIGINS** is set (do NOT leave empty in production)
- [ ] SMTP credentials are configured for alerts
- [ ] All secrets are stored in your platform's secrets manager (NOT in `.env` files)

### Environment Variables Never Commit

- `.env` — local development only
- Database credentials (inside DATABASE_URL)
- ADMIN_API_KEY
- SMTP_PASS
- Cloud provider API tokens

---

## Filter Input Validation

### Query Filter Constraints

All `/api/pricing/*?filter=` parameters are validated:

| Constraint | Value |
|-----------|-------|
| Max items per filter | 50 |
| Max search string length | 200 characters |
| Valid product types | `compute`, `database`, `serverless` |
| Blocked characters in filters | `;`, `'`, `"`, `\` (SQL injection prevention) |

### Examples

**Valid:**
```
GET /api/pricing/compute?filter=provider:aws,gcp&filter=region:us-east-1,eu-west-1
GET /api/pricing/compute?search=t3.medium
```

**Blocked (will return 400 Bad Request):**
```
GET /api/pricing/compute?filter=provider:aws;DROP TABLE
GET /api/pricing/compute?filter=provider:aws' OR '1'='1
GET /api/pricing/compute?search=searchterm%20%27%20UNION%20SELECT%20*
```

---

## Common Issues

### Issue: "Invalid filter parameters"

**Check:**
1. No filter has more than 50 items
2. Search strings are under 200 characters
3. Filter values do not contain `;`, `'`, `"`, or `\`
4. Product type is one of: `compute`, `database`, `serverless`

### Issue: Admin endpoints return 401 Unauthorized

**Check:**
1. `X-Admin-Token` header is present in the request
2. Token value matches `ADMIN_API_KEY` environment variable exactly
3. Token is not wrapped in quotes

### Issue: Database connection hangs

**Check:**
1. DATABASE_URL is correct
2. Firewall allows connections to your database host
3. Database is running and accessible
4. If using CA certificate, it is valid and not expired

---

## Logging

Application logs include:

- ✅ `Database connection established` — PostgreSQL is connected
- ✅ `Server running on port 3000` — Express is listening
- ❌ `Certificate verification failed` — CA certificate is missing or invalid
- ❌ `ECONNREFUSED` — Database is not reachable
- ❌ `Filter validation error` — Input validation caught a malicious query

Monitor logs for errors in production.

---

## Security Best Practices

1. **Rotate ADMIN_API_KEY periodically** (recommend quarterly)
2. **Never commit `.env` files** to version control
3. **Use HTTPS in production** (NODE_TLS_REJECT_UNAUTHORIZED is NOT disabled)
4. **Enable CORS restrictions** in production
5. **Review database logs** for suspicious queries
6. **Monitor admin endpoint access** with audit logging
7. **Keep dependencies updated** (`npm audit fix`)
