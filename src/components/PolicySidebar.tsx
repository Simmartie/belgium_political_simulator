"use client";

import React, { useState } from "react";
import { useSimulator } from "../context/SimulatorContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Undo2, Plus, AlertCircle } from "lucide-react";

export default function PolicySidebar() {
  const { activePolicies, submitCustomPolicy, isLoading, justification, undoPolicy } = useSimulator();
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
    <aside className="w-full lg:w-96 border-r border-white/5 bg-black p-4 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2 space-y-8">
        
        {/* Custom Policy Creator */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Beleidsvorming</h2>
            <div className="flex gap-1 h-1 w-12">
              <div className="h-full w-1/3 bg-black" />
              <div className="h-full w-1/3 bg-[#FFD700]" />
              <div className="h-full w-1/3 bg-[#ED2939]" />
            </div>
          </div>
          <Card className="bg-white/5 border-white/10 premium-shadow">
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="title" className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Titel van het beleid
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="bijv. Kilometerheffing invoeren"
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Beschrijving / Impact
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Wat wil je bereiken met dit beleid?"
                    rows={4}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 resize-none transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || !title.trim() || !description.trim()} 
                  className="w-full bg-gradient-to-r from-black via-[#FFD700] to-[#ED2939] text-black font-black uppercase tracking-widest hover:opacity-90 transition-opacity border-none h-12"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                      ANALYSES...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      BELEID INDIENEN
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Politieke Analyse - VRT NWS BREAKING STYLE */}
        {justification && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-[#ED2939] border-none overflow-hidden relative premium-shadow">
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <AlertCircle className="w-12 h-12 text-white" />
              </div>
              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  VRT NWS BREAKING
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <p className="text-sm text-white font-medium leading-relaxed italic">
                  "{justification}"
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Active Policies History */}
        {activePolicies.length > 0 && (
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Wetgevende Geschiedenis</h2>
            <div className="space-y-4">
              {activePolicies.map((policy) => (
                <Card key={policy.id} className="bg-white/5 border-white/5 hover:border-white/10 transition-all group overflow-hidden">
                  <div className="h-1 w-full flex opacity-30 group-hover:opacity-100 transition-opacity">
                    <div className="h-full w-1/3 bg-black" />
                    <div className="h-full w-1/3 bg-[#FFD700]" />
                    <div className="h-full w-1/3 bg-[#ED2939]" />
                  </div>
                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-100">
                        {policy.title}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => undoPolicy(policy.id)}
                      className="h-8 w-8 text-slate-500 hover:text-[#ED2939] hover:bg-red-500/10 transition-colors"
                      title="Beleid terugdraaien"
                    >
                      <Undo2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {policy.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}
