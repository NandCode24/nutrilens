import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // 👈 Import our Navbar component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriLens",
  description: "AI-powered nutrition and wellness companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F9FCF9] text-slate-900`}
      >
        {/* 🌿 Common Navbar (auto-hidden on landing page) */}
        <Navbar />

        {/* Page Content */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
