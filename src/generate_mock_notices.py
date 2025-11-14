"""Generate a synthetic UNGM notice dataset for development."""
from __future__ import annotations

import json
import random
from datetime import datetime, timedelta
from pathlib import Path

AGENCIES = [
    "UNICEF",
    "WHO",
    "UNDP",
    "UNFPA",
    "WFP",
    "UNHCR",
]

PROCUREMENT_TYPES = ["RFP", "RFQ", "ITB", "EOI", "RFI"]

UNSPSC_CATALOG = {
    "Logistics": [
        {"code": "78102200", "description": "Freight forwarding services"},
        {"code": "78101800", "description": "Warehousing services"},
        {"code": "78101600", "description": "Postal and small parcel services"},
    ],
    "Health Systems": [
        {"code": "85101800", "description": "Public health services"},
        {"code": "85101700", "description": "Medical practice services"},
        {"code": "51191500", "description": "Vaccines"},
    ],
    "Supply Chain Consulting": [
        {"code": "86101601", "description": "Supply chain management consulting"},
        {"code": "81101507", "description": "Business process consulting"},
    ],
    "Renewable Energy": [
        {"code": "26111600", "description": "Electrical generation equipment"},
        {"code": "83101602", "description": "Power distribution services"},
        {"code": "72151500", "description": "Electrical system services"},
    ],
    "Water & Sanitation": [
        {"code": "47101500", "description": "Water treatment equipment"},
        {"code": "76121500", "description": "Water quality support services"},
    ],
}

COUNTRY_POOLS = {
    "East Africa": [
        {"country": "Kenya", "countryCode": "KE"},
        {"country": "Uganda", "countryCode": "UG"},
        {"country": "Tanzania", "countryCode": "TZ"},
        {"country": "Ethiopia", "countryCode": "ET"},
    ],
    "West Africa": [
        {"country": "Ghana", "countryCode": "GH"},
        {"country": "Nigeria", "countryCode": "NG"},
        {"country": "Senegal", "countryCode": "SN"},
        {"country": "Côte d'Ivoire", "countryCode": "CI"},
    ],
    "Southern Africa": [
        {"country": "Zambia", "countryCode": "ZM"},
        {"country": "Malawi", "countryCode": "MW"},
        {"country": "Mozambique", "countryCode": "MZ"},
    ],
    "Asia": [
        {"country": "Nepal", "countryCode": "NP"},
        {"country": "Bangladesh", "countryCode": "BD"},
        {"country": "Philippines", "countryCode": "PH"},
    ],
    "Latin America": [
        {"country": "Guatemala", "countryCode": "GT"},
        {"country": "Peru", "countryCode": "PE"},
        {"country": "Bolivia", "countryCode": "BO"},
    ],
}

QUALIFICATIONS = [
    "ISO 9001",
    "ISO 14001",
    "ISO 45001",
    "GDP certification",
    "IEC 62257",
    "GMP certification",
    "Experience with ECOWAS",
    "Certified cold-chain specialists",
]

DESCRIPTORS = [
    "cold chain logistics",
    "supply chain visibility",
    "vaccine distribution",
    "last-mile delivery",
    "warehouse management",
    "renewable mini-grids",
    "solar hybrid systems",
    "rural electrification",
    "water treatment",
    "medical supply optimization",
    "temperature monitoring",
]


def make_notice(index: int) -> dict:
    random.seed(10_000 + index)

    focus_area = random.choice(list(UNSPSC_CATALOG.keys()))
    unspsc = random.sample(UNSPSC_CATALOG[focus_area], k=min(2, len(UNSPSC_CATALOG[focus_area])))
    region = random.choice(list(COUNTRY_POOLS.keys()))
    countries = random.sample(COUNTRY_POOLS[region], k=min(len(COUNTRY_POOLS[region]), random.randint(1, 3)))
    agency = random.choice(AGENCIES)
    procurement_type = random.choice(PROCUREMENT_TYPES)

    base_date = datetime(2025, 11, 1) + timedelta(days=index)
    publish_date = base_date + timedelta(hours=random.randint(0, 72))
    deadline = publish_date + timedelta(days=random.randint(10, 60))

    budget_floor = random.randint(50_000, 600_000)
    budget_ceiling = budget_floor + random.randint(150_000, 3_000_000)

    descriptor = random.choice(DESCRIPTORS)
    title = f"{descriptor.title()} Initiative in {countries[0]['country']}"
    notice_id = f"{agency}-{2025}-{index:05d}"

    status = random.choice(["open", "open", "open", "amended", "closed"])

    return {
        "id": notice_id,
        "noticeId": notice_id,
        "title": title,
        "summary": f"{agency} seeks support for {descriptor} across {', '.join(c['country'] for c in countries)}.",
        "description": (
            f"{agency} invites qualified firms to deliver {descriptor} services in {', '.join(c['country'] for c in countries)}. "
            "The assignment covers assessment, implementation, training, and ongoing support with strong reporting requirements."
        ),
        "procurementCategory": "Services" if focus_area in {"Logistics", "Health Systems", "Supply Chain Consulting"} else "Goods & Works",
        "procurementType": procurement_type,
        "agency": agency,
        "status": status,
        "deadline": deadline.isoformat() + "Z",
        "publishDate": publish_date.isoformat() + "Z",
        "budget": {"min": budget_floor, "max": budget_ceiling, "currency": "USD"},
        "unspsc": unspsc,
        "countries": countries,
        "documents": [
            {
                "url": f"https://example.org/docs/{notice_id.lower()}-main.pdf",
                "name": f"{procurement_type} Document",
                "type": procurement_type,
            }
        ],
        "requiredQualifications": random.sample(QUALIFICATIONS, k=random.randint(1, 3)),
        "additionalInfo": {
            "focusArea": focus_area,
            "region": region,
        },
    }


def generate_dataset(count: int = 50) -> list[dict]:
    return [make_notice(i) for i in range(1, count + 1)]


def main() -> None:
    notices = generate_dataset(50)
    output_path = Path("data/sample_notices.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(notices, handle, indent=2)
    print(f"Wrote {len(notices)} notices to {output_path}")


if __name__ == "__main__":
    main()
