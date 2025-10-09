"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { FiCamera, FiClipboard, FiHelpCircle, FiEdit3 } from "react-icons/fi";

export default function DashboardPage() {
  const router = useRouter();
  const userName = "Sarah"; // replace with real data later

  const menuItems = [
    {
      title: "Scan Label",
      description: "Quickly analyze food labels for nutritional information.",
      icon: <FiCamera className="w-9 h-9 text-green-500" />,
      path: "/ingredient",
    },
    {
      title: "Diet Planner",
      description:
        "Create personalized meal plans based on your dietary needs.",
      icon: <FiClipboard className="w-9 h-9 text-green-500" />,
      path: "/planner",
    },
    {
      title: "Symptom Checker",
      description: "Identify potential health issues based on your symptoms.",
      icon: <FiHelpCircle className="w-9 h-9 text-green-500" />,
      path: "/symptom-checker",
    },
    {
      title: "Medicine Lookup",
      description: "Find information about medications and their interactions.",
      icon: <FiEdit3 className="w-9 h-9 text-green-500" />,
      path: "/scan/medicine",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f6fdf6] relative pb-20">
      <header className="flex justify-between items-center px-8 py-6 bg-[#f6fdf6]">
        <div className="flex items-center space-x-2">
          <img src="/next.svg" alt="NutriLens Logo" className="w-8 h-8" />
          <span className="text-xl font-semibold text-gray-800">NutriLens</span>
        </div>
        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-sm"
        />
      </header>

      <div className="px-8 mt-4 mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome back, {userName}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-8 mb-10">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => router.push(item.path)}
            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-8 flex flex-col items-center justify-center text-center"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-gray-900 font-semibold text-lg">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              {item.description}
            </p>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
