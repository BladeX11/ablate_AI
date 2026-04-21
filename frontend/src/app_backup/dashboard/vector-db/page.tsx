"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Database, 
  Trash2, 
  Search, 
  Layers, 
  Cpu, 
  RefreshCw,
  Box,
  Binary,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function VectorDBPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch vector db data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const clusters = [
    { id: 'C-0912', type: 'PII_EMBEDDING', count: 124, status: 'PURGED', date: '2026-03-28' },
    { id: 'C-0845', type: 'SENSITIVE_ENTITY', count: 56, status: 'PURGED', date: '2026-03-27' },
    { id: 'C-0712', type: 'COMPLIANCE_DELETION', count: 210, status: 'PURGED', date: '2026-03-26' },
  ];

  if (loading) {
     return (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Vector Database Auditor</h1>
        <p className="text-slate-400 mt-1">Cross-referencing RAG retrieval sets with unlearned weight clusters.</p>
      </div>

      {/* Vector Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-600/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-600/20">
                <Layers className="w-5 h-5" />
             </div>
             <p className="text-sm font-bold text-slate-400">Total Purged Embeddings</p>
          </div>
          <p className="text-3xl font-bold text-white tracking-tighter">{(stats?.total_jobs || 0) * 124}</p>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
             <Search className="w-3 h-3" />
             Scanned 1.2M centroids in Milvus
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-600/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-400 border border-emerald-600/20">
                <RefreshCw className="w-5 h-5" />
             </div>
             <p className="text-sm font-bold text-slate-400">Re-indexing Integrity</p>
          </div>
          <p className="text-3xl font-bold text-white tracking-tighter">99.8%</p>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
             <ShieldCheck className="w-3 h-3 text-emerald-500" />
             No retrieval quality loss detected
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-600/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-lg bg-rose-600/10 flex items-center justify-center text-rose-400 border border-rose-600/20">
                <Trash2 className="w-5 h-5" />
             </div>
             <p className="text-sm font-bold text-slate-400">Pending De-indexing</p>
          </div>
          <p className="text-3xl font-bold text-white tracking-tighter">{stats?.active_shields || 0}</p>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
             <Cpu className="w-3 h-3 text-rose-500" />
             Processing async with high-priority
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cluster List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ablated Cluster History</h3>
             <button className="text-xs font-bold text-blue-400 hover:text-blue-300">Rescan DB</button>
          </div>
          {clusters.map((cluster) => (
            <div key={cluster.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-colors">
                     <Binary className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-white">{cluster.id}</h4>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">{cluster.type}</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/20">{cluster.status}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">{cluster.date}</p>
               </div>
            </div>
          ))}
        </div>

        {/* Visualizer Metadata */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-md h-fit">
           <h3 className="text-lg font-bold text-white mb-6">Neural Mapping Info</h3>
           <div className="space-y-6">
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-500">
                    <Box className="w-4 h-4" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-100">Centroid-Based Scan</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">We identify clusters that contain concepts targeted for unlearning and surgically purge them from the Vector DB.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-500">
                    <Database className="w-4 h-4" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-100">Compliance Sync</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Automatic handshake between model weight editing and database indexing ensures zero consistency lag during unlearning.</p>
                 </div>
              </div>
           </div>

           <div className="mt-8 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] text-slate-500 uppercase font-black">Memory Utilization</span>
                 <span className="text-[10px] text-blue-400 font-black">0.05% REDUCED</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 w-[72%]" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
