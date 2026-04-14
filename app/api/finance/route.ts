import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      dob,
      sin,
      street,
      city,
      state,
      zip,
      address,
      timeAtAddress,
      employer,
      occupation,
      income,
      timeAtJob,
      vehicleId,
      tradeIn,
      tradeInDetails,
      reference1,
      reference2,
      consent,
      message,
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const parsedIncome = income ? parseFloat(String(income).replace(/[^0-9.]/g, "")) : null;

    const application = await prisma.financeApplication.create({
      data: {
        name,
        email,
        phone,
        dob: dob || null,
        sin: sin || null,
        street: street || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        address: address || null,
        timeAtAddress: timeAtAddress || null,
        employer: employer || null,
        occupation: occupation || null,
        income: parsedIncome,
        timeAtJob: timeAtJob || null,
        vehicleId: vehicleId || null,
        tradeIn: !!tradeIn,
        tradeInDetails: tradeInDetails || null,
        reference1: reference1 || null,
        reference2: reference2 || null,
        consent: !!consent,
        message: message || null,
      },
    });

    return NextResponse.json(
      { success: true, id: application.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save finance application:", error);
    return NextResponse.json(
      { error: "Failed to save finance application" },
      { status: 500 }
    );
  }
}
