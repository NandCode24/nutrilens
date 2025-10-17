"use client";

import { motion } from "framer-motion";

export default function ApiLoader() {
  return (
    <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-none">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "linear",
        }}
        className="w-10 h-10 border-4 border-t-transparent border-green-500 rounded-full shadow-md"
      />
    </div>
  );
}
