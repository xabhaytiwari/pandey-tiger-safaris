"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, User, LogOut, Menu, X, ShieldAlert } from "lucide-react";
import { auth, onAuthStateChanged, signOut } from "../../lib/firebase";
import AuthModal from "../auth/AuthModal";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/packages", label: "Packages" },
    { href: "/fleet", label: "Fleet" },
    { href: "/booking", label: "Book Safari" },
    { href: "/custom-package", label: "Custom" },
    { href: "/about", label: "About" },
    { href: "/admin", label: "Owner Dashboard" },
  ];

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 px-4 max-w-6xl mx-auto">
        <nav className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
          <Link href="/" className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Pandey Tiger</span>
            <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-mono">Safari</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/10 text-white shadow-inner font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="tel:9425331205" className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 hover:underline">
              <Phone className="w-3.5 h-3.5" /> 9425331205
            </a>
            {user ? (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-zinc-200">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="max-w-[100px] truncate">{user.name}</span>
                <button onClick={() => signOut(auth)} className="text-zinc-400 hover:text-red-400 ml-1">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-zinc-200 transition-all active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-1">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={(u: any) => setUser(u)} />
    </>
  );
}
