import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// Replace `.rows` usage from pg results
content = content.replace(/res\.rows/g, "res");
content = content.replace(/staleRes\.rows/g, "staleRes");
content = content.replace(/countRes\.rows/g, "countRes");
content = content.replace(/providerRes\.rows/g, "providerRes");
content = content.replace(/lastUpdatedRes\.rows/g, "lastUpdatedRes");
content = content.replace(/result\.rows/g, "result");

fs.writeFileSync('server.ts', content);
console.log('server.ts .rows replacements done.');
