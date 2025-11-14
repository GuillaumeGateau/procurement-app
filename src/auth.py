"""OAuth client for UNGM API."""
from __future__ import annotations

import time
from typing import Optional

import requests
from pydantic import BaseModel, Field


class OAuthSettings(BaseModel):
    token_url: str = Field(..., alias="token_url")
    client_id: str = Field(..., alias="client_id")
    client_secret: str = Field(..., alias="client_secret")
    scope: Optional[str] = None


class TokenCache(BaseModel):
    access_token: str
    expires_at: float


class OAuthClient:
    """Thin OAuth client credential helper with in-memory caching."""

    def __init__(self, settings: OAuthSettings):
        self.settings = settings
        self._cache: Optional[TokenCache] = None

    def get_token(self) -> str:
        """Return a valid bearer token, refreshing if necessary."""
        if self._cache and self._cache.expires_at > time.time() + 60:
            return self._cache.access_token

        data = {
            "grant_type": "client_credentials",
            "client_id": self.settings.client_id,
            "client_secret": self.settings.client_secret,
        }
        if self.settings.scope:
            data["scope"] = self.settings.scope

        response = requests.post(
            self.settings.token_url,
            data=data,
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()

        self._cache = TokenCache(
            access_token=payload["access_token"],
            expires_at=time.time() + payload.get("expires_in", 3600),
        )
        return self._cache.access_token
