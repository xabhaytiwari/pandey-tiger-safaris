"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PARK_PROFILES } from "../../../lib/api";
import { triggerHaptic } from "../../../lib/sound";
import { MapPin, Compass, ShieldCheck, Clock, Phone, ArrowRight, Trees, Sparkles, MessageSquare } from "lucide-react";

export default function SingleParkPage() {
  const params = useParams();
  const slug = (params.slug as string) || "bandhavgarh";
  const park = PARK_PROFILES[slug] || PARK_PROFILES["bandhavgarh"];

  const whatsappInquiryUrl = `https://wa.me/919425331205?text=${encodeURIComponent(
    `Hello Dinesh Pandey Sir, I am inquiring about custom safari permits and tour arrangements for ${park.name}.`
  )}`;

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Hero Header with High-Res Photo */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <div className="relative h-[400px] md:h-[500px] w-full">
          <img src={park.hero_image} alt={park.name} className="w-full h-full object-cover filter blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

          <div className="absolute bottom-8 left-8 right-8 space-y-3 text-white z-20">
            <span className="text-xs uppercase font-extrabold text-black bg-orange-500 px-3.5 py-1 rounded-full tracking-wider">
              {park.district}, {park.state} • Established {park.established}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{park.name}</h1>
            <p className="text-orange-400 font-bold text-sm md:text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" /> {park.tiger_density}
            </p>
          </div>
        </div>
      </div>

      {/* Park Overview & Action Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" /> Wildlife Sanctuary Overview
            </span>
            <h2 className="text-3xl font-extrabold text-white">About {park.name}</h2>
            <p className="text-zinc-300 text-base leading-relaxed font-light">{park.overview}</p>
          </div>

          {/* Safari Gates & Zones */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Trees className="w-5 h-5 text-orange-500" /> Core Safari Gates & Zones
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {park.zones?.map((zone: any, i: number) => (
                <div key={i} className="bg-zinc-950 border border-white/10 p-5 rounded-2xl space-y-1 hover:border-orange-500/40 transition-all">
                  <h4 className="font-bold text-white text-sm text-orange-400">{zone.name}</h4>
                  <p className="text-zinc-300 text-xs font-light leading-relaxed">{zone.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Species */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xl font-bold text-white">Key Wildlife Species</h3>
            <div className="flex flex-wrap gap-2">
              {park.fauna?.map((animal: string, i: number) => (
                <span key={i} className="bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold px-3.5 py-1.5 rounded-full">
                  🐅 {animal}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Permit Booking & Custom Request Actions */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-orange-500/30 p-6 rounded-3xl space-y-6 shadow-2xl sticky top-24">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-orange-500 bg-orange-500/10 px-2.5 py-0.5 rounded-full">Official Permit Booking</span>
              <h3 className="text-xl font-bold text-white">Reserve {park.name}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Permits issued directly under MP Forest Department gate quota. Managed by business owner Dinesh Pandey.
              </p>
            </div>

            <div className="space-y-2.5 text-xs border-y border-white/10 py-4 text-zinc-300">
              <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-500" /> <strong>Season:</strong> {park.best_season}</p>
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /> <strong>Slots:</strong> Morning & Evening Safaris</p>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/booking?park=${encodeURIComponent(park.name)}`}
                onClick={() => triggerHaptic(15)}
                className="w-full bg-orange-500 hover:bg-orange-400 text-black font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs shadow-xl shadow-orange-500/20 active:scale-95"
              >
                <Compass className="w-4 h-4" /> Reserve {park.name} Permit &rarr;
              </Link>

              <Link
                href="/custom-package"
                onClick={() => triggerHaptic(12)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs border border-white/10 active:scale-95"
              >
                Request Custom {park.name} Package
              </Link>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic(12)}
                className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs border border-emerald-500/30 active:scale-95"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Inquiry (+91 9425331205)
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
