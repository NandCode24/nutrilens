// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in .env");
}

// ✅ Correct for @google/generative-ai v0.24.1 (v1 API)
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);