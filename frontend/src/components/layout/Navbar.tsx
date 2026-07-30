"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Phone, Menu, X } from "lucide-react";
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
      {/* End-to-End Liquid Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full bg-black/70 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div className="max-w-[1400px] mx-auto px-6 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo - Pandey Tiger Safaris */}
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2 group">
            <span className="text-white group-hover:text-orange-500 transition-colors">Pandey Tiger</span>
            <span className="text-xs bg-orange-500 text-black font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md shadow-orange-500/20">
              Safaris
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/10 p-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all relative ${
                    isActive
                      ? "text-black font-extrabold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 rounded-full -z-10 shadow-[0_0_20px_rgba(255,122,0,0.4)]"
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:9425331205" className="text-xs text-orange-400 font-bold flex items-center gap-1.5 hover:scale-105 transition-transform bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Phone className="w-3.5 h-3.5 text-orange-500" /> +91 9425331205
            </a>
            {user ? (
              <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 px-3.5 py-1.5 rounded-full text-xs text-zinc-200 backdrop-blur-md hover:border-orange-500/40 transition-all">
                <Link href="/my-bookings" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                  <User className="w-3.5 h-3.5 text-orange-500" />
                  <span className="max-w-[100px] truncate font-medium">{user.name}</span>
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

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-orange-500" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-3xl px-6 py-4 space-y-2.5 overflow-hidden"
            >
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

              <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
                <a href="tel:9425331205" className="text-sm text-orange-500 font-extrabold flex items-center justify-center gap-2 py-2">
                  <Phone className="w-4 h-4" /> Call Owner: 9425331205
                </a>
                {!user ? (
                  <button
                    onClick={() => {
                      setIsAuthOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-2xl text-sm shadow-lg"
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
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={(u: any) => setUser(u)} />
    </>
  );
}
