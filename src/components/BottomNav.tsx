"use client";

import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiBookmark, FiUser } from "react-icons/fi";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  const navItems = [
    { name: "Home", icon: FiHome, path: "/dashboard" },
    { name: "History", icon: FiBookmark, path: "/history" },
    { name: "Profile", icon: FiUser, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background/90 border-t border-border flex justify-around py-3 shadow-sm z-50 backdrop-blur-md transition-colors duration-300">
      {navItems.map((item) => {
        const active = pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`relative flex flex-col items-center transition-all duration-200 ${
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">{item.name}</span>

            {/* Animated indicator under the active icon */}
            {active && (
              <motion.div
                layoutId="activeNavIndicator"
                className="absolute -bottom-1 w-6 h-[2px] bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
