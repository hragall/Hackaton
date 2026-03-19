import Papa from "papaparse";
import { KPIRow, OKRRow, BudgetRow } from "@/types/qbr";

type RawRow = Record<string, string>;

function num(val: string | undefined): number {
  if (!val) return 0;
  return parseFloat(val.replace(/[^0-9.-]/g, "")) || 0;
}

export function parseKPICSV(csv: string): KPIRow[] {
  const { data } = Papa.parse<RawRow>(csv, { header: true, skipEmptyLines: true });
  return data.map((row) => ({
    metric: row["metric"] || row["Metric"] || row["name"] || row["Name"] || "",
    target: num(row["target"] || row["Target"]),
    actual: num(row["actual"] || row["Actual"]),
    unit: row["unit"] || row["Unit"] || "",
    period: row["period"] || row["Period"] || "",
  })).filter((r) => r.metric);
}

export function parseOKRCSV(csv: string): OKRRow[] {
  const { data } = Papa.parse<RawRow>(csv, { header: true, skipEmptyLines: true });
  return data.map((row) => ({
    objective: row["objective"] || row["Objective"] || "",
    keyResult: row["key_result"] || row["key result"] || row["Key Result"] || row["keyResult"] || "",
    target: num(row["target"] || row["Target"]),
    actual: num(row["actual"] || row["Actual"]),
    unit: row["unit"] || row["Unit"] || "%",
  })).filter((r) => r.objective);
}

export function parseBudgetCSV(csv: string): BudgetRow[] {
  const { data } = Papa.parse<RawRow>(csv, { header: true, skipEmptyLines: true });
  return data.map((row) => ({
    category: row["category"] || row["Category"] || row["name"] || row["Name"] || "",
    budgeted: num(row["budgeted"] || row["Budgeted"] || row["budget"] || row["Budget"]),
    actual: num(row["actual"] || row["Actual"]),
    period: row["period"] || row["Period"] || "",
  })).filter((r) => r.category);
}

export function detectCSVType(csv: string): "kpi" | "okr" | "budget" | "unknown" {
  const header = csv.split("\n")[0].toLowerCase();
  if (header.includes("objective") || header.includes("key_result") || header.includes("key result")) return "okr";
  if (header.includes("budget") || header.includes("budgeted") || header.includes("variance")) return "budget";
  if (header.includes("metric") || header.includes("kpi")) return "kpi";
  return "unknown";
}
