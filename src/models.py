"""SQLAlchemy ORM models for UNGM notices."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    JSON,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Notice(Base):
    __tablename__ = "notices"

    id = Column(String, primary_key=True)
    title = Column(Text)
    summary = Column(Text)
    description = Column(Text)
    procurement_category = Column(String(50))
    procurement_type = Column(String(50))
    agency = Column(String(120))
    deadline = Column(Date)
    publish_date = Column(DateTime)
    status = Column(String(50))
    budget_min = Column(Numeric)
    budget_max = Column(Numeric)
    currency = Column(String(10))
    raw_json = Column(JSON)
    fit_score = Column(Integer)
    search_embedding = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    documents = relationship("NoticeDocument", cascade="all, delete-orphan")
    unspsc = relationship("NoticeUNSPSC", cascade="all, delete-orphan")
    countries = relationship("NoticeCountry", cascade="all, delete-orphan")


class NoticeDocument(Base):
    __tablename__ = "notice_documents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    notice_id = Column(String, ForeignKey("notices.id", ondelete="CASCADE"))
    url = Column(Text)
    name = Column(Text)
    type = Column(String(50))


class NoticeUNSPSC(Base):
    __tablename__ = "notice_unspsc"

    id = Column(Integer, primary_key=True, autoincrement=True)
    notice_id = Column(String, ForeignKey("notices.id", ondelete="CASCADE"))
    code = Column(String(20))
    description = Column(Text)


class NoticeCountry(Base):
    __tablename__ = "notice_countries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    notice_id = Column(String, ForeignKey("notices.id", ondelete="CASCADE"))
    country_code = Column(String(10))
    country_name = Column(String(120))
