# Macmillan Keck Opportunity OS

This repository contains the marketing site and interactive demo for Macmillan Keck’s “opportunity operating system”—a Next.js app that showcases how the firm captures global procurement signals, curates institutional knowledge, and drafts EOIs with AI assistance. The project is intentionally content-heavy (YAML/JSON) so non-engineers can iterate quickly, while leaving clear seams for future integrations (UNGM APIs, Pinecone semantic search, finance/HR systems, etc.).

---

## Hosting & Deployment

| Environment | URL | Notes |
| --- | --- | --- |
| Production | `https://procurement-app-rose.vercel.app` | Hosted on Vercel (Next.js App Router). Deploys automatically from `main`. |
| Preview | Vercel PR previews | Every PR gets a unique preview URL. |
| Local dev | `npm run dev` | Runs on `http://localhost:3000`. Requires Node 18+. |

Artifacts:
* `frontend/app/icon.png` → favicon.
* Redirects handled in `frontend/next.config.js` (e.g., `/why-engage` → `/the-road-ahead`).

---

## Repository Layout

```
/
├─ frontend/
│  ├─ app/                      # Next.js App Router routes
│  │  ├─ page.tsx               # Homepage assembling hero, expertise, projects, publications, team
│  │  ├─ team/, achievements/, publications/, opportunities/
│  │  └─ the-road-ahead/        # “Road Ahead” (formerly why-engage) concept page
│  ├─ components/
│  │  ├─ layout/AppLayout.tsx   # Header, mobile nav, footer
│  │  ├─ sections/*             # Reusable content sections (hero, team, projects, publications, etc.)
│  │  └─ opportunities/*        # Draft EOI editor + reference sidebar
│  ├─ lib/                      # Content loaders + (stub) opportunities server helpers
│  ├─ public/assets/            # Images used across the site
│  ├─ styles/                   # Tailwind + design system
│  └─ next.config.js            # Redirects, experimental flags
├─ content/                     # YAML/JSON powering homepage, team, publications
├─ data/                        # Scraped source material (raw_*.html), sample analyses, summaries
├─ scripts/                     # Utilities for generating structured content (e.g., publications catalog)
├─ output/notices.json          # Mock opportunity feed consumed by the draft page
└─ README.md                    # (This file)
```

---

## How the App Works

### 1. Content-driven UI (filesystem CMS)
* `frontend/lib/content.ts` exposes `loadYaml`/`loadJson`. Components consume typed data directly from `content/` and `data/`.
* **Team bios** → `content/team.yml`. Each card renders expertise, credentials, “formerly with,” email/phone, and LinkedIn links.
* **Publications** → `content/publications.json` (generated via `scripts/build_publications_catalog.py`). The homepage uses curated hero cards + themed collections, while `/publications` renders filters and hero insights via `PublicationsLibrary`.
* **Projects/Achievements** → `data/projects_summary.json` displayed with theme filters in `ProjectsShowcase`.

### 2. Drafting experience (opportunities)
* `output/notices.json` holds sample opportunities (mock UN/World Bank briefs).
* `frontend/app/opportunities/[id]/draft/page.tsx` renders:
  * Metadata (agency, deadline, budget).
  * `EOIEditor` containing a pre-baked outline tailored to each opportunity.
  * `ReferenceSidebar` (desktop-only) pulling precedent projects + publications (currently from JSON; future: semantic snippets w/ page numbers).
* Future enhancement: call real Pinecone embeddings + store snippet offset metadata for precise quoting & deep-linking in PDFs.

### 3. Publications ingestion pipeline
* Run `python scripts/build_publications_catalog.py`.
* Script scans `publications/manifest.json`, extracts PDF metadata (title via PDF metadata + headline heuristics), summarises first paragraphs, and writes `content/publications.json`.
* Articles in `publications/articles/manifest.json` are parsed via BeautifulSoup for title/summary.

### 4. Styling & theming
* Tailwind classes defined globally in `frontend/styles/globals.css`.
* Additional tokens (colors, gradients) in `frontend/styles/design-system.css`.
* Layout header supports mobile overlay navigation and horizontal scrolling on tablets to avoid viewport shifts.

### 5. Redirects & routing
* Route rename (`/why-engage` → `/the-road-ahead`) handled by moving the directory and adding a permanent redirect in `next.config.js`.
* App Router uses file-based routing; dropping a component under `frontend/app/<route>/page.tsx` registers it automatically.

---

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

Scripts / tooling:
* `python scripts/build_publications_catalog.py` → rebuild publication JSON.
* `npm run lint` (once ESLint is configured) → ensure component quality.

Environment variables: none required yet (all data is static).

---

## Roadmap (“The Road Ahead”)

The `/the-road-ahead` page captures the aspirational roadmap. Key pillars:

1. **Unified opportunity intelligence**
   - Ingest UNGM + regional bank APIs.
   - Index historical EOIs, RFPs, win/loss notes, rate cards, and delivery outcomes into Pinecone / Postgres.
2. **Predictive pursuit strategy**
   - Combine structured scoring (fit/budget/compliance) with semantic similarity to prior work.
   - Scenario-model profitability with actual finance + HR availability data.
   - Capture competitor behaviour (who bid, who won, heuristics).
3. **Delivery-ready briefings**
   - Auto-generate dossiers (regulatory, cultural, partner networks).
   - Build stakeholder graphs backed by LinkedIn + CRM data.
   - Produce staffing plans with real availability, rate cards, utilisation projections.
4. **Opportunity lifecycle automation**
   - Signal gathering → pursuit design → bid execution → delivery insights → win/loss retrospectives. Each phase feeds back into the knowledge graph.
5. **Expanding data runway**
   - Wave 1: ingest historic documents.
   - Wave 2: integrate finance/HR/CRM/travel systems.
   - Wave 3: continuous crawlers for regulatory + news signals.
6. **North-star capabilities**
   - Financial forecasting dashboards (margin, cashflow, capacity).
   - Autonomous intel scouting agents (monitor new public sources).
   - Portfolio heatmaps, relationship graphs, compliance guardrails, audio briefings, etc.

Open work items (not yet implemented):
* Live UNGM/World Bank API ingestion + deduplication pipeline.
* Pinecone embedding service storing snippet offsets + page numbers for publications/projects.
* Opportunity scoring service w/ historical win/loss training data.
* Finance/HR integrations for actual budgets, staffing, and utilisation.
* Notification system (email/Slack) for new opportunities matching stored practice areas.
* Role-based access and draft persistence (currently demo is stateless).

---

## Contributing & Collaboration

1. Fork + clone.
2. Create branches per feature (`feat/roadmap-readme`).
3. Run `npm run dev` and ensure pages render without TypeScript errors.
4. Run `python scripts/build_publications_catalog.py` after updating PDFs/articles.
5. Commit with descriptive messages; push to GitHub to trigger Vercel previews.

PRs should include:
* Screenshot of affected pages (desktop + mobile if UI changes).
* Notes on data updates (e.g., new YAML content).
* Any follow-up tasks for the roadmap.

---

## Questions / Next Steps

* **Data ingestion** – confirm target APIs (UNGM, World Bank, AfDB, etc.) and authentication.
* **Search infrastructure** – decide between Pinecone SaaS vs. self-hosted vector DB.
* **Document storage** – current PDFs live in repo; consider S3 + signed URLs for scale.
* **Auth & RBAC** – when turning the demo into a product, add authentication + audit logging.
* **Analytics** – capture interactions (filters, drafts, referenced snippets) to inform prioritisation.

For any clarifications, ping the Macmillan Keck digital team or the maintainers listed in `config/company_profile.yaml`.

---

_This README is intentionally comprehensive so new contributors or partners can understand what exists today, how to run it, and where the product is headed._ 

