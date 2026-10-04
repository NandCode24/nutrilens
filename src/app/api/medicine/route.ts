import { NextResponse } from "next/server";
import { groq, GROQ_TEXT_MODEL, GROQ_VISION_MODEL } from "@/lib/groq";
import prisma from "@/lib/prisma";
import { calculateAge } from "@/lib/utils";

export const runtime = "nodejs";

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
      const formData = await req.formData();
      const file = formData.get("file") as Blob | null;
      email = formData.get("email")?.toString() || null;
      const profileStr = formData.get("profile")?.toString() || "{}";

      try {
        profile = JSON.parse(profileStr);
      } catch {
        profile = {};
      }

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        imageBase64 = buffer.toString("base64");
        mimeType = (file as any).type || "image/jpeg";
      }
    }
    // 🧩 Handle application/json (for manual medicine name search)
    else if (contentType.includes("application/json")) {
      const body = await req.json();
      medicineName = body.medicineName || body.name || null;
      email = body.email || null;
      profile = body.profile || {};
    }

    if (!imageBase64 && !medicineName) {
      return NextResponse.json(
        { error: "Provide either a medicine label image or a medicine name" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Missing user email" },
        { status: 400 }
      );
    }

    // 🔍 Find user in DB to get their preferred language
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, preferredLanguage: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const preferredLanguage = user.preferredLanguage || "English";
    console.log("🌍 Preferred Language (from DB):", preferredLanguage);

    // 🧠 Prompt with personalization + language and non-medicine detection
    const prompt = `
You are AaharSnap — an expert multilingual AI health assistant.

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
- Age: ${profile.dob ? calculateAge(profile.dob) : (profile.age ?? "N/A")}
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
  "compatibility_score": 8,
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

    // 🚀 Send to Groq (Vision model if image, Text model if text)
    const messages: any[] = imageBase64
      ? [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${prompt}\n\nReturn only valid JSON object.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ]
      : [
          {
            role: "user",
            content: `${prompt}\n\nReturn only valid JSON object.`,
          },
        ];

    const modelToUse = imageBase64 ? GROQ_VISION_MODEL : GROQ_TEXT_MODEL;

    const completion = await groq.chat.completions.create({
      model: modelToUse,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const text = completion.choices[0]?.message?.content?.trim() || "{}";

    // Defensive: reject HTML responses
    if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
      console.warn("⚠️ Groq returned HTML instead of JSON");
      return NextResponse.json(
        { error: "Invalid response from AI (HTML detected)" },
        { status: 502 }
      );
    }

    // 🧩 Parse Groq output safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed: any = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { raw_output: text };

    // If model explicitly tells us this is NOT a medicine, return early without saving
    if (parsed && parsed.not_medicine) {
      console.log(
        "ℹ️ Medicine endpoint detected a non-medicine input. Returning suggestion."
      );
      return NextResponse.json(parsed);
    }

    // Validate presence of expected medicine keys
    if (!parsed || !parsed.medicine_name || !parsed.active_ingredients) {
      console.warn("⚠️ Groq did not return expected medicine structure:", parsed);
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

    // 🧠 Save complete Groq response in History table
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
