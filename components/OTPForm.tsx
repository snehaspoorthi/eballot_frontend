"use client";
import { useState } from "react";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

interface OTPFormProps {
  userId: string;
  onSuccess: (token: string, user: any) => void;
  onBack: () => void;
}

export default function OTPForm({ userId, onSuccess, onBack }: OTPFormProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      onSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <div className="bg-blue-600/10 w-20 h-20 rounded-[30px] flex items-center justify-center text-blue-600 mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">One-Time Password</h2>
        <p className="text-slate-500 mt-2 font-medium">Verify your session with the 6-digit code sent to your registered channel.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-3">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Authentication Code</label>
             <span className="text-xs font-bold text-blue-600">Secure Entry</span>
          </div>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-6 py-6 bg-slate-50 border border-slate-200 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-center text-4xl tracking-[0.5em] font-black text-slate-900 transition-all placeholder:text-slate-200"
            placeholder="000000"
            required
            autoFocus
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:shadow-none"
          >
            {loading ? <Loader2 className="animate-spin" /> : "AUTHENTICATE"}
            {!loading && <ArrowRight size={20} />}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-4 text-slate-400 font-black text-xs tracking-widest hover:text-slate-900 transition-colors"
          >
            BACK TO IDENTITY PORTAL
          </button>
        </div>
      </form>
      
      <div className="mt-12 pt-8 border-t border-slate-50 text-center">
         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">End-to-End Cryptography Enabled</p>
      </div>
    </div>
  );
}
