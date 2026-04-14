import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      year,
      make,
      model,
      trim,
      vin,
      mileage,
      color,
      transmission,
      condition,
      mechanical,
      exterior,
      interior,
      firstName,
      lastName,
      email,
      phone,
      hasLoan,
      payoffAmount,
      photos,
      videos,
    } = body;

    if (!year || !make || !model || !mileage || !color || !transmission || !condition || !mechanical || !exterior || !interior || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const submission = await prisma.tradeInSubmission.create({
      data: {
        year,
        make,
        model,
        trim: trim || null,
        vin: vin || null,
        mileage,
        color,
        transmission,
        condition,
        mechanical,
        exterior,
        interior,
        firstName,
        lastName,
        email,
        phone,
        hasLoan: hasLoan === "yes",
        payoffAmount: payoffAmount || null,
        photos: photos || null,
        videos: videos || null,
      },
    });

    return NextResponse.json(
      { success: true, id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save trade-in submission:", error);
    return NextResponse.json(
      { error: "Failed to save trade-in submission" },
      { status: 500 }
    );
  }
}
