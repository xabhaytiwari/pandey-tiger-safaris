"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-30 w-80 h-80 rounded-full bg-orange-500/10 blur-[120px] hidden lg:block"
      animate={{
        x: mousePosition.x - 160,
        y: mousePosition.y - 160,
      }}
      transition={{ type: "spring", damping: 35, stiffness: 180, mass: 0.4 }}
    />
  );
}
