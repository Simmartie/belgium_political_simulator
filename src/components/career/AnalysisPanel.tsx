import React from "react";
import { CareerTurn } from "../../types/career";
import { FileText, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight, MessageCircleX } from "lucide-react";

interface AnalysisPanelProps {
  latestTurn: CareerTurn;
  onNext: () => void;
}

export function AnalysisPanel({ latestTurn, onNext }: AnalysisPanelProps) {
  if (!latestTurn.result) return null;
  const { analysis } = latestTurn.result;

  const isPositiveBudget = analysis.budgetImpact.includes("+");
  const isNeutralBudget = analysis.budgetImpact.toLowerCase().includes("neutral");

  return (
    <div className="bg-white rounded-xl border border-black/10 premium-shadow overflow-hidden">
      <div className="bg-slate-50 border-b border-black/5 px-6 py-4 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">Stap 1/4</span>
          <h3 className="text-xl font-black uppercase tracking-tighter text-[#2B2B2C] flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            Federal Agency Assessment
          </h3>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Executive Summary</h4>
           <p className="text-slate-700 leading-relaxed text-xs font-medium italic border-l-2 border-slate-300 pl-3 py-1">
             &quot;{analysis.summary}&quot;
           </p>
        </div>
        
        <div className="space-y-3">
          <div className="bg-[#f7f3eb]/50 rounded-lg p-3 border border-black/5 flex items-center justify-between gap-4">
             <div>
               <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Fiscal Impact</h4>
               <p className="text-[11px] text-slate-500">Effect on federal budget</p>
             </div>
             <div className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${
               isNeutralBudget ? 'bg-slate-200 text-slate-700' : 
               isPositiveBudget ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
             }`}>
               {isNeutralBudget ? null : isPositiveBudget ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
               {analysis.budgetImpact}
             </div>
          </div>

          <div className="bg-[#f7f3eb]/50 rounded-lg p-3 border border-black/5 flex items-center justify-between gap-4">
             <div>
               <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Execution Risk</h4>
               <p className="text-[11px] text-slate-500">Legal & operational risk</p>
             </div>
             <div className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${
               analysis.complexity.toLowerCase().includes('high') ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
             }`}>
               {analysis.complexity.toLowerCase().includes('high') ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
               {analysis.complexity}
             </div>
          </div>
        </div>
      </div>

      {latestTurn.result.opposition_reaction && latestTurn.result.opposition_reaction.length > 0 && (
        <div className="border-t border-black/5 p-6 bg-slate-50/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <MessageCircleX className="w-3.5 h-3.5 text-slate-400" />
            Reactie Oppositie
          </h4>
          <div className="space-y-3">
            {latestTurn.result.opposition_reaction.map((reaction, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-black/5 flex items-start gap-3 shadow-sm">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  reaction.stance === "negative" ? "bg-red-500" :
                  reaction.stance === "positive" ? "bg-green-500" : "bg-slate-400"
                }`} />
                <div>
                  <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800">{reaction.party}</h5>
                  <p className="text-xs text-slate-600 mt-0.5 italic">&quot;{reaction.quote}&quot;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-50 border-t border-black/5 px-6 py-4 flex justify-end">
        <button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest py-3 px-6 rounded transition-colors flex items-center justify-center gap-2 premium-shadow"
        >
          Ga naar Regionale Impact
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
