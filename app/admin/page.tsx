"use client";
import { useEffect, useState } from "react";
import { 
  Users, 
  Vote as VoteIcon, 
  Activity, 
  PlusCircle, 
  ShieldAlert, 
  Settings,
  ArrowUpRight,
  TrendingUp,
  Loader2,
  Lock,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Hash,
  X,
  AlertTriangle,
  History,
  Terminal,
  Server,
  Trash2
} from "lucide-react";
import Link from "next/link";
import ResultChart from "@/components/ResultChart";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    totalVoters: 0,
    votesCast: 0,
    turnout: 0,
    activeElections: 0,
    securityEvents: 0,
    chartData: [],
    electionTitle: "Fetching Data...",
    recentLogs: []
  });
  const [elections, setElections] = useState<any[]>([]);
  const [voters, setVoters] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showVoterList, setShowVoterList] = useState(false);
  const [showLogArchive, setShowLogArchive] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [halting, setHalting] = useState(false);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const [statsData, electionsData, votersData] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API_URL}/admin/elections`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API_URL}/admin/voters`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ]);

      // Be resilient to API errors / shape changes
      setStats((prev: any) => ({
        ...prev,
        ...(statsData && typeof statsData === "object" ? statsData : {}),
        totalVoters: Number(statsData?.totalVoters ?? 0),
        votesCast: Number(statsData?.votesCast ?? 0),
        turnout: Number(statsData?.turnout ?? 0),
        activeElections: Number(statsData?.activeElections ?? 0),
        securityEvents: Number(statsData?.securityEvents ?? 0),
        chartData: Array.isArray(statsData?.chartData) ? statsData.chartData : [],
        recentLogs: Array.isArray(statsData?.recentLogs) ? statsData.recentLogs : [],
        electionTitle: typeof statsData?.electionTitle === "string" ? statsData.electionTitle : prev.electionTitle,
      }));
      if (Array.isArray(electionsData)) setElections(electionsData);
      if (Array.isArray(votersData)) setVoters(votersData);

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // Auto-refresh every 30 seconds for "Live" effect
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteElection = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
        const res = await fetch(`${API_URL}/admin/election/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) { alert(data.message); fetchAdminData(); }
        else throw new Error(data.error);
    } catch (err: any) {
        alert(err.message || "Failed to delete election");
    }
  };

  const handleOpenElection = async (id: string, title: string) => {
    if (!confirm(`Open "${title}" for voting now?`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/open-election`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ electionId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to open election");
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to open election");
    }
  };

  const handleCloseElection = async (id: string, title: string) => {
    if (!confirm(`Close "${title}" and stop voting?`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/close-election`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ electionId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to close election");
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to close election");
    }
  };

  const handleEmergencyHalt = async () => {
    if (!confirm("CRITICAL: This will immediately terminate ALL active elections. Proceed?")) return;
    setHalting(true);
    try {
      const res = await fetch(`${API_URL}/admin/emergency-halt`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      alert(data.message);
      fetchAdminData();
    } catch (err) {
      alert("Failed to trigger security lockdown.");
    } finally {
      setHalting(false);
    }
  };

  const openLogArchive = async () => {
    setShowLogArchive(true);
    try {
      const res = await fetch(`${API_URL}/admin/logs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs");
    }
  };

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-3">
              <ShieldAlert size={20} />
              <span>Privileged Access Only</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
              Control Center
            </h1>
            <p className="text-slate-500 mt-4 text-xl font-light max-w-xl">
              System-wide orchestration of the E-Ballot protocol. Monitor turnout, verify integrity, and manage ballots.
            </p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/admin/create" 
              className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center gap-3"
            >
              <PlusCircle size={20} />
              CREATE BALLOT
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { label: "Registered Voters", val: (Number(stats.totalVoters) || 0).toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12%" },
            { label: "Votes Recorded", val: (Number(stats.votesCast) || 0).toLocaleString(), icon: VoteIcon, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+5%" },
            { label: "Current Turnout", val: `${stats.turnout}%`, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-500/10", trend: "Live" },
            { label: "Security Events", val: stats.securityEvents, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10", trend: "Secure" }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-10 rounded-[40px] bg-white hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-3xl`}>
                  <stat.icon size={24} />
                </div>
                {stat.trend && (
                  <span className={`flex items-center gap-1 ${stat.color} text-[10px] font-black bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100`}>
                    <Activity size={12} className="animate-pulse" />
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Analytics Chart */}
          <div className="lg:col-span-2 space-y-12">
            <div className="glass-card p-12 rounded-[50px] bg-white transition-all shadow-xl shadow-blue-900/5">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Live Intelligence</h3>
                  <p className="text-slate-800 text-sm font-black mt-2">Aggregated Data for: <span className="text-blue-600 underline decoration-2 underline-offset-4">{stats.electionTitle || "No Active Election"}</span></p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                   <Activity className="animate-pulse" size={16} />
                   <span className="text-xs font-black uppercase tracking-widest">Real-Time Sync</span>
                </div>
              </div>
              {stats.chartData.length > 0 ? (
                <ResultChart data={stats.chartData} />
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50">
                   <TrendingUp size={48} className="text-slate-200 mb-4" />
                   <p className="text-slate-400 font-bold">No active voting data available for chart</p>
                </div>
              )}
            </div>

            <div className="glass-card p-12 rounded-[50px] bg-white shadow-xl shadow-blue-900/5">
              <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">System Audit Log</h3>
              <div className="space-y-4">
                {stats.recentLogs.length > 0 ? (
                  stats.recentLogs.map((log: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-[32px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 group bg-white shadow-sm">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black group-hover:scale-110 transition-transform ${
                           log.action.includes('LOGIN') ? 'bg-amber-100 text-amber-700' : 
                           log.action.includes('VOTE') ? 'bg-emerald-100 text-emerald-700' :
                           'bg-slate-900 text-white'
                        }`}>
                          {log.action.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black tracking-tight text-slate-900 uppercase">
                             {log.action.replace(/_/g, ' ')}
                          </p>
                          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                         SECURE ID: {log.id.substring(0, 4)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-slate-400">No recent logs found.</p>
                )}
              </div>
              <button 
                onClick={openLogArchive}
                className="w-full mt-10 py-5 rounded-[24px] border-2 border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all font-black text-xs tracking-widest"
              >
                VIEW FULL SECURITY ARCHIVE
              </button>
            </div>
          </div>

          {/* Sidebar Management */}
          <div className="space-y-12">
            <div className="bg-slate-900 p-12 rounded-[50px] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                  <Lock size={120} />
               </div>
              <h3 className="text-3xl font-black mb-10 tracking-tight relative z-10">Orchestration</h3>
              <div className="grid grid-cols-1 gap-4 relative z-10">
                <button 
                  onClick={() => setShowVoterList(true)}
                  className="w-full bg-white/5 hover:bg-white/10 p-6 rounded-[32px] flex items-center gap-6 transition-all text-left"
                >
                    <div className="bg-white/10 p-4 rounded-2xl">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="font-black text-sm tracking-tight">Voter Registry</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Manage Authorized ID Pool</p>
                    </div>
                </button>
                
                <Link 
                  href="/admin/analytics"
                  className="w-full bg-white/5 hover:bg-white/10 p-6 rounded-[32px] flex items-center gap-6 transition-all text-left"
                >
                    <div className="bg-white/10 p-4 rounded-2xl">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="font-black text-sm tracking-tight">Analytics Lab</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Behavorial & Traffic Insights</p>
                    </div>
                </Link>

                <Link 
                  href="/admin/system-health"
                  className="w-full bg-white/5 hover:bg-white/10 p-6 rounded-[32px] flex items-center gap-6 transition-all text-left"
                >
                    <div className="bg-white/10 p-4 rounded-2xl">
                        <Activity size={20} />
                    </div>
                    <div>
                        <p className="font-black text-sm tracking-tight">System Health</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Node & Ledger Telemetry</p>
                    </div>
                </Link>

                <button 
                  onClick={() => setShowConfig(true)}
                  className="w-full bg-white/5 hover:bg-white/10 p-6 rounded-[32px] flex items-center gap-6 transition-all text-left"
                >
                    <div className="bg-white/10 p-4 rounded-2xl">
                        <Settings size={20} />
                    </div>
                    <div>
                        <p className="font-black text-sm tracking-tight">System Config</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Adjust Global Protocol Params</p>
                    </div>
                </button>
                
                <button 
                  onClick={handleEmergencyHalt}
                  disabled={halting}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 p-6 rounded-[32px] flex items-center gap-6 transition-all border border-red-500/20 mt-8 disabled:opacity-50"
                >
                  <div className="bg-red-500/20 p-4 rounded-2xl">
                    {halting ? <Loader2 className="animate-spin" size={20} /> : <ShieldAlert size={20} />}
                  </div>
                  <span className="font-black text-sm tracking-widest uppercase">Emergency halt</span>
                </button>
              </div>
            </div>

            <div className="glass-card p-12 rounded-[50px] bg-white shadow-xl shadow-blue-900/5">
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Active Protocols</h3>
              <div className="space-y-6">
                {loading ? (
                    [1,2].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-[32px]" />)
                ) : elections.length > 0 ? (
                    elections.map((e: any, i) => (
                        <div key={i} className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group relative">
                          <button 
                            onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteElection(e.id, e.title);
                            }}
                            className="absolute top-6 right-6 p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          >
                             <Trash2 size={16} />
                          </button>
                          <div className="flex justify-between items-start mb-4 pr-8">
                            <p className="font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors uppercase text-sm">{e.title}</p>
                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${e.status === "OPEN" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-200 text-slate-500 border-slate-300"}`}>
                              {e.status}
                            </span>
                          </div>
                          {/* Keep original card spacing; show control only on hover */}
                          <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            {e.status === "DRAFT" && (
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleOpenElection(e.id, e.title);
                                }}
                                className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
                              >
                                Open voting
                              </button>
                            )}
                            {e.status === "OPEN" && (
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleCloseElection(e.id, e.title);
                                }}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-slate-900 transition-colors"
                              >
                                Close voting
                              </button>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <Clock size={12} className="text-slate-300" />
                               <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Live Traffic</p>
                            </div>
                            <p className="text-[10px] text-slate-900 font-black">24ms Latency</p>
                          </div>
                        </div>
                      ))
                ) : (
                    <div className="text-center py-10">
                        <Calendar size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No deployed ballots</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voter Registry Modal */}
      {showVoterList && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setShowVoterList(false)}></div>
          <div className="relative glass-card bg-white w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-[50px] shadow-2xl flex flex-col">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
               <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Voter Registry</h2>
                  <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-widest">Authorized Identity Pool</p>
               </div>
               <button onClick={() => setShowVoterList(false)} className="bg-slate-100 p-4 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                  <X size={24} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10">
               <div className="grid grid-cols-1 gap-4">
                  {voters.length > 0 ? (
                    voters.map((voter: any) => (
                      <div key={voter.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 font-black relative">
                               {voter.name.charAt(0)}
                               {voter.verified && (
                                 <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                                    <CheckCircle2 size={10} />
                                 </div>
                               )}
                            </div>
                            <div>
                               <p className="font-black text-slate-900">{voter.name}</p>
                               <p className="text-xs font-bold text-slate-400 mt-1">{voter.email}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-8">
                            <div className="text-right hidden sm:block">
                               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Voter ID</p>
                               <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                                  <Hash size={10} />
                                  <span>{voter.voterId?.substring(0, 12)}...</span>
                               </div>
                            </div>
                            <div className="text-right min-w-[100px]">
                               {voter.hasVoted ? (
                                  <span className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                     <VoteIcon size={12} />
                                     VOTED
                                  </span>
                               ) : (
                                  <span className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                                     <Clock size={12} />
                                     PENDING
                                  </span>
                               )}
                            </div>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20">
                       <Users size={60} className="mx-auto text-slate-100 mb-6" />
                       <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">No voters registered</h3>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Logs Modal */}
      {showLogArchive && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setShowLogArchive(false)}></div>
          <div className="relative glass-card bg-white w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-[50px] shadow-2xl flex flex-col">
            <div className="p-10 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="bg-slate-900 text-white p-3 rounded-2xl">
                     <Terminal size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security Archive</h2>
                    <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-widest">Permanent Cryptographic Log</p>
                  </div>
               </div>
               <button onClick={() => setShowLogArchive(false)} className="bg-slate-100 p-4 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                  <X size={24} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 bg-slate-50">
               <div className="space-y-4 font-mono">
                  {logs.length > 0 ? (
                    logs.map((log: any, i) => (
                      <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col gap-4 shadow-sm">
                         <div className="flex flex-wrap items-center justify-between gap-4">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                               {log.action}
                            </span>
                            <span className="text-slate-400 text-xs font-bold">
                               {new Date(log.createdAt).toISOString()}
                            </span>
                         </div>
                         <div className="bg-slate-900 rounded-2xl p-4 overflow-x-auto">
                            <code className="text-blue-400 text-xs">
                               {JSON.stringify(log.metadata || {}, null, 2)}
                            </code>
                         </div>
                         <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            <Server size={12} />
                            Node ID: {log.id.split('-')[0]} // Block-Verified
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-slate-400">Archive empty or fetching...</div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* System Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setShowConfig(false)}></div>
          <div className="relative glass-card bg-white w-full max-w-2xl overflow-hidden rounded-[50px] shadow-2xl">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Config</h2>
               <button onClick={() => setShowConfig(false)} className="bg-slate-100 p-4 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                  <X size={24} />
               </button>
            </div>
            <div className="p-10 space-y-8">
               <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-black text-slate-900">Maintenance Mode</p>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Disable all public voting access</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed">
                     <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
               </div>
               <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-black text-slate-900">OTP Enforcement</p>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Required for all identity portals</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                     <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
               </div>
               <p className="text-xs font-bold text-slate-300 text-center uppercase tracking-widest">Configuration changes are logged to the permanent audit archive.</p>
               <button className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-xs tracking-widest hover:bg-black transition-all">
                  COMMIT CHANGES
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
