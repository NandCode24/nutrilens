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
            fullData: item.data,
          })) || [];

        setLogs(unified);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`/api/history?id=${id}&type=history`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete entry");

      setLogs((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("Failed to delete entry. Please try again.");
    }
  };

  const handleView = (item: any) => {
    localStorage.setItem("selectedHistoryItem", JSON.stringify(item.fullData));
    localStorage.setItem("selectedHistoryType", item.type);
    router.push("/history/view");
  };

  if (loading)
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background text-foreground"
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
            className="w-28 h-28 rounded-full bg-card shadow-md flex items-center justify-center"
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
    <div className="min-h-screen bg-background text-foreground py-10 px-4 flex flex-col items-center transition-colors duration-300">
      <div className="absolute top-24 left-6">
        <BackButton />
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground dark:text-brand-accent">
          History
        </h1>
        <p className="text-sm text-muted-foreground dark:text-brand-muted mt-1">
          View your scanned ingredient and medicine logs.
        </p>
      </div>

      {/* Logs */}
      <div className="w-full max-w-md space-y-4">
        {logs.length === 0 ? (
          <p className="text-center text-muted-foreground dark:text-brand-muted">
            No records found.
          </p>
        ) : (
          logs.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-2xl shadow-sm border border-border p-5 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-foreground dark:text-brand">
                  {item.title || "Unnamed Entry"}
                </h3>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {item.type}
                </span>
              </div>

              <p className="text-sm text-muted-foreground dark:text-brand-muted mt-1 line-clamp-2">
                {item.description || "No description available."}
              </p>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground dark:text-brand-muted">
                  Scanned:{" "}
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </p>

                <div className="flex items-center gap-3 text-muted-foreground dark:text-brand-muted">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleView(item)}
                    className="hover:text-primary transition"
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
      <footer className="text-center text-muted-foreground dark:text-brand-muted text-xs mt-10">
        © 2025{" "}
        <span className="font-semibold text-primary dark:text-brand-accent">
          NutriLens
        </span>{" "}
        — Empowering Smarter Nutrition.
      </footer>
    </div>
  );
}
