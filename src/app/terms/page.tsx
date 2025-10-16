"use client";
import BackButton from "@/components/BackButton";
import { useLoading } from "@/context/LoadingContext";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 flex flex-col items-center">
      <div className="absolute top-24 left-6 z-[60]">
        <BackButton />
      </div>
      <div className="max-w-3xl w-full bg-white shadow-sm rounded-2xl p-8">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-6">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 mb-4">
          Welcome to{" "}
          <span className="text-green-600 font-medium">NutriLens</span>. By
          accessing or using our platform, you agree to comply with these terms
          and conditions.
        </p>
        <p className="text-gray-600 mb-4">
          Our app provides health and nutrition-related insights for educational
          purposes only. NutriLens does not replace professional medical advice.
        </p>
        <p className="text-gray-600">
          We reserve the right to modify these terms at any time. Continued use
          of the app after changes constitutes your acceptance of the new terms.
        </p>
      </div>
    </div>
  );
}
