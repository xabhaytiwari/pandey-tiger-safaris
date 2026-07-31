"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Phone, Menu, X, Sun } from "lucide-react";
import { auth, onAuthStateChanged, signOut } from "../../lib/firebase";
import { triggerHaptic } from "../../lib/sound";
import JungleAmbiance from "../ui/JungleAmbiance";

const AuthModal = dynamic(() => import("../auth/AuthModal"), { ssr: false });

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Weather Cycling for All MP Parks
  const parkWeatherList = [
    "🌤️ 26°C Bandhavgarh • Tala Open",
    "☀️ 28°C Kanha • Mukki Open",
    "🌤️ 27°C Pench • Turia Open",
    "⛅ 29°C Panna • Madla Open",
    "🌤️ 25°C Satpura • Panaarpani Open"
  ];
  const [weatherIndex, setWeatherIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWeatherIndex((prev) => (prev + 1) % parkWeatherList.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [parkWeatherList.length]);

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
    { href: "/sightings", label: "Live Map" },
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
      <header className="fixed top-0 left-0 right-0 z-[100] w-full bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          
          <Link href="/" onClick={() => { triggerHaptic(10); setMobileMenuOpen(false); }} className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2 group">
            <span className="text-white group-hover:text-orange-500 transition-colors">Pandey Tiger</span>
            <span className="text-xs bg-orange-500 text-black font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md shadow-orange-500/20">
              Safaris
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-zinc-950 border border-white/10 p-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => triggerHaptic(10)}
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

          <div className="hidden lg:flex items-center gap-2.5">
            {/* Auto-Cycling Weather Badge Across All MP Parks */}
            <div className="hidden xl:flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold px-3.5 py-1.5 rounded-full min-w-[210px] justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={parkWeatherList[weatherIndex]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="whitespace-nowrap"
                >
                  {parkWeatherList[weatherIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <JungleAmbiance />

            <a href="tel:9425331205" onClick={() => triggerHaptic(12)} className="text-xs text-orange-400 font-bold flex items-center gap-1.5 hover:scale-105 transition-transform bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-md active:scale-95">
              <Phone className="w-3.5 h-3.5 text-orange-500" /> +91 9425331205
            </a>

            {user ? (
              <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-3.5 py-1.5 rounded-full text-xs text-zinc-200 backdrop-blur-md hover:border-orange-500/40 transition-all">
                <Link href="/my-bookings" onClick={() => triggerHaptic(10)} className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                  <User className="w-3.5 h-3.5 text-orange-500" />
                  <span className="max-w-[90px] truncate font-medium">{user.name}</span>
                </Link>
                <button onClick={() => { triggerHaptic(15); signOut(auth); }} className="text-zinc-400 hover:text-red-400 ml-1" title="Sign Out">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { triggerHaptic(12); setIsAuthOpen(true); }}
                className="bg-orange-500 hover:bg-orange-400 text-black font-extrabold px-5 py-2 rounded-full text-xs transition-all shadow-lg shadow-orange-500/25 active:scale-95"
              >
                Sign In
              </motion.button>
            )}
          </div>

          <button
            onClick={() => { triggerHaptic(10); setMobileMenuOpen(!mobileMenuOpen); }}
            className="lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none active:scale-95"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-orange-500" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-3xl px-6 py-4 space-y-2.5 overflow-hidden"
            >
              <div className="flex flex-col space-y-2">
                <div className="pb-2 border-b border-white/10 flex justify-between items-center">
                  <JungleAmbiance />
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                    {parkWeatherList[weatherIndex]}
                  </span>
                </div>

                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => { triggerHaptic(10); setMobileMenuOpen(false); }}
                      className={`px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-between transition-all ${
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
                  <a href="tel:9425331205" onClick={() => triggerHaptic(12)} className="text-sm text-orange-500 font-extrabold flex items-center justify-center gap-2 py-2">
                    <Phone className="w-4 h-4" /> Call Owner: 9425331205
                  </a>
                  {!user ? (
                    <button
                      onClick={() => {
                        triggerHaptic(12);
                        setIsAuthOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-2xl text-sm shadow-lg active:scale-95"
                    >
                      Sign In / Register
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        triggerHaptic(15);
                        signOut(auth);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 active:scale-95"
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
