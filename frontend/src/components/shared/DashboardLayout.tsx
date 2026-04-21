import Sidebar from "@/components/shared/Sidebar";
import { Search, Bell, User } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto bg-slate-950 relative">
        {/* Abstract background grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute inset-0 pointer-events-none opacity-10 [background-image:linear-gradient(#1e293b_1px,transparent_1px),linear-gradient(90deg,#1e293b_1px,transparent_1px)] [background-size:40px_40px]" />
        
        <div className="relative z-10 p-8 max-w-7xl mx-auto min-h-full">
          {/* Top Header */}
          <div className="flex items-center justify-between mb-8 bg-slate-900/40 backdrop-blur-md rounded-2xl px-6 py-3.5 border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <Search className="w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search jobs, data, or models..." 
                className="bg-transparent border-none text-slate-300 focus:outline-none w-full text-sm font-medium"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-blue-400 transition-colors" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                     <User className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors leading-none">Admin_Alpha</span>
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Security Ops</span>
                </div>
              </div>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
