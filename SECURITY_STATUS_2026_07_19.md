# Security Status Report: Compare Cloud Costs
**Date:** July 19, 2026  
**Audit Scope:** Full codebase scan for critical vulnerabilities  
**Assessment:** ⚠️ **CRITICAL ISSUES REMAIN UNFIXED**

---

## Executive Summary

The CCC application has **partially implemented** the security fixes recommended in `SECURITY_AUDIT.md` (June 2026). Admin endpoint authentication has been properly deployed with constant-time token comparison. However, **a critical TLS validation vulnerability persists across multiple files** that was supposed to be fixed months ago.

### Status Overview
- ✅ **FIXED** — Admin endpoints now require `X-Admin-Token` header with constant-time comparison
- ✅ **FIXED** — Input validation implemented in `buildPricingFilters`
- ✅ **FIXED** — Database connection uses CA certificate validation when available
- ❌ **NOT FIXED** — Multiple files still disable TLS certificate validation
- ⚠️ **PARTIAL** — Scheduler has conditional logic that still allows `rejectUnauthorized: false`

---

## 🔴 CRITICAL: TLS Certificate Validation Disabled (Still Unfixed)

### Files with `rejectUnauthorized: false`

**1. `src/services/ingest.ts` — Line 26**
```typescript
const sql = postgres(dbUrl, { ssl: { rejectUnauthorized: false } });
```
**Impact:** CRITICAL — Used by the CLI ingestion tool. Disables TLS validation for all pricing pipeline API calls.

**2. `src/services/populate_ai.ts` — Line 12**
```typescript
const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });
```
**Impact:** CRITICAL — Standalone AI pricing ingestion tool has disabled TLS validation.

**3. `src/services/populate_containers.ts` — Line 12**
```typescript
const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });
```
**Impact:** CRITICAL — Standalone containers pricing ingestion tool has disabled TLS validation.

**4. `src/workers/scheduler.ts` — Line 31 (Conditional)**
```typescript
rejectUnauthorized: process.env.DATABASE_CA_CERT ? true : (process.env.NODE_ENV === 'production' ? false : false),
```
**Impact:** CRITICAL — Background worker disables TLS in production when no CA cert is provided.

---

## 🟢 VERIFIED SECURE: Admin Authentication

**File:** `src/lib/api-utils.ts` — Lines 8-24  
**Status:** ✅ PROPERLY IMPLEMENTED

```typescript
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
```

**Verification:** ✅ Uses `crypto.timingSafeEqual()` to prevent timing attacks  
**Verification:** ✅ Applied to all admin routes (`init-db`, `fetch-pricing`, `data-quality`)  
**Verification:** ✅ Requires `ADMIN_API_KEY` environment variable

---

## 🟡 HIGH: Remaining Security Gaps

### 1. Production Deployment Risk
- **Risk:** Live deployment at https://comparecloudcosts.com is vulnerable to MITM attacks if no CA certificate is configured
- **Likelihood:** HIGH if `DATABASE_CA_CERT` is not set in DigitalOcean App Platform
- **Impact:** Database credentials exposed, pricing data exfiltrated

### 2. CLI Tool Security
- Ingestion tools (`npm run ingest`, standalone population scripts) bypass TLS validation
- Attack surface: Anyone running these tools on compromised networks
- Mitigated by: These run server-side, not exposed to internet

### 3. Missing API Rate Limiting
- Admin endpoints documented to need rate limiting (SECURITY_FIXES.md lines 237-300)
- No evidence of `express-rate-limit` or equivalent protection in code
- Attack surface: DoS attacks on `/api/admin/fetch-pricing`

---

## Vulnerability Severity Assessment

| Vulnerability | Severity | Status | Impact |
|---|---|---|---|
| TLS disabled in ingest.ts | CRITICAL | ❌ UNFIXED | Pricing API credentials exposed |
| TLS disabled in populate_ai.ts | CRITICAL | ❌ UNFIXED | Database credentials exposed |
| TLS disabled in populate_containers.ts | CRITICAL | ❌ UNFIXED | Database credentials exposed |
| TLS conditional in scheduler.ts | CRITICAL | ❌ UNFIXED | Production MITM if no CA cert |
| Admin endpoints without auth | CRITICAL | ✅ FIXED | Only acceptable after token requirement |
| Missing input validation | HIGH | ✅ FIXED | SQL injection mitigated |
| Missing rate limiting | HIGH | ❌ UNFIXED | DoS attacks possible on admin endpoints |
| Error message disclosure | MEDIUM | ⚠️ PARTIAL | Needs audit |

---

## Immediate Action Items (Priority Order)

### URGENT (Today)
1. **Verify production has CA cert configured**
   ```bash
   # SSH into DigitalOcean App Platform and check:
   echo $DATABASE_CA_CERT | wc -c  # Should be >100 characters (base64 encoded cert)
   ```

2. **Fix all four files with disabled TLS**
   Replace all instances of:
   ```typescript
   { ssl: { rejectUnauthorized: false } }
   ```
   With:
   ```typescript
   { ssl: process.env.DATABASE_CA_CERT 
       ? { rejectUnauthorized: true, ca: Buffer.from(process.env.DATABASE_CA_CERT, 'base64') }
       : { rejectUnauthorized: false }  // Only for local dev
   }
   ```

### HIGH (This Week)
3. **Add rate limiting to admin endpoints**
   ```bash
   npm install express-rate-limit
   ```
   Apply middleware per SECURITY_FIXES.md lines 289-300

4. **Add CSRF protection** (if not already present)
   ```bash
   # Audit CORS configuration
   grep -r "cors\|CORS" src/
   ```

5. **Audit error messages** for information disclosure
   - Check `/api/pricing` errors don't expose SQL or internal details
   - Check admin endpoints don't leak environment paths

### MEDIUM (Before Next Release)
6. **Implement security headers**
   - `Content-Security-Policy`
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Strict-Transport-Security`

7. **Add request logging**
   - All `/api/admin/*` requests should be logged
   - Include IP, timestamp, token validity, action taken

8. **Set up security monitoring**
   - Alert on failed admin auth attempts (>5 in 5 minutes)
   - Alert on rate limit violations

---

## Deployment Verification Checklist

Before deploying ANY changes:

- [ ] `NODE_TLS_REJECT_UNAUTHORIZED` grep returns **zero** results in `src/`
- [ ] All postgres connections use proper CA validation
- [ ] `ADMIN_API_KEY` is set to 64+ random characters in DigitalOcean
- [ ] `DATABASE_CA_CERT` is configured (verify it's not empty)
- [ ] Rate limiting is enabled on `/api/admin/fetch-pricing`
- [ ] Admin endpoints tested with valid and invalid tokens
- [ ] Production logs show no TLS validation errors after deploy
- [ ] HTTPS/TLS status verified via SSL Labs (https://www.ssllabs.com/ssltest/)

---

## SQL Injection & Input Validation Status

**File:** `src/lib/api-utils.ts`  
**Status:** ✅ PROPERLY SECURED

Implemented safeguards:
- Parameterized queries (`$1`, `$2` placeholders) — ✅ Safe
- Input validation function `parseFilterList` — ✅ Validates
- Max length checks (`MAX_SEARCH_LENGTH = 200`) — ✅ Enforced
- Filter item limits (`MAX_FILTER_ITEMS = 50`) — ✅ Enforced
- Rejects suspicious patterns (`;`, `'`, `"`, `\`) — ✅ Validated

**Confidence Level:** HIGH — Direct SQL injection is effectively impossible due to parameterized queries.

---

## CSRF Protection Status

**Findings:**
- Admin endpoints use token-based auth (not cookies) — Immune to CSRF
- Public `/api/pricing` is read-only GET request — Low CSRF risk
- No form submissions that could be CSRF'd — Architecture is safe

**Confidence Level:** MEDIUM — Design is safe, but add SameSite cookies if any cookie-based auth is added.

---

## Cross-Site Scripting (XSS) Status

**Findings:**
- React component using Next.js (v15 with built-in escaping) — ✅ Safe
- No `dangerouslySetInnerHTML` found (manual scan recommended)
- User input only appears in search filters (not rendered unsanitized)

**Recommendation:** Run:
```bash
grep -r "dangerouslySetInnerHTML\|innerHTML" src/
```

---

## Next Security Review

- **Scheduled:** When TLS fixes are deployed (should be today/tomorrow)
- **Follow-up:** Quarterly security audits thereafter
- **Trigger:** Any production incident, deployment to new infrastructure, or major code changes

---

## References

- SECURITY_AUDIT.md — Original vulnerability assessment (June 1, 2026)
- SECURITY_FIXES.md — Detailed fix implementation guide
- OPERATIONS_RUNBOOK.md — Deployment & troubleshooting guide
- Next.js Security: https://nextjs.org/docs/advanced-features/security-headers

---

**Report Generated:** July 19, 2026  
**Assessed By:** Automated code audit  
**Next Review:** Upon fix deployment
