import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return !!session?.user?.email;
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    switch (type) {
      case "contact":
        const contacts = await prisma.contactSubmission.findMany({
          orderBy: { createdAt: "desc" },
          take: 1000,
        });
        return NextResponse.json(contacts);
      case "finance":
        const finance = await prisma.financeApplication.findMany({
          orderBy: { createdAt: "desc" },
          take: 1000,
        });
        return NextResponse.json(finance);
      case "tradein":
        const tradeIns = await prisma.tradeInSubmission.findMany({
          orderBy: { createdAt: "desc" },
          take: 1000,
        });
        return NextResponse.json(tradeIns);
      case "appointments":
        const appointments = await prisma.appointment.findMany({
          orderBy: { createdAt: "desc" },
          take: 1000,
        });
        return NextResponse.json(appointments);
      case "carfinder":
        const carFinders = await prisma.carFinderRequest.findMany({
          orderBy: { createdAt: "desc" },
          take: 1000,
        });
        return NextResponse.json(carFinders);
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
