"use client";

import { useState } from "react";
import { Search, Share2, Bookmark } from "lucide-react";

interface SymptomResult {
  condition: string;
  description: string;
  severity: "Self-care" | "Consult doctor" | "Emergency";
}

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SymptomResult[]>([]);

  // Dummy submission handler for now
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setResults([]); // clear previous results

    // Simulate API delay for now
    setTimeout(() => {
      setResults([
        {
          condition: "Dehydration",
          description:
            "Occurs when you use or lose more fluid than you take in, and your body doesn't have enough water and other fluids to carry out its normal functions.",
          severity: "Self-care",
        },
        {
          condition: "Common Cold",
          description:
            "A mild viral infection of your nose and throat. It's usually harmless, although it might not feel that way.",
          severity: "Consult doctor",
        },
        {
          condition: "Allergic Reaction",
          description:
            "A condition in which the immune system reacts abnormally to a foreign substance. Severe reactions can be life-threatening.",
          severity: "Emergency",
        },
      ]);
      setLoading(false);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Self-care":
        return "bg-blue-50 text-blue-600";
      case "Consult doctor":
        return "bg-yellow-50 text-yellow-600";
      case "Emergency":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-semibold text-gray-900">
          Symptom Checker
        </h1>
        <p className="text-gray-500 mt-1">
          Describe your symptoms to discover possible conditions.
        </p>
      </div>

      {/* Input Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm rounded-2xl mt-8 w-full max-w-2xl p-6 flex flex-col items-center"
      >
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Enter your symptoms, e.g., 'sore throat, fever'"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
          />
        </div>

        {/* Quick symptom tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {["Headache", "Fatigue", "Nausea", "Dizziness"].map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() =>
                setSymptoms((prev) =>
                  prev.includes(tag) ? prev : `${prev ? prev + ", " : ""}${tag}`
                )
              }
              className="bg-green-100 text-green-700 text-sm px-3 py-1.5 rounded-full hover:bg-green-200 transition"
            >
              {tag}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 bg-green-500 text-white px-8 py-2.5 rounded-full font-semibold hover:bg-green-600 transition disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>

      {/* Results Section */}
      <div className="w-full max-w-2xl mt-8 space-y-4">
        {loading && (
          <p className="text-center text-gray-500 mt-6">
            Analyzing your symptoms...
          </p>
        )}

        {!loading && results.length > 0 && (
          <>
            {results.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-sm p-6 flex flex-col space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
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
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>

                <div className="flex space-x-4 text-gray-400 text-sm mt-2">
                  <button className="flex items-center space-x-1 hover:text-gray-600">
                    <Bookmark size={14} /> <span>Save</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-gray-600">
                    <Share2 size={14} /> <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
