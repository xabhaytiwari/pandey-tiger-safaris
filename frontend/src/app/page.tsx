"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Hero from "../components/sections/Hero";
import BookingWizard from "../components/booking/BookingWizard";
import CustomPackage from "../components/sections/CustomPackage";
import AuthModal from "../components/auth/AuthModal";
import { fetchFromAPI } from "../lib/api";
import { auth, onAuthStateChanged, signOut } from "../lib/firebase";
import { Star, Phone, Car as CarIcon } from "lucide-react";

export default function Home() {
  const [founder, setFounder] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [contact, setContact] = useState<any>(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function loadData() {
      const [f, p, c, d, a, r, con] = await Promise.all([
        fetchFromAPI("/founder"),
        fetchFromAPI("/packages"),
        fetchFromAPI("/cars"),
        fetchFromAPI("/drivers"),
        fetchFromAPI("/availability"),
        fetchFromAPI("/reviews"),
        fetchFromAPI("/contact"),
      ]);
      setFounder(f);
      setPackages(p || []);
      setCars(c || []);
      setDrivers(d || []);
      setAvailability(a || []);
      setReviews(r || []);
      setContact(con);
    }
    loadData();
  }, []);

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <main className="bg-zinc-950 min-h-screen text-zinc-100 font-sans">
      <Hero founder={founder} user={user} onOpenAuth={() => setIsAuthOpen(true)} onSignOut={handleSignOut} />

      {/* Tour Packages Section with INR Pricing */}
      <section id="packages" className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-amber-500 text-center mb-4">
          Bandhavgarh Safari Packages
        </h2>
        <p className="text-zinc-400 text-center mb-12">All packages include jungle permits, safari jeep, and luxury stay</p>
        <div className="grid md:grid-cols-2 gap-8">
          {packages.map((pkg: any) => (
            <div key={pkg.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all">
              <img src={pkg.image_url} alt={pkg.title} className="w-full h-56 object-cover" />
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-amber-500/10 text-amber-400 font-semibold px-3 py-1 rounded-full border border-amber-500/20">{pkg.duration}</span>
                  <span className="text-2xl font-bold text-amber-400">₹{pkg.price_inr?.toLocaleString("en-IN")}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{pkg.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{pkg.description}</p>
                <p className="text-xs text-zinc-500 font-medium">Highlights: {pkg.highlights}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet Section (Innova Crysta, Force Traveller, Swift Dzire, Custom) */}
      <section className="py-20 bg-zinc-900/50 border-y border-zinc-800 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div>
            <div className="flex items-center justify-center gap-2 text-amber-500 mb-2">
              <CarIcon className="w-5 h-5" /> Comprehensive Vehicle Fleet
            </div>
            <h2 className="text-3xl font-extrabold text-white text-center mb-8">Our Vehicles & Personal Vehicle Requests</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car: any) => (
                <div key={car.id} className="bg-zinc-950 p-5 border border-zinc-800 rounded-xl space-y-3">
                  <img src={car.image_url} alt={car.name} className="w-full h-40 object-cover rounded-lg" />
                  <h4 className="font-bold text-lg text-white">{car.name}</h4>
                  <p className="text-xs text-amber-400 font-medium">{car.category}</p>
                  <p className="text-xs text-zinc-400">{car.description}</p>
                  {car.capacity > 0 && <span className="inline-block text-xs text-zinc-500">Seating Capacity: {car.capacity} Persons</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Package Form */}
      <CustomPackage />

      {/* Guided Booking Wizard */}
      <BookingWizard packages={packages} cars={cars} availability={availability} />

      {/* Reviews */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-10">Guest Reviews</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((rev: any) => (
            <div key={rev.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-3">
              <div className="flex gap-1 text-amber-400">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-zinc-300 italic text-sm">&quot;{rev.comment}&quot;</p>
              <div>
                <p className="text-sm font-bold text-white">{rev.author}</p>
                <p className="text-xs text-zinc-500">{rev.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Contact Details */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-12 px-4 text-center text-zinc-400 text-sm">
        <p className="font-semibold text-white text-base mb-2">Pandey Tiger Safaris Headquarters</p>
        <p>Founder & Direct Guide: <strong>Dinesh Pandey</strong></p>
        <p className="text-amber-400 font-bold text-lg mt-2 flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" /> Direct Mobile: 9425331205
        </p>
        <p className="mt-1">{contact?.hq_address || "Tala Gate, Bandhavgarh National Park, MP, India"}</p>
        <p className="text-xs text-zinc-600 mt-6">© {new Date().getFullYear()} Pandey Tiger Safaris. All rights reserved.</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={(u: any) => setUser(u)} />
    </main>
  );
}
