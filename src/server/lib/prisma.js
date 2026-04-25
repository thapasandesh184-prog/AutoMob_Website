import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

if (!process.env.DATABASE_URL) {
  console.error('[PRISMA] WARNING: DATABASE_URL is not set');
}

// Retry helper with exponential backoff
async function connectWithRetry(client, maxRetries = 5, baseDelay = 500) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await client.$connect();
      console.log(`[PRISMA] Connected on attempt ${attempt}`);
      return true;
    } catch (err) {
      const isTimerPanic = err.message?.includes('timer has gone away') ||
                           err.message?.includes('PANIC') ||
                           err.message?.includes('code 101');
      console.error(`[PRISMA] Connect attempt ${attempt}/${maxRetries} failed: ${err.message}`);

      if (attempt === maxRetries) {
        console.error('[PRISMA] All connection attempts exhausted');
        return false;
      }

      // Jittered backoff: 500ms, 1s, 2s, 4s, 8s
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 200;
      console.log(`[PRISMA] Retrying in ${Math.round(delay)}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  return false;
}

function createClient() {
  const prismaOptions = {
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  };
  return new PrismaClient(prismaOptions);
}

// Create initial client
let prisma = globalForPrisma.prisma;
if (!prisma) {
  prisma = createClient();
  globalForPrisma.prisma = prisma;
}

// Export a helper that ensures connection before use
export async function ensurePrismaConnected() {
  try {
    // Quick health check
    await prisma.$queryRaw`SELECT 1 as health`;
    return prisma;
  } catch (err) {
    console.error(`[PRISMA] Health check failed: ${err.message}`);
    // Try to reconnect
    const connected = await connectWithRetry(prisma);
    if (!connected) {
      // Destroy and recreate client if reconnect failed
      try { await prisma.$disconnect(); } catch {}
      prisma = createClient();
      globalForPrisma.prisma = prisma;
      const reconnected = await connectWithRetry(prisma);
      if (!reconnected) {
        throw new Error('Prisma connection failed after all retries');
      }
    }
    return prisma;
  }
}

export { prisma };

// Graceful shutdown
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
