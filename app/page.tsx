"use client";

import { submitValentine } from "./actions";
import { useState } from "react";
import DrawingCanvas from "./components/DrawingCanvas";
import { Heart } from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [imageData, setImageData] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData();
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
