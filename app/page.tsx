import Link from "next/link";
import { Vote, Shield, CheckCircle, Smartphone, ArrowRight, Lock, Fingerprint, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-128px)] flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pb-32 px-4 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 animate-bounce shadow-sm">
            <Shield size={16} />
            The Gold Standard in Digital Voting
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
            The Future of <br />
            <span className="text-gradient">Secure Democracy</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            E-Ballot provides organizations with an immutable, anonymous, and high-security 
            platform for hosting critical elections with absolute confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/login" 
              className="group relative bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative">Start Voting Now</span>
              <ArrowRight className="relative group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            
            <Link 
              href="/verify" 
              className="px-10 py-5 rounded-2xl font-bold text-lg text-slate-600 border-2 border-slate-200 hover:border-slate-800 hover:text-slate-900 transition-all flex items-center gap-3"
            >
              <span>Verify My Balllot</span>
              <Globe size={20} />
            </Link>
          </div>

          {/* Stats / Proof */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-100 pt-12">
            {[
              { label: "Voters Secured", val: "1.2M+" },
              { label: "Uptime Guaranteed", val: "99.9%" },
              { label: "Elections Held", val: "15k+" },
              { label: "Security Score", val: "A+" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-slate-900">{stat.val}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <div className="bg-slate-50 py-10 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
          <span className="text-2xl font-bold text-slate-400 font-serif italic">GuardianSecurity</span>
          <span className="text-2xl font-bold text-slate-400">VOTECLOUD</span>
          <span className="text-2xl font-bold text-slate-400 tracking-widest uppercase">Nexus</span>
          <span className="text-2xl font-bold text-slate-400 font-mono">OpenVoter</span>
        </div>
      </div>

      {/* Feature Grid */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Uncompromising Security Architecture</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Built on military-grade encryption to ensure every single vote is counted exactly as cast.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-10 rounded-[40px] group transition-all">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 font-display">Quantum Isolation</h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Voter identity and ballot data are stored in completely separate database clusters with zero relational links.
              </p>
            </div>

            <div className="glass-card p-10 rounded-[40px] group transition-all">
              <div className="bg-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
                <Fingerprint size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 font-display">Biometric Sync</h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Seamless integration with modern device authentication (FaceID/TouchID) to verify personhood without storing biometric data.
              </p>
            </div>

            <div className="glass-card p-10 rounded-[40px] group transition-all">
              <div className="bg-emerald-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-transform">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 font-display">Immutable Receipt</h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Receive a cryptographic receipt ID immediately after voting. Verify your vote appears on the public board anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[50px] p-12 md:p-20 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Ready to host your most <br /> secure election yet?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login" className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all">
                Contact Sales
              </Link>
              <Link href="/login" className="bg-blue-500/30 text-white border border-white/20 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500/40 transition-all">
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
               <Vote size={24} />
            </div>
            <span className="text-2xl font-black text-slate-900">E-BALLOT</span>
          </div>
          <div className="flex gap-10 text-slate-500 font-medium">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Security</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Compliance</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Developers</a>
          </div>
          <div className="text-slate-400 text-sm">
            © 2026 E-Ballot Protocol. Distributed by Guardians.
          </div>
        </div>
      </footer>
    </div>
  );
}
