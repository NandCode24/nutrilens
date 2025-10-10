import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // Detect content type (FormData for image, JSON for text search)
    const contentType = req.headers.get("content-type") || "";

    let imageBase64: string | null = null;
    let mimeType = "image/jpeg";
    let medicineName: string | null = null;
    let profile: Record<string, any> = {};
    let userId: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      // 🖼️ Handle image-based input
      const form = await req.formData();
      const file = form.get("file") as Blob | null;
      const profileStr = form.get("profile") as string | null;
      userId = form.get("userId") as string | null;

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
    } else if (contentType.includes("application/json")) {
      // 🔍 Handle text-based lookup
      const body = await req.json();
      medicineName = body.medicineName || null;
      profile = body.profile || {};
      userId = body.userId || null;

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

    // 🧠 Choose Gemini model
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: {
            temperature: 0, // 🔒 makes responses stable
            topP: 0.1,
            topK: 1,
          },
        });

    // 🧾 Dynamic prompt
    const prompt = `
You are NutriLens — an AI Health Assistant.
Analyze this medicine information.

${
  imageBase64
    ? "You are provided with an image of the medicine label. Extract and analyze it."
    : `You are provided with a medicine name: "${medicineName}". Analyze it.`
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

    // 🚀 Generate response
    const input = imageBase64
      ? [
          { inlineData: { data: imageBase64, mimeType } },
          { text: prompt },
        ]
      : [{ text: prompt }];

    const result = await model.generateContent(input);
    const text = result.response.text().trim();

    // 🧩 Parse JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_output: text };

    // 💾 Optional: Save to DB
    if (userId) {
      await prisma.medicine.create({
        data: {
          userId,
          name: parsed.medicine_name || medicineName || "Unknown",
          imageUrl: null,
          dosage: parsed.active_ingredients?.join(", ") || "",
          uses: parsed.uses || "",
          precautions: parsed.precautions?.join(", ") || "",
        },
      });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("💊 Medicine lookup error:", err);
    return NextResponse.json(
      { error: "Failed to analyze medicine label" },
      { status: 500 }
    );
  }
}