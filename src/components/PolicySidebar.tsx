"use client";

import React, { useState } from "react";
import { useSimulator } from "../context/SimulatorContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, Plus, AlertCircle } from "lucide-react";

export default function PolicySidebar() {
  const { activePolicies, submitCustomPolicy, isLoading, mediaReactions, selectPolicy, deletePolicy, selectedPolicyId } = useSimulator();
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
    <aside className="w-full lg:w-96 lg:border-r border-b lg:border-b-0 border-black/10 bg-[#f7f3eb] p-4 flex flex-col lg:h-full lg:overflow-hidden shrink-0">
      <div className="flex-1 lg:overflow-y-scroll lg:pr-6 space-y-8 scrollbar-gutter-stable">
        
        {/* Custom Policy Creator */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2B2B2C]">Beleidsvorming</h2>
            <div className="flex gap-1 h-1 w-12">
              <div className="h-full w-1/3 bg-black" />
              <div className="h-full w-1/3 bg-[#FFD700]" />
              <div className="h-full w-1/3 bg-[#ED2939]" />
            </div>
          </div>
          <Card className="bg-white border-black/5 premium-shadow">
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="title" className="block text-[10px] font-black uppercase tracking-wider text-[#2B2B2C] mb-2">
                    Titel van het beleid
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="bijv. Kilometerheffing invoeren"
                    className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-[#2B2B2C]/60 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-[10px] font-black uppercase tracking-wider text-[#2B2B2C] mb-2">
                    Beschrijving / Impact
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Wat wil je bereiken met dit beleid?"
                    rows={4}
                    className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-[#2B2B2C]/60 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || !title.trim() || !description.trim()} 
                  className="w-full bg-gradient-to-r from-slate-950 via-[#FFD700] to-[#ED2939] text-white font-black uppercase tracking-widest hover:opacity-90 transition-opacity border-none h-12 shadow-md"
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

        {/* Politieke Analyse - Media Reacties */}
        {mediaReactions && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#2B2B2C]">Media Reacties</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {/* Socialist */}
              <Card className="bg-[#ED2939]/10 border-[#ED2939]/20 overflow-hidden relative">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-[9px] font-black text-[#ED2939] uppercase tracking-widest">
                    Socialistische Pers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <p className="text-xs text-slate-800 font-medium italic">
                    "{mediaReactions.socialist}"
                  </p>
                </CardContent>
              </Card>

              {/* Liberal */}
              <Card className="bg-[#0047AB]/5 border-[#0047AB]/10 overflow-hidden relative">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-[9px] font-black text-[#0047AB] uppercase tracking-widest">
                    Liberale Pers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <p className="text-xs text-slate-800 font-medium italic">
                    "{mediaReactions.liberal}"
                  </p>
                </CardContent>
              </Card>

              {/* Nationalist/Conservative */}
              <Card className="bg-[#FFD700]/10 border-[#FFD700]/20 overflow-hidden relative">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-[9px] font-black text-[#857200] uppercase tracking-widest">
                    Nationalistische Pers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <p className="text-xs text-slate-800 font-medium italic">
                    "{mediaReactions.nationalist}"
                  </p>
                </CardContent>
              </Card>

              {/* Christian Democrat */}
              <Card className="bg-[#FF8C00]/5 border-[#FF8C00]/10 overflow-hidden relative">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-[9px] font-black text-[#c2410c] uppercase tracking-widest">
                    Christendemocratische Pers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <p className="text-xs text-slate-800 font-medium italic">
                    "{mediaReactions.christian_democrat}"
                  </p>
                </CardContent>
              </Card>

              {/* Ecological */}
              {mediaReactions.ecological && (
                <Card className="bg-[#22c55e]/5 border-[#22c55e]/10 overflow-hidden relative">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-[9px] font-black text-[#16a34a] uppercase tracking-widest">
                      Ecologische Pers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <p className="text-xs text-slate-800 font-medium italic">
                      "{mediaReactions.ecological}"
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Communist */}
              {mediaReactions.communist && (
                <Card className="bg-[#b91c1c]/5 border-[#b91c1c]/10 overflow-hidden relative">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-[9px] font-black text-[#b91c1c] uppercase tracking-widest">
                      Communistische Pers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <p className="text-xs text-slate-800 font-medium italic">
                      "{mediaReactions.communist}"
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Active Policies History */}
        {activePolicies.length > 0 && (
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2B2B2C] mb-4">Wetgevende Geschiedenis</h2>
            <div className="space-y-4">
              {activePolicies.map((policy) => {
                const isSelected = policy.id === selectedPolicyId;
                return (
                <Card 
                  key={policy.id} 
                  className={`bg-white hover:border-black/20 cursor-pointer transition-all group overflow-hidden ${isSelected ? 'border-black/20 shadow-[0_5px_20px_rgba(0,0,0,0.05)]' : 'border-black/5'}`}
                  onClick={() => selectPolicy(policy.id)}
                >
                  <div className={`h-1 w-full flex transition-opacity ${isSelected ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`}>
                    <div className="h-full w-1/3 bg-slate-900" />
                    <div className="h-full w-1/3 bg-[#FFD700]" />
                    <div className="h-full w-1/3 bg-[#ED2939]" />
                  </div>
                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900">
                        {policy.title}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePolicy(policy.id);
                      }}
                      className="h-8 w-8 text-[#2B2B2C] hover:text-[#ED2939] hover:bg-red-500/10 transition-colors"
                      title="Beleid verwijderen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-[11px] text-[#2B2B2C] line-clamp-2">
                      {policy.description}
                    </p>
                  </CardContent>
                </Card>
              )})}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}
