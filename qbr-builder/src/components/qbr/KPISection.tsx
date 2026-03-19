"use client";

import { KPIRow } from "@/types/qbr";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";

interface Props {
  kpis: KPIRow[];
  insight?: string;
}

export default function KPISection({ kpis, insight }: Props) {
  if (!kpis.length) return null;

  const chartData = kpis.map((k) => ({
    name: k.metric.length > 15 ? k.metric.slice(0, 15) + "…" : k.metric,
    Target: k.target,
    Actual: k.actual,
    unit: k.unit || "",
  }));

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
        <span>📊</span> KPI Performance
      </h2>
      {insight && (
        <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3">{insight}</p>
      )}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Actual" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.Actual >= entry.Target ? "#10b981" : "#f87171"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-700">Metric</th>
              <th className="text-right p-3 font-semibold text-gray-700">Target</th>
              <th className="text-right p-3 font-semibold text-gray-700">Actual</th>
              <th className="text-right p-3 font-semibold text-gray-700">vs Target</th>
              <th className="text-center p-3 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {kpis.map((k, i) => {
              const delta = k.target !== 0 ? ((k.actual - k.target) / k.target) * 100 : 0;
              const met = k.actual >= k.target;
              return (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{k.metric}</td>
                  <td className="p-3 text-right text-gray-600">{k.target}{k.unit}</td>
                  <td className="p-3 text-right font-semibold text-gray-800">{k.actual}{k.unit}</td>
                  <td className={`p-3 text-right font-medium ${met ? "text-emerald-600" : "text-red-500"}`}>
                    {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${met ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                      {met ? "On Track" : "Off Track"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
