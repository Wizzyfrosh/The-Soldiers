import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_3aXqDClMu7oH@ep-blue-cake-b5w38u35.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require");

async function main() {
  console.log('Testing Neon Serverless HTTP/WS connection...');
  try {
    const result = await sql`SELECT 1 as test, current_timestamp as server_time`;
    console.log('SUCCESS! Connected to Neon PostgreSQL:', result);
  } catch (err) {
    console.error('FAILED:', err);
  }
}

main();
