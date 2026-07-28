import React from "react";
import { useCareer } from "../../context/CareerContext";

const MetricCard = ({ title, value, unit, colorClass, borderClass, barWidth }: any) => (
  <div className="bg-white rounded-xl border border-black/10 p-5 premium-shadow relative overflow-hidden">
    <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderClass}`} />
    <div className="pl-2">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">{title}</h3>
      <div className="flex items-baseline gap-1.5 mb-4">
        <span className="text-3xl font-black tracking-tighter text-[#2B2B2C]">{value.toFixed(1)}</span>
        <span className="text-xs font-bold text-slate-500">{unit}</span>
      </div>
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${colorClass}`} 
          style={{ width: `${Math.max(5, Math.min(100, barWidth))}%` }}
        />
      </div>
    </div>
  </div>
);

export function EconomicMetricsPanel() {
  const { state } = useCareer();
  const { budgetDeficit, gdp, inflation, purchasingPower, climateGoals } = state.economy;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <MetricCard 
        title="Begrotingstekort" 
        value={budgetDeficit} 
        unit="% BBP" 
        colorClass="bg-red-500" 
        borderClass="bg-slate-900" 
        barWidth={(budgetDeficit / 10) * 100} // e.g. 4.4 -> 44%
      />
      <MetricCard 
        title="BBP" 
        value={gdp} 
        unit="MLD €" 
        colorClass="bg-blue-500" 
        borderClass="bg-slate-900" 
        barWidth={(gdp / 700) * 100} // e.g. 580 -> 82%
      />
      <MetricCard 
        title="Inflatie" 
        value={inflation} 
        unit="%" 
        colorClass="bg-amber-500" 
        borderClass="bg-slate-900" 
        barWidth={(inflation / 10) * 100} // e.g. 3.2 -> 32%
      />
      <MetricCard 
        title="Koopkracht Index" 
        value={purchasingPower} 
        unit="IDX" 
        colorClass="bg-emerald-500" 
        borderClass="bg-slate-900" 
        barWidth={(purchasingPower / 120) * 100} // e.g. 100 -> 83%
      />
      <MetricCard 
        title="Klimaatdoelen" 
        value={climateGoals} 
        unit="%" 
        colorClass="bg-green-500" 
        borderClass="bg-slate-900" 
        barWidth={climateGoals}
      />
    </div>
  );
}
