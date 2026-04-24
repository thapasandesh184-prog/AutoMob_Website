import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL || "";

  // Parse the URL safely
  let parsed: {
    username?: string;
    passwordMasked?: string;
    host?: string;
    port?: string;
    database?: string;
    params?: string;
    passwordHasSpecialChars?: boolean;
  } = {};

  try {
    const u = new URL(url);
    parsed = {
      username: u.username,
      passwordMasked: u.password ? "*".repeat(u.password.length) : "EMPTY",
      host: u.hostname,
      port: u.port,
      database: u.pathname.replace("/", ""),
      params: u.search,
      passwordHasSpecialChars: u.password
        ? /[@#:?&=%\/]/.test(u.password)
        : false,
    };
  } catch {
    parsed = { username: "INVALID_URL" };
  }

  // Test 1: Try importing PrismaClient
  let prismaImport = "unknown";
  let prismaInstantiate = "unknown";
  let rawQuery = "unknown";
  let rawQueryError = "";
  let adminCount = "unknown";
  let adminError = "";

  try {
    const { PrismaClient } = await import("@prisma/client");
    prismaImport = "OK";

    const prisma = new PrismaClient();
    prismaInstantiate = "OK";

    try {
      await prisma.$queryRaw`SELECT 1 as test`;
      rawQuery = "OK";
    } catch (e: any) {
      rawQuery = "FAILED";
      rawQueryError = e.message || String(e);
    }

    try {
      const count = await prisma.adminUser.count();
      adminCount = String(count);
    } catch (e: any) {
      adminCount = "FAILED";
      adminError = e.message || String(e);
    }

    await prisma.$disconnect();
  } catch (e: any) {
    prismaImport = "FAILED: " + (e.message || String(e));
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
    database_url_parsed: parsed,
    tests: {
      prismaImport,
      prismaInstantiate,
      rawQuery,
      rawQueryError,
      adminCount,
      adminError,
    },
    troubleshooting: {
      possible_causes: [
        "Password in DATABASE_URL does not match the actual database user password",
        "Password contains special characters (@ # : / ? & = %) that are not URL-encoded correctly",
        "Username has a typo (check for extra/missing characters)",
        "Database name is wrong",
        "Hostinger MySQL requires SSL (try adding ?sslaccept=accept_invalid_certs)",
        "Database user does not have remote access privileges",
      ],
      fix_steps: [
        "1. Go to Hostinger → Databases → MySQL Databases",
        "2. Find user: u171879646_skayautoo",
        "3. Click 'Change Password' and set a SIMPLE password (letters and numbers only, no @ # etc.)",
        "4. Copy the EXACT password and paste it into urlencoder.org",
        "5. Copy the encoded result into DATABASE_URL",
        "6. If still failing, try adding &sslaccept=accept_invalid_certs to the end of DATABASE_URL",
      ],
    },
  });
}
