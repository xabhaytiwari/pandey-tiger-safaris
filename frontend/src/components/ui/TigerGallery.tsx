"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Maximize2, X, Compass } from "lucide-react";
import { triggerHaptic } from "../../lib/sound";

export default function TigerGallery() {
  const tigerPhotos = [
    {
      id: 1,
      title: "Royal Bengal Tiger (Tala Zone)",
      park: "Bandhavgarh",
      image_url: "https://bandhavgarhtigerreserve.org/storage/app/public/gallery/279646059399eaba1015ba0275a5690b507b65f2.jpg",
      caption: "Dominant Royal Bengal tiger patrolling the core bamboo tracks of Bandhavgarh National Park."
    },
    {
      id: 2,
      title: "Bandhavgarh Apex Predator",
      park: "Bandhavgarh",
      image_url: "https://bandhavgarhtigerreserve.org/storage/app/public/gallery/4b18dd77fedec8fa7534763a1d447f30e8e2cdf9.jpg",
      caption: "Tiger crossing forest tracks during early morning safari in Bandhavgarh Tiger Reserve."
    },
    {
      id: 3,
      title: "Bandhavgarh Forest Monarch",
      park: "Bandhavgarh",
      image_url: "https://bandhavgarhtigerreserve.org/storage/app/public/gallery/fd12f9eb116e2dab9e5dcdc0dac018e9af8ef83d.jpg",
      caption: "Majestic Bengal tiger resting under teak canopy shade."
    },
    {
      id: 4,
      title: "Kanha Meadow Predator",
      park: "Kanha",
      image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrZoWc_WzK25PAeBO-8XQb3gf8AgEfVEnridQ2osZ7Eci7pYCYmDrE3yes&s=10",
      caption: "Morning mist tracking across sal forests and open meadows in Kanha National Park."
    },
    {
      id: 5,
      title: "Pench Tiger Safari Trail",
      park: "Pench",
      image_url: "https://indiantigersafaris.com/wp-content/uploads/2025/10/Pench-Tiger-Safari-Tour-Package.webp",
      caption: "Royal Bengal tiger sighting in the teak forests of Pench National Park."
    },
    {
      id: 6,
      title: "Panna Tiger Sanctuary",
      park: "Panna",
      image_url: "https://images.pexels.com/photos/21896819/pexels-photo-21896819.jpeg",
      caption: "Tigress camouflaged in teak canopy forests along the Ken River."
    },
    {
      id: 7,
      title: "Tala Shesh Shaiya Vishnu Idol",
      park: "Bandhavgarh",
      image_url: "https://chalbanjare.com/crmnew/img_master/package/SheshShaiyaVishnuIdol_17719322670.webp",
      caption: "Ancient 65-foot carved Vishnu idol lying on Sheshnag inside Bandhavgarh Tala Zone."
    }
  ];

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeLightBox, setActiveLightBox] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (activeLightBox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeLightBox]);

  const filteredPhotos = selectedFilter === "All"
    ? tigerPhotos
    : tigerPhotos.filter(p => p.park === selectedFilter);

  const parks = ["All", "Bandhavgarh", "Kanha", "Pench", "Panna"];

  return (
    <section className="space-y-8 py-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-extrabold flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" /> Royal Bengal Predators
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Tigers & Heritage of MP</h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto font-light">Explore high-definition tiger sightings across MP reserves. Click any photo to book a safari for that park.</p>
      </div>

      {/* Park Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {parks.map(park => (
          <button
            key={park}
            onClick={() => {
              triggerHaptic(10);
              setSelectedFilter(park);
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
              selectedFilter === park
                ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                : "bg-zinc-950 border border-white/10 text-zinc-400 hover:text-white hover:border-orange-500/40"
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
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-zinc-950 border border-white/10 hover:border-orange-500/60 rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
            onClick={() => {
              triggerHaptic(12);
              setActiveLightBox(photo);
            }}
          >
            <div className="relative h-72 w-full overflow-hidden">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>

            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4 text-orange-400" />
            </div>

            <div className="absolute bottom-5 left-5 right-5 space-y-1 text-white">
              <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/20 border border-orange-500/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {photo.park}
              </span>
              <h4 className="font-bold text-lg text-white">{photo.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* React Portal Lightbox: Renders directly into document.body to break free from parent CSS transforms */}
      {mounted && activeLightBox && createPortal(
        <AnimatePresence mode="wait">
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.92 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.92 }} 
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative max-w-2xl w-full max-h-[85vh] bg-zinc-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  triggerHaptic(10);
                  setActiveLightBox(null);
                }} 
                className="absolute top-3 right-3 z-30 bg-black/80 hover:bg-black p-2 rounded-full text-white hover:text-orange-400 border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Compact Image */}
              <div className="relative h-[220px] sm:h-[280px] md:h-[320px] w-full bg-black overflow-hidden flex-shrink-0">
                <img 
                  src={activeLightBox.image_url} 
                  alt={activeLightBox.title} 
                  className="w-full h-full object-cover object-center" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
              </div>

              {/* Content Box */}
              <div className="p-5 md:p-6 space-y-3 bg-zinc-950 text-white z-20">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-[10px] uppercase font-extrabold text-black bg-orange-500 px-2.5 py-0.5 rounded-full tracking-wider">
                    {activeLightBox.park} Sanctuary
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 font-medium">MP Wildlife Circuit</span>
                </div>

                <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  {activeLightBox.title}
                </h3>
                
                <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
                  {activeLightBox.caption}
                </p>

                <div className="pt-2">
                  <Link
                    href={`/booking?park=${encodeURIComponent(
                      activeLightBox.park.includes("National Park") 
                        ? activeLightBox.park 
                        : `${activeLightBox.park} National Park`
                    )}`}
                    onClick={() => {
                      triggerHaptic(15);
                      setActiveLightBox(null);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-extrabold px-6 py-3.5 rounded-full text-xs transition-all shadow-xl shadow-orange-500/25 active:scale-95 cursor-pointer"
                  >
                    <Compass className="w-4 h-4" /> Book {activeLightBox.park} Safari Now &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
