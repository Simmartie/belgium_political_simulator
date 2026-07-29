import React from "react";
import { MediaHeadline } from "../../types/career";
import { Newspaper, ArrowRight } from "lucide-react";

interface MediaHeadlinesPanelProps {
  headlines: MediaHeadline[];
  onNext: () => void;
}

export function MediaHeadlinesPanel({ headlines, onNext }: MediaHeadlinesPanelProps) {
  if (!headlines || headlines.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-black/10 premium-shadow p-6 lg:p-8">
      <div className="mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">Stap 3/4</span>
        <h2 className="text-xl font-black uppercase tracking-tighter text-[#2B2B2C] flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-600" />
          Krantenkoppen van Morgen
        </h2>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Hoe de media jouw beleid framet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {headlines.map(headline => {
          let scoreBadge = "bg-green-100 text-green-700";
          if (headline.score < 40) scoreBadge = "bg-red-100 text-red-700";
          else if (headline.score < 60) scoreBadge = "bg-amber-100 text-amber-700";

          return (
            <div key={headline.id} className="border border-black/5 bg-[#f7f3eb]/40 rounded-lg p-4 relative overflow-hidden group hover:border-black/20 transition-all flex flex-col justify-between">
               <div className="flex justify-between items-start mb-3">
                 <div>
                   <h4 className="font-bold text-sm text-[#2B2B2C] font-serif uppercase tracking-tight">{headline.outlet}</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{headline.bias}</p>
                 </div>
                 <div className={`px-2 py-0.5 rounded font-black text-xs ${scoreBadge}`}>
                    Sentiment: {headline.score}
                 </div>
               </div>
               
               <h3 className="text-[#2B2B2C] text-lg font-black leading-tight mt-1 mb-2 font-serif">
                 "{headline.headline}"
               </h3>
            </div>
          );
        })}
      </div>

      <div className="border-t border-black/5 pt-4 mt-6 flex justify-end">
        <button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest py-3 px-6 rounded transition-colors flex items-center justify-center gap-2 premium-shadow"
        >
          Bekijk Machtsdynamiek
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
