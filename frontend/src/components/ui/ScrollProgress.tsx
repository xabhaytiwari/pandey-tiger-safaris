"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 z-[110] origin-left shadow-[0_0_10px_rgba(255,122,0,0.8)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
