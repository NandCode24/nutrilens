export function safeJsonParse(text: string) {
  try {
    // Find JSON array boundaries to cut away any noise
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("No JSON array found");
    const jsonText = text.slice(start, end + 1);
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("❌ JSON parsing error:", error);
    return [];
  }
}
