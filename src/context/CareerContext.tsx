"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CareerState, CareerTurnResult, CareerMetrics, ParliamentSeat, CareerSave } from "../types/career";

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

const initialEconomyMetrics = {
  budgetDeficit: 4.4,
  gdp: 580.0,
  inflation: 3.2,
  purchasingPower: 100.0,
  climateGoals: 35.0,
};

const initialParliament: ParliamentSeat[] = [
  { party: "N-VA", seats: 24, color: "#F0B400", isCoalition: true, satisfaction: 75 },
  { party: "MR", seats: 20, color: "#0047AB", isCoalition: true, satisfaction: 70 },
  { party: "Les Engagés", seats: 14, color: "#00A896", isCoalition: true, satisfaction: 70 },
  { party: "Vooruit", seats: 13, color: "#E00034", isCoalition: true, satisfaction: 65 },
  { party: "CD&V", seats: 11, color: "#FF7F00", isCoalition: true, satisfaction: 70 },
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
  economy: initialEconomyMetrics,
  parliament: initialParliament,
  history: [],
  activeEvent: null,
  isGameOver: false,
  gameOverReason: null,
  isCoalitionCrisis: false,
  crisisReason: null,
  provinces: { ...initialProvinces },
};

interface CareerContextType {
  state: CareerState;
  isLoading: boolean;
  submitMonthlyAction: (title: string, description: string, options?: { consultKernkabinet: boolean, mediaSpin: boolean }) => Promise<void>;
  resetCareer: () => void;
  resolveCrisis: (success: boolean, reason?: string, newParty?: string) => void;
  flemishSatisfaction: number;
  walloonSatisfaction: number;
  saves: CareerSave[];
  activeSaveId: string | null;
  createNewSave: (name: string) => void;
  loadSave: (id: string) => void;
  deleteSave: (id: string) => void;
  unloadSave: () => void;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export function CareerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CareerState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [saves, setSaves] = useState<CareerSave[]>([]);
  const [activeSaveId, setActiveSaveId] = useState<string | null>(null);

  // Load saves from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("careerSaves");
    if (savedData) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSaves(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved career saves", e);
      }
    }
  }, []);

  // Save to local storage on state change
  useEffect(() => {
    if (activeSaveId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaves(prevSaves => {
        const updated = prevSaves.map(save => {
          if (save.id === activeSaveId) {
            return { ...save, state, updatedAt: Date.now() };
          }
          return save;
        });
        localStorage.setItem("careerSaves", JSON.stringify(updated));
        return updated;
      });
    }
  }, [state, activeSaveId]);

  const applyTurnResult = (result: CareerTurnResult, title: string, description: string) => {
    setState((prev) => {
      // Calculate new metrics
      const newMetrics = {
        popularity: Math.max(0, Math.min(100, prev.metrics.popularity + result.metrics_impact.popularity)),
        coalitionStability: Math.max(0, Math.min(100, prev.metrics.coalitionStability + result.metrics_impact.coalition)),
        internalStability: Math.max(0, Math.min(100, prev.metrics.internalStability + result.metrics_impact.internal)),
      };

      // Calculate new economy metrics
      const newEconomy = { ...prev.economy };
      if (result.economy_impact) {
        newEconomy.budgetDeficit = Number((newEconomy.budgetDeficit + result.economy_impact.budgetDeficit).toFixed(2));
        newEconomy.gdp = Number(Math.max(0, newEconomy.gdp + result.economy_impact.gdp).toFixed(1));
        newEconomy.inflation = Number((newEconomy.inflation + result.economy_impact.inflation).toFixed(2));
        newEconomy.purchasingPower = Number(Math.max(0, newEconomy.purchasingPower + result.economy_impact.purchasingPower).toFixed(1));
        newEconomy.climateGoals = Number(Math.max(0, Math.min(100, newEconomy.climateGoals + result.economy_impact.climateGoals)).toFixed(1));
      }

      // Calculate new provinces
      const newProvinces = { ...prev.provinces };
      if (result.map_impact) {
        for (const [prov, shift] of Object.entries(result.map_impact)) {
           newProvinces[prov] = Math.max(-100, Math.min(100, (newProvinces[prov] || 0) + shift));
        }
      }

      // Calculate new parliament state
      let newParliament = [...prev.parliament];
      
      if (result.party_satisfaction_impact) {
        newParliament = newParliament.map(seat => {
          const impact = result.party_satisfaction_impact?.find(i => i.party === seat.party);
          if (impact && seat.isCoalition) {
            return { ...seat, satisfaction: Math.max(0, Math.min(100, (seat.satisfaction ?? 50) + impact.shift)) };
          }
          return seat;
        });
      }

      if (result.coalition_changes) {
        newParliament = newParliament.map(seat => {
          const change = result.coalition_changes?.find(c => c.party === seat.party);
          if (change) {
            if (change.action === "left") {
              return { ...seat, isCoalition: false };
            } else if (change.action === "joined") {
              return { ...seat, isCoalition: true, satisfaction: 70 };
            }
          }
          return seat;
        });
      }

      const totalCoalitionSeats = newParliament.filter(s => s.isCoalition).reduce((acc, curr) => acc + curr.seats, 0);
      
      const isCoalitionCrisis = totalCoalitionSeats < 76;
      const crisisReason = isCoalitionCrisis ? `De regering heeft haar meerderheid verloren (${totalCoalitionSeats}/150 zetels).` : null;

      const isGameOver = newMetrics.coalitionStability < 20 && !isCoalitionCrisis;
      const gameOverReason = isGameOver ? "Koning Filip heeft uw ontslag geëist vanwege een onwerkbare coalitiestabiliteit." : null;

      // Create history entry
      const historyEntry = {
        month: prev.currentMonth,
        actionTitle: title,
        actionDescription: description,
        result: result,
        resolvedEvent: prev.activeEvent || undefined,
      };

      return {
        ...prev,
        currentMonth: prev.currentMonth + 1,
        metrics: newMetrics,
        economy: newEconomy,
        provinces: newProvinces,
        parliament: newParliament,
        history: [historyEntry, ...prev.history],
        activeEvent: result.next_event || null,
        isGameOver,
        gameOverReason,
        isCoalitionCrisis,
        crisisReason,
      };
    });
  };

  const resolveCrisis = (success: boolean, reason?: string, newParty?: string) => {
    setState((prev) => {
      if (success && newParty) {
        // Add new party to coalition
        const updatedParliament = prev.parliament.map(seat => {
          if (seat.party === newParty) {
            return { ...seat, isCoalition: true, satisfaction: 70 };
          }
          return seat;
        });
        return {
          ...prev,
          parliament: updatedParliament,
          isCoalitionCrisis: false,
          crisisReason: null,
          history: [
            {
              month: prev.currentMonth,
              actionTitle: "Regeringsonderhandelingen",
              actionDescription: `${newParty} is toegetreden tot de regering.`,
              result: null
            },
            ...prev.history
          ]
        };
      } else {
        // Game Over
        return {
          ...prev,
          isCoalitionCrisis: false,
          isGameOver: true,
          gameOverReason: reason || "De regeringsonderhandelingen zijn mislukt. Vervroegde verkiezingen worden uitgeschreven."
        };
      }
    });
  };

  const submitMonthlyAction = async (title: string, description: string, options?: { consultKernkabinet: boolean, mediaSpin: boolean }) => {
    if (state.isGameOver || state.isCoalitionCrisis) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/career/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: {
            metrics: state.metrics,
            economy: state.economy,
            currentMonth: state.currentMonth,
            parliament: state.parliament,
          },
          action: {
            type: "policy",
            title,
            description,
            options,
            event: state.activeEvent,
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

  const resetCareer = () => {
    // Only resets the active save state to default
    setState(initialState);
  };

  const createNewSave = (name: string) => {
    const id = Date.now().toString();
    const newSave: CareerSave = {
      id,
      name,
      updatedAt: Date.now(),
      state: initialState,
    };
    setSaves(prev => {
      const updated = [newSave, ...prev];
      localStorage.setItem("careerSaves", JSON.stringify(updated));
      return updated;
    });
    setState(initialState);
    setActiveSaveId(id);
  };

  const loadSave = (id: string) => {
    const save = saves.find(s => s.id === id);
    if (save) {
      setState(save.state);
      setActiveSaveId(id);
    }
  };

  const deleteSave = (id: string) => {
    setSaves(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem("careerSaves", JSON.stringify(updated));
      return updated;
    });
    if (activeSaveId === id) {
      setActiveSaveId(null);
      setState(initialState);
    }
  };

  const unloadSave = () => {
    setActiveSaveId(null);
    setState(initialState);
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
        resetCareer,
        resolveCrisis,
        flemishSatisfaction,
        walloonSatisfaction,
        saves,
        activeSaveId,
        createNewSave,
        loadSave,
        deleteSave,
        unloadSave,
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
