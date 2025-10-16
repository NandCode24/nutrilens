"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md text-gray-600 hover:text-green-600 transition-all duration-200 z-[60]"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
