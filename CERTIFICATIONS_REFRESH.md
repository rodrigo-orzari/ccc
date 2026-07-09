# Certifications & Regulations — Data Refresh Runbook

The `/certifications` page ([src/app/certifications/page.tsx](src/app/certifications/page.tsx)) is
driven by **static curated data**, not a live ingestion pipeline. Compliance status changes
rarely (~annually) and a wrong claim is a credibility/liability risk, so it's refreshed by a
**human-in-the-loop prompt to Claude Code**, not scraped automatically.

**You do not need to remember the prompt — it's in this file. Just open Claude Code in this repo
and paste the block below.**

---

## When to refresh
- Roughly **every 6 months** (the page footer shows a `Last verified:` date as the staleness signal).
- Or ad hoc when a provider announces a major new certification.

The single source of truth for the data is [src/config/certifications.ts](src/config/certifications.ts):
- `CERTIFICATIONS` — the list of standards (name, category, jurisdiction/scope, definition link).
- `COMPLIANCE_PROVIDERS` — each provider + its **official compliance page** (`sourceUrl`) + `lastVerified`.
- `PROVIDER_CERTIFICATIONS` — provider id → the cert ids it holds.

---

## The refresh prompt (copy-paste this into Claude Code)

```
Refresh the cloud certifications data in src/config/certifications.ts.

For each provider in COMPLIANCE_PROVIDERS, re-fetch its `sourceUrl` (use WebFetch,
and fall back to WebSearch against the provider's official compliance/trust page if
the page is a JS portal or blocks fetching). For each provider, re-check every
certification in the CERTIFICATIONS list and determine, from the provider's OWN
published documentation, whether it currently holds that certification.

Rules:
- The provider's official compliance page is the ONLY source of truth for "who holds
  what." Wikipedia/standard-body links are for defining the standard, never for the claim.
- If you cannot confirm a certification from the official page, leave it OFF (conservative).
  Do NOT guess.
- Before editing anything, show me a DIFF / changelog: for each provider, list certs
  ADDED and certs REMOVED since the current PROVIDER_CERTIFICATIONS, plus any cert you
  could not verify this run. Wait for my approval.
- After I approve, update PROVIDER_CERTIFICATIONS, bump each provider's `lastVerified`
  to today's date, and update the "Last verified: <Month Year>" string in
  src/app/certifications/page.tsx.
- If a genuinely new, widely-recognized standard should be added, propose it as a new
  CERTIFICATIONS entry (with category, scope mapped to an existing GEOGRAPHIES bucket,
  and a definition URL) — but ask before adding.
- Run `npx tsc --noEmit` when done and confirm it's clean.
```

---

## What Claude will do (so you know what to expect)
1. Fetch/search each provider's official compliance page.
2. Produce a **changelog** of additions/removals/unverifiable items — **review this**.
3. On your approval, edit `PROVIDER_CERTIFICATIONS`, bump `lastVerified` dates, and update the
   page's footer date.
4. Typecheck.

## How to review the changelog
- **Removals** are the important ones — a cert dropping off usually means a lapsed attestation
  (real) OR the source page moved/changed layout (false negative). If unsure, open the
  provider's `sourceUrl` yourself and confirm before approving the removal.
- **Additions** are lower risk but still confirm against the official page.
- Anything flagged "could not verify" stays as-is; note it for next time.

## Deploy
No pipeline or DB write — the data is compiled into the app. Just commit and let your normal
build/deploy (DigitalOcean App Platform) ship it, same as any code change.

---

## Notes / known data confidence
- **AWS / Azure / GCP** — full, well-documented cert sets; high confidence.
- **Oracle / Alibaba / Cloudflare / DigitalOcean** — curated conservative subsets. Missing chips
  mean "not found in the official docs at verification time," which may include false negatives
  worth re-checking (e.g. Oracle HITRUST/ENS/MTCS, Cloudflare FedRAMP — "in process" as of the
  initial build).
- To add a new provider: add it to `COMPLIANCE_PROVIDERS` (id must match `PROVIDERS` in
  `src/config/index.ts`) and give it a `PROVIDER_CERTIFICATIONS` entry. The page and filters pick
  it up automatically.

Related: the user-facing disclaimer on the page states this is for general comparison only and is
not legal advice.
