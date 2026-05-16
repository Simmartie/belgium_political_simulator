"use client";

import React, { useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useSimulator } from "../../context/SimulatorContext";

const geoUrl = "/belgium-provinces.json";

// Map names in TopoJSON to the keys used in our state and API
const mapProvinceKey = (name_nl?: string, reg_nis?: string) => {
  if (reg_nis === "04000") return "bruxelles";
  
  switch (name_nl) {
    case "Provincie Antwerpen": return "antwerpen";
    case "Provincie Limburg": return "limburg";
    case "Provincie Oost-Vlaanderen": return "oost_vlaanderen";
    case "Provincie Vlaams-Brabant": return "vlaams_brabant";
    case "Provincie West-Vlaanderen": return "west_vlaanderen";
    case "Provincie Waals-Brabant": return "brabant_wallon";
    case "Provincie Henegouwen": return "hainaut";
    case "Provincie Luik": return "liege";
    case "Provincie Luxemburg": return "luxembourg";
    case "Provincie Namen": return "namur";
    default: return "bruxelles";
  }
};

const getColor = (value: number) => {
  if (value === 0) return "#1e293b"; // Neutral / Gray-Blue
  
  if (value > 0) {
    // Green scale
    const intensity = Math.min(value / 100, 1);
    return `rgba(34, 197, 94, ${0.2 + intensity * 0.8})`; // #22c55e
  } else {
    // Red scale
    const intensity = Math.min(Math.abs(value) / 100, 1);
    return `rgba(239, 68, 68, ${0.2 + intensity * 0.8})`; // #ef4444
  }
};

export default function ProvinceMap() {
  const { currentProvinces } = useSimulator();

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
              // Ensure we are rendering provinces, not municipalities
              if (geo.properties.nis?.length !== 5 && geo.properties.reg_nis !== "04000") {
                  return null;
              }
              // The topojson contains all three. The provinces one has either 'nis' (length 5) or reg_nis "04000" for Brussels
              // But actually the file has 3 objects: municipalities, arrondissements, provinces.
              // react-simple-maps uses the first object by default if not specified.
              // Let's filter just in case, but usually we should specify the object.
              // We'll rely on the properties above.

              const provinceKey = mapProvinceKey(geo.properties.name_nl, geo.properties.reg_nis);
              const value = currentProvinces[provinceKey] || 0;
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
                    hover: { outline: "none", filter: "brightness(1.2)" },
                    pressed: { outline: "none" },
                  }}
                  className="cursor-pointer"
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
    </div>
  );
}
