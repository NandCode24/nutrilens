import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      age,
      gender,
      heightCm,
      weightKg,
      dietType,
      healthGoals,
      medicalHistory,
      allergies,
    } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    // If user exists, update onboarding details
    const user = existingUser
      ? await prisma.user.update({
          where: { email },
          data: {
            name,
            age,
            gender,
            heightCm,
            weightKg,
            dietType,
            healthGoals,
            medicalHistory,
            allergies,
          },
        })
      : await prisma.user.create({
          data: {
            email,
            name,
            age,
            gender,
            heightCm,
            weightKg,
            dietType,
            healthGoals,
            medicalHistory,
            allergies,
            password: "placeholder", // ⚠️ You can remove or handle later when auth added
          },
        });

    return NextResponse.json({
      message: existingUser ? "User onboarding updated" : "User created",
      user,
    });
  } catch (error) {
    console.error("❌ Error saving onboarding data:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding details" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
