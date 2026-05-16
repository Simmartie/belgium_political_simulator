"use client";

import React from "react";
import { useSimulator } from "../context/SimulatorContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function MetricsDashboard() {
  const { currentMetrics } = useSimulator();

  // Filter out government_stability for the main chart
  const chartData = currentMetrics.filter((m) => m.id !== "government_stability");

  return (
    <div className="flex-1 p-6 lg:p-10 space-y-10 overflow-y-auto bg-black">
      {/* Main Chart Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#FFD700]" />
            Nationale Indicatoren
          </h2>
        </div>
        <Card className="bg-white/5 border-white/5 premium-shadow overflow-hidden">
          <CardContent className="p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }}
                  interval={0}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Metric Cards Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#ED2939]" />
            Status Overzicht
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentMetrics.map((metric) => (
            <Card key={metric.id} className="bg-white/5 border-white/5 hover:bg-white/[0.07] transition-all group relative overflow-hidden">
              {/* Belgian Accent corner */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-0 right-0 w-[150%] h-[150%] rotate-45 translate-x-1/2 -translate-y-1/2 flex flex-col">
                  <div className="h-1/3 bg-black" />
                  <div className="h-1/3 bg-[#FFD700]" />
                  <div className="h-1/3 bg-[#ED2939]" />
                </div>
              </div>

              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
                  {metric.name}
                  <span className="text-[10px] text-slate-600 font-mono">#{metric.id.toUpperCase()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter text-white">
                    {metric.value.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase">{metric.unit}</span>
                </div>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
                    style={{ 
                      width: `${((metric.value - metric.min) / (metric.max - metric.min)) * 100}%`,
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
