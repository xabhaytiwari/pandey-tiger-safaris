"use client";

import Link from "next/link";
import { PARK_PROFILES } from "../../lib/api";
import { MapPin, ArrowRight, ShieldCheck, Compass } from "lucide-react";

export default function ParksDirectoryPage() {
  const parkList = Object.values(PARK_PROFILES);

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Madhya Pradesh Tiger Circuit</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">National Parks & Reserves</h1>
        <p className="text-zinc-400 text-base">Explore deep wildlife profiles, safari gates, and tiger tracking density across MP&apos;s premier tiger reserves.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {parkList.map((park: any) => (
          <div key={park.slug} className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md hover:border-orange-500/40 transition-all flex flex-col justify-between shadow-2xl group border-t-white/20">
            <div>
              <div className="relative overflow-hidden h-56 w-full">
                <img 
                  src={park.hero_image} 
                  alt={park.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <span className="absolute top-4 left-4 bg-orange-500 text-black font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">
                  {park.district}, MP
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-2xl font-bold text-white">{park.name}</h3>
                <p className="text-orange-400 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {park.tiger_density}
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed font-light line-clamp-3">{park.overview}</p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link 
                href={`/parks/${park.slug}`} 
                className="w-full bg-white/10 hover:bg-orange-500 hover:text-black text-white font-extrabold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs active:scale-[0.98]"
              >
                Explore Park & Permits <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
