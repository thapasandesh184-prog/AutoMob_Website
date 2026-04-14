import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });
    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Failed to fetch vehicle:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updateData: Record<string, any> = {};
    if (make !== undefined) updateData.make = String(make);
    if (model !== undefined) updateData.model = String(model);
    if (trim !== undefined) updateData.trim = trim ? String(trim) : null;
    if (year !== undefined) updateData.year = Number(year);
    if (price !== undefined) updateData.price = Number(price);
    if (msrp !== undefined) updateData.msrp = msrp != null ? Number(msrp) : null;
    if (mileage !== undefined) updateData.mileage = Number(mileage);
    if (stockNumber !== undefined) updateData.stockNumber = stockNumber ? String(stockNumber) : null;
    if (vin !== undefined) updateData.vin = vin ? String(vin) : null;
    if (bodyStyle !== undefined) updateData.bodyStyle = bodyStyle ? String(bodyStyle) : null;
    if (transmission !== undefined) updateData.transmission = transmission ? String(transmission) : null;
    if (engine !== undefined) updateData.engine = engine ? String(engine) : null;
    if (fuelType !== undefined) updateData.fuelType = fuelType ? String(fuelType) : null;
    if (driveType !== undefined) updateData.driveType = driveType ? String(driveType) : null;
    if (exteriorColor !== undefined) updateData.exteriorColor = exteriorColor ? String(exteriorColor) : null;
    if (interiorColor !== undefined) updateData.interiorColor = interiorColor ? String(interiorColor) : null;
    if (doors !== undefined) updateData.doors = doors != null ? Number(doors) : null;
    if (seats !== undefined) updateData.seats = seats != null ? Number(seats) : null;
    if (description !== undefined) updateData.description = String(description);
    if (features !== undefined) {
      updateData.features = Array.isArray(features)
        ? features.join(",")
        : String(features);
    }
    if (images !== undefined) {
      updateData.images = Array.isArray(images)
        ? images.join(",")
        : String(images);
    }
    if (status !== undefined) updateData.status = String(status);
    if (featured !== undefined) updateData.featured = Boolean(featured);

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Failed to update vehicle:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.vehicle.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete vehicle:", error);
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}
