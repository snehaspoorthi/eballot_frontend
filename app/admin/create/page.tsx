"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, FileText, Plus, X, Loader2, ArrowLeft, ShieldCheck, UserPlus, Info } from "lucide-react";
import Link from "next/link";

export default function CreateElectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const [candidates, setCandidates] = useState([
    { name: "", party: "", description: "" }
  ]);

  const addCandidate = () => {
    setCandidates([...candidates, { name: "", party: "", description: "" }]);
  };

  const removeCandidate = (index: number) => {
    const newCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(newCandidates);
  };

  const updateCandidate = (index: number, field: string, value: string) => {
    const newCandidates = [...candidates];
    (newCandidates[index] as any)[field] = value;
    setCandidates(newCandidates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Election
      const electionRes = await fetch("http://localhost:5000/api/admin/create-election", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const electionData = await electionRes.json();
      if (!electionRes.ok) throw new Error(electionData.error);

      // 2. Add Candidates
      for (const candidate of candidates) {
        if (candidate.name) {
          await fetch("http://localhost:5000/api/admin/add-candidate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ ...candidate, electionId: electionData.id }),
          });
        }
      }

      router.push("/admin");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-32 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-12 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Control Center
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold mb-3">
              <Plus size={20} />
              <span>Protocol Deployment</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
              Create Ballot
            </h1>
            <p className="text-slate-500 mt-4 text-xl font-light max-w-xl">
              Configure parameters for a new electoral cycle and nominate verified candidates.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-12">
             {/* Basic Info */}
             <section className="glass-card p-12 rounded-[50px] bg-white border-slate-100 shadow-xl shadow-blue-900/5">
                <div className="flex items-center gap-4 mb-10">
                    <div className="bg-blue-600/10 text-blue-600 p-3 rounded-2xl">
                        <FileText size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configuration</h2>
                </div>
                
                <div className="space-y-8">
                    <div className="group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Ballot Title</label>
                        <input
                            type="text"
                            className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 text-lg"
                            placeholder="e.g. Presidential Election 2026"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    
                    <div className="group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Legislative Context / Description</label>
                        <textarea
                            className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 h-40 leading-relaxed"
                            placeholder="Detail the scope of this election, eligible voter districts, and procedural rules..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Polling Commencement</label>
                            <input
                                type="datetime-local"
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Polling Termination</label>
                            <input
                                type="datetime-local"
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>
             </section>

             {/* Candidates */}
             <section className="glass-card p-12 rounded-[50px] bg-white border-slate-100 shadow-xl shadow-blue-900/5">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-600/10 text-indigo-600 p-3 rounded-2xl">
                            <UserPlus size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nominations</h2>
                    </div>
                    <button
                        type="button"
                        onClick={addCandidate}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-900 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all border border-slate-100 flex items-center gap-2"
                    >
                        <Plus size={16} />
                        ADD ENTRY
                    </button>
                </div>

                <div className="space-y-8">
                    {candidates.map((candidate, index) => (
                    <div key={index} className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 relative group/card hover:border-indigo-200 transition-all">
                        <button
                            type="button"
                            onClick={() => removeCandidate(index)}
                            className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors bg-white p-2 rounded-xl shadow-sm border border-slate-100"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Full Candidate Name</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900"
                                    value={candidate.name}
                                    onChange={(e) => updateCandidate(index, "name", e.target.value)}
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Affiliation / Party</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-900"
                                    value={candidate.party}
                                    onChange={(e) => updateCandidate(index, "party", e.target.value)}
                                    placeholder="National Alliance"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Candidate Manifesto (Abridged)</label>
                            <textarea
                                className="w-full px-6 py-4 bg-white border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium text-slate-900 h-28 leading-relaxed placeholder:text-slate-300"
                                value={candidate.description}
                                onChange={(e) => updateCandidate(index, "description", e.target.value)}
                                placeholder="Explain the candidate's core platform and vision..."
                            />
                        </div>
                    </div>
                    ))}
                </div>
             </section>
           </div>

           {/* Sidebar Control */}
           <div className="space-y-12">
              <div className="bg-slate-900 p-12 rounded-[50px] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform">
                    <ShieldCheck size={120} />
                 </div>
                 <h3 className="text-3xl font-black mb-10 tracking-tight relative z-10">Deployment</h3>
                 <div className="space-y-8 relative z-10">
                    <div className="bg-white/5 p-6 rounded-[32px] border border-white/10">
                        <div className="flex items-center gap-3 text-emerald-400 mb-4">
                            <Info size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Pre-Flight Check</span>
                        </div>
                        <p className="text-sm font-medium text-slate-400 leading-relaxed">
                            Deploying this ballot will generate an immutable root hash in the audit archive. Candidates cannot be modified after polling commences.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-6 rounded-[32px] font-black text-xs tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 disabled:bg-slate-800 disabled:text-slate-600"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "FINALIZE BALLOT"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => router.push("/admin")}
                        className="w-full py-4 text-slate-500 font-bold text-[10px] tracking-widest hover:text-white transition-colors"
                    >
                        CANCEL DEPLOYMENT
                    </button>
                 </div>
              </div>

              <div className="glass-card p-12 rounded-[50px] bg-white shadow-xl shadow-blue-900/5">
                 <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Guidelines</h3>
                 <ul className="space-y-6">
                    {[
                        "Set start/end times at least 24 hours apart.",
                        "Provide valid identity proof for each candidate.",
                        "Describe the legislative scope clearly to voters.",
                        "Once finalized, the protocol is immutable."
                    ].map((text, i) => (
                        <li key={i} className="flex gap-4 items-start">
                            <div className="bg-blue-600 text-white w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">{i+1}</div>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed">{text}</p>
                        </li>
                    ))}
                 </ul>
              </div>
           </div>
        </form>
      </div>
    </div>
  );
}
