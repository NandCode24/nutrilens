"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import ApiLoader from "@/components/ApiLoader";

export default function HistoryDetailPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("selectedHistoryItem");
      if (!storedData) return;
      setResult(JSON.parse(storedData));
    } catch (err) {
      console.error("❌ Failed to load history item:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <ApiLoader />;

  if (!result)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-background text-foreground px-6">
        <BackButton />
        <p className="text-lg text-muted-foreground mt-6">
          No record data found. Please try again.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center pb-10 transition-colors duration-300">
      <div className="absolute top-24 left-6 z-[60]">
        <BackButton />
      </div>

      <div className="mt-28 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          🍃 Ingredient Details
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI Nutrition Analysis (from your saved scan)
        </p>
      </div>

      {/* ✅ Display saved scan result exactly like original */}
      <div className="mt-10 w-11/12 md:w-3/5 bg-card border border-border rounded-2xl shadow-xl p-6 transition-colors duration-300">
        {/* Ingredients */}
        <div>
          <p className="font-semibold text-lg text-foreground">Ingredients:</p>
          <p className="mt-1 text-muted-foreground leading-relaxed">
            {result.ingredients?.join(", ") || "Not found"}
          </p>
        </div>

        {/* Additives Info */}
        {result.additives_info?.length > 0 && (
          <div className="mt-5">
            <p className="font-semibold text-lg text-foreground">
              Additives / Preservatives:
            </p>
            <div className="mt-2 space-y-2">
              {result.additives_info.map((add: any, index: number) => (
                <div
                  key={index}
                  className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-2 shadow-sm"
                >
                  <p className="font-medium text-primary">
                    {add.name}{" "}
                    <span className="text-sm text-muted-foreground">
                      — {add.purpose}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground italic mt-1">
                    ⚠️ {add.side_effect}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Allergens */}
        <div className="mt-5">
          <p className="font-semibold text-lg text-foreground">Allergens:</p>
          <p className="mt-1 text-muted-foreground">
            {result.allergens?.length
              ? result.allergens.join(", ")
              : "None detected"}
          </p>
        </div>

        {/* Nutrition Summary */}
        <div className="mt-5">
          <p className="font-semibold text-lg text-foreground">
            Nutrition Summary:
          </p>
          <p className="mt-1 text-muted-foreground leading-relaxed">
            {result.nutrition_summary || "N/A"}
          </p>
        </div>

        {/* Health Score */}
        {typeof result.personalized_score !== "undefined" && (
          <div className="text-center mt-6 relative">
            <p className="font-semibold text-lg text-foreground mb-3">
              Personalized Score
            </p>
            <div className="relative flex justify-center items-center">
              <div
                className={`absolute w-36 h-36 rounded-full blur-2xl opacity-60 animate-pulse 
                ${
                  result.personalized_score >= 7
                    ? "bg-green-400"
                    : result.personalized_score >= 4
                      ? "bg-yellow-300"
                      : "bg-red-400 animate-[shake_0.6s_ease-in-out_infinite]"
                }`}
              ></div>
              <div
                className={`relative z-10 flex flex-col items-center justify-center w-28 h-28 rounded-full shadow-xl text-3xl font-bold text-white transition-all duration-700
                ${
                  result.personalized_score >= 7
                    ? "bg-gradient-to-br from-green-500 to-emerald-400"
                    : result.personalized_score >= 4
                      ? "bg-gradient-to-br from-yellow-400 to-amber-300 text-gray-800"
                      : "bg-gradient-to-br from-red-500 to-rose-400"
                }`}
              >
                {Number(result.personalized_score).toFixed(1)}
                <span className="text-xs mt-1 font-medium">/10</span>
              </div>
            </div>
          </div>
        )}

        {/* Reasoning */}
        {result.reasoning && (
          <div className="mt-5">
            <p className="font-semibold text-lg text-foreground">Reasoning:</p>
            <p className="mt-1 text-muted-foreground leading-relaxed">
              {result.reasoning}
            </p>
          </div>
        )}

        {/* Recommendation */}
        {result.recommendation && (
          <div className="mt-5">
            <p className="font-semibold text-lg text-foreground">
              Recommendation:
            </p>
            <p className="mt-1 text-muted-foreground leading-relaxed">
              {result.recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
