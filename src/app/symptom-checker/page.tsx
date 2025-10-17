"use client";

import { useState } from "react";
import { Search, Share2, Bookmark } from "lucide-react";
import BackButton from "@/components/BackButton";
import { useLoading } from "@/context/LoadingContext";
import ApiLoader from "@/components/ApiLoader";

interface SymptomResult {
  condition: string;
  description: string;
  severity: "Self-care" | "Consult doctor" | "Emergency";
  probability?: number;
  advice?: string;
  warning_signs?: string;
}

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<SymptomResult[]>([]);
  const { showLoader, hideLoader } = useLoading();

  // 🧠 Handle API request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setApiLoading(true);
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/symptom-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (Array.isArray(data)) setResults(data);
      else throw new Error("Unexpected response format");
    } catch (err: any) {
      console.error("❌ API Error:", err);
      setError(err.message || "Failed to analyze symptoms. Try again.");
    } finally {
      setLoading(false);
      setApiLoading(false);
    }
  };

  // 🩺 Severity colors (light/dark aware)
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Self-care":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
      case "Consult doctor":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "Emergency":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getConfidenceLabel = (prob?: number) => {
    if (prob === undefined) return null;
    if (prob >= 0.75) return "High confidence";
    if (prob >= 0.5) return "Moderate confidence";
    return "Low confidence";
  };

  return (
    <>
      {apiLoading && <ApiLoader />}
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-4 transition-colors duration-300">
        {/* Back Button */}
        <div
          className="absolute top-24 left-6 z-[60]"
          onClick={() => {
            showLoader();
            setTimeout(() => {
              hideLoader();
              window.history.back();
            }, 600);
          }}
        >
          <BackButton />
        </div>

        {/* Header */}
        <div className="text-center max-w-xl">
          <h1 className="text-3xl font-semibold text-foreground">
            Symptom Checker
          </h1>
          <p className="text-muted-foreground mt-1">
            Describe your symptoms to discover possible conditions.
          </p>
        </div>

        {/* Input Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl mt-8 w-full max-w-2xl p-6 shadow-sm flex flex-col items-center transition-colors duration-300"
        >
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Enter your symptoms, e.g., 'sore throat, fever'"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["Headache", "Fatigue", "Nausea", "Dizziness"].map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() =>
                  setSymptoms((prev) =>
                    prev.includes(tag)
                      ? prev
                      : `${prev ? prev + ", " : ""}${tag}`
                  )
                }
                className="bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full hover:bg-primary/20 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="mt-6 bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Submit"}
          </button>
        </form>

        {/* Results */}
        <div className="w-full max-w-2xl mt-8 space-y-4">
          {loading && (
            <p className="text-center text-muted-foreground mt-6">
              Analyzing your symptoms...
            </p>
          )}

          {error && (
            <p className="text-center text-destructive mt-6">{error}</p>
          )}

          {!loading && !error && results.length > 0 && (
            <>
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col space-y-2 transition-colors duration-300"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.condition}
                    </h3>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${getSeverityColor(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {item.probability !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      {getConfidenceLabel(item.probability)} (
                      {(item.probability * 100).toFixed(0)}%)
                    </p>
                  )}

                  {item.advice && (
                    <p className="text-sm text-primary mt-1">
                      💡 <strong>Advice:</strong> {item.advice}
                    </p>
                  )}

                  {item.warning_signs && (
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                      ⚠️ <strong>Warning:</strong> {item.warning_signs}
                    </p>
                  )}

                  <div className="flex space-x-4 text-muted-foreground text-sm mt-2">
                    <button className="flex items-center space-x-1 hover:text-foreground transition">
                      <Bookmark size={14} /> <span>Save</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-foreground transition">
                      <Share2 size={14} /> <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground mt-8 text-center max-w-md leading-relaxed">
          ⚠️ This tool does not provide medical advice. It is for informational
          purposes only and should not replace consultation with a licensed
          healthcare professional.
        </p>
      </div>
    </>
  );
}
