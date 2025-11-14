import Link from "next/link";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { Tag } from "@ui/Tag";
import { sectorThemes, defaultTheme } from "@lib/themes";

export type Opportunity = {
  id: string;
  title: string;
  agency?: string;
  country?: string;
  countryCode?: string;
  region?: string;
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
  sector?: string;
  technologies?: string[];
  searchEmbedding?: number[];
  searchScore?: number;
  budget?: { currency?: string; min?: number; max?: number; isEstimated?: boolean; estimateSource?: string };
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
  country: string;
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
    country: "All",
  });

  const countryOptions = useMemo(() => {
    const unique = new Set<string>();
    opportunities.forEach((opp) => {
      if (opp.country) {
        unique.add(opp.country);
      }
    });
    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [opportunities]);

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      if (opp.totalScore < filters.minScore) return false;
      if (filters.procurementType !== "All" && opp.procurementType !== filters.procurementType) return false;
      if (filters.country !== "All" && (opp.country ?? "").toLowerCase() !== filters.country.toLowerCase()) return false;
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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading text-slate">Opportunities aligned to our strengths</h2>
            <p className="max-w-2xl text-sm text-muted">
              We surface tenders where Macmillan Keck’s structured profile and semantic evidence suggest a strong fit. Use
              search and filters to narrow in on the most relevant opportunities.
            </p>
          </div>

          <div className="w-full max-w-lg space-y-3 rounded-2xl border border-slate/10 bg-white/80 p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1 space-y-1 text-sm text-slate">
                <span className="text-xs uppercase tracking-wide text-slate/60">Country</span>
                <select
                  value={filters.country}
                  onChange={(event) => setFilters((prev) => ({ ...prev, country: event.target.value }))}
                  className="w-full appearance-none rounded-xl border border-slate/20 bg-white px-3 py-2 text-sm text-slate shadow-inner focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
                >
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex-1 space-y-1 text-sm text-slate">
                <span className="text-xs uppercase tracking-wide text-slate/60">Minimum score</span>
                <input
                  type="number"
                  value={filters.minScore}
                  onChange={(event) => setFilters((prev) => ({ ...prev, minScore: Number(event.target.value) }))}
                  className="w-full rounded-xl border border-slate/20 bg-white px-3 py-2 text-sm text-slate shadow-inner focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
                  min={0}
                  max={100}
                />
              </label>
              <label className="flex-1 space-y-1 text-sm text-slate">
                <span className="text-xs uppercase tracking-wide text-slate/60">Budget min (USD)</span>
                <input
                  type="number"
                  value={filters.budgetMin}
                  onChange={(event) => setFilters((prev) => ({ ...prev, budgetMin: Number(event.target.value) }))}
                  className="w-full rounded-xl border border-slate/20 bg-white px-3 py-2 text-sm text-slate shadow-inner focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
                  min={0}
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {ProcurementFilters.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters((prev) => ({ ...prev, procurementType: type }))}
                  className={clsx(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    filters.procurementType === type
                      ? "border-ocean bg-ocean text-white shadow-sm"
                      : "border border-slate/20 bg-white text-slate hover:border-ocean/40 hover:text-ocean"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <label className="block text-sm text-slate">
          <span className="text-xs uppercase tracking-wide text-slate/60">Search opportunities</span>
          <input
            type="search"
            placeholder="Search by title, agency, country, or strengths…"
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-slate/20 bg-white px-4 py-3 text-base text-slate shadow-inner focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
          />
        </label>

        <div className="space-y-6">
          {filtered.map((opp) => {
            const theme = opp.sector ? sectorThemes[opp.sector] ?? defaultTheme : defaultTheme;

            return (
              <article
                key={opp.id}
                className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-card transition-shadow duration-200 hover:shadow-[0_20px_44px_rgba(15,23,42,0.12)]"
                style={{ borderColor: `${theme.color}40` }}
              >
                <header
                  className={clsx(
                    "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-slate",
                    `shadow-[0_10px_30px_${theme.color}20]`
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{theme.icon}</span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate/60">Theme</p>
                      <p className="text-sm font-semibold text-slate">{opp.sector ?? "Strategic engagement"}</p>
                    </div>
                  </div>
                  {opp.technologies && opp.technologies.length ? (
                    <div className="text-xs text-slate/70">
                      {opp.technologies.join(" · ")}
                    </div>
                  ) : null}
                </header>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-4">
                  <header className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate">{opp.title}</h3>
                      <Link
                        href={`/opportunities/${opp.id}/draft`}
                        className="rounded-full border border-ocean/30 bg-ocean/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ocean transition-colors hover:bg-ocean hover:text-white"
                      >
                        Draft expression of interest
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted">
                      {opp.agency ? <Tag label={opp.agency} tone="muted" /> : null}
                      {opp.procurementType ? <Tag label={opp.procurementType} tone="muted" /> : null}
                      {opp.country ? <Tag label={opp.country} tone="muted" /> : null}
                    </div>
                  </header>

                  {opp.fitSummary ? <p className="text-sm leading-relaxed text-slate">{opp.fitSummary}</p> : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    {opp.referenceProjects && opp.referenceProjects.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate">
                          Similar work
                        </p>
                        <ul className="space-y-1 text-xs text-muted">
                          {opp.referenceProjects.slice(0, 2).map((project) => (
                            <li key={`${opp.id}-${project.title}`} className="line-clamp-2 leading-relaxed">
                              <span className="font-medium text-ocean">{project.title}</span>
                              {project.summary ? <> — {project.summary}</> : null}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {opp.documents && opp.documents.length ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate">
                          Key references
                        </p>
                        <ul className="space-y-1 text-xs text-ocean">
                          {opp.documents.map((doc, index) => (
                            <li key={`${opp.id}-doc-${index}`}>
                              <a href={doc.url} className="hover:underline" target="_blank" rel="noreferrer">
                                {doc.title ?? "Supporting document"}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {opp.fitPros && opp.fitPros.length ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate">
                          Strengths
                        </p>
                        <ul className="space-y-1 text-xs text-muted">
                          {opp.fitPros.map((pro) => (
                            <li key={`${opp.id}-pro-${pro.slice(0, 24)}`} className="line-clamp-2">
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {opp.fitCons && opp.fitCons.length ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate">
                          Risks / requirements
                        </p>
                        <ul className="space-y-1 text-xs text-muted">
                          {opp.fitCons.map((con) => (
                            <li key={`${opp.id}-con-${con.slice(0, 24)}`} className="line-clamp-2">
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>

                <aside className="w-full max-w-xs space-y-4 rounded-2xl border border-slate/10 bg-white/80 p-4 text-sm text-muted">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate/70">
                      {opp.budget?.isEstimated ? "Estimated budget" : "Budget"}
                    </p>
                    {opp.budget && (opp.budget.min || opp.budget.max) ? (
                      <>
                        <p className="text-lg font-semibold text-slate">
                          {formatCurrency(opp.budget.min ?? opp.budget.max, opp.budget.currency)}
                          {opp.budget.max && opp.budget.max !== opp.budget.min ? (
                            <span className="text-xs text-muted">
                              {" "}
                              – {formatCurrency(opp.budget.max, opp.budget.currency)}
                            </span>
                          ) : null}
                        </p>
                        {opp.budget.isEstimated && opp.budget.estimateSource ? (
                          <p className="text-xs text-muted">Derived from {opp.budget.estimateSource}</p>
                        ) : null}
                      </>
                    ) : (
                      <p className="text-sm">Not specified</p>
                    )}
                  </div>

                  {opp.technologies && opp.technologies.length ? (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate/70">Technologies</p>
                      <ul className="space-y-1 text-xs text-slate">
                        {opp.technologies.map((tech) => (
                          <li key={`${opp.id}-tech-${tech}`}>{tech}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate/70">Scores</p>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-semibold text-slate">{opp.totalScore}</span>
                      <div className="text-xs text-muted">
                        <div>{opp.structuredScore} structured</div>
                        {opp.semanticScore !== undefined ? (
                          <div>{Math.round((opp.semanticScore ?? 0) * 100)} semantic</div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate/70">Deadline</p>
                    <p className="text-sm text-slate">
                      {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </aside>
              </div>
            </article>
          );
          })}

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate/30 bg-white/70 py-10 text-center text-sm text-muted">
              No opportunities meet the current filters yet. Try lowering the score threshold or expanding procurement
              types.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};


