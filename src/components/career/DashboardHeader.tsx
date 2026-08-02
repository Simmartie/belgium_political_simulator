import React from "react";
import { useCareer } from "../../context/CareerContext";
import { Clock, Calendar, LogOut } from "lucide-react";

export function DashboardHeader() {
  const { state, unloadSave } = useCareer();
  
  // Calculate Date
  const startYear = state.startYear || 2025;
  const startMonth = state.startMonth || 1;
  const date = new Date(startYear, startMonth - 1 + state.currentMonth - 1);
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const maxMonths = state.maxMonths || 48;
  const monthsLeft = maxMonths - state.currentMonth + 1;

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              <span>Belgian Political Career Mode</span>
              <span>&bull;</span>
              <span className="text-amber-600">Regering ({state.parliament.filter(p => p.isCoalition).map(p => p.party).join(', ')})</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-[#2B2B2C]">
              {state.playerParty === "N-VA" ? "Premier Bart De Wever" : state.playerParty === "Open Vld" ? "Premier Alexander De Croo" : `Premier (${state.playerParty})`}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 bg-[#f7f3eb] p-3 px-4 rounded-lg border border-black/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2 rounded text-white">
                  <Calendar className="w-4 h-4 text-[#FFD700]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Current Month</p>
                  <p className="font-black text-sm text-[#2B2B2C] capitalize">{monthName} {year}</p>
                </div>
              </div>
              
              <div className="w-px h-8 bg-black/10"></div>
              
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2 rounded text-white">
                  <Clock className="w-4 h-4 text-[#ED2939]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Next Election</p>
                  <p className="font-black text-sm text-[#2B2B2C]">{monthsLeft} months</p>
                </div>
              </div>
            </div>

            <button
              onClick={unloadSave}
              className="bg-white hover:bg-slate-50 text-slate-700 p-3 h-[60px] rounded-lg border border-black/10 shadow-sm transition-colors flex items-center justify-center group"
              title="Save & Afsluiten"
            >
              <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
