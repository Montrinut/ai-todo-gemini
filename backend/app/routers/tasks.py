from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.ai_service import analyze_task, analyze_dashboard
from app.services.notify_service import notify_task_created_line
from app.routers.auth import get_current_user
from typing import List

router = APIRouter()

@router.get("/", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Task).filter(Task.user_id == current_user.id).all()


@router.post("/", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # ให้ AI วิเคราะห์ task
    deadline_str = str(task_data.deadline) if task_data.deadline else "ไม่ระบุ"
    analysis = await analyze_task(
        title=task_data.title,
        description=task_data.description or "",
        deadline=deadline_str
    )

    # สร้าง task พร้อมผล AI
    task = Task(
        title=task_data.title,
        description=task_data.description,
        deadline=task_data.deadline,
        status=task_data.status,
        priority=analysis.get("priority", "medium"),
        category=analysis.get("category", "other"),
        estimated_hours=analysis.get("estimatedHours", 1),
        ai_suggestion=analysis.get("suggestion", ""),
        user_id=current_user.id
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    if current_user.line_id:
        await notify_task_created_line(task, current_user.line_id)

    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for field, value in task_data.dict(exclude_unset=True).items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


@router.post("/analyze-dashboard")
async def dashboard_analysis(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
    result = await analyze_dashboard(tasks)
    return result


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
