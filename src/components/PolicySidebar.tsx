"use client";

import React, { useState } from "react";
import { useSimulator } from "../context/SimulatorContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";

export default function PolicySidebar() {
  const { activePolicies, submitCustomPolicy, isLoading, justification } = useSimulator();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    submitCustomPolicy(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <aside className="w-full lg:w-96 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        
        {/* Custom Policy Creator */}
        <div>
          <h2 className="text-lg font-bold text-slate-100 mb-4">Custom Policy Creator</h2>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
                    Policy Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Suikertaks invoeren"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
                    Policy Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain the policy in natural language..."
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || !title.trim() || !description.trim()} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    "Beleid Indienen / Submit Policy"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Politieke Analyse */}
        {justification && (
          <div>
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

        {/* Active Policies History */}
        {activePolicies.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-100 mb-4">Actief Beleid / Active Policies</h2>
            <div className="space-y-3">
              {activePolicies.map((policy) => (
                <Card key={policy.id} className="bg-slate-800/60 border-slate-700">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm font-semibold text-slate-200">
                      {policy.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <CardDescription className="text-xs text-slate-400">
                      {policy.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
