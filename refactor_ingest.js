import fs from 'fs';

const scripts = [
  'populate_containers.ts',
  'populate_networking.ts',
  'populate_serverless.ts',
  'src/services/ingest.ts',
  'src/services/populate_containers.ts'
];

scripts.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove pg and parseDbUrl
    content = content.replace(/import (pg|\{ Pool \}) from 'pg';\n/g, "import postgres from 'postgres';\n");
    content = content.replace(/function parseDbUrl[\s\S]*?ssl: \{ rejectUnauthorized: isNeon \},\n\s*\};\n\}\n/m, "");

    // Handle standard pool instantiation
    content = content.replace(/const pool = new pg\.Pool\(parseDbUrl\(dbUrl\)\);/g, `const sql = postgres(dbUrl, { ssl: { rejectUnauthorized: false } });`);
    content = content.replace(/const pool = new Pool\(parseDbUrl\(dbUrl\)\);/g, `const sql = postgres(dbUrl, { ssl: { rejectUnauthorized: false } });`);

    // Handle networking specific pool instantiation
    content = content.replace(/const pool = new Pool\(\{[\s\S]*?\}\);/m, `const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });`);
    
    // Replace ingest.ts specific
    content = content.replace(/const pool = new Pool\(parseDbUrl\(process.env.DATABASE_URL\)\);/g, `const sql = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });`);

    // Replace pipeline injection
    content = content.replace(/new PricingPipeline\(pool\)/g, "new PricingPipeline(sql as any)");
    content = content.replace(/new DatabasePricingPipeline\(pool\)/g, "new DatabasePricingPipeline(sql as any)");
    content = content.replace(/new ContainersPricingPipeline\(pool\)/g, "new ContainersPricingPipeline(sql as any)");
    content = content.replace(/new ServerlessPricingPipeline\(pool\)/g, "new ServerlessPricingPipeline(sql as any)");
    content = content.replace(/new NetworkingPricingPipeline\(pool\)/g, "new NetworkingPricingPipeline(sql as any)");

    // Replace end
    content = content.replace(/await pool\.end\(\);/g, "await sql.end();");

    fs.writeFileSync(file, content);
  }
});
console.log('Ingest scripts refactored.');
