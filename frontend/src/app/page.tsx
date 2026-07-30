"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Sparkles, ArrowRight, Car, Users } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <main className="min-h-screen bg-black text-white px-4">
      {/* Animated Tiger Stripe Background Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[150px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto pt-28 pb-20 md:pt-36 md:pb-28 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 max-w-4xl"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-extrabold uppercase tracking-widest backdrop-blur-xl shadow-lg shadow-orange-500/10">
              <Sparkles className="w-4 h-4 text-orange-500" /> Owner Operated • Dinesh Pandey (+91 9425331205)
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black tracking-tight text-balance leading-none">
            Unleash the Wild. <br />
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Bandhavgarh
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p variants={itemVariants} className="text-zinc-400 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
            Spearheaded by business owner Dinesh Pandey (+91 9425331205). Complete tour packages, luxury transport (Innova Crysta, Force Traveller, Swift Dzire), and an army of licensed safari guides on demand.
          </motion.p>

          {/* Animated Call-to-Actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link href="/booking" className="w-full sm:w-auto px-9 py-4 bg-orange-500 text-black font-black text-sm rounded-full hover:bg-orange-400 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-orange-500/25">
                <Compass className="w-5 h-5" /> Book Safari Now
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link href="/custom-package" className="w-full sm:w-auto px-9 py-4 bg-zinc-900 border border-white/15 text-white font-bold text-sm rounded-full hover:bg-zinc-800 transition-all flex items-center justify-center gap-2.5 backdrop-blur-xl">
                Custom Safari Request <ArrowRight className="w-4 h-4 text-orange-500" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Banner */}
          <motion.div variants={itemVariants} className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-white/10 text-center">
            <div>
              <p className="text-3xl font-black text-orange-500">20+</p>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">100%</p>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Official Permits</p>
            </div>
            <div>
              <p className="text-3xl font-black text-orange-500">Fleet</p>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Innova / Traveller</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">Guides</p>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Army of Experts</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Section */}
      <section className="max-w-6xl mx-auto py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono uppercase tracking-widest text-orange-500 mb-8 text-center font-bold"
        >
          Engineered for Wildlife Pursuits
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Tour Packages */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }} className="md:col-span-2">
            <Link href="/packages" className="group block bg-zinc-950 border border-white/10 rounded-3xl p-8 hover:border-orange-500/50 transition-all relative overflow-hidden flex flex-col justify-between min-h-[320px] shadow-2xl">
              <div className="space-y-3 z-10">
                <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">Featured Itineraries</span>
                <h3 className="text-3xl font-black text-white group-hover:text-orange-500 transition-colors">Bandhavgarh Tour Packages</h3>
                <p className="text-zinc-400 text-sm max-w-md font-light leading-relaxed">3-Day & 4-Day complete travel packages including 4x4 open safari permits, luxury resort stays, and pickup transfers priced transparently in INR (₹).</p>
              </div>
              <div className="z-10 flex items-center gap-2 text-xs font-extrabold text-orange-500 pt-6">
                Explore All Packages <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
              <div className="absolute right-0 bottom-0 opacity-25 group-hover:opacity-40 transition-opacity">
                <img src="https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800" alt="Tiger" className="w-80 h-80 object-cover rounded-tl-3xl" />
              </div>
            </Link>
          </motion.div>

          {/* Card 2: Vehicles */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }}>
            <Link href="/fleet" className="group block bg-zinc-950 border border-white/10 rounded-3xl p-8 hover:border-orange-500/50 transition-all relative overflow-hidden flex flex-col justify-between min-h-[320px] shadow-2xl">
              <div className="space-y-4 z-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Luxury Vehicle Fleet</h3>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">Innova Crysta, Force Traveller, Swift Dzire & Open 4x4 Gypsies.</p>
              </div>
              <div className="z-10 text-xs font-extrabold text-orange-500 flex items-center gap-1.5 pt-6">
                View Fleet <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* Card 3: About Owner */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }}>
            <Link href="/about" className="group block bg-zinc-950 border border-white/10 rounded-3xl p-8 hover:border-orange-500/50 transition-all relative overflow-hidden flex flex-col justify-between min-h-[280px] shadow-2xl">
              <div className="space-y-4 z-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Owner: Dinesh Pandey</h3>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">Providing full tours, travels & an army of top forest guides. Call +91 9425331205.</p>
              </div>
              <div className="z-10 text-xs font-extrabold text-orange-500 flex items-center gap-1.5 pt-6">
                About Dinesh Pandey <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* Card 4: Custom Requests */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }} className="md:col-span-2">
            <Link href="/custom-package" className="group block bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-orange-500/30 rounded-3xl p-8 hover:border-orange-500/60 transition-all relative overflow-hidden flex flex-col justify-between min-h-[280px] shadow-2xl">
              <div className="space-y-3 z-10">
                <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">Tailor-Made Expeditions</span>
                <h3 className="text-3xl font-black text-white">Bespoke Travel Requests</h3>
                <p className="text-zinc-400 text-sm max-w-md font-light leading-relaxed">Have a specific budget or transport request? Submit custom requirements directly to business owner Dinesh Pandey.</p>
              </div>
              <div className="z-10 text-xs font-extrabold text-orange-500 flex items-center gap-1.5 pt-6">
                Submit Custom Request <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
