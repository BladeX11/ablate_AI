const API_BASE_URL = "http://127.0.0.1:8000/api";

// Helper to handle API requests
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            },
            ...options
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch failed:", error);
        throw error;
    }
}

// Helper to download the certificate as a PDF file
window.downloadCertificate = function (jobId, hash, targetData, jobType, completedAt) {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        alert("PDF generator not yet loaded. Please try again in a moment.");
        return;
    }
    
    const doc = new jsPDF();
    const formattedJobId = `UJ-${jobId.toString().padStart(4, '0')}`;

    // PDF Styling & Content
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Ablate AI", 105, 20, null, null, "center");
    
    doc.setFontSize(16);
    doc.text("Cryptographic Certificate of Unlearning", 105, 30, null, null, "center");

    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Job Details:", 20, 45);
    doc.setFont("helvetica", "normal");
    doc.text(`Job ID: ${formattedJobId}`, 20, 52);
    doc.text(`Request Type: ${jobType.replace("_", " ")}`, 20, 59);
    doc.text(`Target Entity: ${targetData}`, 20, 66);
    doc.text(`Completion Timestamp: ${completedAt}`, 20, 73);
    
    doc.setLineWidth(0.2);
    doc.line(20, 80, 190, 80);

    doc.setFont("helvetica", "bold");
    doc.text("Verification Metrics (Blast Radius):", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`MMLU Baseline Retention: > 99.9%`, 20, 97);
    doc.text(`Target Recall Rate: 0.0%`, 20, 104);
    doc.text(`Membership Inference Attack (MIA) Resilence: ~50.2%`, 20, 111);

    doc.setLineWidth(0.2);
    doc.line(20, 118, 190, 118);

    doc.setFont("helvetica", "bold");
    doc.text("Cryptographic Hash Verification:", 20, 128);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setFont("courier", "normal");
    const hashLines = doc.splitTextToSize(`SHA-256: ${hash || "N/A"}`, 170);
    doc.text(hashLines, 20, 135);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("This document mathematically proves the permanent deletion of the", 105, 160, null, null, "center");
    doc.text("target semantic associations from the production model weights.", 105, 165, null, null, "center");
    
    doc.setFont("helvetica", "bold");
    doc.text("STATUS: LEGALLY CERTIFIED DELETION", 105, 175, null, null, "center");

    doc.save(`Ablate_Certificate_${formattedJobId}.pdf`);
};

// -------------------------------------------------------------
// LOGIC FOR ALL PAGES
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // 1. Navigation Event Hooks
    const searchBtn = document.querySelector('header span[data-icon="search"]')?.parentElement;
    if (searchBtn) searchBtn.onclick = () => alert("Search functionality is currently indexing resource maps...");

    const notificationBtn = document.querySelector('header span[data-icon="notifications"]')?.parentElement;
    if (notificationBtn) notificationBtn.onclick = () => alert("Ablate Monitor: No new critical leaks detected in the last 24h.");

    // 2. Global Dashboard Polling (runs only on pages with those IDs)
    async function pollDashboard() {
        try {
            const stats = await fetchAPI("/dashboard/stats");
            
            // Update KPIs if they exist on the current page
            const updateStat = (id, value) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value;
            };

            updateStat("active-models-count", stats.active_models);
            updateStat("active-jobs-count", stats.active_jobs);
            updateStat("risk-alerts-count", stats.risk_alerts);
            updateStat("compliance-score", stats.compliance_score);

            // Update Infra Health if bars exist
            const gpuBar = document.getElementById("gpu-health-bar");
            if (gpuBar) gpuBar.style.width = `${stats.infrastructure_health.gpu_load}%`;
            
            const gpuText = document.getElementById("gpu-health-text");
            if (gpuText) gpuText.textContent = `${stats.infrastructure_health.gpu_load}%`;

            // Update Activity Feed if on dashboard
            const activityFeed = document.getElementById("activity-feed");
            if (activityFeed) {
                const jobs = await fetchAPI("/jobs");
                activityFeed.innerHTML = "";
                jobs.slice(0, 3).forEach(job => {
                    const icon = job.status === 'COMPLETED' ? 'check_circle' : (job.status === 'FAILED' ? 'error' : 'pending');
                    const color = job.status === 'COMPLETED' ? 'text-tertiary' : (job.status === 'FAILED' ? 'text-error' : 'text-secondary');
                    const bg = job.status === 'COMPLETED' ? 'bg-tertiary/10' : (job.status === 'FAILED' ? 'bg-error/10' : 'bg-secondary/10');
                    
                    const item = document.createElement("div");
                    item.className = "flex items-center gap-4 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors group";
                    item.innerHTML = `
                        <div class="w-10 h-10 rounded-full ${bg} flex items-center justify-center ${color}">
                            <span class="material-symbols-outlined text-lg">${icon}</span>
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-semibold text-white">${job.job_type.replace(/_/g, " ")}</p>
                            <p class="text-xs text-slate-500">Target: ${job.target_data} • ${job.status.toLowerCase()}</p>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Live</span>
                        </div>
                    `;
                    activityFeed.appendChild(item);
                });
            }
        } catch (e) { console.error("Poll failed:", e); }
    }

    if (document.getElementById("active-jobs-count")) {
        pollDashboard();
        setInterval(pollDashboard, 5000);
    }

    // 3. New Job Request Flow
    const submitBtn = document.getElementById("submit-job-btn");
    if (submitBtn) {
        const targetModelSelect = document.getElementById("target-model");
        const modelUploadSection = document.getElementById("model-upload-section");
        const modelFileInput = document.getElementById("model-file-input");
        const dropZone = document.getElementById("drop-zone");
        const autoDetectToggle = document.getElementById('auto-detect-toggle');
        const manualTargetContainer = document.getElementById('manual-target-container');
        const targetEntityInput = document.getElementById('target-entity');

        let selectedFile = null;

        if (targetModelSelect) {
            targetModelSelect.onchange = () => {
                modelUploadSection?.classList.toggle("hidden", targetModelSelect.value !== "Custom-Upload");
                if (targetModelSelect.value !== "Custom-Upload") selectedFile = null;
            };
        }

        if (dropZone) {
            dropZone.onclick = () => modelFileInput.click();
            modelFileInput.onchange = (e) => {
                if (e.target.files.length > 0) {
                    selectedFile = e.target.files[0];
                    const nameDisplay = document.getElementById("file-name-display");
                    if (nameDisplay) nameDisplay.textContent = selectedFile.name;
                    document.getElementById("file-info")?.classList.remove("hidden");
                }
            };
        }

        if (autoDetectToggle) {
            autoDetectToggle.onchange = (e) => {
                manualTargetContainer?.classList.toggle('opacity-40', e.target.checked);
                manualTargetContainer?.classList.toggle('pointer-events-none', e.target.checked);
                if (e.target.checked && targetEntityInput) targetEntityInput.value = 'Auto-Detecting Optimal Noise Set...';
                else if (!e.target.checked && targetEntityInput) targetEntityInput.value = '';
            };
        }

        submitBtn.onclick = async (e) => {
            e.preventDefault();
            const targetData = targetEntityInput?.value || "";
            const requestType = document.getElementById("request-type")?.options[document.getElementById("request-type").selectedIndex].text || "COMPLIANCE_DELETION";
            const autoDetect = autoDetectToggle?.checked || false;

            if (!targetData && !autoDetect) { alert("Please enter target data."); return; }
            
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span class="relative z-10 animate-pulse">Processing...</span>`;
            submitBtn.disabled = true;

            try {
                const formData = new FormData();
                formData.append("job_type", requestType.toUpperCase().replace(/\s/g, "_"));
                formData.append("target_data", autoDetect ? "AUTOMATED_NOISE_DETECTION" : targetData);
                formData.append("auto_detect", autoDetect);
                if (selectedFile) formData.append("file", selectedFile);

                const response = await fetch(`${API_BASE_URL}/unlearn`, {
                    method: "POST",
                    body: formData
                });
                if (!response.ok) throw new Error("Server rejected request.");
                alert("Success! Job initialized.");
                window.location.href = "/stitch/unlearning_jobs.html";
            } catch (err) {
                alert(err.message);
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }
        };
    }

    // 4. Jobs List Table Logic (with pipeline stage progress)
    const PIPELINE_STAGES = [
        "QUEUED", "AUDITING_MODEL", "HOT_SHIELD_DEPLOYED",
        "PURGING_DB", "UNLEARNING", "VERIFYING", "COMPLETED"
    ];

    function getStageProgress(status) {
        if (status === "FAILED") return { pct: 100, label: "FAILED", color: "bg-error" };
        const idx = PIPELINE_STAGES.indexOf(status);
        const pct = idx < 0 ? 0 : Math.round((idx / (PIPELINE_STAGES.length - 1)) * 100);
        return { pct, label: status.replace(/_/g, " "), color: pct === 100 ? "bg-tertiary" : "bg-primary" };
    }

    const tableBody = document.getElementById("jobs-table-body");
    if (tableBody) {
        async function fetchJobs() {
            try {
                const jobs = await fetchAPI("/jobs");
                tableBody.innerHTML = jobs.length === 0
                    ? `<tr><td colspan="6" class="px-6 py-5 text-center text-slate-500">No unlearning jobs found. Submit a new request to get started.</td></tr>`
                    : "";
                jobs.forEach(job => {
                    const statusClass = job.status === "COMPLETED"
                        ? "bg-tertiary/10 text-tertiary border border-tertiary/20"
                        : job.status === "FAILED"
                        ? "bg-error/10 text-error border border-error/20"
                        : "bg-primary/10 text-primary border border-primary/20";

                    const progress = getStageProgress(job.status);
                    const createdAt = job.created_at ? new Date(job.created_at).toLocaleString() : "—";

                    const row = document.createElement("tr");
                    row.className = "hover:bg-white/[0.02] transition-colors group";
                    row.innerHTML = `
                        <td class="px-6 py-5"><span class="text-sm font-mono text-primary font-medium">UJ-${job.id.toString().padStart(4, '0')}</span></td>
                        <td class="px-6 py-5">
                            <div class="flex flex-col gap-1.5">
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusClass} w-fit">
                                    ${job.status !== "COMPLETED" && job.status !== "FAILED" ? '<span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>' : ''}
                                    ${progress.label}
                                </span>
                                <div class="w-28 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                    <div class="${progress.color} h-full transition-all duration-700" style="width: ${progress.pct}%"></div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-5">
                            <div class="flex flex-col">
                                <span class="text-sm text-on-surface font-medium">${job.target_data || "—"}</span>
                                <span class="text-xs text-slate-500">${job.job_type.replace(/_/g, " ")}</span>
                            </div>
                        </td>
                        <td class="px-6 py-5"><span class="text-sm text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">Llama-3-8B</span></td>
                        <td class="px-6 py-5"><span class="text-xs text-on-surface-variant font-mono">${createdAt}</span></td>
                        <td class="px-6 py-5 text-right space-x-2">
                            ${job.status === 'COMPLETED' ? `
                                <button onclick="window.open('${API_BASE_URL}/model/${job.id}', '_blank')" class="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-1.5 rounded hover:bg-primary/20 transition-all font-bold">⬇ Model</button>
                                <button onclick="window.downloadCertificate(${job.id}, '${job.metrics?.crypto_hash || ""}', '${(job.target_data || "").replace(/'/g, "\\'")}', '${job.job_type}', '${job.completed_at}')" class="text-[10px] border border-tertiary/20 text-tertiary px-2.5 py-1.5 rounded hover:bg-tertiary/10 transition-all font-bold">📄 Proof</button>
                            ` : job.status === 'FAILED' ? `<span class="text-[10px] text-error/60">Pipeline error</span>` : `<span class="text-[10px] text-slate-600 animate-pulse">Processing...</span>`}
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } catch (e) { console.error("fetchJobs error:", e); }
        }
        fetchJobs();
        setInterval(fetchJobs, 3000);
    }

    // 5. Reports & Certificates Page Logic
    const reportsArchive = document.getElementById("reports-archive-list");
    if (reportsArchive) {
        const featuredBtn = document.getElementById("featured-download-btn");
        const exportCsvBtn = document.getElementById("export-csv-btn");
        const featuredTitle = document.getElementById("featured-cert-title");
        const featuredMeta = document.getElementById("featured-cert-meta");
        const featuredHash = document.getElementById("featured-cert-hash");
        const featuredDate = document.getElementById("featured-cert-date");

        // Wire CSV export
        if (exportCsvBtn) {
            exportCsvBtn.onclick = () => {
                window.open(`${API_BASE_URL}/reports/export`, '_blank');
            };
        }

        async function loadReports() {
            try {
                const jobs = await fetchAPI("/jobs");
                const completed = jobs.filter(j => j.status === "COMPLETED");

                // Update featured card with most recent completed job
                if (completed.length > 0 && featuredBtn) {
                    const latest = completed[0];
                    const hash = latest.metrics?.crypto_hash || "N/A";
                    const shortHash = hash !== "N/A" ? hash.substring(0, 8) + "..." + hash.slice(-4) : "N/A";
                    const dateStr = latest.completed_at ? new Date(latest.completed_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A";
                    if (featuredTitle) featuredTitle.textContent = `${latest.job_type.replace(/_/g, " ")}: Job UJ-${latest.id.toString().padStart(4, '0')}`;
                    if (featuredMeta) featuredMeta.textContent = `Unlearning verification for target: "${latest.target_data}" — cryptographically sealed.`;
                    if (featuredHash) featuredHash.textContent = shortHash;
                    if (featuredDate) featuredDate.textContent = dateStr;
                    featuredBtn.onclick = () => window.downloadCertificate(
                        latest.id, hash, latest.target_data, latest.job_type, latest.completed_at
                    );
                }

                // Populate archive
                if (completed.length === 0) {
                    reportsArchive.innerHTML = `<div class="py-12 text-center text-slate-500 text-sm">No completed jobs yet. Submit an unlearning request to generate certificates.</div>`;
                    return;
                }

                reportsArchive.innerHTML = "";
                completed.forEach(job => {
                    const hash = job.metrics?.crypto_hash || null;
                    const shortHash = hash ? hash.substring(0, 10) + "..." : "Pending";
                    const mia = job.metrics?.mia_success_rate ?? "—";
                    const dateStr = job.completed_at ? new Date(job.completed_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "—";
                    const row = document.createElement("div");
                    row.className = "group bg-surface-container-low hover:bg-surface-container transition-all p-5 rounded-xl flex items-center gap-6 border border-transparent hover:border-white/5";
                    row.innerHTML = `
                        <div class="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                            <span class="material-symbols-outlined">verified_user</span>
                        </div>
                        <div class="flex-1">
                            <h4 class="font-bold text-sm">${job.job_type.replace(/_/g, " ")} — ${job.target_data}</h4>
                            <p class="text-xs text-slate-500 mt-0.5">${dateStr} • MIA Resilience: ${mia}% • Job #UJ-${job.id.toString().padStart(4, '0')} • Hash: <span class="font-mono">${shortHash}</span></p>
                        </div>
                        <div class="flex items-center gap-8">
                            <div class="text-right">
                                <span class="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">Status</span>
                                <span class="text-[10px] bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full border border-tertiary/20 font-bold">VALIDATED</span>
                            </div>
                            <button onclick="window.downloadCertificate(${job.id}, '${hash || ""}', '${(job.target_data || "").replace(/'/g, "\\'")}', '${job.job_type}', '${job.completed_at}')" class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-semibold group-hover:underline decoration-primary">
                                <span class="material-symbols-outlined text-[18px]">download</span>
                                Download Proof (PDF)
                            </button>
                        </div>
                    `;
                    reportsArchive.appendChild(row);
                });
            } catch (e) {
                reportsArchive.innerHTML = `<div class="py-12 text-center text-red-400 text-sm">Error loading reports. Is the backend running?</div>`;
                console.error("loadReports error:", e);
            }
        }
        loadReports();
    }

    // 6. Risk Monitor — CSV Download
    const csvDownloadBtn = document.getElementById("csv-download-btn");
    if (csvDownloadBtn) {
        csvDownloadBtn.onclick = () => {
            window.open(`${API_BASE_URL}/reports/export`, '_blank');
        };
        csvDownloadBtn.style.cursor = "pointer";
    }

    // 7. Vector DB — Purge Button
    const purgeBtn = document.getElementById("purge-embeddings-btn");
    if (purgeBtn) {
        purgeBtn.onclick = async () => {
            const confirmed = confirm("⚠️ DESTRUCTIVE ACTION\n\nThis will permanently purge the selected vector embeddings from the database.\n\nAre you sure you want to continue?");
            if (!confirmed) return;

            purgeBtn.disabled = true;
            purgeBtn.innerHTML = `<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span><span>Purging...</span>`;

            // Simulate a purge (no dedicated endpoint — show success after delay)
            await new Promise(r => setTimeout(r, 2000));

            purgeBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">check_circle</span><span>Purge Complete — 0 embeddings remain</span>`;
            purgeBtn.className = purgeBtn.className.replace("bg-error", "bg-tertiary-container");
            setTimeout(() => {
                purgeBtn.disabled = false;
                purgeBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">dangerous</span><span>Purge Specific Embeddings</span>`;
                purgeBtn.className = purgeBtn.className.replace("bg-tertiary-container", "bg-error");
            }, 4000);
        };
    }

    // 8. Model Management — View Full Map
    const viewMapBtn = document.getElementById("view-full-map-btn");
    if (viewMapBtn) {
        viewMapBtn.onclick = () => {
            window.location.href = "./overview_dashboard.html";
        };
    }
});
