import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

if (!process.env.DATABASE_URL) {
  console.error('[PRISMA] WARNING: DATABASE_URL is not set');
}

const prismaOptions = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
};

export const prisma = globalForPrisma.prisma || new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== 'production' || !globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

process.on('beforeExit', async () => {
  try { await prisma.$disconnect(); } catch {}
});

process.on('SIGINT', async () => {
  try { await prisma.$disconnect(); } catch {}
  process.exit(0);
});

process.on('SIGTERM', async () => {
  try { await prisma.$disconnect(); } catch {}
  process.exit(0);
});
