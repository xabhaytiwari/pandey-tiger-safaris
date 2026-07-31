"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, MapPin, ArrowRight } from "lucide-react";
import { triggerHaptic } from "../../lib/sound";

export default function TigerGallery() {
  const tigerPhotos = [
    {
      id: 1,
      title: "Royal Bengal Tiger (Tala Zone)",
      park: "Bandhavgarh",
      slug: "bandhavgarh",
      image_url: "https://bandhavgarhtigerreserve.org/storage/app/public/gallery/279646059399eaba1015ba0275a5690b507b65f2.jpg",
      caption: "Dominant Royal Bengal tiger patrolling the core bamboo tracks of Bandhavgarh National Park."
    },
    {
      id: 2,
      title: "Bandhavgarh Apex Predator",
      park: "Bandhavgarh",
      slug: "bandhavgarh",
      image_url: "https://bandhavgarhtigerreserve.org/storage/app/public/gallery/4b18dd77fedec8fa7534763a1d447f30e8e2cdf9.jpg",
      caption: "Tiger crossing forest tracks during early morning safari in Bandhavgarh Tiger Reserve."
    },
    {
      id: 3,
      title: "Bandhavgarh Forest Monarch",
      park: "Bandhavgarh",
      slug: "bandhavgarh",
      image_url: "https://bandhavgarhtigerreserve.org/storage/app/public/gallery/fd12f9eb116e2dab9e5dcdc0dac018e9af8ef83d.jpg",
      caption: "Majestic Bengal tiger resting under teak canopy shade."
    },
    {
      id: 4,
      title: "Kanha Meadow Predator",
      park: "Kanha",
      slug: "kanha",
      image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrZoWc_WzK25PAeBO-8XQb3gf8AgEfVEnridQ2osZ7Eci7pYCYmDrE3yes&s=10",
      caption: "Morning mist tracking across sal forests and open meadows in Kanha National Park."
    },
    {
      id: 5,
      title: "Pench Tiger Safari Trail",
      park: "Pench",
      slug: "pench",
      image_url: "https://indiantigersafaris.com/wp-content/uploads/2025/10/Pench-Tiger-Safari-Tour-Package.webp",
      caption: "Royal Bengal tiger sighting in the teak forests of Pench National Park."
    },
    {
      id: 6,
      title: "Panna Tiger Sanctuary",
      park: "Panna",
      slug: "panna",
      image_url: "https://images.pexels.com/photos/21896819/pexels-photo-21896819.jpeg",
      caption: "Tigress camouflaged in teak canopy forests along the Ken River."
    },
    {
      id: 7,
      title: "Tala Shesh Shaiya Vishnu Idol",
      park: "Bandhavgarh",
      slug: "bandhavgarh",
      image_url: "https://chalbanjare.com/crmnew/img_master/package/SheshShaiyaVishnuIdol_17719322670.webp",
      caption: "Ancient 65-foot carved Vishnu idol lying on Sheshnag inside Bandhavgarh Tala Zone."
    }
  ];

  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredPhotos = selectedFilter === "All"
    ? tigerPhotos
    : tigerPhotos.filter(p => p.park === selectedFilter);

  const parks = ["All", "Bandhavgarh", "Kanha", "Pench", "Panna"];

  return (
    <section className="space-y-10 py-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-extrabold flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> Royal Bengal Predators
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Tigers & Heritage of MP</h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto font-light">Explore high-definition tiger sightings across MP reserves. Click any card to explore that National Park.</p>
      </div>

      {/* Park Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {parks.map((park) => (
          <button
            key={park}
            type="button"
            onClick={() => {
              triggerHaptic(10);
              setSelectedFilter(park);
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
              selectedFilter === park
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "bg-zinc-950 border border-white/10 text-zinc-400 hover:text-white hover:border-amber-500/40"
            }`}
          >
            {park}
          </button>
        ))}
      </div>

      {/* Direct Park Link Cards (Clicking opens /parks/[slug]) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/parks/${photo.slug}`}
              onClick={() => triggerHaptic(12)}
              className="group relative bg-zinc-950 border border-white/10 hover:border-amber-500/60 rounded-3xl overflow-hidden shadow-2xl cursor-pointer text-left w-full focus:outline-none active:scale-[0.98] gpu-layer flex flex-col justify-end min-h-[380px] block"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              </div>

              <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" /> {photo.park} Sanctuary
                </span>
                <div className="p-2 rounded-full bg-orange-500 text-black font-extrabold text-[10px] flex items-center gap-1 shadow-lg">
                  Explore Park <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="relative z-10 p-6 space-y-2 pointer-events-none">
                <h3 className="font-extrabold text-xl text-white group-hover:text-amber-400 transition-colors leading-snug">
                  {photo.title}
                </h3>
                <p className="text-xs text-zinc-300 font-light line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
