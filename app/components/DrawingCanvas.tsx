"use client";

import React, { useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { Trash2, Palette, Pen } from "lucide-react";

interface DrawingCanvasProps {
  onExport: (dataUrl: string) => void;
  onDrawStart?: () => void; // New prop to notify parent
}

const COLORS = ["#000000", "#FF0000", "#FF00FF", "#0000FF", "#008000", "#FFA500"];

export default function DrawingCanvas({ onExport, onDrawStart }: DrawingCanvasProps) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [strokeColor, setStrokeColor] = useState("#000000");

  const handleChange = async () => {
    if (canvasRef.current) {
      // Notify parent that drawing has occurred
      onDrawStart?.();

      const data = await canvasRef.current.exportImage("png");
      onExport(data);
    }
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    onExport(""); // Clear the data in parent too
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setStrokeColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${strokeColor === c ? "border-gray-600 scale-110" : "border-transparent"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs uppercase font-bold"
        >
          <Trash2 className="w-4 h-4" /> Clear
        </button>
      </div>

      <div className="relative w-full aspect-[1.13] rounded-lg overflow-hidden shadow-inner border border-gray-300 bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none select-none"
          style={{ backgroundImage: "url('/template.png')" }}
        />
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
          />
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
        <Pen className="w-3 h-3" /> Draw inside the box above
      </p>
    </div>
  );
}
