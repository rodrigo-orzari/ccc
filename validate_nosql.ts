import { GCPFirestoreAdapter, GCPBigtableAdapter, OracleNoSQLAdapter } from './src/services/database_pipeline.js';

async function main() {
  const firestore = new GCPFirestoreAdapter();
  const bigtable = new GCPBigtableAdapter();
  const oracle = new OracleNoSQLAdapter();

  const firestoreData = await firestore.fetchPricing();
  const bigtableData = await bigtable.fetchPricing();
  const oracleData = await oracle.fetchPricing();

  console.log('GCP Firestore Instances:', firestoreData.length);
  console.log(firestoreData[0]);

  console.log('\nGCP Bigtable Instances:', bigtableData.length);
  console.log(bigtableData[0]);

  console.log('\nOracle NoSQL Instances:', oracleData.length);
  console.log(oracleData[0]);
}
main();
