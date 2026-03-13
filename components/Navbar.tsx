"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Vote, User, LogOut, LayoutDashboard, ShieldCheck, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const syncUserFromStorage = () => {
    try {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    syncUserFromStorage();

    const handleAuthChanged = () => syncUserFromStorage();
    window.addEventListener("auth-changed", handleAuthChanged as EventListener);
    window.addEventListener("focus", handleAuthChanged);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("auth-changed", handleAuthChanged as EventListener);
      window.removeEventListener("focus", handleAuthChanged);
    };
  }, []);

  useEffect(() => {
    // Re-sync on navigation (same-tab localStorage changes don't fire `storage` events)
    syncUserFromStorage();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Transparency", href: "/transparency" },
    { name: "Verify", href: "/verify" },
    ...(user ? [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] : []),
    ...(user?.role === "ADMIN" ? [{ name: "Admin", href: "/admin", icon: ShieldCheck }] : []),
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className={`glass px-6 py-3 rounded-[32px] flex justify-between items-center transition-all ${
          scrolled ? "shadow-xl border-white/40" : "border-white/10"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 text-white p-2 rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
               <Vote size={24} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">E-BALLOT</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors flex items-center gap-2 ${
                  pathname === link.href 
                    ? "text-blue-600" 
                    : "text-slate-900 hover:text-blue-600"
                }`}
              >
                {link.icon && <link.icon size={16} />}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Verified User</p>
                  <p className="text-sm font-black text-slate-900">{user.name}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1 rounded-full p-[2px]">
                   <div className="bg-white rounded-full p-2 text-blue-600">
                      <User size={18} />
                   </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-slate-100 hover:bg-red-50 hover:text-red-600 p-2.5 rounded-full text-slate-500 transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-slate-200/50"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Toggle */}
            <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[88px] bg-white/95 backdrop-blur-xl z-50 p-6 flex flex-col gap-4">
           {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4"
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 bg-blue-600 text-white p-5 rounded-3xl text-center font-bold text-xl"
              >
                Log In
              </Link>
            )}
        </div>
      )}
    </nav>
  );
}
