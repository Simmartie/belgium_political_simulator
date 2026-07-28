import React, { useState } from "react";
import { useCareer } from "../../context/CareerContext";
import { Send, Users, Megaphone, ArrowLeft } from "lucide-react";

interface MonthlyActionPanelProps {
  onBack?: () => void;
  onSubmitted?: () => void;
}

export function MonthlyActionPanel({ onBack, onSubmitted }: MonthlyActionPanelProps) {
  const { state, submitMonthlyAction, isLoading } = useCareer();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    await submitMonthlyAction(title, description);
    setTitle("");
    setDescription("");
    onSubmitted?.();
  };

  if (state.activeEvent) {
    return (
      <div className="bg-white rounded-xl border border-red-200 premium-shadow p-8 text-center bg-red-50/50">
        <h2 className="text-xl font-black uppercase tracking-tighter text-red-800 mb-2">CRISIS INTERVENTION REQUIRED</h2>
        <p className="text-xs text-red-600 font-medium">You cannot proceed with normal agenda items until the current crisis is resolved.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-black/10 premium-shadow p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 bottom-0 w-1 flex flex-col pointer-events-none">
        <div className="flex-1 bg-slate-950" />
        <div className="flex-1 bg-[#FFD700]" />
        <div className="flex-1 bg-[#ED2939]" />
      </div>

      {onBack && (
        <button 
          onClick={onBack}
          className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors pl-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Terug naar Dashboard
        </button>
      )}

      <div className="mb-6 pl-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Monthly Briefing</span>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-[#2B2B2C]">The Floor Is Yours</h2>
        <p className="text-xs font-medium text-slate-600 leading-relaxed mt-1">
          Set the political agenda for this month. You can announce a major reform, push a controversial bill, or manage daily affairs.
        </p>
      </div>

      <div className="space-y-4 pl-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Action Title</label>
          <input 
            type="text" 
            placeholder="e.g. Besparingen in de Sociale Zekerheid" 
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded px-4 py-2.5 text-sm font-bold focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-all placeholder:text-slate-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Details & Implementation</label>
          <textarea 
            placeholder="Describe your policy in detail. How will you implement it? What is the specific goal?"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded px-4 py-2.5 text-xs font-medium h-28 resize-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-all placeholder:text-slate-400 leading-relaxed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-black/5 items-center">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900" disabled={isLoading} />
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                Consult Kernkabinet
              </span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900" disabled={isLoading} />
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Megaphone className="w-3.5 h-3.5" />
                Media Spin
              </span>
            </label>
          </div>

          <button 
            className="w-full sm:w-auto sm:ml-auto bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed premium-shadow"
            onClick={handleSubmit}
            disabled={isLoading || !title.trim() || !description.trim()}
          >
            Submit Policy
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
