"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchFromAPI } from "../../lib/api";
import { Users, ArrowRight } from "lucide-react";

export default function FleetPage() {
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    fetchFromAPI("/cars").then((data) => setCars(data || []));
  }, []);

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-12">
      <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Transport Fleet</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Vehicles & Custom Transfers</h1>
        <p className="text-zinc-400 text-base">Innova Crysta, Force Traveller, Swift Dzire, Open 4x4 Gypsies, and bespoke personal vehicle arrangements.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div key={car.id} className="bg-zinc-950 border border-white/10 rounded-3xl p-6 backdrop-blur-md hover:border-orange-500/40 transition-all flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <img src={car.image_url} alt={car.name} className="w-full h-48 object-cover rounded-2xl" />
              <div>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">{car.category}</span>
                <h3 className="text-2xl font-bold text-white">{car.name}</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">{car.description}</p>
              {car.capacity > 0 && (
                <div className="text-xs text-zinc-500 flex items-center gap-1.5 pt-2 border-t border-white/5">
                  <Users className="w-3.5 h-3.5 text-orange-500" /> Capacity: {car.capacity} Passengers
                </div>
              )}
            </div>

            <div className="pt-6">
              <Link href="/booking" className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-3 rounded-2xl flex items-center justify-center gap-2 text-xs transition-all">
                Select for Safari <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
