/* src/app/page.tsx */
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ---------- NAV ---------- */}
      <header className="border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              {/* simple SVG leaf + text logo */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                className="flex-none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect width="24" height="24" rx="6" fill="#ECFDF6" />
                <path
                  d="M8.8 13.2c1.2-1.2 4.2-3 6.6-1.6 0 0 .6-3-2.2-4.8-2.6-1.6-6.6.6-6.6.6S8 9 8.8 13.2z"
                  fill="#16A34A"
                />
                <path
                  d="M13 14.2c.2.2.6.2.8 0 .2-.2.2-.6 0-.8-.2-.2-.6-.2-.8 0-.2.2-.2.6 0 .8z"
                  fill="#22C55E"
                />
              </svg>
              <span className="text-lg font-semibold tracking-tight">
                NutriLens
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
              <Link href="#features" className="hover:text-slate-800">
                Features
              </Link>
              <Link href="#how" className="hover:text-slate-800">
                How It Works
              </Link>
              <Link href="#personalization" className="hover:text-slate-800">
                Personalization
              </Link>
              <Link href="#testimonials" className="hover:text-slate-800">
                Testimonials
              </Link>
            </nav>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="hidden md:inline-flex rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center rounded-full bg-[#22C55E] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#16A34A]"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="bg-gradient-to-b from-white to-[#F9FCF9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Text */}
            <div className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Understand What You Eat,{" "}
                <span className="text-[#22C55E]">Effortlessly.</span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 max-w-xl">
                NutriLens uses AI to analyze your food intake, providing
                personalized insights and recommendations to help you achieve
                your health goals.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center rounded-full bg-[#22C55E] px-6 py-3 text-base font-semibold text-white shadow hover:bg-[#16A34A] transition"
                >
                  Create Free Account
                </Link>

                <a
                  href="#how"
                  className="inline-flex items-center rounded-md border border-[#22C55E] px-4 py-2 text-base font-medium text-[#22C55E] hover:bg-[#DCFCE7] transition"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right: Illustration / card */}
            <div className="flex items-center justify-center">
              <div className="w-[360px] h-[360px] rounded-2xl bg-white shadow-lg flex items-center justify-center p-10">
                {/* placeholder device illustration */}
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#fff7ed] to-[#fff] flex items-center justify-center">
                  {/* simple phone mockup */}
                  <div className="w-44 h-80 bg-white rounded-2xl shadow-md flex flex-col items-center p-4">
                    <div className="w-10 h-10 rounded-full bg-[#ECFDF6] flex items-center justify-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2v6"
                          stroke="#16A34A"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9z"
                          stroke="#22C55E"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="mt-6 w-full">
                      <div className="h-4 rounded bg-slate-100 w-3/4 mb-3"></div>
                      <div className="h-3 rounded bg-slate-100 w-1/2 mb-4"></div>

                      <div className="h-40 rounded bg-[#F8FAF8] border border-[#ECFDF6] p-3">
                        <div className="h-3 bg-slate-200 w-2/3 rounded mb-2"></div>
                        <div className="h-3 bg-slate-200 w-1/3 rounded mb-2"></div>
                        <div className="mt-3 space-y-2">
                          <div className="h-3 bg-slate-200 w-full rounded"></div>
                          <div className="h-3 bg-slate-200 w-3/4 rounded"></div>
                          <div className="h-3 bg-slate-200 w-1/2 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto w-full flex justify-center">
                      <div className="h-10 w-28 bg-[#22C55E] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section id="features" className="bg-[#F7FFF7]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-semibold text-slate-900 leading-tight">
              Your All-in-One Nutrition Companion
            </h2>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              NutriLens offers a comprehensive suite of tools to help you manage
              your nutrition and wellness effectively.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI-Powered Food Analysis */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col items-start text-left">
                <div className="w-14 h-14 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-5 shadow-inner">
                  {/* Scan Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 text-[#16A34A]"
                  >
                    <path d="M11 11l6 6" stroke="currentColor" />
                    <circle cx="8.5" cy="8.5" r="5" stroke="#22C55E" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  AI-Powered Food Analysis
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  Instantly analyze ingredients using your camera. Our AI
                  identifies food items and provides detailed nutritional
                  breakdowns.
                </p>
              </div>
            </div>

            {/* Personalized Insights */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col items-start text-left">
                <div className="w-14 h-14 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-5 shadow-inner">
                  {/* Brain/insight icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 text-[#16A34A]"
                  >
                    <path
                      d="M12 3c2.5 0 4.5 2 4.5 4.5S14.5 12 12 12s-4.5-2-4.5-4.5S9.5 3 12 3z"
                      stroke="currentColor"
                    />
                    <path d="M12 12v9M9 15h6" stroke="#22C55E" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Personalized Insights
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  Get tailored meal and nutrition recommendations powered by
                  your BMR, allergies, and health goals.
                </p>
              </div>
            </div>

            {/* Community Support */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col items-start text-left">
                <div className="w-14 h-14 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-5 shadow-inner">
                  {/* Users/community icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 text-[#16A34A]"
                  >
                    <circle cx="12" cy="7" r="3" stroke="currentColor" />
                    <path
                      d="M5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"
                      stroke="#22C55E"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Community Support
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  Join a thriving community of users sharing healthy recipes,
                  motivation, and personalized tips to stay consistent.
                </p>
              </div>
            </div>

            {/* Data Privacy & Security */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col items-start text-left">
                <div className="w-14 h-14 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-5 shadow-inner">
                  {/* Lock/security icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 text-[#16A34A]"
                  >
                    <rect
                      x="4"
                      y="11"
                      width="16"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                    />
                    <path d="M8 11V7a4 4 0 018 0v4" stroke="#22C55E" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Data Privacy & Security
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  Your data is securely encrypted and never shared. NutriLens
                  ensures total privacy with industry-leading protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              Get Started in 3 Simple Steps
            </h2>
            <p className="mt-3 text-slate-600">
              Tracking your nutrition has never been this easy. Follow these
              steps to begin your journey to better health.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex-1 bg-[#F9FFF9] p-8 rounded-2xl text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
                <span className="text-[#22C55E] font-bold">1</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Snap a Photo
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Take a picture of your meal or snack using the NutriLens app.
              </p>
            </div>

            <div className="flex-1 bg-[#F9FFF9] p-8 rounded-2xl text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
                <span className="text-[#22C55E] font-bold">2</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Get Instant Analysis
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Our AI identifies the food and provides detailed nutritional
                information.
              </p>
            </div>

            <div className="flex-1 bg-[#F9FFF9] p-8 rounded-2xl text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
                <span className="text-[#22C55E] font-bold">3</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Achieve Your Goals
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Track your progress, adjust your diet, and reach your wellness
                objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- HEALTH AT A GLANCE ---------- */}
      <section id="personalization" className="bg-[#F7FFF7]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Your Health at a Glance
              </h2>
              <p className="mt-3 text-slate-600">
                NutriLens provides a comprehensive dashboard to help you stay on
                top of your nutrition and wellness journey. Track your daily
                intake, monitor your progress, and receive personalized
                recommendations to keep you on track.
              </p>

              <ul className="mt-6 space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block w-3 h-3 rounded-full bg-[#22C55E]"></span>
                  <div>
                    <strong className="text-slate-900">
                      Calorie Tracking:
                    </strong>{" "}
                    Effortlessly log meals and monitor daily calorie
                    consumption.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block w-3 h-3 rounded-full bg-[#22C55E]"></span>
                  <div>
                    <strong className="text-slate-900">
                      Macronutrient Breakdown:
                    </strong>{" "}
                    Visualize protein, carbs, and fat to ensure balanced intake.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block w-3 h-3 rounded-full bg-[#22C55E]"></span>
                  <div>
                    <strong className="text-slate-900">
                      Progress Reports:
                    </strong>{" "}
                    Get weekly and monthly summaries to see how far you've come.
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center">
              {/* large phone mockup or screenshot placeholder */}
              <div className="w-[320px] h-[560px] rounded-2xl bg-white shadow-lg border border-slate-100 p-6">
                <div className="h-full flex flex-col">
                  <div className="h-12 mb-4 w-full rounded bg-slate-50"></div>
                  <div className="flex-1 rounded bg-[#F8FAF8] p-4">
                    <div className="h-3 bg-slate-200 w-2/3 rounded mb-3"></div>
                    <div className="h-3 bg-slate-200 w-1/2 rounded mb-3"></div>
                    <div className="h-3 bg-slate-200 w-full rounded mb-1"></div>
                    <div className="mt-4 space-y-2">
                      <div className="h-3 bg-slate-200 w-full rounded"></div>
                      <div className="h-3 bg-slate-200 w-4/5 rounded"></div>
                      <div className="h-3 bg-slate-200 w-3/5 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section id="testimonials" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              Loved by Health Enthusiasts
            </h2>
            <p className="mt-3 text-slate-600">
              Don't just take our word for it. Hear what our users have to say
              about their journey with NutriLens.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <blockquote className="bg-[#F7FFF7] rounded-xl p-6 shadow-sm">
              <p className="text-slate-700 italic">
                “NutriLens has completely transformed my approach to nutrition.
                The AI analysis is incredibly accurate, and the personalized
                insights have helped me make healthier choices effortlessly.”
              </p>
              <footer className="mt-4 text-sm text-slate-600 font-semibold">
                — Sarah M., Fitness Blogger
              </footer>
            </blockquote>

            <blockquote className="bg-[#F7FFF7] rounded-xl p-6 shadow-sm">
              <p className="text-slate-700 italic">
                “I’ve tried numerous diet apps, but NutriLens stands out. The
                community support is fantastic, and the privacy features give me
                peace of mind.”
              </p>
              <footer className="mt-4 text-sm text-slate-600 font-semibold">
                — David L., Working Professional
              </footer>
            </blockquote>

            <blockquote className="bg-[#F7FFF7] rounded-xl p-6 shadow-sm">
              <p className="text-slate-700 italic">
                “The dashboard is so intuitive and easy to use. I can quickly
                track my progress and see the impact of my dietary changes.”
              </p>
              <footer className="mt-4 text-sm text-slate-600 font-semibold">
                — Emily R., Marathon Runner
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ---------- CTA BANNER ---------- */}
      <section className="bg-gradient-to-r from-[#E6FFE9] to-[#F9FFF9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 text-center">
          <h3 className="text-2xl font-semibold text-slate-900">
            Ready to Transform Your Health?
          </h3>
          <p className="mt-3 text-slate-600">
            Create your free account and start using NutriLens today.
          </p>
          <div className="mt-6">
            <Link
              href="/auth/signup"
              className="inline-flex items-center rounded-full bg-[#22C55E] px-6 py-3 text-base font-semibold text-white shadow hover:bg-[#16A34A]"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-[#F8FAF8] border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {/* small logo */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className=""
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect width="24" height="24" rx="5" fill="#ECFDF6" />
                <path
                  d="M8 13c1.2-1.2 4-3 6-1.6"
                  stroke="#16A34A"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 14.2c.2.2.6.2.8 0"
                  stroke="#22C55E"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <div className="font-semibold">NutriLens</div>
                <div className="text-sm text-slate-600">
                  © {new Date().getFullYear()} NutriLens. All rights reserved.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-slate-800">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-slate-800">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-slate-800">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
