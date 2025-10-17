"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import BackButton from "@/components/BackButton";
import ApiLoader from "@/components/ApiLoader";

// ✅ Helper: safely join arrays or return strings
const safeJoin = (val: any) =>
  Array.isArray(val)
    ? val.join(", ")
    : typeof val === "string"
      ? val
      : "Not available";

export default function HistoryViewPage() {
  const [data, setData] = useState<any>(null);
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [reAnalyzing, setReAnalyzing] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("selectedHistoryItem");
      const storedType = localStorage.getItem("selectedHistoryType");
      if (storedData && storedType) {
        setData(JSON.parse(storedData));
        setType(storedType);
      }
    } catch (err) {
      console.error("❌ Failed to load saved history:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReAnalyze = async () => {
    if (!data) return;
    setReAnalyzing(true);
    try {
      const storedUser = localStorage.getItem("user");
      const storedProfile = localStorage.getItem("userProfile");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const profile = storedProfile ? JSON.parse(storedProfile) : {};

      const formData = new FormData();
      formData.append("profile", JSON.stringify(profile));
      formData.append("email", user?.email || "guest@nutrilens.ai");

      const res = await fetch("/api/ingredient", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to re-analyze");
      setData(result);
      alert("✅ Re-analysis complete with latest AI model!");
    } catch (err: any) {
      console.error("❌ Re-analysis error:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setReAnalyzing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground bg-background">
        <Loader2 className="animate-spin w-6 h-6 mb-2" />
        Loading saved scan...
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground bg-background text-center">
        <p>No saved analysis found.</p>
        <p className="text-sm mt-1 text-muted-foreground">
          Go back and select a previous record.
        </p>
      </div>
    );

  return (
    <>
      {reAnalyzing && <ApiLoader />}
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center overflow-y-auto pb-10 transition-colors duration-300">
        <div className="absolute top-24 left-6 z-[60]">
          <BackButton />
        </div>

        {/* Header */}
        <div className="mt-28 text-center">
          <h1 className="text-2xl font-semibold text-foreground dark:text-brand-accent">
            {type === "Ingredient"
              ? "🍃 AI Nutrition Analysis"
              : "💊 AI Medicine Analysis"}
          </h1>
          <p className="text-sm text-muted-foreground dark:text-brand-muted mt-1">
            ✅ Personalized data loaded — tailored for you!
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-10 w-11/12 md:w-3/5 bg-card border border-border rounded-2xl shadow-xl p-6 relative animate-fadeIn transition-colors duration-300">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 opacity-30 rounded-full blur-3xl" />

          {/* INGREDIENT VIEW */}
          {type === "Ingredient" && (
            <div className="space-y-5 relative z-10">
              <h2 className="text-2xl font-bold text-center text-primary mb-4 drop-shadow-sm">
                🍃 Ingredient Breakdown
              </h2>

              <div>
                <p className="font-semibold text-lg text-foreground">
                  Ingredients:
                </p>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  {safeJoin(data.ingredients)}
                </p>
              </div>

              {data.additives_info?.length > 0 && (
                <div>
                  <p className="font-semibold text-lg text-foreground">
                    Additives / Preservatives:
                  </p>
                  <div className="mt-2 space-y-2">
                    {data.additives_info.map((add: any, index: number) => (
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

              <div>
                <p className="font-semibold text-lg text-foreground">
                  Allergens:
                </p>
                <p className="mt-1 text-muted-foreground">
                  {safeJoin(data.allergens)}
                </p>
              </div>

              <div>
                <p className="font-semibold text-lg text-foreground">
                  Nutrition Summary:
                </p>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  {data.nutrition_summary || "N/A"}
                </p>
              </div>

              {/* Health Score */}
              {typeof data.personalized_score !== "undefined" && (
                <div className="text-center mt-6 relative">
                  <p className="font-semibold text-lg text-foreground mb-3">
                    Health Score
                  </p>

                  <div className="relative flex justify-center items-center">
                    <div
                      className={`absolute w-36 h-36 rounded-full blur-2xl opacity-60 animate-pulse 
                      ${
                        data.personalized_score >= 7
                          ? "bg-green-400"
                          : data.personalized_score >= 4
                            ? "bg-yellow-300"
                            : "bg-red-400 animate-[shake_0.6s_ease-in-out_infinite]"
                      }`}
                    ></div>
                    <div
                      className={`relative z-10 flex flex-col items-center justify-center w-28 h-28 rounded-full shadow-xl text-3xl font-bold text-white transition-all duration-700
                      ${
                        data.personalized_score >= 7
                          ? "bg-gradient-to-br from-green-500 to-emerald-400"
                          : data.personalized_score >= 4
                            ? "bg-gradient-to-br from-yellow-400 to-amber-300 text-gray-800"
                            : "bg-gradient-to-br from-red-500 to-rose-400"
                      }`}
                    >
                      {Number(data.personalized_score).toFixed(1)}
                      <span className="text-xs mt-1 font-medium">/10</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-5 h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ease-in-out 
                      ${
                        data.personalized_score >= 7
                          ? "bg-green-500"
                          : data.personalized_score >= 4
                            ? "bg-yellow-400"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${(Number(data.personalized_score) / 10) * 100}%`,
                      }}
                    />
                  </div>

                  <p
                    className={`mt-3 font-semibold text-base transition-all ${
                      data.personalized_score >= 7
                        ? "text-green-500"
                        : data.personalized_score >= 4
                          ? "text-yellow-400"
                          : "text-red-500"
                    }`}
                  >
                    {data.personalized_score >= 7
                      ? "🌿 Excellent — Great nutritional balance!"
                      : data.personalized_score >= 4
                        ? "⚖️ Moderate — Okay in moderation."
                        : "🚫 Unhealthy — Consider healthier alternatives."}
                  </p>
                </div>
              )}

              {data.reasoning && (
                <div>
                  <p className="font-semibold text-lg text-foreground">
                    Reasoning:
                  </p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">
                    {data.reasoning}
                  </p>
                </div>
              )}

              {data.recommendation && (
                <div>
                  <p className="font-semibold text-lg text-foreground">
                    Recommendation:
                  </p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">
                    {data.recommendation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* MEDICINE VIEW */}
          {type === "Medicine" && (
            <div className="space-y-5 relative z-10">
              <h2 className="text-2xl font-bold text-center text-primary mb-4 drop-shadow-sm">
                💊 Medicine Overview
              </h2>

              <p className="text-muted-foreground">
                <strong className="text-foreground">Medicine Name:</strong>{" "}
                {data.medicine_name || "Unknown"}
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Active Ingredients:</strong>{" "}
                {safeJoin(data.active_ingredients)}
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Uses:</strong>{" "}
                {data.uses || "Not specified"}
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Side Effects:</strong>{" "}
                {safeJoin(data.side_effects)}
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Precautions:</strong>{" "}
                {safeJoin(data.precautions)}
              </p>

              {typeof data.compatibility_score !== "undefined" && (
                <div className="text-center mt-6 relative">
                  <p className="font-semibold text-lg text-foreground mb-3">
                    Compatibility Score
                  </p>

                  <div className="relative flex justify-center items-center">
                    <div
                      className={`absolute w-36 h-36 rounded-full blur-2xl opacity-60 animate-pulse 
                      ${
                        data.compatibility_score >= 7
                          ? "bg-green-400"
                          : data.compatibility_score >= 4
                            ? "bg-yellow-300"
                            : "bg-red-400 animate-[shake_0.6s_ease-in-out_infinite]"
                      }`}
                    ></div>
                    <div
                      className={`relative z-10 flex flex-col items-center justify-center w-28 h-28 rounded-full shadow-xl text-3xl font-bold text-white transition-all duration-700
                      ${
                        data.compatibility_score >= 7
                          ? "bg-gradient-to-br from-green-500 to-emerald-400"
                          : data.compatibility_score >= 4
                            ? "bg-gradient-to-br from-yellow-400 to-amber-300 text-gray-800"
                            : "bg-gradient-to-br from-red-500 to-rose-400"
                      }`}
                    >
                      {Number(data.compatibility_score).toFixed(1)}
                      <span className="text-xs mt-1 font-medium">/10</span>
                    </div>
                  </div>
                </div>
              )}

              {data.reasoning && (
                <div>
                  <p className="font-semibold text-lg text-foreground">
                    Reasoning:
                  </p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">
                    {data.reasoning}
                  </p>
                </div>
              )}

              {data.recommendation && (
                <div>
                  <p className="font-semibold text-lg text-foreground">
                    Recommendation:
                  </p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">
                    {data.recommendation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="text-center text-muted-foreground dark:text-brand-muted text-xs mt-10">
          © 2025{" "}
          <span className="font-semibold text-primary dark:text-brand-accent">
            NutriLens
          </span>{" "}
          — Empowering Smarter Nutrition.
        </footer>
      </div>
    </>
  );
}
