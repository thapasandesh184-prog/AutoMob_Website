import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // CRITICAL: Only allow registration if NO admin exists yet
    let adminCount = 0;
    try {
      adminCount = await prisma.adminUser.count();
    } catch (countErr: any) {
      console.error("[RegisterAdmin] Count query failed:", countErr);
      return NextResponse.json(
        {
          error: "Database connection failed while checking admin count.",
          details: countErr.message || String(countErr),
          code: countErr.code || "UNKNOWN",
        },
        { status: 500 }
      );
    }

    if (adminCount > 0) {
      return NextResponse.json(
        { error: "An admin already exists. Registration is closed." },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.adminUser.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      email: user.email,
      message: "Admin account created successfully",
    });
  } catch (error: any) {
    console.error("[RegisterAdmin] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create admin account",
        details: error.message || String(error),
        code: error.code || "UNKNOWN",
      },
      { status: 500 }
    );
  }
}
