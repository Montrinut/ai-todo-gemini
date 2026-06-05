from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, date
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo.db")

# SQLite ต้องใส่ connect_args เพิ่ม
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_tasks_due_today(db):
    from app.models.task import Task
    today = date.today()
    return db.query(Task).filter(
        Task.deadline >= datetime.combine(today, datetime.min.time()),
        Task.deadline < datetime.combine(today, datetime.max.time()),
        Task.status != "done"
    ).all()

def get_overdue_tasks(db):
    from app.models.task import Task
    return db.query(Task).filter(
        Task.deadline < datetime.now(),
        Task.status != "done"
    ).all()
