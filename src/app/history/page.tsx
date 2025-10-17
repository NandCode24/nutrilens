"use client";

import { useEffect, useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import BackButton from "@/components/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "../../../public/NutriLens.png";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const user = JSON.parse(storedUser);

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/history?email=${user.email}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch history");

        // 🧠 Combine new unified history + legacy scans
        const unified =
          data.history?.map((item: any) => ({
            id: item.id,
            title:
              item.type === "ingredient"
                ? "Ingredient Scan"
                : item.type === "medicine"
                  ? "Medicine Lookup"
                  : "Scan Record",
            description:
              item.data?.nutrition_summary ||
              item.data?.uses ||
              "No details available.",
            date: item.createdAt,
            type:
              item.type.charAt(0).toUpperCase() +
              item.type.slice(1).toLowerCase(),
            fullData: item.data, // 🧩 stored JSON for later detail view
          })) || [];

        // 🧩 Include legacy data for backward support
        const legacy = [
          ...(data.foodScans || []).map((item: any) => ({
            id: item.id,
            title: item.ingredients?.[0] || "Ingredient Scan",
            description: item.nutritionSummary || item.ingredientsText || "—",
            date: item.createdAt,
            type: "Ingredient",
            fullData: item,
          })),
          ...(data.medicines || []).map((item: any) => ({
            id: item.id,
            title: item.name || "Medicine Lookup",
            description: item.uses || "No details available.",
            date: item.createdAt,
            type: "Medicine",
            fullData: item,
          })),
        ];

        const combined = [...unified, ...legacy].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

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

      // Remove locally after deletion
      setLogs((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  const handleView = (item: any) => {
    // 🧠 Save full result temporarily for re-render on detail page
    localStorage.setItem("selectedHistoryItem", JSON.stringify(item.fullData));
    localStorage.setItem("selectedHistoryType", item.type);
    router.push("/history/view");
  };

  if (loading)
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f6fdf6]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.2, rotate: 360 }}
            exit={{ scale: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-28 h-28 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <Image
              src={logo}
              alt="NutriLens Logo"
              width={80}
              height={80}
              className="rounded-full object-contain"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
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

      {/* Logs */}
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
                  <button
                    onClick={() => handleView(item)}
                    className="hover:text-green-500 transition"
                  >
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
