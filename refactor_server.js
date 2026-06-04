import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');
let lines = content.split('\n');

// Find auto-init
let autoInitStart = lines.findIndex(l => l.includes('// 1. Initial Auto-Init'));
let autoInitEnd = lines.findIndex((l, i) => i > autoInitStart && l.includes('console.warn(\'⚠️ DATABASE_URL is not set. Database functionality will be limited.\');')) + 1; // get the closing brace of the else block

// We actually want to keep initDb() call but remove the interior auto-fetch logic.
// However, the original code had:
//   if (process.env.DATABASE_URL) {
//     initDb().then(async (success) => {
//       if (success) {
//         // auto-fetch logic
//       }
//     });
//   } else ...
// Let's just replace the auto-init block entirely with a simpler initDb call.
if (autoInitStart !== -1 && autoInitEnd !== -1) {
  const replacement = `  // 1. Database Schema Initialization
  if (process.env.DATABASE_URL) {
    initDb().then((success) => {
      if (success) console.log('✅ Database connected and schema initialized.');
    });
  } else {
    console.warn('⚠️ DATABASE_URL is not set. Database functionality will be limited.');
  }`;
  lines.splice(autoInitStart, autoInitEnd - autoInitStart + 1, replacement);
}

// Re-split because indices changed
content = lines.join('\n');
lines = content.split('\n');

// Find cron block
let cronStart = lines.findIndex(l => l.includes('// 2. Automated Background Jobs (Runs every Sunday at midnight)'));
let cronEnd = lines.findIndex((l, i) => i > cronStart && l === '  });');

if (cronStart !== -1 && cronEnd !== -1) {
  lines.splice(cronStart, cronEnd - cronStart + 1);
}

content = lines.join('\n');

// Remove imports
content = content.replace("import cron from 'node-cron';\n", "");
content = content.replace(", sendStalenessEmail, StaleDataAlert", "");

fs.writeFileSync('server.ts', content);
console.log('Server refactored to remove cron and auto-fetch.');
