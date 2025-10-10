"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ 1️⃣ Get user from localStorage (same logic as Dashboard)
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.push("/auth/signin");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const email = parsedUser.email;

        if (!email) throw new Error("No email found for logged-in user");

        // ✅ 2️⃣ Fetch user data from API (NeonDB via Prisma)
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

  // ✅ 3️⃣ UI States
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No user data found.
      </div>
    );

  // ✅ 4️⃣ Main Profile UI
  return (
    <div className="min-h-screen bg-[#F7FFF9] px-6 sm:px-10 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-5xl mb-8">
        <h1 className="text-2xl font-semibold text-[#1F2937]">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your personal information and health details.
        </p>
      </div>

      {/* Profile Header */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          {/* ✅ Profile icon — matches navbar */}
          <div className="w-28 h-28 rounded-full border-4 border-[#22C55E]/40 flex items-center justify-center bg-[#F7FFF9]">
            <User className="w-12 h-12 text-[#22C55E]" strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1F2937]">
              {user.name}
            </h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>

        <button
            onClick={() => router.push("/edit-profile")}
            className="mt-4 sm:mt-0 bg-[#22C55E] text-white px-6 py-2 rounded-full font-medium hover:bg-[#16A34A] transition"
            >
            Edit Profile
        </button>
      </div>

      {/* Personal Details */}
      <div className="w-full max-w-5xl mt-6 bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
          Personal Details
        </h3>

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
      <div className="w-full max-w-5xl mt-6 bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
          Health & Lifestyle Info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
          <Detail label="Diet Type" value={user.dietType || "None"} />
          <Detail label="Health Goals" value={user.healthGoals || "None"} />
          <Detail
            label="Medical History"
            value={
              Array.isArray(user.medicalHistory) && user.medicalHistory.length > 0
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

      {/* App Preferences */}
      <div className="w-full max-w-5xl mt-6 bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
          App Preferences
        </h3>

        <div className="flex flex-col gap-4">
          <PreferenceToggle label="Notifications" active={true} />
          <PreferenceToggle label="Dark Mode" active={false} />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-xs mt-10">
        © 2025 <span className="font-semibold text-[#22C55E]">NutriLens</span> —
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
      <p className="text-xs uppercase text-gray-500 mb-1">{label}</p>
      <p
        className={`text-sm font-medium ${
          isNone ? "text-gray-400 italic" : "text-[#1F2937]"
        }`}
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
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#1F2937] font-medium">{label}</span>
      <button
        className={`w-12 h-6 rounded-full relative transition ${
          active ? "bg-[#22C55E]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
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
