"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, Eye, ChevronDown, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import BackButton from "@/components/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "../../../public/NutriLens.png";
import { useRouter } from "next/navigation";

type FilterOption = "All" | "Ingredient" | "Medicine";
type RangeOption = "All time" | "7 days" | "1 month" | "6 months" | "1 year";

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState<FilterOption>("All");
  const [rangeFilter, setRangeFilter] = useState<RangeOption>("All time");
  const router = useRouter();

  // Fetch unified history
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }
    const user = JSON.parse(storedUser);

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `/api/history?email=${encodeURIComponent(user.email)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch history");

        const unified =
          (data.history || []).map((item: any) => ({
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

        // Sort newest first
        unified.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setLogs(unified);
      } catch (err) {
        console.error("Error fetching history:", err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(
        `/api/history?id=${encodeURIComponent(id)}&type=history`,
        {
          method: "DELETE",
        }
      );
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

  // compute cutoff date for range filter
  const rangeCutoff = useMemo(() => {
    const now = new Date();
    switch (rangeFilter) {
      case "7 days":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "1 month":
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case "6 months":
        return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      case "1 year":
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      default:
        return null;
    }
  }, [rangeFilter]);

  // Apply both type + range filters
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      if (typeFilter !== "All" && item.type !== typeFilter) return false;
      if (rangeCutoff) {
        const itemDate = new Date(item.date);
        if (isNaN(itemDate.getTime())) return false;
        if (itemDate < (rangeCutoff as Date)) return false;
      }
      return true;
    });
  }, [logs, typeFilter, rangeCutoff]);

  // counts for badges
  const counts = useMemo(() => {
    const all = logs.length;
    const ing = logs.filter((l) => l.type === "Ingredient").length;
    const med = logs.filter((l) => l.type === "Medicine").length;
    return { all, ing, med };
  }, [logs]);

  if (loading)
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.05, rotate: 360 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
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
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-8 flex flex-col items-center transition-colors duration-300">
      <div className="absolute top-24 left-6">
        <BackButton />
      </div>

      {/* Page header */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All your saved scans and lookups — filter, view, or remove.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Type chips */}
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full p-1">
            {(["All", "Ingredient", "Medicine"] as FilterOption[]).map(
              (opt) => (
                <button
                  key={opt}
                  onClick={() => setTypeFilter(opt)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all ${
                    typeFilter === opt
                      ? "bg-gradient-to-br from-green-500 to-emerald-400 text-white shadow"
                      : "text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  {opt === "All"
                    ? `All (${counts.all})`
                    : opt === "Ingredient"
                      ? `Ingredients (${counts.ing})`
                      : `Medicines (${counts.med})`}
                </button>
              )
            )}
          </div>

          {/* Range select */}
          <div className="relative inline-flex items-center bg-card border border-border rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
            <select
              value={rangeFilter}
              onChange={(e) => setRangeFilter(e.target.value as RangeOption)}
              className="bg-transparent outline-none text-sm text-foreground"
            >
              <option>All time</option>
              <option>7 days</option>
              <option>1 month</option>
              <option>6 months</option>
              <option>1 year</option>
            </select>
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="w-full max-w-4xl">
        {/* Active filter banner */}
        <div className="mb-4">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-gradient-to-r from-card to-card/80 border border-border rounded-xl px-4 py-3"
          >
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">{typeFilter}</span>{" "}
              •{" "}
              <span className="font-medium text-foreground">{rangeFilter}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                {filteredLogs.length}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Entries list */}
        <div className="grid grid-cols-1 gap-4">
          {filteredLogs.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
              <svg
                className="mx-auto mb-4 w-20 h-20 opacity-80"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="8"
                  y="18"
                  width="104"
                  height="84"
                  rx="10"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  fill="rgba(34,197,94,0.04)"
                />
                <path
                  d="M30 40h60"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M30 54h60"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M30 68h36"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <h3 className="text-lg font-semibold text-foreground">
                No records found
              </h3>
              <p className="text-sm mt-2">
                Try clearing filters or scan a new ingredient / medicine to see
                it here.
              </p>
            </div>
          ) : (
            filteredLogs.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="bg-gradient-to-r from-card to-card/95 border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {item.title || "Unnamed Entry"}
                      </h3>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${item.type === "Ingredient" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}
                      >
                        {item.type}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {item.description || "No description available."}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        Scanned:{" "}
                        <span className="text-foreground font-medium">
                          {formatDistanceToNow(new Date(item.date), {
                            addSuffix: true,
                          })}
                        </span>
                      </p>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleView(item)}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition"
                          aria-label="View item"
                        >
                          <Eye className="w-4 h-4" />{" "}
                          <span className="text-sm">View</span>
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive transition"
                          aria-label="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />{" "}
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-muted-foreground text-xs mt-10">
        © 2025 <span className="font-semibold text-primary">NutriLens</span> —
        Empowering Smarter Nutrition.
      </footer>
    </div>
  );
}
