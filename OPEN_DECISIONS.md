# Open Decisions

Product/architecture questions worth revisiting later. Not urgent, not forgotten.

---

## Should Databricks / Snowflake (and future Mongo / Aiven) be "Specialized Providers"?

**Raised:** 2026-07-18

**Context:** On the Data & Analytics category (`/?product=data-analytics`), Databricks and
Snowflake pricing records are currently stored with `provider: 'aws' | 'azure' | 'gcp'`
(whichever cloud hosts that deployment) and `engine: 'Databricks' | 'Snowflake'`
(`src/services/data_analytics_pipeline.ts`). This means they show up folded into the
AWS/Azure/GCP provider chips at the top of the page instead of getting their own
provider badge — unlike Pinecone, Weaviate, OpenAI, etc., which are modeled as their
own top-level entries in `PROVIDERS` with `providerType: 'specialized'`
(`src/config/index.ts`).

**The question:** Databricks and Snowflake set their own pricing independent of the
underlying cloud, the same relationship OpenAI/Pinecone have to their infrastructure —
so should they be promoted to `providerType: 'specialized'` with their own provider
entry, instead of being nested under the hyperscaler that hosts them? MongoDB Atlas and
Aiven (both possible future additions) are the identical pattern: independent vendor,
multi-cloud deployment, vendor-set pricing.

**The wrinkle:** which cloud a Databricks/Snowflake deployment runs on is a real pricing
input today (different rates are fetched per hyperscaler), not just a label. Promoting
them to specialized providers means that "which cloud" dimension needs to become its
own attribute/filter (a "Deployment Cloud" badge, similar to how "Engine" and
"Deployment: Provisioned/Serverless" already work for this category) rather than
disappearing.

**Scope if we do this:** ingest pipeline (write vendor as `provider` instead of the
hyperscaler), `PROVIDERS` config (new specialized entries + brand colors/logos), filter
sidebar (new "Deployment Cloud" filter), and the pricing table (new column). Real schema
change, not a quick tweak — worth doing once, deliberately, ideally in the same pass as
adding Mongo/Aiven rather than twice.

**Status:** Not decided. Revisit when Mongo/Aiven are actually being added.
