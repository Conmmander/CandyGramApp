"use client";

import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ValentineDocument } from "../components/ValentinePdf";

// Define the type for your data
interface Valentine {
  id: string;
  building: string;
  imageData: string;
  template: string;
  createdAt: Date;
}

export default function DownloadButton({ data }: { data: Valentine[] }) {
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on the client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="text-gray-400">Loading PDF engine...</div>;
  }

  return (
    <PDFDownloadLink
      document={<ValentineDocument data={data} />}
      fileName="valentines.pdf"
      className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 font-bold"
    >
      {({ blob, url, loading, error }) => (loading ? "Generating PDF..." : "Download PDF")}
    </PDFDownloadLink>
  );
}
