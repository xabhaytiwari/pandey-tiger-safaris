"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Compass, ChevronLeft, ChevronRight, Eye } from "lucide-react";
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

  const handlePrev = useCallback(() => {
    setActivePhotoIndex((prev) => (prev === null || prev === 0 ? filteredPhotos.length - 1 : prev - 1));
  }, [filteredPhotos.length]);

  const handleNext = useCallback(() => {
    setActivePhotoIndex((prev) => (prev === null || prev === filteredPhotos.length - 1 ? 0 : prev + 1));
  }, [filteredPhotos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "Escape") setActivePhotoIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, handlePrev, handleNext]);

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <section className="space-y-10 py-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-extrabold flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> Royal Bengal Predators
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Tigers & Heritage of MP</h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto font-light">Explore high-definition tiger sightings across MP reserves. Click any card to inspect or reserve permits.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {parks.map((park) => (
          <button
            key={park}
            type="button"
            onClick={() => {
              try { triggerHaptic(10); } catch {}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhotos.map((photo, idx) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => {
              setActivePhotoIndex(idx);
              try { triggerHaptic(12); } catch {}
            }}
            className="group relative bg-zinc-950 border border-white/10 hover:border-amber-500/60 rounded-3xl overflow-hidden shadow-2xl cursor-pointer text-left w-full focus:outline-none active:scale-[0.98] flex flex-col justify-end min-h-[380px] transition-transform hover:-translate-y-2"
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
                <MapPin className="w-3 h-3 text-amber-400" /> {photo.park}
              </span>
              <div className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4 text-amber-400" />
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
          </button>
        ))}
      </div>

      <Modal isOpen={activePhotoIndex !== null} onClose={() => setActivePhotoIndex(null)}>
        {activePhoto && (
          <div className="flex flex-col md:flex-row min-h-[420px]">
            <div className="relative md:w-3/5 h-[260px] sm:h-[320px] md:h-auto bg-black overflow-hidden flex-shrink-0 group">
              <img
                src={activePhoto.image_url}
                alt={activePhoto.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent md:hidden" />

              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="pointer-events-auto bg-black/80 hover:bg-black p-2.5 rounded-full text-white hover:text-amber-400 border border-white/15 transition-all active:scale-95 shadow-lg cursor-pointer"
                  title="Previous (← Arrow)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="pointer-events-auto bg-black/80 hover:bg-black p-2.5 rounded-full text-white hover:text-amber-400 border border-white/15 transition-all active:scale-95 shadow-lg cursor-pointer"
                  title="Next (→ Arrow)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 md:w-2/5 space-y-5 bg-zinc-950 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-extrabold text-black bg-amber-500 px-3 py-1 rounded-full tracking-wider">
                    {activePhoto.park} Sanctuary
                  </span>
                  <span className="text-xs font-mono text-zinc-500 font-bold">
                    {(activePhotoIndex ?? 0) + 1} / {filteredPhotos.length}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white leading-tight">
                  {activePhoto.title}
                </h3>

                <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
                  {activePhoto.caption}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {filteredPhotos.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex(idx);
                      }}
                      className={`relative w-14 h-11 rounded-xl overflow-hidden flex-shrink-0 border transition-all cursor-pointer ${
                        activePhotoIndex === idx ? "border-amber-500 ring-2 ring-amber-500 scale-105" : "border-white/10 opacity-40 hover:opacity-100"
                      }`}
                    >
                      <img src={p.image_url} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <Link
                  href={`/booking?park=${encodeURIComponent(
                    activePhoto.park.includes("National Park") 
                      ? activePhoto.park 
                      : `${activePhoto.park} National Park`
                  )}`}
                  onClick={() => setActivePhotoIndex(null)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-xl shadow-amber-500/20 active:scale-95 cursor-pointer"
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
