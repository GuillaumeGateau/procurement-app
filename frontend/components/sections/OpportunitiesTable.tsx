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
  fitSummary?: string;
  fitPros?: string[];
  fitCons?: string[];
  referenceProjects?: { title: string; summary?: string }[];
  documents?: { title?: string; url: string }[];
  budget?: { currency?: string; min?: number; max?: number };
};

type OpportunitiesTableProps = {
  opportunities: Opportunity[];
  minScore: number;
};

type FilterState = {
  minScore: number;
  procurementType: string;
  budgetMin: number;
  search: string;
};

const ProcurementFilters = ["All", "RFP", "RFQ", "ITB", "EOI"];

const formatCurrency = (value?: number, currency = "USD") => {
  if (!value) return "—";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
};

export const OpportunitiesTable = ({ opportunities, minScore }: OpportunitiesTableProps) => {
  const [filters, setFilters] = useState<FilterState>({
    minScore,
    procurementType: "All",
    budgetMin: 0,
    search: "",
  });

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      if (opp.totalScore < filters.minScore) return false;
      if (filters.procurementType !== "All" && opp.procurementType !== filters.procurementType) return false;
       const maxBudget = opp.budget?.max ?? 0;
       if (filters.budgetMin > 0 && (!maxBudget || maxBudget < filters.budgetMin)) return false;
       if (filters.search.trim()) {
         const haystack = [
           opp.title,
           opp.agency,
           opp.country,
           opp.fitSummary,
           ...(opp.fitPros ?? []),
           ...(opp.referenceProjects?.map((project) => project.title) ?? []),
         ]
           .join(" ")
           .toLowerCase();
         if (!haystack.includes(filters.search.trim().toLowerCase())) return false;
       }
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
              Showing tenders evaluated with structured and semantic fit to Macmillan Keck’s expertise. Adjust filters or
              search to refine.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="search"
              placeholder="Search opportunities…"
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              className="w-full rounded-full border border-ocean/20 bg-white/80 px-4 py-2 text-sm text-muted focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20 md:w-64"
            />
            <div className="flex flex-wrap items-center gap-3">
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
              <div className="rounded-full border border-ocean/20 bg-white/70 px-4 py-2 text-sm text-muted">
                <label className="mr-2 font-medium text-slate">Budget min (USD)</label>
                <input
                  type="number"
                  value={filters.budgetMin}
                  onChange={(event) => setFilters((prev) => ({ ...prev, budgetMin: Number(event.target.value) }))}
                  className="w-24 rounded-md border border-ocean/30 px-2 py-1 text-right"
                  min={0}
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
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/60 shadow-card">
          <table className="min-w-full divide-y divide-slate/10 bg-white">
            <thead className="bg-ocean/5 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate">Opportunity</th>
                <th className="px-6 py-3 font-semibold text-slate">Budget</th>
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
                  <td className="px-6 py-4 text-sm text-muted">
                    {opp.budget ? (
                      <div className="space-y-1">
                        <div>{formatCurrency(opp.budget.min, opp.budget.currency)}</div>
                        <div className="text-xs text-slate/70">
                          up to {formatCurrency(opp.budget.max, opp.budget.currency)}
                        </div>
                      </div>
                    ) : (
                      "—"
                    )}
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
                      {opp.fitSummary ? <p className="text-sm leading-relaxed text-muted">{opp.fitSummary}</p> : null}
                      {opp.referenceProjects && opp.referenceProjects.length > 0 ? (
                        <div className="space-y-1 text-xs text-muted">
                          <p className="font-semibold text-slate">Similar work</p>
                          <ul className="space-y-1">
                            {opp.referenceProjects.slice(0, 2).map((project) => (
                              <li key={`${opp.id}-${project.title}`} className="leading-relaxed">
                                <span className="font-medium text-ocean">{project.title}</span>
                                {project.summary ? <> — {project.summary.slice(0, 160)}...</> : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {opp.fitPros && opp.fitPros.length ? (
                        <div className="space-y-1 text-xs text-muted">
                          <p className="font-semibold text-slate">Strengths</p>
                          <ul className="list-disc space-y-1 pl-4">
                            {opp.fitPros.map((pro) => (
                              <li key={`${opp.id}-pro-${pro.slice(0, 24)}`}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {opp.fitCons && opp.fitCons.length ? (
                        <div className="space-y-1 text-xs text-muted">
                          <p className="font-semibold text-slate">Risks / requirements</p>
                          <ul className="list-disc space-y-1 pl-4">
                            {opp.fitCons.map((con) => (
                              <li key={`${opp.id}-con-${con.slice(0, 24)}`}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {opp.documents && opp.documents.length ? (
                        <div className="space-y-1 text-xs text-muted">
                          <p className="font-semibold text-slate">Key references</p>
                          <ul className="space-y-1">
                            {opp.documents.map((doc, index) => (
                              <li key={`${opp.id}-doc-${index}`}>
                                <a
                                  href={doc.url}
                                  className="text-ocean hover:underline"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {doc.title ?? "Supporting document"}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
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


