"use client";

import { useEffect, useState } from "react";
import { getValentines } from "../actions";
import dynamic from "next/dynamic";
import { ValentineDocument } from "../components/ValentinePdf";

// Dynamic import is required for PDFDownloadLink
const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
  ssr: false,
  loading: () => <p>Loading PDF Engine...</p>,
});

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkPass = () => {
    // Replace this with a better secret for production
    if (password === "secret123") setIsAuthenticated(true);
  };

  useEffect(() => {
    if (isAuthenticated) {
      getValentines().then(setData);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow flex gap-2">
          <input
            type="password"
            placeholder="Admin Password"
            className="border p-2 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={checkPass} className="bg-pink-600 text-white px-4 py-2 rounded">
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Drawings Received ({data.length})</h1>

          {data.length > 0 && (
            <PDFDownloadLink
              document={<ValentineDocument data={data} />}
              fileName="valentines.pdf"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
            </PDFDownloadLink>
          )}
        </div>

        {/* Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((val) => (
            <div key={val.id} className="bg-white p-2 border rounded shadow-sm opacity-50 hover:opacity-100 transition">
              <img src={val.imageData} alt="Valentine" className="w-full h-32 object-contain border border-dashed" />
              <div className="mt-2 text-xs flex justify-between text-gray-500">
                <span>To: {val.to}</span>
                <span>From: {val.from}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
