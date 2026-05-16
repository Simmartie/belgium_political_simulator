"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Metric, CustomPolicy } from "../types";
import { initialMetrics } from "../data/initialData";

interface SimulatorContextType {
  activePolicies: CustomPolicy[];
  baseMetrics: Metric[];
  currentMetrics: Metric[];
  stabilityScore: number;
  isLoading: boolean;
  justification: string | null;
  submitCustomPolicy: (title: string, description: string) => Promise<void>;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [activePolicies, setActivePolicies] = useState<CustomPolicy[]>([]);
  const [baseMetrics] = useState<Metric[]>(initialMetrics);
  const [currentMetrics, setCurrentMetrics] = useState<Metric[]>(initialMetrics);
  const [isLoading, setIsLoading] = useState(false);
  const [justification, setJustification] = useState<string | null>(null);

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

      const responseJustification = data.justification;
      setJustification(responseJustification);

      setActivePolicies((prev) => [
        {
          id: Math.random().toString(36).substr(2, 9),
          title,
          description,
          justification: responseJustification,
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

  const stabilityScore = currentMetrics.find((m) => m.id === "government_stability")?.value || 0;

  return (
    <SimulatorContext.Provider
      value={{
        activePolicies,
        baseMetrics,
        currentMetrics,
        stabilityScore,
        isLoading,
        justification,
        submitCustomPolicy,
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
