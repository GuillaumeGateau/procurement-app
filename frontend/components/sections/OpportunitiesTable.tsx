import { useMemo, useState } from "react";
import clsx from "clsx";
import { Tag } from "@ui/Tag";

export type Opportunity = {
  id: string;
  title: string;
  agency?: string;
  country?: string;
  procurementType?: string;
  deadline?: string;
  totalScore: number;
  structuredScore: number;
  semanticScore?: number;
  semanticMatches?: {
    score: number;
    sourceTitle?: string;
    sourceUrl?: string;
  }[];
  fitExplanation?: string;
};

type OpportunitiesTableProps = {
  opportunities: Opportunity[];
  minScore: number;
};

type FilterState = {
  minScore: number;
  procurementType: string;
};

const ProcurementFilters = ["All", "RFP", "RFQ", "ITB", "EOI"];

export const OpportunitiesTable = ({ opportunities, minScore }: OpportunitiesTableProps) => {
  const [filters, setFilters] = useState<FilterState>({
    minScore,
    procurementType: "All",
  });

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      if (opp.totalScore < filters.minScore) return false;
      if (filters.procurementType !== "All" && opp.procurementType !== filters.procurementType) return false;
      return true;
    });
  }, [opportunities, filters]);

  return (
    <section className="py-16">
      <div className="container-responsive space-y-6">
        <div className="section-divider" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-heading text-slate">Opportunities aligned to our strengths</h2>
            <p className="mt-2 text-muted">
              Showing tenders evaluated above {filters.minScore} with semantic and structured fit to Macmillan Keck’s
              expertise.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-ocean/20 bg-white/70 px-4 py-2 text-sm text-muted">
              <label className="mr-2 font-medium text-slate">Minimum score</label>
              <input
                type="number"
                value={filters.minScore}
                onChange={(event) => setFilters((prev) => ({ ...prev, minScore: Number(event.target.value) }))}
                className="w-16 rounded-md border border-ocean/30 px-2 py-1 text-right"
                min={0}
                max={100}
              />
            </div>
            <div className="flex gap-2">
              {ProcurementFilters.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters((prev) => ({ ...prev, procurementType: type }))}
                  className={clsx(
                    "rounded-full border px-3 py-1 text-sm transition-colors",
                    filters.procurementType === type
                      ? "border-ocean bg-ocean text-white shadow"
                      : "border-ocean/20 bg-white/80 text-muted hover:border-ocean/60 hover:text-slate"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/60 shadow-card">
          <table className="min-w-full divide-y divide-slate/10 bg-white">
            <thead className="bg-ocean/5 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate">Opportunity</th>
                <th className="px-6 py-3 font-semibold text-slate">Scores</th>
                <th className="px-6 py-3 font-semibold text-slate">Fit Rationale</th>
                <th className="px-6 py-3 font-semibold text-slate">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10 text-sm text-slate">
              {filtered.map((opp) => (
                <tr key={opp.id} className="hover:bg-cream/60">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate">{opp.title}</span>
                      <div className="flex flex-wrap gap-2 text-xs text-muted">
                        {opp.agency ? <Tag label={opp.agency} tone="muted" /> : null}
                        {opp.procurementType ? <Tag label={opp.procurementType} tone="muted" /> : null}
                        {opp.country ? <Tag label={opp.country} tone="muted" /> : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{opp.totalScore}</span>
                        <span className="text-xs text-muted">Total</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span>{opp.structuredScore}</span>
                        <span>Structured</span>
                        {opp.semanticScore !== undefined ? (
                          <>
                            <span className="text-slate">/</span>
                            <span>{Math.round((opp.semanticScore ?? 0) * 100)}</span>
                            <span>Semantic</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      {opp.fitExplanation ? (
                        <p className="text-xs text-muted leading-relaxed">{opp.fitExplanation}</p>
                      ) : null}
                      <ul className="space-y-2 text-xs text-muted">
                        {(opp.semanticMatches || []).slice(0, 2).map((match, index) => (
                          <li key={`${opp.id}-match-${index}`} className="leading-relaxed">
                            <span className="font-semibold text-ocean">{Math.round(match.score * 100)}%</span> ·{" "}
                            {match.sourceUrl ? (
                              <a href={match.sourceUrl} className="hover:underline" target="_blank" rel="noreferrer">
                                {match.sourceTitle ?? "Publication"}
                              </a>
                            ) : (
                              match.sourceTitle ?? "Publication"
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 ? (
            <div className="border-t border-slate/10 bg-white py-10 text-center text-sm text-muted">
              No opportunities meet the current filters yet. Try lowering the score threshold or expanding procurement
              types.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};


