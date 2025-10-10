"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow-sm rounded-2xl p-8">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-6">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center mb-6">
          We’d love to hear from you! Whether it’s feedback, support, or a
          partnership inquiry — reach out below.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Your message..."
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
