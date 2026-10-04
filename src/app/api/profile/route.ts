import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =======================
// 🔹 GET — Fetch user profile
// =======================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // console.log("📩 [Profile API] Email param:", email);

    if (!email) {
      return NextResponse.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      );
    }

    // ✅ Fetch user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // console.log("🧠 [Profile API] Prisma result:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    // console.error("❌ [Profile API] Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// =======================
// 🔹 PATCH — Update user profile
// =======================
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { email, ...updateData } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required for update" },
        { status: 400 }
      );
    }

    if (updateData.dob) {
      updateData.dob = new Date(updateData.dob);
    }
    delete updateData.age;

    // ✅ Update existing user in database
    const updatedUser = await prisma.user.update({
      where: { email },
      data: updateData,
    });

    // console.log("✅ [Profile API] Updated user successfully:", updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    // console.error("❌ [Profile API] Error updating profile:", error);

    // Handle Prisma "record not found" error
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "User not found for update" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
