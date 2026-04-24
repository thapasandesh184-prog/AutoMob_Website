import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return !!session?.user?.email;
}

function generateSlug(year: number, make: string, model: string) {
  return `${year}-${make}-${model}`.toLowerCase().replace(/\s+/g, "-");
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000,
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      make,
      model,
      trim,
      year,
      price,
      msrp,
      mileage,
      stockNumber,
      vin,
      bodyStyle,
      transmission,
      engine,
      fuelType,
      driveType,
      exteriorColor,
      interiorColor,
      doors,
      seats,
      description,
      features,
      images,
      status,
      featured,
    } = body;

    if (!make || !model || !year || price == null || mileage == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const baseSlug = generateSlug(Number(year), String(make), String(model));
    let slug = baseSlug;
    const existing = await prisma.vehicle.findUnique({ where: { slug } });
    if (existing) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const featuresString = Array.isArray(features)
      ? features.join(",")
      : String(features ?? "");
    const imagesString = Array.isArray(images)
      ? images.join(",")
      : String(images ?? "");

    const vehicle = await prisma.vehicle.create({
      data: {
        slug,
        make: String(make),
        model: String(model),
        trim: trim ? String(trim) : null,
        year: Number(year),
        price: Number(price),
        msrp: msrp != null ? Number(msrp) : null,
        mileage: Number(mileage),
        stockNumber: stockNumber ? String(stockNumber) : null,
        vin: vin ? String(vin) : null,
        bodyStyle: bodyStyle ? String(bodyStyle) : null,
        transmission: transmission ? String(transmission) : null,
        engine: engine ? String(engine) : null,
        fuelType: fuelType ? String(fuelType) : null,
        driveType: driveType ? String(driveType) : null,
        exteriorColor: exteriorColor ? String(exteriorColor) : null,
        interiorColor: interiorColor ? String(interiorColor) : null,
        doors: doors != null ? Number(doors) : null,
        seats: seats != null ? Number(seats) : null,
        description: String(description ?? ""),
        features: featuresString,
        images: imagesString,
        status: String(status || "available"),
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Failed to create vehicle:", error);
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
