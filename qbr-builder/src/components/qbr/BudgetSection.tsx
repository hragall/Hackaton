"use client";

import { BudgetRow } from "@/types/qbr";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";

interface Props {
  budget: BudgetRow[];
  insight?: string;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(n);
}

export default function BudgetSection({ budget, insight }: Props) {
  if (!budget.length) return null;

  const totalBudgeted = budget.reduce((s, b) => s + b.budgeted, 0);
  const totalActual = budget.reduce((s, b) => s + b.actual, 0);
  const totalVariance = totalActual - totalBudgeted;

  const chartData = budget.map((b) => ({
    name: b.category.length > 12 ? b.category.slice(0, 12) + "…" : b.category,
    Variance: b.actual - b.budgeted,
    category: b.category,
  }));

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
        <span>💰</span> Budget Variance Analysis
      </h2>
      {insight && (
        <p className="text-sm text-gray-600 mb-4 bg-amber-50 border border-amber-100 rounded-lg p-3">{insight}</p>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Budgeted", value: totalBudgeted, color: "text-gray-700" },
          { label: "Total Actual", value: totalActual, color: "text-gray-700" },
          {
            label: "Net Variance",
            value: totalVariance,
            color: totalVariance <= 0 ? "text-emerald-600" : "text-red-500",
          },
        ].map((c) => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{c.label}</p>
            <p className={`text-lg font-bold ${c.color}`}>{fmt(c.value)}</p>
          </div>
        ))}
      </div>

      {/* Variance chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-500 mb-2 font-medium">Variance by Category (Actual − Budget)</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v)} />
            <Tooltip formatter={(v) => fmt(Number(v))} />
            <ReferenceLine y={0} stroke="#9ca3af" />
            <Bar dataKey="Variance" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.Variance <= 0 ? "#10b981" : "#f87171"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-700">Category</th>
              <th className="text-right p-3 font-semibold text-gray-700">Budgeted</th>
              <th className="text-right p-3 font-semibold text-gray-700">Actual</th>
              <th className="text-right p-3 font-semibold text-gray-700">Variance</th>
              <th className="text-right p-3 font-semibold text-gray-700">Variance %</th>
            </tr>
          </thead>
          <tbody>
            {budget.map((b, i) => {
              const variance = b.actual - b.budgeted;
              const variancePct = b.budgeted !== 0 ? (variance / b.budgeted) * 100 : 0;
              const positive = variance <= 0;
              return (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{b.category}</td>
                  <td className="p-3 text-right text-gray-600">{fmt(b.budgeted)}</td>
                  <td className="p-3 text-right font-semibold text-gray-800">{fmt(b.actual)}</td>
                  <td className={`p-3 text-right font-medium ${positive ? "text-emerald-600" : "text-red-500"}`}>
                    {variance > 0 ? "+" : ""}{fmt(variance)}
                  </td>
                  <td className={`p-3 text-right font-medium ${positive ? "text-emerald-600" : "text-red-500"}`}>
                    {variancePct > 0 ? "+" : ""}{variancePct.toFixed(1)}%
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
