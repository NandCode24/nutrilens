"use client";

import { useEffect, useState, useMemo } from "react";
import { Trash2, Eye, Search } from "lucide-react";

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch user history from API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your history.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setLogs(data.logs);
        } else {
          setError(data.error || "Failed to fetch history.");
        }
      } catch (err) {
        console.error("❌ Error fetching history:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ✅ Live search filter
  const filteredLogs = useMemo(() => {
    return logs.filter(
      (log) =>
        log.title?.toLowerCase().includes(search.toLowerCase()) ||
        log.type?.toLowerCase().includes(search.toLowerCase()) ||
        log.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [logs, search]);

  return (
    <div className="min-h-screen bg-[#F7FFF9] px-4 py-8 sm:px-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-2xl text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1F2937]">
          History
        </h1>
        <p className="text-gray-500 text-base mt-1">
          View your scanned ingredient and medicine logs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-md mb-8 relative">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
      </div>

      {/* Logs Section */}
      {loading ? (
        <p className="text-gray-500 mt-10">Loading your history...</p>
      ) : error ? (
        <p className="text-red-500 mt-10">{error}</p>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base">
            No history found for “{search || "your logs"}”.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-4 pb-20">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 transition-all hover:shadow-md"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between">
                <h2 className="text-[17px] font-semibold text-[#111827]">
                  {log.title || "Untitled"}
                </h2>
                <span
                  className={`text-xs font-medium px-2 py-[2px] rounded-lg ${
                    log.type === "Ingredient"
                      ? "bg-[#E0F2FE] text-[#1D4ED8]" // Ingredient = blue
                      : "bg-[#F3E8FF] text-[#7E22CE]" // Medicine = purple
                  }`}
                >
                  {log.type}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#4B5563] mt-2 leading-relaxed">
                {log.description || "No description available."}
              </p>

              {/* Footer Row */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Scanned: {new Date(log.time).toLocaleString()}
                </p>
                <div className="flex space-x-3">
                  <button
                    title="Delete"
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    title="View details"
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
