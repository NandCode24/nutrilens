"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard")}
      className="
        flex items-center gap-2
        bg-card/80 backdrop-blur-sm
        border border-border
        rounded-full px-3 py-1.5
        shadow-sm hover:shadow-md
        text-foreground dark:text-brand-muted
        hover:text-primary dark:hover:text-brand-accent
        transition-all duration-300
        z-[60]
      "
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
