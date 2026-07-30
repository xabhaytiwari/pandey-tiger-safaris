"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { fetchFromAPI } from "../../lib/api";
import { Phone, MapPin, Award, Shield } from "lucide-react";

export default function AboutPage() {
  const [founder, setFounder] = useState<any>(null);

  useEffect(() => {
    fetchFromAPI("/founder").then((data) => setFounder(data));
  }, []);

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-12 space-y-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Founder & Master Guide</span>
          <h1 className="text-5xl font-extrabold tracking-tight">{founder?.name || "Dinesh Pandey"}</h1>
          <p className="text-amber-400 font-semibold text-lg flex items-center gap-2">
            <Phone className="w-5 h-5" /> Direct Mobile: +91 9425331205
          </p>
          <p className="text-zinc-300 text-base leading-relaxed font-light">
            With over 20 years of experience traversing the dense teak and bamboo forests of Bandhavgarh, Dinesh Pandey (+91 9425331205) is renowned for royal Bengal tiger tracking, luxury vehicle transfers (Innova Crysta, Force Traveller, Swift Dzire), and bespoke safari arrangements.
          </p>
          <div className="pt-4 border-t border-white/10 flex items-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> 20+ Years Experience</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> Tala Gate, Bandhavgarh HQ</div>
          </div>
        </div>

        <div className="relative">
          <img 
            src="/dinesh-pandey.jpg" 
            onError={(e: any) => {
              e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";
            }}
            alt="Dinesh Pandey" 
            className="w-full h-[450px] object-cover rounded-3xl border border-white/10 shadow-2xl" 
          />
        </div>
      </div>
    </main>
  );
}
