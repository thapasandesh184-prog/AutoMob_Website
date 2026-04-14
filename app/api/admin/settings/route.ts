import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAllSettings, setSetting, deleteSetting } from "@/lib/settings";

async function isAdmin(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  return !!token?.email;
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const settings = await getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { key, value, group } = body;
    if (!key || value === undefined) {
      return NextResponse.json({ error: "Missing key or value" }, { status: 400 });
    }
    await setSetting(key, value, group);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save setting:", error);
    return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    const entries = Object.entries(body).map(([key, value]) => ({
      key,
      value: String(value),
    }));
    for (const { key, value } of entries) {
      await setSetting(key, value);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }
    await deleteSetting(key);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete setting:", error);
    return NextResponse.json({ error: "Failed to delete setting" }, { status: 500 });
  }
}
