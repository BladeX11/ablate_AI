"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  Zap, 
  Upload, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Lock, 
  AlertCircle,
  PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewRequestPage() {
  const router = useRouter();
  const [jobType, setJobType] = useState("COMPLIANCE_DELETION");
  const [targetData, setTargetData] = useState("");
  const [autoDetect, setAutoDetect] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("job_type", jobType);
      formData.append("target_data", targetData);
      formData.append("auto_detect", String(autoDetect));
      if (file) formData.append("file", file);

      await axios.post("http://localhost:8000/api/unlearn", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      router.push("/dashboard/unlearning-jobs");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Initiate Ablation</h1>
        <p className="text-slate-400 mt-1">Configure your unlearning pipeline with surgical precision.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-md space-y-8 shadow-2xl relative overflow-hidden">
             {/* Subtle glow */}
             <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

             {error && (
               <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-400 text-sm">
                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
                 <p className="font-medium">{error}</p>
               </div>
             )}

             {/* Job Type Selector */}
             <div className="space-y-4">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Operation Mode</label>
               <div className="grid grid-cols-2 gap-4">
                 <button 
                  type="button"
                  onClick={() => setJobType("COMPLIANCE_DELETION")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300",
                    jobType === "COMPLIANCE_DELETION" 
                      ? "bg-blue-600/10 border-blue-500/50 text-blue-400" 
                      : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                  )}
                 >
                   <Lock className="w-6 h-6" />
                   <span className="text-xs font-black uppercase tracking-widest">Compliance</span>
                 </button>
                 <button 
                  type="button"
                  onClick={() => setJobType("PERFORMANCE_TUNING")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300",
                    jobType === "PERFORMANCE_TUNING" 
                      ? "bg-purple-600/10 border-purple-500/50 text-purple-400" 
                      : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                  )}
                 >
                   <Zap className="w-6 h-6" />
                   <span className="text-xs font-black uppercase tracking-widest">Performance</span>
                 </button>
               </div>
             </div>

             {/* Target Input */}
             <div className="space-y-4">
               <div className="flex items-center justify-between px-1">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Entity / Concept</label>
                 <button 
                  type="button"
                  onClick={() => setAutoDetect(!autoDetect)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-2 py-1 rounded transition-colors border",
                    autoDetect ? "bg-blue-500 text-white border-blue-500 shadow-[0_0_10px_#3b82f6]" : "bg-slate-800 text-slate-400 border-slate-700"
                  )}
                 >
                   <Plus className="w-3 h-3" />
                   Auto-Identify
                 </button>
               </div>
               <input 
                type="text" 
                value={targetData}
                disabled={autoDetect}
                onChange={(e) => setTargetData(e.target.value)}
                placeholder={autoDetect ? "System will scan for sensitive clusters..." : "e.g., John Doe, Customer #4512, Medical History"}
                className={cn(
                  "w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all font-medium",
                  autoDetect && "opacity-50 cursor-not-allowed italic"
                )}
               />
               <p className="text-[10px] text-slate-600 italic px-1">Define the specific data patterns you wish to purge from the model weights.</p>
             </div>

             {/* File Upload */}
             <div className="space-y-4">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Weights / Dataset Source</label>
               <div className="relative border-2 border-dashed border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all group overflow-hidden bg-slate-950">
                  <input 
                    type="file" 
                    onChange={handleUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                  />
                  {file ? (
                    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl relative z-10">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 font-bold text-xs uppercase">
                            {file.name.split('.').pop()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-200 truncate max-w-[150px]">{file.name}</p>
                            <p className="text-[10px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                       </div>
                       <button 
                        type="button" 
                        onClick={() => setFile(null)}
                        className="p-2 hover:bg-rose-500/10 hover:text-rose-500 text-slate-500 rounded-lg transition-colors"
                       >
                          <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-3 py-4 relative z-10">
                       <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-all border border-slate-700 group-hover:scale-110">
                          <Upload className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-300">Click to upload or drag model weights</p>
                          <p className="text-xs text-slate-500 mt-1">Accepts .Pt, .Bin, .Ckpt, .Ipynb (Max 5GB)</p>
                       </div>
                    </div>
                  )}
               </div>
             </div>

             <div className="pt-4 flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading || (!targetData && !autoDetect)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-3 bg-blue-600 rounded-2xl py-4 text-sm font-black text-white uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] group/btn",
                    (loading || (!targetData && !autoDetect)) && "opacity-50 cursor-not-allowed bg-slate-800 no-shadow"
                  )}
                >
                   {loading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <>
                        <PlayCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        Execute Workflow
                     </>
                   )}
                </button>
             </div>
          </form>
        </div>

        {/* Sidebar Help */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center text-center group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-400 mb-4 border border-slate-700 group-hover:shadow-[0_0_25px_rgba(37,99,235,0.2)] transition-shadow">
                 <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Zero-Friction Guarantee</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Our Hot Shield technology ensures your unlearned model remains perfectly valid and performant across non-target datasets while purging sensitive information.
              </p>
           </div>

           <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Pipeline Steps</h4>
              <div className="space-y-4">
                 {[
                   { id: 1, title: 'Hot Shield Deployment', text: 'Isolation of target clusters.' },
                   { id: 2, title: 'Semantic Anti-Extraction', text: 'Gradients identified & prepared.' },
                   { id: 3, title: 'Gradient Ascent Scan', text: 'Surgical weight modification.' },
                   { id: 4, title: 'Verification Audit', text: 'Cryptographic proof generation.' },
                 ].map((step) => (
                   <div key={step.id} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                         {step.id}
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-300">{step.title}</p>
                         <p className="text-[10px] text-slate-600 mt-0.5">{step.text}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
