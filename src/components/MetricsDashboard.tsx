"use client";

import React from "react";
import { useSimulator } from "../context/SimulatorContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import ProvinceMap from "./map/ProvinceMap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

export default function MetricsDashboard() {
  const { currentMetrics, currentProvinces, flemishSatisfaction, walloonSatisfaction, activePolicies } = useSimulator();
  const latestPolicy = activePolicies[0];

  // Filter out government_stability for the main chart, and map it so we show regional satisfaction
  const chartData = [
    ...currentMetrics
      .filter((m) => m.id !== "flemish_satisfaction" && m.id !== "walloon_satisfaction" && m.id !== "government_stability")
      .map(m => ({ 
        name: m.name, 
        value: m.value, 
        color: m.color,
        shift: latestPolicy?.shifts?.[m.id] || 0
      })),
    { name: "Flemish Satisfaction", value: flemishSatisfaction, color: "#d97706", shift: flemishSatisfaction },
    { name: "Walloon Satisfaction", value: walloonSatisfaction, color: "#ef4444", shift: walloonSatisfaction },
  ];

  return (
    <div className="flex-1 p-6 lg:p-10 space-y-10 overflow-y-scroll bg-transparent">
      {/* Main Chart Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#2B2B2C] flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#FFD700]" />
            Nationale Indicatoren
          </h2>
        </div>
        <Card className="bg-white border-black/5 premium-shadow overflow-hidden">
          <CardContent className="p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#2B2B2C", fontSize: 10, fontWeight: 800, dy: 10 }}
                  interval={0}
                  height={60}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#2B2B2C", fontSize: 10 }}
                  padding={{ top: 20, bottom: 20 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="shift" 
                    content={(props: any) => {
                      const { x, y, width, height, value } = props;
                      if (value === undefined || value === null || value === 0) return null;
                      
                      const numValue = Number(value);
                      const isShiftPositive = numValue > 0;
                      
                      // Robust positioning:
                      // Top edge of the bar is always min(y, y + height)
                      // Bottom edge of the bar is always max(y, y + height)
                      const topEdge = Math.min(y, y + height);
                      const bottomEdge = Math.max(y, y + height);
                      
                      // If the shift is positive, we usually want it above. 
                      // But the bar direction is the primary decider for "outside".
                      // If the bar value is positive (topEdge < axis), we go above.
                      // If the bar value is negative (bottomEdge > axis), we go below.
                      // We'll use the shift value as a proxy if payload.value isn't easily accessible,
                      // but for regional metrics, shift IS the value.
                      const yPos = numValue >= 0 ? topEdge - 10 : bottomEdge + 15;
                      
                      return (
                        <text 
                          x={x + width / 2} 
                          y={yPos} 
                          fill={isShiftPositive ? "#15803d" : "#b91c1c"} 
                          textAnchor="middle" 
                          fontSize={10} 
                          fontWeight="bold"
                        >
                          {isShiftPositive ? `+${numValue.toFixed(1)}` : numValue.toFixed(1)}
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Map Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#2B2B2C] flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#3b82f6]" />
            Regionale Steun
          </h2>
        </div>
        <Card className="bg-white border-black/5 premium-shadow overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <ProvinceMap />
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-[#d97706] flex items-center gap-3">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_Flanders.svg" 
                            alt="Vlaamse vlag" 
                            className="w-8 h-auto border border-black/5 shadow-sm"
                          />
                          Vlaanderen
                        </h3>
                        <div className="text-4xl font-black text-slate-900">{flemishSatisfaction.toFixed(1)}%</div>
                        {latestPolicy?.provinceExplanations?.flanders && (
                          <p className="text-xs text-amber-600 mt-2 italic leading-relaxed">
                            "{latestPolicy.provinceExplanations.flanders}"
                          </p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-[#ef4444] flex items-center gap-3">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Wallonia.svg" 
                            alt="Waalse vlag" 
                            className="w-8 h-auto border border-black/5 shadow-sm"
                          />
                          Wallonië
                        </h3>
                        <div className="text-4xl font-black text-slate-900">{walloonSatisfaction.toFixed(1)}%</div>
                        {latestPolicy?.provinceExplanations?.wallonia && (
                          <p className="text-xs text-red-500 mt-2 italic leading-relaxed">
                            "{latestPolicy.provinceExplanations.wallonia}"
                          </p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-[#3b82f6] flex items-center gap-3">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_the_Brussels-Capital_Region.svg" 
                            alt="Brusselse vlag" 
                            className="w-8 h-auto border border-black/5 shadow-sm"
                          />
                          Brussel
                        </h3>
                        <div className="text-4xl font-black text-slate-900">{(currentProvinces.bruxelles).toFixed(1)}%</div>
                        {latestPolicy?.provinceExplanations?.brussels && (
                          <p className="text-xs text-blue-500 mt-2 italic leading-relaxed">
                            "{latestPolicy.provinceExplanations.brussels}"
                          </p>
                        )}
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Metric Cards Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#2B2B2C] flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#ED2939]" />
            Status Overzicht
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentMetrics.map((metric) => (
            <Card key={metric.id} className="bg-white border-black/10 hover:border-black/20 transition-all group relative overflow-hidden premium-shadow">
              {/* Belgian Accent Strip */}
              <div className="absolute top-0 left-0 bottom-0 w-1 flex flex-col pointer-events-none">
                <div className="flex-1 bg-slate-950" />
                <div className="flex-1 bg-[#FFD700]" />
                <div className="flex-1 bg-[#ED2939]" />
              </div>

              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-[#2B2B2C] flex items-center justify-between">
                  {metric.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tighter text-slate-900">
                      {metric.value.toFixed(1)}
                    </span>
                    <span className="text-xs font-bold text-[#2B2B2C] uppercase">{metric.unit}</span>
                  </div>
                  {latestPolicy?.shifts?.[metric.id] !== undefined && (
                    <div className={`text-xs font-black px-2 py-1 rounded ${
                      latestPolicy.shifts[metric.id]! > 0 ? 'bg-green-100 text-green-700' : 
                      latestPolicy.shifts[metric.id]! < 0 ? 'bg-red-100 text-red-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {latestPolicy.shifts[metric.id]! > 0 ? '+' : ''}{latestPolicy.shifts[metric.id]!.toFixed(1)}
                    </div>
                  )}
                </div>

                {latestPolicy?.metricExplanations?.[metric.id] && (
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-600 font-medium italic border-l-2 border-slate-200 pl-3">
                    {latestPolicy.metricExplanations[metric.id]}
                  </p>
                )}

                <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 ease-out" 
                    style={{ 
                      width: `${Math.max(0, Math.min(100, ((metric.value - metric.min) / (metric.max - metric.min)) * 100))}%`,
                      backgroundColor: metric.color
                    }} 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
