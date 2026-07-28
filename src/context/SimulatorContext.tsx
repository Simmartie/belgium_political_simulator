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
  selectedPolicyId: string | null;
  submitCustomPolicy: (title: string, description: string) => Promise<void>;
  selectPolicy: (id: string | null) => void;
  deletePolicy: (id: string) => void;
  resetSimulator: () => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [activePolicies, setActivePolicies] = useState<CustomPolicy[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [baseMetrics] = useState<Metric[]>(initialMetrics);
  const [isLoading, setIsLoading] = useState(false);

  // Derived state based on the selected policy
  const selectedPolicy = activePolicies.find(p => p.id === selectedPolicyId) || activePolicies[0] || null;

  const currentMetrics = React.useMemo(() => {
    return baseMetrics.map(m => {
      const shift = selectedPolicy?.shifts?.[m.id] || 0;
      let newVal = m.value + shift;
      newVal = Math.max(m.min, Math.min(m.max, newVal));
      return { ...m, value: newVal };
    });
  }, [baseMetrics, selectedPolicy]);

  const currentProvinces = React.useMemo(() => {
    const next = { ...initialProvinces };
    if (selectedPolicy?.provinceReactions) {
      for (const [prov, shift] of Object.entries(selectedPolicy.provinceReactions)) {
        next[prov] = Math.max(-100, Math.min(100, next[prov] + (shift as number)));
      }
    }
    return next;
  }, [selectedPolicy]);

  const mediaReactions = selectedPolicy?.mediaReactions || null;

  const submitCustomPolicy = async (title: string, description: string) => {
    setIsLoading(true);

    try {
      // Always base the simulation on the baseline metrics, not accumulated
      const payloadMetrics = baseMetrics.reduce((acc, m) => {
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
      const newPolicy = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        shifts: data.metric_shifts,
        metricExplanations: data.metric_explanations,
        provinceReactions: data.province_reactions,
        provinceExplanations: data.province_explanations,
        mediaReactions: data.media_reactions,
      };

      setActivePolicies((prev) => [newPolicy, ...prev]);
      setSelectedPolicyId(newPolicy.id);
    } catch (error) {
      console.error(error);
      alert("Simulation failed. Check console or API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectPolicy = (id: string | null) => {
    setSelectedPolicyId(id);
  };

  const deletePolicy = (id: string) => {
    setActivePolicies((prev) => {
      const next = prev.filter(p => p.id !== id);
      if (selectedPolicyId === id) {
        setSelectedPolicyId(next[0]?.id || null);
      }
      return next;
    });
  };

  const resetSimulator = () => {
    setActivePolicies([]);
    setSelectedPolicyId(null);
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
        selectedPolicyId,
        submitCustomPolicy,
        selectPolicy,
        deletePolicy,
        resetSimulator,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

const defaultContextValue: SimulatorContextType = {
  activePolicies: [],
  baseMetrics: initialMetrics,
  currentMetrics: initialMetrics,
  currentProvinces: initialProvinces,
  flemishSatisfaction: 0,
  walloonSatisfaction: 0,
  mediaReactions: null,
  isLoading: false,
  selectedPolicyId: null,
  submitCustomPolicy: async () => {},
  selectPolicy: () => {},
  deletePolicy: () => {},
  resetSimulator: () => {},
};

export function useSimulator() {
  const context = useContext(SimulatorContext);
  return context || defaultContextValue;
}
