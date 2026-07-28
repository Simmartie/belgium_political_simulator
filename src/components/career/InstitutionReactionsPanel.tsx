import React from "react";
import { InstitutionReactions } from "../../types/career";
import { Building2 } from "lucide-react";

interface InstitutionReactionsPanelProps {
  institutions: InstitutionReactions;
}

export function InstitutionReactionsPanel({ institutions }: InstitutionReactionsPanelProps) {
  const formatShift = (num: number) => {
    if (num > 0) return `+${num}`;
    return `${num}`;
  };

  const ReactionBadge = ({ label, value }: { label: string, value: number }) => {
    let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
    if (value > 10) colorClass = "bg-green-100 text-green-700 border-green-200";
    else if (value > 0) colorClass = "bg-green-50 text-green-600 border-green-100";
    else if (value < -10) colorClass = "bg-red-100 text-red-700 border-red-200";
    else if (value < 0) colorClass = "bg-red-50 text-red-600 border-red-100";

    return (
      <div className="flex justify-between items-center py-2.5 border-b border-black/5 last:border-b-0">
        <span className="text-xs font-bold text-slate-700">{label}</span>
        <span className={`px-2 py-0.5 rounded text-xs font-black border ${colorClass}`}>
          {formatShift(value)}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-black/10 premium-shadow p-6">
      <h2 className="text-xl font-black uppercase tracking-tighter text-[#2B2B2C] mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-slate-600" />
        Institutional Reactions
      </h2>
      
      <div className="flex flex-col">
        <ReactionBadge label="Trade Unions (ABVV/ACV)" value={institutions.unions} />
        <ReactionBadge label="Employers (VBO/VOKA)" value={institutions.employers} />
        <ReactionBadge label="The Media" value={institutions.media} />
        <ReactionBadge label="Flemish Government" value={institutions.flemishGov} />
        <ReactionBadge label="Walloon Government" value={institutions.walloonGov} />
      </div>
    </div>
  );
}
