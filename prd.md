# Product Requirements Document: Ablate AI

**Version:** 1.0  
**Status:** Draft  
**Project Name:** Ablate AI  
**Owner:** BladeX11 / ablate_AI  

---

## 1. Product Vision & Overview
Ablate AI is an enterprise-grade platform designed to handle the complex requirements of **Machine Unlearning** and **Model Redaction**. As global privacy regulations (like GDPR and CCPA) evolve to include the "Right to be Forgotten" in AI models, Ablate AI provides a structured, verifiable, and automated pipeline to remove specific data points, concepts, or "noisy" samples from trained machine learning models without requiring a full retrain from scratch.

### 1.1 Core Mission
To provide a seamless "Search & Destroy" capability for data within ML weights, ensuring compliance while maintaining model utility.

---

## 2. Problem Statement
Traditional model training is monolithic. Once data is ingested, it is "baked" into the weights. Removing specific data currently requires:
- **Costly Retraining:** Re-running training pipelines from scratch (millions in GPU costs).
- **Compliance Risk:** Inability to prove that a specific individual's data has been "unlearned."
- **Utility Loss:** Simple redaction or masking often breaks model performance.

---

## 3. Key Features

### 3.1 Unlearning Request Engine
- **Manual Target Mode:** Users can specify exact entities (e.g., "John Doe") to be redacted.
- **Autonomous Audit (Aura Auditor™):** A spectral scan tool that automatically identifies low-confidence or "noisy" clusters in attention heads (L2-L5) that may indicate leakage or outlier data.
- **Multipart Data Support:** Ability to upload notebooks (`.ipynb`), weights, or binary artifacts for processing.

### 3.2 The Ablate Pipeline (Multi-Stage Execution)
1.  **Hot Shield Deployment:** Instant zero-downtime mitigation using semantic routers to block queries related to the target data while the unlearning process runs.
2.  **Semantic Anti-Sets:** Generation of 50+ semantic variations of the target concept to ensure complete concept eradication.
3.  **Vector DB Purge:** Deep search and removal of target embeddings from vector databases (Milvus/Pinecone/Chroma).
4.  **Gradient Ascent Unlearning:** Surgical modification of model weights using Gradient Ascent to "reverse-train" the model away from the target data.
5.  **Blast Radius Verification:** Post-unlearn benchmarking (MMLU, HumanEval) to ensure no "Catastrophic Forgetting" occurred and general utility remains high.

### 3.3 Compliance & Proof
- **Cryptographic Certificates:** Generation of SHA-256 hashed proofs of unlearning.
- **Model Redaction Signatures:** Visual and metadata-level "stamps" injected into `.ipynb` cells or binary headers to certify the model is "Cleaned by Ablate AI."
- **Audit Trails:** Detailed logs of every stage in the unlearning workflow.

### 3.4 Enterprise Dashboard
- **Risk & Leakage Monitor:** Real-time visualization of model vulnerability.
- **Job Orchestration:** A centralized view of all active, pending, and completed unlearning jobs.
- **3D Neural Visualization:** High-fidelity visualization of the model's "concept space" (via Three.js/Stitch).

---

## 4. Technical Architecture

### 4.1 Frontend Stack
- **Framework:** Next.js (App Router) for routing and authentication.
- **UI Engine:** Static High-Fidelity HTML/JS modules exported from **Stitch MCP**.
- **Aesthetics:** Cyberpunk/Glassmorphism design system using Tailwind CSS and custom glass-blur effects.
- **Data Fetching:** Custom `api-integration.js` layer connecting static UI to FastAPI endpoints.

### 4.2 Backend Stack
- **API Framework:** FastAPI (Asynchronous Python).
- **Task Orchestration:** Hybrid approach using FastAPI `BackgroundTasks` (current) and **Celery** (prepared for distributed workers).
- **Database:** SQLite for job tracking and Prisma-backed SQLite for frontend auth/user data.
- **Storage:** File-system based `uploads/` directory for model artifacts.

---

## 5. User Roles & Personas
- **Data Privacy Officer (DPO):** Monitors compliance stats, exports CSV reports, and verifies unlearning certificates.
- **ML Engineer:** Submits unlearning requests, reviews MMLU regression metrics, and downloads unlearned models.
- **Compliance Auditor:** Validates the cryptographic hashes and audit trails for legal proof.

---

## 6. Success Metrics
- **Unlearning Accuracy:** 0% recall rate for target data post-processing.
- **Utility Retention:** Less than 1% drop in MMLU/HumanEval benchmarks (No Catastrophic Forgetting).
- **Speed to Compliance:** Time from "Right to be Forgotten" request to "Certified Redaction" in < 1 hour.

---

## 7. Future Roadmap
- **v1.1:** Multi-GPU support for Gradient Ascent stage.
- **v1.2:** Direct integration with HuggingFace Hub for automated model uploads/downloads.
- **v2.0:** Real-time "Differential Privacy" monitoring for production inference endpoints.
