import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let imageBase64: string | null = null;
    let mimeType = "image/jpeg";
    let medicineName: string | null = null;
    let profile: Record<string, any> = {};
    let email: string | null = null;

    // 🧩 Handle multipart form-data (for image upload)
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file") as Blob | null;
      const profileStr = form.get("profile") as string | null;
      email = form.get("email") as string | null;

      if (profileStr) {
        try {
          profile = JSON.parse(profileStr);
        } catch {
          profile = {};
        }
      }

      if (file) {
        const bytes = await file.arrayBuffer();
        imageBase64 = Buffer.from(bytes).toString("base64");
        mimeType = (file as any).type || "image/jpeg";
      }
    }
    // 🧩 Handle JSON input (manual text search)
    else if (contentType.includes("application/json")) {
      const body = await req.json();
      medicineName = body.medicineName || null;
      profile = body.profile || {};
      email = body.email || null;

      if (!medicineName)
        return NextResponse.json(
          { error: "No medicine name provided" },
          { status: 400 }
        );
    } else {
      return NextResponse.json(
        { error: "Unsupported request type" },
        { status: 400 }
      );
    }

    // 🧍 Validate user
    if (!email) {
      return NextResponse.json(
        { error: "Missing user email" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ⚙️ Prepare Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 0, topP: 0.1, topK: 1 },
    });

    // 🧠 Prompt with personalization
    const prompt = `
You are NutriLens — an AI Health Assistant.
Analyze this medicine information.

${
  imageBase64
    ? "You are provided with an image of the medicine label. Extract and analyze it."
    : 'You are provided with a medicine name: "' +
      medicineName +
      '". Analyze it.'
}

User profile:
- Age: ${profile.age ?? "N/A"}
- Gender: ${profile.gender ?? "N/A"}
- Allergies: ${profile.allergies?.join(", ") ?? "None"}
- Medical conditions: ${profile.medicalConditions?.join(", ") ?? "None"}
- Goal: ${profile.goal ?? "General wellness"}

Return ONLY valid JSON in this format:
{
  "medicine_name": "string",
  "active_ingredients": ["string"],
  "uses": "short summary of purpose",
  "side_effects": ["string"],
  "precautions": ["string"],
  "compatibility_score": 0-10,
  "reasoning": "why this score was given",
  "recommendation": "personalized advice (based on user profile)"
}
    `.trim();

    const input = imageBase64
      ? [{ inlineData: { data: imageBase64, mimeType } }, { text: prompt }]
      : [{ text: prompt }];

    // 🚀 Send to Gemini
    const result = await model.generateContent(input);
    const text = result.response.text().trim();

    // 🧩 Parse Gemini output safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_output: text };

    // 🗄️ Save Medicine details to DB
    await prisma.medicine.create({
      data: {
        userId: user.id,
        name: parsed.medicine_name || medicineName || "Unknown",
        imageUrl: null,
        dosage: parsed.active_ingredients?.join(", ") || "",
        uses: parsed.uses || "",
        precautions: parsed.precautions?.join(", ") || "",
      },
    });

    // 🧠 Save complete Gemini response in History table (NEW)
    await prisma.history.create({
      data: {
        email,
        type: "medicine",
        data: parsed,
      },
    });

    console.log("📜 Saved medicine analysis to History.");

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("💊 Medicine lookup error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze medicine label" },
      { status: 500 }
    );
  }
}
