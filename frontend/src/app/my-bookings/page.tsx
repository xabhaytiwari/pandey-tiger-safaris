"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db, auth, onAuthStateChanged } from "../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import AuthModal from "../../components/auth/AuthModal";
import { 
  Calendar, Ticket, User, MapPin, Clock, CreditCard, CheckCircle2, 
  MessageSquare, Phone, Lock, LogIn, ArrowRight, ShieldCheck, Car, Users
} from "lucide-react";

export default function MyBookingsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [customReqs, setCustomReqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore query for current user's bookings & custom requests
  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    // Query bookings belonging to current user
    const qBookings = query(
      collection(db, "bookings"),
      where("user_uid", "==", currentUser.uid)
    );

    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
      const userBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(userBookings);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching user bookings:", err);
      setLoading(false);
    });

    // Query custom requests belonging to current user
    const qCustom = query(
      collection(db, "custom_packages"),
      where("user_uid", "==", currentUser.uid)
    );

    const unsubCustom = onSnapshot(qCustom, (snapshot) => {
      const userCustoms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomReqs(userCustoms);
    }, (err) => {
      console.error("Error fetching user custom requests:", err);
    });

    return () => {
      unsubBookings();
      unsubCustom();
    };
  }, [currentUser]);

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* Header Bar */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold flex items-center justify-center gap-1.5">
          <Ticket className="w-4 h-4" /> Guest Portal
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">My Safari Bookings</h1>
        <p className="text-zinc-400 text-sm">View your confirmed safari permits, payment receipts, and travel itineraries.</p>
      </div>

      {/* 1. Unauthenticated Guard State */}
      {!currentUser && !loading && (
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 md:p-12 text-center max-w-xl mx-auto space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-500">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Sign In to View Booking History</h3>
            <p className="text-zinc-400 text-xs max-w-md mx-auto">
              Please sign in with your Google or Email account to access your reserved safari permits and receipts.
            </p>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-8 py-3.5 rounded-full text-sm transition-all shadow-xl shadow-orange-500/20 inline-flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Sign In to Access My Bookings
          </button>
        </div>
      )}

      {/* 2. Authenticated User Booking History View */}
      {currentUser && (
        <div className="space-y-10">
          {/* User Account Banner */}
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-500 font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{currentUser.displayName || "Safari Guest"}</h4>
                <p className="text-xs text-zinc-400">{currentUser.email}</p>
              </div>
            </div>

            <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Guest Account
            </span>
          </div>

          {/* Reserved Safaris List */}
          <section className="space-y-6">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-500" /> Confirmed Safari Permits ({bookings.length})
            </h2>

            {loading ? (
              <p className="text-xs text-zinc-500 italic text-center py-8">Fetching your safari records from Cloud Firestore...</p>
            ) : bookings.length === 0 ? (
              <div className="bg-zinc-950 border border-white/10 rounded-3xl p-10 text-center space-y-4">
                <p className="text-zinc-400 text-sm">No safari bookings found for this account yet.</p>
                <Link href="/booking" className="inline-flex items-center gap-2 bg-orange-500 text-black font-extrabold px-6 py-3 rounded-full text-xs hover:bg-orange-400 transition-all">
                  Reserve Safari Package <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {bookings.map((booking) => {
                  const whatsappSupportText = encodeURIComponent(
                    `*SAFARI BOOKING INQUIRY*\n\n` +
                    `*Booking ID:* ${booking.id}\n` +
                    `*Guest:* ${booking.customer_name}\n` +
                    `*Park:* ${booking.park_name || "Bandhavgarh"}\n` +
                    `*Date:* ${booking.booking_date}\n` +
                    `*Slot:* ${booking.safari_slot || "Morning Safari"}`
                  );
                  const whatsappUrl = `https://wa.me/919425331205?text=${whatsappSupportText}`;

                  return (
                    <div key={booking.id} className="bg-zinc-950 border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {booking.park_name || "Bandhavgarh National Park"}
                          </span>
                          <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                            {booking.payment_status || "Advance Paid"}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-white">{booking.package_title || "Safari Expedition"}</h3>
                          <p className="text-xs text-orange-400 font-semibold flex items-center gap-1.5 mt-1">
                            <Clock className="w-3.5 h-3.5" /> Date: {booking.booking_date} ({booking.safari_slot || "Morning Safari"})
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 bg-black/60 p-3 rounded-2xl border border-white/5">
                          <p className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-orange-500" /> {booking.guests_count || 2} Travelers</p>
                          <p className="flex items-center gap-1"><Car className="w-3.5 h-3.5 text-orange-500" /> {booking.car_name || "Safari Vehicle"}</p>
                          <p className="col-span-2 flex items-center gap-1 pt-1 text-zinc-300 border-t border-white/5">
                            <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Amount Paid: <strong>₹{booking.amount_paid_inr?.toLocaleString("en-IN") || "Prepaid"}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-500">ID: {booking.id.substring(0, 10)}...</span>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Support
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Custom Package Requests List */}
          {customReqs.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-orange-500" /> Custom Safari Inquiries ({customReqs.length})
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {customReqs.map((req) => (
                  <div key={req.id} className="bg-zinc-950 border border-orange-500/30 rounded-2xl p-5 space-y-2 text-xs">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>Custom Safari Request</span>
                      <span className="text-orange-400">Budget: ₹{req.budget_inr?.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-zinc-400">Dates: {req.preferred_dates}</p>
                    <p className="text-zinc-300 italic pt-1 border-t border-white/5">&quot;{req.requirements}&quot;</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={(u: any) => setCurrentUser(u)} />
    </main>
  );
}
