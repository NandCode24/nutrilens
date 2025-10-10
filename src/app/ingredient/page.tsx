"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera } from "lucide-react";

export default function ScanIngredient() {
  const [image, setImage] = useState<string | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleScan = () => {
    if (!image) {
      alert("Please capture or upload an ingredient label first!");
      return;
    }
    // later this will call Gemini API
    alert("Analyzing the ingredient label...");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center overflow-y-auto pb-10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white flex justify-between items-center px-8 py-4 border-b border-gray-100 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="text-lg font-semibold text-gray-800">NutriLens</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 text-sm">?</button>
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
      </header>

      {/* Main Section */}
      <div className="mt-28 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Scan Ingredient Label
        </h1>
        <p className="text-gray-500 mt-1">
          Center the label in the frame for the best results.
        </p>
      </div>

      {/* Scanner Frame */}
      <div className="relative mt-8 border-2 border-dashed border-green-400 rounded-2xl w-80 h-96 flex items-center justify-center overflow-hidden bg-white shadow-sm">
        {image ? (
          <Image
            src={image}
            alt="Uploaded Label"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Camera className="text-green-500 w-8 h-8" />
            </div>
            <p className="text-gray-600 mt-2 text-sm font-medium">
              Tap to capture
            </p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleUpload}
        />
      </div>

      {/* Buttons */}
      <div className="mt-8 w-80 flex flex-col space-y-4">
        <button
          onClick={handleScan}
          className="bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all"
        >
          Scan Now
        </button>

        {/* Divider */}
        {/* <div className="flex items-center justify-center text-gray-400 text-sm">
          <span className="border-t border-gray-200 w-16"></span>
          <span className="px-3">OR</span>
          <span className="border-t border-gray-200 w-16"></span>
        </div> */}

        {/* Removed Upload Image Button */}
      </div>
    </div>
  );
}
