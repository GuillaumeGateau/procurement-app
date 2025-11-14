"""Utility functions for saving and presenting notice results."""
from __future__ import annotations

import csv
import json
import os
from datetime import datetime
from typing import Iterable, List

from jinja2 import Environment, FileSystemLoader, TemplateNotFound

from .models import Notice


def export_json(notices: Iterable[Notice], path: str) -> None:
    data = [notice.raw_json for notice in notices]
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2, default=str)


def export_csv(notices: Iterable[Notice], path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    columns = [
        "id",
        "title",
        "summary",
        "agency",
        "procurement_type",
        "deadline",
        "publish_date",
        "status",
        "fit_score",
        "budget_min",
        "budget_max",
        "currency",
    ]
    with open(path, "w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(columns)
        for n in notices:
            writer.writerow([getattr(n, column, "") for column in columns])


def render_email_body(notices: List[Notice], limit: int = 10) -> str:
    lines = ["Daily UNGM Tender Summary", ""]
    for notice in notices[:limit]:
        lines.append(
            f"[{notice.fit_score:>3}] {notice.title} | {notice.agency} | deadline {notice.deadline}"
        )
    return "\n".join(lines)


def render_html_dashboard(notices: List[Notice], template_dir: str, output_path: str) -> None:
    try:
        env = Environment(loader=FileSystemLoader(template_dir))
        template = env.get_template("dashboard.html")
    except TemplateNotFound:
        raise FileNotFoundError("dashboard.html template not found in template directory")

    html = template.render(
        notices=notices,
        generated=datetime.utcnow(),
    )
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as handle:
        handle.write(html)
