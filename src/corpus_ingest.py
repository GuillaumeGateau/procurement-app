"""
Build semantic corpus from publications and push embeddings to Pinecone.
"""
from __future__ import annotations

import argparse
import json
import logging
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List

from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone
from pypdf import PdfReader
import tiktoken

LOGGER = logging.getLogger(__name__)

DEFAULT_MAX_TOKENS = 600
DEFAULT_OVERLAP = 100


@dataclass
class DocumentChunk:
    chunk_id: str
    text: str
    metadata: Dict[str, str]


def slugify(value: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()


def extract_text_from_pdf(path: Path) -> str:
    reader = PdfReader(str(path))
    texts: List[str] = []
    for page in reader.pages:
        try:
            content = page.extract_text() or ""
        except Exception:  # pylint: disable=broad-except
            content = ""
        texts.append(content)
    return "\n".join(texts)


def chunk_text(
    text: str,
    max_tokens: int = DEFAULT_MAX_TOKENS,
    overlap_tokens: int = DEFAULT_OVERLAP,
    encoding_name: str = "cl100k_base",
) -> Iterable[str]:
    encoding = tiktoken.get_encoding(encoding_name)
    tokens = encoding.encode(text)
    if not tokens:
        return []
    step = max_tokens - overlap_tokens
    if step <= 0:
        raise ValueError("max_tokens must be greater than overlap_tokens")
    chunks: List[str] = []
    for start in range(0, len(tokens), step):
        window = tokens[start : start + max_tokens]
        chunk = encoding.decode(window).strip()
        if chunk:
            chunks.append(chunk)
    return chunks


def load_manifest(path: Path) -> List[Dict[str, str]]:
    if not path.exists():
        LOGGER.warning("Manifest not found: %s", path)
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def collect_documents(
    base_dir: Path,
    max_tokens: int,
    overlap_tokens: int,
    encoding_name: str = "cl100k_base",
) -> List[DocumentChunk]:
    publications_manifest = load_manifest(base_dir / "publications" / "manifest.json")
    articles_manifest = load_manifest(base_dir / "publications" / "articles" / "manifest.json")

    documents: List[DocumentChunk] = []

    encoding = tiktoken.get_encoding(encoding_name)

    def process_text(
        doc_id: str,
        raw_text: str,
        metadata: Dict[str, str],
    ) -> None:
        chunks = chunk_text(
            raw_text,
            max_tokens=max_tokens,
            overlap_tokens=overlap_tokens,
            encoding_name=encoding_name,
        )
        for index, chunk in enumerate(chunks):
            tokens = encoding.encode(chunk)
            chunk_id = f"{doc_id}-{index:03d}"
            chunk_meta = {
                **metadata,
                "doc_id": doc_id,
                "chunk_index": str(index),
                "chunk_char_count": str(len(chunk)),
                "chunk_token_count": str(len(tokens)),
                "chunk_text": chunk,
            }
            documents.append(DocumentChunk(chunk_id=chunk_id, text=chunk, metadata=chunk_meta))

    for item in publications_manifest:
        path = base_dir / item["file"]
        if not path.exists():
            LOGGER.warning("PDF not found: %s", path)
            continue
        raw_text = extract_text_from_pdf(path)
        doc_id = slugify(path.stem)
        source_title = re.sub(r"[-_]+", " ", path.stem).strip().title()
        metadata = {
            "source_type": "publication_pdf",
            "source_url": item.get("url", ""),
            "source_path": str(path.relative_to(base_dir)),
            "file_name": path.name,
            "source_title": source_title,
        }
        process_text(doc_id, raw_text, metadata)

    for item in articles_manifest:
        text_path = base_dir / item["text_file"]
        if not text_path.exists():
            LOGGER.warning("Article text not found: %s", text_path)
            continue
        raw_text = text_path.read_text(encoding="utf-8")
        doc_id = slugify(Path(item["text_file"]).stem)
        source_title = re.sub(r"[-_]+", " ", Path(item["text_file"]).stem).strip().title()
        metadata = {
            "source_type": "publication_article",
            "source_url": item.get("url", ""),
            "source_path": item.get("text_file", ""),
            "file_name": Path(item.get("html_file", "")).name,
            "source_title": source_title,
        }
        process_text(doc_id, raw_text, metadata)

    LOGGER.info("Prepared %s chunks from corpus", len(documents))
    return documents


def embed_chunks(
    client: OpenAI,
    model: str,
    chunks: List[DocumentChunk],
    batch_size: int = 32,
) -> List[Dict]:
    vectors: List[Dict] = []
    for start in range(0, len(chunks), batch_size):
        batch = chunks[start : start + batch_size]
        texts = [chunk.text for chunk in batch]
        LOGGER.info("Embedding batch %s - %s", start, start + len(batch))
        response = client.embeddings.create(model=model, input=texts)
        for chunk, embedding in zip(batch, response.data):
            vectors.append(
                {
                    "id": chunk.chunk_id,
                    "values": embedding.embedding,
                    "metadata": {**chunk.metadata, "embedding_model": model},
                }
            )
    return vectors


def upsert_vectors(index, vectors: List[Dict], batch_size: int = 100) -> None:
    for start in range(0, len(vectors), batch_size):
        batch = vectors[start : start + batch_size]
        LOGGER.info("Upserting batch %s - %s", start, start + len(batch))
        index.upsert(vectors=batch)


def main() -> None:
    parser = argparse.ArgumentParser(description="Ingest publications corpus into Pinecone")
    parser.add_argument("--base-dir", default=".", help="Project base directory")
    parser.add_argument("--max-tokens", type=int, default=DEFAULT_MAX_TOKENS)
    parser.add_argument("--overlap", type=int, default=DEFAULT_OVERLAP)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

    load_dotenv()

    pinecone_api_key = os.getenv("PINECONE_API_KEY")
    pinecone_env = os.getenv("PINECONE_ENVIRONMENT")
    pinecone_index = os.getenv("PINECONE_INDEX_NAME")
    embedding_model = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")

    documents = collect_documents(
        base_dir=Path(args.base_dir),
        max_tokens=args.max_tokens,
        overlap_tokens=args.overlap,
    )
    if not documents:
        LOGGER.warning("No documents found to process")
        return

    encoding = tiktoken.get_encoding("cl100k_base")
    tokens_per_doc = sum(len(encoding.encode(chunk.text)) for chunk in documents)
    LOGGER.info("Total token count across chunks: %s", tokens_per_doc)

    if args.dry_run:
        LOGGER.info("Dry run complete - skipping embedding/upsert")
        return

    if not pinecone_api_key or not pinecone_env or not pinecone_index:
        raise RuntimeError("Pinecone credentials not fully configured in environment variables")

    openai_client = OpenAI()
    pc = Pinecone(api_key=pinecone_api_key)
    index = pc.Index(pinecone_index)

    vectors = embed_chunks(
        client=openai_client,
        model=embedding_model,
        chunks=documents,
        batch_size=args.batch_size,
    )
    upsert_vectors(index, vectors)
    LOGGER.info("Ingestion complete. Total vectors upserted: %s", len(vectors))


if __name__ == "__main__":
    main()

