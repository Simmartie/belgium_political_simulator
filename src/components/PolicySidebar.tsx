"use client";

import React from "react";
import { useSimulator } from "../context/SimulatorContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";

export default function PolicySidebar() {
  const { policies, togglePolicy, isLoading, justification } = useSimulator();

  return (
    <aside className="w-full lg:w-80 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100">Proposed Policies</h2>
          {isLoading && (
            <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin" />
          )}
        </div>
        <div className="space-y-4">
          {policies.map((policy) => (
            <Card key={policy.id} className={`bg-slate-800 border-slate-700 transition-opacity ${isLoading ? "opacity-50" : ""}`}>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-sm font-semibold text-slate-100">
                    {policy.title}
                  </CardTitle>
                  <Switch
                    checked={policy.isActive}
                    onCheckedChange={() => togglePolicy(policy.id)}
                    disabled={isLoading}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription className="text-xs text-slate-400 mt-2">
                  {policy.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {justification && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <Card className="bg-blue-950/40 border-blue-900">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Politieke Analyse (VRT NWS)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "{justification}"
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </aside>
  );
}
