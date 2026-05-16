"use client";

import React from "react";
import { useSimulator } from "../context/SimulatorContext";
import { Progress } from "./ui/progress";
import { Activity } from "lucide-react";

export default function TopBar() {
  const { stabilityScore } = useSimulator();

  let stabilityColor = "bg-green-500";
  if (stabilityScore < 40) stabilityColor = "bg-red-500";
  else if (stabilityScore < 70) stabilityColor = "bg-yellow-500";

  return (
    <header className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-bold tracking-tight">Belgian Policy Simulator</h1>
        </div>

        <div className="flex items-center gap-4 w-64 md:w-96">
          <span className="text-sm font-medium whitespace-nowrap">Gov Stability</span>
          <div className="flex-1">
            <Progress value={stabilityScore} className="h-3" indicatorClassName={stabilityColor} />
          </div>
          <span className="text-sm font-bold w-8 text-right">{stabilityScore}%</span>
        </div>
      </div>
    </header>
  );
}
