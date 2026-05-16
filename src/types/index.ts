export interface Metric {
  id: string;
  name: string;
  value: number; // Base value
  min: number;
  max: number;
  color: string; // Hex or Tailwind color string for charts
}

export interface CustomPolicy {
  id: string;
  title: string;
  description: string;
  justification?: string;
}

export interface SimulatorState {
  policies: CustomPolicy[];
  baseMetrics: Metric[];
}
