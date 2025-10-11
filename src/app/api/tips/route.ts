// src/app/api/tips/route.ts
import { NextResponse } from "next/server";
import { healthTips } from "@/app/tips/healthtips";

export async function GET() {
  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
  return NextResponse.json({ tip: randomTip });
}
