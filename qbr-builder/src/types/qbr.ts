export interface KPIRow {
  metric: string;
  target: number;
  actual: number;
  unit?: string;
  period?: string;
}

export interface OKRRow {
  objective: string;
  keyResult: string;
  target: number;
  actual: number;
  unit?: string;
}

export interface BudgetRow {
  category: string;
  budgeted: number;
  actual: number;
  period?: string;
}

export interface QBRData {
  kpis: KPIRow[];
  okrs: OKRRow[];
  budget: BudgetRow[];
  quarter?: string;
  company?: string;
}

export interface QBRInsights {
  executiveSummary: string;
  kpiInsights: string;
  okrInsights: string;
  budgetInsights: string;
  recommendations: string;
}

export interface QBRReport {
  data: QBRData;
  insights: QBRInsights;
  generatedAt: string;
}
