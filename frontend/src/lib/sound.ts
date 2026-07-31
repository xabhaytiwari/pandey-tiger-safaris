let globalAudioCtx: AudioContext | null = null;

// Only initialize AudioContext after explicit user gesture to avoid browser console warnings
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

class TypewriterSound {
  private isMuted: boolean = false;
  private userInteracted: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const enableAudioOnGesture = () => {
        this.userInteracted = true;
        getAudioContext();
        window.removeEventListener("click", enableAudioOnGesture);
        window.removeEventListener("touchstart", enableAudioOnGesture);
      };
      window.addEventListener("click", enableAudioOnGesture, { once: true });
      window.addEventListener("touchstart", enableAudioOnGesture, { once: true });
    }
  }

  playClick() {
    // Only play sound if user has interacted with the page & is not muted
    if (this.isMuted || !this.userInteracted) return;
    const ctx = getAudioContext();
    if (!ctx || ctx.state === "suspended") return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(850 + Math.random() * 250, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Fail-safe
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const typewriterSound = new TypewriterSound();

export const triggerHaptic = (type: "light" | "medium" | "heavy" = "light") => {
  try {
    if (typeof window === "undefined") return;

    if ("vibrate" in navigator) {
      try {
        const duration = type === "heavy" ? 25 : type === "medium" ? 18 : 10;
        navigator.vibrate(duration);
      } catch {
        // Ignore
      }
    }

    const ctx = getAudioContext();
    if (!ctx || ctx.state === "suspended") return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.015);

    const volume = type === "heavy" ? 0.08 : type === "medium" ? 0.05 : 0.03;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.015);
  } catch {
    // Fail-safe
  }
};

if (typeof window !== "undefined") {
  const handleGlobalClick = (e: Event) => {
    try {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        "button, a, select, option, input[type='button'], input[type='submit'], input[type='checkbox'], [role='button'], [data-haptic]"
      );

      if (interactive) {
        triggerHaptic("light");
      }
    } catch {
      // Ignore
    }
  };

  window.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
}
