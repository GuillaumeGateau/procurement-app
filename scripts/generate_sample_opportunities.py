"""
Generate synthetic opportunity data for frontend testing.
"""
from __future__ import annotations

import json
import random
from datetime import datetime, timedelta
from pathlib import Path

BASE_NOTICE = {
    "agency": "UNICEF",
    "procurement_type": "RFP",
    "countries": [{"country": "Kenya"}, {"country": "Uganda"}],
    "structuredScore": 72,
    "totalScore": 88,
    "deadline": "2025-12-01T23:59:59Z",
    "raw_json": {
        "semanticScore": 0.36,
        "semanticMatches": [
            {
                "score": 0.36,
                "sourceTitle": "Bangalink Briefing Paper To Bb 161004",
                "sourceUrl": "https://www.macmillankeck.pro/wp-content/uploads/2022/03/Bangalink_briefing_paper_to_BB_161004.pdf",
            }
        ],
        "fitExplanation": (
            "Agency experience with UNICEF and similar cold-chain projects in Kenya and Uganda. "
            "Semantic match to Bangalink briefing and Malawi data protection bill shows relevant work. "
            "Structured score 72 and total score 88 well above threshold."
        ),
    },
}

TEMPLATES = [
    {
        "title": "Cold Chain Logistics Support for Vaccine Distribution in {country}",
        "agency": "UNICEF",
        "procurement_type": "RFP",
        "countries": ["Kenya", "Uganda", "Tanzania", "Ethiopia"],
        "semantic_title": "Bangalink Briefing Paper To Bb 161004",
        "summary": "cold chain and vaccine logistics",
    },
    {
        "title": "Supply Chain Optimization Advisory for Essential Medicines in {country}",
        "agency": "WHO",
        "procurement_type": "EOI",
        "countries": ["Ghana", "Nigeria", "Senegal", "Cote d'Ivoire"],
        "semantic_title": "Competition dynamics in mobile money markets in Tanzania",
        "summary": "supply chain optimization",
    },
    {
        "title": "Digital ID Legal and Regulatory Framework Review for {country}",
        "agency": "UNDP",
        "procurement_type": "RFP",
        "countries": ["Samoa", "Vanuatu", "Fiji", "Timor Leste"],
        "semantic_title": "Drafting Samoa’s National Digital Identification Bill",
        "summary": "digital ID framework",
    },
    {
        "title": "Infrastructure Sharing Roadmap for {country}",
        "agency": "World Bank",
        "procurement_type": "ITB",
        "countries": ["Malawi", "Lesotho", "Liberia", "Sierra Leone"],
        "semantic_title": "Fostering cross-sector infrastructure sharing for broadband",
        "summary": "infrastructure sharing",
    },
    {
        "title": "Mobile Money Interoperability & Competition Assessment in {country}",
        "agency": "UN Capital Development Fund",
        "procurement_type": "RFP",
        "countries": ["Tanzania", "Kenya", "Rwanda", "Ghana"],
        "semantic_title": "Competition dynamics in mobile money markets in Tanzania",
        "summary": "mobile money interoperability",
    },
    {
        "title": "Data Protection and Privacy Regulatory Support for {country}",
        "agency": "African Union",
        "procurement_type": "EOI",
        "countries": ["Malawi", "Mauritius", "Botswana", "Namibia"],
        "semantic_title": "Drafting Malawi’s Data Protection Bill",
        "summary": "data protection regulation",
    },
]


def generate_opportunities(count: int = 30):
    notices = []
    start_date = datetime(2025, 11, 1)

    for idx in range(count):
        template = random.choice(TEMPLATES)
        country = random.choice(template["countries"])
        deadline = (start_date + timedelta(days=idx * 3 + 30)).strftime("%Y-%m-%dT23:59:59Z")
        total_score = random.randint(82, 95)
        structured_score = random.randint(65, 85)
        semantic_score = round(random.uniform(0.30, 0.45), 2)

        explanation = (
            f"Our experience with {template['agency']} and similar {template['summary']} work in {country} matches this "
            f"requirement. Semantic evidence references {template['semantic_title']}. Structured score "
            f"{structured_score} and total score {total_score} exceed our 80+ bar."
        )

        notice = {
            "id": f"MK-SAMPLE-{idx+1:03d}",
            "title": template["title"].format(country=country),
            "agency": template["agency"],
            "procurement_type": template["procurement_type"],
            "countries": [{"country": country}],
            "deadline": deadline,
            "structuredScore": structured_score,
            "totalScore": total_score,
            "raw_json": {
                "semanticScore": semantic_score,
                "semanticMatches": [
                    {
                        "score": semantic_score,
                        "sourceTitle": template["semantic_title"],
                        "sourceUrl": "https://www.macmillankeck.pro/publications/",
                    }
                ],
                "fitExplanation": explanation,
            },
        }
        notices.append(notice)
    return notices


def main():
    notices = generate_opportunities(30)
    output_path = Path("output/notices.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(notices, indent=2), encoding="utf-8")
    print(f"Wrote {len(notices)} sample opportunities to {output_path}")


if __name__ == "__main__":
    main()

