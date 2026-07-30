"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, CheckCircle2, LogOut, Calendar as CalendarIcon, User, Mail, Phone, 
  PlusCircle, Upload, Image as ImageIcon, Tag, X, FileText, Globe, Package
} from "lucide-react";

export default function AdminDashboard() {
  const [authStep, setAuthStep] = useState<"login" | "2fa" | "authenticated">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inputOtp, setInputOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [customReqs, setCustomReqs] = useState<any[]>([]);
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Modals State
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

  // Add Package Form State
  const [packageForm, setPackageForm] = useState({
    title: "",
    duration: "3 Days / 2 Nights",
    price_inr: 28500,
    description: "",
    highlights: "4 Safaris, Resort Stay, Railway Station Pickup",
    image_url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800"
  });

  // Offline Booking Form State
  const [offlineForm, setOfflineForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    guests_count: 2,
    nationality: "Indian",
    id_proof_type: "Aadhaar Card",
    booking_date: new Date().toISOString().split("T")[0],
    package_title: "Royal Bengal Tiger Expedition",
    car_name: "Innova Crysta",
    payment_status: "Advance Paid",
    amount_paid_inr: 7125,
    booking_source: "offline_phone",
    payment_proof_base64: "",
    id_proof_base64: ""
  });

  useEffect(() => {
    const isAuthed = sessionStorage.getItem("admin_authed");
    if (isAuthed === "true") {
      setAuthStep("authenticated");
    }
  }, []);

  // Real-Time Sync
  useEffect(() => {
    if (authStep !== "authenticated") return;

    const unsubBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubCustom = onSnapshot(collection(db, "custom_packages"), (snapshot) => {
      setCustomReqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubPackages = onSnapshot(collection(db, "packages"), (snapshot) => {
      setPackagesList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubBookings();
      unsubCustom();
      unsubPackages();
    };
  }, [authStep]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        setAuthStep("2fa");
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Failed to trigger 2FA request");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputOtp }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("admin_authed", "true");
        setAuthStep("authenticated");
      } else {
        setError(data.error || "2FA verification failed");
      }
    } catch (err) {
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Create New Tour Package
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "packages"), {
        ...packageForm,
        createdAt: serverTimestamp(),
      });
      setIsPackageModalOpen(false);
      setPackageForm({
        title: "",
        duration: "3 Days / 2 Nights",
        price_inr: 28500,
        description: "",
        highlights: "4 Safaris, Resort Stay, Railway Station Pickup",
        image_url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800"
      });
    } catch (err) {
      console.error("Error creating package:", err);
    }
  };

  // Convert File Input to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOfflineForm(prev => ({ ...prev, [fieldName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateOfflineBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bookings"), {
        ...offlineForm,
        createdAt: serverTimestamp(),
      });
      setIsOfflineModalOpen(false);
    } catch (err) {
      console.error("Error creating offline booking:", err);
    }
  };

  const calendarDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const count = bookings.filter(b => b.booking_date === dateStr).length;
    return { dateStr, count };
  });

  const filteredBookings = selectedDate 
    ? bookings.filter(b => b.booking_date === selectedDate)
    : bookings;

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-12">
      {authStep !== "authenticated" && (
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-950 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl backdrop-blur-2xl space-y-6 text-white">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto text-orange-500">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Owner Access Portal</h2>
              <p className="text-zinc-400 text-xs">Pandey Tiger Safaris Restricted Area</p>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">{error}</div>}

            {authStep === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="dinesh_pandey"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-xl transition-all text-sm hover:bg-orange-400 disabled:opacity-50">
                  {loading ? "Verifying Credentials..." : "Sign In to Admin"}
                </button>
              </form>
            )}

            {authStep === "2fa" && (
              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 p-3.5 rounded-xl text-xs text-orange-300">
                  2FA Verification Code dispatched to: <strong className="text-white block mt-0.5">singhabhaytiwari@gmail.com</strong>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Enter 6-Digit 2FA Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="••••••"
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value)}
                    className="w-full bg-black border border-orange-500/50 text-orange-400 font-mono tracking-widest text-center text-xl rounded-xl p-3.5 focus:outline-none"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-black font-extrabold py-3.5 rounded-xl transition-all text-sm disabled:opacity-50">
                  {loading ? "Verifying 2FA..." : "Unlock Owner Dashboard"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {authStep === "authenticated" && (
        <div className="space-y-12">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Real-time Cloud Sync Active
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-1">Owner Dashboard</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsPackageModalOpen(true)}
                className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-bold px-4 py-2 rounded-full text-xs flex items-center gap-2 transition-all"
              >
                <Package className="w-4 h-4 text-orange-500" /> + Add Tour Package
              </button>

              <button
                onClick={() => setIsOfflineModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-4 py-2 rounded-full text-xs flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20"
              >
                <PlusCircle className="w-4 h-4" /> Add Offline Booking
              </button>

              <button onClick={() => { sessionStorage.removeItem("admin_authed"); setAuthStep("login"); }} className="bg-zinc-900 border border-white/10 text-zinc-300 hover:text-red-400 px-4 py-2 rounded-full text-xs flex items-center gap-1.5 transition-all">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>

          {/* Calendar */}
          <section className="bg-zinc-950 border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-orange-500" /> Interactive Booking Calendar
                </h2>
                <p className="text-xs text-zinc-400">Click a date to filter bookings</p>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-semibold">
                <span className="flex items-center gap-1 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available (0)</span>
                <span className="flex items-center gap-1 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium (1)</span>
                <span className="flex items-center gap-1 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Interest (2+)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
              {calendarDates.map(({ dateStr, count }) => {
                const isSelected = selectedDate === dateStr;
                let colorStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
                if (count === 1) colorStyle = "bg-amber-500/20 border-amber-500/50 text-amber-300";
                if (count >= 2) colorStyle = "bg-rose-500/20 border-rose-500/50 text-rose-300";

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`p-3 rounded-2xl border text-center transition-all ${colorStyle} ${
                      isSelected ? "ring-2 ring-white scale-105 shadow-xl" : "hover:opacity-80"
                    }`}
                  >
                    <p className="text-[10px] uppercase font-mono tracking-wider">{dateStr}</p>
                    <p className="text-base font-extrabold mt-0.5">{count} Booked</p>
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="pt-2 flex justify-between items-center text-xs text-orange-400 font-semibold border-t border-white/5">
                <span>Filtering for: <strong>{selectedDate}</strong></span>
                <button onClick={() => setSelectedDate(null)} className="flex items-center gap-1 hover:underline">
                  <X className="w-3.5 h-3.5" /> Clear Filter
                </button>
              </div>
            )}
          </section>

          {/* Bookings List with ID Proof Thumbnails */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-500" /> Bookings & ID Proofs ({filteredBookings.length})
            </h2>

            {filteredBookings.length === 0 ? (
              <p className="text-xs text-zinc-500 italic bg-zinc-950 p-6 rounded-2xl border border-white/5 text-center">No bookings found.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="bg-zinc-950 border border-white/10 rounded-2xl p-5 space-y-3 text-xs shadow-xl">
                    <div className="flex justify-between items-center font-bold text-white text-sm">
                      <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-orange-500" /> {b.customer_name}</span>
                      <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">{b.booking_date}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-zinc-400 border-y border-white/5 py-2">
                      <p>Travelers: <strong className="text-white">{b.guests_count || 2} Persons</strong></p>
                      <p>Nationality: <strong className="text-white">{b.nationality || "Indian"}</strong></p>
                      <p>Package: <strong className="text-zinc-200">{b.package_title || b.package_id}</strong></p>
                      <p>Vehicle: <strong className="text-zinc-200">{b.car_name || b.car_id}</strong></p>
                      <p className="col-span-2">Payment: <strong className="text-amber-400 uppercase">{b.payment_status || "Advance Paid"}</strong> ({b.amount_paid_inr ? `₹${b.amount_paid_inr.toLocaleString("en-IN")}` : "Prepaid"})</p>
                    </div>

                    <div className="flex justify-between items-center pt-1 text-zinc-400">
                      <a href={`tel:${b.customer_phone}`} className="hover:underline text-orange-500 font-semibold flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {b.customer_phone}
                      </a>
                      <span className="text-[10px] text-zinc-500 capitalize">{b.customer_email}</span>
                    </div>

                    {/* Aadhaar or Passport ID Proof Viewer */}
                    {b.id_proof_base64 && (
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <p className="text-[10px] font-semibold text-orange-400 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> {b.id_proof_type || "Aadhaar Card"} Attachment:
                        </p>
                        <a href={b.id_proof_base64} target="_blank" rel="noopener noreferrer">
                          <img src={b.id_proof_base64} alt="ID Proof" className="w-full h-32 object-cover rounded-xl border border-white/10 hover:opacity-90" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Add Tour Package Modal */}
      <AnimatePresence>
        {isPackageModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-3xl p-6 relative text-white shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-orange-500 flex items-center gap-2">
                  <Package className="w-5 h-5" /> Publish New Tour Package
                </h3>
                <button onClick={() => setIsPackageModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
                <input type="text" placeholder="Package Title (e.g. Bandhavgarh Fort Safari)" required value={packageForm.title} onChange={(e) => setPackageForm({...packageForm, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500" />
                
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Duration (e.g. 3 Days / 2 Nights)" required value={packageForm.duration} onChange={(e) => setPackageForm({...packageForm, duration: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                  <input type="number" placeholder="Price in INR (₹)" required value={packageForm.price_inr} onChange={(e) => setPackageForm({...packageForm, price_inr: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                </div>

                <textarea placeholder="Package Description" rows={3} required value={packageForm.description} onChange={(e) => setPackageForm({...packageForm, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white"></textarea>
                <input type="text" placeholder="Highlights (e.g. 4 Safaris, Resort Stay)" required value={packageForm.highlights} onChange={(e) => setPackageForm({...packageForm, highlights: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                <input type="url" placeholder="Cover Image URL" required value={packageForm.image_url} onChange={(e) => setPackageForm({...packageForm, image_url: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />

                <button type="submit" className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm hover:bg-orange-400 transition-all">
                  Publish Package to Website
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Offline Booking Modal */}
      <AnimatePresence>
        {isOfflineModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-3xl p-6 relative text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-orange-500 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" /> Add Phone / Offline Booking
                </h3>
                <button onClick={() => setIsOfflineModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateOfflineBooking} className="space-y-3 text-xs">
                <input type="text" placeholder="Customer Name" required value={offlineForm.customer_name} onChange={(e) => setOfflineForm({...offlineForm, customer_name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500" />
                <input type="tel" placeholder="Customer Phone (e.g. 9876543210)" required value={offlineForm.customer_phone} onChange={(e) => setOfflineForm({...offlineForm, customer_phone: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                <input type="email" placeholder="Customer Email" required value={offlineForm.customer_email} onChange={(e) => setOfflineForm({...offlineForm, customer_email: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Guests Count</label>
                    <input type="number" min={1} max={12} required value={offlineForm.guests_count} onChange={(e) => setOfflineForm({...offlineForm, guests_count: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Nationality & ID Type</label>
                    <select value={offlineForm.nationality} onChange={(e) => setOfflineForm({...offlineForm, nationality: e.target.value, id_proof_type: e.target.value === "Indian" ? "Aadhaar Card" : "Passport"})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white">
                      <option value="Indian">Indian (Aadhaar)</option>
                      <option value="Non-Indian">Non-Indian (Passport)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Booking Date</label>
                    <input type="date" required value={offlineForm.booking_date} onChange={(e) => setOfflineForm({...offlineForm, booking_date: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Payment Status</label>
                    <select value={offlineForm.payment_status} onChange={(e) => setOfflineForm({...offlineForm, payment_status: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white">
                      <option value="Advance Paid">Advance Paid</option>
                      <option value="Full Price Saved">Full Price Saved</option>
                    </select>
                  </div>
                </div>

                <input type="number" placeholder="Amount Paid in INR (₹)" required value={offlineForm.amount_paid_inr} onChange={(e) => setOfflineForm({...offlineForm, amount_paid_inr: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />

                {/* Upload Aadhaar or Passport */}
                <div className="border border-dashed border-white/20 p-3 rounded-xl text-center space-y-1">
                  <p className="text-zinc-300 font-semibold">Attach {offlineForm.nationality === "Indian" ? "Aadhaar" : "Passport"} ID Copy</p>
                  <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, "id_proof_base64")} className="block w-full text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-orange-500 file:text-black file:font-bold" />
                </div>

                {/* Upload Payment Proof */}
                <div className="border border-dashed border-white/20 p-3 rounded-xl text-center space-y-1">
                  <p className="text-zinc-300 font-semibold">Attach Payment Receipt Screenshot</p>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "payment_proof_base64")} className="block w-full text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-orange-500 file:text-black file:font-bold" />
                </div>

                <button type="submit" className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm hover:bg-orange-400 transition-all">
                  Save Offline Booking to Cloud
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
