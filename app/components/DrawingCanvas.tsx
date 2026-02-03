"use client";

import React, { useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { Trash2, Pen } from "lucide-react";

interface DrawingCanvasProps {
  onExport: (dataUrl: string) => void;
  onInteract: (hasContent: boolean) => void; // Tells parent if canvas has content
}

// Expanded Color Palette
const COLORS = [
  "#000000", // Black
  "#555555", // Grey
  "#FF0000", // Red
  "#FF7F00", // Orange
  "#FFFF00", // Yellow
  "#008000", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#EE82EE", // Violet
  "#FF69B4", // Hot Pink
  "#8B4513", // Brown
  "#00CED1", // Turquoise
  "#FFD700", // Gold
  "#C0C0C0", // Silver
];

export default function DrawingCanvas({ onExport, onInteract }: DrawingCanvasProps) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [strokeColor, setStrokeColor] = useState("#000000");

  const handleChange = async () => {
    if (canvasRef.current) {
      // 1. Tell parent "User has drawn something"
      onInteract(true);

      // 2. Export image
      const data = await canvasRef.current.exportImage("png");
      onExport(data);
    }
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    onInteract(false); // Tell parent "Canvas is empty"
    onExport("");
  };

  return (
    <div className="w-full">
      {/* Color Picker */}
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setStrokeColor(c)}
            className={`w-6 h-6 rounded-full border-2 transition-transform ${
              strokeColor === c ? "border-gray-600 scale-125 shadow-md" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
        <div className="w-px h-6 bg-gray-300 mx-1"></div> {/* Separator */}
        <button
          type="button"
          onClick={handleClear}
          className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs uppercase font-bold"
        >
          <Trash2 className="w-4 h-4" /> Clear
        </button>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full aspect-[1.13] rounded-lg overflow-hidden shadow-inner border border-gray-300 bg-white">
        {/* Layer 1: Background Template */}
        {/* Ensure 'template.png' exists in your /public folder! */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none select-none"
          style={{ backgroundImage: "url('/template.png')" }}
        />

        {/* Layer 2: Drawing Canvas */}
        <div className="absolute inset-0 z-10 cursor-crosshair">
          <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={4}
            strokeColor={strokeColor}
            onChange={handleChange}
            style={{ border: "none" }}
            width="100%"
            height="100%"
            className="bg-transparent"
            canvasColor="transparent" // CRITICAL: Makes canvas see-through
          />
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
        <Pen className="w-3 h-3" /> Draw inside the box above
      </p>
    </div>
  );
}
