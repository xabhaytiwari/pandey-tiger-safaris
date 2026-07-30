"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Phone, Calendar, User, Mail, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [customReqs, setCustomReqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOwnerData() {
      try {
        const bookingsSnap = await getDocs(collection(db, "bookings"));
        const customSnap = await getDocs(collection(db, "custom_packages"));

        setBookings(bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCustomReqs(customSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOwnerData();
  }, []);

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> Owner Management Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Live Safari Bookings</h1>
        </div>
        <div className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-full text-xs text-zinc-300">
          Owner: <strong>Dinesh Pandey (+91 9425331205)</strong>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading Cloud Firestore records...</div>
      ) : (
        <div className="space-y-12">
          {/* Guided Bookings */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" /> Standard Bookings ({bookings.length})
            </h2>

            {bookings.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No bookings recorded yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <div key={b.id} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-5 space-y-2 text-xs">
                    <div className="flex justify-between items-center font-bold text-white text-sm">
                      <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-amber-400" /> {b.customer_name}</span>
                      <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">{b.booking_date}</span>
                    </div>
                    <p className="text-zinc-400 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-amber-400" /> <a href={`tel:${b.customer_phone}`} className="hover:underline text-amber-400 font-semibold">{b.customer_phone}</a></p>
                    <p className="text-zinc-400 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {b.customer_email}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Custom Package Requests */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-400" /> Custom Safari Requests ({customReqs.length})
            </h2>

            {customReqs.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No custom requests submitted yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {customReqs.map((c) => (
                  <div key={c.id} className="bg-zinc-900/50 border border-amber-500/30 rounded-2xl p-5 space-y-2 text-xs">
                    <div className="flex justify-between items-center font-bold text-white text-sm">
                      <span>{c.customer_name}</span>
                      <span className="text-amber-400 font-extrabold">₹{c.budget_inr?.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-zinc-400">Phone: <a href={`tel:${c.phone}`} className="hover:underline text-amber-400 font-semibold">{c.phone}</a></p>
                    <p className="text-zinc-400">Dates: {c.preferred_dates}</p>
                    <p className="text-zinc-300 italic pt-1 border-t border-white/5">&quot;{c.requirements}&quot;</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
