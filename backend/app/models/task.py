from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id          = Column(Integer, primary_key=True, index=True)
    email       = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    line_id     = Column(String, nullable=True)

    tasks       = relationship("Task", back_populates="user")


class Task(Base):
    __tablename__ = "tasks"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    deadline    = Column(DateTime, nullable=True)
    priority    = Column(String, default="medium")   # low / medium / high (AI กำหนด)
    category    = Column(String, default="other")    # work / personal / health / other
    status      = Column(String, default="todo")     # todo / doing / done
    estimated_hours = Column(Integer, nullable=True)
    ai_suggestion   = Column(Text, nullable=True)
    user_id     = Column(Integer, ForeignKey("users.id"))

    user        = relationship("User", back_populates="tasks")
