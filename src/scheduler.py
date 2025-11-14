"""Optional APScheduler-based daily job."""
from __future__ import annotations

import logging
from datetime import datetime

from apscheduler.schedulers.blocking import BlockingScheduler

from .main import main

LOGGER = logging.getLogger(__name__)


def run_daily(hour: int = 6, minute: int = 0):
    scheduler = BlockingScheduler(timezone="UTC")

    @scheduler.scheduled_job("cron", hour=hour, minute=minute)
    def _job():
        LOGGER.info("Starting scheduled UNGM job at %s", datetime.utcnow())
        try:
            main()
        except Exception as exc:  # pylint: disable=broad-except
            LOGGER.exception("UNGM scheduled job failed: %s", exc)

    LOGGER.info("Scheduler running. Press Ctrl+C to exit.")
    scheduler.start()


if __name__ == "__main__":
    run_daily()
