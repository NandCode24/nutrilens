"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "../../../../public/NutriLens.png";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showTransition, setShowTransition] = useState(false);

  // ✅ Email/Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        document.cookie = "isLoggedIn=true; path=/; max-age=604800";
        setShowTransition(true);

        // Email users go to onboarding next
        setTimeout(() => router.push("/onboarding"), 1500);
      } else {
        setMessage(`❌ ${data.error || "Invalid credentials"}`);
      }
    } catch {
      setMessage("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid,
        })
      );

      await fetch("/api/auth/firebase-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          password: "google-auth",
        }),
      });

      document.cookie = "isLoggedIn=true; path=/; max-age=604800";
      setShowTransition(true);

      // Google users also go directly to onboarding
      setTimeout(() => router.push("/onboarding"), 1500);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f6fdf6]">
        <div className="bg-white shadow-sm rounded-2xl p-8 w-full max-w-sm relative overflow-hidden">
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            Welcome Back
          </h1>
          <p className="text-center text-gray-500 mt-1 mb-6">
            Sign in to continue your{" "}
            <span className="font-medium">NutriLens</span> journey
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-green-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-400 text-sm">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition disabled:opacity-50"
            >
              <FcGoogle className="w-6 h-6" />
            </button>
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/signup")}
              className="text-green-600 font-medium hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>

      {/* Transition Animation */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#f6fdf6]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-28 h-28 rounded-full bg-white shadow-md flex items-center justify-center"
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
    </>
  );
}
