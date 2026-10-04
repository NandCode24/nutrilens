import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { groq, GROQ_VISION_MODEL } from "@/lib/groq";
import crypto from "crypto";
import { calculateAge } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 🧩 Get FormData safely
    const form = await req.formData();
    const file = form.get("file") as Blob | null;
    const profileStr = form.get("profile")?.toString() || "{}";
    const email = form.get("email")?.toString() || "guest@aaharsnap.ai";

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

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, preferredLanguage: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const preferredLanguage = user.preferredLanguage || "English";
    console.log("🌍 Preferred Language (from DB):", preferredLanguage);

    // 🧠 Parse user profile safely
    let profile: Record<string, any> = {};
    try {
      profile = JSON.parse(profileStr);
      console.log("✅ Received user profile:", profile);
    } catch (err) {
      console.warn("⚠️ Failed to parse user profile, using defaults.");
      profile = {
        age: "N/A",
        gender: "N/A",
        heightCm: "N/A",
        weightKg: "N/A",
        allergies: [],
        healthGoals: "General wellness",
        medicalConditions: [],
      };
    }

    // 🖼️ Convert image to Base64 (store actual image)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = (file as any).type || "image/jpeg";

    // 🔐 Generate image hash for caching
    const imageHash = crypto.createHash("sha256").update(buffer).digest("hex");

    // ⚡ Check cache (by hash)
    const existing = await prisma.foodScan.findFirst({
      where: { userId: user.id, imageUrl: imageHash },
    });

    if (existing) {
      console.log("⚡ Returning cached scan result...");
      return NextResponse.json(existing.nutritionData);
    }

    console.log("🧠 Sending image to Groq for OCR + nutrition analysis...");

    // 🧾 Prompt
    const prompt = `
You are AaharSnap — an expert multilingual AI nutritionist.

The user's preferred language is **${preferredLanguage}**.
⚠️ All explanations, summaries, and recommendations must be written **completely in ${preferredLanguage} only**.
Do NOT mix English and ${preferredLanguage}. Keep JSON keys in English, but all textual values in ${preferredLanguage}.

Analyze the attached image of a food or ingredient label.

Tasks:
1. Extract text (OCR).
2. Identify the ingredients.
3. Detect emulsifiers/preservatives (and describe their effects).
4. Detect allergens.
5. Summarize the nutritional quality (sugar, sodium, protein, etc.).
6. Give a health score (0–10) based on the user’s profile below.
7. Provide reasoning and a short recommendation.
8. Write all summaries and text fields in ${preferredLanguage}.

User profile:
- Age: ${profile.dob ? calculateAge(profile.dob) : (profile.age ?? "N/A")}
- Gender: ${profile.gender ?? "N/A"}
- Height: ${profile.heightCm ?? "N/A"} cm
- Weight: ${profile.weightKg ?? "N/A"} kg
- Allergies: ${Array.isArray(profile.allergies) ? profile.allergies.join(", ") : "None"}
- Health Goal: ${profile.healthGoals ?? "General wellness"}
- Medical Conditions: ${Array.isArray(profile.medicalConditions) ? profile.medicalConditions.join(", ") : "None"}

Return only valid JSON in this format:
{
  "ingredients": ["ingredient1", "ingredient2"],
  "additives_info": [
    { "name": "INS 471", "purpose": "emulsifier", "side_effect": "..." }
  ],
  "allergens": ["allergen1", "allergen2"],
  "nutrition_summary": "Written fully in ${preferredLanguage}",
  "personalized_score": 8,
  "reasoning": "Written fully in ${preferredLanguage}",
  "recommendation": "Written fully in ${preferredLanguage}"
}
`.trim();

    // 🚀 Send to Groq Vision model
    const completion = await groq.chat.completions.create({
      model: GROQ_VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${prompt}\n\nEnsure your response text is in ${preferredLanguage}. Do not use English. Return only valid JSON object.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const text = completion.choices[0]?.message?.content?.trim() || "{}";

    // 🧩 Parse JSON safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_output: text };

    console.log("✅ Groq response parsed successfully.");

    // 🗄️ Save to Prisma (FoodScan)
    await prisma.foodScan.create({
      data: {
        userId: user.id,
        imageUrl: `data:${mimeType};base64,${base64Image}`,
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

    // 🧠 Also save in History table
    await prisma.history.create({
      data: {
        email,
        type: "ingredient",
        data: parsed,
      },
    });

    console.log("📜 Saved scan result to History.");

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("❌ Ingredient scan error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze ingredient label" },
      { status: 500 }
    );
  }
}