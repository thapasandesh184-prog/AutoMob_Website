import { NextResponse } from "next/server";

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_masked: process.env.DATABASE_URL
        ? process.env.DATABASE_URL.replace(/:([^@]+)@/, ":****@")
        : "NOT SET",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      NODE_ENV: process.env.NODE_ENV || "NOT SET",
    },
    tests: {},
  };

  // Test 1: Try to import PrismaClient
  try {
    const { PrismaClient } = await import("@prisma/client");
    results.tests.prisma_import = "OK";

    // Test 2: Try to instantiate PrismaClient
    const prisma = new PrismaClient();
    results.tests.prisma_instantiate = "OK";

    // Test 3: Try a simple raw query (doesn't require any tables)
    try {
      await prisma.$queryRaw`SELECT 1 as test`;
      results.tests.raw_query = "OK";
    } catch (err: any) {
      results.tests.raw_query = "FAILED";
      results.tests.raw_query_error = err.message || String(err);
      results.tests.raw_query_code = err.code || "N/A";
    }

    // Test 4: Try to count admin users
    try {
      const count = await prisma.adminUser.count();
      results.tests.admin_user_count = count;
    } catch (err: any) {
      results.tests.admin_user_count = "FAILED";
      results.tests.admin_user_error = err.message || String(err);
      results.tests.admin_user_code = err.code || "N/A";
    }

    // Test 5: Try to count vehicles
    try {
      const count = await prisma.vehicle.count();
      results.tests.vehicle_count = count;
    } catch (err: any) {
      results.tests.vehicle_count = "FAILED";
      results.tests.vehicle_error = err.message || String(err);
      results.tests.vehicle_code = err.code || "N/A";
    }

    await prisma.$disconnect();
  } catch (err: any) {
    results.tests.prisma_import = "FAILED";
    results.tests.prisma_import_error = err.message || String(err);
  }

  const allOk =
    results.tests.raw_query === "OK" &&
    typeof results.tests.admin_user_count === "number";

  return NextResponse.json(results, { status: allOk ? 200 : 500 });
}
