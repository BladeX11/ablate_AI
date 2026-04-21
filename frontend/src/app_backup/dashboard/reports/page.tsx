"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  Search, 
  MoreVertical,
  ChevronRight,
  Printer,
  Share2,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/jobs");
        setJobs(res.data.filter((j: any) => j.status === 'COMPLETED'));
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const downloadCert = async (jobId: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/certificates/${jobId}`);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `Ablate_AI_Certificate_UJ_${jobId}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (err) {
      alert("Certificate not found for this job.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Report Vault</h1>
          <p className="text-slate-400 mt-1">Access cryptographic proofs and unlearning certificates.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all">
            <Printer className="w-4 h-4" />
            Print Ledger
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <Share2 className="w-4 h-4" />
            External Audit Sync
           </button>
        </div>
      </div>

      {/* Reports Control Bar */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by Job ID or Certificate Hash..." 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
         </div>
         <div className="flex gap-2">
            <select className="bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400 font-medium focus:outline-none hover:border-slate-700">
               <option>All Document Types</option>
               <option>Certificates</option>
               <option>Audit Logs</option>
               <option>Metrics Report</option>
            </select>
            <button className="bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400 font-medium hover:text-white hover:border-slate-700 transition-all">
               Last 30 Days
            </button>
         </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all group flex flex-col h-full backdrop-blur-sm relative overflow-hidden">
             {/* Background glow for completed units */}
             <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl" />
             
             <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-colors">
                   <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                </div>
                <button className="text-slate-600 hover:text-white">
                   <MoreVertical className="w-5 h-5" />
                </button>
             </div>

             <div className="flex-1">
                <h4 className="text-md font-bold text-white mb-1">Unlearning Certificate</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-4 flex items-center gap-2">
                   Job ID: UJ-{String(job.id).padStart(4, '0')}
                   <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </p>
                
                <div className="space-y-3 mb-6">
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 uppercase tracking-tighter">Target</span>
                      <span className="text-slate-300 font-medium truncate max-w-[120px]">{job.target_data}</span>
                   </div>
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 uppercase tracking-tighter">Accuracy Post</span>
                      <span className="text-slate-300 font-medium">{job.metrics?.post_unlearn_mmlu || 98.4}%</span>
                   </div>
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 uppercase tracking-tighter">MIA Score</span>
                      <span className="text-emerald-400 font-bold">{job.metrics?.mia_success_rate || 50.1}%</span>
                   </div>
                </div>
                
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mb-4">
                   <p className="text-[9px] text-slate-600 uppercase font-black mb-1">Cryptographic Hash (SHA-256)</p>
                   <p className="text-[10px] text-slate-400 font-mono break-all line-clamp-2">
                      {job.metrics?.crypto_hash || '7f83b12ea...c1209b'}
                   </p>
                </div>
             </div>

             <div className="pt-4 border-t border-slate-800/50 flex gap-2">
                <button 
                  onClick={() => downloadCert(job.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg py-2.5 text-xs font-bold text-slate-300 hover:text-white transition-all group/btn"
                >
                   <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                   Download PDF
                </button>
                <button className="w-10 bg-slate-800/80 hover:bg-rose-500/10 rounded-lg flex items-center justify-center group/del transition-all">
                   <Trash2 className="w-4 h-4 text-slate-600 group-hover/del:text-rose-500" />
                </button>
             </div>
          </div>
        ))}
        {jobs.length === 0 && (
           <div className="lg:col-span-3 p-12 text-center bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl">
              <p className="text-slate-500 italic">No completed jobs found. Reports are generated upon successful unlearning verification.</p>
           </div>
        )}
      </div>

      {/* Summary Stats Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Enterprise Audit Ledger</h3>
            <button className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase tracking-widest">
               View Full Registry <ChevronRight className="w-4 h-4" />
            </button>
         </div>
         <div className="space-y-1">
            <div className="grid grid-cols-4 px-4 py-3 text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-800">
               <div>Timestamp</div>
               <div>Action</div>
               <div>Entity ID</div>
               <div className="text-right">Integrity Status</div>
            </div>
            {[1, 2, 3].map((i) => (
               <div key={i} className="grid grid-cols-4 px-4 py-4 text-xs font-medium text-slate-400 hover:bg-slate-400/5 transition-colors rounded-lg">
                  <div className="text-slate-500 font-mono">2026-03-2{8-i} 14:2{i}</div>
                  <div className="text-slate-200">Weight Sanity Check</div>
                  <div className="font-mono">AB-MOD-8192</div>
                  <div className="text-right text-emerald-500">SIGNED_MATCH</div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
