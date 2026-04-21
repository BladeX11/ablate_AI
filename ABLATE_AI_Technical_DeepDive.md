# Ablate AI | Granular System Specification & Deep-Dive Technical Manual

---

## 📅 Platform Data Dictionary

### Table: `jobs` — Persistent State Tracking
| **Column** | **Data Type** | **Constraints** | **Default Value** | **Description** |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key | Auto-increment | Internal unique reference ID for each request. |
| `job_type` | String | Index=True | - | Categories: `PII_REMOVAL`, `BIAS_MITIGATION`, etc. |
| `target_data` | String | - | - | The specific semantic concept or string to be redacted. |
| `status` | String | - | `RECEIVED` | Enums: `PENDING`, `AUDITING`, `UNLEARNING`, `COMPLETED`, `FAILED`. |
| `filename` | String | Nullable=True | - | The name of the model binary or notebook provided by the user. |
| `auto_detect` | Boolean | - | `False` | Boolean flag to trigger Aura Auditor scan. |
| `created_at` | DateTime | func.now() | - | Timestamp when the request hit the database. |
| `completed_at` | DateTime | Nullable=True | - | Timestamp of the final state transition. |

### Table: `verification_metrics` — Post-Surgery Auditing
| **Column** | **Data Type** | **Foreign Key** | **Description** |
| :--- | :--- | :--- | :--- |
| `id` | Integer | - | Unique metric reference. |
| `job_id` | Integer | `jobs.id` | Link to the parent unlearning process. |
| `baseline_mmlu` | Float | - | Pre-surgery general intelligence score (0-100%). |
| `post_unlearn_mmlu`| Float | - | Post-surgery general intelligence score. |
| `mia_success_rate` | Float | - | Membership Inference Attack resilience score. |
| `recall_rate` | Float | - | Successful recall of the target redaction entity (Target: 0.0). |
| `crypto_hash` | String | - | SHA-256 Digest of the modified model weights. |

---

## 🛠️ System Functional Modules (The Implementation Guts)

| **Feature Concept** | **Technical Implementation** | **Implementation Code** | **Logic Sequence** |
| :--- | :--- | :--- | :--- |
| **Membership Inference Scan** | Aura Auditor™ | `audit_model_for_noise` | Performs a spectral scan of weights to identify PII clusters. |
| **Zero-Downtime Blocking** | Hot Shield™ | `routers.jobs.submit` | Instant flag update in the `jobs` table before worker trigger. |
| **Deep Redaction Surgery** | Gradient Ascent Engine | `redact_model_file` | Weight manipulation via loss maximization on the target data. |
| **Jupyter Sanitization** | Automatic Redactor | `scrub_nb_content` | Recursive string replacement within nested JSON cell structures. |
| **Compliance Proofing** | Digital Signer | `VerificationMetric` | Generation of SHA-256 Digest upon job completion. |
| **Infrastructure Monitoring** | Health Poller | `get_dashboard_stats` | Real-time fetch of system load, job counts, and risk levels. |
| **Report Generation** | Data Exporter | `export_audit_report` | Dynamic CSV generation of the full `Job` history table. |

---

## 🛰️ API Surface Definition (FastAPI)

### Endpoint Registry
| **Route** | **Method** | **Protocol** | **Request Body** | **Response Payload** |
| :--- | :--- | :--- | :--- | :--- |
| `/api/unlearn` | POST | Multipart Form | `job_type`, `target_data`, `file` | `schemas.JobResponse` (Full job object) |
| `/api/jobs` | GET | JSON | - | `List[schemas.JobResponse]` (Table data) |
| `/api/dashboard/stats`| GET | JSON | - | Stats object (KPI counts, Infra health) |
| `/api/jobs/{id}` | GET | JSON | `job_id` | Single Job detail + attached Metrics. |
| `/api/reports/export` | GET | Streaming CSV | - | Binary stream of `ablate_jobs_report.csv`. |
| `/api/model/{id}` | GET | Binary | `job_id` | The unlearned/redacted weight file. |

---

## 🧠 Core Algorithmic Implementation

### 1. `scrub_nb_content(data, target)`
- **Logic Type**: Recursive Traversal
- **Behavior**: Sanitize all code cells, markdown descriptions, and output data in a notebook file.
- **Goal**: Clear PII while maintaining JSON structural integrity.

### 2. `redact_model_file(input, output, job_id, target)`
- **IPYNB Specialization**: Injects a Certification markdown cell and triggers recursive scrubbing.
- **Binary Specialization**: Performs block copy and appends a cryptographic signature footer.

### 3. `run_master_workflow(job_id)`
- **Sequential State Machine**: `AUDITING` → `HOT_SHIELD` → `PURGING` → `UNLEARNING` → `VERIFYING` → `COMPLETED`.

---

## 🎨 UI Data-Binding Reference (JavaScript)

### Element-to-API Mapping
| **DOM ID** | **JS Listener/Method** | **Key In Backend Response** | **Update Frequency** |
| :--- | :--- | :--- | :--- |
| `active-jobs-count` | `pollDashboard()` | `stats.active_jobs` | 5000ms |
| `risk-alerts-count` | `pollDashboard()` | `stats.risk_alerts` | 5000ms |
| `compliance-score` | `pollDashboard()` | `stats.compliance_score` | 5000ms |
| `gpu-health-bar` | `pollDashboard()` | `stats.infrastructure_health.gpu_load` | 5000ms |
| `jobs-table-body` | `fetchJobs()` | `List[job]` | 3000ms |
| `submit-job-btn` | `onclick` | POST → `/api/unlearn` | Manual Trigger |

### UI Navigation Handling (`stitch-nav.js`)
- **Map**: Links labels (e.g., "Overview") to relative file paths (e.g., `./overview_dashboard.html`).
- **Logout Logic**: Clears session and redirects to `./ablate_ai_landing_page.html`.
