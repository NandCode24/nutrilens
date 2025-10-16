"use client";

import { useEffect, useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import BackButton from "@/components/BackButton";


export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/history?email=${user.email}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch history");

        // ✅ Combine food scans & medicines
        // ✅ Combine food scans & medicines (cleaner titles)
        const combined = [
        ...data.foodScans.map((item: any) => ({
            id: item.id,
            title:
            item.ingredients && item.ingredients.length > 0
                ? item.ingredients[0]
                : "Ingredient Scan",
            description: item.nutritionSummary || item.ingredientsText || "—",
            date: item.createdAt,
            type: "Ingredient",
        })),
        ...data.medicines.map((item: any) => ({
            id: item.id,
            title: item.name || "Medicine Lookup",
            description: item.uses || "No details available.",
            date: item.createdAt,
            type: "Medicine",
        })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


        setLogs(combined);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`/api/history?id=${id}&type=${type}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete entry");

      // ✅ Remove locally after deletion
      setLogs((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading history...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F7FFF9] py-10 px-4 flex flex-col items-center">
      <div className="absolute top-24 left-6 z-[60]">
        <BackButton />
      </div>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]">History</h1>
        <p className="text-gray-500 text-sm mt-1">
          View your scanned ingredient and medicine logs.
        </p>
      </div>

      {/* Logs List */}
      <div className="w-full max-w-md space-y-4">
        {logs.length === 0 ? (
          <p className="text-gray-400 text-center">No records found.</p>
        ) : (
          logs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-[#1F2937]">
                  {item.title || "Unnamed Entry"}
                </h3>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    item.type === "Ingredient"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {item.type}
                </span>
              </div>

              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {item.description || "No description available."}
              </p>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Scanned:{" "}
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </p>

                <div className="flex items-center gap-3 text-gray-400">
                  <button
                    onClick={() => handleDelete(item.id, item.type)}
                    className="hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="hover:text-green-500 transition">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-xs mt-10">
        © 2025 <span className="font-semibold text-[#22C55E]">NutriLens</span>{" "}
        — Empowering Smarter Nutrition.
      </footer>
    </div>
  );
}
