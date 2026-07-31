"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Map, Camera, Package, Sparkles } from "lucide-react";
import { triggerHaptic } from "../../lib/sound";

export default function MobileQuickBar() {
  const pathname = usePathname();

  // Hide on admin page to keep admin clean
  if (pathname?.startsWith("/admin")) return null;

  const quickLinks = [
    { href: "/booking", label: "Book", icon: Compass },
    { href: "/sightings", label: "Live Map", icon: Map },
    { href: "/social", label: "Feed", icon: Camera },
    { href: "/packages", label: "Packages", icon: Package },
    { href: "/custom-package", label: "Custom", icon: Sparkles },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-[95] pointer-events-none">
      <div className="pointer-events-auto bg-black/90 backdrop-blur-2xl border border-white/15 rounded-full p-2 flex items-center justify-around shadow-2xl shadow-orange-500/10">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => triggerHaptic(10)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-full transition-all text-[10px] font-bold ${
                isActive
                  ? "bg-orange-500 text-black shadow-md shadow-orange-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
