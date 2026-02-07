"use client";

import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { Trash2, Pen, Eraser } from "lucide-react";

interface DrawingCanvasProps {
  onExport: (dataUrl: string) => void;
  onInteract: (hasContent: boolean) => void;
}

const COLORS = [
  "#000000",
  "#8B0000",
  "#FF0000",
  "#008000",
  "#1E90FF",
  "#87CEEB",
  "#4B0082",
  "#FF00FF",
  "#FF69B4",
];

export default function DrawingCanvas({
  onExport,
  onInteract,
}: DrawingCanvasProps) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [eraseMode, setEraseMode] = useState(false);

  // Timer reference for the debounce
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = async () => {
    if (!canvasRef.current) return;

    // 1. FAST CHECK: Just check if paths exist to unlock the UI immediately
    // exportPaths is much faster than exportImage
    canvasRef.current.exportPaths().then((paths) => {
      onInteract(paths.length > 0);
    });

    // 2. HEAVY LIFTING: Debounce the PNG generation
    // If the user is writing "Hello", we don't want to generate an image
    // for H, then e, then l... we want to wait until they pause.
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (canvasRef.current) {
        const data = await canvasRef.current.exportImage("png");
        onExport(data);
      }
    }, 400); // Wait 400ms after the last stroke to generate image
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    onInteract(false);
    onExport("");
    setEraseMode(false);
    setStrokeColor("#000000");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const toggleEraser = () => {
    setEraseMode(!eraseMode);
    if (canvasRef.current) {
      canvasRef.current.eraseMode(!eraseMode);
    }
  };

  return (
    <div className="w-full">
      {/* Colors */}
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

        {/* Tools */}
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
      {/* touch-action: none prevents scrolling while drawing */}
      <div className="relative w-full aspect-[1.13] rounded-lg overflow-hidden shadow-inner border border-gray-300 bg-white group touch-none">
        {/* Layer 1: Template */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none select-none"
          style={{ backgroundImage: "url('/template.png')" }}
        />

        {/* Layer 2: Canvas */}
        <div className="absolute inset-0 z-10 cursor-crosshair select-none touch-none">
          <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={4}
            strokeColor={strokeColor}
            onChange={handleChange}
            style={{ border: "none", touchAction: "none" }}
            width="100%"
            height="100%"
            className="bg-transparent"
            canvasColor="transparent"
            allowOnlyPointerType="all"
            withTimestamp={true}
          />
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1 select-none">
        <Pen className="w-3 h-3" /> Draw inside the box above
      </p>
    </div>
  );
}
