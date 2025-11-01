// src/app/medicine/page.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Camera, Search, Loader2 } from "lucide-react";
import BackButton from "@/components/BackButton";
import ApiLoader from "@/components/ApiLoader";
import { useLoading } from "@/context/LoadingContext";
import { useRouter } from "next/navigation";

export default function MedicineLookup() {
  const [image, setImage] = useState<string | null>(null);
  const [medicineName, setMedicineName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const { showLoader, hideLoader } = useLoading();
  const router = useRouter();

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

  const dataUrlToBlob = (dataUrl: string) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    return new Blob([u8arr], { type: mime });
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return alert("Please capture or upload a label first!");
    setApiLoading(true);
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
      setApiLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) return;
    setApiLoading(true);
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
      setApiLoading(false);
    }
  };

  // Helper: handle redirect to ingredient scanner
  const goToIngredientScanner = () => {
    router.push("/ingredient");
  };

  return (
    <>
      {apiLoading && <ApiLoader />}
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center pb-10 transition-colors duration-300">
        {/* Back Button */}
        <div className="absolute top-24 left-6 ">
          <BackButton />
        </div>

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-10 bg-card flex justify-between items-center px-8 py-4 border-b border-border shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              N
            </div>
            <span className="text-lg font-semibold text-foreground">
              NutriLens
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground text-sm">
              ?
            </button>
            <div className="w-8 h-8 rounded-full bg-muted" />
          </div>
        </header>

        {/* Main Section */}
        <div className="mt-28 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Scan or Search Medicine Label
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload the medicine label or search manually for safety insights.
          </p>
        </div>

        {/* Scanner Frame */}
        <div className="relative mt-8 border-2 border-dashed border-primary rounded-2xl w-80 h-96 flex items-center justify-center overflow-hidden bg-card shadow-md">
          {image ? (
            <Image
              src={image}
              alt="Medicine Label"
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

        {/* Buttons */}
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

          {/* Divider */}
          <div className="flex items-center justify-center text-muted-foreground text-sm">
            <span className="border-t border-border w-16"></span>
            <span className="px-3">OR</span>
            <span className="border-t border-border w-16"></span>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter medicine name"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="flex-1 px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? "..." : <Search className="w-5 h-5" />}
            </button>
          </form>

          {error && (
            <p className="text-destructive text-sm text-center mt-2">{error}</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-10 w-11/12 md:w-3/5 bg-card rounded-2xl shadow-lg p-6 border border-border transition-colors duration-300">
            {/* CASE A: Model says this is NOT a medicine */}
            {result.not_medicine ? (
              <div className="space-y-4 text-center">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  🔎 Not a Medicine
                </h2>
                <p className="text-muted-foreground">
                  {result.reason ||
                    "This input appears to be a food/product label rather than a medicine."}
                </p>

                <p className="text-sm text-muted-foreground">
                  {result.suggestion ||
                    "Please use the Ingredient Scanner for food/beverage/grocery labels."}
                </p>

                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={goToIngredientScanner}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:opacity-90 transition"
                  >
                    Open Ingredient Scanner
                  </button>
                  <button
                    onClick={() => {
                      setResult(null);
                      setImage(null);
                      setMedicineName("");
                    }}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-muted transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* CASE B: Valid medicine result — same as before */
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
                  💊 Medicine Analysis Result
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Medicine Name:</strong>{" "}
                    {result.medicine_name || "N/A"}
                  </p>
                  <p>
                    <strong className="text-foreground">
                      Active Ingredients:
                    </strong>{" "}
                    {result.active_ingredients?.join(", ") || "Unknown"}
                  </p>
                  <p>
                    <strong className="text-foreground">Uses:</strong>{" "}
                    {result.uses || "Not specified"}
                  </p>
                  <p>
                    <strong className="text-foreground">Side Effects:</strong>{" "}
                    {result.side_effects?.join(", ") || "None listed"}
                  </p>
                  <p>
                    <strong className="text-foreground">Precautions:</strong>{" "}
                    {result.precautions?.join(", ") || "None"}
                  </p>

                  {/* Compatibility Bar */}
                  <div className="mt-3 flex items-center">
                    <strong className="text-foreground">
                      Health Compatibility:
                    </strong>
                    <div className="ml-3 flex-1 h-3 rounded-full bg-muted overflow-hidden">
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
                          ? "text-green-500"
                          : result.compatibility_score >= 4
                            ? "text-yellow-400"
                            : "text-red-500"
                      }`}
                    >
                      {Number(result.compatibility_score || 0).toFixed(1)}
                    </span>
                  </div>

                  <p className="mt-2">
                    <strong className="text-foreground">Reasoning:</strong>{" "}
                    {result.reasoning || "No reasoning provided"}
                  </p>
                  <p>
                    <strong className="text-foreground">Recommendation:</strong>{" "}
                    {result.recommendation || "No recommendation available"}
                  </p>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => {
                        // simple close action
                        setResult(null);
                        setImage(null);
                        setMedicineName("");
                      }}
                      className="px-4 py-2 rounded-xl border border-border hover:bg-muted transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        // optional: navigate to history or save additional actions
                        router.push("/history");
                      }}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:opacity-90 transition"
                    >
                      View in History
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
