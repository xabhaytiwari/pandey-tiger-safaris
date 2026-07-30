"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Pause, Play } from "lucide-react";

export default function GallerySlideshow() {
  const slides = [
    {
      id: 1,
      title: "Dinesh Pandey at TTF Travel & Tourism Fair",
      category: "Industry Events",
      image_url: "/gallery/owner-1.jpg",
      fallback_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
      caption: "Business owner Dinesh Pandey representing Pandey Tiger Safaris at TTF Kolkata Entry."
    },
    {
      id: 2,
      title: "Full Vehicle Fleet Lined Up with Drivers",
      category: "Real Fleet Showcase",
      image_url: "/gallery/fleet-1.jpg",
      fallback_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200",
      caption: "Our Toyota Innovas, Force Travellers, and AC Sedans lined up with uniformed drivers."
    },
    {
      id: 3,
      title: "Dinesh Pandey at Madhya Pradesh Tourism Stall",
      category: "Tourism Expos",
      image_url: "/gallery/owner-2.jpg",
      fallback_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
      caption: "Promoting Bandhavgarh National Park tiger safari circuits at MP Tourism expo."
    },
    {
      id: 4,
      title: "Fleet Preparation & Maintenance",
      category: "Real Fleet Showcase",
      image_url: "/gallery/fleet-2.jpg",
      fallback_url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1200",
      caption: "Complete transport lineup prepared for railway station and airport guest transfers."
    },
    {
      id: 5,
      title: "SATTE International Travel Exhibition",
      category: "National Travel Show",
      image_url: "/gallery/owner-3.jpg",
      fallback_url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200",
      caption: "Dinesh Pandey at SATTE Welcome Gate in Hall 9."
    },
    {
      id: 6,
      title: "Pandey Tiger Safaris Fleet Lined Up at Station Grounds",
      category: "Real Fleet Showcase",
      image_url: "/gallery/fleet-3.jpg",
      fallback_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
      caption: "Our team of experienced drivers and immaculate vehicles ready for departure."
    },
    {
      id: 7,
      title: "Outdoors in Madhya Pradesh Nature Circuit",
      category: "Safari Grounds",
      image_url: "/gallery/owner-4.jpg",
      fallback_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200",
      caption: "Dinesh Pandey on location during jungle road inspections."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Autoplay Timer Effect (3.5 Seconds Interval)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const current = slides[currentIndex];

  return (
    <div 
      className="bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl overflow-hidden relative"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" /> Autoplay Photo Showcase
          </span>
          <h3 className="text-2xl font-black text-white mt-1">Owner & Fleet Showcase</h3>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="p-2.5 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-orange-400 transition-colors"
            title={isPlaying ? "Pause Autoplay" : "Play Autoplay"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={prevSlide} className="p-2.5 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono text-zinc-400 font-bold px-2">
            {currentIndex + 1} / {slides.length}
          </span>
          <button onClick={nextSlide} className="p-2.5 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Autoplay Slide */}
      <div className="relative h-[380px] md:h-[480px] w-full rounded-2xl overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id}
            src={current.image_url}
            onError={(e: any) => {
              e.target.src = current.fallback_url;
            }}
            alt={current.title}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 space-y-1.5 text-white">
          <span className="text-[10px] uppercase tracking-widest font-extrabold bg-orange-500 text-black px-2.5 py-1 rounded-full inline-block">
            {current.category}
          </span>
          <h4 className="text-2xl font-bold text-white">{current.title}</h4>
          <p className="text-xs text-zinc-300 font-light max-w-2xl">{current.caption}</p>
        </div>

        {/* Autoplay Progress Bar */}
        {isPlaying && (
          <motion.div
            key={`progress-${currentIndex}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.5, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-orange-500 z-30"
          />
        )}
      </div>

      {/* Thumbnails Navigation Bar */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2 pt-2">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`relative h-16 rounded-xl overflow-hidden border transition-all ${
              currentIndex === idx ? "border-orange-500 ring-2 ring-orange-500 scale-105" : "border-white/10 opacity-50 hover:opacity-100"
            }`}
          >
            <img
              src={slide.image_url}
              onError={(e: any) => {
                e.target.src = slide.fallback_url;
              }}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
