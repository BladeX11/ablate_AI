from celery import Celery
import os

# Use SQLite for the broker and results in zero-config demo environments
# This removes the dependency on a local Redis/RabbitMQ instance
CELERY_BROKER_URL = "sqla+sqlite:///celery_broker.db"
CELERY_RESULT_BACKEND = "db+sqlite:///celery_results.db"

celery_app = Celery(
    "ablate_tasks",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
    include=["tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    worker_concurrency=1, # Solo pool for Windows compatibility
)
