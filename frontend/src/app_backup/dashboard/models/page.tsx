"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  RefreshCw,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts";

export default function ModelInventoryPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/dashboard/models");
        setModels(res.data);
      } catch (err) {
        console.error("Failed to fetch model inventory", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Radar chart data for Blast Radius
  const radarData = [
    { subject: 'MMLU Accuracy', A: 98, B: 95, fullMark: 100 },
    { subject: 'MIA Risk', A: 45, B: 30, fullMark: 100 },
    { subject: 'Retention', A: 100, B: 99, fullMark: 100 },
    { subject: 'Recall', A: 92, B: 90, fullMark: 100 },
    { subject: 'Latency', A: 85, B: 85, fullMark: 100 },
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
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Model Inventory</h1>
          <p className="text-slate-400 mt-1">Manage and audit your unlearned model variants.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all">
          <RefreshCw className="w-4 h-4" />
          Sync Weights
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Model List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Active Neural Nodes</h3>
          {models.map((model) => (
            <div key={model.name} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-colors">
                    <Shield className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{model.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">{model.version} • Weights Verified</p>
                  </div>
                </div>
                <div className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5",
                  model.status === 'SECURE' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                )}>
                  {model.status === 'SECURE' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {model.status}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Accuracy</p>
                  <p className="text-sm font-bold text-white">{model.current_accuracy}%</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">MIA Risk</p>
                  <p className={cn(
                    "text-sm font-bold",
                    model.mia_risk_score < 55 ? "text-emerald-400" : "text-amber-400"
                  )}>{model.mia_risk_score}%</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Drift</p>
                  <p className="text-sm font-bold text-white">0.02%</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <p className="text-xs text-slate-500">
                  Last unlearning job: <span className="text-slate-300 font-medium">UJ-{model.last_unlearned || 'N/A'}</span>
                </p>
                <button className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase tracking-wider">
                  View Lineage <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Blast Radius Result Visualizer */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 p-8">
            <Info className="w-5 h-5 text-slate-700 hover:text-blue-400 cursor-help" />
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white">Blast Radius Scan</h3>
            <p className="text-sm text-slate-500 mt-1">Cross-domain regression & forgetting analysis.</p>
          </div>

          <div className="h-[350px] w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Pre-Unlearn"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                  />
                  <Radar
                    name="Post-Unlearn"
                    dataKey="B"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.4}
                  />
                </RadarChart>
             </ResponsiveContainer>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Baseline Performance</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Unlearned Health</span>
             </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
            <p className="text-xs text-blue-400 leading-relaxed font-medium">
              Ablate Insight: The unlearning process resulted in a <span className="text-white">0.4%</span> drop in general knowledge benchmarks, well within the safety threshold of 2%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
