import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { QBRData, QBRInsights } from "@/types/qbr";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { data: QBRData };
    const { data } = body;

    const kpiSummary = data.kpis
      .map((k) => `- ${k.metric}: target=${k.target}${k.unit}, actual=${k.actual}${k.unit}`)
      .join("\n");

    const okrSummary = data.okrs
      .map((o) => `- Objective: "${o.objective}" | Key Result: "${o.keyResult}" | target=${o.target}${o.unit}, actual=${o.actual}${o.unit}`)
      .join("\n");

    const budgetSummary = data.budget
      .map((b) => `- ${b.category}: budgeted=${b.budgeted}, actual=${b.actual}, variance=${b.actual - b.budgeted}`)
      .join("\n");

    const prompt = `You are a business analyst writing a Quarterly Business Review (QBR) for ${data.company || "the company"} — ${data.quarter || "Q"}.

Based on the following data, generate concise, professional QBR insights.

## KPIs
${kpiSummary || "No KPI data provided."}

## OKRs
${okrSummary || "No OKR data provided."}

## Budget Variance
${budgetSummary || "No budget data provided."}

Respond in valid JSON with these exact keys:
{
  "executiveSummary": "2-3 paragraph executive summary highlighting overall performance, wins, and concerns",
  "kpiInsights": "2-3 sentences analyzing KPI performance, calling out over/underperformance",
  "okrInsights": "2-3 sentences on OKR progress and key results status",
  "budgetInsights": "2-3 sentences on budget variance, biggest overruns or savings",
  "recommendations": "3-5 bullet points (as a single string) with actionable recommendations for next quarter"
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Claude response");
    }

    const insights: QBRInsights = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      { error: "Failed to generate insights. Check your ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }
}
