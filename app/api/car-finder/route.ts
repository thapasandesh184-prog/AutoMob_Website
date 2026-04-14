import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      make,
      model,
      minYear,
      maxYear,
      minPrice,
      maxPrice,
      bodyStyle,
      transmission,
      fuelType,
      driveType,
      color,
      maxMileage,
      features,
      notes,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const parsedMinYear = minYear ? parseInt(minYear, 10) : null;
    const parsedMaxYear = maxYear ? parseInt(maxYear, 10) : null;
    const parsedMinPrice = minPrice ? parseFloat(minPrice) : null;
    const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : null;
    const parsedMaxMileage = maxMileage ? parseInt(maxMileage, 10) : null;

    const requestData = await prisma.carFinderRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        make: make || null,
        model: model || null,
        minYear: parsedMinYear,
        maxYear: parsedMaxYear,
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
        bodyStyle: bodyStyle || null,
        transmission: transmission || null,
        fuelType: fuelType || null,
        driveType: driveType || null,
        color: color || null,
        maxMileage: parsedMaxMileage,
        features: Array.isArray(features) ? features.join(", ") : features || null,
        notes: notes || null,
      },
    });

    return NextResponse.json(
      { success: true, id: requestData.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save car finder request:", error);
    return NextResponse.json(
      { error: "Failed to save car finder request" },
      { status: 500 }
    );
  }
}
