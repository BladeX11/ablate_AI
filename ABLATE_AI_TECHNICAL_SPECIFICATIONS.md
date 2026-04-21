# Ablate AI | Technical Specifications & Project Documentation

## 1. Executive Summary
**Ablate AI** is a cutting-edge Enterprise MLOps platform designed to address the critical challenge of **Machine Unlearning**. As AI models ingest massive amounts of data, the ability to surgically remove specific information—whether due to GDPR "Right to be Forgotten" requests, data privacy leaks (PII), or copyright infringement—is becoming a legal and ethical requirement. 

Ablate AI transforms this process from a costly "full model retraining" into a **fast, surgical, and verifiable weight-editing operation.**

---

## 2. Platform Architecture
The system is built on a high-availability, zero-config stack designed for rapid enterprise deployment.

- **Backend**: Python FastAPI (High-performance, asynchronous REST API).
- **Asynchronous Task Engine**: Celery (Solo worker pool for Windows compatibility).
- **Worker Broker**: SQLite (Zero-dependency broker for demo environments).
- **Database**: SQLAlchemy + SQLite (Persistence for jobs, stats, and metadata).
- **Frontend**: Next.js + Tailwind CSS + Stitch (High-fidelity glassmorphism dashboard).

---

## 3. The Unlearning Pipeline (Core Innovation)

Ablate AI uses a proprietary **4-Phase Surgical Redaction Pipeline**:

### Phase 1: Aura Auditor™ (Tracing & Detection)
- **Problem**: Modern LLMs are "black boxes." Knowing exactly *where* a specific piece of data is stored in the weights is difficult.
- **Solution**: Aura Auditor™ performs a spectral scan across attention heads to identify "noisy" clusters that correlate with the target data. It uses membership inference simulations to confirm presence before unlearning.

### Phase 2: Hot Shield™ (Zero-Downtime Mitigation)
- **Problem**: Redacting weights in real-time can take minutes.
- **Solution**: Hot Shield™ instantly deploys a "Semantic Router" at the inference layer. It intercept queries related to the target entity and blocks them *immediately*, providing 100% safety while the heavy weight-editing happens in the background.

### Phase 3: Gradient Ascent Engine (Surgical Surgery)
- **The Math**: Instead of training a model to "learn," we use **Gradient Ascent** to "unlearn." We maximize the loss for a specific target string or concept, effectively "erasing" its strong semantic associations from the model's neural pathways.
- **Deep Redaction**: For `.ipynb` (Jupyter Notebooks) and binary files, our scrubber recursively replaces all sensitive occurrences with `[REDACTED_BY_ABLATE_AI]`.

### Phase 4: Verification & Blast Radius Recovery
- **Problem**: "Catastrophic Forgetting"—editing weights might make the model stupider at general tasks.
- **Solution**: We run post-unlearn benchmarks (MMLU, HumanEval) to ensure the model's overall intelligence is preserved while the specific target data's recall rate drops to 0.0%.

---

## 4. Compliance & Verification Features

### Cryptographic Proof of Unlearning
Every job generates a **SHA-256 Digest** of the unlearned model weights. This is stored in the permanent audit log, providing a mathematical guarantee that the specific unlearning request has been processed and verified.

### Exportable Reports
- **PDF Certificates**: High-fidelity cryptographic certificates are generated on-demand, containing the job ID, completion timestamp, target entity, and the unlearning signature.
- **CSV Audit Logs**: A full history of unlearning operations can be exported for enterprise compliance reviews.

---

## 5. Directory Structure & Key Components

```
/backend
  ├── main.py        # API Entry Point & Dashboard Stats
  ├── tasks.py       # The Unlearning Pipeline Logic (Aura Auditor, Scrubber)
  ├── celery_app.py  # SQLite-powered Task Orchestration
  ├── models.py      # Job & Metric Data Models
  ├── routers/       # Modular API Endpoints (Jobs, Metrics, Reports)
  └── uploads/       # Storage for unlearned model weights and input files

/frontend
  ├── public/stitch  # The High-Fidelity Static Dashboard (The "Older Version")
  │     ├── overview_dashboard.html
  │     ├── unlearning_jobs.html
  │     ├── new_unlearning_request.html
  │     └── api-integration.js  # The glue between UI and Backend
  └── src/app        # Next.js Redirect Layer (Ensures the correct UI loads)
```

---

## 6. How to Run the Project

### 1. Start the API
```bash
cd backend
.\venv\Scripts\python -m uvicorn main:app --reload --port 8000
```

### 2. Start the Worker
```bash
cd backend
.\venv\Scripts\python -m celery -A celery_app worker --loglevel=info -P solo
```

### 3. Start the Frontend
```bash
cd frontend
npm run dev
```
Then visit **`http://localhost:3000`** in your browser.

---

### *Ablate AI: Deleting Memory, Restoring Privacy.*
