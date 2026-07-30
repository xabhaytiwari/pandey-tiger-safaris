"use client";

import { useState, useEffect, useRef } from "react";
import { db, auth, onAuthStateChanged } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, PlusCircle, Compass, X, Lock, LogIn, CheckCircle2, Flame } from "lucide-react";
import { triggerHaptic } from "../../lib/sound";
import AuthModal from "../auth/AuthModal";

declare global {
  interface Window {
    L?: any;
  }
}

const PARK_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  "Bandhavgarh National Park": { lat: 23.7024, lng: 81.0253, zoom: 12 },
  "Kanha National Park": { lat: 22.3345, lng: 80.6115, zoom: 11 },
  "Pench National Park": { lat: 21.6582, lng: 79.3006, zoom: 11 },
  "Panna National Park": { lat: 24.6300, lng: 80.0000, zoom: 11 },
  "Satpura National Park": { lat: 22.4833, lng: 78.4333, zoom: 11 },
};

export default function SightingMap() {
  const [selectedPark, setSelectedPark] = useState("Bandhavgarh National Park");
  const [sightings, setSightings] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Sighting Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [sightingForm, setFormData] = useState({
    description: "Royal Bengal Tiger spotted crossing forest track",
    zone_name: "Tala Zone Core",
    safari_slot: "Morning Safari",
  });
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  // Sync Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Real-Time Sync with Cloud Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "sightings"), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSightings(docs);
    });
    return () => unsub();
  }, []);

  // Load Leaflet JS & CSS dynamically
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else if (window.L && !mapInstanceRef.current) {
      initMap();
    }
  }, []);

  // Initialize OpenStreetMap
  const initMap = () => {
    if (!window.L || mapInstanceRef.current) return;

    const initialCoords = PARK_COORDINATES[selectedPark] || PARK_COORDINATES["Bandhavgarh National Park"];

    const map = window.L.map("tiger-sightings-map", {
      center: [initialCoords.lat, initialCoords.lng],
      zoom: initialCoords.zoom,
      zoomControl: true,
    });

    // Dark OpenStreetMap Tiles
    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    markersGroupRef.current = window.L.layerGroup().addTo(map);

    // Click map to report sighting
    map.on("click", (e: any) => {
      triggerHaptic(12);
      setSelectedLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
      setIsModalOpen(true);
    });

    mapInstanceRef.current = map;
  };

  // Fly to park when selection changes
  useEffect(() => {
    if (mapInstanceRef.current && PARK_COORDINATES[selectedPark]) {
      const coords = PARK_COORDINATES[selectedPark];
      mapInstanceRef.current.flyTo([coords.lat, coords.lng], coords.zoom, { duration: 1.5 });
    }
  }, [selectedPark]);

  // Update Heatmap Circles & Markers when sightings update
  useEffect(() => {
    if (!window.L || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    const parkSightings = sightings.filter(
      (s) => !s.park_name || s.park_name === selectedPark
    );

    parkSightings.forEach((s) => {
      if (s.lat && s.lng) {
        // Glowing Orange Heatmap Circle
        window.L.circle([s.lat, s.lng], {
          color: "#ff7a00",
          fillColor: "#ff7a00",
          fillOpacity: 0.35,
          radius: 800,
        }).addTo(markersGroupRef.current);

        // Marker Popup
        const popupContent = `
          <div style="font-family: Arial, sans-serif; padding: 6px; color: #000;">
            <strong style="color: #ea580c; font-size: 13px;">🐅 Tiger Sighting</strong><br/>
            <span style="font-size: 11px; font-weight: bold;">${s.description || "Royal Bengal Tiger Spotted"}</span><br/>
            <span style="font-size: 10px; color: #666;">Zone: ${s.zone_name || "Core Zone"} (${s.safari_slot || "Morning"})</span><br/>
            <span style="font-size: 9px; color: #888;">Reported by: ${s.user_name || "Safari Guest"}</span>
          </div>
        `;

        window.L.marker([s.lat, s.lng]).addTo(markersGroupRef.current).bindPopup(popupContent);
      }
    });
  }, [sightings, selectedPark]);

  const handleSubmitSighting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    if (!selectedLatLng) return;

    try {
      await addDoc(collection(db, "sightings"), {
        park_name: selectedPark,
        lat: selectedLatLng.lat,
        lng: selectedLatLng.lng,
        description: sightingForm.description,
        zone_name: sightingForm.zone_name,
        safari_slot: sightingForm.safari_slot,
        user_name: currentUser.displayName || currentUser.email?.split("@")[0] || "Safari Guest",
        user_uid: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setSubmittedSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmittedSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Error submitting sighting:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Park Selector Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {Object.keys(PARK_COORDINATES).map((park) => (
          <button
            key={park}
            onClick={() => {
              triggerHaptic(10);
              setSelectedPark(park);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all active:scale-95 flex items-center gap-1.5 ${
              selectedPark === park
                ? "bg-orange-500 text-black shadow-lg shadow-orange-500/25"
                : "bg-zinc-950 border border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> {park}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative bg-zinc-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
        <div id="tiger-sightings-map" className="w-full h-[520px] z-10" />

        {/* Floating Instruction Banner */}
        <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-xs text-white max-w-xs space-y-1">
          <p className="font-extrabold text-orange-400 flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" /> Click Map to Mark Sighting
          </p>
          <p className="text-[11px] text-zinc-400 leading-snug">
            Tap anywhere in {selectedPark} to drop a tiger marker and update the live heat map!
          </p>
        </div>
      </div>

      {/* Report Sighting Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="bg-zinc-950 border border-white/15 w-full max-w-md rounded-3xl p-6 relative text-white shadow-2xl space-y-4"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4" /> Live Sighting Report
                </span>
                <h3 className="text-2xl font-black text-white">Mark Tiger Sighting</h3>
                <p className="text-xs text-zinc-400">{selectedPark}</p>
              </div>

              {!currentUser && (
                <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-2xl text-xs space-y-2 text-center">
                  <p className="text-zinc-300">Sign in required to record tiger sightings on the live map.</p>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="bg-orange-500 text-black font-extrabold px-5 py-2 rounded-full text-xs"
                  >
                    Sign In to Continue
                  </button>
                </div>
              )}

              {submittedSuccess ? (
                <div className="text-center py-6 space-y-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400" />
                  <p>Sighting Added to Live Map & Ticker!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitSighting} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Sighting Description</label>
                    <input
                      type="text"
                      required
                      value={sightingForm.description}
                      onChange={(e) => setFormData({ ...sightingForm, description: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Zone / Location Name</label>
                    <input
                      type="text"
                      required
                      value={sightingForm.zone_name}
                      onChange={(e) => setFormData({ ...sightingForm, zone_name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Safari Timing Slot</label>
                    <select
                      value={sightingForm.safari_slot}
                      onChange={(e) => setFormData({ ...sightingForm, safari_slot: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white"
                    >
                      <option value="Morning Safari">Morning Safari</option>
                      <option value="Evening Safari">Evening Safari</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-400 text-black font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20"
                  >
                    Publish Sighting to Map
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={(u: any) => setCurrentUser(u)} />
    </div>
  );
}
