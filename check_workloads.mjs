import http from 'http';

const workloads = ['rag-ai-app', 'serverless-web-app', '3-tier-web', 'streaming-analytics', 'ecommerce-microservices'];

async function checkWorkloads() {
  for (const w of workloads) {
    const payload = JSON.stringify({
      workloadId: w,
      region: 'Global',
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/workloads',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            console.log(`API Error for ${w}:`, parsed.error, parsed.details);
            return;
          }
          const results = parsed.results;
          console.log(`\n--- Workload: ${w} ---`);
          for (const [provider, details] of Object.entries(results)) {
            const missing = details.components.filter(c => c.instanceType === 'N/A').map(c => c.name);
            if (missing.length > 0) {
              console.log(`${provider} is missing: ${missing.join(', ')}`);
            }
          }
        } catch (e) {
          console.log(`Error parsing ${w}, raw data:`, data);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
    });

    req.write(payload);
    req.end();
  }
}

checkWorkloads();
