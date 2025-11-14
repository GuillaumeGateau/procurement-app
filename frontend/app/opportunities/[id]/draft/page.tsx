import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Tag } from "@ui/Tag";
import { EOIEditor } from "@components/opportunities/EOIEditor";
import { ReferenceSidebar } from "@components/opportunities/ReferenceSidebar";
import { findOpportunity, OpportunityRecord } from "@lib/opportunities.server";
import { loadJson, Publication } from "@lib/content";

type DraftPageProps = {
  params: { id: string };
};

const buildTemplate = (opportunity: OpportunityRecord) => {
  const country = opportunity.countries?.[0]?.country ?? opportunity.countries?.[0]?.countryCode ?? "the target country";
  const agency = opportunity.agency ?? "the contracting authority";
  const budget = opportunity.raw_json?.budget;
  const referenceProjects = opportunity.raw_json?.referenceProjects ?? [];

  const projectLines =
    referenceProjects.length > 0
      ? referenceProjects
          .slice(0, 3)
          .map((project) => `• ${project.title}${project.summary ? ` – ${project.summary}` : ""}`)
          .join("\n")
      : "• Highlight two or three projects of similar scale and scope.\n• Emphasise measurable outcomes, beneficiaries, and institutional partners.";

  const budgetLine = budget && (budget.min || budget.max)
    ? `The indicative budget is ${budget.min ? `$${budget.min.toLocaleString()}` : ""}${
        budget.max && budget.max !== budget.min ? ` to $${budget.max.toLocaleString()}` : ""
      } ${budget.currency ?? "USD"}${budget.isEstimated ? " (estimated)" : ""}.`
    : "Budget has not been disclosed; our indicative fee envelope will be confirmed following the request for proposals.";

  return `Subject: Expression of Interest – ${opportunity.title}

Dear ${agency} team,

[Firm name], an international advisory firm specialising in digital infrastructure, financial inclusion, and regulatory reform, is pleased to submit this Expression of Interest for the assignment “${opportunity.title}” in ${country}.

1. Firm overview and capability
• Summarise your firm’s core mandate, years of operation, global reach, and areas of sectoral expertise relevant to the assignment.
• Reference any in-country registrations, partnerships, or framework agreements that demonstrate local presence and compliance.

2. Relevant experience
${projectLines}

3. Proposed key experts
• Lead technical advisor – highlight expertise that aligns with the scope (e.g. digital financial services, telecom regulation, data governance).\n• Sector/legal specialists – outline two or three domain experts covering policy, legal drafting, and implementation.\n• Local counterpart(s) – note arrangements with national consultants or institutions to ensure continuity and in-country delivery.

4. Approach to delivery
• Briefly outline how the team will combine regulatory insight, stakeholder engagement, and implementation support.\n• Reference agile deliverable management, knowledge transfer, and capacity building components.

5. Administrative information
${budgetLine}
• We confirm eligibility under the procurement rules and absence of any conflict of interest.\n• Our firm is prepared to mobilise immediately upon receipt of the request for proposals.\n• Supporting documentation (firm profile, CVs, legal incorporation) can be provided upon request.

We appreciate the opportunity to be considered for this assignment and remain available for any clarifications.

Kind regards,
[Name]\n[Title]\n[Firm name]\n[Email | Phone]`;
};

export function generateMetadata({ params }: DraftPageProps): Metadata {
  const opportunity = findOpportunity(params.id);
  if (!opportunity) {
    return {
      title: "Draft expression of interest",
    };
  }

  return {
    title: `Draft expression of interest – ${opportunity.title}`,
    description: `Create an expression of interest tailored to ${opportunity.title}.`,
  };
}

const publications = loadJson<Publication[]>("publications.json");
const publicationIndex = new Map(
  publications.map((publication) => [publication.title.toLowerCase(), publication])
);

const buildProjectReferences = (opportunity: OpportunityRecord) => {
  const referenceProjects = opportunity.raw_json?.referenceProjects ?? [];
  return referenceProjects.slice(0, 4).map((project, index) => ({
    id: `project-${index}`,
    title: project.title,
    snippet: project.summary ?? "Previously delivered engagement flagged by the notice.",
    relevance: "Cited in the RFP as precedent work completed by the firm.",
  }));
};

const buildPublicationReferences = (opportunity: OpportunityRecord) => {
  const semanticMatches = opportunity.raw_json?.semanticMatches ?? [];
  return semanticMatches.slice(0, 4).map((match, index) => {
    const title = match.sourceTitle ?? `Relevant insight ${index + 1}`;
    const publication = title ? publicationIndex.get(title.toLowerCase()) : undefined;
    return {
      id: `publication-${index}`,
      title,
      snippet:
        publication?.summary ??
        "Open the linked insight for a detailed excerpt aligned with this assignment.",
      relevance: match.score
        ? `Semantic match (${(match.score * 100).toFixed(0)}% relevance) to the current notice.`
        : "Identified as relevant to this notice.",
      source: publication?.type ? publication.type.toUpperCase() : undefined,
      url: match.sourceUrl ?? publication?.url,
    };
  });
};

export default function DraftEOIPage({ params }: DraftPageProps) {
  const opportunity = findOpportunity(params.id);
  if (!opportunity) {
    notFound();
  }

  const country = opportunity.countries?.[0]?.country ?? opportunity.countries?.[0]?.countryCode;
  const budget = opportunity.raw_json?.budget;
  const projectReferences = buildProjectReferences(opportunity);
  const publicationReferences = buildPublicationReferences(opportunity);

  return (
    <div className="space-y-8 py-12">
      <div className="container-responsive grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-6">
          <Link href="/opportunities" className="inline-flex items-center text-sm text-ocean hover:underline">
            ← Back to matched opportunities
          </Link>

          <header className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-heading text-slate">Draft expression of interest</h1>
                <p className="text-lg text-slate">{opportunity.title}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                {opportunity.agency ? <Tag label={opportunity.agency} tone="muted" /> : null}
                {opportunity.procurement_type ? <Tag label={opportunity.procurement_type} tone="muted" /> : null}
                {country ? <Tag label={country} tone="muted" /> : null}
              </div>
            </div>
            <div className="grid gap-4 text-sm text-muted md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate/70">Deadline</p>
                <p className="text-slate">
                  {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate/70">Budget insight</p>
                <p className="text-slate">
                  {budget && (budget.min || budget.max)
                    ? `${budget.isEstimated ? "Estimated " : ""}${formatCurrency(budget.min ?? budget.max, budget.currency)}${
                        budget.max && budget.max !== budget.min ? ` – ${formatCurrency(budget.max, budget.currency)}` : ""
                      }`
                    : "Not disclosed"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate/70">Top references</p>
                <p className="line-clamp-2 text-slate">
                  {(opportunity.raw_json?.referenceProjects ?? []).map((project) => project.title).slice(0, 2).join(", ") ||
                    "Add your most relevant precedents"}
                </p>
              </div>
            </div>
          </header>

          <section className="space-y-4 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card">
            <h2 className="text-lg font-semibold text-slate">Editable draft</h2>
            <EOIEditor template={buildTemplate(opportunity)} />
          </section>
        </div>

        <ReferenceSidebar
          className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto"
          projectReferences={projectReferences}
          publicationReferences={publicationReferences}
        />
      </div>
    </div>
  );
}

const formatCurrency = (value?: number, currency = "USD") => {
  if (!value) return "";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
};

