import { buildPricingFilters } from './src/lib/api-utils.js';

// Node.js doesn't natively run TypeScript without ts-node or similar.
// Since the project is Next.js, let's just make a file that imports and runs it if possible, 
// but wait, api-utils is TS.
// Let's write the test inside the next.js app context or just copy the function here to test its output.
