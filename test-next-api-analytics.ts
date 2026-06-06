import { NextRequest } from 'next/server';
import { GET } from './src/app/api/pricing/route.ts';

async function main() {
  const url = 'http://localhost/api/pricing?product=data-analytics&geography=N.%20America,S.%20America,W.%20Europe,N.%20Europe,Mid%20East%20&%20Africa,Asia%20Pacific,Australia&analyticsEngines=Databricks,Snowflake,BigQuery,Redshift,Synapse,Native&analyticsDeploymentTypes=Serverless,Provisioned,Dedicated&analyticsTiers=Standard,Enterprise,Business%20Critical&minVcpu=0&maxVcpu=192&minMemory=0&maxMemory=6144&minPrice=0&maxPrice=20';
  
  const req = new NextRequest(url);
  const res = await GET(req);
  const json = await res.json();
  console.log(json.length ? `Returned ${json.length} rows` : json);
}
main().catch(console.error);
