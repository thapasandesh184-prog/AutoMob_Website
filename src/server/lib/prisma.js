import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = global;

if (!process.env.DATABASE_URL) {
  console.error('[PRISMA] WARNING: DATABASE_URL is not set');
}

const prismaOptions = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
};

let prisma = globalForPrisma.prisma || new PrismaClient(prismaOptions);

// Use Prisma Accelerate when DATABASE_URL starts with prisma://
if (process.env.DATABASE_URL?.startsWith('prisma://')) {
  prisma = prisma.$extends(withAccelerate());
  console.log('[PRISMA] Using Prisma Accelerate');
}

if (process.env.NODE_ENV !== 'production' || !globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

export { prisma };

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
