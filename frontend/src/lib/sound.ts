// Singleton AudioContext Instance to prevent memory leaks
let globalAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!globalAudioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      globalAudioCtx = new AudioCtx();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === "suspended") {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

// Dual-Layer Synthesizer: Sharp Click Attack (Highs) + Deep Bassy Thock (Sub-Bass)
function playClickyBassySound(isTypewriter: boolean = false) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Layer 1: Crisp Sharp "Click" Transient (Highs)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();

    clickOsc.type = "triangle";
    clickOsc.frequency.setValueAtTime(isTypewriter ? 1900 : 1700, now);
    clickOsc.frequency.exponentialRampToValueAtTime(320, now + 0.008); // Fast 8ms click attack

    clickGain.gain.setValueAtTime(0.12, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickOsc.start(now);
    clickOsc.stop(now + 0.012);

    // Layer 2: Deep Bassy "Thock" Punch (Sub-Bass Lows)
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();

    bassOsc.type = "sine";
    bassOsc.frequency.setValueAtTime(isTypewriter ? 190 : 160, now);
    bassOsc.frequency.exponentialRampToValueAtTime(45, now + 0.065); // 65ms deep sub-bass drop (190Hz -> 45Hz)

    bassGain.gain.setValueAtTime(0.22, now); // Substantially higher bass volume
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);

    bassOsc.start(now);
    bassOsc.stop(now + 0.065);
  } catch (e) {
    // Ignore browser autoplay restrictions until interaction
  }
}

class TypewriterSound {
  private isMuted: boolean = false;

  playClick() {
    if (this.isMuted) return;
    playClickyBassySound(true);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const typewriterSound = new TypewriterSound();

// Universal Haptic Engine (Vibration + Clicky/Bassy Sound)
export const triggerHaptic = (type: "light" | "medium" | "heavy" = "light") => {
  if (typeof window === "undefined") return;

  // 1. Android Hardware Vibration
  if ("vibrate" in navigator) {
    try {
      const duration = type === "heavy" ? 25 : type === "medium" ? 18 : 10;
      navigator.vibrate(duration);
    } catch {
      // Ignore
    }
  }

  // 2. Play Clicky & Bassy Audio Pulse
  playClickyBassySound(false);
};

// Global Capture-Phase Event Delegator for Instant Touch Response
if (typeof window !== "undefined") {
  const handleGlobalClick = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const interactive = target.closest(
      "button, a, select, option, input[type='button'], input[type='submit'], input[type='checkbox'], [role='button'], [data-haptic]"
    );

    if (interactive) {
      triggerHaptic("light");
    }
  };

  window.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
}
