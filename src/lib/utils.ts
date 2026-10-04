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

/**
 * 🎂 Calculate exact age dynamically from Date of Birth.
 */
export function calculateAge(dob: string | Date | null | undefined): number | null {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}
