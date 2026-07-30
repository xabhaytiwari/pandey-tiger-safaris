"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { typewriterSound } from "../../lib/sound";

const PARKS = [
  "Bandhavgarh",
  "Kanha",
  "Pench",
  "Panna",
  "Satpura"
];

export default function TypewriterHero() {
  const [text, setText] = useState("");
  const [parkIndex, setParkIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const currentPark = PARKS[parkIndex];
    const speed = isDeleting ? 70 : 130;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(currentPark.substring(0, text.length + 1));
        typewriterSound.playClick();

        if (text.length + 1 === currentPark.length) {
          setTimeout(() => setIsDeleting(true), 2200); // Pause at complete word
        }
      } else {
        setText(currentPark.substring(0, text.length - 1));

        if (text.length === 1) {
          setIsDeleting(false);
          setParkIndex((prev) => (prev + 1) % PARKS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, parkIndex]);

  const handleToggleMute = () => {
    const muted = typewriterSound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <span className="inline-flex items-center gap-2">
      <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-600 bg-clip-text text-transparent font-black underline decoration-orange-500/40 underline-offset-8">
        {text}
      </span>
      <span className="animate-pulse text-orange-500 font-bold">|</span>
      <button
        onClick={handleToggleMute}
        className="ml-1 p-1 rounded-full bg-zinc-900/80 border border-white/10 hover:border-orange-500 text-zinc-400 hover:text-orange-400 transition-all text-xs"
        title={isMuted ? "Unmute Typewriter Sound" : "Mute Typewriter Sound"}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-orange-500" />}
      </button>
    </span>
  );
}
