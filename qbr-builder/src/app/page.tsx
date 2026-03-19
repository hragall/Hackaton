"use client";

import { useState, useCallback } from "react";
import CSVUploader from "@/components/qbr/CSVUploader";
import ExecutiveSummary from "@/components/qbr/ExecutiveSummary";
import KPISection from "@/components/qbr/KPISection";
import OKRSection from "@/components/qbr/OKRSection";
import BudgetSection from "@/components/qbr/BudgetSection";
import { parseKPICSV, parseOKRCSV, parseBudgetCSV } from "@/lib/csvParser";
import { QBRData, QBRInsights } from "@/types/qbr";

type Step = "upload" | "report";

const EMPTY_INSIGHTS: QBRInsights = {
  executiveSummary: "",
  kpiInsights: "",
  okrInsights: "",
  budgetInsights: "",
  recommendations: "",
};

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [data, setData] = useState<QBRData>({ kpis: [], okrs: [], budget: [] });
  const [insights, setInsights] = useState<QBRInsights>(EMPTY_INSIGHTS);
  const [company, setCompany] = useState("");
  const [quarter, setQuarter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleKPIUpload = useCallback((csv: string) => {
    setData((d) => ({ ...d, kpis: parseKPICSV(csv) }));
  }, []);

  const handleOKRUpload = useCallback((csv: string) => {
    setData((d) => ({ ...d, okrs: parseOKRCSV(csv) }));
  }, []);

  const handleBudgetUpload = useCallback((csv: string) => {
    setData((d) => ({ ...d, budget: parseBudgetCSV(csv) }));
  }, []);

  const hasData = data.kpis.length > 0 || data.okrs.length > 0 || data.budget.length > 0;

  async function generateReport() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { ...data, company, quarter } }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate insights");
      }
      const json = await res.json();
      setInsights(json.insights);
      setStep("report");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleExportPDF() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h1 className="font-bold text-gray-900">QBR Builder</h1>
              <p className="text-xs text-gray-500">Quarterly Business Review Generator</p>
            </div>
          </div>
          {step === "report" && (
            <div className="flex gap-2">
              <button
                onClick={() => { setStep("upload"); setInsights(EMPTY_INSIGHTS); }}
                className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 cursor-pointer"
              >
                ← New Report
              </button>
              <button
                onClick={handleExportPDF}
                className="text-sm px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 font-medium cursor-pointer"
              >
                Export PDF
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Step: Upload */}
        {step === "upload" && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Your QBR</h2>
              <p className="text-gray-500">Upload your CSV files and let AI generate the report.</p>
            </div>

            {/* Company info */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Report Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Company / Team Name</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Quarter</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Q1 2025"
                    value={quarter}
                    onChange={(e) => setQuarter(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* CSV uploaders */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-800">Upload Data Files</h3>
              <CSVUploader
                label="KPI Data"
                description="CSV with columns: metric, target, actual, unit (optional)"
                example="metric,target,actual,unit"
                onUpload={handleKPIUpload}
                uploaded={data.kpis.length > 0}
              />
              <CSVUploader
                label="OKR / Goals Data"
                description="CSV with columns: objective, key_result, target, actual, unit"
                example="objective,key_result,target,actual,unit"
                onUpload={handleOKRUpload}
                uploaded={data.okrs.length > 0}
              />
              <CSVUploader
                label="Budget Data"
                description="CSV with columns: category, budgeted, actual"
                example="category,budgeted,actual"
                onUpload={handleBudgetUpload}
                uploaded={data.budget.length > 0}
              />
            </div>

            {/* Upload summary */}
            {hasData && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 text-sm text-gray-600">
                Loaded:{" "}
                {data.kpis.length > 0 && <span className="font-medium text-gray-800 mr-3">✓ {data.kpis.length} KPIs</span>}
                {data.okrs.length > 0 && <span className="font-medium text-gray-800 mr-3">✓ {data.okrs.length} Key Results</span>}
                {data.budget.length > 0 && <span className="font-medium text-gray-800">✓ {data.budget.length} Budget lines</span>}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">{error}</div>
            )}

            <button
              onClick={generateReport}
              disabled={!hasData || loading}
              className="w-full py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating with Claude AI…
                </>
              ) : (
                "Generate QBR Report →"
              )}
            </button>

            {/* Example data hint */}
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
              <p className="font-semibold mb-1">💡 Don&apos;t have CSV files yet?</p>
              <p>Use the example format shown under each uploader. You can create CSVs in Excel, Google Sheets, or any text editor.</p>
            </div>
          </div>
        )}

        {/* Step: Report */}
        {step === "report" && (
          <div id="qbr-report">
            <ExecutiveSummary
              summary={insights.executiveSummary}
              recommendations={insights.recommendations}
              company={company}
              quarter={quarter}
            />
            <KPISection kpis={data.kpis} insight={insights.kpiInsights} />
            <OKRSection okrs={data.okrs} insight={insights.okrInsights} />
            <BudgetSection budget={data.budget} insight={insights.budgetInsights} />
          </div>
        )}
      </main>
    </div>
  );
}
