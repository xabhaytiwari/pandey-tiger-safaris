"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Sparkles, Shield, ArrowRight, Car, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-4">
      {/* Apple Hero Section */}
      <section className="relative max-w-6xl mx-auto py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Business Owner • Dinesh Pandey (+91 9425331205)
          </div>

          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight text-balance leading-none">
            Unleash the Wild. <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              Bandhavgarh
            </span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
            Spearheaded by business owner Dinesh Pandey (+91 9425331205). Complete tour packages, luxury transport (Innova Crysta, Force Traveller, Swift Dzire), and an army of licensed safari guides on demand.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link href="/booking" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10">
              <Compass className="w-4 h-4" /> Book Safari
            </Link>
            <Link href="/custom-package" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
              Custom Package <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Apple Bento Grid Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-8 text-center">Engineered for Wildlife Pursuits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: Tour Packages */}
          <Link href="/packages" className="group md:col-span-2 bg-zinc-900/40 border border-white/10 rounded-3xl p-8 hover:border-amber-500/40 transition-all relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[300px]">
            <div className="space-y-3 z-10">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Featured Packages</span>
              <h3 className="text-3xl font-bold text-white group-hover:text-amber-400 transition-colors">Bandhavgarh Tour Packages</h3>
              <p className="text-zinc-400 text-sm max-w-md">3-Day & 4-Day complete travel packages including 4x4 open safari permits, resort stays, and luxury pickup transfers priced in INR (₹).</p>
            </div>
            <div className="z-10 flex items-center gap-2 text-xs font-bold text-amber-400 pt-4">
              Explore All Packages <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute right-0 bottom-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <img src="https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800" alt="Tiger" className="w-80 h-80 object-cover rounded-tl-3xl" />
            </div>
          </Link>

          {/* Bento Card 2: Vehicles */}
          <Link href="/fleet" className="group bg-zinc-900/40 border border-white/10 rounded-3xl p-8 hover:border-amber-500/40 transition-all relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[300px]">
            <div className="space-y-3 z-10">
              <Car className="w-8 h-8 text-amber-400" />
              <h3 className="text-2xl font-bold text-white">Luxury Fleet</h3>
              <p className="text-zinc-400 text-xs">Innova Crysta, Force Traveller, Swift Dzire & Open 4x4 Gypsies.</p>
            </div>
            <div className="z-10 text-xs font-bold text-amber-400 flex items-center gap-1 pt-4">
              View Fleet <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Bento Card 3: About Founder */}
          <Link href="/about" className="group bg-zinc-900/40 border border-white/10 rounded-3xl p-8 hover:border-amber-500/40 transition-all relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[280px]">
            <div className="space-y-3 z-10">
              <Users className="w-8 h-8 text-amber-400" />
              <h3 className="text-2xl font-bold text-white">Owner: Dinesh Pandey</h3>
              <p className="text-zinc-400 text-xs">Providing full tours, travels & an army of top forest guides. Call +91 9425331205.</p>
            </div>
            <div className="z-10 text-xs font-bold text-amber-400 flex items-center gap-1 pt-4">
              About Dinesh Pandey <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Bento Card 4: Custom Package */}
          <Link href="/custom-package" className="group md:col-span-2 bg-gradient-to-r from-zinc-900/80 to-zinc-950 border border-amber-500/30 rounded-3xl p-8 hover:border-amber-500/60 transition-all relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[280px]">
            <div className="space-y-3 z-10">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Personalized Requests</span>
              <h3 className="text-3xl font-bold text-white">Bespoke Travel Requests</h3>
              <p className="text-zinc-400 text-sm max-w-md">Have a specific budget or transport request? Submit custom requirements directly to business owner Dinesh Pandey.</p>
            </div>
            <div className="z-10 text-xs font-bold text-amber-400 flex items-center gap-1 pt-4">
              Submit Custom Request <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
