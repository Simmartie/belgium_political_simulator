"use client";

import React, { useState } from "react";
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

// Map 0-100% to a color. Let's use a blue gradient.
const getColor = (value: number) => {
  const percentage = Math.max(0, Math.min(100, value));
  // from very light blue to very dark blue
  const lightness = 95 - (percentage * 0.6); // 95% down to 35%
  return `hsl(215, 90%, ${lightness}%)`;
};

interface ProgramProvinceMapProps {
  provinceVotes: Record<string, number>;
}

export default function ProgramProvinceMap({ provinceVotes }: ProgramProvinceMapProps) {
  const [selected, setSelected] = useState<{name: string, value: number} | null>(null);

  return (
    <div className="w-full aspect-square md:aspect-video lg:aspect-square relative flex items-center justify-center">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 12000,
          center: [4.4, 50.5] // Centered on Belgium
        }}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isProvince = geo.properties.name_nl?.startsWith("Provincie");
              const isBrussels = geo.properties.reg_nis === "04000" && !geo.properties.nis;
              
              if (!isProvince && !isBrussels) {
                  return null;
              }

              const provinceKey = mapProvinceKey(geo.properties.name_nl, geo.properties.reg_nis);
              const value = provinceVotes[provinceKey] || 0;
              const fill = getColor(value);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#000"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none", transition: "all 0.5s" },
                    hover: { outline: "none", filter: "brightness(1.1)" },
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
      <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded text-[10px] text-slate-900 flex flex-col gap-1 border border-black/5 backdrop-blur premium-shadow">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[hsl(215,90%,95%)] rounded-full border border-black/10"></div> 0% Stemmen
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[hsl(215,90%,65%)] rounded-full"></div> 50% Stemmen
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[hsl(215,90%,35%)] rounded-full"></div> 100% Stemmen
        </div>
      </div>

      {/* Selected Province Info Box */}
      {selected && (
        <div className="absolute top-4 right-4 bg-white/90 text-slate-900 p-4 min-w-[140px] rounded-lg shadow-xl border border-black/5 backdrop-blur z-50">
          <div className="text-[10px] uppercase tracking-widest text-[#2B2B2C] mb-1">Verwachte Stemmen</div>
          <div className="text-sm font-bold mb-2">{selected.name}</div>
          <div className="text-2xl font-black text-blue-600">
            {selected.value.toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
}
