# Ablate AI

Ablate AI is a full-stack prototype for machine unlearning workflows, compliance-oriented model redaction, and enterprise dashboarding.

It combines:
- A FastAPI backend for job orchestration, metrics, certificates, and model download APIs.
- A Next.js frontend for landing pages, dashboard UI, and authentication flows.
- SQLite-backed persistence for both backend runtime data and frontend Prisma data.

## Monorepo Structure

```text
.
├─ backend/        # FastAPI service + SQLAlchemy models + workflow engine
├─ frontend/       # Next.js application + Prisma schema/auth
└─ uploads/        # Generated and uploaded job artifacts (runtime)
```

## Features

- Submit unlearning requests (manual target or auto-detect mode)
- Simulated multi-stage unlearning pipeline
- Verification metrics and cryptographic proof generation
- Downloadable redacted/unlearned model artifacts
- Dashboard stats and CSV export endpoint
- Frontend auth routes and protected dashboard routing

## Tech Stack

Backend:
- Python
- FastAPI
- SQLAlchemy
- Celery (configured)
- SQLite

Frontend:
- Next.js (App Router)
- TypeScript
- Prisma + SQLite
- Tailwind CSS

## Prerequisites

- Python 3.10+
- Node.js 20+
- npm 10+

## Quick Start (Windows PowerShell)

### 1) Clone and enter repo

```powershell
git clone https://github.com/BladeX11/ablate_AI.git
cd ablate_AI
```

### 2) Backend setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Run backend API:

```powershell
uvicorn main:app --reload --port 8000
```

Backend will be available at:
- http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs

### 3) Frontend setup

Open a new terminal:

```powershell
cd frontend
npm install
```

Create `.env` in `frontend/`:

```env
DATABASE_URL="file:./prisma/dev.db"
SESSION_SECRET="replace-with-a-long-random-secret"
```

Initialize Prisma and seed:

```powershell
npm run backend:init
```

Run frontend dev server:

```powershell
npm run dev
```

Frontend will be available at:
- http://localhost:3000

## API Reference (Backend)

Base URL: `http://127.0.0.1:8000`

Core endpoints:
- `GET /` - Health/welcome response
- `POST /api/unlearn` - Submit unlearning request (multipart form)
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/{job_id}` - Get single job status and metrics
- `GET /api/metrics` - List verification metrics
- `GET /api/certificates/{job_id}` - Fetch certificate payload
- `GET /api/model/{job_id}` - Download unlearned model artifact
- `GET /api/dashboard/stats` - Dashboard KPI data
- `GET /api/reports/export` - CSV export of jobs

## Request Example

Submit a job with file upload:

```bash
curl -X POST "http://127.0.0.1:8000/api/unlearn" \
  -F "job_type=COMPLIANCE_DELETION" \
  -F "target_data=John Doe" \
  -F "auto_detect=false" \
  -F "file=@sample.ipynb"
```

## Notes

- Backend currently uses FastAPI `BackgroundTasks` for the unlearning workflow orchestration.
- Celery is configured in `backend/celery_app.py` for future/distributed worker execution.
- Runtime artifacts are written under `uploads/`.

## Development Commands

Backend:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

Frontend:

```powershell
cd frontend
npm run dev
```

Prisma:

```powershell
cd frontend
npm run prisma:generate
npm run db:push
npm run db:seed
```

## Troubleshooting

- Port already in use:
  - Change backend port: `uvicorn main:app --reload --port 8001`
  - Or stop the process using the existing port.
- Prisma client errors:
  - Re-run `npm run prisma:generate`.
- Missing frontend env values:
  - Ensure `frontend/.env` exists with `DATABASE_URL` and `SESSION_SECRET`.

## License

No license file is currently included. Add a `LICENSE` file if you plan to distribute this project.
