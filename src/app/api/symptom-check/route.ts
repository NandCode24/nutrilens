import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { buildSymptomPrompt } from "@/lib/symptomPrompt";
import { safeJsonParse } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json();

    if (!symptoms || symptoms.trim().length === 0) {
      return NextResponse.json(
        { error: "Symptoms are required" },
        { status: 400 }
      );
    }

    const prompt = buildSymptomPrompt(symptoms);
    const result = await geminiModel.generateContent(prompt);

    // ✅ Add debug here:
    if (!result?.response) {
      console.error("❌ Gemini returned no response:", result);
      throw new Error("No response from Gemini API");
    }

    const text = result.response.text();
    console.log("✅ Raw Gemini response:", text);

    const parsed = safeJsonParse(text,{});

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("❌ Backend error in /symptom-check:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze symptoms" },
      { status: 500 }
    );
  }
}
