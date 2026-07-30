"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";

export default function LiveSightingTicker() {
  const [liveTickerUpdates, setLiveTickerUpdates] = useState<string[]>([]);

  const defaultUpdates = [
    "🐅 TALA ZONE: Female Tigress with 2 cubs spotted at Shesh Shaiya stream",
    "🐆 MAGDHI ZONE: Dominant male tiger tracked near Meadow Road waterhole",
    "🌿 KHITAULI ZONE: Morning safari pack spotted near Bamboo Hills",
    "🎟️ PERMIT ALERT: Peak weekend permits filling fast for Tala & Magdhi gates",
    "📞 DIRECT BOOKING: Call owner Dinesh Pandey at +91 9425331205 for gate permits"
  ];

  // Subscribe to real-time Cloud Firestore sightings
  useEffect(() => {
    if (typeof window === "undefined") return;

    const q = query(collection(db, "sightings"), limit(10));
    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const dynamicList = snapshot.docs.map((doc) => {
          const d = doc.data();
          return `🐅 ${d.park_name || "Bandhavgarh"}: ${d.description || "Tiger Spotted"} (${d.zone_name || "Core Zone"}) — Reported by ${d.user_name || "Guest"}`;
        });
        setLiveTickerUpdates(dynamicList);
      } else {
        setLiveTickerUpdates(defaultUpdates);
      }
    });

    return () => unsub();
  }, []);

  const activeUpdates = liveTickerUpdates.length > 0 ? liveTickerUpdates : defaultUpdates;

  return (
    <div className="bg-orange-500/10 border-y border-orange-500/30 py-2.5 px-4 overflow-hidden backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <span className="flex items-center gap-1.5 bg-orange-500 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-md shadow-orange-500/20 flex-shrink-0">
          <Radio className="w-3 h-3 animate-pulse" /> Live Jungle Ticker
        </span>

        <div className="flex-1 overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="flex gap-12 whitespace-nowrap text-xs font-semibold text-orange-300"
          >
            {[...activeUpdates, ...activeUpdates].map((msg, i) => (
              <span key={i} className="flex items-center gap-3">
                {msg}
                <span className="text-orange-500/40 font-bold">•</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
