import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ensures fresh fetch every time

// 🧾 Fetch user’s scan history (via email)
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

    // ✅ Step 1: Find user safely
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      console.error("❌ No user found for email:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Step 2: Fetch user’s scans
    const [foodScans, medicines] = await Promise.all([
      prisma.foodScan.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.medicine.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // ✅ Step 3: Return merged data
    return NextResponse.json(
      { success: true, foodScans, medicines },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [History API] Error fetching history:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user history" },
      { status: 500 }
    );
  }
}

// 🗑️ Delete an entry by id + type
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

    // ✅ Step 1: Validate deletion target
    if (type === "Ingredient") {
      await prisma.foodScan.delete({ where: { id } });
    } else if (type === "Medicine") {
      await prisma.medicine.delete({ where: { id } });
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }

    // ✅ Step 2: Return success
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("❌ [History API] Error deleting entry:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete entry" },
      { status: 500 }
    );
  }
}
