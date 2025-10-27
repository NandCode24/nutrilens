/* src/app/page.tsx */
"use client";

import Link from "next/link";
import logo from "../../public/NutriLens.png";

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* ---------- NAV ---------- */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src={logo.src}
                alt="NutriLens Logo"
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              {[
                { label: "Features", href: "#features" },
                { label: "How It Works", href: "#how" },
                { label: "Personalization", href: "#personalization" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* CTAs */}
            <div className="flex items-center gap-3">

              <Link
                href="/auth/signin"
                className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="bg-gradient-to-b from-background to-card transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Text */}
            <div className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
                Understand What You Eat,{" "}
                <span className="text-primary">Effortlessly.</span>
              </h1>

              <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                NutriLens uses AI to analyze your food intake, providing
                personalized insights and recommendations to help you achieve
                your health goals.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow hover:bg-primary/90 transition"
                >
                  Create Free Account
                </Link>

                <a
                  href="https://youtu.be/eytnJGhYu-w"
                  className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-base font-medium text-primary hover:bg-primary/10 transition"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right: Mockup */}
            <div className="flex items-center justify-center">
              <div className="w-[360px] h-[360px] rounded-2xl bg-card shadow-lg flex items-center justify-center p-10 border border-border">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-muted to-card flex items-center justify-center">
                  <div className="w-44 h-80 bg-background rounded-2xl shadow-md flex flex-col items-center p-4 border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2v6"
                          stroke="hsl(var(--primary))"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9z"
                          stroke="hsl(var(--primary))"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </div>
                    <div className="mt-6 w-full">
                      <div className="h-4 rounded bg-muted w-3/4 mb-3"></div>
                      <div className="h-3 rounded bg-muted w-1/2 mb-4"></div>
                      <div className="h-40 rounded bg-card border border-border p-3">
                        <div className="h-3 bg-muted w-2/3 rounded mb-2"></div>
                        <div className="h-3 bg-muted w-1/3 rounded mb-2"></div>
                        <div className="mt-3 space-y-2">
                          <div className="h-3 bg-muted w-full rounded"></div>
                          <div className="h-3 bg-muted w-3/4 rounded"></div>
                          <div className="h-3 bg-muted w-1/2 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto w-full flex justify-center">
                      <div className="h-10 w-28 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section
        id="features"
        className="bg-card scroll-mt-20 transition-colors duration-300"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-semibold text-foreground">
              Your All-in-One Nutrition Companion
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              NutriLens offers a comprehensive suite of tools to help you manage
              your nutrition and wellness effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "AI-Powered Food Analysis",
                desc: "Instantly analyze ingredients using your camera. Our AI identifies food items and provides detailed nutritional breakdowns.",
              },
              {
                title: "Personalized Insights",
                desc: "Get tailored meal and nutrition recommendations powered by your BMR, allergies, and health goals.",
              },
              {
                title: "Community Support",
                desc: "Join a thriving community sharing healthy recipes, motivation, and personalized tips to stay consistent.",
              },
              {
                title: "Data Privacy & Security",
                desc: "Your data is securely encrypted and never shared. NutriLens ensures total privacy with industry-leading protection.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-md border border-border transition-shadow duration-200"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 shadow-inner">
                  <span className="text-primary text-xl font-bold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section
        id="how"
        className="bg-background scroll-mt-20 transition-colors duration-300"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              Get Started in 3 Simple Steps
            </h2>
            <p className="mt-3 text-muted-foreground">
              Tracking your nutrition has never been this easy. Follow these
              steps to begin your journey to better health.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-start justify-between gap-6">
            {["Snap a Photo", "Get Instant Analysis", "Achieve Your Goals"].map(
              (title, i) => (
                <div
                  key={i}
                  className="flex-1 bg-card p-8 rounded-2xl text-center border border-border"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-background flex items-center justify-center shadow border border-border">
                    <span className="text-primary font-bold">{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {i === 0
                      ? "Take a picture of your meal or snack using the NutriLens app."
                      : i === 1
                        ? "Our AI identifies the food and provides detailed nutritional information."
                        : "Track your progress, adjust your diet, and reach your wellness objectives."}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-primary/5 border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 text-center">
          <h3 className="text-2xl font-semibold text-foreground">
            Ready to Transform Your Health?
          </h3>
          <p className="mt-3 text-muted-foreground">
            Create your free account and start using NutriLens today.
          </p>
          <div className="mt-6">
            <Link
              href="/auth/signup"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow hover:bg-primary/90 transition"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-card border-t border-border transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-semibold text-foreground">NutriLens</div>
                <div className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} NutriLens. All rights reserved.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-primary transition">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
