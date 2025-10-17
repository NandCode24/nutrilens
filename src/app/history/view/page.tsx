"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, RefreshCw } from "lucide-react";
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
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mb-2" />
        Loading saved scan...
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 text-center">
        <p>No saved analysis found.</p>
        <p className="text-sm mt-1">Go back and select a previous record.</p>
      </div>
    );

  return (
    <>
      {reAnalyzing && <ApiLoader />}
      <div className="min-h-screen bg-gray-50 flex flex-col items-center overflow-y-auto pb-10">
        <div className="absolute top-24 left-6 z-[60]">
          <BackButton />
        </div>

        {/* Header */}
        <div className="mt-28 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            {type === "Ingredient"
              ? "🍃 AI Nutrition Analysis"
              : "💊 AI Medicine Analysis"}
          </h1>
          <p className="text-gray-500 mt-1">
            ✅ Personalized data loaded — health score tailored for you!
          </p>
        </div>

        {/* Re-analyze Button */}
        <div className="mt-8">
          <button
            onClick={handleReAnalyze}
            disabled={reAnalyzing}
            className={`flex justify-center items-center bg-green-500 text-white py-3 px-6 rounded-xl font-semibold transition-all ${
              reAnalyzing
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-green-600"
            }`}
          >
            {reAnalyzing ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />{" "}
                Re-analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 w-5 h-5" /> Recheck with Latest AI
              </>
            )}
          </button>
        </div>

        {/* Result Section */}
        <div className="mt-10 w-11/12 md:w-3/5 bg-gradient-to-b from-white to-green-50 rounded-2xl shadow-xl p-6 border border-green-200 relative animate-fadeIn">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-200 opacity-30 rounded-full blur-3xl" />

          {/* INGREDIENT VIEW */}
          {type === "Ingredient" && (
            <div className="space-y-5 text-gray-700 relative z-10">
              <h2 className="text-2xl font-bold text-center text-green-600 mb-4 drop-shadow-sm">
                🍃 AI Nutrition Analysis
              </h2>

              {/* Ingredients */}
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  Ingredients:
                </p>
                <p className="mt-1 text-gray-600 leading-relaxed">
                  {safeJoin(data.ingredients)}
                </p>
              </div>

              {/* Additives Info */}
              {data.additives_info?.length > 0 && (
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    Additives / Preservatives:
                  </p>
                  <div className="mt-2 space-y-2">
                    {data.additives_info.map((add: any, index: number) => (
                      <div
                        key={index}
                        className="bg-green-100/70 border border-green-200 rounded-xl px-4 py-2 shadow-sm"
                      >
                        <p className="font-medium text-green-700">
                          {add.name}{" "}
                          <span className="text-sm text-gray-700">
                            — {add.purpose}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 italic mt-1">
                          ⚠️ {add.side_effect}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  Allergens:
                </p>
                <p className="mt-1 text-gray-600">{safeJoin(data.allergens)}</p>
              </div>

              {/* Nutrition Summary */}
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  Nutrition Summary:
                </p>
                <p className="mt-1 text-gray-600 leading-relaxed">
                  {data.nutrition_summary || "N/A"}
                </p>
              </div>

              {/* Score */}
              {typeof data.personalized_score !== "undefined" && (
                <div className="text-center mt-6 relative">
                  <p className="font-semibold text-lg text-gray-800 mb-3">
                    Health Score
                  </p>

                  {/* Animated Score Circle */}
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

                  <p
                    className={`mt-3 font-semibold text-base transition-all ${
                      data.personalized_score >= 7
                        ? "text-green-600"
                        : data.personalized_score >= 4
                          ? "text-yellow-500"
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

              {/* Reasoning */}
              {data.reasoning && (
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    Reasoning:
                  </p>
                  <p className="mt-1 text-gray-600 leading-relaxed">
                    {data.reasoning}
                  </p>
                </div>
              )}

              {/* Recommendation */}
              {data.recommendation && (
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    Recommendation:
                  </p>
                  <p className="mt-1 text-gray-600 leading-relaxed">
                    {data.recommendation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* MEDICINE VIEW */}
          {type === "Medicine" && (
            <div className="space-y-5 text-gray-700 relative z-10">
              <h2 className="text-2xl font-bold text-center text-green-600 mb-4 drop-shadow-sm">
                💊 AI Medicine Analysis
              </h2>

              <p>
                <strong>Medicine Name:</strong>{" "}
                {data.medicine_name || "Unknown"}
              </p>
              <p>
                <strong>Active Ingredients:</strong>{" "}
                {safeJoin(data.active_ingredients)}
              </p>
              <p>
                <strong>Uses:</strong> {data.uses || "Not specified"}
              </p>
              <p>
                <strong>Side Effects:</strong> {safeJoin(data.side_effects)}
              </p>
              <p>
                <strong>Precautions:</strong> {safeJoin(data.precautions)}
              </p>

              {typeof data.compatibility_score !== "undefined" && (
                <div className="text-center mt-6 relative">
                  <p className="font-semibold text-lg text-gray-800 mb-3">
                    Compatibility Score
                  </p>

                  {/* Animated Score Circle */}
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
                  <strong>Reasoning:</strong>
                  <p>{data.reasoning}</p>
                </div>
              )}

              {data.recommendation && (
                <div>
                  <strong>Recommendation:</strong>
                  <p>{data.recommendation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="text-center text-gray-400 text-xs mt-10">
          © 2025{" "}
          <span className="font-semibold text-[#22C55E]">NutriLens</span> —
          Empowering Smarter Nutrition.
        </footer>
      </div>
    </>
  );
}
