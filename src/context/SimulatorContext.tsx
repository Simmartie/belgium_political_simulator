"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Metric, CustomPolicy, MediaReactions } from "../types";
import { initialMetrics } from "../data/initialData";

const initialProvinces: Record<string, number> = {
  antwerpen: 0,
  limburg: 0,
  oost_vlaanderen: 0,
  west_vlaanderen: 0,
  vlaams_brabant: 0,
  hainaut: 0,
  liege: 0,
  namur: 0,
  brabant_wallon: 0,
  luxembourg: 0,
  bruxelles: 0
};

interface SimulatorContextType {
  activePolicies: CustomPolicy[];
  baseMetrics: Metric[];
  currentMetrics: Metric[];
  currentProvinces: Record<string, number>;
  flemishSatisfaction: number;
  walloonSatisfaction: number;
  mediaReactions: MediaReactions | null;
  isLoading: boolean;
  submitCustomPolicy: (title: string, description: string) => Promise<void>;
  undoPolicy: (id: string) => void;
  resetSimulator: () => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [activePolicies, setActivePolicies] = useState<CustomPolicy[]>([]);
  const [baseMetrics] = useState<Metric[]>(initialMetrics);
  const [currentMetrics, setCurrentMetrics] = useState<Metric[]>(initialMetrics);
  const [currentProvinces, setCurrentProvinces] = useState<Record<string, number>>(initialProvinces);
  const [mediaReactions, setMediaReactions] = useState<MediaReactions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submitCustomPolicy = async (title: string, description: string) => {
    setIsLoading(true);

    try {
      const payloadMetrics = currentMetrics.reduce((acc, m) => {
        acc[m.id] = m.value;
        return acc;
      }, {} as Record<string, number>);

      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentMetrics: payloadMetrics,
          policy: {
            title,
            description,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch simulation data");
      }

      const data = await response.json();
      
      setCurrentMetrics((prev) =>
        prev.map((m) => {
          const shift = data.metric_shifts[m.id] || 0;
          let newVal = m.value + shift;
          newVal = Math.max(m.min, Math.min(m.max, newVal));
          return { ...m, value: newVal };
        })
      );

      setCurrentProvinces((prev) => {
        const next = { ...prev };
        for (const [prov, shift] of Object.entries(data.province_reactions || {})) {
          next[prov] = Math.max(-100, Math.min(100, next[prov] + (shift as number)));
        }
        return next;
      });

      if (data.media_reactions) {
        setMediaReactions(data.media_reactions);
      }

      setActivePolicies((prev) => [
        {
          id: Math.random().toString(36).substr(2, 9),
          title,
          description,
          shifts: data.metric_shifts,
          provinceReactions: data.province_reactions,
          mediaReactions: data.media_reactions,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error(error);
      alert("Simulation failed. Check console or API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const undoPolicy = (id: string) => {
    const policyToUndo = activePolicies.find(p => p.id === id);
    if (!policyToUndo) return;

    if (policyToUndo.shifts) {
      setCurrentMetrics((prev) =>
        prev.map((m) => {
          const shift = policyToUndo.shifts![m.id] || 0;
          let newVal = m.value - shift; // Reverse the shift
          newVal = Math.max(m.min, Math.min(m.max, newVal));
          return { ...m, value: newVal };
        })
      );
    }

    if (policyToUndo.provinceReactions) {
      setCurrentProvinces((prev) => {
        const next = { ...prev };
        for (const [prov, shift] of Object.entries(policyToUndo.provinceReactions!)) {
          next[prov] = Math.max(-100, Math.min(100, next[prov] - (shift as number)));
        }
        return next;
      });
    }

    setActivePolicies((prev) => prev.filter(p => p.id !== id));
    
    // Reset media to the previous policy if it exists
    if (activePolicies[0]?.id === id) {
      const prevPolicy = activePolicies[1];
      setMediaReactions(prevPolicy?.mediaReactions || null);
    }
  };

  const resetSimulator = () => {
    setActivePolicies([]);
    setCurrentMetrics(initialMetrics);
    setCurrentProvinces(initialProvinces);
    setMediaReactions(null);
  };

  const flemishProvinces = ["antwerpen", "limburg", "oost_vlaanderen", "west_vlaanderen", "vlaams_brabant"];
  const walloonProvinces = ["hainaut", "liege", "namur", "brabant_wallon", "luxembourg"];

  const flemishSatisfaction = flemishProvinces.reduce((sum, prov) => sum + currentProvinces[prov], 0) / flemishProvinces.length;
  const walloonSatisfaction = walloonProvinces.reduce((sum, prov) => sum + currentProvinces[prov], 0) / walloonProvinces.length;

  return (
    <SimulatorContext.Provider
      value={{
        activePolicies,
        baseMetrics,
        currentMetrics,
        currentProvinces,
        flemishSatisfaction,
        walloonSatisfaction,
        mediaReactions,
        isLoading,
        submitCustomPolicy,
        undoPolicy,
        resetSimulator,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (context === undefined) {
    throw new Error("useSimulator must be used within a SimulatorProvider");
  }
  return context;
}
