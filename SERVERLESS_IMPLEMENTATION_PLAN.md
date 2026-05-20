# Serverless Compute Pricing: Implementation Plan

**Status**: Static configs only (empty data)  
**Goal**: Populate serverless pricing from live cloud provider APIs  
**Timeline**: 2-3 weeks (phased by provider)  

---

## Executive Summary

Your serverless pipeline exists but currently **only reads from static, hardcoded configs**. To populate real serverless pricing data, you need to:

1. **Create live API adapters** for AWS Lambda, Google Cloud Functions, and Azure Functions
2. **Fetch pricing from official APIs** (AWS Pricing API, GCP Pricing API, Azure Retail Prices API)
3. **Normalize the data** (same as compute pipelines do)
4. **Store in PostgreSQL** using existing `pricing_records` table with `category='Serverless Compute'`

---

## Current State Analysis

### What's Working
- ✅ `ServerlessPricingPipeline` class exists
- ✅ Adapter pattern implemented (3 adapters: AWS, GCP, Azure)
- ✅ Database saves logic reuses compute pipeline (`saveRecords`)
- ✅ Frontend can display serverless when `productType='serverless'`

### What's Missing
- ❌ Live API integrations (currently reads static config only)
- ❌ Comprehensive config fallbacks (only 2 AWS entries)
- ❌ Multi-region pricing (currently hardcoded to single region)
- ❌ Memory tier variations (fixed at 1 GB)
- ❌ Invocation pricing (only GB-hour included)
- ❌ Cold start / duration variations

---

## Cloud Provider APIs: Overview

### AWS Lambda Pricing

**API Options**:
1. **AWS Pricing API** (recommended)
   - Endpoint: `https://pricing.us-east-1.amazonaws.com/pricing/`
   - No authentication required (public)
   - Returns JSON/CSV for all services
   - Includes all regions + on-demand pricing

2. **Boto3 Pricing Client** (alternative)
   - Requires AWS credentials
   - Returns structured data
   - More reliable parsing

**Data Model**:
- Pricing dimensions: GB-seconds, invocations
- Standard vs Provisioned concurrency
- Arm (Graviton) vs x86 (Intel/AMD)
- Duration: 1ms to 15 minutes
- Memory: 128 MB to 10,240 MB (in 1 MB increments)

**Normalization Challenge**:
- Lambda prices by GB-second (need to convert to GB-hour)
- Invocations: 1 million free/month, then $0.20/million
- Provisioned concurrency: separate monthly cost
- Ephemeral storage: extra $0.0000166667/GB-second

**Example Pricing** (us-east-1, x86):
```
GB-second: $0.0000166667
Invocations: $0.0000002/invocation (after 1M free)
Monthly: $0.20 per 1M invocations
Provisioned: $0.015/GB-hour
```

---

### Google Cloud Functions

**API Options**:
1. **GCP Pricing API** (recommended)
   - Endpoint: `https://www.googleapis.com/compute/v1/projects/[projectId]/global/images`
   - Requires authentication (service account)
   - Public pricing available at: `https://cloud.google.com/pricing/`

2. **Parsing HTML Price Page** (fallback)
   - No API, scrape HTML from pricing page
   - Less reliable but no auth needed

**Data Model**:
- 2nd Gen: invocations + GB-seconds
- Memory: 128 MB to 16 GB
- CPU tiers: 1x, 2x, 4x
- Invocation cost: $0.40 per 1 million
- Compute: $0.0000041667/GB-second (x86, 1x CPU)
- 90k free invocations/month
- 400k free GB-seconds/month

**Example Pricing** (us-central1, 1 CPU, 1 GB):
```
Invocations: $0.40 per 1M
Compute: $0.0000041667/GB-second
(Compared to AWS: ~4x cheaper)
```

---

### Azure Functions

**API Options**:
1. **Azure Retail Prices API** (recommended)
   - Endpoint: `https://prices.azure.com/api/retail/prices`
   - No authentication (public)
   - Filter: `serviceName eq 'Functions'`
   - Returns all regions + consumption tiers

2. **REST API with Service Principal** (alternative)
   - Requires Azure credentials
   - More detailed data

**Data Model**:
- Consumption plan: pay per execution
- Premium plan: pre-allocated compute
- Free tier: 1 million free executions/month
- Execution price: $0.0000002 per execution
- GB-seconds: $0.000016667/GB-second (consumption plan)
- Memory: determined by allocated vCPUs (0.5-4 vCPU)
- Timeout: up to 10 minutes

**Example Pricing** (East US, consumption):
```
Executions: $0.0000002 per execution
GB-seconds: $0.000016667
(Similar to AWS, slightly cheaper)
```

---

## Implementation Roadmap

### Phase 1: AWS Lambda (Week 1)

**Step 1.1: Fetch Pricing from AWS Pricing API**

```typescript
// src/services/serverless_pipeline.ts

async fetchAWSLambdaPricing(): Promise<PricingRecord[]> {
  // 1. Download pricing JSON from AWS
  const pricingUrl = 'https://pricing.us-east-1.amazonaws.com/pricing';
  const response = await axios.get(`${pricingUrl}`);
  
  // 2. Filter for Lambda service
  const lambdaPricing = response.data.products.filter(
    p => p.productFamily === 'Lambda'
  );
  
  // 3. Parse regions, memory tiers, pricing
  const records = [];
  for (const product of lambdaPricing) {
    const attrs = product.attributes;
    
    // Only process on-demand pricing (not reserved)
    if (attrs.purchaseType !== 'On Demand') continue;
    
    // Extract key fields
    const memory = parseFloat(attrs.memory); // GB
    const region = attrs.location; // e.g., "Any"
    const arch = attrs.architecture; // "ARM64" or "x86"
    
    // Find price in pricing terms
    const price = extractGBSecondPrice(product);
    
    records.push({
      provider: 'aws',
      service: 'Lambda',
      region: this.mapAWSRegion(region),
      instanceType: `Lambda-${memory}GB-${arch}`,
      vcpus: 1, // Normalized for comparison
      memoryGb: memory,
      arch: arch === 'ARM64' ? 'ARM' : 'x86 64',
      os: 'Linux',
      cpuVendor: arch === 'ARM64' ? 'AWS' : 'Intel',
      gpuCount: 0,
      geography: this.getGeography(region),
      category: 'Serverless Compute',
      price: convertGBSecondToGBHour(price),
      unit: 'GB-Hour',
      dataSource: 'live_api' as const,
      attributes: {
        deployment_type: 'Serverless',
        memory_mb: Math.round(memory * 1024),
        invocation_price: 0.0000002, // $0.20 per 1M
        free_tier: 'Yes', // 1M invocations/month
      },
    });
  }
  
  return records;
}
```

**Step 1.2: Add Invocation & Provisioned Pricing**

```typescript
// Store as separate "instance types" in pricing_records
// or add to attributes.json

// Dimension 1: By memory
Lambda-1GB-x86, Lambda-2GB-x86, Lambda-4GB-x86, ..., Lambda-10GB-x86

// Dimension 2: By execution model
Lambda-x86-OnDemand (GB-second pricing)
Lambda-x86-Provisioned (monthly GB-hour)

// Dimension 3: Invocations
Lambda-Invocations (price per 1M calls)
```

**Step 1.3: Handle All Regions**

AWS Lambda available in 31 regions. Pricing varies slightly:
- `us-east-1` (standard baseline)
- `eu-west-1` (5% higher)
- `ap-southeast-1` (10% higher)
- etc.

Fetch pricing for **all regions** from the AWS API.

---

### Phase 2: Google Cloud Functions (Week 2)

**Step 2.1: Fetch from GCP Pricing API**

```typescript
async fetchGCPCloudRunPricing(): Promise<PricingRecord[]> {
  // Option A: Parse GCP pricing page (HTML scraping)
  const html = await axios.get('https://cloud.google.com/pricing/cloud-run');
  const priceTable = parseHTMLTable(html);
  
  // Option B: Use GCP Pricing API (requires auth)
  const prices = await gcpClient.pricing.list({
    serviceName: 'Cloud Run'
  });
  
  // Extract pricing by memory tier and CPU
  const records = [];
  
  // GCP pricing structure:
  // - 128 MB to 16 GB memory
  // - 1x, 2x, 4x CPU tiers
  // - vCPU per tier: 0.25, 0.5, 1, 2, 4 vCPU
  
  const memoryTiers = [128, 256, 512, 1024, 2048, 4096, 8192, 16384]; // MB
  const cpuTiers = ['0.25', '0.5', '1', '2', '4'];
  const regions = ['us-central1', 'us-east1', 'europe-west1', 'asia-east1'];
  
  for (const region of regions) {
    for (const memory of memoryTiers) {
      for (const cpu of cpuTiers) {
        // Only valid combinations
        if (!isValidCPUMemoryCombination(cpu, memory)) continue;
        
        const price = getGCPPrice(region, memory, cpu);
        
        records.push({
          provider: 'gcp',
          service: 'Cloud Run',
          region: region,
          instanceType: `CloudRun-${memory}MB-${cpu}CPU`,
          vcpus: parseFloat(cpu),
          memoryGb: memory / 1024,
          arch: 'x86 64',
          os: 'Linux',
          cpuVendor: 'Intel',
          gpuCount: 0,
          geography: this.getGeography(region),
          category: 'Serverless Compute',
          price: price, // GB-second converted to GB-hour
          unit: 'GB-Hour',
          dataSource: 'live_api' as const,
          attributes: {
            deployment_type: 'Serverless',
            memory_mb: memory,
            cpu: cpu,
            invocation_price: 0.40, // $0.40 per 1M
            free_invocations: 90000,
            free_gb_seconds: 400000,
          },
        });
      }
    }
  }
  
  return records;
}
```

---

### Phase 3: Azure Functions (Week 2.5)

**Step 3.1: Fetch from Azure Retail Prices API**

```typescript
async fetchAzureFunctionsPricing(): Promise<PricingRecord[]> {
  const url = 'https://prices.azure.com/api/retail/prices';
  
  // Query: Functions service, consumption plan
  const filter = `serviceName eq 'Functions' and skuName contains 'Consumption'`;
  
  const response = await axios.get(url, {
    params: { '$filter': filter }
  });
  
  const records = [];
  
  for (const item of response.data.Items) {
    const region = item.armRegionName; // e.g., "eastus"
    const unitPrice = item.unitPrice; // per execution
    
    // Azure Functions memory is tied to vCPU allocation
    // Consumption: 0.5 GB per vCPU (up to 4 vCPU = 2 GB)
    
    records.push({
      provider: 'azure',
      service: 'Azure Functions',
      region: region,
      instanceType: `AzureFunctions-Consumption`,
      vcpus: 1, // Variable up to 4
      memoryGb: 0.5, // Per vCPU
      arch: 'x86 64',
      os: 'Linux',
      cpuVendor: 'Intel',
      gpuCount: 0,
      geography: this.getGeography(region),
      category: 'Serverless Compute',
      price: unitPrice, // Per execution
      unit: 'Per Million Invocations', // Different unit!
      dataSource: 'live_api' as const,
      attributes: {
        deployment_type: 'Serverless',
        memory_gb: 0.5,
        cpu: 0.5,
        execution_price: unitPrice,
        free_executions: 1000000,
      },
    });
  }
  
  return records;
}
```

---

## Database Considerations

### Current Schema
```sql
CREATE TABLE pricing_records (
  id SERIAL PRIMARY KEY,
  service_id INTEGER,
  region_id INTEGER,
  instance_type VARCHAR(100),
  vcpus FLOAT,
  memory_gb FLOAT,
  arch VARCHAR(50),
  os VARCHAR(50),
  cpu_vendor VARCHAR(50),
  gpu_count INTEGER,
  geography VARCHAR(100),
  price_per_unit NUMERIC(15, 6),
  unit VARCHAR(50),
  category VARCHAR(50),
  attributes JSONB,
  data_source VARCHAR(20),
  updated_at TIMESTAMP
);
```

### Changes Needed
1. **Add `services` entry** for each serverless product:
   - Lambda (provider_id=1, service='Lambda')
   - Cloud Run (provider_id=3, service='Cloud Run')
   - Azure Functions (provider_id=2, service='Azure Functions')

2. **New `unit` values**:
   - `'GB-Hour'` (for vCPU/memory billing)
   - `'Per Million Invocations'` (for invocation billing)
   - `'Provisioned GB-Hour'` (for reserved capacity)

3. **Enhanced `attributes` JSONB**:
   ```json
   {
     "deployment_type": "Serverless",
     "memory_mb": 1024,
     "cpu": 1,
     "invocation_price": 0.0000002,
     "free_invocations": 1000000,
     "free_gb_seconds": 0,
     "architecture_options": ["x86", "ARM"],
     "max_duration_seconds": 900,
     "cold_start_time_ms": "~100"
   }
   ```

---

## Testing Strategy

### Unit Tests
```typescript
// Test price parsing
test('AWS Lambda: Convert GB-second to GB-hour', () => {
  const gbSecondPrice = 0.0000166667;
  const gbHourPrice = convertGBSecondToGBHour(gbSecondPrice);
  expect(gbHourPrice).toBeCloseTo(0.06); // 0.0000166667 * 3600
});

test('GCP: Parse memory tier', () => {
  const memory = parseMemoryMB('1024 MB');
  expect(memory).toBe(1024);
});
```

### Integration Tests
```typescript
// Test full pipeline
test('ServerlessPipeline: Fetch AWS Lambda pricing', async () => {
  const pipeline = new ServerlessPricingPipeline(testPool);
  const results = await pipeline.run();
  
  expect(results[0].provider).toBe('aws');
  expect(results[0].count).toBeGreaterThan(100); // All regions + tiers
  expect(results[0].status).toBe('success');
});
```

### Manual Verification
1. Run pipeline: `curl -X POST /api/admin/fetch-pricing?type=serverless`
2. Check database: `SELECT COUNT(*) FROM pricing_records WHERE category='Serverless Compute';`
3. Verify data: `SELECT DISTINCT provider, service, region FROM pricing_records WHERE category='Serverless Compute';`
4. Check UI: Visit `/` and switch to Serverless tab, verify prices display

---

## Error Handling & Fallbacks

### Scenario 1: API is Down
```typescript
try {
  const records = await fetchAWSLambdaPricing();
} catch (error) {
  console.warn('AWS Pricing API failed, using static config');
  return AWS_SERVERLESS_FALLBACK; // Use config file
}
```

### Scenario 2: Rate Limiting
```typescript
// Implement exponential backoff
async function fetchWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await axios.get(url);
    } catch (error) {
      if (error.response?.status === 429) {
        const wait = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(r => setTimeout(r, wait));
      } else {
        throw error;
      }
    }
  }
}
```

### Scenario 3: Partial Data
```typescript
// If some regions fail, still save what we got
const allRecords = [];
for (const region of regions) {
  try {
    const records = await fetchRegionPricing(region);
    allRecords.push(...records);
  } catch (error) {
    console.warn(`Failed to fetch ${region}, skipping`);
    // Continue with next region
  }
}
```

---

## Normalization Challenges

### Problem 1: Different Pricing Units
| Provider | Unit | How to Normalize |
|----------|------|-----------------|
| AWS Lambda | GB-second | × 3600 → GB-hour |
| GCP Cloud Run | GB-second | × 3600 → GB-hour |
| Azure Functions | Per invocation | Separate metric |

**Solution**: Store both metrics in `attributes`:
```json
{
  "compute_unit": "GB-Hour",
  "compute_price": 0.06,
  "invocation_unit": "Per Million",
  "invocation_price": 0.20
}
```

### Problem 2: Variable Memory/CPU
AWS: 128 MB - 10 GB (1 MB increments) = 9,872 tiers  
GCP: 128 MB - 16 GB × 5 CPU options = 100+ combinations  

**Solution**: Sample key tiers, not all:
```typescript
const memorySamples = [128, 256, 512, 1024, 2048, 4096, 8192]; // MB
// Don't store all 10k combinations, just representative samples
```

### Problem 3: Regional Price Variance
AWS: 40+ regions with different pricing  
GCP: 30+ regions  
Azure: 50+ regions  

**Solution**: Fetch all regions from API, filter display in UI:
```typescript
// Database: store all regions
// Frontend: filter by selected geographies
```

---

## Implementation Checklist

- [ ] **Week 1: AWS Lambda**
  - [ ] Create `AWSLambdaLiveAdapter` class
  - [ ] Implement `fetchAWSLambdaPricing()` with live API
  - [ ] Add unit tests
  - [ ] Update static config fallback with real prices
  - [ ] Test with `npm run ingest`
  - [ ] Verify data in database

- [ ] **Week 2: Google Cloud Functions**
  - [ ] Create `GCPCloudRunLiveAdapter` class
  - [ ] Implement pricing fetch (API or HTML parsing)
  - [ ] Handle memory/CPU combinations
  - [ ] Test all major regions
  - [ ] Update static config fallback
  - [ ] Integration test

- [ ] **Week 2.5: Azure Functions**
  - [ ] Create `AzureFunctionsLiveAdapter` class
  - [ ] Fetch from Azure Retail Prices API
  - [ ] Map to pricing_records format
  - [ ] Test all regions
  - [ ] Fallback config update
  - [ ] Full integration test

- [ ] **Week 3: Polish & Verification**
  - [ ] Dashboard filtering works (filters by geography, price range, etc.)
  - [ ] Price drift detection (alert if prices change >20%)
  - [ ] Documentation updated
  - [ ] Cron job runs weekly to refresh serverless data
  - [ ] Empty data scenario handled

---

## Code File Locations

**To Create**:
- `src/services/serverless_pipeline_live.ts` — Live API adapters

**To Update**:
- `src/services/serverless_pipeline.ts` — Import live adapters
- `src/config/aws_serverless.ts` — Add real prices
- `src/config/gcp_serverless.ts` — Add real prices
- `src/config/azure_serverless.ts` — Add real prices
- `server.ts` — Ensure ServerlessPricingPipeline runs in cron

**To Verify**:
- `src/pages/Dashboard.tsx` — Test serverless tab
- Test `/api/pricing?productType=serverless`

---

## Resources & Documentation

**AWS Pricing API**:
- Docs: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-cost-explorer.html
- Bulk pricing download: https://pricing.aws.amazon.com/pricing
- Pricing JSON: https://pricing.us-east-1.amazonaws.com/pricing

**GCP Pricing API**:
- Docs: https://cloud.google.com/architecture/pricing-data-apis
- Public pricing: https://cloud.google.com/pricing

**Azure Retail Prices API**:
- Docs: https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices
- No auth needed, public endpoint

---

## Expected Outcome

After implementation:

✅ **Database**: 500+ serverless pricing records across 3 providers  
✅ **API**: `/api/pricing?productType=serverless` returns live data  
✅ **UI**: Dashboard tab shows serverless options with filters  
✅ **Alerts**: Price drift emails trigger if serverless prices change  
✅ **Weekly refresh**: Cron job updates serverless data every Sunday  

**Example Result**:
```json
[
  {
    "provider": "AWS",
    "service": "Lambda",
    "region": "us-east-1",
    "instance_type": "Lambda-1GB-x86",
    "memory_gb": 1,
    "price_per_unit": 0.06,
    "unit": "GB-Hour",
    "attributes": {
      "invocation_price": 0.0000002,
      "free_invocations": 1000000
    }
  },
  ...
]
```

---

**Next Steps**: Would you like me to start with Phase 1 (AWS Lambda API integration)? I can implement the live adapter and populate the database immediately.
