from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routers import jobs
import models
from database import engine, get_db
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Ablate AI Backend API",
    description="A Self-Healing Enterprise Machine Unlearning & MLOps Platform",
    version="1.0.0"
)

# Allow CORS for the dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Ablate AI API"}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Aggregate metrics for the enterprise dashboard KPIs.
    """
    total_jobs = db.query(models.Job).count()
    active_jobs = db.query(models.Job).filter(models.Job.status.notin_(["COMPLETED", "FAILED"])).count()
    
    return {
        "active_models": 12,
        "active_jobs": active_jobs,
        "risk_alerts": 1, 
        "compliance_score": "98%",
        "infrastructure_health": {
            "gpu_load": 62,
            "memory_usage": 45,
            "queue_status": "Low"
        }
    }

@app.get("/api/reports/export")
async def export_jobs_report(db: Session = Depends(get_db)):
    """
    Generates a CSV report of all unlearning jobs.
    """
    import csv
    import io
    from fastapi.responses import StreamingResponse

    jobs = db.query(models.Job).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Job ID", "Status", "Type", "Target", "Created At", "Completed At"])
    
    for job in jobs:
        created_str = job.created_at.strftime("%Y-%m-%d %H:%M:%S") if job.created_at else "N/A"
        completed_str = job.completed_at.strftime("%Y-%m-%d %H:%M:%S") if job.completed_at else "N/A"
        writer.writerow([job.id, job.status, job.job_type, job.target_data, created_str, completed_str])
    
    output.seek(0)
    response = StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=ablate_jobs_report.csv"
    return response
