import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".png";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadsDir, filename);

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Failed to upload image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
