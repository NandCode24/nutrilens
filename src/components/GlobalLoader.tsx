"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "../../public/NutriLens.png";

export default function GlobalLoader({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-card"
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
      )}
    </AnimatePresence>
  );
}
