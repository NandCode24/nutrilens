import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// ✅ Fetch all scans & medicines for logged-in user
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    if (!decoded?.id) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // ✅ Fetch both FoodScan and Medicine data for the user
    const [foodLogs, medicineLogs] = await Promise.all([
      prisma.foodScan.findMany({
        where: { userId: decoded.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.medicine.findMany({
        where: { userId: decoded.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // ✅ Combine and format logs for UI
    const logs = [
      ...foodLogs.map((f) => ({
        id: f.id,
        title: f.ingredientsText?.slice(0, 50) || "Unnamed Ingredient",
        type: "Ingredient",
        description: f.nutritionSummary || "Ingredient scan log",
        time: f.createdAt.toISOString(),
      })),
      ...medicineLogs.map((m) => ({
        id: m.id,
        title: m.name,
        type: "Medicine",
        description: m.uses || "Medicine record",
        time: m.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("❌ History API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user history" },
      { status: 500 }
    );
  }
}
