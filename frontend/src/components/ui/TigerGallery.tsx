"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Maximize2, X } from "lucide-react";

export default function TigerGallery() {
  const tigerPhotos = [
    {
      id: 1,
      title: "Royal Bengal Tiger in Tala Zone",
      park: "Bandhavgarh",
      image_url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=1200",
      caption: "Dominant male tiger patrolling bamboo thickets in Bandhavgarh Tala Gate."
    },
    {
      id: 2,
      title: "Kanha Meadow Apex Predator",
      park: "Kanha",
      image_url: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&q=80&w=1200",
      caption: "Morning mist tracking across sal forests and open meadows in Kanha National Park."
    },
    {
      id: 3,
      title: "Pench Jungle Stream Stalker",
      park: "Pench",
      image_url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1200",
      caption: "Bengal tiger cooling off along dry riverbed rocks in Pench Tiger Reserve."
    },
    {
      id: 4,
      title: "Panna Tiger Sanctuary",
      park: "Panna",
      image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200",
      caption: "Tigress camouflaged in teak canopy forests along the Ken River."
    },
    {
      id: 5,
      title: "Satpura Mystic Forest Tiger",
      park: "Satpura",
      image_url: "https://images.unsplash.com/photo-1500463959177-e0869687df26?auto=format&fit=crop&q=80&w=1200",
      caption: "Sighting along Satpura's rugged sandstone hills and Denwa river banks."
    },
    {
      id: 6,
      title: "Tala Gate Waterhole Sighting",
      park: "Bandhavgarh",
      image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
      caption: "Intense gaze of a Royal Bengal tiger resting in summer waterholes."
    }
  ];

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeLightBox, setActiveLightBox] = useState<any>(null);

  const filteredPhotos = selectedFilter === "All"
    ? tigerPhotos
    : tigerPhotos.filter(p => p.park === selectedFilter);

  const parks = ["All", "Bandhavgarh", "Kanha", "Pench", "Panna", "Satpura"];

  return (
    <section className="space-y-8 py-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Royal Bengal Predators
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">Tigers of Madhya Pradesh</h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto">Explore high-definition tiger sightings captured across Bandhavgarh, Kanha, Pench, Panna, and Satpura reserves.</p>
      </div>

      {/* Park Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {parks.map(park => (
          <button
            key={park}
            onClick={() => setSelectedFilter(park)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              selectedFilter === park
                ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                : "bg-zinc-950 border border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            {park}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="group relative bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
            onClick={() => setActiveLightBox(photo)}
          >
            <div className="relative h-72 w-full overflow-hidden">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>

            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4 text-orange-400" />
            </div>

            <div className="absolute bottom-5 left-5 right-5 space-y-1 text-white">
              <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/20 border border-orange-500/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {photo.park} Reserve
              </span>
              <h4 className="font-bold text-lg text-white">{photo.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightBox && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative max-w-4xl w-full bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <button onClick={() => setActiveLightBox(null)} className="absolute top-4 right-4 z-20 bg-black/80 p-2.5 rounded-full text-white hover:text-orange-400 border border-white/10">
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-[450px] md:h-[550px] w-full">
                <img src={activeLightBox.image_url} alt={activeLightBox.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
                  <span className="text-xs font-bold text-black bg-orange-500 px-3 py-1 rounded-full uppercase tracking-wider">
                    {activeLightBox.park} Tiger Reserve
                  </span>
                  <h3 className="text-3xl font-extrabold text-white">{activeLightBox.title}</h3>
                  <p className="text-sm text-zinc-300 max-w-xl">{activeLightBox.caption}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
