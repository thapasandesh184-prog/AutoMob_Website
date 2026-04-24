const path = require("path");

async function main() {
  const dir = path.join(__dirname);
  process.env.NODE_ENV = "production";
  process.chdir(dir);

  try {
    const { PrismaClient } = require("./node_modules/@prisma/client");
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log("[BOOT] Prisma connected successfully");
    if (typeof global !== "undefined") {
      global.prisma = prisma;
    }
  } catch (err) {
    console.warn("[BOOT] Prisma pre-connect warning (server will still start):", err.message);
  }

  require(path.join(dir, ".next", "standalone", "server.js"));
}

main().catch((err) => {
  console.error("[BOOT] Fatal error starting server:", err);
  process.exit(1);
});
