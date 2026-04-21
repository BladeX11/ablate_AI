from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UnlearnRequest(BaseModel):
    job_type: str # COMPLIANCE_DELETION or PERFORMANCE_TUNING
    target_data: str

class VerificationMetricResponse(BaseModel):
    baseline_mmlu: Optional[float]
    post_unlearn_mmlu: Optional[float]
    mia_success_rate: Optional[float]
    recall_rate: Optional[float]
    crypto_hash: Optional[str]

    class Config:
        from_attributes = True

class JobResponse(BaseModel):
    id: int
    job_type: str
    target_data: str
    status: str
    filename: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime]
    metrics: Optional[VerificationMetricResponse] = None

    class Config:
        from_attributes = True
