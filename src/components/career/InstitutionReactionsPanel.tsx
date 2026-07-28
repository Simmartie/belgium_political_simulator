import React from "react";
import { InstitutionReactions } from "../../types/career";
import { Building2, CheckCircle, ArrowRight } from "lucide-react";

interface InstitutionReactionsPanelProps {
  institutions: InstitutionReactions;
  onNext: () => void;
}

const ReactionBadge = ({ label, value }: { label: string, value: number }) => {
  let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
  if (value > 10) colorClass = "bg-green-100 text-green-700 border-green-200";
  else if (value > 0) colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  else if (value < -10) colorClass = "bg-red-100 text-red-700 border-red-200";
  else if (value < 0) colorClass = "bg-orange-50 text-orange-700 border-orange-200";

  return (
    <div className="flex items-center justify-between p-3 border-b border-black/5 last:border-0 hover:bg-slate-50 transition-colors">
      <span className="text-xs font-bold text-slate-700">{label}</span>
      <div className={`px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider border ${colorClass}`}>
        {value > 0 ? "+" : ""}{value}
      </div>
    </div>
  );
};

export function InstitutionReactionsPanel({ institutions, onNext }: InstitutionReactionsPanelProps) {

  return (
    <div className="bg-white rounded-xl border border-black/10 premium-shadow p-6">
      <div className="mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">Stap 4/4</span>
        <h2 className="text-xl font-black uppercase tracking-tighter text-[#2B2B2C] flex items-center gap-2">
          <Building2 className="w-5 h-5 text-slate-600" />
          Institutional Reactions
        </h2>
      </div>
      
      <div className="flex flex-col">
        <ReactionBadge label="Trade Unions (ABVV/ACV)" value={institutions.unions} />
        <ReactionBadge label="Employers (VBO/VOKA)" value={institutions.employers} />
        <ReactionBadge label="The Media" value={institutions.media} />
        <ReactionBadge label="Flemish Government" value={institutions.flemishGov} />
        <ReactionBadge label="Walloon Government" value={institutions.walloonGov} />
      </div>

      <div className="border-t border-black/5 pt-4 mt-6 flex justify-end">
        <button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest py-3 px-6 rounded transition-colors flex items-center justify-center gap-2 premium-shadow"
        >
          Voltooi Maand
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
