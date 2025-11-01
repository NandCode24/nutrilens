import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ensures fresh fetch every time

// 🧾 GET — Fetch user's unified history only (no legacy duplication)
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

    // ✅ Verify user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      console.error("❌ No user found for email:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Fetch only unified History entries
    const history = await prisma.history.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        history, // 🟢 Only modern unified data
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [History API] Error fetching history:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch history" },
      { status: 500 }
    );
  }
}

// 🗑️ DELETE — Remove entry by ID + type
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

    // ✅ Delete from appropriate table
    if (type.toLowerCase() === "ingredient") {
      await prisma.foodScan.delete({ where: { id } });
    } else if (type.toLowerCase() === "medicine") {
      await prisma.medicine.delete({ where: { id } });
    } else if (type.toLowerCase() === "history") {
      await prisma.history.delete({ where: { id } });
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("❌ [History API] Error deleting entry:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete entry" },
      { status: 500 }
    );
  }
}
