# Product Requirements Document (PRD)
## Project Name: Ablate AI
**Tagline:** A Self-Healing Enterprise Machine Unlearning & MLOps Platform

---

### 1. Project Overview
Ablate AI is an enterprise-grade AI governance and self-healing platform. It enables organizations to surgically remove (unlearn) targeted information—such as sensitive PII, biased content, or accuracy-degrading noise—from deployed Large Language Models (LLMs) and Vector Databases without the need to retrain models from scratch. It transforms compliance and AI performance optimization into a measurable, automated, and mathematically proven process.

### 2. Problem Statement
* **Compliance & Memorization:** LLMs memorize training data. Under GDPR, HIPAA, and CCPA, enterprises must guarantee the deletion of sensitive user data upon request. Currently, models cannot easily "forget."
* **Catastrophic Forgetting:** Forcing a model to forget specific data often damages its general reasoning capability. 
* **RAG Vulnerabilities:** Even if a model forgets data, enterprise RAG (Retrieval-Augmented Generation) systems can still leak sensitive data via Vector Databases.
* **Bad Data Degradation:** Erroneous, toxic, or outdated training data actively degrades model accuracy and leads to hallucinations. Tracing and removing this data is historically impossible without expensive full-scale retraining.

### 3. Target Audience
* **AI Governance / Compliance Officers:** Need to guarantee and prove (via audit) that sensitive data is removed.
* **Machine Learning Engineers:** Need to maintain high model accuracy, manage datasets efficiently, and avoid expensive retraining cycles.

---

### 4. Core Features & "100x" Innovations

**1. Influence-Function Tracing & Data Valuation**
Instead of just waiting for takedown requests, Ablate AI mathematically traces back bad inferences (hallucinations/low accuracy) to the specific bad training records that caused them, flagging them for pruning.

**2. Dual-Track Unlearning (Model + RAG)**
Ablate AI simultaneously runs gradient-ascent weight editing on the model itself AND traverses enterprise Vector Databases (Pinecone/Milvus) to surgically purge semantic embeddings containing the restricted target.

**3. "Hot Shield" (Zero-Downtime Mitigation)**
While heavy GPU-based unlearning happens asynchronously, Ablate AI instantly drops a dynamic guardrail (semantic router / negative prompt) in front of the production model to stop the leak with zero downtime.

**4. Semantic Anti-Sets (Concept Unlearning)**
Instead of just unlearning exact-match strings (e.g., "John Doe has diabetes"), the system generates 50+ semantic variations utilizing an internal LLM to ensure the *underlying concept* is completely eradicated, not just a specific sentence.

**5. Blast Radius Simulator**
Before a model is redeployed, the verification module runs automated regression benchmarks (e.g., MMLU, HumanEval) to guarantee that general model intelligence did not degrade (Catastrophic Forgetting) post-unlearning.

**6. Cryptographic Proof of Unlearning**
Generates GDPR/HIPAA-compliant certificates containing cryptographic hashes (SHA-256) of pre/post model weights and statistical divergence (KL Divergence) metrics, proving legally that surgical deletion occurred.

---

### 5. Workflows (MVP Scope)

**Use Case 1: The Compliance Deletion (Privacy)**
1. Compliance officer submits "Delete John Doe" in the dashboard.
2. System deploys "Hot Shield" to production.
3. Cognitive Engine generates Semantic Anti-sets (variations of the secret).
4. System purges Vector DB embeddings related to the secret.
5. GPU clusters run Gradient Ascent on model weights.
6. Blast Radius check verifies MMLU score remains > 98% of baseline.
7. Cryptographic PDF is generated.

**Use Case 2: Performance Auto-Tuning (Fixing Accuracy)**
1. Active monitoring detects model failing logic tests.
2. Influence tracing identifies a batch of 5,000 corrupt Reddit-scraped rows.
3. System triggers unlearning of those specific rows.
4. Model intelligence is restored/increased; engineer receives summary report.

---

### 6. Technical Architecture & Tech Stack

**Frontend (Dashboard):**
* **Next.js (React) & Tailwind CSS:** Dashboard to submit requests, view execution statuses, view model performance charts, and download certificates.

**Backend & Orchestration:**
* **FastAPI (Python):** High-performance API.
* **Celery + Redis / RabbitMQ:** Asynchronous task queue to manage long-running GPU unlearning jobs gracefully without blocking the UI.

**Unlearning & Verification Engine:**
* **PyTorch + Hugging Face `transformers` / `peft`:** Executes memory weight edits (LoRA unlearning, Gradient Ascent, ROME/MEMIT).
* **Captum:** For influence function computations.
* **Presidio / spaCy:** For PII detection. 

**Database Layer:**
* **PostgreSQL:** Stores job statuses, metadata, and data lineage maps.
* **Milvus / Pinecone:** Target Vector DBs representing the enterprise RAG environment.

**Models (Strategy):**
* **The "Patient" Model:** Pre-trained Open Source Models like TinyLlama (1.1B) or Llama-3-8B. *Note: We intentionally fine-tune it first on a poisoned/sensitive dataset so we have a target to "unlearn".*
* **The "Tools" (No training required):** 
  * Concept Generation: GPT-4o API or local Llama.
  * PII Detection: Microsoft Presidio.
  * Embeddings for Vector DB: `all-MiniLM-L6-v2`.

---

### 7. Evaluation & Success Metrics
* **Membership Inference Attack (MIA) Success Rate:** Must drop to ~50% (random guessing) on target data post-unlearning.
* **Recall of Sensitive Extracted Strings:** 0%.
* **General Utility Drop (Blast Radius):** Baseline MMLU/HumanEval score retention must be > 99%.
* **Speed to Protection:** "Hot Shield" deployed in < 2 seconds.
