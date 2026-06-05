from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.services.notify_service import (
    notify_overdue_line,
    notify_daily_summary_line,
    notify_evening_line,
)
from app.services.ai_service import generate_daily_summary
from app.database import SessionLocal, get_tasks_due_today, get_overdue_tasks
from app.models.task import User, Task
from datetime import date, datetime

scheduler = AsyncIOScheduler(timezone="Asia/Bangkok")


def _users_with_line(db):
    return db.query(User).filter(User.line_id != None, User.line_id != "").all()


def _tasks_due_today_for_user(db, user_id: int):
    today = date.today()
    return db.query(Task).filter(
        Task.user_id == user_id,
        Task.deadline >= datetime.combine(today, datetime.min.time()),
        Task.deadline < datetime.combine(today, datetime.max.time()),
        Task.status != "done",
    ).all()


def _overdue_tasks_for_user(db, user_id: int):
    return db.query(Task).filter(
        Task.user_id == user_id,
        Task.deadline < datetime.now(),
        Task.status != "done",
    ).all()


def start_scheduler():

    @scheduler.scheduled_job("cron", hour=8, minute=0)
    async def daily_summary():
        db = SessionLocal()
        try:
            for user in _users_with_line(db):
                tasks = _tasks_due_today_for_user(db, user.id)
                summary = await generate_daily_summary(tasks)
                await notify_daily_summary_line(tasks, summary, user.line_id)
        finally:
            db.close()
        print("[OK] Daily summary sent")

    @scheduler.scheduled_job("interval", hours=1)
    async def check_overdue():
        db = SessionLocal()
        try:
            for user in _users_with_line(db):
                overdue = _overdue_tasks_for_user(db, user.id)
                if overdue:
                    await notify_overdue_line(overdue, user.line_id)
        finally:
            db.close()
        print("[OK] Overdue check done")

    @scheduler.scheduled_job("cron", hour=18, minute=0)
    async def evening_reminder():
        db = SessionLocal()
        try:
            for user in _users_with_line(db):
                tasks = _tasks_due_today_for_user(db, user.id)
                await notify_evening_line(tasks, user.line_id)
        finally:
            db.close()
        print("[OK] Evening reminder sent")

    scheduler.start()
    print("[OK] Scheduler started")
