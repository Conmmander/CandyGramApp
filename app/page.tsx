"use client";

import { submitValentine } from "./actions";
import { useState } from "react";
import { Heart } from "lucide-react";
import DrawingCanvas from "./components/DrawingCanvas";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [imageData, setImageData] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // We must manually append the image data from our state to the form
    formData.append("imageData", imageData);

    const result = await submitValentine(formData);

    if (result?.success) {
      setStatus("success");
      form.reset();
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sent!</h1>
          <button onClick={() => setStatus("idle")} className="text-pink-600 hover:text-pink-800 underline">
            Send another
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border-t-8 border-pink-500">
        <h1 className="text-2xl font-bold text-pink-600 mb-6 text-center">Draw a Valentine</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase">To</label>
              <input
                name="to"
                required
                className="mt-1 block w-full border-b-2 border-gray-200 focus:border-pink-500 outline-none px-1 py-1"
                placeholder="Name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase">From</label>
              <input
                name="from"
                required
                className="mt-1 block w-full border-b-2 border-gray-200 focus:border-pink-500 outline-none px-1 py-1"
                placeholder="Name"
              />
            </div>
          </div>

          {/* Import Drawing Component */}
          <DrawingCanvas onExport={setImageData} />

          {status === "error" && <p className="text-red-500 text-sm text-center">Something went wrong. Try again.</p>}

          <button
            type="submit"
            disabled={!imageData || status === "submitting"}
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Sending..." : "Send Valentine"}
          </button>
        </form>
      </div>
    </main>
  );
}
