"use client";

import { useState, useEffect } from "react";
import { fetchFromAPI } from "../../lib/api";
import { Phone, MapPin, Award, Users } from "lucide-react";

export default function AboutPage() {
  const [founder, setFounder] = useState<any>(null);

  useEffect(() => {
    fetchFromAPI("/founder").then((data) => setFounder(data));
  }, []);

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-12 space-y-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Business Owner & Tour Operator</span>
          <h1 className="text-5xl font-extrabold tracking-tight">{founder?.name || "Dinesh Pandey"}</h1>
          <p className="text-orange-500 font-semibold text-lg flex items-center gap-2">
            <Phone className="w-5 h-5" /> Direct Mobile: +91 9425331205
          </p>
          <p className="text-zinc-300 text-base leading-relaxed font-light">
            Dinesh Pandey (+91 9425331205) is the proud business owner of Pandey Tiger Safaris in Bandhavgarh. Dinesh specializes in complete tour and travel management—providing customized safari packages, luxury vehicle fleets (Innova Crysta, Force Traveller, Swift Dzire), and assembling an army of Bandhavgarh&apos;s most experienced licensed forest guides and tiger trackers.
          </p>
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-orange-500" /> Army of Licensed Guides</div>
            <div className="flex items-center gap-2"><Award className="w-4 h-4 text-orange-500" /> End-to-End Tour Operator</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500" /> Tala Gate, Bandhavgarh HQ</div>
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
