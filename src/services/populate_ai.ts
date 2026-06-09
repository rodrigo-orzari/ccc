import postgres from 'postgres';
import { AIPricingPipeline } from './ai_pipeline';

async function main() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });

  try {
    console.log('🚀 Starting standalone AI pricing data ingestion...\n');

    // Ensure AI providers exist in the database
    await sql`
      INSERT INTO providers (slug, name) VALUES
      ('openai', 'OpenAI'),
      ('anthropic', 'Anthropic')
      ON CONFLICT (slug) DO NOTHING;
    `;

    const aiPipeline = new AIPricingPipeline(sql as any);
    const aiResults = await aiPipeline.run();
    
    aiResults.forEach((result: any) => {
      if (result.status === 'success') {
        console.log(`  ✅ ${result.provider.toUpperCase()}: ${result.count} AI configurations`);
      } else {
        console.log(`  ❌ ${result.provider.toUpperCase()}: ${result.message}`);
      }
    });

    console.log('\n✨ Standalone AI ingestion complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
