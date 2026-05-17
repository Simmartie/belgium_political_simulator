import { Metric, CustomPolicy } from "../types";

export const initialMetrics: Metric[] = [
  { id: "budget_deficit", name: "Begrotingstekort", value: 4.4, min: -10, max: 20, color: "#ef4444", unit: "% BBP" },
  { id: "gdp_total", name: "BBP", value: 580, min: 400, max: 1000, color: "#3b82f6", unit: "Mld €" },
  { id: "inflation_rate", name: "Inflatie", value: 3.2, min: -2, max: 20, color: "#f59e0b", unit: "%" },
  { id: "purchasing_power_index", name: "Koopkracht Index", value: 100, min: 0, max: 200, color: "#10b981", unit: "IDX" },
  { id: "climate_progress", name: "Klimaatdoelen", value: 35, min: 0, max: 100, color: "#22c55e", unit: "%" },
];

export const initialPolicies: CustomPolicy[] = [];
