"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../public/NutriLens.png";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Get logged-in user (for name display)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "User");
      } catch {
        setUserName("User");
      }
    }
  }, [pathname]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout logic
  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "isLoggedIn=; Max-Age=0; path=/; SameSite=Lax";
    router.push("/");
  };

  // ✅ Move this AFTER hooks
  const hideNavbar =
    pathname === "/" ||
    pathname === "/auth/signup" ||
    pathname === "/auth/signin" ||
    pathname === "/onboarding";
  if (hideNavbar) return null;

  return (
    <header className="w-full bg-[#F9FCF9] border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* ---------- Left: Logo ---------- */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]"
        >
          <Image
            src={logo}
            alt="NutriLens Logo"
            className="object-contain w-auto h-14"
          />
        </Link>

        {/* ---------- Right: Profile Dropdown ---------- */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:shadow-md transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#DCFCE7] bg-white flex items-center justify-center shadow-sm">
              {/* Profile Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-[#22C55E]"
              >
                <circle cx="12" cy="8" r="4" stroke="currentColor" />
                <path
                  d="M4 20v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"
                  stroke="#22C55E"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">
              {userName || "User"}
            </span>
            {/* Dropdown Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </button>

          {/* ---------- Dropdown Menu ---------- */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-md py-2 z-50 animate-fadeIn">
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
              >
                View Profile
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
