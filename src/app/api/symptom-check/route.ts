import { NextResponse } from "next/server";
import { groq, GROQ_TEXT_MODEL } from "@/lib/groq";
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
    const completion = await groq.chat.completions.create({
      model: GROQ_TEXT_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content || "{}";
    console.log("✅ Raw Groq response:", text);

    const parsed = safeJsonParse(text, {});

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("❌ Backend error in /symptom-check:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze symptoms" },
      { status: 500 }
    );
  }
}
