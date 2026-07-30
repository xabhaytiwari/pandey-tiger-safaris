"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db, auth, onAuthStateChanged } from "../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import AuthModal from "../../components/auth/AuthModal";
import { 
  Calendar, Ticket, User, MapPin, Clock, CreditCard, CheckCircle2, 
  MessageSquare, Phone, Lock, LogIn, ArrowRight, ShieldCheck, Car, Users, Printer
} from "lucide-react";

export default function MyBookingsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [customReqs, setCustomReqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

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

  const handlePrintVoucher = (booking: any) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Safari Pass Voucher - ${booking.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; color: #000; }
              .card { border: 2px solid #000; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
              .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
              .bold { font-weight: bold; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; border-top: 1px solid #ccc; padding-top: 15px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <h2>PANDEY TIGER SAFARIS</h2>
                <p>Official Gate Permit Voucher • Bandhavgarh & MP Reserves</p>
              </div>
              <div class="row"><span>Guest Name:</span><span class="bold">${booking.customer_name}</span></div>
              <div class="row"><span>National Park:</span><span class="bold">${booking.park_name || "Bandhavgarh"}</span></div>
              <div class="row"><span>Safari Date:</span><span class="bold">${booking.booking_date}</span></div>
              <div class="row"><span>Safari Timing:</span><span class="bold">${booking.safari_slot || "Morning Safari"}</span></div>
              <div class="row"><span>Travelers Count:</span><span class="bold">${booking.guests_count || 2} Persons (${booking.nationality || "Indian"})</span></div>
              <div class="row"><span>Vehicle Assigned:</span><span class="bold">${booking.car_name || "Safari Jeep"}</span></div>
              <div class="row"><span>Payment Status:</span><span class="bold">${booking.payment_status || "Advance Paid"} (Paid: ₹${booking.amount_paid_inr})</span></div>
              ${booking.balance_due_inr > 0 ? `<div class="row"><span>Balance Due on Arrival:</span><span class="bold">₹${booking.balance_due_inr}</span></div>` : ''}
              <div class="footer">
                <p>Present this voucher at Tala Gate HQ to Dinesh Pandey (+91 9425331205)</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold flex items-center justify-center gap-1.5">
          <Ticket className="w-4 h-4" /> Guest Portal
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">My Safari Bookings</h1>
        <p className="text-zinc-400 text-sm">View your confirmed safari permits, payment receipts, and print gate entry vouchers.</p>
      </div>

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

      {currentUser && (
        <div className="space-y-10">
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
                          {booking.balance_due_inr > 0 && (
                            <p className="col-span-2 text-amber-400 font-bold pt-1">
                              Balance Due on Arrival: ₹{booking.balance_due_inr.toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handlePrintVoucher(booking)}
                          className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-bold px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5 transition-all"
                        >
                          <Printer className="w-3.5 h-3.5 text-orange-500" /> Print Gate Voucher
                        </button>

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
