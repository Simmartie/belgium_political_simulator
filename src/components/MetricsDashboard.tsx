"use client";

import React from "react";
import { useSimulator } from "../context/SimulatorContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

export default function MetricsDashboard() {
  const { baseMetrics, currentMetrics } = useSimulator();

  const chartData = baseMetrics
    .filter((base) => base.id !== "government_stability")
    .map((base) => {
      const current = currentMetrics.find((m) => m.id === base.id);
      return {
        name: base.name,
        Base: base.value,
        Current: current?.value || 0,
        color: base.color,
      };
    });

  const displayMetrics = currentMetrics.filter(m => m.id !== "government_stability");

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle>Metrics Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                  itemStyle={{ color: "#f8fafc" }}
                />
                <Legend />
                <Bar dataKey="Base" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Current" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayMetrics.map((metric) => {
            const base = baseMetrics.find((m) => m.id === metric.id);
            const diff = metric.value - (base?.value || 0);
            
            return (
              <Card key={metric.id} className="bg-slate-900 border-slate-800 text-slate-100">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-slate-300">
                      {metric.name}
                    </CardTitle>
                    <span className="text-2xl font-bold">
                      {metric.value}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={metric.value} className="h-2 bg-slate-800" indicatorClassName="bg-blue-500" />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>0</span>
                      <span className={`font-medium ${diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : ""}`}>
                        {diff > 0 ? `+${diff}` : diff < 0 ? diff : "No change"}
                      </span>
                      <span>100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
