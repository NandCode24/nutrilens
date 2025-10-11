import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

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

    // ✅ Step 1: Find user ID
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Step 2: Fetch data for this user
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

    return NextResponse.json({ foodScans, medicines });
  } catch (error) {
    console.error("❌ [History API] Error fetching:", error);
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

    // ✅ Delete record based on type
    if (type === "Ingredient") {
      await prisma.foodScan.delete({ where: { id } });
    } else if (type === "Medicine") {
      await prisma.medicine.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ [History API] Error deleting:", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
