"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Database, 
  ShieldAlert, 
  FileText, 
  Settings, 
  Layers,
  Cpu,
  Zap,
  Plus
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const navItems = [
    { name: "Overview", href: "/dashboard", icon: BarChart3 },
    { name: "Model Inventory", href: "/dashboard/models", icon: Cpu },
    { name: "Unlearning Jobs", href: "/dashboard/unlearning-jobs", icon: Zap },
    { name: "Vector DB", href: "/dashboard/vector-db", icon: Database },
    { name: "Risk Monitor", href: "/dashboard/risk-monitor", icon: ShieldAlert },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen fixed">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">Ablate AI</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
