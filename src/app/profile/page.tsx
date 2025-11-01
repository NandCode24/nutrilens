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
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🧠 Fetch Profile
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

  // 🌓 Handle Theme
  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);
  };

  // 🌍 Update Preferred Language
  const handleLanguageChange = async (newLang: string) => {
    if (!user?.email) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, preferredLanguage: newLang }),
      });

      if (!res.ok) throw new Error("Failed to update language");

      const updated = await res.json();
      setUser(updated);

      // 🔒 Update localStorage for Gemini usage later
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        parsed.preferredLanguage = newLang;
        localStorage.setItem("userProfile", JSON.stringify(parsed));
      }

      console.log("✅ Preferred Language updated:", newLang);
    } catch (error) {
      console.error("❌ Error updating language:", error);
    } finally {
      setUpdating(false);
    }
  };

  // 🌀 Loading UI
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
      <div className="absolute top-24 left-6  ">
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

      {/* 🌍 Preferred Language */}
      <div className="w-full max-w-5xl mt-6 bg-card text-card-foreground rounded-2xl shadow-sm p-6 border border-border transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-4">Preferred Language</h3>
        <div className="flex items-center gap-4">
          <select
            value={user.preferredLanguage || "English"}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={updating}
            className="w-64 border border-border rounded-md px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Portuguese">Portuguese</option>
            <option value="Russian">Russian</option>
            <option value="Chinese (Simplified)">Chinese (Simplified)</option>
            <option value="Chinese (Traditional)">Chinese (Traditional)</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Arabic">Arabic</option>
            <option value="Hindi">Hindi</option>
            <option value="Bengali">Bengali</option>
            <option value="Urdu">Urdu</option>
            <option value="Turkish">Turkish</option>
            <option value="Dutch">Dutch</option>
            <option value="Polish">Polish</option>
            <option value="Swedish">Swedish</option>
            <option value="Danish">Danish</option>
            <option value="Norwegian">Norwegian</option>
            <option value="Finnish">Finnish</option>
            <option value="Thai">Thai</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Indonesian">Indonesian</option>
            <option value="Malay">Malay</option>
            <option value="Filipino">Filipino</option>
            <option value="Hebrew">Hebrew</option>
            <option value="Greek">Greek</option>
            <option value="Czech">Czech</option>
            <option value="Hungarian">Hungarian</option>
            <option value="Romanian">Romanian</option>
            <option value="Ukrainian">Ukrainian</option>
            <option value="Persian (Farsi)">Persian (Farsi)</option>
            <option value="Swahili">Swahili</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Marathi">Marathi</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Kannada">Kannada</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Nepali">Nepali</option>
            <option value="Sinhala">Sinhala</option>
            <option value="Burmese">Burmese</option>
            <option value="Khmer">Khmer</option>
            <option value="Lao">Lao</option>
            <option value="Mongolian">Mongolian</option>
            <option value="Slovak">Slovak</option>
            <option value="Serbian">Serbian</option>
            <option value="Croatian">Croatian</option>
            <option value="Bulgarian">Bulgarian</option>
            <option value="Lithuanian">Lithuanian</option>
            <option value="Latvian">Latvian</option>
            <option value="Estonian">Estonian</option>
            <option value="Icelandic">Icelandic</option>
            <option value="Afrikaans">Afrikaans</option>
            <option value="Hausa">Hausa</option>
            <option value="Zulu">Zulu</option>
            <option value="Amharic">Amharic</option>
          </select>
          {updating && (
            <span className="text-sm text-muted-foreground">Saving...</span>
          )}
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
        className={`text-sm font-medium ${
          isNone ? "text-muted-foreground/70 italic" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* 🧮 BMI Helper Function */
function calculateBMI(heightCm: number, weightKg: number) {
  if (!heightCm || !weightKg) return "None";
  const bmi = weightKg / ((heightCm / 100) * (heightCm / 100));
  return bmi.toFixed(1);
}
