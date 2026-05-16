import { Metric, CustomPolicy } from "../types";

export const initialMetrics: Metric[] = [
  { id: "budget_deficit", name: "Budget Deficit", value: 65, min: 0, max: 100, color: "#ef4444", unit: "%" },
  { id: "purchasing_power_index", name: "Koopkracht Index", value: 100, min: 0, max: 200, color: "#10b981", unit: "IDX" },
  { id: "climate_progress", name: "Climate Goals", value: 35, min: 0, max: 100, color: "#22c55e", unit: "%" },
];

export const initialPolicies: CustomPolicy[] = [];
