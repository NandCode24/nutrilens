"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../public/aahar-snap.svg";
import logoDark from "../../public/aahar-snap-dark.svg";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  // ✅ Hide Navbar on specific routes
  const hideNavbar =
    pathname === "/" ||
    pathname === "/auth/signup" ||
    pathname === "/auth/signin" ||
    pathname === "/onboarding";
  if (hideNavbar) return null;

  if (!mounted) return null; // prevents hydration mismatch

  return (
    <header className="w-full bg-background/90 border-b border-border sticky top-0 z-50 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2.5">
        {/* ---------- Left: Logo ---------- */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Light Mode Logo */}
          <Image
            src={logo}
            alt="AaharSnap Logo"
            priority
            className="object-contain w-auto h-16 sm:h-20 max-h-20 block dark:hidden"
          />
          {/* Dark Mode Logo (High-contrast with bright text) */}
          <Image
            src={logoDark}
            alt="AaharSnap Logo"
            priority
            className="object-contain w-auto h-16 sm:h-20 max-h-20 hidden dark:block drop-shadow-[0_2px_12px_rgba(34,197,94,0.18)]"
          />
        </Link>

        {/* ---------- Right: Theme Toggle + Profile Dropdown ---------- */}
        <div className="flex items-center gap-3">
          {/* Dark/Light Mode Toggle (Left of Username) */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-full border border-border bg-card hover:bg-accent text-foreground transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center cursor-pointer"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle dark/light mode"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 dark:text-slate-200 transition-transform hover:-rotate-12" />
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 bg-background flex items-center justify-center shadow-sm">
              {/* Profile Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-primary"
              >
                <circle cx="12" cy="8" r="4" stroke="currentColor" />
                <path
                  d="M4 20v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"
                  stroke="currentColor"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-foreground">
              {userName || "User"}
            </span>
            {/* Dropdown Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
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
            <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-md py-2 z-50 animate-fadeIn">
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-primary transition"
              >
                View Profile
              </Link>

              {/* Dark/Light Mode Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-primary transition"
              >
                {theme === "dark" ? (
                  <>
                    Light Mode <Sun className="w-4 h-4 text-yellow-400" />
                  </>
                ) : (
                  <>
                    Dark Mode <Moon className="w-4 h-4 text-slate-700" />
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
