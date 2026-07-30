"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Compass, User, LogOut } from "lucide-react";

export default function Hero({ founder, user, onOpenAuth, onSignOut }: any) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-zinc-950 text-white overflow-hidden px-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=1920')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 max-w-6xl mx-auto flex justify-between items-center z-20">
        <div className="flex items-center gap-2 font-bold text-lg text-amber-500">
          <span>Pandey Tiger Safaris</span>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm">
                <User className="w-4 h-4 text-amber-500" />
                <span>{user.name}</span>
              </div>
              <button onClick={onSignOut} className="p-2 text-zinc-400 hover:text-red-400 bg-zinc-900 rounded-full border border-zinc-800" title="Sign Out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2 rounded-lg text-sm transition-all">
              Login / Signup
            </button>
          )}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 pt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-3 justify-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-sm font-medium">
            <MapPin className="w-4 h-4" /> HQ: Bandhavgarh
          </span>
          <a href="tel:9425331205" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30">
            <Phone className="w-4 h-4" /> Call Founder: +91 9425331205
          </a>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl md:text-7xl font-extrabold tracking-tight">
          Pandey <span className="text-amber-500">Tiger</span> Safaris
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Spearheaded by founder <span className="text-white font-semibold">Dinesh Pandey (+91 9425331205)</span>. Complete safari packages, Innova Crysta, Force Traveller, Swift Dzire transfers & custom wildlife itineraries in Bandhavgarh.
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <a href="#booking" className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
            <Compass className="w-5 h-5" /> Book Safari
          </a>
          <a href="#custom-package" className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-all">
            Custom Package Request
          </a>
        </motion.div>
      </div>
    </section>
  );
}
