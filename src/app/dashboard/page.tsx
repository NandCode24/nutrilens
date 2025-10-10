"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { FiCamera, FiClipboard, FiHelpCircle, FiEdit3 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [showTransition, setShowTransition] = useState(false);

  // ✅ Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/signin");
    } else {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "User");
      } catch {
        localStorage.removeItem("user");
        router.push("/auth/signin");
      }
    }
  }, [router]);

  // ✅ Logout function (fully working)
  const handleLogout = () => {
    localStorage.removeItem("user");

    // ✅ Remove cookie (remove Secure for localhost)
    document.cookie = "isLoggedIn=; Max-Age=0; path=/; SameSite=Lax";

    // ✅ Show animation before redirect
    setShowTransition(true);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const menuItems = [
    {
      title: "Scan Label",
      description: "Quickly analyze food labels for nutritional information.",
      icon: <FiCamera className="w-9 h-9 text-green-500" />,
      path: "/ingredient",
    },
    {
      title: "Health Tips",
      description:
        "Get personalized health and nutrition tips to stay fit.",
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
      path: "/medicine",
    },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#f6fdf6] relative pb-20">
   

        {/* 🔹 Welcome Section */}
        <div className="px-8 mt-4 mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome back, {userName}
          </h1>
        </div>

        {/* 🔹 Dashboard Menu */}
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

      {/* ✨ Smooth Logout Transition */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#f6fdf6]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 🔹 Replace with your brand logo */}
            <motion.img
              src="/NutriLens.png" // ✅ your brand logo path here
              alt="NutriLens Logo"
              initial={{ scale: 0 }}
              animate={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-24 h-24 object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
