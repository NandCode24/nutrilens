"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "../../../../public/NutriLens.png";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showTransition, setShowTransition] = useState(false);

  // ✅ Password validation (min 8 chars, upper, lower, number, special)
  const validatePassword = (pwd: string) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(pwd);
  };

  // ✅ Manual Email Signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // 🔒 Password validation before request
    if (!validatePassword(password)) {
      setMessage(
        "❌ Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Account created successfully!");
        setShowTransition(true);

        // ✅ Save user info for onboarding autofill
        localStorage.setItem(
          "user",
          JSON.stringify({
            name,
            email,
          })
        );

        setTimeout(() => router.push("/auth/signin"), 1800);
      } else {
        setMessage(`❌ ${data.error || "Signup failed."}`);
      }
    } catch {
      setMessage("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Signup
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user locally
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid,
        })
      );

      // Sync with DB
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
      setTimeout(() => router.push("/onboarding"), 1500);
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      alert("Failed to sign up with Google. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f6fdf6]">
        <div className="bg-white shadow-sm rounded-2xl p-8 w-full max-w-sm relative overflow-hidden">
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            Create an Account
          </h1>
          <p className="text-center text-gray-500 mt-1 mb-6">
            Start your journey with{" "}
            <span className="font-medium">NutriLens</span>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-green-500"
              required
            />
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
  className={`w-full rounded-md border px-3 py-2 text-gray-700 focus:ring-2 focus:outline-none ${
    validatePassword(password)
      ? "border-green-300 focus:ring-green-500"
      : password
      ? "border-red-300 focus:ring-red-400"
      : "border-gray-200"
  }`}
  required
/>

{/* 🔒 Interactive password feedback */}
{password && (
  <div className="mt-1 text-xs text-gray-600 space-y-0.5">
    <p>
      {password.length >= 8 ? "✅" : "❌"} At least <b>8 characters</b>
    </p>
    <p>
      {/[A-Z]/.test(password) ? "✅" : "❌"} Includes an <b>uppercase</b> letter
    </p>
    <p>
     {/[a-z]/.test(password) ? "✅" : "❌"} Includes a <b>lowercase</b> letter
    </p>
    <p>
      {/\d/.test(password) ? "✅" : "❌"} Includes a <b>number</b>
    </p>
    <p>
      {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "✅" : "❌"} Includes a{" "}
      <b>special character</b>
    </p>
  </div>
)}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* Message */}
            {message && (
              <p
                className={`text-center text-sm mt-2 ${
                  message.startsWith("❌") ? "text-red-500" : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>

          {/* Google Option */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-400 text-sm">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition disabled:opacity-50"
            >
              <FcGoogle className="w-6 h-6" />
            </button>
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/signin")}
              className="text-green-600 font-medium hover:underline"
            >
              Login
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
