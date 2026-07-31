"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, CheckCircle2, LogOut, Calendar as CalendarIcon, User, Mail, Phone, 
  PlusCircle, Upload, Tag, X, FileText, Package, UserCheck, Star, MapPin, 
  ChevronLeft, ChevronRight, Ban, Trash2, Users, Globe
} from "lucide-react";

export default function AdminDashboard() {
  const [authStep, setAuthStep] = useState<"login" | "2fa" | "authenticated">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inputOtp, setInputOtp] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("s***i@gmail.com");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [customReqs, setCustomReqs] = useState<any[]>([]);
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [driversList, setDriversList] = useState<any[]>([]);
  const [parksList, setParksList] = useState<any[]>([]);
  const [blockedDatesList, setBlockedDatesList] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);

  // Modals & Section Toggles
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isParkModalOpen, setIsParkModalOpen] = useState(false);
  const [isBlockDateModalOpen, setIsBlockDateModalOpen] = useState(false);
  const [showArchivedPackages, setShowArchivedPackages] = useState(false);

  const [blockForm, setBlockForm] = useState({
    date: new Date().toISOString().split("T")[0],
    reason: "Park Maintenance / Holiday"
  });

  const [parkForm, setParkForm] = useState({
    name: "",
    state: "Madhya Pradesh",
    image_url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800"
  });

  const [packageForm, setPackageForm] = useState({
    park_name: "Bandhavgarh National Park",
    title: "",
    duration: "3 Days / 2 Nights",
    hotel_stars: "5-Star Ultra-Luxury Resort",
    price_inr: 28500,
    description: "",
    highlights: "4 Safaris, Luxury Resort Stay, Station Pickup",
    image_url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800"
  });

  const [driverForm, setDriverForm] = useState({
    name: "",
    experience_years: 10,
    rating: 4.9,
    photo_base64: ""
  });

  const [offlineForm, setOfflineForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    guests_count: 2,
    nationality: "Indian",
    id_proof_type: "Aadhaar Card",
    booking_date: new Date().toISOString().split("T")[0],
    safari_slot: "Morning Safari",
    park_name: "Bandhavgarh National Park",
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

  useEffect(() => {
    if (parksList.length > 0 && !packageForm.park_name) {
      setPackageForm(prev => ({ ...prev, park_name: parksList[0].name }));
      setOfflineForm(prev => ({ ...prev, park_name: parksList[0].name }));
    }
  }, [parksList]);

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

    const unsubDrivers = onSnapshot(collection(db, "drivers"), (snapshot) => {
      setDriversList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubParks = onSnapshot(collection(db, "parks"), (snapshot) => {
      setParksList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubBlocked = onSnapshot(collection(db, "blocked_dates"), (snapshot) => {
      setBlockedDatesList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubBookings();
      unsubCustom();
      unsubPackages();
      unsubDrivers();
      unsubParks();
      unsubBlocked();
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
        setMaskedEmail(data.maskedEmail || "s***i@gmail.com");
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

  const handleArchivePackage = async (id: string) => {
    try {
      await setDoc(doc(db, "packages", id), { is_archived: true }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnarchivePackage = async (id: string) => {
    try {
      await setDoc(doc(db, "packages", id), { is_archived: false }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePackagePermanently = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this package?")) {
      try {
        await deleteDoc(doc(db, "packages", id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleBlockDateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "blocked_dates"), {
        ...blockForm,
        createdAt: serverTimestamp(),
      });
      setIsBlockDateModalOpen(false);
    } catch (err: any) {
      alert("Error blocking date: " + err.message);
    }
  };

  const handleUnblockDate = async (id: string) => {
    try {
      await deleteDoc(doc(db, "blocked_dates", id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePark = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "parks"), { ...parkForm, createdAt: serverTimestamp() });
      setIsParkModalOpen(false);
    } catch (err: any) {
      alert("Error creating park: " + err.message);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "packages"), {
        ...packageForm,
        is_archived: false,
        park_name: packageForm.park_name || (parksList[0]?.name || "Bandhavgarh National Park"),
        createdAt: serverTimestamp(),
      });
      setIsPackageModalOpen(false);
    } catch (err: any) {
      alert("Error creating package: " + err.message);
    }
  };

  const handleDriverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDriverForm(prev => ({ ...prev, photo_base64: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "drivers"), {
        name: driverForm.name,
        experience_years: Number(driverForm.experience_years),
        rating: Number(driverForm.rating),
        photo_url: driverForm.photo_base64,
        createdAt: serverTimestamp(),
      });
      setIsDriverModalOpen(false);
    } catch (err: any) {
      alert("Error creating driver: " + err.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setOfflineForm(prev => ({ ...prev, [fieldName]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleCreateOfflineBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bookings"), { ...offlineForm, createdAt: serverTimestamp() });
      setIsOfflineModalOpen(false);
    } catch (err: any) {
      alert("Error creating offline booking: " + err.message);
    }
  };

  const getMonthCalendarDates = () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + calendarMonthOffset);
    startDate.setDate(1);

    const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
    const result = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(startDate.getFullYear(), startDate.getMonth(), day);
      const dateStr = d.toISOString().split("T")[0];
      const count = bookings.filter(b => b.booking_date === dateStr).length;
      const isBlocked = blockedDatesList.some(b => b.date === dateStr);
      result.push({ dateStr, count, isBlocked });
    }
    return result;
  };

  const monthName = new Date(new Date().getFullYear(), new Date().getMonth() + calendarMonthOffset, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  const filteredBookings = selectedDate 
    ? bookings.filter(b => b.booking_date === selectedDate)
    : bookings;

  const activePackages = packagesList.filter(p => !p.is_archived);
  const archivedPackages = packagesList.filter(p => p.is_archived);

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
                  2FA Verification Code dispatched to authorized email: <strong className="text-white block mt-0.5">{maskedEmail}</strong>
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

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setIsBlockDateModalOpen(true)} className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-bold px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5 transition-all">
                <Ban className="w-3.5 h-3.5" /> Block Date
              </button>

              <button onClick={() => setIsParkModalOpen(true)} className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-bold px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" /> + Add Park
              </button>

              <button onClick={() => setIsPackageModalOpen(true)} className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-bold px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-orange-500" /> + Add Package
              </button>

              <button onClick={() => setIsDriverModalOpen(true)} className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-bold px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-orange-500" /> + Add Driver
              </button>

              <button onClick={() => setIsOfflineModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-orange-500/20">
                <PlusCircle className="w-4 h-4" /> Add Offline Booking
              </button>

              <button onClick={() => { sessionStorage.removeItem("admin_authed"); setAuthStep("login"); }} className="bg-zinc-900 border border-white/10 text-zinc-300 hover:text-red-400 px-3.5 py-2 rounded-full text-xs flex items-center gap-1 transition-all">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>

          {/* Bookings & Passenger Inspector */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-500" /> Bookings & Passenger Passports ({filteredBookings.length})
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
                      <p>Park: <strong className="text-white">{b.park_name || "Bandhavgarh"}</strong></p>
                      <p>Slot: <strong className="text-orange-400">{b.safari_slot || "Morning Safari"}</strong></p>
                      <p>Travelers: <strong className="text-white">{b.guests_count || 1} Persons</strong></p>
                      <p>Nationality: <strong className="text-white">{b.nationality || "Indian"}</strong></p>
                      <p className="col-span-2">Payment: <strong className="text-amber-400 uppercase">{b.payment_status || "Advance Paid"}</strong> ({b.amount_paid_inr ? `₹${b.amount_paid_inr.toLocaleString("en-IN")}` : "Prepaid"})</p>
                    </div>

                    {/* PASSENGER DETAILS INSPECTOR */}
                    {Array.isArray(b.passengers) && b.passengers.length > 0 && (
                      <div className="bg-black/60 p-3 rounded-xl space-y-2 border border-white/5">
                        <p className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                          <Users className="w-3 h-3 text-orange-500" /> Passenger Roster:
                        </p>
                        <div className="space-y-1.5">
                          {b.passengers.map((p: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] text-zinc-300 border-b border-white/5 pb-1">
                              <span>#{idx + 1} {p.name || "Guest"} ({p.age} yrs, {p.gender})</span>
                              {p.passport_base64 && (
                                <a href={p.passport_base64} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline flex items-center gap-1 font-semibold">
                                  <FileText className="w-3 h-3" /> Passport Copy
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Primary Aadhaar for Indians */}
                    {b.primary_aadhaar_base64 && (
                      <div className="pt-1 text-[10px]">
                        <a href={b.primary_aadhaar_base64} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline flex items-center gap-1 font-semibold">
                          <Globe className="w-3 h-3" /> Primary Aadhaar Card Proof
                        </a>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1 text-zinc-400">
                      <a href={`tel:${b.customer_phone}`} className="hover:underline text-orange-500 font-semibold flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {b.customer_phone}
                      </a>
                      <span className="text-[10px] text-zinc-500 capitalize">{b.customer_email}</span>
                    </div>
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
