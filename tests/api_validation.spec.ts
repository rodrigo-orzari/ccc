import { test, expect } from '@playwright/test';

const PRODUCT_TYPES = ['compute', 'database', 'serverless', 'containers', 'networking', 'data-analytics'];

test.describe('Backend API Validation Suite', () => {

  test('All product endpoints return valid 200 JSON arrays with non-zero length', async ({ request }) => {
    // We check that the backend is properly extracting the product param and querying the DB
    for (const product of PRODUCT_TYPES) {
      const response = await request.get(`/api/pricing?product=${product}`);
      
      // 1. Assert Status 200 OK
      expect(response.ok(), `Expected 200 OK for /api/pricing?product=${product}`).toBeTruthy();
      
      const json = await response.json();
      
      // 2. Assert valid array format returned
      expect(Array.isArray(json), `Expected JSON array for ${product}`).toBeTruthy();
      
      // 3. Assert array is not empty (guarantees our DB query didn't silent-fail or return 0 records due to bad WHERE clauses)
      expect(json.length, `Expected at least 1 record for ${product}, got 0`).toBeGreaterThan(0);
      
      // 4. Assert correct category mapped in records
      if (json.length > 0) {
        let expectedCategory = product;
        if (product === 'data-analytics') expectedCategory = 'data_warehouse';
        if (product === 'compute') expectedCategory = 'compute';
        
        expect(json[0].category).toBe(expectedCategory);
      }
    }
  });

});
