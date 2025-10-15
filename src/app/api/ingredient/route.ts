import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // Get FormData
    const form = await req.formData();
    const file = form.get("file") as Blob | null;
    const profileStr = form.get("profile") as string | null;
    const email = form.get("email") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Missing user email" },
        { status: 400 }
      );
    }

    // 🧍 Get userId from email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse user profile
    let profile: Record<string, any> = {};
    if (profileStr) {
      try {
        profile = JSON.parse(profileStr);
      } catch {
        profile = {};
      }
    }

    // Convert image to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = (file as any).type || "image/jpeg";

    // 🧮 Generate image hash (for caching)
    const imageHash = crypto.createHash("sha256").update(buffer).digest("hex");

    // 🟢 Check if this image was already analyzed
    const existing = await prisma.foodScan.findFirst({
      where: {
        userId: user.id,
        ingredientsText: { contains: imageHash.slice(0, 32) },
      },
    });

    if (existing) {
      console.log("⚡ Returning cached Gemini result...");
      return NextResponse.json(existing.nutritionData);
    }

    console.log("🧠 Sending image to Gemini for OCR + nutrition analysis...");

    // Use Gemini OCR (no Tesseract)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0,
        topP: 0.1,
        topK: 1,
      },
    });

    // ⚠️ Do NOT change prompt (kept identical)
    const prompt = `
You are NutriLens — a professional AI nutritionist.

Analyze the attached image of a food or ingredient label.

Tasks:
1. Extract the text from the image (use your built-in OCR).
2. Identify the ingredients.
3. Identify emulsifiers, preservatives, or additives (and briefly describe their potential side effects).
4. Detect allergens.
5. Summarize the nutritional quality (sugar, sodium, protein, etc.).
6. Give a health score (0–10) based on the user’s profile.
7. Provide reasoning and a short recommendation.

User profile:
- Age: ${profile.age ?? "N/A"}
- Gender: ${profile.gender ?? "N/A"}
- Height: ${profile.heightCm ?? "N/A"} cm
- Weight: ${profile.weightKg ?? "N/A"} kg
- Allergies: ${profile.allergies?.join(", ") ?? "None"}
- Health Goal: ${profile.healthGoals ?? "General wellness"}
- Medical Conditions: ${profile.medicalConditions?.join(", ") ?? "None"}

Return ONLY valid JSON in this format:
{
  "ingredients": ["ingredient1", "ingredient2", ...],
  "additives_info": [
    {
      "name": "INS 471",
      "purpose": "emulsifier",
      "side_effect": "May cause mild digestive irritation"
    }
  ],
  "allergens": ["allergen1", "allergen2"],
  "nutrition_summary": "1–2 sentences summarizing the product’s nutrition",
  "personalized_score": 0–10,
  "reasoning": "Short reasoning behind the score",
  "recommendation": "Short actionable suggestion"
}
    `.trim();

    // Generate with image + prompt
    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType } },
      { text: prompt },
    ]);

    const text = result.response.text().trim();

    // Parse JSON safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_output: text };

    console.log("✅ Gemini response parsed successfully.");

    // Save to Prisma (FoodScan)
    await prisma.foodScan.create({
      data: {
        userId: user.id,
        imageUrl: null,
        ingredientsText: imageHash.slice(0, 64),
        ingredients: parsed.ingredients || [],
        allergens: parsed.allergens || [],
        nutritionSummary: parsed.nutrition_summary || "",
        rating: parsed.personalized_score || 0,
        reasoning: parsed.reasoning || "",
        recommendation: parsed.recommendation || "",
        nutritionData: parsed,
      },
    });

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("❌ Ingredient scan error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze ingredient label" },
      { status: 500 }
    );
  }
}
