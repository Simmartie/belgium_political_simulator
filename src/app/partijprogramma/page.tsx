"use client";

import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ProgramProvinceMap from "@/components/map/ProgramProvinceMap";
import { initialMetrics } from "@/data/initialData";
import { SimulatorProvider } from "@/context/SimulatorContext";
import { Trash2, Plus, Play } from "lucide-react";

interface PolicyInput {
  id: string;
  title: string;
  description: string;
}

interface SimulationResult {
  metric_shifts: Record<string, number>;
  metric_explanations: Record<string, string>;
  province_votes: Record<string, number>;
  province_explanations: Record<string, string>;
  party_matches: Record<string, number>;
}

export default function PartijprogrammaPage() {
  const [policies, setPolicies] = useState<PolicyInput[]>([
    { id: "1", title: "", description: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleAddPolicy = () => {
    setPolicies([...policies, { id: Math.random().toString(36).substring(7), title: "", description: "" }]);
  };

  const handleRemovePolicy = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id));
  };

  const handleChange = (id: string, field: "title" | "description", value: string) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const simulateProgram = async () => {
    const validPolicies = policies.filter(p => p.title.trim() !== "");
    if (validPolicies.length === 0) {
      alert("Voeg minstens één beleid toe (met een titel) om te simuleren.");
      return;
    }

    setIsLoading(true);
    try {
      const payloadMetrics = initialMetrics.reduce((acc, m) => {
        acc[m.id] = m.value;
        return acc;
      }, {} as Record<string, number>);

      const response = await fetch("/api/simulate-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentMetrics: payloadMetrics,
          policies: validPolicies,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to simulate program");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Simulatie mislukt. Controleer console of API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const flemishProvinces = ["antwerpen", "limburg", "oost_vlaanderen", "west_vlaanderen", "vlaams_brabant"];
  const walloonProvinces = ["hainaut", "liege", "namur", "brabant_wallon", "luxembourg"];

  const getRegionalAverage = (provinces: string[]) => {
    if (!result?.province_votes) return 0;
    const sum = provinces.reduce((acc, prov) => acc + (result.province_votes[prov] || 0), 0);
    return sum / provinces.length;
  };

  const flemishAvg = getRegionalAverage(flemishProvinces);
  const walloonAvg = getRegionalAverage(walloonProvinces);
  const brusselsAvg = result?.province_votes?.["bruxelles"] || 0;

  // Render the Party Matches by sorting them descending
  const sortedParties = result?.party_matches 
    ? Object.entries(result.party_matches).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <SimulatorProvider>
      <div className="flex flex-col h-screen bg-[#f7f3eb] text-slate-900 overflow-hidden font-sans">
        <TopBar />
        
        <div className="flex flex-1 overflow-y-auto md:overflow-hidden flex-col md:flex-row">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 lg:w-[400px] md:border-r border-b md:border-b-0 border-black/10 bg-white/50 backdrop-blur flex flex-col md:h-full z-10 premium-shadow shrink-0">
          <div className="p-6 border-b border-black/5 flex-shrink-0">
            <h2 className="text-xl font-black uppercase tracking-tighter text-[#2B2B2C]">Uw Partijprogramma</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Dien meerdere beleidspunten in</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {policies.map((policy, index) => (
              <Card key={policy.id} className="border border-black/10 shadow-sm relative group overflow-hidden bg-white">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-900" />
                <div className="p-3 pb-0 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Beleid #{index + 1}</span>
                  {policies.length > 1 && (
                    <button 
                      onClick={() => handleRemovePolicy(policy.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Titel van uw beleid"
                    value={policy.title}
                    onChange={(e) => handleChange(policy.id, "title", e.target.value)}
                    className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-200 rounded outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-[#2B2B2C] placeholder:text-[#2B2B2C]/50"
                  />
                  <textarea
                    placeholder="Beschrijf in detail wat dit beleid inhoudt..."
                    value={policy.description}
                    onChange={(e) => handleChange(policy.id, "description", e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all min-h-[80px] resize-y text-[#2B2B2C] placeholder:text-[#2B2B2C]/50 leading-relaxed"
                  />
                </div>
              </Card>
            ))}

            <Button 
              variant="outline" 
              onClick={handleAddPolicy}
              className="w-full border-dashed border-2 border-slate-300 text-slate-500 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 gap-2 font-bold text-xs uppercase tracking-wider h-12"
            >
              <Plus className="w-4 h-4" /> Voeg Beleid Toe
            </Button>
          </div>

          <div className="p-4 border-t border-black/10 bg-white flex-shrink-0">
            <Button 
              onClick={simulateProgram} 
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 font-black text-sm uppercase tracking-widest h-14 premium-shadow"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Simuleer Programma
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Dashboard / Results */}
        <div className="flex-1 md:overflow-y-auto p-4 lg:p-10 space-y-8 lg:space-y-10 bg-transparent">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-50">
              <div className="w-24 h-24 mb-6 rounded-full bg-slate-200 flex items-center justify-center">
                <Play className="w-10 h-10 text-slate-400 ml-1" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Geen Data Beschikbaar</h3>
              <p className="text-sm font-medium text-slate-600">Voeg beleidspunten toe in de zijbalk en simuleer om de impact op België, uw geschatte stemmen, en partijovereenkomsten te zien.</p>
            </div>
          ) : (
            <>
              {/* Partij Overeenkomsten */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#2B2B2C] flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-purple-500" />
                    Partij Overeenkomsten
                  </h2>
                </div>
                <Card className="bg-white border-black/5 premium-shadow overflow-hidden">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedParties.map(([party, matchScore]) => (
                        <div key={party} className="flex flex-col gap-2">
                          <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-900">{party}</span>
                            <span className="text-xs font-black text-slate-500">{matchScore.toFixed(0)}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-1000 ease-out bg-purple-500" 
                              style={{ width: `${Math.max(0, Math.min(100, matchScore))}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Verwachte Stemmen */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#2B2B2C] flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-blue-500" />
                    Verwachte Stemmen
                  </h2>
                </div>
                <Card className="bg-white border-black/5 premium-shadow overflow-hidden">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
                      <ProgramProvinceMap provinceVotes={result.province_votes} />
                      <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-[#d97706] flex items-center gap-3">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_Flanders.svg" alt="Vlaanderen" className="w-8 h-auto border border-black/5 shadow-sm" />
                              Vlaanderen
                            </h3>
                            <div className="text-4xl font-black text-slate-900">{flemishAvg.toFixed(1)}%</div>
                            {result.province_explanations?.flanders && (
                              <p className="text-xs text-amber-600 mt-2 italic leading-relaxed">
                                "{result.province_explanations.flanders}"
                              </p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-[#ef4444] flex items-center gap-3">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Wallonia.svg" alt="Wallonië" className="w-8 h-auto border border-black/5 shadow-sm" />
                              Wallonië
                            </h3>
                            <div className="text-4xl font-black text-slate-900">{walloonAvg.toFixed(1)}%</div>
                            {result.province_explanations?.wallonia && (
                              <p className="text-xs text-red-500 mt-2 italic leading-relaxed">
                                "{result.province_explanations.wallonia}"
                              </p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-[#3b82f6] flex items-center gap-3">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_the_Brussels-Capital_Region.svg" alt="Brussel" className="w-8 h-auto border border-black/5 shadow-sm" />
                              Brussel
                            </h3>
                            <div className="text-4xl font-black text-slate-900">{brusselsAvg.toFixed(1)}%</div>
                            {result.province_explanations?.brussels && (
                              <p className="text-xs text-blue-500 mt-2 italic leading-relaxed">
                                "{result.province_explanations.brussels}"
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Nationale Impact */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#2B2B2C] flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-[#ED2939]" />
                    Nationale Impact
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {initialMetrics.map((metric) => {
                    const shift = result.metric_shifts?.[metric.id] || 0;
                    const finalValue = Math.max(metric.min, Math.min(metric.max, metric.value + shift));
                    const explanation = result.metric_explanations?.[metric.id];

                    return (
                      <Card key={metric.id} className="bg-white border-black/10 hover:border-black/20 transition-all group relative overflow-hidden premium-shadow">
                        <div className="absolute top-0 left-0 bottom-0 w-1 flex flex-col pointer-events-none">
                          <div className="flex-1 bg-slate-950" />
                          <div className="flex-1 bg-[#FFD700]" />
                          <div className="flex-1 bg-[#ED2939]" />
                        </div>
                        <CardHeader className="p-5 pb-2">
                          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-[#2B2B2C] flex items-center justify-between">
                            {metric.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-black tracking-tighter text-slate-900">
                                {finalValue.toFixed(1)}
                              </span>
                              <span className="text-xs font-bold text-[#2B2B2C] uppercase">{metric.unit}</span>
                            </div>
                            <div className={`text-xs font-black px-2 py-1 rounded ${
                              shift > 0 ? 'bg-green-100 text-green-700' : 
                              shift < 0 ? 'bg-red-100 text-red-700' : 
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {shift > 0 ? '+' : ''}{shift.toFixed(1)}
                            </div>
                          </div>

                          {explanation && (
                            <p className="mt-3 text-[11px] leading-relaxed text-slate-600 font-medium italic border-l-2 border-slate-200 pl-3">
                              {explanation}
                            </p>
                          )}

                          <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-1000 ease-out" 
                              style={{ 
                                width: `${Math.max(0, Math.min(100, ((finalValue - metric.min) / (metric.max - metric.min)) * 100))}%`,
                                backgroundColor: metric.color
                              }} 
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
    </SimulatorProvider>
  );
}
