import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const trim = searchParams.get("trim");
    const bodyStyle = searchParams.get("bodyStyle");
    const transmission = searchParams.get("transmission");
    const fuelType = searchParams.get("fuelType");
    const driveType = searchParams.get("driveType");
    const exteriorColor = searchParams.get("exteriorColor");
    const status = searchParams.get("status") || "available";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minYear = searchParams.get("minYear");
    const maxYear = searchParams.get("maxYear");
    const minMileage = searchParams.get("minMileage");
    const maxMileage = searchParams.get("maxMileage");

    const where: any = {};
    if (featured === "true") where.featured = true;
    if (make) where.make = { contains: make, mode: "insensitive" };
    if (model) where.model = { contains: model, mode: "insensitive" };
    if (trim) where.trim = { contains: trim, mode: "insensitive" };
    if (bodyStyle) where.bodyStyle = { contains: bodyStyle, mode: "insensitive" };
    if (transmission) where.transmission = { contains: transmission, mode: "insensitive" };
    if (fuelType) where.fuelType = { contains: fuelType, mode: "insensitive" };
    if (driveType) where.driveType = { contains: driveType, mode: "insensitive" };
    if (exteriorColor) where.exteriorColor = { contains: exteriorColor, mode: "insensitive" };
    if (status) where.status = status;

    if (minPrice !== null || maxPrice !== null) {
      where.price = {};
      if (minPrice !== null) where.price.gte = Number(minPrice);
      if (maxPrice !== null) where.price.lte = Number(maxPrice);
    }
    if (minYear !== null || maxYear !== null) {
      where.year = {};
      if (minYear !== null) where.year.gte = Number(minYear);
      if (maxYear !== null) where.year.lte = Number(maxYear);
    }
    if (minMileage !== null || maxMileage !== null) {
      where.mileage = {};
      if (minMileage !== null) where.mileage.gte = Number(minMileage);
      if (maxMileage !== null) where.mileage.lte = Number(maxMileage);
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const parsed = vehicles.map((v) => ({
      ...v,
      features: v.features ? v.features.split(",") : [],
      images: v.images ? v.images.split(",") : [],
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
