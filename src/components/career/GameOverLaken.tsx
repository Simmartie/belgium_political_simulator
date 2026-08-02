import React from "react";
import { useCareer } from "../../context/CareerContext";
import { Crown, RotateCcw } from "lucide-react";

export function GameOverLaken() {
  const { state, resetCareer } = useCareer();

  if (!state.isGameOver) return null;

  const coalitionName = state.gameMode === "vivaldi" ? "Vivaldi" : state.gameMode === "arizona" ? "Arizona" : "coalitie";

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="max-w-2xl w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 delay-150">
        
        <Crown className="w-24 h-24 text-yellow-500 mb-8" />
        
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
          Ontboden op het Kasteel van Laken
        </h1>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 text-slate-300 text-lg leading-relaxed shadow-2xl">
          <p className="mb-4">
            De Koning heeft nota genomen van de onhoudbare situatie binnen de {coalitionName}-coalitie. 
            Met een coalitiestabiliteit van minder dan 20%, is er geen werkbare meerderheid meer in het parlement.
          </p>
          <p className="text-red-400 font-bold">
            {state.gameOverReason || "De regering is gevallen. Er worden vervroegde verkiezingen uitgeschreven."}
          </p>
          <p className="mt-4 text-sm text-slate-500">
            U heeft het {state.currentMonth} maanden volgehouden als Premier.
          </p>
        </div>

        <button 
          onClick={resetCareer}
          className="bg-white hover:bg-slate-200 text-black font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-3"
        >
          <RotateCcw className="w-5 h-5" />
          Nieuwe Campagne Starten
        </button>

      </div>
    </div>
  );
}
