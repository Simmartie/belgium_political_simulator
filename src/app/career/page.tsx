"use client";

import React, { useState } from "react";
import { useCareer } from "../../context/CareerContext";
import TopBar from "@/components/TopBar";
import { DashboardHeader } from "../../components/career/DashboardHeader";
import { CoreMetricsPanel } from "../../components/career/CoreMetricsPanel";
import { MonthlyActionPanel } from "../../components/career/MonthlyActionPanel";
import { AnalysisPanel } from "../../components/career/AnalysisPanel";
import { EconomicMetricsPanel } from "../../components/career/EconomicMetricsPanel";
import { FocusGroupPanel } from "../../components/career/FocusGroupPanel";
import { GameOverLaken } from "../../components/career/GameOverLaken";
import { InstitutionReactionsPanel } from "../../components/career/InstitutionReactionsPanel";
import { RegionalImpactPanel } from "../../components/career/RegionalImpactPanel";
import { SaveManager } from "../../components/career/SaveManager";
import { CoalitionCrisisPanel } from "../../components/career/CoalitionCrisisPanel";
import { Play, Calendar, AlertCircle } from "lucide-react";

export default function CareerPage() {
  const { state, isLoading, activeSaveId } = useCareer();
  const [view, setView] = useState<"dashboard" | "briefing" | "analysis" | "regional" | "personas" | "institutions">("dashboard");

  if (!activeSaveId) {
    return <SaveManager />;
  }

  const date = new Date(2025, state.currentMonth - 1);
  const monthName = date.toLocaleString('nl-BE', { month: 'long' });
  const year = date.getFullYear();

  return (
    <div className="min-h-screen bg-[#f7f3eb] text-slate-900 pb-20 font-sans">
      <TopBar />
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {view === "dashboard" && (
            <>
              {/* THIS MONTH CTA CARD */}
              <div className="bg-white rounded-xl border border-black/10 premium-shadow p-6 lg:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-1 flex flex-col pointer-events-none">
                  <div className="flex-1 bg-slate-950" />
                  <div className="flex-1 bg-[#FFD700]" />
                  <div className="flex-1 bg-[#ED2939]" />
                </div>

                <div className="pl-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Overzicht Regering</span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-[#2B2B2C]">
                    Deze Maand — <span className="capitalize">{monthName} {year}</span>
                  </h2>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed mt-2">
                    Een nieuwe politieke maand staat klaar voor uw beslissingen. Bepaal de beleidsagenda van de Arizona-coalitie of voer strategische maatregelen uit.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t border-black/5 pt-5">
                    <button 
                      onClick={() => setView("briefing")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded transition-all flex items-center justify-center gap-2 premium-shadow hover:scale-[1.02]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Speel {monthName} {year} &rarr;
                    </button>

                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 justify-center">
                      <Calendar className="w-3.5 h-3.5" />
                      Maand {state.currentMonth} van 48
                    </span>
                  </div>
                </div>
              </div>

              {/* ECONOMY KPIs */}
              <EconomicMetricsPanel />

              {state.history.length === 0 && (
                <div className="bg-white/60 rounded-xl border border-black/5 p-6 text-center mt-8">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-800 text-sm">Start van de Legislaatuur</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Uw regering treedt aan in januari 2025. Klik op 'Speel januari 2025' om uw eerste beleidsagenda op te stellen.
                  </p>
                </div>
              )}
            </>
          )}

          {view === "briefing" && (
            <MonthlyActionPanel 
              onBack={() => setView("dashboard")}
              onSubmitted={() => setView("analysis")}
            />
          )}

          {view === "analysis" && state.history.length > 0 && (
            <AnalysisPanel latestTurn={state.history[0]} onNext={() => setView("regional")} />
          )}

          {view === "regional" && state.history.length > 0 && (
            <RegionalImpactPanel latestTurn={state.history[0]} onNext={() => setView("personas")} />
          )}

          {view === "personas" && state.history.length > 0 && (
            <FocusGroupPanel personas={state.history[0].result?.personas || []} onNext={() => setView("institutions")} />
          )}

          {view === "institutions" && state.history.length > 0 && state.history[0].result?.institutions && (
             <InstitutionReactionsPanel institutions={state.history[0].result.institutions} onNext={() => setView("dashboard")} />
          )}

        </div>

        {/* Sidebar / Core Metrics (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          <CoreMetricsPanel />
        </div>
      </div>

      {state.isGameOver && <GameOverLaken />}
      {state.isCoalitionCrisis && <CoalitionCrisisPanel />}
      
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-base font-black uppercase tracking-wider text-slate-900">Politieke Impact Berekenen...</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Consultatie met focusgroepen en instellingen</p>
          </div>
        </div>
      )}
    </div>
  );
}
