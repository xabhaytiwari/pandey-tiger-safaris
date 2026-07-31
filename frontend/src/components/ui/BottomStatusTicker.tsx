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
    <div className="bg-black border-t border-white/10 py-3 overflow-hidden backdrop-blur-xl relative z-40">
      <div className="flex w-full overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap text-xs font-mono font-bold text-zinc-400"
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
