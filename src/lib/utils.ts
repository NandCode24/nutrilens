import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ✅ Combine multiple class names safely with Tailwind Merge.
 * Example:
 *   cn("px-4 py-2", isActive && "bg-primary")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 🧠 Safely parse JSON without breaking the app.
 * Returns fallback value if parsing fails.
 *
 * Example:
 *   const data = safeJsonParse(jsonString, {});
 */
export function safeJsonParse<T = any>(str: string, fallback: T): T {
  try {
    if (typeof str !== "string") return fallback;
    return JSON.parse(str);
  } catch (error) {
    console.warn("⚠️ safeJsonParse failed:", error);
    return fallback;
  }
}
