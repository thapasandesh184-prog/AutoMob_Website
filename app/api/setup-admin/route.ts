import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const setupSecret = process.env.SETUP_SECRET;

  if (setupSecret && token !== setupSecret) {
    return NextResponse.json({ error: "Invalid or missing token" }, { status: 403 });
  }

  try {
    // Check if admin already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email: "admin@skayautogroup.ca" },
    });

    if (existing) {
      return NextResponse.json({
        message: "Admin user already exists",
        email: existing.email,
      });
    }

    const adminPassword = process.env.ADMIN_PASSWORD || "admin@123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const user = await prisma.adminUser.create({
      data: {
        email: "admin@skayautogroup.ca",
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "Admin user created successfully",
      email: user.email,
    });
  } catch (error: any) {
    console.error("[Setup Admin] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create admin user",
        details: error.message || String(error),
        hint: "Make sure prisma migrate deploy has been run so the AdminUser table exists.",
      },
      { status: 500 }
    );
  }
}
