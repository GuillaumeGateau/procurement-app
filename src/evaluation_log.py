"""
Evaluation logging and caching utilities.
"""
from __future__ import annotations

import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional


ISO_FORMAT = "%Y-%m-%dT%H:%M:%S%z"


def _normalize_iso(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    value = value.strip()
    if value.endswith("Z"):
        value = value.replace("Z", "+00:00")
    if "+" not in value[1:]:
        value = f"{value}+00:00"
    return value


class EvaluationLogger:
    """
    Lightweight SQLite-backed log to avoid re-evaluating notices unnecessarily.
    """

    def __init__(self, db_path: str, skip_days: int = 0) -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.skip_days = skip_days
        self._init()

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.db_path)

    def _init(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS evaluations (
                    notice_id TEXT PRIMARY KEY,
                    last_evaluated TEXT NOT NULL,
                    last_updated TEXT,
                    status TEXT,
                    score REAL,
                    semantic_score REAL
                )
                """
            )
            conn.commit()

    def should_skip(self, notice_id: str, last_updated: Optional[str]) -> bool:
        if not self.skip_days:
            return False
        normalized_updated = _normalize_iso(last_updated)
        with self._connect() as conn:
            row = conn.execute(
                "SELECT last_evaluated, last_updated FROM evaluations WHERE notice_id = ?",
                (notice_id,),
            ).fetchone()
        if not row:
            return False
        last_evaluated_iso, stored_updated = row
        try:
            last_evaluated = datetime.fromisoformat(last_evaluated_iso)
        except ValueError:
            return False
        if normalized_updated and stored_updated and normalized_updated != stored_updated:
            return False
        if datetime.utcnow() - last_evaluated < timedelta(days=self.skip_days):
            return True
        return False

    def record(
        self,
        notice_id: str,
        status: str,
        score: float,
        semantic_score: Optional[float],
        last_updated: Optional[str],
    ) -> None:
        now_iso = datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
        normalized_updated = _normalize_iso(last_updated)
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO evaluations (notice_id, last_evaluated, last_updated, status, score, semantic_score)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(notice_id) DO UPDATE SET
                    last_evaluated = excluded.last_evaluated,
                    last_updated = excluded.last_updated,
                    status = excluded.status,
                    score = excluded.score,
                    semantic_score = excluded.semantic_score
                """,
                (
                    notice_id,
                    now_iso,
                    normalized_updated,
                    status,
                    float(score) if score is not None else None,
                    float(semantic_score) if semantic_score is not None else None,
                ),
            )
            conn.commit()


