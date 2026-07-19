import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  console.log("=== All distinct tier values for data-analytics ===");
  const allTiers = await sql`
    SELECT 
      pr.attributes->>'engine' AS engine, 
      pr.attributes->>'tier' AS tier, 
      pr.attributes->>'deployment_type' AS deployment_type, 
      COUNT(*) 
    FROM product_records pr 
    JOIN services s ON s.id = pr.service_id 
    WHERE pr.product_type = 'data-analytics' 
    GROUP BY 1,2,3 
    ORDER BY 1,2;
  `;
  console.table(allTiers);

  console.log("\n=== Flagged Rows (deployment word in tier) ===");
  const flagged = await sql`
    SELECT 
      pr.attributes->>'engine' AS engine, 
      pr.attributes->>'tier' AS tier, 
      pr.attributes->>'deployment_type' AS deployment_type,
      COUNT(*)
    FROM product_records pr 
    JOIN services s ON s.id = pr.service_id 
    WHERE pr.product_type = 'data-analytics' 
      AND pr.attributes->>'tier' ILIKE ANY (ARRAY['provisioned','serverless','on-demand'])
    GROUP BY 1,2,3
    ORDER BY 1;
  `;
  console.table(flagged);
  
  console.log("\n=== Reverse Leak Check (real tier names in deployment_type) ===");
  const reverseLeak = await sql`
    SELECT 
      pr.attributes->>'engine' AS engine, 
      pr.attributes->>'tier' AS tier, 
      pr.attributes->>'deployment_type' AS deployment_type,
      COUNT(*)
    FROM product_records pr 
    JOIN services s ON s.id = pr.service_id 
    WHERE pr.product_type = 'data-analytics' 
      AND pr.attributes->>'deployment_type' ILIKE ANY (ARRAY['%enterprise%', '%standard%', '%premium%', '%basic%', '%free%'])
    GROUP BY 1,2,3
    ORDER BY 1;
  `;
  console.table(reverseLeak);

  console.log("\n=== Stray Whitespace / Casing Variants in Tier ===");
  const whitespace = await sql`
    SELECT 
      pr.attributes->>'engine' AS engine,
      pr.attributes->>'tier' AS tier, 
      COUNT(*)
    FROM product_records pr 
    WHERE pr.product_type = 'data-analytics' 
      AND pr.attributes->>'tier' IS NOT NULL
      AND (
        pr.attributes->>'tier' != TRIM(pr.attributes->>'tier')
        OR pr.attributes->>'tier' ~ '^[a-z]'
        OR pr.attributes->>'tier' ~ '[A-Z]{2,}'
      )
    GROUP BY 1,2;
  `;
  console.table(whitespace);

  process.exit(0);
}

main().catch(console.error);
