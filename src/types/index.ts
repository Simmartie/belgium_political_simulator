export interface Metric {
  id: string;
  name: string;
  value: number; // Base value
  min: number;
  max: number;
  color: string; // Hex or Tailwind color string for charts
}

export interface PolicyImpact {
  metricId: string;
  valueChange: number; // Positive or negative impact on the metric
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  impacts: PolicyImpact[];
}

export interface SimulatorState {
  policies: Policy[];
  baseMetrics: Metric[];
}
