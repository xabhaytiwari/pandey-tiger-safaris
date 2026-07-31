const PREFIXES = ["Tiger", "Wild", "Safari", "Jungle", "Roar", "Tracker", "Voyager", "Canopy", "Prowler", "Bandhav", "Tala", "Mukki"];
const SUFFIXES = ["Seeker", "Explorer", "Chaser", "Nomad", "Ranger", "Wanderer", "Scout", "Rider"];

export function generateSafariUsername(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("safari_unique_username");
    if (stored) return stored;
  }

  const pref = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suff = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const num = Math.floor(100 + Math.random() * 900);
  const generated = `@${pref}${suff}${num}`;

  if (typeof window !== "undefined") {
    localStorage.setItem("safari_unique_username", generated);
  }

  return generated;
}
