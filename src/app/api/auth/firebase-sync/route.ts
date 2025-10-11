import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { name, email, password },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("❌ Firebase Sync Error:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
