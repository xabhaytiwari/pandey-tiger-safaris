"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchFromAPI } from "../../lib/api";
import { Phone, MapPin, Award, Users, Sparkles, Pause, Play } from "lucide-react";

export default function AboutPage() {
  const [founder, setFounder] = useState<any>(null);

  const ownerPhotos = [
    {
      id: 1,
      title: "TTF Travel & Tourism Fair, Kolkata",
      image_url: "/gallery/owner-1.jpg",
      fallback_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
      caption: "Dinesh Pandey at TTF Entry representing Pandey Tiger Safaris."
    },
    {
      id: 2,
      title: "Madhya Pradesh Tourism Pavilion",
      image_url: "/gallery/owner-2.jpg",
      fallback_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
      caption: "Promoting Bandhavgarh & MP wildlife circuits at tourism expos."
    },
    {
      id: 3,
      title: "SATTE International Travel Exhibition",
      image_url: "/gallery/owner-3.jpg",
      fallback_url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
      caption: "Dinesh Pandey at SATTE Welcome Gate in Hall 9."
    },
    {
      id: 4,
      title: "Outdoors in Bandhavgarh Nature Circuit",
      image_url: "/gallery/owner-4.jpg",
      fallback_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
      caption: "On-field inspection of safari road routes and forest gates."
    }
  ];

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    fetchFromAPI("/founder").then((data) => setFounder(data));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev === ownerPhotos.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, ownerPhotos.length]);

  const activePhoto = ownerPhotos[currentPhotoIndex];

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-12 space-y-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-500" /> Business Owner & Tour Operator
          </span>
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

        {/* Autoplay Owner Photo Carousel with Top Alignment */}
        <div 
          className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black group"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="relative h-[500px] w-full">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activePhoto.id}
                src={activePhoto.image_url} 
                onError={(e: any) => {
                  e.target.src = activePhoto.fallback_url;
                }}
                alt={activePhoto.title} 
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover object-top" 
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-orange-400 hover:text-white transition-colors"
                title={isAutoPlaying ? "Pause Autoplay" : "Play Autoplay"}
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6 space-y-1 text-white z-20">
              <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/20 border border-orange-500/30 px-2.5 py-0.5 rounded-full">
                {activePhoto.title}
              </span>
              <p className="text-xs text-zinc-300 font-light">{activePhoto.caption}</p>
            </div>

            {isAutoPlaying && (
              <motion.div
                key={`owner-progress-${activePhoto.id}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.0, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-orange-500 z-30"
              />
            )}
          </div>

          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-30 pb-2">
            {ownerPhotos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPhotoIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentPhotoIndex === idx ? "w-6 bg-orange-500" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
