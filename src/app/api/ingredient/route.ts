// src/app/api/ingredient/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import os from "os";
import path from "path";
import tesseract from "node-tesseract-ocr";
import prisma from "@/lib/prisma";
import { genAI } from "@/lib/gemini"; // ✅ Gemini client from your lib

export const runtime = "nodejs";

// OCR config
const TESSERACT_CONFIG = {
  lang: "eng",
  oem: 1,
  psm: 3,
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as Blob | null;
    const profileStr = form.get("profile") as string | null;
    const userId = form.get("userId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
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

    // 🖼️ Save image temporarily
    const arrayBuffer = await file.arrayBuffer();
    const tmpPath = path.join(os.tmpdir(), `ocr_${Date.now()}.jpg`);
    await fs.writeFile(tmpPath, Buffer.from(arrayBuffer));

    // 🧾 Run OCR
    console.log("📸 Running OCR...");
    const ocrText = await tesseract.recognize(tmpPath, TESSERACT_CONFIG).catch(() => "");
    await fs.unlink(tmpPath).catch(() => {});

    if (!ocrText.trim()) {
      throw new Error("OCR failed to extract text");
    }

    console.log("✅ OCR Extracted Text:", ocrText.slice(0, 200), "...");

    // 💬 GEMINI PROMPT — nutrition + personalization
    const prompt = `
You are NutriLens — a professional AI nutrition expert.

Here is the extracted food label text:
"""
${ocrText}
"""

User profile:
- Age: ${profile.age ?? "N/A"}
- Gender: ${profile.gender ?? "N/A"}
- Height: ${profile.heightCm ?? "N/A"} cm
- Weight: ${profile.weightKg ?? "N/A"} kg
- Allergies: ${profile.allergies?.join(", ") ?? "None"}
- Health Goal: ${profile.healthGoals ?? "General wellness"}
- Medical Conditions: ${profile.medicalConditions?.join(", ") ?? "None"}

Please analyze this ingredient list and return **only valid JSON**, no explanations or markdown, following this exact format:

{
  "ingredients": ["ingredient1", "ingredient2", ...],
  "Preservations": "each preservation or emulsifier or addictives with it's 3-4 word side effects",
  "allergens": ["allergen1", "allergen2", ...],
  "nutrition_summary": "1–2 sentence summary about nutritional quality (sugar, fat, sodium, protein, etc.)",
  "personalized_score": 0–10, 
  "reasoning": "Short explanation for score based on the user's profile",
  "recommendation": "Short actionable recommendation (e.g., prefer low sodium, avoid sugar, etc.)"
}
`;

    console.log("🤖 Sending to Gemini...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const geminiResult = await model.generateContent(prompt);
    const responseText = geminiResult.response.text().trim();

    // Extract JSON safely
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_output: responseText };

    // 📦 Save to database
    if (userId) {
      await prisma.foodScan.create({
        data: {
          userId,
          imageUrl: null,
          ingredientsText: parsed.ingredients?.join(", ") || ocrText.slice(0, 200),
          nutritionData: parsed,
          rating: parsed.personalized_score ?? 0,
        },
      });
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("❌ Ingredient scan error:", err);
    return NextResponse.json({ error: err.message || "Failed to analyze image" }, { status: 500 });
  }
}