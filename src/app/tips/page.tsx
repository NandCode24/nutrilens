"use client";

import { useState } from "react";
import { healthTips } from "@/app/tips/healthtips";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import BackButton from "@/components/BackButton";
import { useLoading } from "@/context/LoadingContext";

export default function TipsPage() {
  const [currentTip, setCurrentTip] = useState(0);

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % healthTips.length);
  const prevTip = () =>
    setCurrentTip((prev) => (prev === 0 ? healthTips.length - 1 : prev - 1));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 py-10 relative overflow-hidden transition-colors duration-300">
      {/* 🔙 Back Button */}
      <div className="absolute top-7 left-6">
        <BackButton />
      </div>

      {/* ✨ Subtle gradient background accents */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-300/20 dark:bg-emerald-800/20 rounded-full blur-3xl" />

      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 drop-shadow-sm text-center">
        🌿 Daily Health Tips
      </h1>

      {/* Tip Card */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-md p-8 text-center transition-colors duration-300">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentTip}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-lg sm:text-xl font-medium leading-relaxed text-muted-foreground"
          >
            {healthTips[currentTip]}
          </motion.p>
        </AnimatePresence>

        {/* Footer Note */}
        <p className="mt-8 text-sm text-muted-foreground">
          Tap below to get more healthy tips 🌱
        </p>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={prevTip}
            className="flex items-center justify-center bg-background border border-border text-primary hover:bg-primary/10 font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all duration-300"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Previous
          </button>

          <button
            onClick={nextTip}
            className="flex items-center justify-center bg-primary hover:opacity-90 text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all duration-300"
          >
            Next
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
