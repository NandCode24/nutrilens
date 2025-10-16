"use client";
import { useLoading } from "@/context/LoadingContext";
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow-sm rounded-2xl p-8">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-4">
          At <span className="text-green-600 font-medium">NutriLens</span>, your
          privacy is our top priority. We collect and process only essential
          information to improve your experience, such as nutritional data and
          profile preferences.
        </p>
        <p className="text-gray-600 mb-4">
          We never share your personal details with third parties without your
          consent. All sensitive data is encrypted and securely stored.
        </p>
        <p className="text-gray-600">
          By using our app, you agree to this privacy policy. For any privacy
          concerns, please contact our support team.
        </p>
      </div>
    </div>
  );
}
