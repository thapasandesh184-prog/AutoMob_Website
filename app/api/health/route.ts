import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, string> = {};

  try {
    await prisma.$queryRaw`SELECT 1 as test`;
    checks.db = "connected";
  } catch (e: any) {
    checks.db = `error: ${e.message}`;
  }

  try {
    const adminCount = await prisma.adminUser.count();
    checks.admins = `${adminCount} found`;
  } catch (e: any) {
    checks.admins = `error: ${e.message}`;
  }

  try {
    const vehicleCount = await prisma.vehicle.count();
    checks.vehicles = `${vehicleCount} found`;
  } catch (e: any) {
    checks.vehicles = `error: ${e.message}`;
  }

  const allOk = checks.db === "connected";

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
