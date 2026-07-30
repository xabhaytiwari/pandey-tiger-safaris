import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-16 text-zinc-400 text-xs font-sans">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <h4 className="text-white font-extrabold text-base tracking-tight">
            Pandey Tiger Safaris
          </h4>
          <p className="text-zinc-500 leading-relaxed">
            Premier tour and travel management in Bandhavgarh National Park operated by business owner Dinesh Pandey. Complete packages, luxury vehicle fleet, and an army of expert licensed guides.
          </p>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-3">Quick Navigation</h5>
          <ul className="space-y-2">
            <li><Link href="/packages" className="hover:text-white">Safari Packages</Link></li>
            <li><Link href="/fleet" className="hover:text-white">Vehicle Fleet</Link></li>
            <li><Link href="/booking" className="hover:text-white">Guided Booking</Link></li>
            <li><Link href="/custom-package" className="hover:text-white">Custom Request</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-3">Guest & Owner Links</h5>
          <ul className="space-y-2">
            <li><Link href="/my-bookings" className="hover:text-white">My Safari Bookings</Link></li>
            <li><Link href="/about" className="hover:text-white">Dinesh Pandey Profile</Link></li>
            <li><Link href="/contact" className="hover:text-white">Bandhavgarh HQ</Link></li>
            <li><Link href="/admin" className="hover:text-white">Owner Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-3">Direct Contact</h5>
          <p className="text-orange-500 font-bold text-sm mb-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> +91 9425331205
          </p>
          <p className="flex items-center gap-1.5 text-zinc-500 mb-1">
            <MapPin className="w-3.5 h-3.5" /> Bandhavgarh National Park, MP
          </p>
          <p className="flex items-center gap-1.5 text-zinc-500">
            <Mail className="w-3.5 h-3.5" /> dinesh@pandeytigersafaris.com
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-zinc-600">
        <p>© {new Date().getFullYear()} Pandey Tiger Safaris. All rights reserved.</p>
        <p>Headquarters: Tala Gate, Bandhavgarh, MP, India</p>
      </div>
    </footer>
  );
}
