import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ensures fresh fetch every time

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email query parameter required" },
        { status: 400 }
      );
    }

    // ✅ Step 1: Get User and Validate
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Step 2: Force fresh fetch from DB (no caching)
    const foodScans = await prisma.foodScan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const medicines = await prisma.medicine.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    // ✅ Step 3: Return proper response
    return NextResponse.json(
      { success: true, foodScans, medicines },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [History API] Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch user history" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json(
        { error: "Missing id or type" },
        { status: 400 }
      );
    }

    // ✅ Delete based on record type
    if (type === "Ingredient") {
      await prisma.foodScan.delete({ where: { id } });
    } else if (type === "Medicine") {
      await prisma.medicine.delete({ where: { id } });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ [History API] Error deleting:", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
