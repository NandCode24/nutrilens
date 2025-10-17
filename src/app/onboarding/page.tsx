"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name" }),
  email: z.string().email({ message: "Enter a valid email" }),
  gender: z
    .enum(["Male", "Female"])
    .refine((val) => val === "Male" || val === "Female", {
      message: "Select gender",
    }),
  age: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: "Enter valid age",
  }),
  height: z.union([z.string(), z.number()]).refine((val) => Number(val) >= 50, {
    message: "Enter valid height",
  }),
  weight: z.union([z.string(), z.number()]).refine((val) => Number(val) >= 20, {
    message: "Enter valid weight",
  }),
  medications: z.string().optional(),
  goal: z.string().optional(),
  allergies: z.string().optional(),
  info: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [bmr, setBmr] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const weight = watch("weight");
  const height = watch("height");
  const age = watch("age");
  const gender = watch("gender");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      localStorage.setItem(
        "user",
        JSON.stringify({ name: "Guest User", email: "guest@nutrilens.ai" })
      );
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setValue("email", user.email || "");
      setValue("name", user.name || "");
    } else {
      setValue("email", "guest@nutrilens.ai");
      setValue("name", "Guest User");
    }
  }, [setValue]);

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

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          age: Number(data.age),
          gender: data.gender,
          heightCm: Number(data.height),
          weightKg: Number(data.weight),
          dietType: "Balanced",
          healthGoals: data.goal,
          medicalHistory: data.medications
            ? data.medications.split(",").map((m) => m.trim())
            : [],
          allergies: data.allergies
            ? data.allergies.split(",").map((a) => a.trim())
            : [],
        }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.error || "Failed to save onboarding details");

      const profileData = {
        name: data.name,
        age: Number(data.age),
        gender: data.gender,
        heightCm: Number(data.height),
        weightKg: Number(data.weight),
        healthGoals: data.goal || "General wellness",
        allergies: data.allergies
          ? data.allergies.split(",").map((a) => a.trim())
          : [],
        medicalConditions: data.medications
          ? data.medications.split(",").map((m) => m.trim())
          : [],
      };

      localStorage.setItem("userProfile", JSON.stringify(profileData));

      setMessage("✅ Onboarding details saved successfully!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (!localStorage.getItem("user")) {
      localStorage.setItem(
        "user",
        JSON.stringify({ name: "Guest User", email: "guest@nutrilens.ai" })
      );
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start py-10 px-4 transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-foreground dark:text-brand-accent">
          Tell us about yourself
        </h1>
        <p className="text-sm text-muted-foreground dark:text-brand-muted mt-2">
          This helps us provide personalized diet plans and recommendations.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-sm p-8 transition-colors duration-300">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-base font-medium text-foreground mb-4">
            Personal Details
          </h2>

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Name
              </label>
              <input
                {...register("name")}
                placeholder="Enter your name"
                className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/60 focus:outline-none"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email (readonly fix) */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                readOnly
                className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground opacity-70 cursor-not-allowed"
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Age
              </label>
              <input
                type="number"
                {...register("age")}
                placeholder="Enter your age"
                className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/60 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Gender
              </label>
              <select
                {...register("gender")}
                className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:ring-2 focus:ring-primary/60 focus:outline-none"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Height + Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Height (cm)
              </label>
              <input
                type="number"
                {...register("height")}
                placeholder="Enter your height"
                className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/60 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Weight (kg)
              </label>
              <input
                type="number"
                {...register("weight")}
                placeholder="Enter your weight"
                className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/60 focus:outline-none"
              />
            </div>
          </div>

          {/* Medications */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Medications
            </label>
            <input
              {...register("medications")}
              placeholder="List any medications (comma separated)"
              className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/60 focus:outline-none"
            />
          </div>

          {/* Health Goal */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Health Goal
            </label>
            <select
              {...register("goal")}
              className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground focus:ring-2 focus:ring-primary/60 focus:outline-none"
            >
              <option value="">Select your health goal</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintain Weight">Maintain Weight</option>
            </select>
          </div>

          {/* Allergies */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Allergies / Dietary Restrictions
            </label>
            <textarea
              {...register("allergies")}
              rows={2}
              placeholder="List any allergies or restrictions"
              className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/60 focus:outline-none"
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Additional Info
            </label>
            <textarea
              {...register("info")}
              rows={2}
              placeholder="Any additional information you'd like to share"
              className="w-full border border-border rounded-md px-3 py-2 bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/60 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:opacity-90 transition disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 bg-muted text-black hover:opacity-90 py-2.5 rounded-md font-medium transition"
            >
              Skip for now
            </button>
          </div>

          {message && (
            <p
              className={`text-center text-sm mt-3 ${
                message.startsWith("✅") ? "text-green-500" : "text-destructive"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      {/* BMR Display */}
      {bmr && (
        <div className="w-full max-w-2xl mt-6 bg-card border border-border rounded-lg px-5 py-4">
          <p className="text-sm font-medium text-primary">
            Basal Metabolic Rate (BMR)
          </p>
          <p className="text-lg font-semibold text-primary mt-1">
            {bmr} kcal / day
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            This is an estimate of the calories you burn at rest.
          </p>
        </div>
      )}
    </div>
  );
}
