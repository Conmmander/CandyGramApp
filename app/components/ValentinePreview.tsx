"use client";

import React, { useState } from "react";
import { Trash2, ZoomIn, X, Loader2 } from "lucide-react";

interface Valentine {
  id: string;
  imageData: string;
  building: string;
  createdAt: Date;
}

interface ValentinePreviewProps {
  val: Valentine;
  deletingId: string | null;
  onDelete: (id: string) => void;
}

export default function ValentinePreview({ val, deletingId, onDelete }: ValentinePreviewProps) {
  const [isEnlarged, setIsEnlarged] = useState(false);
  const formattedDate = new Date(val.createdAt).toLocaleString();

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        {/* Clickable Thumbnail */}
        <td className="p-4 w-24">
          <div
            onClick={() => setIsEnlarged(true)}
            className="group relative w-16 h-14 bg-gray-100 rounded border border-gray-200 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-20 flex items-center justify-center">
              <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
            </div>
            <img
              src="/template.png"
              className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
              alt="template"
            />
            <img src={val.imageData} className="absolute inset-0 w-full h-full object-contain z-10" alt="drawing" />
          </div>
        </td>

        <td className="p-4 text-sm text-gray-600">{formattedDate}</td>

        <td className="p-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            {val.building}
          </span>
        </td>

        <td className="p-4 text-right">
          <button
            onClick={() => onDelete(val.id)}
            disabled={deletingId === val.id}
            className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50 disabled:opacity-50"
          >
            {deletingId === val.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          </button>
        </td>
      </tr>

      {/* Enlarged Modal Overlay */}
      {isEnlarged && (
        <td className="p-0 m-0">
          {" "}
          {/* Wrapper to keep HTML valid inside a table body */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsEnlarged(false)}
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()} // Stop clicks inside from closing it
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Building: {val.building}</h3>
                  <p className="text-sm text-gray-500">{formattedDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onDelete(val.id);
                      setIsEnlarged(false);
                    }}
                    className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                  <button
                    onClick={() => setIsEnlarged(false)}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Large Image Canvas */}
              <div className="relative w-full aspect-[1.13] bg-gray-100">
                <img src="/template.png" alt="Template" className="absolute inset-0 w-full h-full object-contain z-0" />
                <img src={val.imageData} alt="Drawing" className="absolute inset-0 w-full h-full object-contain z-10" />
              </div>
            </div>
          </div>
        </td>
      )}
    </>
  );
}
