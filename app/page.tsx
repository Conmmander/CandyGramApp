"use client";

import { submitValentine } from "./actions";
import { useState } from "react";
import DrawingCanvas from "./components/DrawingCanvas";
import { Heart, Building2 } from "lucide-react";

const BUILDINGS = ["Williams", "Geisert", "Harper", "Heitz/Singles", "University"];

export default function Home() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [imageData, setImageData] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    formData.append("imageData", imageData);

    const result = await submitValentine(formData);

    if (result?.success) {
      setStatus("success");
      setImageData("");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border-2 border-pink-200">
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 fill-pink-500 animate-bounce" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Submitted!</h1>
          <button onClick={() => setStatus("idle")} className="text-pink-600 underline">
            Send another
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border-t-8 border-pink-500">
        <h1 className="text-2xl font-bold text-pink-600 mb-2 text-center">Customize a Candy Gram</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Draw directly on the card below.</p>
        <p className="text-gray-500 text-sm text-center mb-6">
          Please keep the TO field legible so we can route it correctly!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Building Selector */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3" /> Destination Building
            </label>
            <div className="relative">
              <select
                name="building"
                required
                defaultValue=""
                className="w-full p-2 border border-gray-200 text-black rounded-lg focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none bg-white appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select a building...
                </option>
                {BUILDINGS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {/* Custom arrow icon for better styling */}
              <div className="absolute right-3 top-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <DrawingCanvas onExport={setImageData} />

          <button
            type="submit"
            disabled={!imageData || status === "submitting"}
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50"
          >
            {status === "submitting" ? "Sending..." : "Send Valentine"}
          </button>
        </form>
      </div>
    </main>
  );
}
