"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Hide Navbar on landing page
  if (pathname === "/") return null;

  return (
    <header className="w-full bg-[#F9FCF9] border-b border-slate-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Logo + Name */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect width="24" height="24" rx="6" fill="#ECFDF6" />
            <path
              d="M8.8 13.2c1.2-1.2 4.2-3 6.6-1.6 0 0 .6-3-2.2-4.8-2.6-1.6-6.6.6-6.6.6S8 9 8.8 13.2z"
              fill="#16A34A"
            />
            <path
              d="M13 14.2c.2.2.6.2.8 0 .2-.2.2-.6 0-.8-.2-.2-.6-.2-.8 0-.2.2-.2.6 0 .8z"
              fill="#22C55E"
            />
          </svg>
          <span className="text-lg font-semibold text-slate-900">
            NutriLens
          </span>
        </Link>

        {/* Right: Profile Avatar */}
        <Link href="/profile" className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#DCFCE7] bg-white shadow-sm hover:shadow transition">
            <Image
              src="/images/default-avatar.png" // placeholder image
              alt="Profile"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
