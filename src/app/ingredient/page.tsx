"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";

export default function ScanIngredient() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isGeneric, setIsGeneric] = useState(false);

  // 🧍 Load user profile from localStorage (set during onboarding)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userProfile");
      if (storedUser) {
        setProfile(JSON.parse(storedUser));
        setIsGeneric(false);
      } else {
        // fallback: general profile
        setProfile({
          goal: "General wellness",
          dietType: "None",
          allergies: [],
          medicalConditions: [],
        });
        setIsGeneric(true);
      }
    } catch {
      setProfile({
        goal: "General wellness",
        dietType: "None",
        allergies: [],
        medicalConditions: [],
      });
      setIsGeneric(true);
    }
  }, []);

  // 📸 Upload / Capture image
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 🧠 Analyze image using backend (Gemini API)
  const handleScan = async () => {
    if (!image) {
      alert("Please capture or upload an ingredient label first!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(image);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob, "label.jpg");
      formData.append("profile", JSON.stringify(profile));

      const response = await fetch("/api/ingredient", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        alert(`❌ ${data.error || "Failed to analyze image"}`);
      }
    } catch (err) {
      console.error("Scan error:", err);
      alert("An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center overflow-y-auto pb-10">
      {/* Header Section */}
      <div className="mt-28 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Scan Ingredient Label
        </h1>
        <p className="text-gray-500 mt-1">
          Center the label in the frame for the best results.
        </p>
      </div>

      {/* Scanner Frame */}
      <div className="relative mt-8 border-2 border-dashed border-green-400 rounded-2xl w-80 h-96 flex items-center justify-center overflow-hidden bg-white shadow-sm">
        {image ? (
          <Image
            src={image}
            alt="Uploaded Label"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Camera className="text-green-500 w-8 h-8" />
            </div>
            <p className="text-gray-600 mt-2 text-sm font-medium">
              Tap to capture
            </p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleUpload}
        />
      </div>

      {/* Scan Button */}
      <div className="mt-8 w-80 flex flex-col space-y-4">
        <button
          onClick={handleScan}
          disabled={loading}
          className={`flex justify-center items-center bg-green-500 text-white py-3 rounded-xl font-semibold transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" /> Analyzing...
            </>
          ) : (
            "Scan Now"
          )}
        </button>
      </div>

      {/* Analysis Result */}
      {result && (
        <div className="mt-10 w-11/12 md:w-3/5 bg-white rounded-2xl shadow-lg p-6 border border-green-100 animate-fadeIn">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            🍃 AI Analysis Result
          </h2>

          {/* ⚠️ If using generic profile */}
          {isGeneric && (
            <p className="text-yellow-600 text-sm font-medium text-center mb-3">
              ⚠️ Personalized data not found — showing general health rating.
            </p>
          )}

          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Ingredients:</strong>{" "}
              {result.ingredients?.join(", ") || "Not found"}
            </p>
            <p className="text-gray-700">
              <strong>Allergens:</strong>{" "}
              {result.allergens?.length
                ? result.allergens.join(", ")
                : "None detected"}
            </p>
            <p className="text-gray-700">
              <strong>Nutrition Summary:</strong>{" "}
              {result.nutrition_summary || "N/A"}
            </p>

            {/* Personalized Score Bar */}
            {typeof result.personalized_score !== "undefined" && (
              <div className="flex items-center justify-between mt-3">
                <p className="text-gray-700">
                  <strong>
                    {isGeneric ? "Health Score:" : "Personalized Score:"}
                  </strong>{" "}
                  <span
                    className={`font-bold ${
                      result.personalized_score >= 7
                        ? "text-green-600"
                        : result.personalized_score >= 4
                          ? "text-yellow-500"
                          : "text-red-600"
                    }`}
                  >
                    {result.personalized_score.toFixed(1)}
                  </span>
                </p>
                <div className="h-2 flex-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      result.personalized_score >= 7
                        ? "bg-green-500"
                        : result.personalized_score >= 4
                          ? "bg-yellow-400"
                          : "bg-red-500"
                    }`}
                    style={{
                      width: `${(result.personalized_score / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {result.reasoning && (
              <p className="text-gray-700 mt-2">
                <strong>Reasoning:</strong> {result.reasoning}
              </p>
            )}
            {result.recommendation && (
              <p className="text-gray-700">
                <strong>Recommendation:</strong> {result.recommendation}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
