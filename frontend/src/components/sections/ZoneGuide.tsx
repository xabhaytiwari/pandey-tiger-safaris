"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Compass, ShieldCheck, Flame } from "lucide-react";
import Link from "next/link";
import { triggerHaptic } from "../../lib/sound";

export default function ZoneGuide() {
  const zones = [
    {
      id: "tala",
      name: "Tala Zone",
      tagline: "The Royal Core & Ancient Heritage",
      tigerProbability: 95,
      landscape: "Bamboo thickets, sal forests, hillocks, and ancient streams",
      monuments: "Shesh Shaiya (65ft Vishnu Statue) & Bandhavgarh Fort",
      recommendedVehicles: "Open 4x4 Maruti Gypsy / Innova Crysta Transfer",
      image_url: "https://bandhavgarhtigerreserve.org/storage/app/public/gallery/279646059399eaba1015ba0275a5690b507b65f2.jpg"
    },
    {
      id: "magdhi",
      name: "Magdhi Zone (Gate 2)",
      tagline: "Grasslands & Waterhole Territories",
      tigerProbability: 90,
      landscape: "Open savannah grasslands, waterbodies, and sal canopy",
      monuments: "Chargarh & Seera Waterhole Tracks",
      recommendedVehicles: "Open 4x4 Maruti Gypsy / Force Traveller",
      image_url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "khitauli",
      name: "Khitauli Zone (Gate 3)",
      tagline: "Rugged Hills & Birding Heaven",
      tigerProbability: 85,
      landscape: "Bamboo-covered hills, mixed deciduous forests, waterholes",
      monuments: "Kumbhi & Choti Dhamokhari Tracks",
      recommendedVehicles: "Open 4x4 Maruti Gypsy",
      image_url: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const [activeZone, setActiveZone] = useState(zones[0]);

  return (
    <section className="py-16 max-w-6xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold flex items-center justify-center gap-1.5">
          <Compass className="w-4 h-4 text-orange-500" /> Core Gate Explorer
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Bandhavgarh Safari Zones</h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto">Compare tiger sighting density, terrain types, and ancient monuments across Bandhavgarh's primary safari gates.</p>
      </div>

      {/* Zone Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => {
              triggerHaptic(10);
              setActiveZone(zone);
            }}
            className={`px-6 py-3 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-2 ${
              activeZone.id === zone.id
                ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                : "bg-zinc-950 border border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> {zone.name}
          </button>
        ))}
      </div>

      {/* Active Zone Card Details */}
      <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 grid md:grid-cols-2 gap-8 items-center shadow-2xl relative overflow-hidden">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-orange-400 font-extrabold uppercase">{activeZone.tagline}</span>
            <h3 className="text-3xl font-black text-white">{activeZone.name}</h3>
          </div>

          {/* Sighting Probability Meter */}
          <div className="space-y-1.5 bg-black/60 p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-zinc-300 flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" /> Tiger Sighting Probability</span>
              <span className="text-orange-400">{activeZone.tigerProbability}% Probability</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                key={activeZone.id}
                initial={{ width: "0%" }}
                animate={{ width: `${activeZone.tigerProbability}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
              />
            </div>
          </div>

          <div className="space-y-2 text-xs text-zinc-300">
            <p><strong>Terrain:</strong> {activeZone.landscape}</p>
            <p><strong>Monuments:</strong> {activeZone.monuments}</p>
            <p><strong>Recommended Transport:</strong> {activeZone.recommendedVehicles}</p>
          </div>

          <div className="pt-2">
            <Link
              href={`/booking?park=${encodeURIComponent("Bandhavgarh National Park")}`}
              onClick={() => triggerHaptic(12)}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-extrabold px-6 py-3.5 rounded-full text-xs transition-all shadow-xl shadow-orange-500/20 active:scale-95"
            >
              Book {activeZone.name} Safari Permits &rarr;
            </Link>
          </div>
        </div>

        <div className="relative h-80 rounded-2xl overflow-hidden border border-white/10">
          <img src={activeZone.image_url} alt={activeZone.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
