import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in .env");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);





if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in .env");
}



export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});