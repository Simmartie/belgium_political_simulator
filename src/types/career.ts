export interface CareerMetrics {
  popularity: number; // 0-100
  coalitionStability: number; // 0-100
  internalStability: number; // 0-100
}

export interface ParliamentSeat {
  party: string;
  seats: number;
  color: string;
  isCoalition: boolean;
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
  title: string;
  description: string;
  type: 'budget' | 'social' | 'community' | 'coalition' | 'other';
  requiresResponse: boolean;
}

export interface CareerTurnResult {
  metrics_impact: {
    popularity: number;
    coalition: number;
    internal: number;
  };
  analysis: {
    budgetImpact: string; // e.g., "+ €1.2B" or "- €500M"
    complexity: string; // "Low", "Medium", "High (Constitutional Risk)"
    summary: string;
  };
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
  parliament: ParliamentSeat[];
  history: CareerTurn[];
  activeEvent: CareerEvent | null;
  isGameOver: boolean;
  gameOverReason: string | null;
  provinces: Record<string, number>; // Current satisfaction per province (-100 to 100)
}
