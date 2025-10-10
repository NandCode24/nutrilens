"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../public/NutriLens.png";

export default function Navbar() {
  const pathname = usePathname();

  // Hide Navbar on landing page
if (
  pathname === "/" ||
  pathname === "/auth/signup" ||
  pathname === "/auth/signin"
) {
  return null;
}

  return (
    <header className="w-full bg-[#F9FCF9] border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* ---------- Left: Logo + Name ---------- */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]"
        >
          <Image
            src={logo}
            alt="NutriLens Logo"
            className="object-contain w-auto h-15"
          />
          {/* <span className="text-lg font-semibold text-slate-900 group-hover:text-[#22C55E] transition-colors">
            NutriLens
          </span> */}
        </Link>

        {/* ---------- Right: Profile Avatar + Label ---------- */}
        <Link
          href="/profile"
          className="flex items-center gap-3 group hover:opacity-90 transition-all"
        >
          {/* Hardcoded Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#DCFCE7] bg-white shadow-sm flex items-center justify-center">
            {/* Hardcoded profile icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-[#16A34A]"
            >
              <circle cx="12" cy="8" r="4" stroke="currentColor" />
              <path
                d="M4 20v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"
                stroke="#22C55E"
              />
            </svg>
          </div>

          <span className="text-lg font-medium text-slate-700 group-hover:text-[#22C55E] transition-colors">
            Profile
          </span>
        </Link>
      </div>
    </header>
  );
}
