"use client";

import { motion } from "framer-motion";
import { MessageSquare, Phone } from "lucide-react";

export default function WhatsAppConcierge() {
  const whatsappUrl = `https://wa.me/919425331205?text=${encodeURIComponent(
    "Hello Dinesh Pandey Sir, I am inquiring about Bandhavgarh tiger safari packages and permit availability."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-3">
      {/* Phone Call Quick Button */}
      <motion.a
        href="tel:9425331205"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full bg-zinc-900 border border-white/20 text-orange-500 flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-zinc-800 transition-all"
        title="Call Owner: +91 9425331205"
      >
        <Phone className="w-5 h-5" />
      </motion.a>

      {/* WhatsApp Floating Button with Pulse Glow */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:bg-emerald-400 transition-all"
        title="Chat on WhatsApp with Dinesh Pandey"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-black animate-ping" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-black" />
        <MessageSquare className="w-7 h-7 fill-black" />
      </motion.a>
    </div>
  );
}
