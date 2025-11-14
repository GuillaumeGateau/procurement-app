"""UNGM Notice API client."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

import requests
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential

NOTICE_SEARCH_ENDPOINT = "/notice/search"
NOTICE_GET_ENDPOINT = "/notice"
NOTICE_BY_KEY_ENDPOINT = "/notice/key"


class UNGMClient:
    def __init__(self, base_url: str, oauth_client):
        self.base_url = base_url.rstrip("/")
        self.oauth_client = oauth_client

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.oauth_client.get_token()}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

    @retry(
        retry=retry_if_exception_type(requests.RequestException),
        wait=wait_exponential(multiplier=1, min=1, max=32),
        stop=stop_after_attempt(5),
        reraise=True,
    )
    def _post(self, path: str, json_payload: Dict[str, Any]) -> Dict[str, Any]:
        response = requests.post(
            f"{self.base_url}{path}",
            json=json_payload,
            headers=self._headers(),
            timeout=60,
        )
        if response.status_code == 429 and "Retry-After" in response.headers:
            raise requests.HTTPError("Rate limited", response=response)
        response.raise_for_status()
        return response.json()

    @retry(
        retry=retry_if_exception_type(requests.RequestException),
        wait=wait_exponential(multiplier=1, min=1, max=32),
        stop=stop_after_attempt(5),
        reraise=True,
    )
    def _get(self, path: str) -> Dict[str, Any]:
        response = requests.get(
            f"{self.base_url}{path}",
            headers=self._headers(),
            timeout=60,
        )
        if response.status_code == 429 and "Retry-After" in response.headers:
            raise requests.HTTPError("Rate limited", response=response)
        response.raise_for_status()
        return response.json()

    def search_notices(self, days: int = 1, page_size: int = 100) -> List[Dict[str, Any]]:
        since = datetime.now(timezone.utc) - timedelta(days=days)
        payload: Dict[str, Any] = {
            "lastUpdatedDateFrom": since.isoformat(),
            "pageSize": page_size,
            "pageNumber": 1,
            "sort": {"name": "lastUpdatedDate", "order": "desc"},
        }

        results: List[Dict[str, Any]] = []
        while True:
            data = self._post(NOTICE_SEARCH_ENDPOINT, payload)
            items = data.get("items", [])
            results.extend(items)
            total = data.get("totalItems", len(items))
            if len(results) >= total or not items:
                break
            payload["pageNumber"] += 1
        return results

    def get_notice(self, notice_id: str) -> Dict[str, Any]:
        return self._get(f"{NOTICE_GET_ENDPOINT}/{notice_id}")

    def get_notice_by_key(self, notice_key: str) -> Dict[str, Any]:
        return self._get(f"{NOTICE_BY_KEY_ENDPOINT}/{notice_key}")
