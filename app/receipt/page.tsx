"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Copy, Download, Home, ShieldCheck } from "lucide-react";
import { useState, Suspense } from "react";

function ReceiptContent() {
  const searchParams = useSearchParams();
  const receiptId = searchParams.get("id");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (receiptId) {
      navigator.clipboard.writeText(receiptId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-14 border border-blue-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
          
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center text-green-600 mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={48} />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Vote Recorded!</h1>
          <p className="text-gray-500 mb-10 leading-relaxed font-medium">
            Your anonymous ballot has been safely stored in the system. 
            Keep your receipt ID to verify your vote's inclusion later.
          </p>

          <div className="bg-gray-50 rounded-3xl p-8 mb-10 border border-gray-100 group relative">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">Vote Receipt ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono font-bold text-blue-600 truncate max-w-[200px]">
                {receiptId || "X82J91LA"}
              </span>
              <button 
                onClick={handleCopy}
                className="text-gray-400 hover:text-blue-600 p-2 rounded-xl hover:bg-white transition-all shadow-sm"
              >
                {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <Home size={20} />
              Return to Dashboard
            </Link>
            <Link 
              href="/verify" 
              className="text-gray-500 font-bold py-3 hover:text-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck size={20} />
              Verify on Audit Board
            </Link>
          </div>
        </div>
        
        <p className="mt-8 text-gray-400 text-sm font-medium">
          Digital Signature: {Math.random().toString(36).substring(2, 18).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReceiptContent />
    </Suspense>
  );
}
