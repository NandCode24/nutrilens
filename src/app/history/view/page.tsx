"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import BackButton from "@/components/BackButton";
import ApiLoader from "@/components/ApiLoader";

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
      <div className="min-h-screen bg-[#F7FFF9] py-10 px-5 sm:px-10 flex flex-col items-center text-gray-800 leading-relaxed">
        <div className="absolute top-24 left-6 z-[60]">
          <BackButton />
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-green-700 text-center mb-2">
          {type === "Ingredient"
            ? "🍃 AI Nutrition Analysis"
            : "💊 AI Medicine Analysis"}
        </h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          ✅ Personalized data loaded — health score tailored for you!
        </p>

        {/* Re-analyze button */}
        <button
          onClick={handleReAnalyze}
          disabled={reAnalyzing}
          className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition mb-10 disabled:opacity-70"
        >
          <RefreshCw
            className={`w-4 h-4 ${reAnalyzing ? "animate-spin" : ""}`}
          />
          {reAnalyzing ? "Re-analyzing..." : "Recheck with Latest AI"}
        </button>

        {/* Content */}
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-md border border-green-100 p-8 whitespace-pre-wrap text-[15px] font-[450]">
          {type === "Ingredient" && (
            <>
              <p className="mb-4">
                <strong>Ingredients:</strong>
                {"\n"}
                {data.ingredients?.join(", ") || "No ingredients detected."}
              </p>

              {data.additives_info?.length > 0 && (
                <div className="mb-4">
                  <strong>Additives / Preservatives:</strong>
                  {"\n\n"}
                  {data.additives_info.map((add: any, idx: number) => (
                    <div key={idx} className="mb-3">
                      <p>
                        <strong>{add.name}</strong> — {add.purpose}
                      </p>
                      <p className="text-gray-600">⚠️ {add.side_effect}</p>
                    </div>
                  ))}
                </div>
              )}

              <p className="mb-4">
                <strong>Allergens:</strong>
                {"\n"}
                {data.allergens?.length
                  ? data.allergens.join(", ")
                  : "None detected"}
              </p>

              <p className="mb-4">
                <strong>Nutrition Summary:</strong>
                {"\n"}
                {data.nutrition_summary || "No nutrition data available."}
              </p>

              {typeof data.personalized_score !== "undefined" && (
                <div className="mb-4">
                  <strong>Personalized Score</strong>
                  {"\n\n"}
                  <span className="text-3xl font-bold text-green-600">
                    {Number(data.personalized_score).toFixed(1)}
                  </span>{" "}
                  <span className="text-gray-600">/10</span>
                  {"\n"}
                  {data.personalized_score >= 7
                    ? "🌿 Excellent — Great nutritional balance!"
                    : data.personalized_score >= 4
                      ? "⚖️ Moderate — Okay in moderation."
                      : "🚫 Unhealthy — Consider healthier alternatives."}
                </div>
              )}

              {data.reasoning && (
                <p className="mb-4">
                  <strong>Reasoning:</strong>
                  {"\n"}
                  {data.reasoning}
                </p>
              )}

              {data.recommendation && (
                <p>
                  <strong>Recommendation:</strong>
                  {"\n"}
                  {data.recommendation}
                </p>
              )}
            </>
          )}

          {type === "Medicine" && (
            <>
              <p className="mb-4">
                <strong>Medicine Name:</strong>{" "}
                {data.medicine_name || "Unknown"}
              </p>
              <p className="mb-4">
                <strong>Active Ingredients:</strong>
                {"\n"}
                {data.active_ingredients?.join(", ") || "Unknown"}
              </p>
              <p className="mb-4">
                <strong>Uses:</strong>
                {"\n"}
                {data.uses || "Not specified"}
              </p>
              <p className="mb-4">
                <strong>Side Effects:</strong>
                {"\n"}
                {data.side_effects?.join(", ") || "None listed"}
              </p>
              <p className="mb-4">
                <strong>Precautions:</strong>
                {"\n"}
                {data.precautions?.join(", ") || "None"}
              </p>

              {typeof data.compatibility_score !== "undefined" && (
                <div className="mb-4">
                  <strong>Compatibility Score</strong>
                  {"\n\n"}
                  <span className="text-3xl font-bold text-green-600">
                    {Number(data.compatibility_score).toFixed(1)}
                  </span>{" "}
                  <span className="text-gray-600">/10</span>
                  {"\n"}
                  {data.compatibility_score >= 7
                    ? "🌿 Excellent compatibility."
                    : data.compatibility_score >= 4
                      ? "⚖️ Moderate compatibility — use with caution."
                      : "🚫 Poor compatibility — avoid using this medicine."}
                </div>
              )}

              {data.reasoning && (
                <p className="mb-4">
                  <strong>Reasoning:</strong>
                  {"\n"}
                  {data.reasoning}
                </p>
              )}
              {data.recommendation && (
                <p>
                  <strong>Recommendation:</strong>
                  {"\n"}
                  {data.recommendation}
                </p>
              )}
            </>
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
