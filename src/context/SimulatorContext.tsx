"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Metric, Policy } from "../types";
import { initialMetrics, initialPolicies } from "../data/initialData";

interface SimulatorContextType {
  policies: Policy[];
  baseMetrics: Metric[];
  currentMetrics: Metric[];
  stabilityScore: number;
  isLoading: boolean;
  justification: string | null;
  togglePolicy: (id: string) => Promise<void>;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [baseMetrics] = useState<Metric[]>(initialMetrics);
  const [currentMetrics, setCurrentMetrics] = useState<Metric[]>(initialMetrics);
  const [isLoading, setIsLoading] = useState(false);
  const [justification, setJustification] = useState<string | null>(null);

  const togglePolicy = async (id: string) => {
    const policyIndex = policies.findIndex((p) => p.id === id);
    if (policyIndex === -1) return;

    const policy = policies[policyIndex];
    const newIsActive = !policy.isActive;
    const action = newIsActive ? "ENABLE" : "DISABLE";

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
            title: policy.title,
            action: action,
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

      setJustification(data.justification);

      setPolicies((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: newIsActive } : p))
      );
    } catch (error) {
      console.error(error);
      alert("Simulation failed. Check console or API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const stabilityScore = currentMetrics.find((m) => m.id === "government_stability")?.value || 0;

  return (
    <SimulatorContext.Provider
      value={{
        policies,
        baseMetrics,
        currentMetrics,
        stabilityScore,
        isLoading,
        justification,
        togglePolicy,
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
