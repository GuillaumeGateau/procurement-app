"""Load mock notices from JSON into the database for development/testing."""
from __future__ import annotations

import json
import logging
import os
from argparse import ArgumentParser
from pathlib import Path
from typing import Any, Dict

from dotenv import load_dotenv

from .models import Notice
from .repository import NoticeRepository
from .scoring import CompanyProfile, score_notice
from .main import transform_notice, load_yaml

LOGGER = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


def parse_args():
    parser = ArgumentParser(description="Load mock UNGM notices for testing")
    parser.add_argument("--input", default="data/sample_notices.json")
    parser.add_argument("--config", default="config/company_profile.yaml")
    parser.add_argument("--db", default=None)
    return parser.parse_args()


def load_json(path: str):
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def main() -> None:
    load_dotenv()
    args = parse_args()

    profile = CompanyProfile(**load_yaml(args.config))
    db_url = args.db or os.getenv("DATABASE_URL", "sqlite:///data/notices.db")

    repo = NoticeRepository(db_url)

    Path(args.input).parent.mkdir(parents=True, exist_ok=True)
    data = load_json(args.input)

    count = 0
    for raw in data:
        notice_model = transform_notice(raw)
        notice_model.raw_json = raw
        notice_model.fit_score = score_notice(raw, profile)
        repo.upsert_notice(notice_model)
        count += 1
    LOGGER.info("Loaded %d mock notices into %s", count, db_url)


if __name__ == "__main__":
    main()
