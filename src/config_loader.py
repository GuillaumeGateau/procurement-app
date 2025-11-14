"""
Helpers for loading scoring configuration.
"""
from __future__ import annotations

import copy
from pathlib import Path
from typing import Any, Dict

import yaml


DEFAULT_SCORING_CONFIG: Dict[str, Any] = {
    "semantic": {
        "top_k": 5,
        "min_similarity": 0.0,
    },
    "structured": {
        "min_score": 0,
    },
    "total": {
        "min_score": 0,
    },
    "persistence": {
        "store_all_notices": True,
        "log_evaluations": False,
        "evaluation_log_path": "data/evaluations.db",
    },
    "cache": {
        "skip_if_recent_days": 0,
        "enable_semantic": True,
    },
}


def deep_update(base: Dict[str, Any], overrides: Dict[str, Any]) -> Dict[str, Any]:
    """
    Recursively merge dictionaries.
    """
    result = copy.deepcopy(base)
    for key, value in overrides.items():
        if isinstance(value, dict) and key in result and isinstance(result[key], dict):
            result[key] = deep_update(result[key], value)
        else:
            result[key] = value
    return result


def load_scoring_config(path: str = "config/scoring.yaml") -> Dict[str, Any]:
    """
    Load scoring configuration from YAML, falling back to defaults.
    """
    config_path = Path(path)
    if not config_path.exists():
        return copy.deepcopy(DEFAULT_SCORING_CONFIG)
    with config_path.open("r", encoding="utf-8") as handle:
        loaded = yaml.safe_load(handle) or {}
    return deep_update(DEFAULT_SCORING_CONFIG, loaded)


