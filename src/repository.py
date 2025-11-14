"""Persistence helpers for notice ingestion."""
from __future__ import annotations

from contextlib import contextmanager
from typing import Iterable, List

from sqlalchemy import create_engine
from sqlalchemy.dialects.sqlite import insert as sqlite_upsert
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, sessionmaker

from .models import Base, Notice, NoticeCountry, NoticeDocument, NoticeUNSPSC


class NoticeRepository:
    def __init__(self, db_url: str):
        self.engine = create_engine(db_url, echo=False, future=True)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine, expire_on_commit=False, future=True)

    @contextmanager
    def session_scope(self) -> Iterable[Session]:
        session = self.Session()
        try:
            yield session
            session.commit()
        except SQLAlchemyError:
            session.rollback()
            raise
        finally:
            session.close()

    def upsert_notice(self, notice: Notice) -> None:
        with self.session_scope() as session:
            data = {
                column.name: getattr(notice, column.name)
                for column in Notice.__table__.columns
            }
            stmt = sqlite_upsert(Notice).values(**data)
            stmt = stmt.on_conflict_do_update(
                index_elements=[Notice.id],
                set_={
                    column.name: getattr(notice, column.name)
                    for column in Notice.__table__.columns
                    if column.name != "id"
                },
            )
            session.execute(stmt)

            session.query(NoticeDocument).filter_by(notice_id=notice.id).delete()
            session.query(NoticeUNSPSC).filter_by(notice_id=notice.id).delete()
            session.query(NoticeCountry).filter_by(notice_id=notice.id).delete()

            session.add_all(notice.documents)
            session.add_all(notice.unspsc)
            session.add_all(notice.countries)

    def fetch_all(self) -> List[Notice]:
        with self.session_scope() as session:
            return session.query(Notice).order_by(Notice.fit_score.desc()).all()
