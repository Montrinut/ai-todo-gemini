from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import tasks, auth
from app.routers.line_webhook import router as line_router
from app.jobs.scheduler import start_scheduler
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Todo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://bountiful-alignment-production-c724.up.railway.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(line_router, tags=["line"])

@app.on_event("startup")
async def startup():
    start_scheduler()

@app.get("/")
def root():
    return {"message": "AI Todo API is running 🚀"}
