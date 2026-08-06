"use client";

import React from "react";
import { useSimulator } from "../context/SimulatorContext";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const simulator = useSimulator();
  const pathname = usePathname();

  return (
    <header className="h-auto min-h-[4rem] py-2 md:py-0 border-b border-black/10 bg-[#f7f3eb]/90 backdrop-blur-md flex flex-col md:flex-row items-center justify-between px-4 md:px-6 sticky top-0 z-50 gap-3 md:gap-0">
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <div className="flex flex-col">
          <h1 className="text-[11px] sm:text-sm md:text-xl font-black tracking-tighter flex items-center gap-1 md:gap-2">
            <span className="text-slate-900">BELGISCHE</span>
            <span className="text-[#FFD700]">POLITIEKE</span>
            <span className="text-[#ED2939]">SIMULATOR</span>
          </h1>
          <div className="h-1 w-full flex">
            <div className="h-full w-1/3 bg-slate-900" />
            <div className="h-full w-1/3 bg-[#FFD700]" />
            <div className="h-full w-1/3 bg-[#ED2939]" />
          </div>
        </div>

        {simulator?.resetSimulator && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={simulator.resetSimulator}
            className="md:hidden border-black/10 bg-white hover:bg-slate-50 text-slate-900 gap-1 text-[10px] font-bold uppercase tracking-wider premium-shadow h-7 px-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="sr-only">Opnieuw Beginnen</span>
          </Button>
        )}
      </div>

      <div className="flex bg-white/50 p-1 rounded-md border border-black/10 w-full md:w-auto overflow-x-auto scrollbar-none">
        <Link 
          href="/" 
          className={`px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${pathname === "/" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
        >
          Beleid Maker
        </Link>
        <Link 
          href="/partijprogramma" 
          className={`px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${pathname === "/partijprogramma" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
        >
          Partijprogramma
        </Link>
        <Link 
          href="/career" 
          className={`px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${pathname === "/career" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
        >
          Career Mode
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <div className="flex flex-col items-end w-32 lg:w-48">
          <div className="flex justify-between w-full mb-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#2B2B2C]">Simulator V2</span>
          </div>
        </div>

        {simulator?.resetSimulator && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={simulator.resetSimulator}
            className="border-black/10 bg-white hover:bg-slate-50 text-slate-900 gap-2 text-xs font-bold uppercase tracking-wider premium-shadow"
          >
            <RotateCcw className="w-3 h-3" />
            Opnieuw Beginnen
          </Button>
        )}
      </div>
    </header>
  );
}
