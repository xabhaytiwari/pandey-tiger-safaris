"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Maximize2, Compass, ChevronLeft, ChevronRight } from "lucide-react";
import { triggerHaptic } from "../../lib/sound";
import Modal from "./Modal";

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
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const filteredPhotos = selectedFilter === "All"
    ? tigerPhotos
    : tigerPhotos.filter(p => p.park === selectedFilter);

  const parks = ["All", "Bandhavgarh", "Kanha", "Pench", "Panna"];

  const handlePrevPhoto = () => {
    triggerHaptic(10);
    setActivePhotoIndex((prev) => (prev === null || prev === 0 ? filteredPhotos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    triggerHaptic(10);
    setActivePhotoIndex((prev) => (prev === null || prev === filteredPhotos.length - 1 ? 0 : prev + 1));
  };

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <section className="space-y-8 py-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-extrabold flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" /> Royal Bengal Predators
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Tigers & Heritage of MP</h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto font-light">Explore high-definition tiger sightings across MP reserves. Click any photo to book a safari for that park.</p>
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, idx) => (
          <motion.button
            key={photo.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-zinc-950 border border-white/10 hover:border-orange-500/60 rounded-3xl overflow-hidden shadow-2xl cursor-pointer text-left w-full focus:outline-none active:scale-[0.98]"
            onClick={() => {
              triggerHaptic(12);
              setActivePhotoIndex(idx);
            }}
          >
            <div className="relative h-72 w-full overflow-hidden">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
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
          </motion.button>
        ))}
      </div>

      {/* Navigable & Scrollable Lightbox Modal */}
      <Modal isOpen={activePhotoIndex !== null} onClose={() => setActivePhotoIndex(null)}>
        {activePhoto && (
          <div>
            <div className="relative h-56 sm:h-64 md:h-72 w-full bg-black overflow-hidden flex-shrink-0 group">
              <img
                src={activePhoto.image_url}
                alt={activePhoto.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />

              {/* Prev / Next Navigation Arrows */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center z-30 pointer-events-none">
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="pointer-events-auto bg-black/70 hover:bg-black p-2 rounded-full text-white hover:text-orange-400 border border-white/10 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="pointer-events-auto bg-black/70 hover:bg-black p-2 rounded-full text-white hover:text-orange-400 border border-white/10 transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-3.5 bg-zinc-950 text-white">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold text-black bg-orange-500 px-2.5 py-0.5 rounded-full tracking-wider">
                  {activePhoto.park} Sanctuary
                </span>
                <span className="text-[10px] font-mono text-zinc-400 font-bold">
                  {activePhotoIndex! + 1} of {filteredPhotos.length}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
                {activePhoto.title}
              </h3>

              <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
                {activePhoto.caption}
              </p>

              {/* Scrollable Thumbnail Strip inside Modal */}
              <div className="flex gap-2 overflow-x-auto py-2 scrollbar-none border-t border-white/10 pt-3">
                {filteredPhotos.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(10);
                      setActivePhotoIndex(idx);
                    }}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 border transition-all ${
                      activePhotoIndex === idx ? "border-orange-500 ring-2 ring-orange-500 scale-105" : "border-white/10 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={p.image_url} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <Link
                  href={`/booking?park=${encodeURIComponent(
                    activePhoto.park.includes("National Park") 
                      ? activePhoto.park 
                      : `${activePhoto.park} National Park`
                  )}`}
                  onClick={() => {
                    triggerHaptic(15);
                    setActivePhotoIndex(null);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-extrabold px-6 py-3.5 rounded-full text-xs transition-all shadow-xl shadow-orange-500/25 active:scale-95 cursor-pointer"
                >
                  <Compass className="w-4 h-4" /> Book {activePhoto.park} Safari Now &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
