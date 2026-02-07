"use client";

import React, { useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { Trash2, Pen, Eraser } from "lucide-react";

interface DrawingCanvasProps {
  onExport: (dataUrl: string) => void;
  onInteract: (hasContent: boolean) => void;
}

// Massive Color Palette
const COLORS = [
  "#000000",
  "#8B0000",
  "#FF0000",
  "#008000",
  "#1E90FF",
  "#87CEEB", // Blues
  "#4B0082",
  "#FF00FF",
  "#FF69B4", // Purples/Pinks
];

export default function DrawingCanvas({
  onExport,
  onInteract,
}: DrawingCanvasProps) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [eraseMode, setEraseMode] = useState(false);

  const handleChange = async () => {
    if (canvasRef.current) {
      // 1. ROBUST CHECK: Ask the canvas for the list of drawn paths
      const paths = await canvasRef.current.exportPaths();

      // 2. Only consider it "drawn" if there is at least one stroke
      const hasStrokes = paths.length > 0;
      onInteract(hasStrokes);

      // 3. Export the visual image
      const data = await canvasRef.current.exportImage("png");
      onExport(data);
    }
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    onInteract(false); // Force disable
    onExport("");
    setEraseMode(false); // Reset eraser
    setStrokeColor("#000000"); // Reset color
  };

  const toggleEraser = () => {
    setEraseMode(!eraseMode);
    if (canvasRef.current) {
      canvasRef.current.eraseMode(!eraseMode);
    }
  };

  return (
    <div className="w-full">
      {/* Color Palette Grid */}
      <div className="mb-3">
        <div className="select-none flex flex-wrap gap-1.5 justify-center bg-gray-50 p-2 rounded-lg border border-gray-100">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setStrokeColor(c);
                setEraseMode(false);
                canvasRef.current?.eraseMode(false);
              }}
              className={`w-9 h-9 rounded-full border border-gray-300 transition-transform hover:scale-110 select-none ${
                !eraseMode && strokeColor === c
                  ? "ring-2 ring-gray-600 scale-110 z-10"
                  : ""
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        {/* Tools Row */}
        <div className="flex justify-between items-center mt-2 px-1 select-none">
          <div className="flex gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase self-center mr-2 select-none">
              Tools:
            </span>
            <button
              type="button"
              onClick={toggleEraser}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-colors select-none ${
                eraseMode
                  ? "bg-pink-100 text-pink-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Eraser className="w-3 h-3" /> Eraser
            </button>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="select-none text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs uppercase font-bold"
          >
            <Trash2 className="w-3 h-3" /> Clear All
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full aspect-[1.13] rounded-lg overflow-hidden shadow-inner border border-gray-300 bg-white group">
        {/* Layer 1: Template */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none select-none"
          style={{ backgroundImage: "url('/template.png')" }}
        />

        {/* Layer 2: Canvas */}
        <div className="absolute inset-0 z-10 cursor-crosshair">
          select-none
          <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={4}
            strokeColor={strokeColor}
            onChange={handleChange}
            style={{ border: "none" }}
            width="100%"
            height="100%"
            className="bg-transparent"
            canvasColor="transparent"
          />
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1 select-none">
        <Pen className="w-3 h-3" /> Draw inside the box above
      </p>
    </div>
  );
}
