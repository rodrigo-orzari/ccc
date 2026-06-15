import fs from 'fs';

let content = fs.readFileSync('src/config/index.ts', 'utf-8');

const newConfigs = `
// --- APP HOSTING ---
export const APP_HOSTING_TIERS: string[] = ['Basic', 'Standard', 'Premium', 'Professional', 'Shared', 'Dedicated'];
export const APP_HOSTING_COMPUTE_TYPES: string[] = ['Shared', 'Dedicated'];

// --- INTEGRATION ---
export const INTEGRATION_TYPES: string[] = ['Message Queue', 'Event Bus', 'API Gateway', 'Workflow'];
export const INTEGRATION_TIERS: string[] = ['Standard', 'Premium', 'FIFO', 'Basic'];
`;

content += newConfigs;

fs.writeFileSync('src/config/index.ts', content, 'utf-8');
