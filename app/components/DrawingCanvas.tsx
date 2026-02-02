"use client";

import React, { useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { Trash2, Pen, Palette } from "lucide-react";

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

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    onExport(""); // Reset parent state
  };

  // Whenever the user draws, we update the exported image
  const handleChange = async () => {
    if (canvasRef.current) {
      const data = await canvasRef.current.exportImage("png");
      onExport(data);
    }
  };

  return (
    <div className="w-full">
      {/* Controls Header */}
      <div className="flex justify-between items-center mb-3">
        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-gray-500" />
          <div className="flex gap-1">
            {COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setStrokeColor(color.hex)}
                className={`w-6 h-6 rounded-full border border-gray-200 ${color.class} ${
                  strokeColor === color.hex
                    ? "ring-2 ring-offset-1 ring-gray-400 scale-110"
                    : "opacity-80 hover:opacity-100"
                } transition-all`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-red-500 flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition-colors"
        >
          <Trash2 className="w-3 h-3" /> Clear
        </button>
      </div>

      {/* The Drawing Area */}
      <div className="border-2 border-dashed border-pink-300 rounded-lg overflow-hidden h-64 bg-white cursor-crosshair touch-none shadow-inner">
        <ReactSketchCanvas
          ref={canvasRef}
          strokeWidth={STROKE_WIDTH}
          strokeColor={strokeColor}
          canvasColor="transparent"
          onChange={handleChange}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
        <Pen className="w-3 h-3" />
        Draw a heart, write a note, or doodle!
      </p>
    </div>
  );
}
