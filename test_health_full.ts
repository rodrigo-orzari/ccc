import { sql } from './src/config/db.ts';

async function testHealth() {
  const url = 'http://localhost:3000/api/health?product=compute&geography=N.%20America&os=Linux&cpu=AMD&category=General%20Purpose&gpu=false';
  try {
    const res = await fetch(url);
    console.log(await res.text());
  } catch (e) {
    console.error(e.message);
  }
}
testHealth();
