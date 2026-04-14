import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const parsed = {
      ...vehicle,
      features: vehicle.features ? vehicle.features.split(",") : [],
      images: vehicle.images ? vehicle.images.split(",") : [],
    };

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Failed to fetch vehicle:", error);
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 });
  }
}
