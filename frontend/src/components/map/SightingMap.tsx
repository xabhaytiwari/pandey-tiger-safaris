"use client";

import { useState, useEffect, useRef } from "react";
import { db, auth, onAuthStateChanged } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { getExifGPS, findNearestPark } from "../../lib/exif";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, X, CheckCircle2, Flame, Upload, Navigation, Crosshair } from "lucide-react";
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

  // Sighting Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsDetected, setGpsDetected] = useState(false);
  const [detectionSource, setDetectionSource] = useState<"live_gps" | "photo_exif" | "manual">("manual");
  const [sightingPhotoBase64, setSightingPhotoBase64] = useState<string>("");
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  const [sightingForm, setFormData] = useState({
    description: "Royal Bengal Tiger spotted crossing forest track",
    zone_name: "Core Zone",
    safari_slot: "Morning Safari",
  });
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Real-time Firestore sync
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "sightings"), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSightings(docs);
    });
    return () => unsub();
  }, []);

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

  // Initialize Map with Clean White Tiles
  const initMap = () => {
    if (!window.L || mapInstanceRef.current) return;

    const initialCoords = PARK_COORDINATES[selectedPark] || PARK_COORDINATES["Bandhavgarh National Park"];

    const map = window.L.map("tiger-sightings-map", {
      center: [initialCoords.lat, initialCoords.lng],
      zoom: initialCoords.zoom,
      zoomControl: true,
    });

    // Clean White OpenStreetMap (CartoDB Positron)
    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    markersGroupRef.current = window.L.layerGroup().addTo(map);

    map.on("click", (e: any) => {
      triggerHaptic(12);
      setSelectedLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
      setGpsDetected(false);
      setDetectionSource("manual");
      setIsModalOpen(true);
    });

    mapInstanceRef.current = map;
  };

  // Fly Camera when Park Changes
  useEffect(() => {
    if (mapInstanceRef.current && PARK_COORDINATES[selectedPark]) {
      const coords = PARK_COORDINATES[selectedPark];
      mapInstanceRef.current.flyTo([coords.lat, coords.lng], coords.zoom, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [selectedPark]);

  // Render Blended Radial Gradient Heat Map & Filter Sightings > 24 Hours
  useEffect(() => {
    if (!window.L || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    const now = Date.now();

    // 1. Filter out sightings older than 24 hours (86,400,000 ms)
    const validSightings = sightings.filter((s) => {
      if (!s.lat || !s.lng) return false;
      const parkMatches = !s.park_name || s.park_name === selectedPark;
      const createdAtMs = s.createdAt?.seconds ? s.createdAt.seconds * 1000 : now;
      const hoursAgo = (now - createdAtMs) / (1000 * 60 * 60);
      return parkMatches && hoursAgo <= 24; // Exclude sightings older than 24h
    });

    // 2. Render Soft Radial Gradient Auras for Seamless Heat Blending
    validSightings.forEach((s) => {
      const createdAtMs = s.createdAt?.seconds ? s.createdAt.seconds * 1000 : now;
      const hoursAgo = (now - createdAtMs) / (1000 * 60 * 60);

      const coreColor = hoursAgo < 2 ? "rgba(255, 45, 85, 0.7)" : hoursAgo < 12 ? "rgba(255, 122, 0, 0.6)" : "rgba(88, 86, 214, 0.4)";
      const outerColor = hoursAgo < 2 ? "rgba(255, 94, 0, 0.25)" : hoursAgo < 12 ? "rgba(255, 180, 0, 0.2)" : "rgba(88, 86, 214, 0.1)";

      // Soft Borderless Radial Gradient Icon
      const heatIcon = window.L.divIcon({
        className: "custom-radial-heat-glow",
        html: `
          <div style="
            width: 140px; 
            height: 140px; 
            margin-left: -70px; 
            margin-top: -70px; 
            border-radius: 50%; 
            background: radial-gradient(circle, ${coreColor} 0%, ${outerColor} 50%, rgba(0,0,0,0) 100%);
            pointer-events: none;
            filter: blur(2px);
          "></div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      // Sleek Tiger Marker Badge
      const pinColor = hoursAgo < 2 ? "#FF2D55" : hoursAgo < 12 ? "#FF7A00" : "#5856D6";
      const tigerPinIcon = window.L.divIcon({
        className: "custom-tiger-pin",
        html: `
          <div style="
            position: relative;
            width: 28px;
            height: 28px;
            margin-left: -14px;
            margin-top: -14px;
            background: #000000;
            border: 2px solid ${pinColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px ${pinColor};
            cursor: pointer;
          ">
            <span style="font-size: 14px;">🐅</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      // Add Radial Gradient Aura + Pin Marker
      window.L.marker([s.lat, s.lng], { icon: heatIcon, interactive: false }).addTo(markersGroupRef.current);

      const popupContent = `
        <div style="font-family: Arial, sans-serif; padding: 6px; color: #000;">
          <strong style="color: ${pinColor}; font-size: 13px;">🐅 Tiger Sighting</strong><br/>
          <span style="font-size: 11px; font-weight: bold;">${s.description || "Royal Bengal Tiger"}</span><br/>
          <span style="font-size: 10px; color: #666;">Zone: ${s.zone_name || "Core Zone"} (${s.safari_slot || "Morning"})</span><br/>
          <span style="font-size: 9px; color: #888;">Reported: ${Math.round(hoursAgo)}h ago by ${s.user_name || "Guest"}</span>
        </div>
      `;

      window.L.marker([s.lat, s.lng], { icon: tigerPinIcon }).addTo(markersGroupRef.current).bindPopup(popupContent);
    });
  }, [sightings, selectedPark]);

  // LIVE SATELLITE GPS
  const handleDetectLiveGps = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      alert("Satellite Geolocation is not supported by your browser.");
      return;
    }

    triggerHaptic(15);
    setIsGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const nearestPark = findNearestPark(lat, lng);

        setSelectedPark(nearestPark);
        setSelectedLatLng({ lat, lng });
        setGpsDetected(true);
        setDetectionSource("live_gps");
        setIsGpsLoading(false);
        setIsModalOpen(true);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 1.5, easeLinearity: 0.25 });
        }
      },
      (error) => {
        setIsGpsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location permission was denied. Please allow location access or tap directly on the map.");
        } else {
          alert("Unable to acquire live GPS signal. Please tap directly on the map or upload a photo with EXIF location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // PHOTO EXIF GPS
  const handlePhotoAutoMark = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerHaptic(15);

    const reader = new FileReader();
    reader.onloadend = () => {
      setSightingPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);

    const gps = await getExifGPS(file);

    if (gps && gps.lat && gps.lng) {
      const nearestPark = findNearestPark(gps.lat, gps.lng);

      setSelectedPark(nearestPark);
      setSelectedLatLng({ lat: gps.lat, lng: gps.lng });
      setGpsDetected(true);
      setDetectionSource("photo_exif");
      setIsModalOpen(true);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([gps.lat, gps.lng], 14, { duration: 1.5, easeLinearity: 0.25 });
      }
    } else {
      alert("No EXIF GPS location found in photo. Defaulting to center of " + selectedPark + ". Tap on the map to set location.");
      const coords = PARK_COORDINATES[selectedPark];
      setSelectedLatLng({ lat: coords.lat, lng: coords.lng });
      setGpsDetected(false);
      setDetectionSource("manual");
      setIsModalOpen(true);
    }
  };

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
        photo_url: sightingPhotoBase64 || "",
        detection_source: detectionSource,
        user_name: currentUser.displayName || currentUser.email?.split("@")[0] || "Safari Guest",
        user_uid: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setSubmittedSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmittedSuccess(false);
        setSightingPhotoBase64("");
      }, 1500);
    } catch (err) {
      console.error("Error submitting sighting:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Extractor Bar */}
      <div className="bg-zinc-950 border border-orange-500/30 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 flex-shrink-0">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Auto-Mark Tiger Sighting Location</h4>
            <p className="text-zinc-400 text-xs">Use live device GPS, upload a photo with EXIF location, or tap anywhere on the map!</p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleDetectLiveGps}
            disabled={isGpsLoading}
            className="bg-orange-500 hover:bg-orange-400 text-black font-extrabold px-5 py-2.5 rounded-full text-xs transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 disabled:opacity-50"
          >
            <Crosshair className="w-4 h-4" />
            {isGpsLoading ? "Acquiring GPS..." : "Use My Live GPS"}
          </button>

          <label className="bg-zinc-900 border border-white/15 hover:bg-zinc-800 text-white font-bold px-5 py-2.5 rounded-full text-xs transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap active:scale-95">
            <Upload className="w-4 h-4 text-orange-500" /> Photo EXIF GPS
            <input type="file" accept="image/jpeg,image/jpg" onChange={handlePhotoAutoMark} className="hidden" />
          </label>
        </div>
      </div>

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

      {/* Clean White Map Container */}
      <div className="relative bg-white border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
        <div id="tiger-sightings-map" className="w-full h-[520px] z-10" />

        <div className="absolute top-4 left-4 z-20 bg-black/90 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-xs text-white max-w-xs space-y-2">
          <p className="font-extrabold text-orange-400 flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" /> Click Map, Live GPS, or Photo
          </p>
          <div className="flex flex-col gap-1 text-[11px] font-semibold pt-1 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-red-400"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Fresh Sighting (&lt; 2h ago)</span>
            <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Recent Sighting (2 - 12h ago)</span>
            <span className="flex items-center gap-1.5 text-indigo-400"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Past Sighting (&lt; 24h ago)</span>
          </div>
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

              {gpsDetected && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Location extracted via {detectionSource === "live_gps" ? "Live Device Satellite GPS" : "Photo EXIF Metadata"} ({selectedLatLng?.lat.toFixed(4)}°, {selectedLatLng?.lng.toFixed(4)}°)
                </div>
              )}

              {sightingPhotoBase64 && (
                <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-white/10">
                  <img src={sightingPhotoBase64} alt="Sighting Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {!currentUser && (
                <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-2xl text-xs space-y-2 text-center">
                  <p className="text-zinc-300">Sign in required to record tiger sightings on the live map.</p>
                  <button
                    type="button"
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
