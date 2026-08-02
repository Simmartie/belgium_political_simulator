import React, { useState, useMemo } from "react";
import { CareerTurn } from "../../types/career";
import { Map, ArrowRight } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "/belgium-provinces.json";

const mapProvinceKey = (name_nl?: string, reg_nis?: string) => {
  if (reg_nis === "04000") return "bruxelles";
  if (!name_nl) return "bruxelles";
  if (name_nl.includes("Antwerpen")) return "antwerpen";
  if (name_nl.includes("Limburg")) return "limburg";
  if (name_nl.includes("Oost-Vlaanderen")) return "oost_vlaanderen";
  if (name_nl.includes("Vlaams-Brabant")) return "vlaams_brabant";
  if (name_nl.includes("West-Vlaanderen")) return "west_vlaanderen";
  if (name_nl.includes("Waals-Brabant")) return "brabant_wallon";
  if (name_nl.includes("Henegouwen")) return "hainaut";
  if (name_nl.includes("Luik")) return "liege";
  if (name_nl.includes("Luxemburg")) return "luxembourg";
  if (name_nl.includes("Namen")) return "namur";
  return "bruxelles";
};

const getColor = (value: number, dynamicScale: number) => {
  const absValue = Math.abs(value);
  if (absValue === 0) return "#e5e1d8";

  const hue = value > 0 ? 142 : 0; // Green or Red
  const ratio = Math.min(Math.pow(absValue / dynamicScale, 0.8), 1);
  const s = 40 + (ratio * 55); 
  const l = 85 - (ratio * 60); 
  
  return `hsl(${hue}, ${s}%, ${l}%)`;
};

interface RegionalImpactPanelProps {
  latestTurn: CareerTurn;
  onNext: () => void;
}

export function RegionalImpactPanel({ latestTurn, onNext }: RegionalImpactPanelProps) {
  const [selected, setSelected] = useState<{name: string, value: number} | null>(null);

  if (!latestTurn.result) return null;
  const { map_impact } = latestTurn.result;

  // Calculate the relative scale based on the current maximum impact
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dynamicScale = useMemo(() => {
    const values = Object.values(map_impact || {}).map(v => Math.abs(v as number));
    const max = Math.max(...values, 0);
    return Math.max(max, 10);
  }, [map_impact]);

  return (
    <div className="bg-white rounded-xl border border-black/10 premium-shadow overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 border-b border-black/5 px-6 py-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">Stap 2/4</span>
        <h3 className="text-xl font-black uppercase tracking-tighter text-[#2B2B2C] flex items-center gap-2">
          <Map className="w-5 h-5 text-slate-600" />
          Regionale Impact
        </h3>
      </div>
      
      <div className="flex-1 relative bg-slate-50/50 flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="w-full h-full relative flex items-center justify-center">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 9500,
              center: [4.5, 50.5]
            }}
            className="w-full max-h-[60vh] object-contain drop-shadow-md"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isProvince = geo.properties.name_nl?.startsWith("Provincie");
                  const isBrussels = geo.properties.reg_nis === "04000" && !geo.properties.nis; 
                  
                  if (!isProvince && !isBrussels) return null;

                  const provinceKey = mapProvinceKey(geo.properties.name_nl, geo.properties.reg_nis);
                  const value = map_impact ? (map_impact[provinceKey] || 0) : 0;
                  const fill = getColor(value, dynamicScale);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="#000"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none", transition: "all 0.5s" },
                        hover: { outline: "none", filter: "brightness(1.1)", strokeWidth: 1.5 },
                        pressed: { outline: "none" },
                      }}
                      className="cursor-pointer"
                      onClick={() => {
                        const name = geo.properties.name_nl?.replace("Provincie ", "") || "Brussel";
                        setSelected({ name, value });
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 bg-white/90 p-3 rounded-lg text-xs font-bold text-slate-800 flex flex-col gap-2 border border-black/10 backdrop-blur shadow-sm z-10">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Impact</div>
            <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-red-500 rounded-sm"></div> Negatief (-{dynamicScale.toFixed(0)})
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-[#e5e1d8] rounded-sm border border-black/10"></div> Neutraal (0)
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-green-500 rounded-sm"></div> Positief (+{dynamicScale.toFixed(0)})
            </div>
          </div>

          {/* Selected Province Info Box */}
          {selected && (
            <div className="absolute top-6 right-6 bg-white text-slate-900 p-4 min-w-[160px] rounded-xl shadow-xl border border-black/10 z-50 animate-in fade-in zoom-in duration-200">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Geselecteerd</div>
              <div className="text-sm font-black mb-2">{selected.name}</div>
              <div className={`text-3xl font-black ${selected.value > 0 ? "text-green-600" : selected.value < 0 ? "text-red-600" : "text-slate-600"}`}>
                {selected.value > 0 ? '+' : ''}{selected.value.toFixed(1)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 border-t border-black/5 px-6 py-4 flex justify-end">
        <button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest py-3 px-6 rounded transition-colors flex items-center justify-center gap-2 premium-shadow"
        >
          Bekijk Focusgroepen
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
