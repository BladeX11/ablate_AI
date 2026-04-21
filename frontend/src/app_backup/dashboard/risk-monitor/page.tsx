"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  ShieldAlert, 
  ShieldX, 
  Terminal, 
  Lock, 
  Eye, 
  Activity,
  History,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RiskMonitorPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/dashboard/risks");
        setAlerts(res.data);
      } catch (err) {
        console.error("Failed to fetch risk alerts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && alerts.length === 0) {
    return (
       <div className="flex items-center justify-center h-[50vh]">
         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
       </div>
     );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Security & Leakage Monitor</h1>
        <p className="text-slate-400 mt-1">Real-time MIA detection and PII leakage prevention.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
           {/* Alerts Section */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl relative">
              <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
              <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    Active Threat Intelligence
                 </h3>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded">Real-time Feed</span>
              </div>
              
              <div className="divide-y divide-slate-800/50">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-6 hover:bg-slate-800/30 transition-colors group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border",
                        alert.level === 'CRITICAL' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                        alert.level === 'WARNING' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                        "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      )}>
                        {alert.level === 'CRITICAL' ? <ShieldX className="w-5 h-5" /> : 
                         alert.level === 'WARNING' ? <AlertCircle className="w-5 h-5" /> : 
                         <Terminal className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className={cn(
                            "text-xs font-black uppercase tracking-widest",
                            alert.level === 'CRITICAL' ? "text-rose-400" :
                            alert.level === 'WARNING' ? "text-amber-400" :
                            "text-blue-400"
                          )}>{alert.level} Risk</p>
                          <p className="text-[10px] text-slate-500 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <h4 className="text-md font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{alert.message}</h4>
                        <div className="flex items-center gap-4 mt-3">
                           <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                              <Lock className="w-3.5 h-3.5 text-blue-500/70" />
                              Affected: <span className="text-slate-300">{alert.affected_model}</span>
                           </div>
                           <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                              Initialize Purge <Eye className="w-3 h-3 ml-1" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Leakage Logs Mini-Table */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-md backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
                <History className="w-5 h-5 text-blue-400" />
                Critical Leakage Logs
              </h3>
              <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                       <div className="flex gap-4">
                          <div className="font-mono text-[10px] text-slate-700 font-black pt-1">00:0{i}</div>
                          <div>
                             <p className="text-sm font-bold text-slate-200">Unauthorized Pattern Detected</p>
                             <p className="text-xs text-slate-500 mt-1 italic">Token sequence matches redacted compliance set UJ-0045</p>
                          </div>
                       </div>
                       <div className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">RESOLVED</div>
                    </div>
                 ))}
                 <p className="text-center text-xs text-slate-600 font-bold uppercase tracking-widest pt-4 cursor-pointer hover:text-blue-400 transition-colors">View All Compliance Records</p>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           {/* Health Summary Card */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-md font-bold text-white mb-4">Neural Health Index</h3>
              <div className="flex items-end justify-between mb-2">
                 <p className="text-3xl font-black text-white">99.2%</p>
                 <span className="text-xs font-bold text-emerald-400">+0.1%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner flex items-center justify-end">
                 <div className="h-full bg-emerald-500 w-[99.2%] shadow-[0_0_10px_#22c55e]" />
              </div>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed italic">System state is stable across all active weight clusters.</p>
           </div>

           {/* Hot Shield Activity */}
           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden relative group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                 <h3 className="text-md font-bold text-white">Hot Shield Activity</h3>
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
              </div>
              <div className="h-32 w-full flex items-end gap-1 mb-4 relative z-10">
                 {[40, 70, 45, 90, 65, 80, 55, 100, 75, 40].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm group-hover:bg-blue-500/40 transition-all cursor-pointer relative" style={{ height: `${h}%` }}>
                       <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-400 opacity-20" />
                    </div>
                 ))}
              </div>
              <div className="flex items-center justify-between relative z-10">
                 <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global Drops</p>
                    <p className="text-lg font-bold text-white">12,412</p>
                 </div>
                 <Activity className="w-8 h-8 text-blue-600/30" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
