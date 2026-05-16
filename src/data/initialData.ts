import { Metric, Policy } from "../types";

export const initialMetrics: Metric[] = [
  { id: "budget_deficit", name: "Budget Deficit", value: 65, min: 0, max: 100, color: "#ef4444" },
  { id: "purchasing_power", name: "Purchasing Power", value: 50, min: 0, max: 100, color: "#10b981" },
  { id: "flemish_satisfaction", name: "Flemish Satisfaction", value: 45, min: 0, max: 100, color: "#f59e0b" },
  { id: "walloon_satisfaction", name: "Walloon Satisfaction", value: 40, min: 0, max: 100, color: "#ef4444" },
  { id: "climate_progress", name: "Climate Goals", value: 35, min: 0, max: 100, color: "#22c55e" },
  { id: "government_stability", name: "Government Stability", value: 50, min: 0, max: 100, color: "#3b82f6" },
];

export const initialPolicies: Policy[] = [
  {
    id: "abolish_wage_indexation",
    title: "Abolish Wage Indexation",
    description: "End the automatic indexation of wages to inflation.",
    isActive: false,
    impacts: [
      { metricId: "budget", valueChange: -15 }, // Decreases deficit
      { metricId: "purchasing_power", valueChange: -20 },
      { metricId: "walloon_satisfaction", valueChange: -25 },
      { metricId: "flemish_satisfaction", valueChange: -10 },
    ],
  },
  {
    id: "road_pricing",
    title: "Implement Road Pricing",
    description: "Charge a per-kilometer fee for all passenger vehicles.",
    isActive: false,
    impacts: [
      { metricId: "budget", valueChange: -10 },
      { metricId: "climate", valueChange: +20 },
      { metricId: "purchasing_power", valueChange: -10 },
      { metricId: "flemish_satisfaction", valueChange: -15 },
      { metricId: "walloon_satisfaction", valueChange: -10 },
    ],
  },
  {
    id: "green_energy",
    title: "Massive Green Energy Subsidies",
    description: "Heavily subsidize solar and wind energy for households.",
    isActive: false,
    impacts: [
      { metricId: "budget", valueChange: +15 }, // Increases deficit
      { metricId: "climate", valueChange: +30 },
      { metricId: "purchasing_power", valueChange: +5 },
    ],
  },
  {
    id: "wealth_tax",
    title: "Wealth Tax Introduction",
    description: "Introduce a 1% annual tax on net wealth over 1 million euros.",
    isActive: false,
    impacts: [
      { metricId: "budget", valueChange: -20 },
      { metricId: "purchasing_power", valueChange: 0 },
      { metricId: "walloon_satisfaction", valueChange: +15 },
      { metricId: "flemish_satisfaction", valueChange: -5 },
    ],
  },
  {
    id: "state_reform",
    title: "7th State Reform",
    description: "Regionalize healthcare and labor market policies.",
    isActive: false,
    impacts: [
      { metricId: "flemish_satisfaction", valueChange: +25 },
      { metricId: "walloon_satisfaction", valueChange: -20 },
      { metricId: "budget", valueChange: +5 },
    ],
  },
];
