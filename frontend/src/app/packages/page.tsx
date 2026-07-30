"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchFromAPI } from "../../lib/api";
import { ArrowRight, Clock, Tag, MapPin, Star } from "lucide-react";

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [parks, setParks] = useState<any[]>([]);
  const [selectedPark, setSelectedPark] = useState<string>("All");

  useEffect(() => {
    async function loadData() {
      const [p, pk] = await Promise.all([
        fetchFromAPI("/packages"),
        fetchFromAPI("/parks"),
      ]);
      setPackages(p || []);
      setParks(pk || []);
    }
    loadData();
  }, []);

  const filteredPackages = selectedPark === "All"
    ? packages
    : packages.filter((pkg) => pkg.park_name === selectedPark);

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Wildlife Reserves</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Tour Packages</h1>
        <p className="text-zinc-400 text-base">Filter packages by National Park. Includes 4x4 safari permits, resort stays, and pickup transfers in INR (₹).</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 pt-2">
        <button
          onClick={() => setSelectedPark("All")}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
            selectedPark === "All"
              ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
              : "bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
          }`}
        >
          All Parks
        </button>

        {parks.map((park) => (
          <button
            key={park.id}
            onClick={() => setSelectedPark(park.name)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedPark === park.name
                ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                : "bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> {park.name}
          </button>
        ))}
      </div>

      {filteredPackages.length === 0 ? (
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <p className="text-zinc-400 text-sm">No standard packages published for this park yet.</p>
          <Link href="/custom-package" className="inline-flex items-center gap-2 bg-orange-500 text-black font-extrabold px-6 py-3 rounded-full text-xs">
            Request Custom Safari Itinerary &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md hover:border-orange-500/40 transition-all flex flex-col justify-between shadow-2xl">
              <div>
                <img src={pkg.image_url} alt={pkg.title} className="w-full h-64 object-cover" />
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {pkg.duration}
                    </span>
                    <span className="text-2xl font-extrabold text-orange-500 flex items-center gap-1">
                      <Tag className="w-4 h-4" /> ₹{pkg.price_inr?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500" /> {pkg.park_name || "Bandhavgarh National Park"}
                      </span>
                      <span className="text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        <Star className="w-3 h-3 fill-amber-400" /> {pkg.hotel_stars || "5-Star Resort"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white pt-1">{pkg.title}</h3>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed">{pkg.description}</p>
                  <div className="pt-2 border-t border-white/5 text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-300">Highlights:</span> {pkg.highlights}
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0">
                <Link href="/booking" className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-400 transition-all text-sm">
                  Reserve Package <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
