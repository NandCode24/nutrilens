"use client";

import { useState } from "react";
import { healthTips } from "@/app/tips/healthtips";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import BackButton from "@/components/BackButton";
import { useLoading } from "@/context/LoadingContext";

export default function TipsPage() {
  const [currentTip, setCurrentTip] = useState(0);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % healthTips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev === 0 ? healthTips.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FFF9] px-6 py-10 relative overflow-hidden">
      {/* 🔙 Back Button */}
      <div className="absolute top-24 left-6 z-[60]">
        <BackButton />
      </div>

      {/* Gradient Background Aesthetics */}
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
        {/* Footer note */}
        <p className="mt-8 text-sm text-gray-500">Tap below to get health tips 🌿</p>
        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={prevTip}
            className="flex items-center justify-center bg-white text-[#22C55E] border border-green-300 hover:bg-green-50 font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all duration-300"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Previous
          </button>

          <button
            onClick={nextTip}
            className="flex items-center justify-center bg-[#22C55E] hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all duration-300"
          >
            Next
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
