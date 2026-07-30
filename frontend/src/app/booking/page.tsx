"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BookingWizard from "../../components/booking/BookingWizard";
import { fetchFromAPI } from "../../lib/api";

function BookingContent() {
  const searchParams = useSearchParams();
  const parkParam = searchParams.get("park");

  const [packages, setPackages] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const [p, c] = await Promise.all([
        fetchFromAPI("/packages"),
        fetchFromAPI("/cars"),
      ]);
      setPackages(p || []);
      setCars(c || []);
    }
    loadData();
  }, []);

  return (
    <BookingWizard 
      packages={packages} 
      cars={cars} 
      initialPark={parkParam || "Bandhavgarh National Park"} 
    />
  );
}

export default function BookingPage() {
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-12">
      <div className="space-y-4 text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Guided Reservation</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Book Your Tiger Safari</h1>
      </div>

      <Suspense fallback={<div className="text-center py-12 text-zinc-500">Loading Safari Booking System...</div>}>
        <BookingContent />
      </Suspense>
    </main>
  );
}
