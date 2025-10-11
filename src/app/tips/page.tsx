"use client";

import { useState } from "react";
import { healthTips } from "@/app/tips/healthtip";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function TipsPage() {
  const [currentTip, setCurrentTip] = useState(0);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % healthTips.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FFF9] px-6 py-10 relative overflow-hidden">
      {/* Gradient Circles for soft background aesthetics */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl" />

      <h1 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-6 drop-shadow-sm">
        🌿 Daily Health Tips
      </h1>

      {/* Tip Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-green-200 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentTip}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-gray-700 text-lg sm:text-xl font-medium leading-relaxed"
          >
            {healthTips[currentTip]}
          </motion.p>
        </AnimatePresence>

        <div className="mt-8 flex justify-center">
          <button
            onClick={nextTip}
            className="flex items-center justify-center bg-[#22C55E] hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300"
          >
            Next Tip
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>

      
      </div>

      {/* Footer note */}
     
    </div>
  );
}
