"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "Scan Ingredients",
    description:
      "Easily scan the ingredients of your food items to track your nutritional intake. Our app provides detailed information about calories, macros, and allergens.",
    image: "/images/scan.png",
    color: "from-green-400/70 to-green-200/70",
  },
  {
    id: 2,
    title: "Medicine Lookup",
    description:
      "Quickly find detailed information about medicines, dosage, and interactions. Stay safe and informed with our smart lookup tool.",
    image: "/images/medicine.png",
    color: "from-blue-400/70 to-blue-200/70",
  },
  {
    id: 3,
    title: "Symptom Checker",
    description:
      "Check symptoms, get possible causes, and learn about prevention methods using our AI-powered symptom checker.",
    image: "/images/symptom.png",
    color: "from-purple-400/70 to-purple-200/70",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    // If it's the last slide, go to signup
    if (current === slides.length - 1) {
      router.push("/auth/signup");
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const skipOnboarding = () => {
    router.push("/auth/signup");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        key={slides[current].id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="text-center px-6"
      >
        {/* Image Section */}
        <div
          className={`w-48 h-48 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br ${slides[current].color}`}
        >
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-semibold mt-6 text-gray-900">
          {slides[current].title}
        </h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          {slides[current].description}
        </p>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-4">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === current ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>

        {/* Buttons Section */}
        <div className="flex justify-between w-full max-w-md mx-auto mt-8">
          <button
            type="button"
            onClick={skipOnboarding}
            className="text-sm text-gray-500 font-medium"
          >
            Skip
          </button>

          <button
            onClick={nextSlide}
            className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition"
          >
            {current === slides.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
