import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

// Log env status for debugging (visible in Hostinger runtime logs)
if (!process.env.DATABASE_URL) {
  console.error('[PRISMA] WARNING: DATABASE_URL is not set in environment');
}

// Prisma config optimized for shared hosting (Hostinger)
const prismaOptions = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
};

// Singleton pattern — critical for shared hosting to prevent multiple engine instances
export const prisma = globalForPrisma.prisma || new PrismaClient(prismaOptions);

// Cache in global for hot reloads in dev, but also safe in production
if (process.env.NODE_ENV !== 'production' || !globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown handlers
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
