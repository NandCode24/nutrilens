"use client";
import BackButton from "@/components/BackButton";
import { useLoading } from "@/context/LoadingContext";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6 flex flex-col items-center transition-colors duration-300">
      {/* 🔙 Back Button */}
      <div className="absolute top-24 left-6 z-[60]">
        <BackButton />
      </div>

      {/* 📜 Terms Card */}
      <div className="max-w-3xl w-full bg-card border border-border shadow-sm rounded-2xl p-8 transition-colors duration-300">
        <h1 className="text-3xl font-semibold text-foreground text-center mb-6">
          Terms & Conditions
        </h1>

        <p className="text-muted-foreground mb-4 leading-relaxed">
          Welcome to <span className="text-primary font-medium">NutriLens</span>
          . By accessing or using our platform, you agree to comply with these
          terms and conditions.
        </p>

        <p className="text-muted-foreground mb-4 leading-relaxed">
          Our app provides health and nutrition-related insights for educational
          purposes only.{" "}
          <span className="text-primary font-medium">NutriLens</span> does not
          replace professional medical advice, diagnosis, or treatment.
        </p>

        <p className="text-muted-foreground leading-relaxed">
          We reserve the right to modify these terms at any time. Continued use
          of the app after such changes constitutes your acceptance of the
          updated terms. Please review this page regularly for updates.
        </p>
      </div>
    </div>
  );
}
