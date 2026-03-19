"use client";

import { OKRRow } from "@/types/qbr";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  okrs: OKRRow[];
  insight?: string;
}

function ProgressBar({ value, target }: { value: number; target: number }) {
  const pct = Math.min(100, target > 0 ? (value / target) * 100 : 0);
  const color = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#f87171";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-medium w-10 text-right" style={{ color }}>{pct.toFixed(0)}%</span>
    </div>
  );
}

export default function OKRSection({ okrs, insight }: Props) {
  if (!okrs.length) return null;

  // Group by objective
  const grouped = okrs.reduce<Record<string, OKRRow[]>>((acc, row) => {
    if (!acc[row.objective]) acc[row.objective] = [];
    acc[row.objective].push(row);
    return acc;
  }, {});

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
        <span>🎯</span> Goals & OKRs Review
      </h2>
      {insight && (
        <p className="text-sm text-gray-600 mb-4 bg-purple-50 border border-purple-100 rounded-lg p-3">{insight}</p>
      )}
      <div className="space-y-5">
        {Object.entries(grouped).map(([objective, results]) => {
          const avgPct =
            results.reduce((s, r) => s + (r.target > 0 ? (r.actual / r.target) * 100 : 0), 0) /
            results.length;
          const color = avgPct >= 80 ? "#10b981" : avgPct >= 50 ? "#f59e0b" : "#f87171";

          return (
            <div key={objective} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-sm">{objective}</h3>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: color + "20", color }}
                >
                  {avgPct.toFixed(0)}% overall
                </span>
              </div>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{r.keyResult}</span>
                      <span className="font-medium">
                        {r.actual}{r.unit} / {r.target}{r.unit}
                      </span>
                    </div>
                    <ProgressBar value={r.actual} target={r.target} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
