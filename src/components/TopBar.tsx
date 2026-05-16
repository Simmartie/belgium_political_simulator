"use client";

import React from "react";
import { useSimulator } from "../context/SimulatorContext";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";

export default function TopBar() {
  const { resetSimulator } = useSimulator();

  return (
    <header className="h-16 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="text-white">BELGIË</span>
            <span className="text-[#FFD700]">POLITIEKE</span>
            <span className="text-[#ED2939]">SIMULATOR</span>
          </h1>
          <div className="h-1 w-full flex">
            <div className="h-full w-1/3 bg-black" />
            <div className="h-full w-1/3 bg-[#FFD700]" />
            <div className="h-full w-1/3 bg-[#ED2939]" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end w-48 lg:w-64">
          <div className="flex justify-between w-full mb-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Belgische Politieke Simulator</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetSimulator}
          className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 text-xs font-bold uppercase tracking-wider"
        >
          <RotateCcw className="w-3 h-3" />
          Opnieuw Beginnen
        </Button>
      </div>
    </header>
  );
}
