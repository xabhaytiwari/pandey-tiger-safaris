"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, User, LogOut, Phone, Menu, X, ShieldAlert } from "lucide-react";
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
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 max-w-6xl mx-auto">
        <nav className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-orange-500/5">
          {/* Brand Logo - Tiger Orange Accent */}
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2 group">
            <span className="text-white group-hover:text-orange-500 transition-colors">Pandey Tiger</span>
            <span className="text-xs bg-orange-500 text-black font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md shadow-orange-500/20">
              Safaris
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all relative ${
                    isActive
                      ? "text-black bg-white shadow-lg"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:9425331205" className="text-xs text-orange-500 font-bold flex items-center gap-1.5 hover:scale-105 transition-transform">
              <Phone className="w-3.5 h-3.5" /> +91 9425331205
            </a>
            {user ? (
              <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-3.5 py-1.5 rounded-full text-xs text-zinc-200">
                <User className="w-3.5 h-3.5 text-orange-500" />
                <span className="max-w-[90px] truncate">{user.name}</span>
                <button onClick={() => signOut(auth)} className="text-zinc-400 hover:text-red-400 ml-1">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-5 py-2 rounded-full text-xs transition-all shadow-lg shadow-orange-500/20 active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-orange-500" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </nav>

        {/* Mobile Full-Screen/Overlay Animated Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden mt-3 bg-black/95 border border-white/15 rounded-3xl p-6 backdrop-blur-3xl shadow-2xl shadow-black overflow-hidden"
            >
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between transition-all ${
                        isActive
                          ? "bg-orange-500 text-black"
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
                      className="w-full bg-white text-black font-extrabold py-3 rounded-2xl text-sm"
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
