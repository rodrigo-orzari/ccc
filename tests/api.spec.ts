import { test, expect } from '@playwright/test';

test.describe('API Endpoint Sanity Checks', () => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  test('Databases should return results for default query', async ({ request }) => {
    const url = `${baseURL}/api/pricing?product=database&geography=N.%20America,S.%20America,W.%20Europe,Asia%20Pacific,Australia,Mid%20East%20%26%20Africa&dbFamilies=Relational,NoSQL&engines=PostgreSQL,MySQL,MariaDB,SQL%20Server,Oracle%20DB,Cosmos%20DB,MongoDB,Redis,Valkey,DB2&deploymentTypes=Provisioned,Serverless&haModes=Single%20AZ,Multi%20AZ,Zone%20Redundant,Multi%20Region&minVcpu=1&maxVcpu=128&minMemory=1&maxMemory=512&minPrice=0&maxPrice=10`;
    const response = await request.get(url);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  test('Containers should return results when GPU is false', async ({ request }) => {
    const url = `${baseURL}/api/pricing?product=containers&containersGpuIncluded=false&geography=N.%20America,S.%20America,W.%20Europe,Asia%20Pacific,Australia,Mid%20East%20%26%20Africa`;
    const response = await request.get(url);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    // Assuming we ingested some containers without GPUs
    expect(data.length).toBeGreaterThan(0);
  });

  test('Data Analytics should return results for default query', async ({ request }) => {
    const url = `${baseURL}/api/pricing?product=data-analytics&analyticsEngines=Databricks,Snowflake,BigQuery,Synapse,Redshift&geography=N.%20America,S.%20America,W.%20Europe,Asia%20Pacific,Australia,Mid%20East%20%26%20Africa`;
    const response = await request.get(url);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
});
