"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchFromAPI } from "../../lib/api";
import { ArrowRight, Clock, Tag } from "lucide-react";

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    fetchFromAPI("/packages").then((data) => setPackages(data || []));
  }, []);

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-12">
      <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Bandhavgarh Itineraries</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Tour Packages</h1>
        <p className="text-zinc-400 text-base">Complete safari permits, 4x4 open jeeps, luxury resort stays, and pickup transfers priced transparently in INR (₹).</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-zinc-900/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <img src={pkg.image_url} alt={pkg.title} className="w-full h-64 object-cover" />
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {pkg.duration}
                  </span>
                  <span className="text-2xl font-extrabold text-amber-400 flex items-center gap-1">
                    <Tag className="w-4 h-4" /> ₹{pkg.price_inr?.toLocaleString("en-IN")}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">{pkg.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{pkg.description}</p>
                <div className="pt-2 border-t border-white/5 text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-300">Highlights:</span> {pkg.highlights}
                </div>
              </div>
            </div>

            <div className="p-8 pt-0">
              <Link href="/booking" className="w-full bg-white text-black font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all text-sm">
                Reserve Package <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
