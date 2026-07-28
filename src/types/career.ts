export interface CareerMetrics {
  popularity: number; // 0-100
  coalitionStability: number; // 0-100
  internalStability: number; // 0-100
}

export interface EconomyMetrics {
  budgetDeficit: number; // e.g. 4.4 (% of GDP)
  gdp: number; // e.g. 580.0 (Billion EUR)
  inflation: number; // e.g. 3.2 (%)
  purchasingPower: number; // e.g. 100.0 (Index)
  climateGoals: number; // e.g. 35.0 (%)
}

export interface ParliamentSeat {
  party: string;
  seats: number;
  color: string;
  isCoalition: boolean;
  satisfaction?: number; // 0-100, only relevant if isCoalition is true
}

export interface Persona {
  id: string;
  name: string;
  background: string;
  score: number; // 0-100
  quote: string;
}

export interface InstitutionReactions {
  unions: number; // -100 to 100
  employers: number;
  media: number;
  flemishGov: number;
  walloonGov: number;
}

export interface CareerEvent {
  id: string;
  source: string; // e.g., "SITUATION REPORT", "BREAKING NEWS"
  title: string;
  context: string; // Additional background information for the event
  description: string;
  type: 'budget' | 'social' | 'community' | 'coalition' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiresResponse: boolean;
}

export interface CareerTurnResult {
  metrics_impact: {
    popularity: number;
    coalition: number;
    internal: number;
  };
  economy_impact: {
    budgetDeficit: number;
    gdp: number;
    inflation: number;
    purchasingPower: number;
    climateGoals: number;
  };
  party_satisfaction_impact?: {
    party: string;
    shift: number; // e.g. -15 or +10
  }[];
  coalition_changes?: {
    party: string;
    action: "left" | "joined";
  }[];
  analysis: {
    budgetImpact: string; // e.g., "+ €1.2B" or "- €500M"
    complexity: string; // "Low", "Medium", "High (Constitutional Risk)"
    summary: string;
  };
  opposition_reaction: {
    party: string;
    quote: string;
    stance: "positive" | "neutral" | "negative";
  }[];
  personas: Persona[];
  institutions: InstitutionReactions;
  map_impact: Record<string, number>;
  next_event?: CareerEvent;
}

export interface CareerTurn {
  month: number; // 1 to 48 (Jan 2025 to Dec 2028)
  actionTitle: string;
  actionDescription: string;
  result: CareerTurnResult | null;
  resolvedEvent?: CareerEvent;
}

export interface CareerState {
  currentMonth: number; // 1-48
  metrics: CareerMetrics;
  economy: EconomyMetrics;
  parliament: ParliamentSeat[];
  history: CareerTurn[];
  activeEvent: CareerEvent | null;
  isGameOver: boolean;
  gameOverReason: string | null;
  isCoalitionCrisis?: boolean;
  crisisReason?: string | null;
  provinces: Record<string, number>; // Current satisfaction per province (-100 to 100)
}

export interface CareerSave {
  id: string;
  name: string;
  updatedAt: number;
  state: CareerState;
}
