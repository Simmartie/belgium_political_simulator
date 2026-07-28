import React from "react";
import { useCareer } from "../../context/CareerContext";
import { Users, ShieldAlert, Landmark, UsersRound, Handshake } from "lucide-react";

const MetricBar = ({ label, value, icon: Icon, lowDanger = true }: any) => {
  let barColor = "bg-green-500";
  if (value < 40) barColor = "bg-red-500";
  else if (value < 60) barColor = "bg-yellow-500";

  if (!lowDanger) {
    barColor = "bg-green-500";
    if (value > 60) barColor = "bg-red-500";
    else if (value > 40) barColor = "bg-yellow-500";
  }

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2 text-slate-800 text-xs font-bold uppercase tracking-wider">
          <Icon className="w-3.5 h-3.5 text-slate-500" />
          {label}
        </div>
        <span className="font-black text-sm text-[#2B2B2C]">{Math.round(value)}%</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-black/5">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`} 
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
};

export function CoreMetricsPanel() {
  const { state } = useCareer();
  const { popularity, coalitionStability, internalStability } = state.metrics;

  const arizonaSeats = state.parliament.filter(p => p.isCoalition).reduce((acc, p) => acc + p.seats, 0);
  const totalSeats = 150;
  const coalitionPartners = state.parliament.filter(p => p.isCoalition);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-black/10 premium-shadow p-6">
        <h2 className="text-xl font-black uppercase tracking-tighter text-[#2B2B2C] mb-6 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-slate-700" />
          Political Capital
        </h2>
        
        <MetricBar 
          label="Net Popularity (Voters)" 
          value={popularity} 
          icon={Users} 
        />
        
        <MetricBar 
          label="Coalition Stability" 
          value={coalitionStability} 
          icon={ShieldAlert} 
        />
        
        <MetricBar 
          label="Internal Party Stability (N-VA)" 
          value={internalStability} 
          icon={UsersRound} 
        />

        <div className="mt-8 pt-6 border-t border-black/5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
            <Handshake className="w-3.5 h-3.5" />
            Coalitiepartners Tevredenheid
          </h3>
          <div className="space-y-4">
            {coalitionPartners.map(p => (
              <div key={p.party}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-[11px] font-bold text-slate-700">{p.party}</span>
                  </div>
                  <span className={`text-[11px] font-black ${
                    (p.satisfaction ?? 0) < 30 ? 'text-red-600' :
                    (p.satisfaction ?? 0) < 50 ? 'text-orange-500' : 'text-green-600'
                  }`}>
                    {p.satisfaction}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      (p.satisfaction ?? 0) < 30 ? 'bg-red-500' :
                      (p.satisfaction ?? 0) < 50 ? 'bg-orange-400' : 'bg-green-500'
                    }`} 
                    style={{ width: `${Math.max(0, Math.min(100, p.satisfaction ?? 0))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-black/10 premium-shadow p-6">
         <h2 className="text-xl font-black uppercase tracking-tighter text-[#2B2B2C] mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-slate-700" />
          Chamber of Representatives
        </h2>
        
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
          <span className="text-blue-700">Arizona ({arizonaSeats})</span>
          <span className="text-slate-500">Opposition ({totalSeats - arizonaSeats})</span>
        </div>
        
        <div className="relative h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex mb-6 border border-black/5">
           {/* Majority Line */}
           <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-black z-10"></div>
           
           {state.parliament.map((party) => (
             <div 
                key={party.party}
                className="h-full border-r border-white/20 last:border-r-0 hover:opacity-80 transition-opacity cursor-pointer"
                style={{ 
                  width: `${(party.seats / totalSeats) * 100}%`,
                  backgroundColor: party.color
                }}
                title={`${party.party}: ${party.seats} seats`}
             />
           ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-medium">
           {state.parliament.map((party) => (
             <div key={party.party} className="flex items-center gap-1.5 p-1 rounded bg-[#f7f3eb]/40">
               <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }}></div>
               <span className="text-slate-700 font-bold truncate text-[11px]">{party.party}</span>
               <span className="font-black text-slate-900 ml-auto text-[11px]">{party.seats}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
