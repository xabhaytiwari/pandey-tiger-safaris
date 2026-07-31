"use client";

import { motion } from "framer-motion";

export default function BottomStatusTicker() {
  const tickerItems = [
    "🐅 PANDEY TIGER SAFARIS",
    "20+ Years Wildlife Excellence",
    "Official MP Forest Dept Gate Permits",
    "Owner Operated: Dinesh Pandey (+91 9425331205)",
    "Bandhavgarh • Kanha • Pench • Panna • Satpura",
    "Innova Crysta, Force Traveller, Swift Dzire & 4x4 Gypsies",
    "100% Verified Safari Entry Permits"
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[80] w-full bg-black/80 backdrop-blur-2xl border-t border-white/15 py-2.5 overflow-hidden shadow-[0_-8px_32px_rgba(0,0,0,0.7)] pointer-events-auto">
      {/* Top Liquid Glass Glow Hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

      <div className="flex w-full overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap text-[11px] font-mono font-bold text-zinc-300"
        >
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="text-white tracking-wider">{item}</span>
              <span className="text-orange-500 font-extrabold">•</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
