const pillars = [
  {
    title: "Unified opportunity intelligence",
    subtitle: "Centralise notices, EOIs, RFPs, win/loss notes, budgets, and delivery records.",
    bullets: [
      "Index all opportunity material—documents, email threads, call notes, cost sheets—into a searchable knowledge graph.",
      "Keep versions of past EOIs/RFPs to speed up drafting and identify language that has worked.",
      "Attach structured deal data (fees, margin, effort) for clear comparisons across pursuits.",
    ],
  },
  {
    title: "Predictive pursuit strategy",
    subtitle: "Use AI to score, rank, and test pursuit plans before committing time and people.",
    bullets: [
      "Combine structured scoring (fit, budget, compliance) with semantic similarity and historical outcomes.",
      "Model profitability using rate cards, staffing mixes, and travel patterns from similar matters.",
      "Surface competitor activity—who bid, who won, and patterns in their strengths—and propose practical responses.",
    ],
  },
  {
    title: "Delivery-ready briefings",
    subtitle: "Give the team a complete brief as soon as we decide to move forward.",
    bullets: [
      "Country dossiers with regulatory context, cultural considerations, local partners, and recent developments.",
      "Stakeholder maps built from LinkedIn and internal contacts to identify warm introductions.",
      "Draft staffing plans with availability, strengths, day rates, and projected utilisation.",
    ],
  },
];

const lifecycle = [
  {
    phase: "Signal gathering",
    description:
      "Scraping and API integrations monitor UNGM, regional banks, local gazettes, media, and social channels for early indicators.",
  },
  {
    phase: "Pursuit design",
    description:
      "Semantic search and GPT intent parsing generate a go/no-go summary, recommended approach, draft EOI, and key questions for client contact.",
  },
  {
    phase: "Bid execution",
    description:
      "Draft proposals with context-aware assistants; track compliance, budget variance, and dependencies in one workspace.",
  },
  {
    phase: "Delivery insights",
    description:
      "As matters progress, record learnings (travel cadence, stakeholder preferences, risks) and add them to the knowledge graph.",
  },
  {
    phase: "Win / loss retrospectives",
    description:
      "Automated interviews and dashboards show reasons, margins, and satisfaction, updating the model for future bids.",
  },
];

const northStar = [
  {
    icon: "📈",
    text: "Financial forecasting: margin, cashflow, and capacity across all opportunities.",
  },
  {
    icon: "🤖",
    text: "Intel scouting: agents that monitor new public sources and prompt review.",
  },
  {
    icon: "🌐",
    text: "Relationship graph: link LinkedIn, CRM, and alumni networks to find the best introducer for each prospect.",
  },
  {
    icon: "📣",
    text: "Competitor dossiers: track filings, awards, hiring trends, and project overlaps.",
  },
  {
    icon: "🗺️",
    text: "Portfolio heatmaps: show exposure by region, sector, or agency to guide focus.",
  },
  {
    icon: "🎧",
    text: "Audio briefings: short summaries for principals on the move.",
  },
  {
    icon: "🛡️",
    text: "Compliance checks: flag export controls, conflicts, and ESG requirements before bid work begins.",
  },
];

const dataGrowth = [
  {
    step: "Initial demo",
    detail: "Synthetic notices and scraped publications show the intended experience (what you see today).",
  },
  {
    step: "Wave 1 ingestion",
    detail: "Import historical EOIs/RFPs, win/loss notes, staffing rosters, and rate cards from SharePoint or drives.",
  },
  {
    step: "Wave 2 integrations",
    detail: "Connect finance (actuals, billing), HR systems (availability), CRM (contacts), travel tools, and regional watchlists.",
  },
  {
    step: "Wave 3 enrichment",
    detail: "Crawlers monitor regulatory bulletins, market news, and competitive signals to keep the knowledge base current.",
  },
];

export default function TheRoadAheadPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-ocean/10 via-white to-cream py-16">
        <div className="container-responsive space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-ocean/80">Concept preview</p>
              <h1 className="text-4xl font-heading text-slate">The Road Ahead</h1>
              <p className="max-w-3xl text-base text-muted">
                Everything shown here is a proof-of-value for an operating system that supports the full opportunity
                cycle. The data on this tab is illustrative—once UNGM, finance, HR, travel, and knowledge sources
                connect, the system becomes live and aligned with the firm’s actual work.
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 px-6 py-4 text-sm text-slate shadow-sm">
              <p className="font-semibold text-ocean">Data status</p>
              <p>
                Interactive demo using mock opportunities, scraped publications, and the workflows we can put in place
                for Macmillan Keck.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_44px_rgba(14,30,37,0.08)]"
              >
                <h2 className="text-lg font-semibold text-slate">{pillar.title}</h2>
                <p className="mt-2 text-sm text-muted">{pillar.subtitle}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate">
                  {pillar.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1 text-ocean">▹</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-responsive space-y-6">
          <div className="section-divider" />
          <h2 className="text-3xl font-heading text-slate">Opportunity lifecycle with AI co-pilot</h2>
          <div className="relative">
            <div className="hidden lg:block lg:absolute lg:left-1/2 lg:top-0 lg:h-full lg:w-px lg:-translate-x-1/2 lg:bg-gradient-to-b lg:from-ocean/40 lg:to-transparent" />
            <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
              {lifecycle.map((stage) => (
                <div key={stage.phase} className="relative">
                  <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-md">
                    <p className="text-xs uppercase tracking-wide text-ocean/80">{stage.phase}</p>
                    <p className="mt-2 text-sm text-slate">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate/5 py-16">
        <div className="container-responsive space-y-6">
          <div className="section-divider" />
          <h2 className="text-3xl font-heading text-slate">Expanding data runway</h2>
          <p className="max-w-3xl text-muted">
            Sources can be added step by step. Each one improves search, drafting, and forecasting without disrupting
            current workflows.
          </p>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ocean/5 via-white to-cream p-6 shadow-lg">
            <div className="absolute -left-32 top-1/2 h-64 w-64 rounded-full bg-ocean/10 blur-3xl" />
            <div className="absolute -right-24 top-10 h-48 w-48 rounded-full bg-slate/10 blur-2xl" />
            <ol className="relative z-10 space-y-6 text-sm text-slate">
              {dataGrowth.map((item, index) => (
                <li key={item.step} className="flex items-start gap-4 rounded-2xl border border-white/60 bg-white/80 p-4">
                  <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ocean text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate">{item.step}</p>
                    <p className="text-muted">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-responsive space-y-6">
          <div className="section-divider" />
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-heading text-slate">North star capabilities</h2>
              <p className="max-w-3xl text-sm text-muted">
                Beyond the immediate roadmap, these are capabilities we can unlock with deeper AI integration and richer
                first-party data.
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {northStar.map((item) => (
              <div
                key={item.text}
                className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-5 text-sm text-slate shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-ocean/5" />
                <div className="relative flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="leading-relaxed text-slate">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-ocean/10 via-white to-cream py-16">
        <div className="container-responsive space-y-5">
          <div className="section-divider" />
          <h2 className="text-3xl font-heading text-slate">Why this matters</h2>
          <p className="max-w-4xl text-base text-muted">
            Clients expect quick insight, the right team, and confidence that bids are viable and profitable. This
            system pulls institutional knowledge into one place, supports better decisions, and positions Macmillan Keck
            to move faster and with more accuracy on every opportunity.
          </p>
        </div>
      </section>
    </>
  );
}


