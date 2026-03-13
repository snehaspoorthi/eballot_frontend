"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Vote as VoteIcon, User, Check, Loader2, Info, Sparkles } from "lucide-react";
import { apiClient } from "@/services/apiClient";

export default function VotePage() {
  const { id: electionId } = useParams();
  const router = useRouter();
  const [election, setElection] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [summaries, setSummaries] = useState<{ [key: string]: string }>({});
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  useEffect(() => {
    apiClient(`/voter/election/${electionId}`)
      .then((data) => {
        setElection(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [electionId]);

  const handleSummarize = async (candidate: any) => {
    if (summaries[candidate.id] || summarizingId) return;
    setSummarizingId(candidate.id);

    try {
      const data = await apiClient("/ai/summarize", {
        method: "POST",
        body: JSON.stringify({
          manifesto: candidate.description,
          candidateName: candidate.name,
        }),
      });

      setSummaries((prev) => ({ ...prev, [candidate.id]: data.summary }));
    } catch (err) {
      console.error("Summarize error:", err);
    } finally {
      setSummarizingId(null);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) return;
    setSubmitting(true);
    setError("");

    try {
      const data = await apiClient("/voter/cast-vote", {
        method: "POST",
        body: JSON.stringify({ electionId, candidateId: selectedCandidate }),
      });

      // Successfully voted
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...user, hasVoted: true }));
      
      router.push(`/receipt?id=${data.receiptId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (!election) return <div>Election not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{election.title}</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">{election.description}</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-3xl mb-12 flex items-start gap-4">
        <Info className="text-yellow-600 shrink-0" size={24} />
        <p className="text-yellow-800 text-sm leading-relaxed">
          <strong>Secure Voting Notice:</strong> Your vote is anonymous. Your identity will be verified before casting, but only the vote itself will be stored. You cannot change your vote once submitted.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <User size={24} />
        Select a Candidate
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {election.candidates.map((candidate: any) => (
          <div key={candidate.id} className="relative group">
            <button
              onClick={() => setSelectedCandidate(candidate.id)}
              className={`w-full p-8 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden h-full ${
                selectedCandidate === candidate.id 
                ? "border-blue-600 bg-blue-50 shadow-xl shadow-blue-50" 
                : "border-gray-100 bg-white hover:border-blue-200"
              }`}
            >
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {candidate.name}
                  </h3>
                  <p className="text-gray-500 font-medium mt-1 uppercase text-xs tracking-wider">
                    {candidate.party}
                  </p>
                </div>
                {selectedCandidate === candidate.id && (
                  <div className="bg-blue-600 text-white p-2 rounded-full">
                    <Check size={18} />
                  </div>
                )}
              </div>
              
              {!summaries[candidate.id] ? (
                <p className="mt-6 text-gray-600 text-sm leading-relaxed relative z-10">
                  {candidate.description}
                </p>
              ) : (
                <div className="mt-6 p-4 bg-white/60 border border-blue-100 rounded-2xl relative z-20 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 mb-3 text-blue-600 font-bold text-xs uppercase tracking-widest">
                    <Sparkles size={14} />
                    <span>AI Analysis</span>
                  </div>
                  <div className="text-gray-700 text-sm leading-loose whitespace-pre-line font-medium">
                    {summaries[candidate.id]}
                  </div>
                </div>
              )}

              {/* Background Icon */}
              <User size={120} className={`absolute -right-8 -bottom-8 opacity-5 transition-transform ${selectedCandidate === candidate.id ? "scale-110" : "scale-100"}`} />
            </button>
            
            {/* AI Summary Button */}
            {!summaries[candidate.id] && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSummarize(candidate);
                }}
                disabled={summarizingId === candidate.id}
                className="absolute top-6 right-6 z-30 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:bg-slate-400 group/ai"
              >
                {summarizingId === candidate.id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} className="group-hover/ai:animate-pulse" />
                )}
                {summarizingId === candidate.id ? "Analyzing..." : "AI Summary"}
              </button>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-center mb-8 bg-red-50 p-4 rounded-2xl font-medium">{error}</p>}

      <div className="flex flex-col items-center">
        <button
          onClick={handleVote}
          disabled={!selectedCandidate || submitting}
          className="w-full max-w-md bg-blue-600 text-white py-5 rounded-[2rem] font-bold text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:shadow-none translate-y-0 active:translate-y-1"
        >
          {submitting ? <Loader2 className="animate-spin" /> : <VoteIcon size={24} />}
          {submitting ? "Processing Ballot..." : "Submit My Secret Vote"}
        </button>
        <p className="mt-6 text-gray-400 text-sm font-medium">Verified by E-Ballot Security Protocol</p>
      </div>
    </div>
  );
}
