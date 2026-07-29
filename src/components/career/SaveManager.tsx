import React, { useState } from "react";
import { useCareer } from "../../context/CareerContext";
import { Play, Plus, Trash2, Calendar, UserCircle } from "lucide-react";
import TopBar from "../TopBar";

import { CustomCoalitionBuilder } from "./CustomCoalitionBuilder";

export function SaveManager() {
  const { saves, createNewSave, loadSave, deleteSave } = useCareer();
  const [newSaveName, setNewSaveName] = useState("");
  const [creationMode, setCreationMode] = useState<"none" | "historisch" | "eigen" | "vivaldi">("none");

  const handleCreateHistorisch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSaveName.trim()) {
      createNewSave(newSaveName.trim(), undefined, undefined, "arizona");
      setCreationMode("none");
    }
  };

  const handleCreateVivaldi = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSaveName.trim()) {
      createNewSave(newSaveName.trim(), undefined, undefined, "vivaldi");
      setCreationMode("none");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3eb] text-slate-900 pb-20 font-sans">
      <TopBar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#2B2B2C]">
              Career Mode
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-2">
              Kies een bestaande save of start een nieuwe carrière als minister-president.
            </p>
          </div>
          
          <button
            onClick={() => setCreationMode(creationMode === "none" ? "historisch" : "none")}
            className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded transition-all flex items-center justify-center gap-2 premium-shadow"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Save
          </button>
        </div>

        {creationMode !== "none" && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setCreationMode("historisch")}
              className={`p-4 rounded-lg border-2 text-left transition-all ${creationMode === "historisch" ? 'border-slate-900 bg-white shadow-lg scale-[1.02]' : 'border-black/10 bg-white/50 hover:bg-white'}`}
            >
              <h3 className="font-black text-[#2B2B2C] uppercase tracking-tighter">Bart De Wever (2025)</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Speel als Bart De Wever (N-VA) met de Arizona-coalitie.</p>
            </button>
            <button
              onClick={() => setCreationMode("vivaldi")}
              className={`p-4 rounded-lg border-2 text-left transition-all ${creationMode === "vivaldi" ? 'border-slate-900 bg-white shadow-lg scale-[1.02]' : 'border-black/10 bg-white/50 hover:bg-white'}`}
            >
              <h3 className="font-black text-[#2B2B2C] uppercase tracking-tighter">De Croo (2020)</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Speel als Alexander De Croo met de Vivaldi-coalitie.</p>
            </button>
            <button
              onClick={() => setCreationMode("eigen")}
              className={`p-4 rounded-lg border-2 text-left transition-all ${creationMode === "eigen" ? 'border-slate-900 bg-white shadow-lg scale-[1.02]' : 'border-black/10 bg-white/50 hover:bg-white'}`}
            >
              <h3 className="font-black text-[#2B2B2C] uppercase tracking-tighter">Eigen Coalitie</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Kies zelf je partij en stel je eigen meerderheid samen.</p>
            </button>
          </div>
        )}

        {creationMode === "historisch" && (
          <div className="bg-white rounded-xl border border-black/10 premium-shadow p-6 mb-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#FFD700]" />
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 ml-2">Historische Carrière Starten</h3>
             
             <form onSubmit={handleCreateHistorisch} className="flex gap-4 ml-2">
               <input 
                 type="text"
                 autoFocus
                 placeholder="Naam van uw save (bijv. 'Arizona I')"
                 className="flex-1 bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                 value={newSaveName}
                 onChange={(e) => setNewSaveName(e.target.value)}
               />
               <button 
                 type="submit"
                 disabled={!newSaveName.trim()}
                 className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest py-2.5 px-6 rounded transition-all flex items-center gap-2"
               >
                 Starten <Play className="w-3.5 h-3.5 fill-white" />
               </button>
               <button 
                 type="button"
                 onClick={() => setCreationMode("none")}
                 className="text-slate-500 hover:text-slate-700 font-bold text-xs uppercase tracking-widest py-2.5 px-4"
               >
                 Annuleer
               </button>
             </form>
          </div>
        )}

        {creationMode === "vivaldi" && (
          <div className="bg-white rounded-xl border border-black/10 premium-shadow p-6 mb-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#0066CC]" />
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 ml-2">Vivaldi Carrière Starten</h3>
             
             <form onSubmit={handleCreateVivaldi} className="flex gap-4 ml-2">
               <input 
                 type="text"
                 autoFocus
                 placeholder="Naam van uw save (bijv. 'Vivaldi I')"
                 className="flex-1 bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                 value={newSaveName}
                 onChange={(e) => setNewSaveName(e.target.value)}
               />
               <button 
                 type="submit"
                 disabled={!newSaveName.trim()}
                 className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest py-2.5 px-6 rounded transition-all flex items-center gap-2"
               >
                 Starten <Play className="w-3.5 h-3.5 fill-white" />
               </button>
               <button 
                 type="button"
                 onClick={() => setCreationMode("none")}
                 className="text-slate-500 hover:text-slate-700 font-bold text-xs uppercase tracking-widest py-2.5 px-4"
               >
                 Annuleer
               </button>
             </form>
          </div>
        )}

        {creationMode === "eigen" && (
          <CustomCoalitionBuilder
            onCancel={() => setCreationMode("none")}
            onSubmit={(name, parliament, party) => {
              createNewSave(name, parliament, party, "custom");
              setCreationMode("none");
            }}
          />
        )}

        <div className="space-y-4">
          {saves.length === 0 && creationMode === "none" ? (
            <div className="bg-white/60 rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <UserCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-base">Geen saves gevonden</h4>
              <p className="text-sm text-slate-500 mt-1 mb-6">
                U heeft nog geen carrière saves. Maak er een aan om te beginnen.
              </p>
              <button
                onClick={() => setCreationMode("historisch")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded transition-all inline-flex items-center gap-2 premium-shadow hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                Carrière Starten
              </button>
            </div>
          ) : (
            saves.map(save => {
              const date = new Date(save.state.startYear || 2025, (save.state.startMonth || 1) - 1 + save.state.currentMonth - 1);
              const monthName = date.toLocaleString('nl-BE', { month: 'long' });
              const year = date.getFullYear();
              
              return (
                <div key={save.id} className="bg-white rounded-xl border border-black/10 hover:border-blue-500/50 transition-all premium-shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {save.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
                        <Calendar className="w-3.5 h-3.5" />
                        {monthName} {year} (Maand {save.state.currentMonth})
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        Laatst gespeeld: {new Date(save.updatedAt).toLocaleString('nl-BE')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => deleteSave(save.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Verwijder Save"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => loadSave(save.id)}
                      className="bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white font-black text-xs uppercase tracking-widest py-2.5 px-6 rounded transition-all flex items-center gap-2"
                    >
                      Speel Verder <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
