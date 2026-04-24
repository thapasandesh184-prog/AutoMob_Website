import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.adminUser.count();
    return NextResponse.json({ hasAdmin: count > 0, count });
  } catch (error: any) {
    console.error("[CheckAdmin] Error:", error);
    return NextResponse.json(
      {
        hasAdmin: false,
        error: error.message || String(error),
        code: error.code || "UNKNOWN",
        hint: "Database connection failed. Check DATABASE_URL and ensure the database server is reachable.",
      },
      { status: 500 }
    );
  }
}
