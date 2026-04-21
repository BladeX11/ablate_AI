# Ablate AI | Technical Blueprint (System Flow & Point-wise Specification)

## 🕒 Section 1: The Technological Foundation

### 1.1. Core System Stack (Point-wise)
- **Primary Runtime Language**: Python 3.10+ (Selected for its deep LLM integration and high-performance library ecosystem).
- **Backend API Framework**: FastAPI (Chosen for its asynchronous capabilities, auto-documented routes, and sub-millisecond overhead).
- **Asynchronous Processing Engine**: Celery 5.4.0 (Utilized to manage long-running machine unlearning jobs in the background).
- **Task Orchestration Broker**: SQLite (Broker Engine) + SQLAlchemy (Persistence) (Provides a zero-configuration, self-contained database and task queue for enterprise demo environments).
- **Web Interface Implementation**: Next.js (serving high-fidelity static HTML) + Tailwind CSS + Stitch Design System.

### 1.2. Environment-Level Management (Point-wise)
- **Virtualization Layer**: Python `venv` handles isolated backend dependencies.
- **Worker Configuration**: Parallel-execution pool set to `-P solo` for 100% stability on Windows architectures.
- **Port Mapping**:
  - **Backend API Server**: Port 8000.
  - **Web Dashboard Server**: Port 3000.

---

## 🏛️ Section 2: High-Level System Architecture

### 2.1. Component Decoupling (Point-wise)
- **Separated Concern Architecture**: The platform operates with a clean "Headless" backend (FastAPI) and a "High-Fidelity" frontend (Stitch/Next.js) that communicate exclusively over RESTful JSON/Multipart protocols.
- **State Persistence Layer**: A unified database (`sql_app.db`) acts as the single source of truth, synchronizing statuses between the API and the background workers.

### 2.2. Folder-Structure Topology (Point-wise)
- **`/backend/`**: Contains the REST API routes, Pydantic schemas, and SQLAlchemy database models.
- **`/backend/tasks.py`**: The "Heart" of the system, housing the unlearning algorithms and file-scrubbing logic.
- **`/frontend/public/`**: Stores the globally reachable static assets and libraries.
- **`/frontend/public/stitch/`**: Contains the core HTML dashboards, API integration scripts (`api-integration.js`), and navigation logic (`stitch-nav.js`).

---

## 🛠️ Section 3: Integrated Functional Feature Suite

### 3.1. Tracing & Detection (Point-wise)
- **Aura Auditor™ (Spectral Scan)**: Performs a non-invasive scan of model weights to identify high-density clusters associated with specific target entities.
- **Manual Redaction Override**: Allows practitioners to explicitly define target strings or PII for surgical removal.

### 3.2. Real-time Mitigation (Point-wise)
- **Hot Shield™ (Logical Routing)**: Instantly signals the inference layer to intercept and block queries related to a target entity, providing zero-downtime safety while heavy unlearning executes.

### 3.3. Surgical Unlearning (Point-wise)
- **Gradient Ascent Engine**: Manipulates model weights by maximizing loss for specific data points, effectively "erasing" their semantic associations.
- **Deep Redactor (Recursive Scrubbing)**: A surgical tool for `.ipynb` notebooks that recursively traverses nested JSON to sanitize code cells and outputs.

### 3.4. Compliance & Verification (Point-wise)
- **Cryptographic Signer**: Generates an immutable SHA-256 Digest of unlearned weights, creating a permanent audit trail.
- **MMLU/HumanEval Diagnostics**: Executes post-unlearn benchmarks to ensure the model has not suffered "Catastrophic Forgetting."

---

## ⚙️ Section 4: Operational Execution Flow (Step-by-Step)

### 4.1. The Lifecycle of an Unlearning Request (Point-wise)
1. **Request Ingestion**: The User submits the "New Job" form on the dashboard; `api-integration.js` captures the inputs and model file.
2. **API Handshake**: FastAPI receives the `multipart/form-data` at `/api/unlearn`, persists it to the database with a `RECEIVED` status, and triggers a background task.
3. **Audit Execution**: If Aura Auditor™ is enabled, the system scans the weights for "Noise Peaks" correlating to the data.
4. **State Transition**: The job is marked as `UNLEARNING`. The Scrubbing algorithms (for notebooks) or weight manipulators (for binaries) execute.
5. **Validation & Proofing**: The SHA-256 hash is computed. General intelligence benchmarks are run.
6. **Completion**: The `Job` and `VerificationMetric` tables are updated, and the user receives a success notification on the dashboard.

---

## 📊 Section 5: Persistent Data Schema (Point-wise)

### 5.1. Job Entity Metadata (Point-wise)
- **Internal Reference ID**: Unique Integer ID.
- **Job Category**: String (e.g., `IP_REDACTION`).
- **Target String**: The semantic concept being unlearned.
- **Status Enum**: Current state (`PENDING`, `UNLEARNING`, `COMPLETED`).
- **Filename Reference**: Path to the persisted model weights.
- **Creation Timestamp**: Record of initial request.

### 5.2. Verification Metrics Metadata (Point-wise)
- **Recall Rate (Target: 0.0)**: Measured success of the unlearning operation.
- **Cryptographic Proof**: The SHA-256 unlearning signature.
- **MMLU Delta**: Measurement of intelligence preservation post-surgery.
