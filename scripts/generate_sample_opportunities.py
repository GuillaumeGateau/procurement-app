"""
Generate synthetic opportunity data with richer narratives for frontend testing.
"""
from __future__ import annotations

import json
import random
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List

PROJECTS_PATH = Path("data/macmillan_keck_projects.json")
PUBLICATIONS_MANIFEST = Path("publications/manifest.json")


def load_projects() -> Dict[str, Dict[str, str]]:
    data = json.loads(PROJECTS_PATH.read_text(encoding="utf-8"))
    return {entry["title"]: entry for entry in data}


def load_publication_url(file_name: str) -> str:
    manifest = json.loads(PUBLICATIONS_MANIFEST.read_text(encoding="utf-8"))
    lookup = {Path(item["file"]).name: item["url"] for item in manifest}
    if file_name not in lookup:
        raise KeyError(f"Publication {file_name} not found in manifest.json")
    return lookup[file_name]


PROJECTS = load_projects()


def project_summary(title: str) -> str:
    project = PROJECTS.get(title)
    if not project:
        return title
    summary = project.get("summary", "").strip()
    if not summary:
        return project["title"]
    return summary.split(". ")[0] + "."


@dataclass
class Template:
    title: str
    agency: str
    procurement_type: str
    countries: List[str]
    semantic_title: str
    semantic_url: str
    summary_focus: str
    project_titles: List[str]
    fit_summary: str
    pros_templates: List[str]
    cons_templates: List[str]
    budget_range: tuple[int, int]


TEMPLATES: List[Template] = [
    Template(
        title="Cold Chain Logistics Support for Vaccine Distribution in {country}",
        agency="UNICEF",
        procurement_type="RFP",
        countries=["Kenya", "Uganda", "Tanzania", "Ethiopia", "Rwanda"],
        semantic_title="Bangalink Briefing Paper To Bb 161004",
        semantic_url=load_publication_url("Bangalink_briefing_paper_to_BB_161004.pdf"),
        summary_focus="cold chain and vaccine logistics",
        project_titles=[
            "Solving Kenya’s USSD pricing problem for digital financial services",
            "Introducing innovative national PPPs for West African submarine cable",
        ],
        fit_summary=(
            "Team has engineered large-scale public-private partnerships and payment rails that underpin vaccine and "
            "health logistics across East and West Africa."
        ),
        pros_templates=[
            "Designed the settlement reforms in {project_0_title}, unlocking real-time pricing visibility across mobile channels.",
            "Structured multi-party infrastructure agreements in {project_1_title}, coordinating operators and governments.",
        ],
        cons_templates=[
            "Requires rapid mobilisation of cold-chain field partners in {country} to complement our policy bench.",
        ],
        budget_range=(650_000, 1_250_000),
    ),
    Template(
        title="Supply Chain Optimization Advisory for Essential Medicines in {country}",
        agency="WHO",
        procurement_type="EOI",
        countries=["Ghana", "Nigeria", "Senegal", "Côte d’Ivoire"],
        semantic_title="Competition dynamics in mobile money markets in Tanzania",
        semantic_url=load_publication_url("Macmillan-OECD-Competition-for-the-market-2019.pdf"),
        summary_focus="health supply chains and pricing transparency",
        project_titles=[
            "Breaking monopoly bottlenecks for IP transit in landlocked Malawi",
            "Studying digital remittances from Malaysia to Philippines",
        ],
        fit_summary=(
            "Our economists routinely unwind market bottlenecks and design incentives that keep critical goods moving."
        ),
        pros_templates=[
            "Removed entrenched market power in {project_0_title}, delivering 90%+ price reductions for essential connectivity.",
            "Mapped end-to-end user pricing and compliance flows in {project_1_title}—a playbook for transparent supply logistics.",
        ],
        cons_templates=[
            "Engagement would benefit from in-country data analysts embedded with the Ministry of Health in {country}.",
        ],
        budget_range=(420_000, 950_000),
    ),
    Template(
        title="Digital ID Legal and Regulatory Framework Review for {country}",
        agency="UNDP",
        procurement_type="RFP",
        countries=["Samoa", "Vanuatu", "Fiji", "Timor Leste"],
        semantic_title="Expert Group Report on Digital Identification Governance",
        semantic_url=load_publication_url("ExpertGroupReportFeb2018.pdf"),
        summary_focus="digital identification governance",
        project_titles=[
            "Drafting Samoa’s National Digital Identification Bill",
            "Drafting Malawi’s Data Protection Bill",
        ],
        fit_summary=(
            "We author pragmatic digital ID legislation and operational frameworks tailored to island and frontier economies."
        ),
        pros_templates=[
            "Delivered the full-stack legal architecture in {project_0_title}, balancing inclusion, privacy, and interoperability.",
            "Crafted actionable data governance toolkits applied by multiple Pacific regulators.",
        ],
        cons_templates=[
            "Requires early agreement on hosting arrangements in {country} to avoid procurement delays.",
        ],
        budget_range=(380_000, 800_000),
    ),
    Template(
        title="Infrastructure Sharing Roadmap for {country}",
        agency="World Bank",
        procurement_type="ITB",
        countries=["Malawi", "Lesotho", "Liberia", "Sierra Leone", "Botswana"],
        semantic_title="Fostering cross-sector infrastructure sharing for broadband",
        semantic_url=load_publication_url("Competition-and-regulatory-disputes-3-614-2285.pdf"),
        summary_focus="infrastructure sharing policy",
        project_titles=[
            "Fostering cross-sector infrastructure sharing for broadband",
            "Enabling Africa’s first end-to-end fiber-to-the-tower backhaul",
        ],
        fit_summary="Blueprint authors of the World Bank’s infrastructure sharing toolkit and multiple national rollouts.",
        pros_templates=[
            "Co-authored the global reference manual in {project_0_title}, complete with contractual templates.",
            "Implemented shared-fiber backhaul in {project_1_title}, coordinating utility and mobile operator incentives.",
        ],
        cons_templates=[
            "Needs alignment with energy and transport ministries in {country}; we will allocate extra senior time to stakeholder diplomacy.",
        ],
        budget_range=(500_000, 1_500_000),
    ),
    Template(
        title="Mobile Money Interoperability & Competition Assessment in {country}",
        agency="UN Capital Development Fund",
        procurement_type="RFP",
        countries=["Tanzania", "Kenya", "Rwanda", "Ghana", "Zambia"],
        semantic_title="Competition dynamics in mobile money markets in Tanzania",
        semantic_url=load_publication_url("BlechmanOdhiamboRoberts_TanzaniaMobileMoney.pdf"),
        summary_focus="digital financial services regulation",
        project_titles=[
            "Solving Kenya’s USSD pricing problem for digital financial services",
            "Studying digital remittances from Malaysia to Philippines",
        ],
        fit_summary="Core DFS competition experts with decades of market conduct enforcement and settlement design.",
        pros_templates=[
            "Secured a 90% USSD price reduction in {project_0_title}, unlocking market entry for new wallets.",
            "Benchmarked interoperability and compliance regimes across corridors in {project_1_title}.",
        ],
        cons_templates=[
            "Would require dedicated behavioural testing labs in {country} to evidence consumer friction.",
        ],
        budget_range=(300_000, 600_000),
    ),
    Template(
        title="Data Protection and Privacy Regulatory Support for {country}",
        agency="African Union",
        procurement_type="EOI",
        countries=["Malawi", "Mauritius", "Botswana", "Namibia", "Ghana"],
        semantic_title="Big Data, Machine Learning, Consumer Protection and Privacy",
        semantic_url=load_publication_url("Big_data_machine_learning_consumer_protection_and_privacy_2019_Rory_Macmillan.pdf"),
        summary_focus="data protection operations",
        project_titles=[
            "Drafting Malawi’s Data Protection Bill",
            "Advising on connected cars, IoT and other digital services",
        ],
        fit_summary=(
            "Combines legislative drafting with hands-on implementation support for regulators standing up new DPAs."
        ),
        pros_templates=[
            "Drafted the flagship legislation in {project_0_title} with pragmatic supervisory workflows.",
            "Guided multinational IoT deployments in {project_1_title}, ensuring cross-border compliance.",
        ],
        cons_templates=[
            "Need to scope localisation requirements in {country} to anticipate adequacy conversations.",
        ],
        budget_range=(250_000, 520_000),
    ),
]


def format_currency(value: float) -> float:
    return round(value / 1000) * 1000


def generate_opportunities(count: int = 50):
    notices = []
    start_date = datetime(2025, 11, 1)

    for idx in range(count):
        template = random.choice(TEMPLATES)
        country = random.choice(template.countries)
        deadline = (start_date + timedelta(days=idx * 2 + 30)).strftime("%Y-%m-%dT23:59:59Z")
        total_score = random.randint(82, 96)
        structured_score = random.randint(68, 86)
        semantic_score = round(random.uniform(0.31, 0.47), 2)

        budget_min, budget_max = template.budget_range
        budget_value = random.uniform(budget_min, budget_max)
        budget_high = format_currency(budget_value)
        budget_low = format_currency(budget_value * random.uniform(0.6, 0.85))

        project_refs = template.project_titles
        reference_projects = []
        for idx_project, title in enumerate(project_refs):
            if "{country}" in title:
                resolved_title = title.format(country=country)
                # The actual project list may not contain this templated entry; skip if missing.
                proj = PROJECTS.get(resolved_title)
            else:
                proj = PROJECTS.get(title)
            if proj:
                reference_projects.append(
                    {
                        "title": proj["title"],
                        "summary": proj.get("summary", ""),
                    }
                )

        pros = []
        for template_text in template.pros_templates:
            text = template_text.format(
                country=country,
                project_0_title=reference_projects[0]["title"] if reference_projects else "",
                project_1_title=reference_projects[1]["title"] if len(reference_projects) > 1 else "",
            )
            pros.append(text)

        cons = [c.format(country=country) for c in template.cons_templates]

        notice = {
            "id": f"MK-SAMPLE-{idx+1:03d}",
            "title": template.title.format(country=country),
            "agency": template.agency,
            "procurement_type": template.procurement_type,
            "countries": [{"country": country}],
            "deadline": deadline,
            "structuredScore": structured_score,
            "totalScore": total_score,
            "budget_min": int(budget_low),
            "budget_max": int(budget_high),
            "currency": "USD",
            "raw_json": {
                "semanticScore": semantic_score,
                "semanticMatches": [
                    {
                        "score": semantic_score,
                        "sourceTitle": template.semantic_title,
                        "sourceUrl": template.semantic_url,
                        "sourceType": "publication",
                    }
                ],
                "fitSummary": template.fit_summary,
                "fitPros": pros,
                "fitCons": cons,
                "referenceProjects": reference_projects,
                "budget": {
                    "currency": "USD",
                    "min": int(budget_low),
                    "max": int(budget_high),
                },
                "documents": [
                    {
                        "title": template.semantic_title,
                        "url": template.semantic_url,
                    }
                ],
            },
        }
        notices.append(notice)
    return notices


def main():
    notices = generate_opportunities(50)
    output_path = Path("output/notices.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(notices, indent=2), encoding="utf-8")
    print(f"Wrote {len(notices)} sample opportunities to {output_path}")


if __name__ == "__main__":
    main()

