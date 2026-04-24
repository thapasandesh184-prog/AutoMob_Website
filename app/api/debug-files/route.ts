import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const results: Record<string, any> = {};

  const candidates = [
    path.join(process.cwd(), ".next", "static"),
    path.join(process.cwd(), ".next", "standalone", ".next", "static"),
    path.join(process.cwd(), ".next", "standalone", "public"),
    path.join(process.cwd(), "public"),
  ];

  for (const dir of candidates) {
    try {
      const exists = fs.existsSync(dir);
      const stats = exists ? fs.statSync(dir) : null;
      const files = exists && stats?.isDirectory()
        ? fs.readdirSync(dir, { recursive: true }).slice(0, 50)
        : [];
      results[dir] = { exists, isDirectory: stats?.isDirectory(), fileCount: files.length, sampleFiles: files.slice(0, 10) };
    } catch (e: any) {
      results[dir] = { exists: false, error: e.message };
    }
  }

  const chunksDir = path.join(process.cwd(), ".next", "static", "chunks");
  if (fs.existsSync(chunksDir)) {
    try {
      const chunks = fs.readdirSync(chunksDir);
      results["chunks"] = {
        total: chunks.length,
        hasTilde: chunks.filter((f) => f.includes("~")).length,
        sample: chunks.slice(0, 15),
      };
    } catch (e: any) {
      results["chunks"] = { error: e.message };
    }
  }

  return NextResponse.json({
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    directories: results,
  });
}
