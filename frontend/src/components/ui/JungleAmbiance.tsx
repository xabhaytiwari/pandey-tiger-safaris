"use client";

import { useState } from "react";
import { Trees, VolumeX, Volume2 } from "lucide-react";
import { triggerHaptic } from "../../lib/sound";

export default function JungleAmbiance() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  const toggleJungleSound = () => {
    triggerHaptic(12);

    if (!isPlaying) {
      try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new Ctx();

        // 1. Synthesize Soft Forest Wind / Leaf Rustle Noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Bandpass Filter tuned to gentle wind in leaves
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.Q.setValueAtTime(2, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.012, ctx.currentTime); // Soft background whisper

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start();
        setAudioCtx(ctx);
        setIsPlaying(true);
      } catch {
        // Fallback
      }
    } else {
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={toggleJungleSound}
      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 border active:scale-95 ${
        isPlaying
          ? "bg-emerald-950 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/20"
          : "bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white"
      }`}
      title="Toggle Ambient Forest Sounds"
    >
      <Trees className={`w-3.5 h-3.5 ${isPlaying ? "text-emerald-400 animate-pulse" : "text-zinc-500"}`} />
      <span>{isPlaying ? "Jungle Ambiance ON" : "Jungle Sound"}</span>
      {isPlaying ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3 text-zinc-500" />}
    </button>
  );
}
