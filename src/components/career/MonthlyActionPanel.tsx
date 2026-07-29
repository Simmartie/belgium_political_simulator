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

  const event = state.activeEvent;

  let theme = {
    bg: "bg-white",
    border: "border-black/10",
    accent: "bg-[#FFD700]",
    textAccent: "text-slate-500",
    buttonBg: "bg-slate-900 hover:bg-slate-800"
  };

  if (event) {
    if (event.severity === 'medium') {
      theme = { bg: "bg-amber-50/30", border: "border-amber-200", accent: "bg-amber-500", textAccent: "text-amber-600", buttonBg: "bg-amber-600 hover:bg-amber-700" };
    } else if (event.severity === 'high') {
      theme = { bg: "bg-red-50/30", border: "border-red-200", accent: "bg-red-600", textAccent: "text-red-600", buttonBg: "bg-red-600 hover:bg-red-700" };
    } else if (event.severity === 'critical') {
      theme = { bg: "bg-purple-50/30", border: "border-purple-200", accent: "bg-purple-700", textAccent: "text-purple-700", buttonBg: "bg-purple-700 hover:bg-purple-800" };
    } else {
      theme = { bg: "bg-blue-50/30", border: "border-blue-100", accent: "bg-blue-600", textAccent: "text-blue-600", buttonBg: "bg-[#1A2639] hover:bg-[#121A28]" };
    }
  }

  return (
    <div className={`${theme.bg} rounded-xl border ${theme.border} premium-shadow p-6 lg:p-8 relative overflow-hidden transition-colors duration-300`}>
      <div className="absolute top-0 left-0 bottom-0 w-1 flex flex-col pointer-events-none">
        {event ? (
          <div className={`flex-1 ${theme.accent}`} />
        ) : (
          <>
            <div className="flex-1 bg-slate-950" />
            <div className="flex-1 bg-[#FFD700]" />
            <div className="flex-1 bg-[#ED2939]" />
          </>
        )}
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
        {event ? (
          <>
            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.textAccent} block mb-2`}>
              {event.source || "SITUATION REPORT"} {event.severity ? `— SEVERITY: ${event.severity.toUpperCase()}` : ''}
            </span>
            <h2 className="text-2xl font-black text-[#2B2B2C] leading-tight mb-4">{event.title}</h2>
            <div className="space-y-4 mb-8">
              {event.context && (
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {event.context}
                </p>
              )}
              <p className="text-sm text-slate-700 leading-relaxed">
                {event.description}
              </p>
            </div>
          </>
        ) : (
          <>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Monthly Briefing</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-[#2B2B2C]">The Floor Is Yours</h2>
            <p className="text-xs font-medium text-slate-600 leading-relaxed mt-1">
              Set the political agenda for this month. You can announce a major reform, push a controversial bill, or manage daily affairs.
            </p>
          </>
        )}
      </div>

      <div className={`space-y-4 pl-2 ${event ? 'bg-white p-6 rounded-xl border border-slate-100 shadow-sm' : ''}`}>
        {event && (
          <div className="mb-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Your Response</span>
            <span className="block text-xs text-slate-500">Announce a policy, make a statement, or take executive action to resolve the situation.</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Action Title</label>
          <input 
            type="text" 
            placeholder={event ? "e.g. Noodfonds voor de Zorgsector" : "e.g. Besparingen in de Sociale Zekerheid"}
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

        <div className={`flex flex-col sm:flex-row gap-4 pt-4 border-t ${event ? 'border-slate-200/60 mt-2' : 'border-black/5'} items-center`}>

          <button 
            className={`w-full sm:w-auto sm:ml-auto text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed premium-shadow ${theme.buttonBg}`}
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
