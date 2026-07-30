"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Phone, Menu, X, Sparkles } from "lucide-react";
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
    { href: "/my-bookings", label: "My Bookings" },
    { href: "/admin", label: "Owner Portal" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 max-w-6xl mx-auto">
        <nav className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-orange-500/10 transition-all hover:border-orange-500/30">
          {/* Posh One-Word Brand Logo */}
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-black text-xl tracking-wider text-white flex items-center gap-2 group">
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent group-hover:brightness-125 transition-all">
              PANTIGRIS
            </span>
            <span className="text-[10px] bg-orange-500 text-black font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md shadow-orange-500/20">
              Royale
            </span>
          </Link>

          {/* Desktop Spring Tab Slider */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all relative ${
                    isActive
                      ? "text-black font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full -z-10 shadow-lg shadow-orange-500/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Header Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:9425331205" className="text-xs text-orange-400 font-bold flex items-center gap-1.5 hover:scale-105 transition-transform bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
              <Phone className="w-3.5 h-3.5 text-orange-500" /> +91 9425331205
            </a>
            {user ? (
              <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-3.5 py-1.5 rounded-full text-xs text-zinc-200 hover:border-orange-500/40 transition-all">
                <Link href="/my-bookings" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                  <User className="w-3.5 h-3.5 text-orange-500" />
                  <span className="max-w-[90px] truncate">{user.name}</span>
                </Link>
                <button onClick={() => signOut(auth)} className="text-zinc-400 hover:text-red-400 ml-1" title="Sign Out">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAuthOpen(true)}
                className="bg-orange-500 hover:bg-orange-400 text-black font-extrabold px-5 py-2 rounded-full text-xs transition-all shadow-lg shadow-orange-500/25 active:scale-95"
              >
                Sign In
              </motion.button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-orange-500" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </nav>

        {/* Animated Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden mt-3 bg-black/95 border border-white/15 rounded-3xl p-6 backdrop-blur-3xl shadow-2xl shadow-black overflow-hidden"
            >
              <div className="flex flex-col space-y-2.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition-all ${
                        isActive
                          ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                          : "text-zinc-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-black" />}
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  <a href="tel:9425331205" className="text-sm text-orange-500 font-extrabold flex items-center justify-center gap-2 py-2">
                    <Phone className="w-4 h-4" /> Call Owner: 9425331205
                  </a>
                  {!user ? (
                    <button
                      onClick={() => {
                        setIsAuthOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-2xl text-sm"
                    >
                      Sign In / Register
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        signOut(auth);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out ({user.name})
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={(u: any) => setUser(u)} />
    </>
  );
}
