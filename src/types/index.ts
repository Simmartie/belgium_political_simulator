export interface Metric {
  id: string;
  name: string;
  value: number; // Base value
  min: number;
  max: number;
  color: string; // Hex or Tailwind color string for charts
  unit?: string;
}

export interface MediaReactions {
  socialist: string;
  liberal: string;
  nationalist: string;
  christian_democrat: string;
}

export interface CustomPolicy {
  id: string;
  title: string;
  description: string;
  justification?: string;
  shifts?: Record<string, number>;
  metricExplanations?: Record<string, string>;
  provinceReactions?: Record<string, number>;
  provinceExplanations?: Record<string, string>;
  mediaReactions?: MediaReactions;
}

export interface SimulatorState {
  policies: CustomPolicy[];
  baseMetrics: Metric[];
}
