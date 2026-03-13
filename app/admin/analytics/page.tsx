"use client";
import { useEffect, useState } from "react";
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Users, 
  Clock, 
  Download,
  Activity,
  ArrowLeft,
  PlayCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import ResultChart from "@/components/ResultChart";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setStats(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/run-simulation", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ number_of_votes: 50 })
      });
      const data = await res.json();
      alert(`Simulation Complete! Generated ${data.votersSimulated} mock votes.`);
      fetchAnalytics();
    } catch (err) {
      alert("Simulation failed.");
    } finally {
      setSimulating(false);
    }
  };

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
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
              Deep <span className="text-gradient">Intelligence</span>
            </h1>
            <p className="text-slate-500 mt-4 text-xl font-light max-w-xl">
              Advanced behavioral analytics and voting distribution metrics.
            </p>
          </div>
          <div className="flex gap-4">
             <button 
                onClick={runSimulation}
                disabled={simulating}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-8 py-4 rounded-3xl font-black text-xs tracking-widest transition-all border border-indigo-100 flex items-center gap-3"
             >
                {simulating ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
                RUN SIMULATION
             </button>
             <button className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs tracking-widest hover:bg-black transition-all flex items-center gap-3">
                <Download size={18} />
                EXPORT REPORT
             </button>
          </div>
        </div>

        {/* Dynamic Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Distribution Chart */}
            <div className="lg:col-span-2 space-y-12">
                <div className="glass-card p-12 rounded-[50px] bg-white border border-slate-100 shadow-xl shadow-blue-900/5">
                   <div className="flex items-center justify-between mb-12">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Voter Distribution</h3>
                        <p className="text-slate-500 text-sm font-bold mt-2 uppercase tracking-widest">Candidate Popularity Matrix</p>
                      </div>
                      <BarChart3 size={32} className="text-slate-200" />
                   </div>
                   {stats?.chartData && stats.chartData.length > 0 ? (
                      <ResultChart data={stats.chartData} />
                   ) : (
                      <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[40px] text-slate-400 font-bold">
                         NO LIVE DATA CAPTURED
                      </div>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="glass-card p-12 rounded-[50px] bg-white border border-slate-100">
                      <h4 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Voting Velocity</h4>
                      <div className="flex items-end gap-2 h-40">
                         {[40, 70, 45, 90, 65, 80, 55, 30].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-100 rounded-t-xl hover:bg-blue-500 transition-colors relative group" style={{ height: `${h}%` }}>
                               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  {h} vpm
                               </div>
                            </div>
                         ))}
                      </div>
                      <p className="text-center text-[10px] font-black text-slate-400 mt-6 uppercase tracking-widest">Last 8 Hours Velocity (v/m)</p>
                   </div>

                   <div className="glass-card p-12 rounded-[50px] bg-white border border-slate-100 group">
                      <h4 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Turnout Intensity</h4>
                      <div className="flex flex-col items-center justify-center h-40">
                         <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                               <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                               <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - (stats?.turnout || 0) / 100)} className="text-blue-600 transition-all duration-1000" />
                            </svg>
                            <span className="absolute text-2xl font-black text-slate-900">{stats?.turnout}%</span>
                         </div>
                         <p className="text-[10px] font-black text-slate-400 mt-6 uppercase tracking-widest text-center">Current Global Participation</p>
                      </div>
                   </div>
                </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
               <div className="bg-slate-900 p-12 rounded-[50px] text-white overflow-hidden relative shadow-2xl">
                  <h3 className="text-2xl font-black mb-10 tracking-tight">System Resilience</h3>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Database Sync</span>
                        <span className="text-xs font-black text-emerald-400">100% HEALTH</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">API Latency</span>
                        <span className="text-xs font-black text-slate-300">12ms - EXCELLENT</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending Hashes</span>
                        <span className="text-xs font-black text-slate-300">0 DETECTED</span>
                     </div>
                  </div>
                  <Users size={150} className="absolute bottom-[-50px] right-[-50px] opacity-10 pointer-events-none" />
               </div>

               <div className="glass-card p-10 rounded-[50px] bg-white border border-slate-100">
                  <h4 className="text-lg font-black text-slate-900 mb-8 tracking-tight">Behavioral Insights</h4>
                   <div className="space-y-6">
                      {[
                        { label: "Mobile Voting", val: "78%", icon: TrendingUp },
                        { label: "Night Time Polls", val: "12%", icon: Clock },
                        { label: "First Time Voters", val: "45%", icon: Activity }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                           <div className="bg-slate-50 p-3 rounded-2xl text-slate-400">
                              <item.icon size={18} />
                           </div>
                           <div className="flex-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600/30" style={{ width: item.val }}></div>
                                 </div>
                                 <span className="text-xs font-black text-slate-900">{item.val}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
               </div>
            </div>

        </div>
      </div>
    </div>
  );
}
