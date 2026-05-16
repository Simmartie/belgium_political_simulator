"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useSimulator } from "../../context/SimulatorContext";

const geoUrl = "/belgium-provinces.json";

// Map names in TopoJSON to the keys used in our state and API
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
  if (absValue === 0) return "#1e293b";

  const hue = value > 0 ? 142 : 0; // Green or Red
  
  // We use the dynamicScale (the max value currently on the map) 
  // to make the colors relative to each other.
  const ratio = Math.min(Math.pow(absValue / dynamicScale, 0.8), 1);

  // One smooth gradient: 
  // Low value relative to max = High Lightness (Light/Pale)
  // High value relative to max = Low Lightness (Dark/Intense)
  const s = 40 + (ratio * 55); // Saturation 40% -> 95%
  const l = 85 - (ratio * 60); // Lightness 85% -> 25%
  
  return `hsl(${hue}, ${s}%, ${l}%)`;
};

export default function ProvinceMap() {
  const { currentProvinces } = useSimulator();
  const [selected, setSelected] = useState<{name: string, value: number} | null>(null);

  // Calculate the relative scale based on the current maximum impact
  const dynamicScale = React.useMemo(() => {
    const values = Object.values(currentProvinces).map(v => Math.abs(v));
    const max = Math.max(...values, 0);
    // We set a floor of 10 to prevent extreme sensitivity with near-zero values
    return Math.max(max, 10);
  }, [currentProvinces]);

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
              // Only render features that are provinces or the Brussels region
              const isProvince = geo.properties.name_nl?.startsWith("Provincie");
              const isBrussels = geo.properties.reg_nis === "04000" && !geo.properties.nis; // Brussels region doesn't have a municipality NIS in the provinces layer
              
              if (!isProvince && !isBrussels) {
                  return null;
              }
              // The topojson contains all three. The provinces one has either 'nis' (length 5) or reg_nis "04000" for Brussels
              // But actually the file has 3 objects: municipalities, arrondissements, provinces.
              // react-simple-maps uses the first object by default if not specified.
              // Let's filter just in case, but usually we should specify the object.
              // We'll rely on the properties above.

              const provinceKey = mapProvinceKey(geo.properties.name_nl, geo.properties.reg_nis);
              const value = currentProvinces[provinceKey] || 0;
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
                    hover: { outline: "none", filter: "brightness(1.2)" },
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
      <div className="absolute bottom-4 left-4 bg-black/80 p-2 rounded text-[10px] text-white flex flex-col gap-1 border border-white/10 backdrop-blur">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div> Furious (-100)
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-800 rounded-full border border-white/20"></div> Neutral (0)
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div> Thrilled (+100)
        </div>
      </div>

      {/* Selected Province Info Box */}
      {selected && (
        <div className="absolute top-4 right-4 bg-black/90 text-white p-4 min-w-[140px] rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur z-50">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Geselecteerd</div>
          <div className="text-sm font-bold mb-2">{selected.name}</div>
          <div className={`text-2xl font-black ${selected.value > 0 ? "text-green-400" : selected.value < 0 ? "text-red-400" : "text-white"}`}>
            {selected.value > 0 ? '+' : ''}{selected.value.toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
}
