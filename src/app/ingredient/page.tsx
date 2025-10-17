"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import BackButton from "@/components/BackButton";
import ApiLoader from "@/components/ApiLoader";

export default function ScanIngredient() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isGeneric, setIsGeneric] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // 🧍 Load user info + profile
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedProfile = localStorage.getItem("userProfile");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.id);
      }

      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        const completeProfile = {
          name: parsedProfile.name || "User",
          age: parsedProfile.age || "N/A",
          gender: parsedProfile.gender || "N/A",
          heightCm: parsedProfile.heightCm || "N/A",
          weightKg: parsedProfile.weightKg || "N/A",
          allergies: parsedProfile.allergies || [],
          medicalConditions: parsedProfile.medicalConditions || [],
          healthGoals: parsedProfile.healthGoals || "General wellness",
        };
        setProfile(completeProfile);
        setIsGeneric(false);
      } else {
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

  const dataUrlToBlob = (dataUrl: string) => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) {
      alert("Please capture or upload an ingredient label first!");
      return;
    }

    setApiLoading(true);
    setLoading(true);
    setResult(null);
    setErrorMessage(null);

    try {
      let blob: Blob;
      if (image.startsWith("data:")) {
        blob = dataUrlToBlob(image);
      } else {
        const res = await fetch(image);
        if (!res.ok) throw new Error("Failed to fetch image data");
        blob = await res.blob();
      }

      const formData = new FormData();
      formData.append("file", blob, "label.jpg");
      formData.append("profile", JSON.stringify(profile || {}));

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser?.email) {
        formData.append("email", storedUser.email);
      }

      const response = await fetch("/api/ingredient", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        const msg = data?.error || "Failed to analyze image";
        setErrorMessage(msg);
        alert(`❌ ${msg}`);
      }
    } catch (err: any) {
      console.error("❌ Scan error:", err);
      const msg = err?.message || "An error occurred during analysis.";
      setErrorMessage(msg);
      alert(msg);
    } finally {
      setLoading(false);
      setApiLoading(false);
    }
  };

  return (
    <>
      {apiLoading && <ApiLoader />}
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center overflow-y-auto pb-10 transition-colors duration-300">
        <div className="absolute top-24 left-6 z-[60]">
          <BackButton />
        </div>

        {/* Header */}
        <div className="mt-28 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Scan Ingredient Label
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Center the label in the frame for the best results.
          </p>
        </div>

        {/* Scanner Frame */}
        <div className="relative mt-8 border-2 border-dashed border-primary rounded-2xl w-80 h-96 flex items-center justify-center overflow-hidden bg-card shadow-md">
          {image ? (
            <Image
              src={image}
              alt="Uploaded Label"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Camera className="text-primary w-8 h-8" />
              </div>
              <p className="text-muted-foreground mt-2 text-sm font-medium">
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
            className={`flex justify-center items-center bg-primary text-primary-foreground py-3 rounded-xl font-semibold transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
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

          {errorMessage && (
            <p className="text-center mt-1 text-sm text-red-500">
              {errorMessage}
            </p>
          )}
        </div>

        {/* ✅ Analysis Result */}
        {result && (
          <div className="mt-10 w-11/12 md:w-3/5 bg-card border border-border rounded-2xl shadow-xl p-6 animate-fadeIn relative transition-colors duration-300">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 opacity-30 rounded-full blur-3xl" />

            <h2 className="text-2xl font-bold text-center text-primary mb-4 drop-shadow-sm">
              🍃 AI Nutrition Analysis
            </h2>

            {!isGeneric ? (
              <p className="text-primary text-sm font-medium text-center mb-3">
                ✅ Personalized data loaded — health score tailored for you!
              </p>
            ) : (
              <p className="text-yellow-500 text-sm font-medium text-center mb-3">
                ⚠️ Showing general analysis (no personal data found)
              </p>
            )}

            <div className="space-y-5 relative z-10">
              {/* Ingredients */}
              <div>
                <p className="font-semibold text-lg text-foreground">
                  Ingredients:
                </p>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  {result.ingredients?.join(", ") || "Not found"}
                </p>
              </div>

              {/* Additives Info */}
              {result.additives_info?.length > 0 && (
                <div>
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
              <div>
                <p className="font-semibold text-lg text-foreground">
                  Allergens:
                </p>
                <p className="mt-1 text-muted-foreground">
                  {result.allergens?.length
                    ? result.allergens.join(", ")
                    : "None detected"}
                </p>
              </div>

              {/* Nutrition Summary */}
              <div>
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
                    {isGeneric ? "Health Score" : "Personalized Score"}
                  </p>

                  {/* Animated Score Circle */}
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

                  {/* Progress Bar */}
                  <div className="mt-5 h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ease-in-out 
                      ${
                        result.personalized_score >= 7
                          ? "bg-green-500"
                          : result.personalized_score >= 4
                            ? "bg-yellow-400"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${(Number(result.personalized_score) / 10) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Verdict */}
                  <p
                    className={`mt-3 font-semibold text-base transition-all ${
                      result.personalized_score >= 7
                        ? "text-green-500"
                        : result.personalized_score >= 4
                          ? "text-yellow-400"
                          : "text-red-500"
                    }`}
                  >
                    {result.personalized_score >= 7
                      ? "🌿 Excellent — Great nutritional balance!"
                      : result.personalized_score >= 4
                        ? "⚖️ Moderate — Okay in moderation."
                        : "🚫 Unhealthy — Consider healthier alternatives."}
                  </p>
                </div>
              )}

              {/* Reasoning */}
              {result.reasoning && (
                <div>
                  <p className="font-semibold text-lg text-foreground">
                    Reasoning:
                  </p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">
                    {result.reasoning}
                  </p>
                </div>
              )}

              {/* Recommendation */}
              {result.recommendation && (
                <div>
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
        )}
      </div>
    </>
  );
}
