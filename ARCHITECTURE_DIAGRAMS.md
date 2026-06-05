# Compare Cloud Costs: Architecture Diagrams & Visual Guides

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPARE CLOUD COSTS PLATFORM                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐         ┌──────────────────────────┐
│    CLIENT BROWSER        │         │   DigitalOcean App       │
│                          │         │   Platform (CDN)         │
│ - React 19              │◄────────┤ - Docker Container       │
│ - Next.js HMR            │   HTTPS  │ - Auto-scaling           │
│ - Tailwind CSS         │          │ - Health Checks          │
│ - Motion Animations    │          │                          │
│ - Router (App Router)  │          └──────────────────────────┘
│                          │                      │
│ Feature:                │                      │
│ - Dynamic Filters      │                      ▼
│ - Table Sorting        │         ┌──────────────────────────┐
│ - Column Resizing      │         │     NEXT.JS SERVER       │
│ - Range Sliders        │         │  (Node.js + TypeScript)  │
│ - Dark Mode            │         │                          │
└─────────────┬───────────┘         │ Routes:                  │
              │                     │ - GET /api/pricing       │
              │                     │ - GET /api/pricing/counts│
              │                     │ - GET /api/health        │
              │                     │ - POST /api/admin/*      │
              │                     │ - Static file serving    │
              │                     │                          │
              │                     │ Scheduled Jobs:          │
              │                     │ - Cron (Sunday midnight) │
              │                     │ - Price pipeline         │
              │                     │ - Email alerts           │
              │                     └──────────────┬───────────┘
              │                                    │
              │                                    ▼
              │                     ┌──────────────────────────┐
              │                     │   POSTGRESQL DATABASE    │
              │                     │  (DigitalOcean Managed)  │
              │                     │                          │
              │                     │ Tables:                  │
              │                     │ - providers (5 rows)     │
              │                     │ - regions (~80 rows)     │
              │                     │ - services (~15 rows)    │
              │                     │ - pricing_records        │
              │                     │   (100k+ rows)           │
              │                     │                          │
              │                     │ Scheduled Execution:     │
              │                     │ - Data refresh           │
              │                     │ - Staleness checks       │
              └────────────────────►└──────────────────────────┘
                      REST API
```

---

## 2. Data Ingestion Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PRICING PIPELINE INITIALIZATION                   │
│              (Triggered on startup or manual cron trigger)          │
└────────────────────────────────┬──────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  PricingPipeline.run()  │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
    ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
    │  AWSAdapter      │ │ AzureAdapter     │ │  GCPAdapter      │
    │                  │ │                  │ │                  │
    │ Source: Live API │ │ Source: Live API │ │ Source: Config   │
    │ URL:             │ │ URL:             │ │ File:            │
    │ aws.amazon.com/  │ │ api.microsoft.   │ │ gcp_instances.ts │
    │ pricing/...      │ │ com/retail/...   │ │                  │
    │                  │ │                  │ │ Fallback: Config │
    │ Fallback: Config │ │ Fallback: Config │ │                  │
    └────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
             │                    │                    │
             │         ┌──────────┴──────────┐         │
             │         │                     │         │
             ▼         ▼                     ▼         ▼
    ┌────────────────────────────────────────────────┐
    │  OracleAdapter          DigitalOceanAdapter    │
    │  (Config fallback)      (Live API w/fallback)  │
    │                                                │
    │  oracle_instances.ts    api.digitalocean.com/  │
    │                         v2/sizes/...           │
    └────────────────────┬───────────────────────────┘
                         │
              ┌──────────▼──────────┐
              │  NORMALIZATION      │
              │  LAYER              │
              │                     │
              │ For each record:    │
              │ 1. Parse vCPU/RAM   │
              │ 2. Detect arch      │
              │ 3. Extract OS       │
              │ 4. Classify CPU     │
              │ 5. Count GPUs       │
              │ 6. Map geography    │
              │ 7. Assign category  │
              │ 8. Format price     │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  PRICE DRIFT CHECK  │
              │                     │
              │ Compare:            │
              │ Old price vs New    │
              │                     │
              │ If change > 20%:    │
              │ - Log warning       │
              │ - Trigger email     │
              │ - Investigate       │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  BATCH INSERT       │
              │                     │
              │ 1. DELETE old       │
              │    records          │
              │ 2. INSERT new       │
              │    records          │
              │ 3. Update schema    │
              │ 4. Normalize cols   │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  EMAIL ALERTS       │
              │                     │
              │ Send notifications: │
              │ - Price drift       │
              │ - Data staleness    │
              │   (>7 days)         │
              └─────────────────────┘
```

---

## 3. Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                      SCHEMA: cloud_pricing                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│    PROVIDERS    │  (n=5)
│                 │
│ id (PK)         │──────┐
│ slug (UNIQUE)   │      │
│ name            │      │
│ created_at      │      │
└─────────────────┘      │ 1:N
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▼
        ┌──────────────┐  ┌──────────────┐
        │  REGIONS     │  │   SERVICES   │
        │  (n=~80)     │  │  (n=~15)     │
        │              │  │              │
        │ id (PK)      │  │ id (PK)      │
        │ provider_id  │  │ provider_id  │
        │ slug         │  │ name         │
        │ display_name │  │ category     │
        │              │  │              │
        │ UNIQUE:      │  │ UNIQUE:      │
        │ (provider,   │  │ (provider,   │
        │  slug)       │  │  name)       │
        └────┬─────────┘  └───────┬──────┘
             │ 1:N                │ 1:N
             │                    │
             └────────┬───────────┘
                      │
                      ▼
        ┌──────────────────────────────────────────────┐
        │        PRICING_RECORDS (n=100k+)            │
        │                                              │
        │ id (PK)                                      │
        │ service_id (FK)──────► SERVICES             │
        │ region_id (FK)───────► REGIONS              │
        │ instance_type                                │
        │ vcpus                                        │
        │ memory_gb                                    │
        │ arch (x86 64, ARM)                           │
        │ os (Linux, Windows)                          │
        │ cpu_vendor (Intel, AMD, AWS, Ampere)        │
        │ gpu_count                                    │
        │ geography (N. America, W. Europe, etc.)     │
        │ price_per_unit                               │
        │ unit (hourly, monthly)                       │
        │ category (General purpose, etc.)            │
        │ attributes (JSONB)───► {"engine": "...",   │
        │                         "ha_mode": "..."}   │
        │ data_source (live_api, static_config)       │
        │ updated_at                                   │
        │                                              │
        │ KEY INDEXES:                                │
        │ - (service_id, region_id)                    │
        │ - (geography, price_per_unit)                │
        │ - (cpu_vendor, arch)                         │
        │ - (category)                                 │
        └──────────────────────────────────────────────┘
```

---

## 4. Frontend State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              DASHBOARD COMPONENT STATE MACHINE                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│    USER INTERACTS WITH FILTERS           │
│                                          │
│ - Click provider pill (aws, azure)       │
│ - Adjust vCPU range slider               │
│ - Select geography                       │
│ - Switch product type (vm ↔ database)    │
│ - Change sort column                     │
│ - Resize table column                    │
└────────────────┬─────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │  UPDATE STATE             │
    │ (setSelectedProviders)    │
    │ (setVCpuRange)            │
    │ (setActiveProductType)    │
    │ (setSortConfig)           │
    │ (setColumnWidths)         │
    │                           │
    │ → localStorage.setItem()  │
    │   (persist for next visit)│
    └────────────┬──────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │  FETCH /api/pricing        │
    │  with query params:        │
    │                            │
    │  ?provider=aws,azure       │
    │  &geography=N.%20America   │
    │  &minVcpu=2                │
    │  &maxVcpu=16               │
    │  &category=General%20...   │
    │  &productType=vm           │
    │  &aggregate=false          │
    │                            │
    │  → useQuery fetches        │
    │  → caching via React Query │
    └────────────┬──────────────┘
                 │
        ┌────────┴─────────┐
        │                  │
        ▼ Success          ▼ Error
    ┌─────────┐        ┌──────────┐
    │ data    │        │ error    │
    │ (rows)  │        │ state    │
    └────┬────┘        └──────────┘
         │
         ▼
    ┌──────────────────┐
    │ CLIENT-SIDE OPS  │
    │                  │
    │ - Sort (by col)  │
    │ - Filter UI      │
    │ - Render rows    │
    │                  │
    │ memoized sort    │
    │ order            │
    └──────────────────┘
         │
         ▼
    ┌──────────────────┐
    │  RENDER TABLE    │
    │                  │
    │  Rows with:      │
    │  - Provider      │
    │  - Instance type │
    │  - vCPUs         │
    │  - Memory GB     │
    │  - Price         │
    │  - ...           │
    │                  │
    │  Features:       │
    │  - Sort arrows   │
    │  - Resize handle │
    │  - Scroll hint   │
    └──────────────────┘
```

---

## 5. API Request/Response Cycles

### GET /api/pricing

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT REQUEST                            │
│                                                             │
│  GET /api/pricing?provider=aws&geography=N.America&...     │
│  Headers: Content-Type: application/json                   │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTE                              │
│                                                             │
│  1. Parse URL query params                                 │
│  2. Call buildPricingFilters(params)                       │
│  3. Construct SQL WHERE clause + parameterized values      │
│  4. Execute query using postgres.js                        │
│  5. Return payload                                         │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE QUERY                                 │
│                                                             │
│  SELECT                                                    │
│    p.name, s.name, r.slug, pr.instance_type,              │
│    pr.vcpus, pr.memory_gb, pr.price_per_unit              │
│  FROM pricing_records pr                                   │
│  JOIN services s ON pr.service_id = s.id                  │
│  JOIN regions r ON pr.region_id = r.id                    │
│  JOIN providers p ON s.provider_id = p.id                 │
│  WHERE s.category = $1 (productType)                       │
│    AND p.slug = ANY($2) (provider list)                    │
│    AND pr.geography = ANY($3) (geography list)             │
│    AND pr.price_per_unit >= $4 (minPrice)                  │
│    ...                                                     │
│  ORDER BY pr.price_per_unit ASC                            │
│  LIMIT 1000                                                │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              RESPONSE PAYLOAD                               │
│                                                             │
│  HTTP 200 OK                                               │
│  Content-Type: application/json                            │
│                                                             │
│  [                                                         │
│    {                                                       │
│      "provider": "AWS",                                    │
│      "service": "EC2",                                     │
│      "region": "us-east-1",                                │
│      "instance_type": "t3.medium",                         │
│      "vcpus": 2,                                           │
│      "memory_gb": 4,                                       │
│      "arch": "x86 64",                                     │
│      "os": "Linux",                                        │
│      "cpu_vendor": "Intel",                                │
│      "gpu_count": 0,                                       │
│      "geography": "N. America",                            │
│      "category": "General purpose",                        │
│      "price_per_unit": "0.0416",                           │
│      "unit": "hourly",                                     │
│      "attributes": {},                                     │
│      "data_source": "live_api",                            │
│      "updated_at": "2026-05-20T00:00:00Z"                  │
│    },                                                      │
│    { ... },                                                │
│    { ... }                                                 │
│  ]                                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Cron Job Execution Timeline

```
TIME                    ACTION
────────────────────────────────────────────────────────

Sun 12:00 AM (UTC)
│
├──► cron.schedule('0 0 * * 0') triggered
│    console.log('🕒 Starting scheduled pipeline...')
│
├──► NEW PricingPipeline(pool).run()
│    ├──► AWSAdapter.fetchPricing()
│    │    ├──► axios.get(AWS pricing index)
│    │    ├──► Parse raw payload
│    │    └──► Return 5000+ PricingRecord[]
│    │
│    ├──► AzureAdapter.fetchPricing()
│    │    └──► ... (same as AWS)
│    │
│    ├──► GCPAdapter.fetchPricing()
│    │    └──► ... (same, config fallback)
│    │
│    └──► OracleAdapter + DigitalOceanAdapter...
│
├──► For each PricingRecord received:
│    1. Validate schema
│    2. Detect price changes vs DB (>20% drift?)
│    3. Collect drift alerts
│    4. Prepare for batch insert
│
├──► Execute batch INSERT INTO pricing_records
│    ├──► DELETE old records
│    └──► INSERT new records
│
├──► If drift detected > 0:
│    └──► sendPriceDriftEmail(allDriftAlerts)
│         └──► nodemailer.transporter.sendMail()
│              → email delivered to ops team
│
├──► Query for stale static_config records (>7 days)
│    └──► SELECT MAX(updated_at) WHERE data_source = ...
│
├──► If stale records detected:
│    └──► sendStalenessEmail(staleAlerts)
│         → reminder to update offline configs
│
└──► console.log('✅ Scheduled pipeline completed')

Next execution: 7 days later (next Sunday 12:00 AM)
```

---

## 7. Column Resizing State Machine

```
INITIAL STATE: User sees table with fixed column widths

┌──────────────────────────────────────────┐
│  Table (columnWidths from localStorage)  │
│  ┌────────┬───────────┬─────────────┐   │
│  │Provider│ Instance  │  vCPU │ ... │   │
│  │ (120px)│ (160px)   │(80px)│     │   │
│  └────────┴───────────┴─────────────┘   │
│     ▲                       ▲             │
│     │                       │             │
│  column border             column border  │
└──────────────────────────────────────────┘
         │
         │ User positions mouse on border
         │
         ▼
    Cursor: ↔️ (resize-x)
    onMouseDown triggered
    │
    ├──► setResizeStartX(clientX)
    ├──► setResizingColumnId('instance_type')
    │
    └──► Listen for onMouseMove
         │
         ├──► Calculate delta = clientX - resizeStartX
         │
         ├──► newWidth = oldWidth + delta
         │
         ├──► setColumnWidths(prev => ({
         │        ...prev,
         │        instance_type: newWidth
         │    }))
         │
         └──► Table re-renders with new width
              CSS Grid: grid-template-columns updated
              │
              └──► Visual feedback in real-time
    
    Release mouse button
    │
    ├──► onMouseUp triggered
    ├──► setResizingColumnId(null)
    ├──► resizeDraggedRef.current = true
    │    (suppress onClick sort)
    │
    └──► useEffect saves to localStorage
         localStorage.setItem(
           'comparecloudcosts_columnWidths',
           JSON.stringify(columnWidths)
         )
         │
         └──► Persists across browser refresh
              Next visit → loads from localStorage
```

---

## 8. Product Type Switch Flow

```
┌──────────────────────────────────────────┐
│  User clicks "Databases" tab             │
└──────────────┬───────────────────────────┘
               │
               ▼
        ┌──────────────┐
        │setActiveProduct
        │Type('database')
        └───────┬──────┘
                │
        ┌───────┴──────────────────────┐
        │  Dynamic UI Update           │
        │                              │
        │  HIDE (compute-only):        │
        │  ├─ OS filter pills          │
        │  ├─ CPU vendor pills         │
        │  ├─ GPU toggle              │
        │  └─ Arch selector            │
        │                              │
        │  SHOW (database-only):       │
        │  ├─ Engine selector          │
        │  │  (PostgreSQL, MySQL, etc.)│
        │  ├─ Deployment type          │
        │  │  (Provisioned, Serverless)│
        │  └─ HA mode                  │
        │     (Single-AZ, Multi-AZ)    │
        └────────┬─────────────────────┘
                 │
        ┌────────▼────────────────────┐
        │ Reset filter state          │
        │                             │
        │ setSelectedEngines([...])   │
        │ setSelectedDeploymentTypes  │
        │ setSelectedHaModes([...])   │
        │                             │
        │ (preserve range sliders)    │
        └────────┬────────────────────┘
                 │
        ┌────────▼────────────────────┐
        │ Call /api/pricing with      │
        │ ?productType=database       │
        │                             │
        │ Server applies filter:      │
        │ WHERE s.category = 'db'     │
        │                             │
        │ Returns different columns:  │
        │ - engine (not os)           │
        │ - deployment_type           │
        │ - ha_mode                   │
        │ - attributes.version        │
        └────────┬────────────────────┘
                 │
        ┌────────▼────────────────────┐
        │ Re-render table             │
        │                             │
        │ Hide:                       │
        │ ├─ GPU column               │
        │ ├─ Arch column              │
        │ └─ CPU vendor column        │
        │                             │
        │ Show:                       │
        │ ├─ Engine column            │
        │ ├─ HA mode column           │
        │ └─ Deployment type column   │
        │                             │
        │ Preserve:                   │
        │ ├─ Sort order               │
        │ ├─ Column widths            │
        │ └─ Price range filter       │
        └────────────────────────────┘
```

---

## 9. Error Handling & Retry Logic

```
┌─────────────────────────────────────────────────┐
│  API Call Fails (e.g., network error)          │
└────────────┬────────────────────────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ axios.catch(err)    │
    │ setError(message)   │
    │ setLoading(false)   │
    └──────────┬──────────┘
               │
         ┌─────┴──────────────────┐
         │                        │
         ▼                        ▼
    User sees error       User retries by:
    message in UI         - Adjusting filter
                          - Clicking refresh
                          - Reloading page
                            │
                            ▼
                      New API request
                      (automatic)
                            │
                      ┌─────┴──────┐
                      │            │
                      ▼ Success    ▼ Fail again
                    Render      Show error
                    rows        (exponential
                                backoff not
                                implemented)
```

---

## 10. Data Staleness Warning System

```
┌─────────────────────────────────────────────────────────┐
│  Every Sunday at midnight (cron job)                    │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────┐
│  Query: SELECT stale records                            │
│                                                         │
│  SELECT p.slug, s.name, MAX(pr.updated_at)             │
│  FROM pricing_records pr                                │
│  JOIN services s ON pr.service_id = s.id               │
│  JOIN providers p ON s.provider_id = p.id              │
│  WHERE pr.data_source = 'static_config'                 │
│  GROUP BY p.slug, s.name                                │
│  HAVING MAX(pr.updated_at) < NOW() - INTERVAL '7 days' │
└────────────┬─────────────────────────────────────────────┘
             │
       ┌─────┴──────────────────┐
       │                        │
       ▼ stale records found    ▼ all fresh
                                (done)
    ┌─────────────────────┐
    │ Build alerts list   │
    │                     │
    │ [{                  │
    │   provider: 'gcp',  │
    │   service: 'GKE',   │
    │   lastUpdated: ..., │
    │   daysSince: 12     │
    │ }]                  │
    └────────┬────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ sendStalenessEmail()   │
    │                        │
    │ nodemailer creates:    │
    │ Subject: Data Alert    │
    │ Body: GCP pricing      │
    │       hasn't been      │
    │       updated in       │
    │       12 days          │
    │                        │
    │ Recipients:            │
    │ hello@comparecloudcosts│
    │ .com (admin)           │
    └────────┬───────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Email delivered        │
    │ → Operations team      │
    │   receives reminder    │
    │   to review static     │
    │   configs              │
    └────────────────────────┘
```

---

## 11. Browser Local Storage Persistence

```
┌─────────────────────────────────────────┐
│  Dashboard Component Mounts              │
└────────────┬────────────────────────────┘
             │
             ▼
    useEffect(() => {
      // Load from localStorage
      const stored = localStorage.getItem(
        'comparecloudcosts_columnWidths'
      );
      if (stored) {
        setColumnWidths(prev => ({
          ...prev,
          ...JSON.parse(stored)
        }));
      }
    }, []);
             │
             ├──► Merge with defaults
             │    (new columns added since
             │     last visit)
             │
             └──► Update columnWidths state
                  │
                  ▼
             Table renders with
             previous user's
             column sizes


┌─────────────────────────────────────────┐
│  User Resizes Column                    │
└────────────┬────────────────────────────┘
             │
             ▼
    setColumnWidths(new state)
             │
             ▼
    useEffect(() => {
      // Save to localStorage
      localStorage.setItem(
        'comparecloudcosts_columnWidths',
        JSON.stringify(columnWidths)
      );
    }, [columnWidths]);
             │
             ├──► Browser localStorage
             │    updated immediately
             │
             └──► Persists across:
                  - Page refresh
                  - Browser restart
                  - Tab close/reopen
                  (until localStorage cleared)
```

---

## 12. Component Lifecycle & Re-render Triggers

```
Dashboard Component Lifecycle
═══════════════════════════════════════════════════════

MOUNT
│
├──► useEffect: Load localStorage → setColumnWidths()
├──► useEffect: Load localStorage → setExpanded()
├──► Initial render with defaults
│
├─────────────────────────────────────────────────────
│
│ UPDATE (User Interactions)
│
├──► Click provider pill
│    └──► setSelectedProviders() → fetchPricing()
│
├──► Adjust range slider
│    └──► setVCpuRange() → fetchPricing()
│
├──► Change sort column
│    └──► setSortConfig() → re-render (no fetch)
│
├──► Resize column
│    └──► setColumnWidths()
│         ├──► localStorage.setItem()
│         └──► re-render table
│
├──► Switch product type
│    └──► setActiveProductType()
│         ├──► Reset filters
│         ├──► Fetch /api/pricing?productType=...
│         └──► Update column visibility
│
├─────────────────────────────────────────────────────
│
│ DATA FETCHING SIDE EFFECTS
│
├──► setLoading(true)
├──► axios.get('/api/pricing?...')
│    ├──► Response: setData(rows)
│    └──► Error: setError(msg)
├──► setLoading(false)
│
├──► axios.get('/api/pricing/counts')
│    └──► setProviderCounts({ aws: 5000, ... })
│
├─────────────────────────────────────────────────────
│
│ MEMOIZED COMPUTATIONS
│
├──► useMemo: sortedData = sort(data, sortConfig)
├──► useMemo: totalTableWidth = sum(columnWidths)
├──► useCallback: buildQueryParams()
│
├─────────────────────────────────────────────────────
│
│ CONTINUOUS MONITORING
│
├──► useEffect: Monitor tableScrollRef
│    ├──► Detect horizontal overflow
│    ├──► Update hasHorizontalOverflow state
│    ├──► Show/hide scroll fade hint
│    └──► Re-run on window resize
│
├──► useEffect: Auto-fit column widths
│    └──► Measure DOM scrollWidth first load
│        (per product type)
│
└──► useEffect: Collapse/expand sections
     └──► Save expanded state to localStorage
```

---

## 13. Deployment CI/CD Pipeline

```
┌────────────────┐
│  Developer     │
│  Pushes code   │
│  to main       │
└────────┬───────┘
         │
         ▼ GitHub Webhook
┌────────────────────────────────────────┐
│  DigitalOcean App Platform             │
│  Detects new commit                    │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  1. Clone Repository                   │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  2. npm install                        │
│     └──► Resolve dependencies          │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  3. npm run build                      │
│     ├──► vite build                    │
│     │    ├──► React compilation        │
│     │    ├──► TypeScript → JS          │
│     │    ├──► Tailwind CSS generation  │
│     │    ├──► Asset minification       │
│     │    └──► dist/ folder created     │
│     │         (250-400 KB gzipped)     │
│     │                                  │
│     └──► tsc --noEmit (type check)     │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  4. Build Docker Image                 │
│     ├──► FROM node:20-alpine           │
│     ├──► COPY . /app                   │
│     ├──► npm install                   │
│     ├──► npm run build                 │
│     ├──► EXPOSE 3000                   │
│     └──► CMD ["npm", "start"]          │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  5. Push to Container Registry         │
│     └──► DigitalOcean Container       │
│          Registry (private)            │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  6. Deploy Container                   │
│     ├──► Drain old container           │
│     ├──► Spawn new container           │
│     ├──► Set environment variables     │
│     │    (DATABASE_URL, etc.)          │
│     └──► Map port 3000 → HTTPS         │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  7. Health Checks                      │
│     ├──► GET /api/health               │
│     │    └──► DB connectivity check    │
│     ├──► Monitor for 2-3 minutes       │
│     └──► Rollback if unhealthy         │
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  8. Live!                              │
│                                        │
│  comparecloudcosts.com running         │
│  latest code                           │
│                                        │
│  Automatic rollback on critical error  │
└────────────────────────────────────────┘
```

---

**Diagrams Created**: 2026-05-20  
**For**: Compare Cloud Costs Project  
**Purpose**: Architecture Documentation & Knowledge Transfer
