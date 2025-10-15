"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Camera, Search, Loader2 } from "lucide-react";

export default function MedicineLookup() {
  const [image, setImage] = useState<string | null>(null);
  const [medicineName, setMedicineName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // 🧍 Load user info + profile
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedProfile = localStorage.getItem("userProfile");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserEmail(parsed.email || null);
      }

      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        setProfile({
          age: "N/A",
          gender: "N/A",
          allergies: [],
          medicalConditions: [],
          goal: "General wellness",
        });
      }
    } catch {
      console.warn("⚠️ Failed to load profile");
    }
  }, []);

  // Convert image → Blob
  const dataUrlToBlob = (dataUrl: string) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    return new Blob([u8arr], { type: mime });
  };

  // Upload / Capture
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 🧠 Scan with Gemini API (via /api/medicine)
  const handleScan = async () => {
    if (!image) return alert("Please capture or upload a label first!");
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const blob = image.startsWith("data:")
        ? dataUrlToBlob(image)
        : await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append("file", blob, "medicine.jpg");
      formData.append("profile", JSON.stringify(profile || {}));
      if (userEmail) formData.append("email", userEmail);

      const res = await fetch("/api/medicine", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) setResult(data);
      else setError(data.error || "Analysis failed");
    } catch (err: any) {
      setError(err.message || "Error analyzing image");
    } finally {
      setLoading(false);
    }
  };

  // Manual text lookup
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/medicine", {
        method: "POST",
        body: JSON.stringify({ medicineName, profile, email: userEmail }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) setResult(data);
      else setError(data.error || "Search failed");
    } catch (err: any) {
      setError(err.message || "Error searching medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white flex justify-between items-center px-8 py-4 border-b border-gray-100 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="text-lg font-semibold text-gray-800">NutriLens</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 text-sm">
            ?
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
      </header>

      {/* Main Section */}
      <div className="mt-28 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Scan or Search Medicine Label
        </h1>
        <p className="text-gray-500 mt-1">
          Upload the medicine label or search manually for details and safety
          insights.
        </p>
      </div>

      {/* Scanner Frame */}
      <div className="relative mt-8 border-2 border-dashed border-green-400 rounded-2xl w-80 h-96 flex items-center justify-center overflow-hidden bg-white shadow-sm">
        {image ? (
          <Image
            src={image}
            alt="Medicine Label"
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

      {/* Buttons */}
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

        {/* Divider */}
        <div className="flex items-center justify-center text-gray-400 text-sm">
          <span className="border-t border-gray-200 w-16"></span>
          <span className="px-3">OR</span>
          <span className="border-t border-gray-200 w-16"></span>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter medicine name"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            className="flex-1 px-4 py-3 border text-gray-600 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
            disabled={loading}
          >
            {loading ? "..." : <Search className="w-5 h-5" />}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-10 w-11/12 md:w-3/5 bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            💊 Medicine Analysis Result
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Medicine Name:</strong> {result.medicine_name || "N/A"}
            </p>
            <p>
              <strong>Active Ingredients:</strong>{" "}
              {result.active_ingredients?.join(", ") || "Unknown"}
            </p>
            <p>
              <strong>Uses:</strong> {result.uses || "Not specified"}
            </p>
            <p>
              <strong>Side Effects:</strong>{" "}
              {result.side_effects?.join(", ") || "None listed"}
            </p>
            <p>
              <strong>Precautions:</strong>{" "}
              {result.precautions?.join(", ") || "None"}
            </p>
            <div className="mt-3 flex items-center">
              <strong>Health Compatibility:</strong>
              <div className="ml-3 flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    result.compatibility_score >= 7
                      ? "bg-green-500"
                      : result.compatibility_score >= 4
                        ? "bg-yellow-400"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: `${(result.compatibility_score / 10) * 100}%`,
                  }}
                />
              </div>
              <span
                className={`ml-3 font-bold text-lg ${
                  result.compatibility_score >= 7
                    ? "text-green-600"
                    : result.compatibility_score >= 4
                      ? "text-yellow-500"
                      : "text-red-600"
                }`}
              >
                {Number(result.compatibility_score).toFixed(1)}
              </span>
            </div>
            <p className="mt-2">
              <strong>Reasoning:</strong>{" "}
              {result.reasoning || "No reasoning provided"}
            </p>
            <p>
              <strong>Recommendation:</strong>{" "}
              {result.recommendation || "No recommendation available"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
