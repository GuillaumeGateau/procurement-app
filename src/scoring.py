"""Tender fit scoring logic."""
from __future__ import annotations

import math
from datetime import datetime, timezone
from typing import Dict, List, Sequence, Optional

from pydantic import BaseModel


class CompanyProfile(BaseModel):
    primary_service_categories: Sequence[str] = ()
    unspsc_codes: Sequence[str] = ()
    keywords: Sequence[str] = ()
    geographies: Dict[str, Sequence[str]] = {}
    preferred_procurement_types: Sequence[str] = ()
    min_contract_value: int = 0
    max_contract_value: int = 10_000_000
    preferred_agencies: Sequence[str] = ()
    required_qualifications: Sequence[str] = ()
    deadline_min_days: int = 3


def score_notice(
    notice: Dict,
    profile: CompanyProfile,
    semantic_similarity: Optional[float] = None,
) -> int:
    score = 0.0
    title = (notice.get("title") or "").lower()
    desc = (notice.get("summary") or notice.get("description") or "").lower()

    # Keyword matching (25 pts)
    keyword_hits = sum(1 for kw in profile.keywords if kw.lower() in title or kw.lower() in desc)
    score += min(25, keyword_hits * 5)

    # UNSPSC overlap (20 pts)
    notice_codes = {c.get("code", "")[:4] for c in notice.get("unspsc", []) if c.get("code")}
    company_codes = {code[:4] for code in profile.unspsc_codes}
    if company_codes:
        overlap = len(notice_codes & company_codes)
        score += 20 * overlap / len(company_codes)

    # Geography (15 pts)
    geography_score = 0
    target_countries = set(profile.geographies.get("countries", []))
    notice_countries = {c.get("countryCode") for c in notice.get("countries", []) if c.get("countryCode")}
    if notice_countries and target_countries:
        if notice_countries & target_countries:
            geography_score = 15
    elif profile.geographies.get("regions"):
        for region in profile.geographies["regions"]:
            if region.lower() in desc:
                geography_score = 10
                break
    score += geography_score

    # Agency match (10 pts)
    if notice.get("agency") in profile.preferred_agencies:
        score += 10

    # Procurement type fit (10 pts)
    if profile.preferred_procurement_types and notice.get("procurementType") in profile.preferred_procurement_types:
        score += 10

    # Deadline buffer (10 pts)
    deadline_str = notice.get("deadline")
    if deadline_str:
        try:
            deadline = datetime.fromisoformat(deadline_str.replace("Z", "+00:00"))
            days_left = (deadline - datetime.now(timezone.utc)).days
            if days_left >= profile.deadline_min_days:
                score += min(10, max(0, days_left))
        except ValueError:
            pass

    # Qualifications (5 pts)
    qual_hits = sum(1 for req in profile.required_qualifications if req.lower() in desc)
    score += min(5, qual_hits * 2)

    # Budget fit (5 pts)
    min_val = notice.get("budget", {}).get("min") or notice.get("budgetMin")
    max_val = notice.get("budget", {}).get("max") or notice.get("budgetMax")
    if min_val and max_val:
        try:
            min_val = float(min_val)
            max_val = float(max_val)
            if min_val >= profile.min_contract_value and max_val <= profile.max_contract_value:
                score += 5
        except (TypeError, ValueError):
            pass

    # Semantic similarity (15 pts)
    if semantic_similarity is not None:
        score += min(15, max(0, semantic_similarity) * 15)

    return max(0, min(100, math.floor(score)))


def should_filter(notice: Dict, profile: CompanyProfile) -> bool:
    """Return True if notice should be excluded before scoring."""
    deadline_str = notice.get("deadline")
    if deadline_str:
        try:
            deadline = datetime.fromisoformat(deadline_str.replace("Z", "+00:00"))
            days_left = (deadline - datetime.now(timezone.utc)).days
            if days_left < profile.deadline_min_days:
                return True
        except ValueError:
            pass

    if profile.preferred_procurement_types:
        if notice.get("procurementType") not in profile.preferred_procurement_types:
            return True

    target_countries = set(profile.geographies.get("countries", []))
    if target_countries:
        notice_countries = {c.get("countryCode") for c in notice.get("countries", []) if c.get("countryCode")}
        if notice_countries and not (notice_countries & target_countries):
            return True

    return False
