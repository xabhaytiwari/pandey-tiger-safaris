"use client";

import { useState, useEffect } from "react";
import BookingWizard from "../../components/booking/BookingWizard";
import { fetchFromAPI } from "../../lib/api";

export default function BookingPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const [p, c, a] = await Promise.all([
        fetchFromAPI("/packages"),
        fetchFromAPI("/cars"),
        fetchFromAPI("/availability"),
      ]);
      setPackages(p || []);
      setCars(c || []);
      setAvailability(a || []);
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-12">
      <div className="space-y-4 text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Guided Reservation</span>
        <h1 className="text-4xl font-extrabold tracking-tight">Book Your Bandhavgarh Safari</h1>
      </div>

      <BookingWizard packages={packages} cars={cars} availability={availability} />
    </main>
  );
}
