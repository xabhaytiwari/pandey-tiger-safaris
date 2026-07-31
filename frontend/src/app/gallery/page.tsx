"use client";

import TigerGallery from "../../components/ui/TigerGallery";

export default function GalleryPage() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-extrabold">Royal Bengal Portfolio</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">Tiger Gallery & Heritage</h1>
        <p className="text-zinc-400 text-sm">High-definition wildlife photography captured across Bandhavgarh, Kanha, Pench, and Panna national parks.</p>
      </div>

      <TigerGallery />
    </main>
  );
}
