from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

OUTPUT_PATH = Path("output/notices.json")


def _load_notices() -> List[Dict[str, Any]]:
    if not OUTPUT_PATH.exists():
        return []
    try:
        return json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail="Failed to parse notices file") from exc


app = FastAPI(title="Procurement App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/opportunities")
async def opportunities() -> Dict[str, List[Dict[str, Any]]]:
    return {"notices": _load_notices()}

