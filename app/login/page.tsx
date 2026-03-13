"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Loader2, UserPlus, Fingerprint, ShieldCheck } from "lucide-react";
import OTPForm from "@/components/OTPForm";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (isLogin) {
        setUserId(data.userId);
        setShowOtp(true);
      } else {
        setIsLogin(true);
        alert("Registration successful! Please login.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-6 bg-[#f8fafc]">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-[1000px] w-full grid md:grid-cols-2 bg-white rounded-[48px] shadow-2xl shadow-blue-900/10 overflow-hidden border border-slate-100">
        {/* Visual Sidebar */}
        <div className="hidden md:flex flex-col justify-between p-16 bg-slate-900 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-slate-900 opacity-60"></div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-16">
                 <div className="bg-white text-blue-600 p-2 rounded-xl">
                    <ShieldCheck size={28} />
                 </div>
                 <span className="text-2xl font-black tracking-tighter">E-BALLOT</span>
              </div>
              <h2 className="text-5xl font-black leading-tight mb-8">
                 Secure your <br />
                 democracy via <br />
                 <span className="text-blue-400">cryptography.</span>
              </h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xs">
                 Join 1.2M+ verified voters across the world using our protocol.
              </p>
           </div>
           <div className="relative z-10 flex items-center gap-4 py-8 border-t border-white/10">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                 ))}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusting 15k+ Orgs</span>
           </div>
           <div className="absolute bottom-0 right-0 p-12 opacity-10 pointer-events-none">
              <Fingerprint size={300} />
           </div>
        </div>

        {/* Form Area */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          {!showOtp ? (
            <>
              <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                  {isLogin ? "Welcome Back" : "Join the Portal"}
                </h1>
                <p className="text-slate-400 font-medium">
                  {isLogin ? "Authenticate your digital identity." : "Register to participate in upcoming elections."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Legal Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                        placeholder="Johnathan Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      <LogIn className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    </div>
                  </div>
                )}

                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Identity Endpoint (Email)</label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                      placeholder="name@organization.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-xs">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-sm tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "AUTHENTICATE" : "REGISTER")}
                  {!loading && (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
                </button>
              </form>

              <div className="mt-10 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                  {isLogin ? "Need an identity? Register" : "Have an identity? Login"}
                </button>
              </div>
            </>
          ) : (
            <OTPForm userId={userId} onSuccess={handleOtpSuccess} onBack={() => setShowOtp(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
