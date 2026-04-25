import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

// Prisma config optimized for shared hosting (Hostinger)
// - connection_limit=5: Hostinger MySQL allows limited concurrent connections
// - pool_timeout=0: Never timeout waiting for a connection (retry instead)
// - connect_timeout=10: Fail fast if DB is unreachable
const prismaOptions = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
};

// Only add datasource config if not already in DATABASE_URL
// (Hostinger DATABASE_URL should already have these params)
export const prisma = globalForPrisma.prisma || new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== 'production') {
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
