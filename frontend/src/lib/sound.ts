// Singleton AudioContext Instance
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

// Organic Low-Pass Filtered Velvet Acoustic Tap
function playOrganicAcousticClick(isTypewriter: boolean = false) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. Organic Sine Oscillator
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(isTypewriter ? 220 : 180, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.025);

    // 2. Biquad Low-Pass Filter (Removes harsh metallic highs -> creates warm wood/velvet thock)
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(1, now);

    // 3. Whisper-Quiet Gain Envelope (0.015 - 0.025 volume)
    const gain = ctx.createGain();
    const volume = isTypewriter ? 0.015 : 0.025;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    // Signal Chain: Oscillator -> LowPass Filter -> Gain -> Speakers
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
  } catch (e) {
    // Ignore autoplay restrictions
  }
}

class TypewriterSound {
  private isMuted: boolean = false;

  playClick() {
    if (this.isMuted) return;
    playOrganicAcousticClick(true);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const typewriterSound = new TypewriterSound();

// Universal Haptic & Organic Click Helper
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

  // 2. Organic Low-Pass Acoustic Tap
  playOrganicAcousticClick(false);
};

// Global Event Delegator for Buttons and Links
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
