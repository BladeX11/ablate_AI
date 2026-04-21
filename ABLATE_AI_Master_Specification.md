# Ablate AI | Master System Specification (Formal Document)

---

## 🔝 Table of Contents
- **1. System Inventory & Module Mapping**
- **2. Data Dictionary & Persistence Layer**
- **3. Functional Module Specification**
- **4. API Interface Catalog**
- **5. Core Algorithmic Logic Flows**
- **6. Frontend Data-Binding & UI Integration**

---

## 1. System Inventory & Module Mapping

### 1.1. Backend Module Registry
| **File Path** | **Principal Responsibility** | **Primary Implementations** |
| :--- | :--- | :--- |
| `/backend/main.py` | API Entry Point | `get_dashboard_stats`, `get_db` |
| `/backend/tasks.py` | Asynchronous Execution | `run_master_workflow`, `scrub_nb_content` |
| `/backend/celery_app.py` | Task Orchestration | `Celery` app instance, Broker URLs |
| `/backend/models.py` | Persistence Schema | `Job` class, `VerificationMetric` class |
| `/backend/routers/jobs.py` | Job Lifecycle | `submit_unlearn_request`, `get_jobs` |
| `/backend/routers/metrics.py`| Performance Analytics | `get_metrics`, `export_csv` |

### 1.2. Frontend Resource Inventory
| **File Path** | **Principal Responsibility** | **Primary Scripts** |
| :--- | :--- | :--- |
| `/public/stitch/ov*` | Dashboard Overview | `api-integration.js`, `stitch-nav.js` |
| `/public/stitch/un*` | Unlearning Jobs Table | `fetchJobs()`, `pollStatus()` |
| `/public/stitch/new*` | Request Submission | `submitBtn.onclick`, `FormData` |
| `/public/stitch/api*` | Global Glue Layer | `fetchAPI()`, `pollDashboard()` |
| `/src/app/page.tsx` | Global Redirector | `redirect("/stitch/ov*")` |

---

## 2. Data Dictionary & Persistence Layer

### 2.1. Relation Definition: `jobs`
| **Column** | **Constraint** | **Data Type** | **Role** |
| :--- | :--- | :--- | :--- |
| `id` | PK | Integer | Unique identifier for each unlearning request. |
| `job_type` | Index | String | Categories (e.g., `PII_REMOVAL`, `IP_REDACTION`). |
| `target_data` | - | String | Semantic content target (e.g., "User_101"). |
| `status` | - | String | State Enums (`PENDING`, `UNLEARNING`, `COMPLETED`). |
| `filename` | Null | String | Original uploaded file name (Model weights/IPYNB). |
| `auto_detect` | - | Boolean | Flag to trigger the **Aura Auditor™** scan. |
| `created_at` | Now() | DateTime | Initial timestamp of request reception. |

### 2.2. Relation Definition: `verification_metrics`
| **Column** | **Constraint** | **Data Type** | **Role** |
| :--- | :--- | :--- | :--- |
| `id` | PK | Integer | Unique metric identity. |
| `job_id` | FK (`jobs`) | Integer | Parent-child relationship to the `jobs` table. |
| `crypto_hash` | - | String | SHA-256 Digest of the unlearned model weights. |
| `recall_rate` | - | Float | Quantitative success of the unlearning (Target: 0.0). |

---

## 3. Functional Module Specification

### 3.1. Aura Auditor™ (Tracing & Detection)
- **Logic Unit**: `/backend/tasks.py` → `audit_model_for_noise()`
- **Behavior**: Traverses model weight clusters to identify high-density activations related to the `target_data` string. 
- **Trigger**: Automatic if `auto_detect=True` is passed through the API.

### 3.2. Hot Shield™ (Mitigation & Blocking)
- **Logic Unit**: `/frontend/public/stitch/api-integration.js` → `handleSubmit()`
- **Behavior**: Updates the local state to "Shield Deployed" instantly upon submission.
- **Trigger**: User click on "Submit Job."

### 3.3. Deep Redactor (Sanitization Logic)
- **Logic Unit**: `/backend/tasks.py` → `scrub_nb_content()`
- **Behavior**: A recursive JSON parser that sanitizes string content in Jupyter `.ipynb` code, outputs, and metadata without corrupting binary offsets.

---

## 4. API Interface Catalog

### 4.1. Request Submission Profile
- **Method**: `POST`
- **Route**: `/api/unlearn`
- **Encoding**: `multipart/form-data`
- **Payload**:
  - `job_type`: String (Enum mapping)
  - `target_data`: String (The redaction target)
  - `file`: Binary (Optional model weights file)

### 4.2. Telemetry Polling Profile
- **Method**: `GET`
- **Route**: `/api/dashboard/stats`
- **Response**:
  - `active_jobs`: Integer
  - `compliance_score`: Float
  - `infrastructure_health`: Object `{ cpu, gpu }`

---

## 5. Core Algorithmic Logic Flows

### 5.1. Master Workload Sequence (Linear Execution)
1. **Initialize**: Status set to `RECEIVED`.
2. **Audit**: If `auto_detect`, trigger Spectral Scan.
3. **Mitigate**: Deploy Hot Shield router (Logical flag).
4. **Purge**: Trigger Redactor (Recursive scrubbing).
5. **Verify**: Run Post-Unlearn MMLU diagnostics.
6. **Finalize**: Generate SHA-256 Signature and mark `COMPLETED`.

### 5.2. Recursive JSON Scrubbing (Algorithm)
```python
def scrub(data, target):
    if is_string(data):
        return data.replace(target, "[REDACTED]")
    if is_list(data):
        return [scrub(item, target) for item in data]
    if is_dict(data):
        return {k: scrub(v, target) for k, v in data.items()}
```

---

## 6. Frontend Data-Binding & UI Integration

### 6.1. Metric-to-DOM Registry
| **Backend Key** | **HTML Element ID** | **Function Trigger** | **Frequency** |
| :--- | :--- | :--- | :--- |
| `active_jobs` | `active-jobs-count` | `pollDashboard()` | 5000ms |
| `risk_alerts` | `risk-alerts-count` | `pollDashboard()` | 5000ms |
| `jobs_list` | `jobs-table-body` | `fetchJobs()` | 3000ms |

### 6.2. Side-Nav Routing Table
| **Label** | **Relative Route** | **Target File** |
| :--- | :--- | :--- |
| "Overview" | `./overview_dashboard.html` | `/public/stitch/overview_dashboard.html` |
| "Jobs" | `./unlearning_jobs.html` | `/public/stitch/unlearning_jobs.html` |
| "Logout" | `./ablate_ai_landing_page.html`| `/public/stitch/ablate_ai_landing_page.html`|
