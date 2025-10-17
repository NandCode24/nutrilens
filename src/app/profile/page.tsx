"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "../../../public/NutriLens.png";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import BackButton from "@/components/BackButton";
import { useTheme } from "next-themes";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.push("/auth/signin");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const email = parsedUser.email;
        if (!email) throw new Error("No email found for logged-in user");

        const res = await fetch(`/api/profile?email=${email}`);
        const data = await res.json();
        if (!res.ok || data.error)
          throw new Error(data.error || "Failed to fetch profile");

        setUser(data);
      } catch (err: any) {
        console.error("❌ Profile Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);
  };

  if (loading)
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-card transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.2, rotate: 360 }}
            exit={{ scale: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-28 h-28 rounded-full bg-card shadow-md flex items-center justify-center"
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
      </AnimatePresence>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        {error}
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        No user data found.
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground px-6 sm:px-10 py-12 flex flex-col items-center transition-colors duration-300">
      <div className="absolute top-24 left-6 z-[60]">
        <BackButton />
      </div>

      {/* Header */}
      <div className="w-full max-w-5xl mb-8">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal information and health details.
        </p>
      </div>

      {/* Profile Header */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card text-card-foreground rounded-2xl p-6 shadow-sm border border-border transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <div className="w-28 h-28 rounded-full border-4 border-primary/40 flex items-center justify-center bg-background">
            <User className="w-12 h-12 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/edit-profile")}
          className="mt-4 sm:mt-0 bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Personal Details */}
      <div className="w-full max-w-5xl mt-6 bg-card text-card-foreground rounded-2xl shadow-sm p-6 border border-border transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
          <Detail label="Name" value={user.name || "None"} />
          <Detail label="Age" value={user.age || "None"} />
          <Detail label="Gender" value={user.gender || "None"} />
          <Detail
            label="Height"
            value={user.heightCm ? `${user.heightCm} cm` : "None"}
          />
          <Detail
            label="Weight"
            value={user.weightKg ? `${user.weightKg} kg` : "None"}
          />
          <Detail
            label="BMI"
            value={calculateBMI(user.heightCm, user.weightKg) || "None"}
          />
          <Detail
            label="Basal Metabolic Rate (BMR)"
            value={user.bmr ? `${user.bmr} kcal` : "None"}
          />
        </div>
      </div>

      {/* Health & Lifestyle Info */}
      <div className="w-full max-w-5xl mt-6 bg-card text-card-foreground rounded-2xl shadow-sm p-6 border border-border transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-4">Health & Lifestyle Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
          <Detail label="Diet Type" value={user.dietType || "None"} />
          <Detail label="Health Goals" value={user.healthGoals || "None"} />
          <Detail
            label="Medical History"
            value={
              Array.isArray(user.medicalHistory) &&
              user.medicalHistory.length > 0
                ? user.medicalHistory.join(", ")
                : "None"
            }
          />
          <Detail
            label="Allergies"
            value={
              Array.isArray(user.allergies) && user.allergies.length > 0
                ? user.allergies.join(", ")
                : "None"
            }
          />
        </div>
      </div>

     
      {/* Footer */}
      <footer className="text-center text-muted-foreground text-xs mt-10">
        © 2025 <span className="font-semibold text-primary">NutriLens</span> —
        Empowering Smarter Nutrition.
      </footer>
    </div>
  );
}

/* 🧩 Reusable Subcomponent for Fields */
function Detail({ label, value }: { label: string; value: string | number }) {
  const isNone = value === "None" || value === "—";
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground mb-1">{label}</p>
      <p
        className={`text-sm font-medium ${isNone ? "text-muted-foreground/70 italic" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}

/* 🧩 Preferences Toggle Component */
function PreferenceToggle({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-all ${
          active ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-background rounded-full shadow transition-transform ${
            active ? "translate-x-6" : ""
          }`}
        ></span>
      </button>
    </div>
  );
}

/* 🧮 BMI Helper Function */
function calculateBMI(heightCm: number, weightKg: number) {
  if (!heightCm || !weightKg) return "None";
  const bmi = weightKg / ((heightCm / 100) * (heightCm / 100));
  return bmi.toFixed(1);
}
