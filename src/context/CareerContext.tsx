"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CareerState, CareerEvent, CareerTurnResult, CareerMetrics, ParliamentSeat } from "../types/career";

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

const initialMetrics: CareerMetrics = {
  popularity: 50,
  coalitionStability: 75,
  internalStability: 80,
};

const initialParliament: ParliamentSeat[] = [
  { party: "N-VA", seats: 24, color: "#F0B400", isCoalition: true },
  { party: "MR", seats: 20, color: "#0047AB", isCoalition: true },
  { party: "Les Engagés", seats: 14, color: "#00A896", isCoalition: true },
  { party: "Vooruit", seats: 13, color: "#E00034", isCoalition: true },
  { party: "CD&V", seats: 11, color: "#FF7F00", isCoalition: true },
  { party: "Vlaams Belang", seats: 20, color: "#FFE600", isCoalition: false },
  { party: "PS", seats: 16, color: "#FF0000", isCoalition: false },
  { party: "PTB/PVDA", seats: 15, color: "#D20000", isCoalition: false },
  { party: "Open Vld", seats: 7, color: "#0066CC", isCoalition: false },
  { party: "Groen", seats: 6, color: "#009900", isCoalition: false },
  { party: "Ecolo", seats: 3, color: "#99CC33", isCoalition: false },
  { party: "DéFI", seats: 1, color: "#DF0045", isCoalition: false },
];

const initialState: CareerState = {
  currentMonth: 1, // Jan 2025
  metrics: initialMetrics,
  parliament: initialParliament,
  history: [],
  activeEvent: null,
  isGameOver: false,
  gameOverReason: null,
  provinces: { ...initialProvinces },
};

interface CareerContextType {
  state: CareerState;
  isLoading: boolean;
  submitMonthlyAction: (title: string, description: string) => Promise<void>;
  submitEventResponse: (response: string) => Promise<void>;
  resetCareer: () => void;
  flemishSatisfaction: number;
  walloonSatisfaction: number;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export function CareerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CareerState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("careerModeState");
    if (savedState) {
      try {
        setState(JSON.parse(savedState));
      } catch (e) {
        console.error("Failed to parse saved career state", e);
      }
    }
  }, []);

  // Save to local storage on state change
  useEffect(() => {
    localStorage.setItem("careerModeState", JSON.stringify(state));
  }, [state]);

  const applyTurnResult = (result: CareerTurnResult, title: string, description: string, isEventResponse: boolean = false) => {
    setState((prev) => {
      // Calculate new metrics
      const newMetrics = {
        popularity: Math.max(0, Math.min(100, prev.metrics.popularity + result.metrics_impact.popularity)),
        coalitionStability: Math.max(0, Math.min(100, prev.metrics.coalitionStability + result.metrics_impact.coalition)),
        internalStability: Math.max(0, Math.min(100, prev.metrics.internalStability + result.metrics_impact.internal)),
      };

      // Calculate new provinces
      const newProvinces = { ...prev.provinces };
      if (result.map_impact) {
        for (const [prov, shift] of Object.entries(result.map_impact)) {
           newProvinces[prov] = Math.max(-100, Math.min(100, (newProvinces[prov] || 0) + shift));
        }
      }

      const isGameOver = newMetrics.coalitionStability < 20;
      const gameOverReason = isGameOver ? "King Philippe has demanded your resignation due to a collapsed coalition." : null;

      // Create history entry
      const historyEntry = {
        month: prev.currentMonth,
        actionTitle: title,
        actionDescription: description,
        result: result,
        resolvedEvent: isEventResponse ? prev.activeEvent || undefined : undefined,
      };

      return {
        ...prev,
        currentMonth: prev.currentMonth + (isEventResponse ? 0 : 1), // Don't advance month if just responding to an event? Actually, let's advance month after every action.
        metrics: newMetrics,
        provinces: newProvinces,
        history: [historyEntry, ...prev.history],
        activeEvent: result.next_event || null,
        isGameOver,
        gameOverReason,
      };
    });
  };

  const submitMonthlyAction = async (title: string, description: string) => {
    if (state.isGameOver) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/career/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: {
            metrics: state.metrics,
            currentMonth: state.currentMonth,
          },
          action: {
            type: "policy",
            title,
            description,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to simulate career turn");
      const data: CareerTurnResult = await response.json();
      applyTurnResult(data, title, description);
    } catch (error) {
      console.error(error);
      alert("Failed to submit action.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitEventResponse = async (response: string) => {
    if (state.isGameOver || !state.activeEvent) return;
    setIsLoading(true);
    try {
      const apiResponse = await fetch("/api/career/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: {
            metrics: state.metrics,
            currentMonth: state.currentMonth,
          },
          action: {
            type: "event_response",
            event: state.activeEvent,
            response,
          },
        }),
      });

      if (!apiResponse.ok) throw new Error("Failed to simulate event response");
      const data: CareerTurnResult = await apiResponse.json();
      
      // Advance month after event response
      applyTurnResult(data, `Response to: ${state.activeEvent.title}`, response, true);
    } catch (error) {
      console.error(error);
      alert("Failed to submit event response.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetCareer = () => {
    setState(initialState);
    localStorage.removeItem("careerModeState");
  };

  const flemishProvinces = ["antwerpen", "limburg", "oost_vlaanderen", "west_vlaanderen", "vlaams_brabant"];
  const walloonProvinces = ["hainaut", "liege", "namur", "brabant_wallon", "luxembourg"];

  const flemishSatisfaction = flemishProvinces.reduce((sum, prov) => sum + state.provinces[prov], 0) / flemishProvinces.length;
  const walloonSatisfaction = walloonProvinces.reduce((sum, prov) => sum + state.provinces[prov], 0) / walloonProvinces.length;

  return (
    <CareerContext.Provider
      value={{
        state,
        isLoading,
        submitMonthlyAction,
        submitEventResponse,
        resetCareer,
        flemishSatisfaction,
        walloonSatisfaction,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  const context = useContext(CareerContext);
  if (context === undefined) {
    throw new Error("useCareer must be used within a CareerProvider");
  }
  return context;
}
