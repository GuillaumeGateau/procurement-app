"""Daily UNGM tender retrieval and scoring script."""
from __future__ import annotations

import argparse
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml
from dotenv import load_dotenv

from .api import UNGMClient
from .auth import OAuthClient, OAuthSettings
from .models import Notice, NoticeCountry, NoticeDocument, NoticeUNSPSC
from .outputs import export_csv, export_json, render_email_body, render_html_dashboard
from .repository import NoticeRepository
from .scoring import CompanyProfile, score_notice, should_filter
from .semantic import SemanticMatcher
from .config_loader import load_scoring_config
from .evaluation_log import EvaluationLogger

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
LOGGER = logging.getLogger(__name__)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Retrieve and score UNGM notices")
    parser.add_argument("--config", default="config/company_profile.yaml")
    parser.add_argument("--creds", default="config/credentials.yaml")
    parser.add_argument("--db", default=None, help="Override database URL")
    parser.add_argument("--days", type=int, default=1, help="Window (days) for notice search")
    parser.add_argument("--export-json", default="output/notices.json")
    parser.add_argument("--export-csv", default="output/notices.csv")
    parser.add_argument("--export-html", default="output/dashboard.html")
    parser.add_argument("--template-dir", default="templates")
    parser.add_argument("--print", action="store_true", help="Print top results to stdout")
    parser.add_argument("--semantic-top-k", type=int, default=None, help="Top K semantic matches to retrieve")
    return parser.parse_args()


def load_yaml(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as handle:
        content = handle.read()
    return yaml.safe_load(os.path.expandvars(content))


def ensure_parent(path: str) -> None:
    Path(path).parent.mkdir(parents=True, exist_ok=True)


def transform_notice(raw: Dict[str, Any]) -> Notice:
    notice_id = str(raw.get("id") or raw.get("noticeId"))
    notice = Notice(
        id=notice_id,
        title=raw.get("title"),
        summary=raw.get("summary"),
        description=raw.get("description"),
        procurement_category=raw.get("procurementCategory"),
        procurement_type=raw.get("procurementType"),
        agency=raw.get("agency"),
        status=raw.get("status"),
        deadline=_safe_date(raw.get("deadline")),
        publish_date=_safe_datetime(raw.get("publishDate")),
        budget_min=_safe_number(raw.get("budget", {}).get("min") or raw.get("budgetMin")),
        budget_max=_safe_number(raw.get("budget", {}).get("max") or raw.get("budgetMax")),
        currency=(raw.get("budget", {}) or {}).get("currency"),
        raw_json=raw,
    )
    notice.documents = [
        NoticeDocument(
            notice_id=notice_id,
            url=doc.get("url"),
            name=doc.get("name"),
            type=doc.get("type"),
        )
        for doc in raw.get("documents", [])
    ]
    notice.unspsc = [
        NoticeUNSPSC(
            notice_id=notice_id,
            code=item.get("code"),
            description=item.get("description"),
        )
        for item in raw.get("unspsc", [])
    ]
    notice.countries = [
        NoticeCountry(
            notice_id=notice_id,
            country_code=item.get("countryCode"),
            country_name=item.get("country"),
        )
        for item in raw.get("countries", [])
    ]
    return notice


def build_fit_explanation(
    notice: Dict[str, Any],
    structured_score: float,
    total_score: float,
    semantic_matches: List[Dict[str, Optional[str]]],
) -> str:
    reasons: List[str] = []
    agency = notice.get("agency")
    procurement_type = notice.get("procurementType") or notice.get("procurement_type")
    countries = notice.get("countries") or []
    country_list = ", ".join(
        {c.get("country") or c.get("countryName") or c.get("countryCode") for c in countries if c}
    )

    if agency:
        reasons.append(f"We have prior experience supporting {agency} and allied UN agencies.")
    if procurement_type:
        reasons.append(f"The {procurement_type} format aligns with our preferred procurement types.")
    if country_list:
        reasons.append(f"Our portfolio covers similar work in {country_list}.")

    top_matches = [match for match in semantic_matches if match.get("sourceTitle")]
    if top_matches:
        titles = ", ".join(match["sourceTitle"] for match in top_matches[:2] if match.get("sourceTitle"))
        reasons.append(f"Semantic match to our documented projects/publications: {titles}.")

    reasons.append(
        f"Structured score {structured_score:.0f} and overall score {total_score:.0f} exceed our acceptance threshold."
    )

    return " ".join(reasons)


def _safe_date(value: Any):
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00")).date()
    except ValueError:
        return None


def _safe_datetime(value: Any):
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


def _safe_number(value: Any):
    if value in (None, ""):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def main() -> None:
    load_dotenv()
    args = parse_args()

    creds = load_yaml(args.creds)
    profile_data = load_yaml(args.config)
    profile = CompanyProfile(**profile_data)
    scoring_config = load_scoring_config()

    db_url = args.db or os.getenv("DATABASE_URL", "sqlite:///data/notices.db")
    ensure_parent(db_url.replace("sqlite:///", ""))

    oauth = OAuthClient(
        OAuthSettings(
            token_url=creds["token_url"],
            client_id=creds["client_id"],
            client_secret=creds["client_secret"],
            scope=creds.get("scope"),
        )
    )
    client = UNGMClient(base_url=creds["api_base"], oauth_client=oauth)
    repository = NoticeRepository(db_url)
    semantic_enabled = scoring_config.get("cache", {}).get("enable_semantic", True)
    semantic_top_k = args.semantic_top_k or scoring_config.get("semantic", {}).get("top_k", 5)
    semantic_matcher = None
    if semantic_enabled:
        try:
            semantic_matcher = SemanticMatcher.from_env(top_k=semantic_top_k)
            if semantic_matcher is None:
                LOGGER.info("Semantic matcher not configured; proceeding without semantic scoring.")
        except Exception as exc:  # pylint: disable=broad-except
            LOGGER.warning("Semantic matcher unavailable: %s", exc)
    else:
        LOGGER.info("Semantic retrieval disabled via configuration.")

    persistence_cfg = scoring_config.get("persistence", {})
    cache_cfg = scoring_config.get("cache", {})
    evaluation_logger: Optional[EvaluationLogger] = None
    if persistence_cfg.get("log_evaluations", False):
        evaluation_logger = EvaluationLogger(
            persistence_cfg.get("evaluation_log_path", "data/evaluations.db"),
            skip_days=cache_cfg.get("skip_if_recent_days", 0),
        )

    LOGGER.info("Fetching notices updated in last %s day(s)", args.days)
    raw_results = client.search_notices(days=args.days)

    notices: List[Notice] = []
    for summary in raw_results:
        notice_id = summary.get("id") or summary.get("noticeId")
        if not notice_id:
            continue
        summary_last_updated = summary.get("lastUpdatedDate") or summary.get("lastUpdated")
        if evaluation_logger and evaluation_logger.should_skip(str(notice_id), summary_last_updated):
            LOGGER.debug("Skipping notice %s due to recent evaluation log", notice_id)
            continue

        detailed = client.get_notice(str(notice_id))
        if should_filter(detailed, profile):
            if evaluation_logger:
                evaluation_logger.record(
                    str(notice_id),
                    status="filtered_rule",
                    score=0,
                    semantic_score=None,
                    last_updated=detailed.get("lastUpdatedDate") or summary_last_updated,
                )
            continue

        structured_score = score_notice(detailed, profile, semantic_similarity=None)

        semantic_matches = []
        semantic_similarity = None
        if semantic_matcher and structured_score >= scoring_config.get("structured", {}).get("min_score", 0):
            try:
                matches = semantic_matcher.match_notice(detailed)
                semantic_matches = [match.to_dict() for match in matches]
                if semantic_matches:
                    semantic_similarity = semantic_matches[0]["score"]
            except Exception as exc:  # pylint: disable=broad-except
                LOGGER.warning("Semantic retrieval failed for notice %s: %s", notice_id, exc)

        if semantic_matches:
            detailed["semanticMatches"] = semantic_matches
        if semantic_similarity is not None:
            detailed["semanticScore"] = semantic_similarity
        detailed["structuredScore"] = structured_score

        total_score = score_notice(detailed, profile, semantic_similarity=semantic_similarity)
        detailed["totalScore"] = total_score

        semantic_min_similarity = scoring_config.get("semantic", {}).get("min_similarity")
        total_min_score = scoring_config.get("total", {}).get("min_score", 0)
        structured_min_score = scoring_config.get("structured", {}).get("min_score", 0)
        store_all = persistence_cfg.get("store_all_notices", True)

        should_store = store_all
        status = "stored"

        if not store_all:
            if structured_score < structured_min_score:
                status = "filtered_structured"
                should_store = False
            elif semantic_min_similarity and semantic_similarity is not None and semantic_similarity < semantic_min_similarity:
                status = "filtered_semantic"
                should_store = False
            elif total_score < total_min_score:
                status = "filtered_total"
                should_store = False

        if evaluation_logger:
            evaluation_logger.record(
                str(notice_id),
                status=status,
                score=total_score,
                semantic_score=semantic_similarity,
                last_updated=detailed.get("lastUpdatedDate") or summary_last_updated,
            )

        if not should_store:
            continue

        notice_model = transform_notice(detailed)
        explanation = build_fit_explanation(
            detailed,
            structured_score=structured_score,
            total_score=total_score,
            semantic_matches=semantic_matches,
        )
        detailed["fitExplanation"] = explanation
        notice_model.fit_score = total_score
        notice_model.raw_json["fitExplanation"] = explanation
        repository.upsert_notice(notice_model)
        notices.append(notice_model)

    notices.sort(key=lambda n: n.fit_score or 0, reverse=True)

    export_json(notices, args.export_json)
    export_csv(notices, args.export_csv)
    render_html_dashboard(notices, args.template_dir, args.export_html)

    LOGGER.info("Processed %d notices", len(notices))
    if args.print:
        for notice in notices[:10]:
            LOGGER.info(
                "Score %s | %s | %s | deadline %s",
                notice.fit_score,
                notice.title,
                notice.agency,
                notice.deadline,
            )


if __name__ == "__main__":
    main()
