"use client";
import { useState } from "react";
import { ShieldCheck, Search, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export default function VerifyPage() {
  const [receiptId, setReceiptId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    
    // For demo purposes, we'll return a success result
    setResult({
      status: "verified",
      timestamp: new Date().toLocaleString(),
      election: "Student Council Election 2026",
      isValid: true
    });
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="bg-indigo-100 w-20 h-20 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Audit Verification</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
          Verify that your anonymous ballot has been correctly included in the final tally using your unique receipt ID.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 p-8 md:p-12 mb-12">
        <form onSubmit={handleVerify} className="max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={receiptId}
                onChange={(e) => setReceiptId(e.target.value)}
                className="w-full pl-12 pr-4 py-5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono font-bold text-gray-700"
                placeholder="Enter Receipt ID (e.g. X82J91LA)"
                required
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            </div>
            <button
              type="submit"
              disabled={loading || !receiptId}
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:bg-gray-400 disabled:shadow-none min-w-[180px]"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify Inclusion"}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="border-t border-gray-100 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-green-50 rounded-[2rem] p-10 flex flex-col items-center text-center">
                <CheckCircle2 size={64} className="text-green-500 mb-6" />
                <h3 className="text-2xl font-extrabold text-green-900 mb-2">Vote Verified</h3>
                <p className="text-green-700 font-medium">Ballot hash found in secure storage.</p>
              </div>

              <div className="space-y-6 flex flex-col justify-center">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Election</h4>
                  <p className="text-lg font-bold text-gray-800">{result.election}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Recording Timestamp</h4>
                  <p className="text-lg font-bold text-gray-800">{result.timestamp}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Integrity Check</h4>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 size={18} />
                    <span className="font-bold underline decoration-2 underline-offset-4">PASS: HASH MATCHED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-900 rounded-[2rem] p-8 text-white flex items-center gap-6">
        <AlertTriangle className="text-blue-300 shrink-0" size={32} />
        <div>
          <h4 className="font-bold text-lg">Privacy Guaranteed</h4>
          <p className="text-blue-100 text-sm">
            This tool only confirms that a ballot associated with your receipt ID exists in the database. 
            It does NOT and CANNOT reveal whom you voted for.
          </p>
        </div>
      </div>
    </div>
  );
}
