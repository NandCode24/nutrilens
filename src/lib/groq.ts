import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️ Missing GROQ_API_KEY in .env");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export const GROQ_TEXT_MODEL = "openai/gpt-oss-120b";
export const GROQ_VISION_MODEL = "qwen/qwen3.8-27b";
