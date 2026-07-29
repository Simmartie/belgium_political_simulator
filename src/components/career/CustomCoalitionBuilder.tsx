import React, { useState } from "react";
import { ParliamentSeat } from "../../types/career";
import { Check, X, Users, AlertCircle } from "lucide-react";

export const defaultParties: ParliamentSeat[] = [
  { party: "N-VA", seats: 24, color: "#F0B400", isCoalition: false },
  { party: "Vlaams Belang", seats: 20, color: "#FFE600", isCoalition: false },
  { party: "MR", seats: 20, color: "#0047AB", isCoalition: false },
  { party: "PS", seats: 16, color: "#FF0000", isCoalition: false },
  { party: "PTB/PVDA", seats: 15, color: "#D20000", isCoalition: false },
  { party: "Les Engagés", seats: 14, color: "#00A896", isCoalition: false },
  { party: "Vooruit", seats: 13, color: "#E00034", isCoalition: false },
  { party: "CD&V", seats: 11, color: "#FF7F00", isCoalition: false },
  { party: "Open Vld", seats: 7, color: "#0066CC", isCoalition: false },
  { party: "Groen", seats: 6, color: "#009900", isCoalition: false },
  { party: "Ecolo", seats: 3, color: "#99CC33", isCoalition: false },
  { party: "DéFI", seats: 1, color: "#DF0045", isCoalition: false },
];

interface Props {
  onCancel: () => void;
  onSubmit: (saveName: string, customParliament: ParliamentSeat[], playerParty: string) => void;
}

export function CustomCoalitionBuilder({ onCancel, onSubmit }: Props) {
  const [saveName, setSaveName] = useState("");
  const [playerParty, setPlayerParty] = useState<string | null>(null);
  const [coalitionParties, setCoalitionParties] = useState<string[]>([]);

  const toggleCoalition = (party: string) => {
    setCoalitionParties(prev => {
      if (prev.includes(party)) {
        if (party === playerParty) {
          setPlayerParty(null); // Deselecting player party removes it from PM
        }
        return prev.filter(p => p !== party);
      }
      return [...prev, party];
    });
  };

  const handleSetPlayerParty = (party: string) => {
    setPlayerParty(party);
    if (!coalitionParties.includes(party)) {
      setCoalitionParties(prev => [...prev, party]);
    }
  };

  const totalSeats = defaultParties
    .filter(p => coalitionParties.includes(p.party))
    .reduce((sum, p) => sum + p.seats, 0);

  const hasMajority = totalSeats >= 76;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveName.trim() || !playerParty || !hasMajority) return;

    const finalParliament: ParliamentSeat[] = defaultParties.map(p => ({
      ...p,
      isCoalition: coalitionParties.includes(p.party),
      satisfaction: coalitionParties.includes(p.party) ? 70 : undefined,
    }));

    onSubmit(saveName.trim(), finalParliament, playerParty);
  };

  return (
    <div className="bg-white rounded-xl border border-black/10 premium-shadow p-6 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-[#2B2B2C]">Stel Eigen Coalitie Samen</h3>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Kies uw partij en bouw een meerderheid.</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">Naam van deze Save</label>
          <input 
            type="text"
            placeholder="Mijn Unieke Regering"
            className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Zetels (Meerderheid: 76)</span>
            <span className={`text-lg font-black ${hasMajority ? 'text-green-600' : 'text-red-500'}`}>
              {totalSeats} / 150
            </span>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
            {defaultParties.filter(p => coalitionParties.includes(p.party)).map(p => (
              <div key={p.party} style={{ width: `${(p.seats / 150) * 100}%`, backgroundColor: p.color }} className="h-full" />
            ))}
          </div>
          {!hasMajority && (
            <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> U heeft geen absolute meerderheid.
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">Selecteer partijen voor de coalitie</label>
        <p className="text-xs text-slate-500 mb-4">Klik op een partij om deze aan de coalitie toe te voegen. Selecteer het "PM" kroontje om de Minister-President te leveren.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {defaultParties.map(p => {
            const isSelected = coalitionParties.includes(p.party);
            const isPM = playerParty === p.party;

            return (
              <div 
                key={p.party}
                className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${isSelected ? 'border-slate-800 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}
                onClick={() => toggleCoalition(p.party)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-bold text-sm text-slate-800">{p.party}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{p.seats} zetels</span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetPlayerParty(p.party);
                  }}
                  className={`w-full py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-1 ${isPM ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                >
                  {isPM && <Check className="w-3 h-3" />}
                  {isPM ? 'Jouw Partij (PM)' : 'Kies als PM'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-black/5 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!saveName.trim() || !playerParty || !hasMajority}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest py-3 px-8 rounded transition-all flex items-center justify-center gap-2 premium-shadow"
        >
          <Users className="w-4 h-4" />
          Start Regering
        </button>
      </div>
    </div>
  );
}
