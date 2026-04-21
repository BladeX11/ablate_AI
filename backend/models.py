from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_type = Column(String, index=True) # COMPLIANCE_DELETION or PERFORMANCE_TUNING
    target_data = Column(String) # E.g., "John Doe"
    status = Column(String, default="RECEIVED") # RECEIVED, HOT_SHIELD_DEPLOYED, PURGING_DB, UNLEARNING, VERIFYING, COMPLETED, FAILED
    filename = Column(String, nullable=True) # Original uploaded filename
    auto_detect = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

class VerificationMetric(Base):
    __tablename__ = "verification_metrics"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    baseline_mmlu = Column(Float)
    post_unlearn_mmlu = Column(Float)
    mia_success_rate = Column(Float) # Membership Inference Attack success rate
    recall_rate = Column(Float)
    crypto_hash = Column(String, nullable=True) # SHA-256 string for the certificate
