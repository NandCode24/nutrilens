"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton";
import { useLoading } from "@/context/LoadingContext";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus(`❌ ${data.error || "Failed to send message."}`);
      }
    } catch {
      setStatus("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-16 px-6 transition-colors duration-300">
      {/* 🔙 Back Button */}
      <div className="absolute top-24 left-6 z-[60]">
        <BackButton />
      </div>

      {/* 📨 Contact Card */}
      <div className="max-w-3xl w-full bg-card border border-border shadow-sm rounded-2xl p-8 transition-colors duration-300">
        <h1 className="text-3xl font-semibold text-center mb-6">Contact Us</h1>
        <p className="text-center text-muted-foreground mb-8">
          We’d love to hear from you! Whether it’s feedback, support, or a
          partnership inquiry — reach out below.
        </p>

        {/* 📝 Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full border border-border bg-background rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-border bg-background rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Your message..."
              className="w-full border border-border bg-background rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Status Message */}
        {status && (
          <p
            className={`text-center mt-4 text-sm ${
              status.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
