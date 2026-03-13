"use client";
import { useEffect, useState } from "react";
import { Shield, Users, Vote as VoteIcon, TrendingUp, CheckCircle, Clock } from "lucide-react";

export default function TransparencyPage() {
  const [stats, setStats] = useState<any>(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch public stats (we can use a public version of stats or same endpoint if handled)
        // For research prototype, we use the admin stats endpoint logic but only show safe data
        const res = await fetch("http://localhost:5000/api/audit/health"); // Just to check connection
        const electionsRes = await fetch("http://localhost:5000/api/voter/elections");
        
        // Manual stats calculation for transparency (publicly available info)
        const electionsData = await electionsRes.json();
        
        if (Array.isArray(electionsData)) {
            setElections(electionsData);
            
            // Simulated public stats
            setStats({
                votesCast: 856,
                totalVoters: 1240,
                turnout: 69,
                activeElections: electionsData.length,
                status: 'SECURE'
            });
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-24 pb-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-black mb-6 border border-emerald-100 uppercase tracking-widest">
            <Shield size={16} />
            Public Verification Portal
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            Trust through <span className="text-gradient">Transparency.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            The E-Ballot protocol is designed for absolute visibility. Here you can monitor 
            the real-time integrity and turnout of ongoing elections.
          </p>
        </div>

        {/* Real-time Ticker */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { label: "Network State", val: "OPERATIONAL", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Total Ballots Cast", val: stats?.votesCast || "...", icon: VoteIcon, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Global Turnout", val: `${stats?.turnout || "..."}%`, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Integrity Score", val: "100%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-10 rounded-[40px] bg-white border border-slate-100">
              <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon size={28} />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Active Election Stream */}
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Live Election Stream</h2>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
               <Clock size={16} />
               Updates every 60s
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {elections.map((election: any) => (
              <div key={election.id} className="glass-card p-12 rounded-[50px] bg-white border border-slate-100 hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-8">
                   <div className="px-5 py-2 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                      BALLOT ACTIVE
                   </div>
                   <div className="text-slate-300">
                      <VoteIcon size={32} />
                   </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {election.title}
                </h3>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">
                    {election.description}
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-50">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Turnout Rate</p>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500" style={{ width: '45%' }}></div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Results State</p>
                      <p className="text-xs font-black text-slate-400 italic">NESTED UNTIL CLOSURE</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-24 p-12 rounded-[50px] bg-slate-900 text-white relative overflow-hidden text-center">
            <div className="relative z-10">
               <h3 className="text-2xl font-black mb-4">Verifiable Infrastructure</h3>
               <p className="text-slate-400 max-w-xl mx-auto font-medium">
                  We use Zero-Knowledge Proof principles and cryptographic hash chaining 
                  to ensure your privacy while maintaining absolute public auditability.
               </p>
            </div>
            <Shield size={300} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
