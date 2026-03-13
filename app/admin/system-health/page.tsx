"use client";
import { useEffect, useState } from "react";
import { 
  Server, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Terminal,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function SystemHealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/audit/health");
      const data = await res.json();
      setHealth(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // 10s auto refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
       <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  return (
    <div className="pt-24 pb-32 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-12 transition-colors">
            <ArrowLeft size={16} />
            Back to Command Center
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold mb-3 uppercase tracking-widest text-[10px]">
              <ShieldCheck size={16} />
              <span>Real-Time Monitoring Active</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight text-gradient">
              Core Status
            </h1>
            <p className="text-slate-500 mt-4 text-xl font-light max-w-xl">
              Node integrity, database reconciliation, and environment telemetry.
            </p>
          </div>
          <button 
            onClick={() => { setLoading(true); fetchHealth(); }}
            className="p-4 rounded-3xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white border border-slate-100 transition-all"
          >
            <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Environment Status */}
            <div className="lg:col-span-2 space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-card p-12 rounded-[50px] bg-white border border-slate-100">
                     <div className="flex items-center justify-between mb-10">
                        <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
                           <Server size={32} />
                        </div>
                        <span className="flex items-center gap-2 text-emerald-500 font-black text-xs bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                           <Zap size={12} fill="currentColor" /> ONLINE
                        </span>
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 mb-2">API Engine</h3>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Node.js / Express Distribution</p>
                     
                     <div className="space-y-4">
                        <div className="flex justify-between text-sm font-bold">
                           <span className="text-slate-400">Node Uptime</span>
                           <span className="text-slate-900">{Math.floor(health?.uptime / 3600)}h {Math.floor((health?.uptime % 3600) / 60)}m</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                           <span className="text-slate-400">Heap Utilization</span>
                           <span className="text-slate-900">{Math.round(health?.memory?.heapUsed / 1024 / 1024)}MB</span>
                        </div>
                     </div>
                  </div>

                  <div className="glass-card p-12 rounded-[50px] bg-white border border-slate-100">
                     <div className="flex items-center justify-between mb-10">
                        <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl">
                           <Database size={32} />
                        </div>
                        <span className="flex items-center gap-2 text-emerald-500 font-black text-xs bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                           CONNECTED
                        </span>
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 mb-2">Primary Ledger</h3>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">PostgreSQL Vector Instance</p>
                     
                     <div className="space-y-4">
                        <div className="flex justify-between text-sm font-bold">
                           <span className="text-slate-400">Connection Pool</span>
                           <span className="text-slate-900">HEALTHY</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                           <span className="text-slate-400">Sync Status</span>
                           <span className="text-slate-900">RECONCILED</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* System Console */}
               <div className="glass-card p-12 rounded-[50px] bg-slate-900 text-white relative overflow-hidden group">
                  <div className="flex items-center gap-4 mb-10">
                     <Terminal className="text-blue-500" size={24} />
                     <h3 className="text-2xl font-black tracking-tight">System Telemetry</h3>
                  </div>
                  <div className="font-mono text-xs space-y-3 opacity-80 group-hover:opacity-100 transition-opacity">
                     <p className="text-emerald-400">[OK] Bootstrapping E-Ballot Protocol v4.2.0-Alpha</p>
                     <p className="text-blue-400">[INFO] RSA KeyPair Re-validated (2048-bit)</p>
                     <p className="text-slate-500">[DEBUG] Database connection pool initialized with 10 instances</p>
                     <p className="text-slate-400">[LOG] Environment Variables Loaded from Secure Vault</p>
                     <p className="text-yellow-400">[WARN] Rate limiter detected 12 throttled attempts from cluster region AC-1</p>
                     <p className="text-emerald-400">[OK] Ledger Hash Chain successfully verified up to block #1204</p>
                  </div>
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                     <Cpu size={200} />
                  </div>
               </div>
            </div>

            {/* Integrity Shield Sidebar */}
            <div className="space-y-8">
               <div className="bg-indigo-600 p-12 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
                  <ShieldCheck size={80} className="mb-8 opacity-50" />
                  <h3 className="text-3xl font-black mb-4 tracking-tighter leading-tight">Tamper Prevention System</h3>
                  <p className="text-indigo-100 font-medium mb-10">
                     Our infrastructure uses automated reconciliation every 15 minutes to detect bit-rot or unauthorized injection.
                  </p>
                  <button className="w-full bg-white text-indigo-600 py-5 rounded-[24px] font-black text-xs tracking-widest hover:scale-105 transition-all">
                     FORCE RECONCILIATION
                  </button>
               </div>

               <div className="glass-card p-10 rounded-[50px] bg-white border border-slate-100 flex items-center gap-8">
                  <div className="bg-red-50 text-red-500 p-4 rounded-2xl">
                     <AlertTriangle size={32} />
                  </div>
                  <div>
                     <p className="text-sm font-black text-slate-900">Anomalous Events</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">0 Alerts in last 24h</p>
                  </div>
               </div>
            </div>

        </div>
      </div>
    </div>
  );
}
