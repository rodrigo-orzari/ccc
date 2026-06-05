import { sql } from './src/config/db.ts';

async function testHealth() {
  const req = { query: { product: 'compute', providers: 'aws,azure' } };
  
  // Just use fetch to hit the local server if it's running
  try {
    const res = await fetch('http://localhost:5173/api/health?product=compute');
    console.log(await res.text());
  } catch (e) {
    console.error(e.message);
  }
}
testHealth();
