"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PARK_PROFILES } from "../../../lib/api";
import { MapPin, Compass, ShieldCheck, Clock, Phone, ArrowRight, Trees, Calendar } from "lucide-react";

export default function SingleParkPage() {
  const params = useParams();
  const slug = (params.slug as string) || "bandhavgarh";
  const park = PARK_PROFILES[slug] || PARK_PROFILES["bandhavgarh"];

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <div className="relative h-[380px] md:h-[480px] w-full">
          <img src={park.hero_image} alt={park.name} className="w-full h-full object-cover filter blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

          <div className="absolute bottom-8 left-8 right-8 space-y-3 text-white">
            <span className="text-xs uppercase font-extrabold text-black bg-orange-500 px-3.5 py-1 rounded-full tracking-wider">
              {park.district}, {park.state} • Est. {park.established}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{park.name}</h1>
            <p className="text-orange-400 font-bold text-sm md:text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" /> {park.tiger_density}
            </p>
          </div>
        </div>
      </div>

      {/* Overview & Booking Action */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Reserve Overview</span>
            <h2 className="text-3xl font-bold text-white">About {park.name}</h2>
            <p className="text-zinc-300 text-base leading-relaxed font-light">{park.overview}</p>
          </div>

          {/* Zones */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Trees className="w-5 h-5 text-orange-500" /> Core Safari Gates & Zones
            </h3>
            <div className="space-y-3">
              {park.zones?.map((zone: any, i: number) => (
                <div key={i} className="bg-zinc-950 border border-white/10 p-4 rounded-2xl space-y-1">
                  <h4 className="font-bold text-white text-sm">{zone.name}</h4>
                  <p className="text-zinc-400 text-xs font-light">{zone.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fauna */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xl font-bold text-white">Key Wildlife Species</h3>
            <div className="flex flex-wrap gap-2">
              {park.fauna?.map((animal: string, i: number) => (
                <span key={i} className="bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold px-3 py-1 rounded-full">
                  🐅 {animal}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Permit Booking Box */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-orange-500/30 p-6 rounded-3xl space-y-6 shadow-2xl">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-orange-500 bg-orange-500/10 px-2.5 py-0.5 rounded-full">Official Permit Booking</span>
              <h3 className="text-xl font-bold text-white">Book {park.name} Safari</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Permits issued directly under MP Forest Department gate quota. Managed by business owner Dinesh Pandey.
              </p>
            </div>

            <div className="space-y-2 text-xs border-y border-white/10 py-4 text-zinc-300">
              <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-500" /> <strong>Season:</strong> {park.best_season}</p>
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /> <strong>Slots:</strong> Morning & Evening Safaris</p>
            </div>

            <Link
              href={`/booking?park=${encodeURIComponent(park.name)}`}
              className="w-full bg-orange-500 hover:bg-orange-400 text-black font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs shadow-xl shadow-orange-500/20 active:scale-95"
            >
              <Compass className="w-4 h-4" /> Reserve {park.name} Permit &rarr;
            </Link>

            <a
              href="tel:9425331205"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs border border-white/10"
            >
              <Phone className="w-4 h-4 text-orange-500" /> Call Dinesh Pandey: 9425331205
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
