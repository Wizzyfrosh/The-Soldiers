import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Testing connection to Neon PostgreSQL...');
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Connection SUCCESS:', result);
  } catch (err) {
    console.error('Connection FAILED:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
