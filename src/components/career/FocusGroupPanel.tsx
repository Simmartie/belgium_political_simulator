import React from "react";
import { Persona } from "../../types/career";
import { MessagesSquare } from "lucide-react";

interface FocusGroupPanelProps {
  personas: Persona[];
}

export function FocusGroupPanel({ personas }: FocusGroupPanelProps) {
  if (!personas || personas.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-black/10 premium-shadow p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-black uppercase tracking-tighter text-[#2B2B2C] flex items-center gap-2">
          <MessagesSquare className="w-5 h-5 text-purple-600" />
          Focus Group Transcripts
        </h2>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Real-time reactions from our demographic panels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personas.map(persona => {
          let scoreBadge = "bg-green-100 text-green-700";
          if (persona.score < 40) scoreBadge = "bg-red-100 text-red-700";
          else if (persona.score < 60) scoreBadge = "bg-amber-100 text-amber-700";

          return (
            <div key={persona.id} className="border border-black/5 bg-[#f7f3eb]/40 rounded-lg p-4 relative overflow-hidden group hover:border-black/20 transition-all">
               <div className="flex justify-between items-start mb-2">
                 <div>
                   <h4 className="font-bold text-sm text-[#2B2B2C]">{persona.name}</h4>
                   <p className="text-[11px] text-slate-500 font-medium">{persona.background}</p>
                 </div>
                 <div className={`px-2 py-0.5 rounded font-black text-xs ${scoreBadge}`}>
                    {persona.score}%
                 </div>
               </div>
               
               <p className="text-slate-700 text-xs italic font-medium mt-2 leading-relaxed border-l-2 border-slate-300 pl-2">
                 "{persona.quote}"
               </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
