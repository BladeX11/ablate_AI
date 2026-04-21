import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
  subtext?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className,
  subtext
}: StatCardProps) {
  return (
    <div className={cn(
      "bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300",
      className
    )}>
      {/* Glow Effect */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors" />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1.5 mt-2",
              trend.isUp ? "text-emerald-400" : "text-rose-400"
            )}>
              <span className="text-xs font-semibold">
                {trend.isUp ? "+" : "-"}{trend.value}%
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">vs last week</span>
            </div>
          )}

          {subtext && !trend && (
            <p className="text-xs text-slate-500 mt-2 font-medium">{subtext}</p>
          )}
        </div>
        
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-colors border border-slate-700/50">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
