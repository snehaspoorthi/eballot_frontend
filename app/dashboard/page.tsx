"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, TrendingUp, Users, Clock, AlertCircle, ShieldCheck, ArrowUpRight } from "lucide-react";
import ElectionCard from "@/components/ElectionCard";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    fetch("http://localhost:5000/api/voter/elections", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setElections(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (!user) return null;

  return (
    <div className="pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-3">
              <ShieldCheck size={20} />
              <span>Identity Verified</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
              Welcome, {user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 mt-4 text-xl font-light max-w-xl">
              Your cryptographic identity is active. You are authorized to participate in the following ballots.
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="glass-card px-6 py-4 rounded-3xl flex items-center gap-4 bg-white/40">
                <div className="bg-blue-600/10 text-blue-600 p-3 rounded-2xl">
                   <Users size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Election Pool</p>
                   <p className="text-lg font-bold text-slate-900">{elections.length} Active</p>
                </div>
             </div>
          </div>
        </div>

        {user.hasVoted && (
          <div className="relative group mb-16 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-slate-900 rounded-[40px] p-10 md:p-14 text-white overflow-hidden shadow-2xl">
              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-black mb-6 leading-tight">Your Voice Has <br /> Been Secured.</h2>
                  <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                    A cryptographic proof of your vote has been generated. You can verify its inclusion 
                    in the immutable ballot box using your unique receipt ID.
                  </p>
                  <Link 
                    href="/verify" 
                    className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
                  >
                    <span>Verify Audit Trail</span>
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
                <div className="flex justify-center md:justify-end">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
                    <Trophy size={180} className="relative text-blue-400 drop-shadow-2xl" />
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <ShieldCheck size={400} />
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-center md:text-left">
          {[
            { icon: TrendingUp, color: "text-emerald-500", label: "Global Turnout", val: "74.2%", desc: "12% increase from 2024" },
            { icon: Clock, color: "text-orange-500", label: "Upcoming Deadlines", val: "48h Left", desc: "For University Senate" },
            { icon: AlertCircle, color: "text-blue-500", label: "Network Health", val: "STABLE", desc: "SHA-256 Latency: 4ms" }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-10 rounded-[40px] border-slate-100 hover:border-blue-200 transition-colors">
              <div className={`${stat.color} mb-6 flex justify-center md:justify-start`}>
                <stat.icon size={32} />
              </div>
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{stat.label}</h3>
              <p className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">{stat.val}</p>
              <p className="text-sm font-medium text-slate-500">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Elections Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Active Ballots</h2>
              <p className="text-slate-500 font-medium mt-2">Authenticated elections available for your participation.</p>
            </div>
            <div className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl">
               <button className="bg-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm">All Elections</button>
               <button className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-500">Popular</button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse glass-card bg-slate-200/20 h-[400px] rounded-[40px]"></div>
              ))}
            </div>
          ) : elections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {elections.map((election: any) => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 glass-card rounded-[50px] border-dashed border-2 border-slate-200">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <Clock size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Active Ballots</h3>
              <p className="text-slate-500 max-w-xs mx-auto">There are currently no elections in your registered district. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
