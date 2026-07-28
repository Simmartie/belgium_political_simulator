import React, { useState } from "react";
import { useCareer } from "../../context/CareerContext";
import { AlertTriangle, Send, ShieldAlert, ArrowRight } from "lucide-react";
import { ParliamentSeat } from "../../types/career";

export function CoalitionCrisisPanel() {
  const { state, resolveCrisis } = useCareer();
  const [selectedParty, setSelectedParty] = useState<ParliamentSeat | null>(null);
  const [pitch, setPitch] = useState("");
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!state.isCoalitionCrisis) return null;

  const oppositionParties = state.parliament.filter(p => !p.isCoalition);
  const currentCoalitionSeats = state.parliament.filter(p => p.isCoalition).reduce((a, b) => a + b.seats, 0);
  const seatsNeeded = 76 - currentCoalitionSeats;

  const handleNegotiate = async () => {
    if (!selectedParty || !pitch.trim()) return;

    setIsNegotiating(true);
    setError(null);

    try {
      const response = await fetch("/api/career/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: {
            metrics: state.metrics,
            parliament: state.parliament,
          },
          selectedParty,
          pitch
        })
      });

      if (!response.ok) {
        throw new Error("Er ging iets mis bij de onderhandelingen.");
      }

      const data = await response.json();
      resolveCrisis(data.success, data.reasoning, selectedParty.party);

    } catch (err: any) {
      setError(err.message);
      setIsNegotiating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
        
        <div className="bg-red-600 p-6 text-white text-center">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Regering Gevallen</h2>
          <p className="text-red-100 font-medium max-w-xl mx-auto">
            {state.crisisReason || "U heeft uw parlementaire meerderheid verloren."}
            <br />
            Huidige zetels: <span className="font-bold text-white text-lg">{currentCoalitionSeats}/150</span> (Minimaal 76 nodig)
          </p>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2 border-b border-black/10 pb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Laatste Kans: Vorm Een Nieuwe Meerderheid
          </h3>

          <div className="space-y-8">
            <div>
              <p className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">1. Selecteer een nieuwe partner</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {oppositionParties.map(p => (
                  <button
                    key={p.party}
                    onClick={() => setSelectedParty(p)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedParty?.party === p.party 
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-800">{p.party}</span>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    </div>
                    <span className={`text-xs font-bold ${p.seats >= seatsNeeded ? 'text-green-600' : 'text-orange-500'}`}>
                      {p.seats} zetels
                    </span>
                  </button>
                ))}
              </div>
              {selectedParty && selectedParty.seats < seatsNeeded && (
                <p className="text-xs text-orange-600 mt-2 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Let op: {selectedParty.party} heeft niet genoeg zetels om u alleen aan een meerderheid te helpen!
                </p>
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">2. Uw Aanbod / Pitch</p>
              <p className="text-xs text-slate-500 mb-3">
                Overtuig de partij om de coalitie te redden. Wat biedt u hen aan? En belangrijker: zullen uw huidige coalitiepartners dit accepteren?
              </p>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Voorbeeld: We bieden jullie de post van Minister van Financiën en beloven de pensioenhervorming af te zwakken..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-sm font-bold rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div className="pt-4 flex justify-between items-center border-t border-black/10">
              <button
                onClick={() => resolveCrisis(false)}
                disabled={isNegotiating}
                className="text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors disabled:opacity-50"
              >
                Opgeven (Verkiezingen)
              </button>

              <button
                onClick={handleNegotiate}
                disabled={!selectedParty || !pitch.trim() || isNegotiating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest py-3 px-8 rounded transition-all flex items-center gap-2 premium-shadow"
              >
                {isNegotiating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Onderhandelen...
                  </>
                ) : (
                  <>
                    Voorstel Indienen
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
