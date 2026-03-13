import { Calendar, ArrowRight, PlayCircle, ShieldCheck, Timer } from "lucide-react";
import Link from "next/link";

interface ElectionCardProps {
  election: {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    status: string;
  };
  isAdmin?: boolean;
}

export default function ElectionCard({ election, isAdmin }: ElectionCardProps) {
  const isDraft = election.status === "DRAFT";
  const isOpen = election.status === "OPEN";
  const isClosed = election.status === "CLOSED";

  const statusColors = {
    OPEN: "bg-emerald-100 text-emerald-700 border-emerald-200",
    DRAFT: "bg-amber-100 text-amber-700 border-amber-200",
    CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
    ARCHIVED: "bg-slate-100 text-slate-400 border-slate-200",
  };

  return (
    <div className="glass-card p-10 rounded-[45px] hover:-translate-y-2 transition-all group flex flex-col h-full bg-white/60">
      <div className="flex justify-between items-start mb-8">
        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
          statusColors[election.status as keyof typeof statusColors] || statusColors.CLOSED
        }`}>
          {election.status}
        </div>
        <div className="bg-slate-50 p-2.5 rounded-2xl text-slate-400">
           <Calendar size={20} />
        </div>
      </div>

      <div className="mb-auto">
        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
          {election.title}
        </h3>
        <p className="text-slate-500 font-medium mb-8 line-clamp-2 leading-relaxed opacity-80">
          {election.description}
        </p>

        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
            <Timer size={18} className="text-blue-400" />
            <span className="uppercase tracking-tight">Ends: {new Date(election.endTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span className="uppercase tracking-tight tracking-widest">End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {isAdmin ? (
          <Link
            href={`/admin/election/${election.id}`}
            className="flex-1 bg-slate-900 text-white text-center py-5 rounded-3xl font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            MANAGE BALLOT
          </Link>
        ) : (
          <Link
            href={isOpen ? `/vote/${election.id}` : `/elections/${election.id}`}
            className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-3xl font-black text-sm tracking-widest transition-all ${
              isOpen 
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 hover:scale-[1.02]" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isOpen ? "PARTICIPATE" : "LOCKED"}
            {isOpen ? <ArrowRight size={20} /> : <PlayCircle size={20} className="opacity-40" />}
          </Link>
        )}
      </div>
    </div>
  );
}
