"use client";

interface Props {
  summary: string;
  recommendations: string;
  company?: string;
  quarter?: string;
}

export default function ExecutiveSummary({ summary, recommendations, company, quarter }: Props) {
  return (
    <section className="mb-10">
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white rounded-2xl p-6 mb-6">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Quarterly Business Review</p>
        <h1 className="text-2xl font-bold mb-1">{company || "Company"}</h1>
        <p className="text-slate-300">{quarter || "Q — Current Quarter"}</p>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span>📝</span> Executive Summary
      </h2>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        {summary.split("\n\n").map((para, i) => (
          <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0">{para}</p>
        ))}
      </div>

      {recommendations && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>💡</span> Recommendations
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            {recommendations.split("\n").filter(Boolean).map((rec, i) => (
              <p key={i} className="text-sm text-gray-700 leading-relaxed mb-2 last:mb-0">
                {rec.startsWith("•") || rec.startsWith("-") ? rec : `• ${rec}`}
              </p>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
