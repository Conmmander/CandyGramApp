"use client";

import React, { useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { Trash2, Palette, Pen } from "lucide-react";

interface DrawingCanvasProps {
  onExport: (dataUrl: string) => void;
}

const STROKE_WIDTH = 4;
const COLORS = [
  { name: "Black", hex: "#000000", class: "bg-black" },
  { name: "Red", hex: "#EF4444", class: "bg-red-500" },
  { name: "Pink", hex: "#EC4899", class: "bg-pink-500" },
  { name: "Purple", hex: "#9333EA", class: "bg-purple-600" },
];

export default function DrawingCanvas({ onExport }: DrawingCanvasProps) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [strokeColor, setStrokeColor] = useState(COLORS[0].hex);

  const handleChange = async () => {
    if (canvasRef.current) {
      try {
        // We wrap this in a try/catch because the library throws
        // "No stroke found" if you export while the canvas is empty
        // (e.g., accidental clicks or clearing).
        const data = await canvasRef.current.exportImage("png");
        onExport(data);
      } catch (e) {
        // This is expected behavior for empty canvas states; we can ignore it.
        // console.log('Canvas is empty or updating');
      }
    }
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    onExport(""); // Reset parent state
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-gray-500" />
          <div className="flex gap-1">
            {COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setStrokeColor(color.hex)}
                className={`w-6 h-6 rounded-full border border-gray-200 ${color.class} ${
                  strokeColor === color.hex ? "ring-2 ring-offset-1 ring-gray-400 scale-110" : "opacity-80"
                }`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-red-500 flex items-center gap-1 hover:underline"
        >
          <Trash2 className="w-3 h-3" /> Clear
        </button>
      </div>

      {/* CANVAS AREA */}
      {/* aspect-[1.13] approximates the 8.5x11 card shape (landscape) */}
      <div className="relative w-full aspect-[1.13] rounded-lg overflow-hidden shadow-inner border border-gray-300 bg-white">
        {/* Layer 1: Background Template
            Using absolute inset-0 ensures it fills the space.
            pointer-events-none ensures clicks pass THROUGH it.
        */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none select-none"
          style={{ backgroundImage: "url('/template.png')" }}
        />

        {/* Layer 2: Drawing Canvas
            Using absolute inset-0 z-10 ensures it sits physically ON TOP.
        */}
        <div className="absolute inset-0 z-10 cursor-crosshair">
          <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={STROKE_WIDTH}
            strokeColor={strokeColor}
            canvasColor="transparent"
            onChange={handleChange}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
        <Pen className="w-3 h-3" />
        Draw directly on the image above
      </p>
    </div>
  );
}
