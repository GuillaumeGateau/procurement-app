"""
Semantic retrieval utilities using Pinecone and OpenAI embeddings.
"""
from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from typing import Dict, List, Optional

from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone

LOGGER = logging.getLogger(__name__)


@dataclass
class SemanticMatch:
    score: float
    source_title: Optional[str]
    source_url: Optional[str]
    source_type: Optional[str]
    doc_id: Optional[str]
    chunk_index: Optional[str]
    chunk_text: Optional[str]

    def to_dict(self) -> Dict[str, Optional[str]]:
        return {
            "score": self.score,
            "sourceTitle": self.source_title,
            "sourceUrl": self.source_url,
            "sourceType": self.source_type,
            "docId": self.doc_id,
            "chunkIndex": self.chunk_index,
            "chunkText": self.chunk_text,
        }


class SemanticMatcher:
    """
    Wrapper around Pinecone + OpenAI to retrieve relevant expertise snippets for a notice.
    """

    def __init__(
        self,
        pinecone_client: Pinecone,
        pinecone_index: str,
        openai_client: OpenAI,
        embedding_model: str,
        top_k: int = 5,
        namespace: Optional[str] = None,
    ) -> None:
        self.pinecone_client = pinecone_client
        self.index = pinecone_client.Index(pinecone_index)
        self.openai_client = openai_client
        self.embedding_model = embedding_model
        self.top_k = top_k
        self.namespace = namespace

    @classmethod
    def from_env(cls, top_k: int = 5) -> Optional["SemanticMatcher"]:
        load_dotenv()
        pinecone_api_key = os.getenv("PINECONE_API_KEY")
        pinecone_index_name = os.getenv("PINECONE_INDEX_NAME")
        embedding_model = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")

        if not pinecone_api_key or not pinecone_index_name:
            LOGGER.info("Pinecone credentials missing; semantic matcher disabled.")
            return None

        pinecone_client = Pinecone(api_key=pinecone_api_key)
        openai_client = OpenAI()
        return cls(
            pinecone_client=pinecone_client,
            pinecone_index=pinecone_index_name,
            openai_client=openai_client,
            embedding_model=embedding_model,
            top_k=top_k,
        )

    def _embed_text(self, text: str) -> List[float]:
        response = self.openai_client.embeddings.create(
            model=self.embedding_model,
            input=[text],
        )
        return response.data[0].embedding

    def match_notice(self, notice_payload: Dict) -> List[SemanticMatch]:
        text_parts = [
            notice_payload.get("title"),
            notice_payload.get("summary"),
            notice_payload.get("description"),
        ]
        query_text = " ".join(part for part in text_parts if part)
        if not query_text.strip():
            return []

        vector = self._embed_text(query_text)
        query_kwargs = {
            "vector": vector,
            "top_k": self.top_k,
            "include_metadata": True,
        }
        if self.namespace:
            query_kwargs["namespace"] = self.namespace

        response = self.index.query(**query_kwargs)
        matches: List[SemanticMatch] = []
        if not response.matches:
            return matches

        for match in response.matches:
            metadata = match.metadata or {}
            matches.append(
                SemanticMatch(
                    score=match.score or 0.0,
                    source_title=metadata.get("source_title"),
                    source_url=metadata.get("source_url"),
                    source_type=metadata.get("source_type"),
                    doc_id=metadata.get("doc_id"),
                    chunk_index=metadata.get("chunk_index"),
                    chunk_text=metadata.get("chunk_text"),
                )
            )
        return matches


