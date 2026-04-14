import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, date, time, vehicleInterest, name, email, phone, notes } = body;

    if (!type || !date || !time || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        type,
        date,
        time,
        name,
        email,
        phone,
        notes: notes || null,
      },
    });

    return NextResponse.json(
      { success: true, id: appointment.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save appointment:", error);
    return NextResponse.json(
      { error: "Failed to save appointment" },
      { status: 500 }
    );
  }
}
