"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name" }),
  gender: z.enum(["Male", "Female"]).refine((val) => !!val, {
    message: "Select gender",
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

export default function OnboardingPage() {
  const router = useRouter();
  const [bmr, setBmr] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const weight = watch("weight");
  const height = watch("height");
  const age = watch("age");
  const gender = watch("gender");

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

  const onSubmit = (data: FormData) => {
    console.log("Form Submitted:", data);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-10 px-4">
      {/* 🔹 Heading outside the form box */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tell us about yourself
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          This helps us provide personalized diet plans and recommendations.
        </p>
      </div>

      {/* 🔹 Form Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section Title */}
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600  focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600  focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Gender
              </label>
              <select
                {...register("gender")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
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
                placeholder="Enter your height"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600  focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Weight (kg)
              </label>
              <input
                type="number"
                {...register("weight")}
                placeholder="Enter your weight"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600  focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Medications */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Medications
            </label>
            <input
              {...register("medications")}
              placeholder="List any medications you are taking"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600  focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
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
              Allergies/Dietary Restrictions
            </label>
            <textarea
              {...register("allergies")}
              placeholder="List any allergies or dietary restrictions"
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600  focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Additional Info
            </label>
            <textarea
              {...register("info")}
              placeholder="Any additional information you'd like to share"
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600  focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-md font-medium transition"
            >
              Save & Continue
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-md font-medium transition"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>

      {/* 🔹 BMR Section Below the Form (as in image) */}
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
