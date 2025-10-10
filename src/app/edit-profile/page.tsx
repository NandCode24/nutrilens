"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Validation Schema (same as onboarding)
const formSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name" }),
  gender: z
    .string()
    .refine((val) => val === "Male" || val === "Female", {
      message: "Please select a gender",
    }),
  age: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) > 0, { message: "Enter valid age" }),
  height: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) >= 50, { message: "Enter valid height" }),
  weight: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) >= 20, { message: "Enter valid weight" }),
  medications: z.string().optional(),
  goal: z.string().optional(),
  allergies: z.string().optional(),
  info: z.string().optional(),
});


type FormData = z.infer<typeof formSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const [bmr, setBmr] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const weight = watch("weight");
  const height = watch("height");
  const age = watch("age");
  const gender = watch("gender");

  // ✅ Prefill user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.push("/auth/signin");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUserEmail(parsedUser.email);

        const res = await fetch(`/api/profile?email=${parsedUser.email}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

        // ✅ Prefill values in form
        setValue("name", data.name || "");
        setValue("gender", data.gender || "Male");
        setValue("age", data.age || "");
        setValue("height", data.heightCm || "");
        setValue("weight", data.weightKg || "");
        setValue("goal", data.healthGoals || "");
        setValue("allergies", data.allergies?.join(", ") || "");
        setValue("info", data.medicalHistory?.join(", ") || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, setValue]);

  // ✅ Auto calculate BMR
  useEffect(() => {
    if (weight && height && age && gender) {
      const w = Number(weight);
      const h = Number(height);
      const a = Number(age);
      const calc =
        gender === "Male"
          ? 10 * w + 6.25 * h - 5 * a + 5
          : 10 * w + 6.25 * h - 5 * a - 161;
      setBmr(Math.round(calc));
    } else {
      setBmr(null);
    }
  }, [weight, height, age, gender]);

  // ✅ Submit (Update user)
  const onSubmit = async (data: FormData) => {
    if (!userEmail) return;

    const payload = {
      email: userEmail,
      name: data.name,
      gender: data.gender,
      age: Number(data.age),
      heightCm: Number(data.height),
      weightKg: Number(data.weight),
      healthGoals: data.goal,
      allergies: data.allergies
        ? data.allergies.split(",").map((a) => a.trim())
        : [],
      medicalHistory: data.info
        ? data.info.split(",").map((m) => m.trim())
        : [],
      bmr: bmr || null,
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      alert("✅ Profile updated successfully!");
      router.push("/profile");
    } catch (err) {
      console.error(err);
      alert("❌ Error updating profile");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Update your personal and health details below.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-base font-medium text-gray-800 mb-4">
            Personal Details
          </h2>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Name
            </label>
            <input
              {...register("name")}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Age
              </label>
              <input
                type="number"
                {...register("age")}
                placeholder="Enter your age"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Gender
              </label>
              <select
                {...register("gender")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Height + Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Height (cm)
              </label>
              <input
                type="number"
                {...register("height")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Weight (kg)
              </label>
              <input
                type="number"
                {...register("weight")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Health Goal */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Health Goal
            </label>
            <select
              {...register("goal")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Select your health goal</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintain Weight">Maintain Weight</option>
            </select>
          </div>

          {/* Allergies */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Allergies / Restrictions
            </label>
            <textarea
              {...register("allergies")}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Medical History
            </label>
            <textarea
              {...register("info")}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-md font-medium transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-md font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* BMR display */}
      {bmr && (
        <div className="w-full max-w-2xl mt-6 bg-green-50 border border-green-200 rounded-lg px-5 py-4">
          <p className="text-sm font-medium text-green-700">
            Basal Metabolic Rate (BMR)
          </p>
          <p className="text-lg font-semibold text-green-600 mt-1">
            {bmr} kcal / day
          </p>
          <p className="text-gray-500 text-sm mt-1">
            This is an estimate of the calories you burn at rest.
          </p>
        </div>
      )}
    </div>
  );
}
