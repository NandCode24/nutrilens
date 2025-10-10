"use client";

import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiBookmark, FiUser, FiSettings } from "react-icons/fi";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Home", icon: FiHome, path: "/dashboard" },
    { name: "History", icon: FiBookmark, path: "/history" },
    { name: "Profile", icon: FiUser, path: "/profile" },
    { name: "Settings", icon: FiSettings, path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 shadow-sm z-50">
      {navItems.map((item) => {
        const active = pathname === item.path;
        const Icon = item.icon;
        return (
          <button
            key={item.name}
            onClick={() => {
              // navigate only when user clicks
              router.push(item.path);
            }}
            className={`flex flex-col items-center transition ${
              active ? "text-green-600" : "text-gray-500 hover:text-green-600"
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
