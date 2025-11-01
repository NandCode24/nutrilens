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

    // 🧠 Fetch user + language preference
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, preferredLanguage: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const preferredLanguage = user.preferredLanguage || "English";
    console.log("🌍 Preferred Language (from DB):", preferredLanguage);

    // ⚙️ Prepare Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 0, topP: 0.1, topK: 1 },
    });

    // 🧠 Prompt with personalization + language and non-medicine detection
    // IMPORTANT: we instruct the model to return a specific JSON shape in either case.
    const prompt = `
You are NutriLens — an expert multilingual AI health assistant.

The user's preferred language is **${preferredLanguage}**.
Write all textual parts (uses, reasoning, recommendations, etc.) **completely in ${preferredLanguage} only**.
Do not mix English and ${preferredLanguage}. Keep JSON keys in English, but values in ${preferredLanguage}.

Primary task: Determine whether the provided input is a medicine (a pharmaceutical product or OTC health product) or NOT (e.g., a food item, beverage, cosmetic, supplement without clear medicinal use, or other non-medicine product).

- If the input IS a medicine: analyze and return ONLY valid JSON in the format specified below.
- If the input is NOT a medicine (for example: food, beverage, snack, ingredient label, or general grocery product), do NOT attempt to analyze as medicine. Instead return ONLY valid JSON with a \`not_medicine\` flag, a short explanation in ${preferredLanguage}, and a suggestion to use the ingredient scanner.

Input:
${
  imageBase64
    ? "You are provided with an image of a product label. Extract and analyze the label."
    : `You are provided with a medicine name: "${medicineName}". Analyze it.`
}

User profile:
- Age: ${profile.age ?? "N/A"}
- Gender: ${profile.gender ?? "N/A"}
- Allergies: ${Array.isArray(profile.allergies) ? profile.allergies.join(", ") : "None"}
- Medical conditions: ${Array.isArray(profile.medicalConditions) ? profile.medicalConditions.join(", ") : "None"}
- Health Goal: ${profile.goal ?? "General wellness"}

**If this is a MEDICINE** (pharmaceutical or OTC product), return EXACTLY this JSON (keys in English). All textual values must be written completely in ${preferredLanguage}:

{
  "medicine_name": "string",
  "active_ingredients": ["string"],
  "uses": "short summary written fully in ${preferredLanguage}",
  "side_effects": ["string values in ${preferredLanguage}"],
  "precautions": ["string values in ${preferredLanguage}"],
  "compatibility_score": 0,
  "reasoning": "short reasoning in ${preferredLanguage}",
  "recommendation": "personalized advice in ${preferredLanguage}"
}

**If this is NOT a medicine** (food, beverage, cosmetic, supplement without medicinal claims, household product, etc.), return EXACTLY this JSON (keys in English). All textual values must be written completely in ${preferredLanguage}:

{
  "not_medicine": true,
  "reason": "short explanation in ${preferredLanguage} why this is not a medicine (e.g., it's a food label, beverage, cosmetic, etc.)",
  "suggestion": "short message in ${preferredLanguage} telling the client to use the ingredient scanner or appropriate flow"
}

Do NOT include any additional keys. Do NOT return HTML or plain text. Return only valid JSON object.
`.trim();

    const input = imageBase64
      ? [{ inlineData: { data: imageBase64, mimeType } }, { text: prompt }]
      : [{ text: prompt }];

    // 🚀 Send to Gemini
    const result = await model.generateContent(input);
    const text = result.response.text().trim();

    // Defensive: reject HTML responses
    if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
      console.warn("⚠️ Gemini returned HTML instead of JSON");
      return NextResponse.json(
        { error: "Invalid response from Gemini (HTML detected)" },
        { status: 502 }
      );
    }

    // 🧩 Parse Gemini output safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed: any = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { raw_output: text };

    // If model explicitly tells us this is NOT a medicine, return early without saving
    if (parsed && parsed.not_medicine) {
      console.log(
        "ℹ️ Medicine endpoint detected a non-medicine input. Returning suggestion."
      );
      // Ensure suggestion/reason exist, but don't save to DB
      return NextResponse.json(parsed);
    }

    // Validate presence of expected medicine keys
    if (!parsed || !parsed.medicine_name || !parsed.active_ingredients) {
      console.warn(
        "⚠️ Gemini did not return expected medicine structure:",
        parsed
      );
      return NextResponse.json(
        { error: "Model did not return valid medicine data" },
        { status: 502 }
      );
    }

    // 🗄️ Save Medicine details to DB
    await prisma.medicine.create({
      data: {
        userId: user.id,
        name: parsed.medicine_name || medicineName || "Unknown",
        imageUrl: null,
        dosage: parsed.active_ingredients?.join(", ") || "",
        uses: parsed.uses || "",
        precautions: Array.isArray(parsed.precautions)
          ? parsed.precautions.join(", ")
          : parsed.precautions || "",
      },
    });

    // 🧠 Save complete Gemini response in History table
    await prisma.history.create({
      data: {
        email,
        type: "medicine",
        data: parsed,
      },
    });

    console.log("💊 Saved medicine analysis to History successfully.");
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("💊 Medicine lookup error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze medicine label" },
      { status: 500 }
    );
  }
}
