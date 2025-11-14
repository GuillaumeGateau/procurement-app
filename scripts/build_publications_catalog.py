"""
Generate `content/publications.json` from the downloaded publications corpus.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional

from bs4 import BeautifulSoup
from pypdf import PdfReader

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLICATIONS_DIR = BASE_DIR / "publications"
OUTPUT_PATH = BASE_DIR / "content" / "publications.json"


@dataclass
class PublicationRecord:
    title: str
    url: str
    summary: Optional[str]
    year: Optional[int]
    type: str

    def to_dict(self) -> dict:
        payload = {
            "title": self.title,
            "url": self.url,
            "type": self.type,
        }
        if self.summary:
            payload["summary"] = self.summary
        if self.year:
            payload["year"] = str(self.year)
        return payload


def load_manifest(path: Path) -> Iterable[dict]:
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def slug_to_title(name: str) -> str:
    stem = Path(name).stem
    stem = re.sub(r"[_\\-]+", " ", stem)
    stem = re.sub(r"\\s+", " ", stem).strip()
    # Preserve acronyms
    words = []
    for word in stem.split():
        if word.isupper() and len(word) <= 4:
            words.append(word)
        else:
            words.append(word.capitalize())
    return " ".join(words)


def extract_year(*candidates: str) -> Optional[int]:
    for text in candidates:
        if not text:
            continue
        match = re.search(r"(20\\d{2}|19\\d{2})", text)
        if match:
            return int(match.group(1))
    return None


def condense_text(text: Optional[str], max_len: int = 260) -> Optional[str]:
    if not text:
        return None
    cleaned = " ".join(text.split())
    if len(cleaned) <= max_len:
        return cleaned
    truncated = cleaned[:max_len].rsplit(" ", 1)[0]
    return truncated + "…"


def summarise_pdf(path: Path) -> Optional[str]:
    try:
        reader = PdfReader(path)
    except Exception:
        return None

    for page in reader.pages[:2]:
        try:
            text = page.extract_text() or ""
        except Exception:
            continue
        text = " ".join(text.split())
        if not text:
            continue
        # grab first sentence-like chunk
        chunks = re.split(r"(?<=[.!?])\\s+", text)
        for chunk in chunks:
            cleaned = chunk.strip()
            if 60 <= len(cleaned) <= 300:
                return cleaned
        if chunks:
            return chunks[0].strip()
    return None


def extract_pdf_title(path: Path) -> Optional[str]:
    try:
        reader = PdfReader(path)
    except Exception:
        return None

    metadata = getattr(reader, "metadata", None) or {}
    meta_title = None
    if isinstance(metadata, dict):
        meta_title = metadata.get("/Title") or metadata.get("title")
    else:
        meta_title = getattr(metadata, "title", None)
    if meta_title:
        cleaned_meta = meta_title.strip()
        if cleaned_meta and len(cleaned_meta.split()) > 1 and not cleaned_meta.lower().startswith("jibfl"):
            return cleaned_meta

    def clean_candidate(raw: str) -> Optional[str]:
        cleaned = re.sub(r"\s+", " ", raw).strip(" .,-")
        if not cleaned:
            return None
        if len(cleaned) < 8 or len(cleaned) > 140:
            return None
        lowered = cleaned.lower()
        if lowered.startswith("butterworths") or lowered.startswith("joint venture agreements"):
            return None
        if lowered.startswith("feature"):
            parts = cleaned.split(" ", 1)
            cleaned = parts[1].strip() if len(parts) > 1 else cleaned
        return cleaned

    for page in reader.pages[:2]:
        try:
            text = page.extract_text() or ""
        except Exception:
            continue
        lines = [line.strip() for line in text.splitlines()]
        for line in lines:
            if not line:
                continue
            feature_match = re.search(r"Feature\s+(.+)", line, re.IGNORECASE)
            if feature_match:
                candidate = clean_candidate(feature_match.group(1))
                if candidate:
                    return candidate
            candidate = clean_candidate(line)
            if candidate:
                return candidate
    return None


def summarise_article(path: Path) -> tuple[str, Optional[str]]:
    html = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    title_tag = soup.find("h1") or soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else slug_to_title(path.name)

    paragraph = soup.find("p")
    summary = None
    if paragraph:
        summary_text = " ".join(paragraph.get_text(separator=" ").split())
        if summary_text:
            summary = summary_text[:300]
    return title, summary


def build_catalog() -> List[PublicationRecord]:
    records: List[PublicationRecord] = []

    # PDFs
    for item in load_manifest(PUBLICATIONS_DIR / "manifest.json"):
        file_path = BASE_DIR / item["file"]
        title = extract_pdf_title(file_path) or slug_to_title(file_path.name)
        year = extract_year(file_path.name, item.get("url", ""))
        summary = condense_text(summarise_pdf(file_path))
        records.append(PublicationRecord(title=title, url=item["url"], summary=summary, year=year, type="pdf"))

    # Articles
    for item in load_manifest(PUBLICATIONS_DIR / "articles" / "manifest.json"):
        html_path = BASE_DIR / item["html_file"]
        title, summary = summarise_article(html_path)
        summary = condense_text(summary)
        year = extract_year(item.get("url", ""), html_path.name)
        records.append(PublicationRecord(title=title, url=item["url"], summary=summary, year=year, type="article"))

    # Sort by year desc then title
    records.sort(key=lambda record: (record.year or 0, record.title), reverse=True)
    return records


def main() -> None:
    records = build_catalog()
    data = [record.to_dict() for record in records]
    OUTPUT_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Wrote {len(records)} publication records to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

