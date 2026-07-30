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

class TypewriterSound {
  private isMuted: boolean = false;

  playClick() {
    if (this.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(850 + Math.random() * 250, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Ignore
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const typewriterSound = new TypewriterSound();

export const triggerHaptic = (type: "light" | "medium" | "heavy" = "light") => {
  if (typeof window === "undefined") return;

  if ("vibrate" in navigator) {
    try {
      const duration = type === "heavy" ? 25 : type === "medium" ? 18 : 10;
      navigator.vibrate(duration);
    } catch {
      // Ignore
    }
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.015);

    const volume = type === "heavy" ? 0.08 : type === "medium" ? 0.05 : 0.03;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch {
    // Ignore
  }
};

// Global Passive Capture-Phase Event Delegator for Instant 120Hz Touch Response
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
