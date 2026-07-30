"use client";

import SightingMap from "../../components/map/SightingMap";

export default function SightingsPage() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-extrabold">Real-Time Heatmap</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">Live Tiger Sightings Map</h1>
        <p className="text-zinc-400 text-sm">Interactive GPS map of Madhya Pradesh's national parks. Click anywhere on the map to mark your tiger sighting and help fellow safari guests track sightings!</p>
      </div>

      <SightingMap />
    </main>
  );
}
