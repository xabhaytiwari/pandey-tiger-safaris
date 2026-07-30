"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, CheckCircle2, LogOut, Calendar as CalendarIcon, User, Mail, Phone, 
  PlusCircle, Upload, Tag, X, FileText, Package, UserCheck, Star, MapPin, 
  ChevronLeft, ChevronRight, Ban, Trash2, Archive, RotateCcw, FolderArchive, AlertCircle, Car
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
  const [carsList, setCarsList] = useState<any[]>([]);
  const [blockedDatesList, setBlockedDatesList] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);

  // Modals & Section Toggles
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isParkModalOpen, setIsParkModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
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

  // Vehicle Form State with Image File Upload
  const [vehicleForm, setVehicleForm] = useState({
    name: "",
    category: "Premium SUV Transport",
    capacity: 6,
    description: "",
    photo_base64: ""
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
    balance_due_inr: 21375,
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

    const unsubCars = onSnapshot(collection(db, "cars"), (snapshot) => {
      setCarsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      unsubCars();
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

  const handleVehiclePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setVehicleForm(prev => ({ ...prev, photo_base64: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "cars"), {
        name: vehicleForm.name,
        category: vehicleForm.category,
        capacity: Number(vehicleForm.capacity),
        description: vehicleForm.description,
        image_url: vehicleForm.photo_base64,
        is_representative: false,
        createdAt: serverTimestamp(),
      });
      setIsVehicleModalOpen(false);
      setVehicleForm({
        name: "",
        category: "Premium SUV Transport",
        capacity: 6,
        description: "",
        photo_base64: ""
      });
    } catch (err: any) {
      alert("Error adding vehicle: " + err.message);
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
              <h2 className="text-2xl font-bold">Pandey Tiger Safaris Owner Portal</h2>
              <p className="text-zinc-400 text-xs">Restricted Access Area</p>
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

              <button onClick={() => setIsVehicleModalOpen(true)} className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-bold px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-orange-500" /> + Add Vehicle
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

          {/* 365-Day Calendar */}
          <section className="bg-zinc-950 border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-orange-500" /> 365-Day Calendar ({monthName})
                </h2>
                <p className="text-xs text-zinc-400">Click a date to filter bookings</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-xl p-1">
                  <button onClick={() => setCalendarMonthOffset(prev => Math.max(0, prev - 1))} disabled={calendarMonthOffset === 0} className="p-1 text-white hover:text-orange-400 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-bold text-orange-400 px-2">{monthName}</span>
                  <button onClick={() => setCalendarMonthOffset(prev => Math.min(11, prev + 1))} disabled={calendarMonthOffset === 11} className="p-1 text-white hover:text-orange-400 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-2 max-h-72 overflow-y-auto">
              {getMonthCalendarDates().map(({ dateStr, count, isBlocked }) => {
                const isSelected = selectedDate === dateStr;
                let colorStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
                if (count === 1) colorStyle = "bg-amber-500/20 border-amber-500/50 text-amber-300";
                if (count >= 2) colorStyle = "bg-rose-500/20 border-rose-500/50 text-rose-300";
                if (isBlocked) colorStyle = "bg-red-500/20 border-red-500/60 text-red-400 line-through";

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`p-3 rounded-2xl border text-center transition-all ${colorStyle} ${
                      isSelected ? "ring-2 ring-white scale-105 shadow-xl" : "hover:opacity-80"
                    }`}
                  >
                    <p className="text-[10px] uppercase font-mono tracking-wider">{dateStr}</p>
                    <p className="text-sm font-extrabold mt-0.5">{isBlocked ? "Blocked" : `${count} Booked`}</p>
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="pt-2 flex justify-between items-center text-xs text-orange-400 font-semibold border-t border-white/5">
                <span>Filtering for: <strong>{selectedDate}</strong></span>
                <button onClick={() => setSelectedDate(null)} className="flex items-center gap-1 hover:underline"><X className="w-3.5 h-3.5" /> Clear Filter</button>
              </div>
            )}
          </section>

          {/* Active Vehicles List */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-orange-500" /> Active Fleet Vehicles ({carsList.length})
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {carsList.map((c) => (
                <div key={c.id} className="bg-zinc-950 border border-white/10 rounded-2xl p-4 flex gap-4 text-xs items-center">
                  <img src={c.image_url} alt={c.name} className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{c.name}</h4>
                    <p className="text-orange-400 font-bold">{c.category}</p>
                    <p className="text-zinc-400">Capacity: {c.capacity || "Custom"} Persons</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Published Tour Packages */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" /> Tour Packages ({activePackages.length} Active)
              </h2>

              {archivedPackages.length > 0 && (
                <button 
                  onClick={() => setShowArchivedPackages(!showArchivedPackages)}
                  className="text-xs bg-zinc-900 border border-white/10 hover:border-amber-500/50 px-3 py-1.5 rounded-full text-amber-400 font-semibold flex items-center gap-1.5"
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  {showArchivedPackages ? "Hide Archived Packages" : `View Archived Packages (${archivedPackages.length})`}
                </button>
              )}
            </div>

            {activePackages.length === 0 ? (
              <p className="text-xs text-zinc-500 italic bg-zinc-950 p-6 rounded-2xl border border-white/5 text-center">No active packages published yet. Click &quot;+ Add Package&quot; to publish one.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {activePackages.map((p) => (
                  <div key={p.id} className="bg-zinc-950 border border-white/10 rounded-2xl p-4 flex gap-4 text-xs justify-between items-start">
                    <div className="flex gap-4">
                      <img src={p.image_url} alt={p.title} className="w-24 h-24 object-cover rounded-xl" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-orange-400 font-bold uppercase">{p.park_name || "Bandhavgarh"}</span>
                          <span className="text-[10px] text-amber-400 font-bold border border-amber-500/30 px-2 py-0.5 rounded-full">{p.hotel_stars || "5-Star Resort"}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm">{p.title}</h4>
                        <p className="text-orange-400 font-extrabold">₹{p.price_inr?.toLocaleString("en-IN")} • {p.duration}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleArchivePackage(p.id)}
                      className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all"
                    >
                      <Archive className="w-3.5 h-3.5" /> Archive
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showArchivedPackages && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-4 space-y-3 border-t border-white/10">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <FolderArchive className="w-4 h-4" /> Archived Packages ({archivedPackages.length})
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {archivedPackages.map((p) => (
                    <div key={p.id} className="bg-zinc-950/80 border border-amber-500/20 rounded-2xl p-4 flex gap-4 text-xs justify-between items-start opacity-85">
                      <div className="flex gap-4">
                        <img src={p.image_url} alt={p.title} className="w-20 h-20 object-cover rounded-xl grayscale" />
                        <div className="space-y-1">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase">{p.park_name || "Bandhavgarh"} (Archived)</span>
                          <h4 className="font-bold text-zinc-300 text-sm">{p.title}</h4>
                          <p className="text-zinc-400 font-extrabold">₹{p.price_inr?.toLocaleString("en-IN")} • {p.duration}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <button 
                          onClick={() => handleUnarchivePackage(p.id)}
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Restore
                        </button>
                        <button 
                          onClick={() => handleDeletePackagePermanently(p.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </section>

          {/* Bookings List */}
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
                      <p>Park: <strong className="text-white">{b.park_name || "Bandhavgarh"}</strong></p>
                      <p>Slot: <strong className="text-orange-400">{b.safari_slot || "Morning Safari"}</strong></p>
                      <p>Travelers: <strong className="text-white">{b.guests_count || 2} Persons</strong></p>
                      <p>Vehicle: <strong className="text-zinc-200">{b.car_name || b.car_id}</strong></p>
                      <p className="col-span-2">Payment: <strong className="text-amber-400 uppercase">{b.payment_status || "Advance Paid"}</strong> ({b.amount_paid_inr ? `₹${b.amount_paid_inr.toLocaleString("en-IN")}` : "Prepaid"})</p>
                      {b.balance_due_inr > 0 && (
                        <p className="col-span-2 text-amber-400 font-extrabold flex items-center gap-1 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                          <AlertCircle className="w-3.5 h-3.5" /> Collect Balance on Arrival at HQ: ₹{b.balance_due_inr.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-1 text-zinc-400">
                      <a href={`tel:${b.customer_phone}`} className="hover:underline text-orange-500 font-semibold flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {b.customer_phone}
                      </a>
                      <span className="text-[10px] text-zinc-500 capitalize">{b.customer_email}</span>
                    </div>

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

      {/* Add Vehicle Modal with Photo Upload */}
      <AnimatePresence>
        {isVehicleModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-3xl p-6 relative text-white shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-orange-500 flex items-center gap-2">
                  <Car className="w-5 h-5" /> Add New Fleet Vehicle
                </h3>
                <button onClick={() => setIsVehicleModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateVehicle} className="space-y-3 text-xs">
                <input type="text" placeholder="Vehicle Name (e.g. Mahindra Thar 4x4)" required value={vehicleForm.name} onChange={(e) => setVehicleForm({...vehicleForm, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500" />
                
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Category (e.g. Premium Safari 4x4)" required value={vehicleForm.category} onChange={(e) => setVehicleForm({...vehicleForm, category: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                  <input type="number" placeholder="Seating Capacity (e.g. 6)" required value={vehicleForm.capacity} onChange={(e) => setVehicleForm({...vehicleForm, capacity: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                </div>

                <textarea placeholder="Vehicle Description" rows={3} required value={vehicleForm.description} onChange={(e) => setVehicleForm({...vehicleForm, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white"></textarea>

                <div className="border border-dashed border-white/20 p-4 rounded-xl text-center space-y-2">
                  <Upload className="w-6 h-6 text-orange-500 mx-auto" />
                  <p className="text-zinc-300 font-semibold">Upload Vehicle Photo</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    onChange={handleVehiclePhotoUpload} 
                    className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-orange-500 file:text-black file:font-bold hover:file:bg-orange-400 cursor-pointer" 
                  />
                  {vehicleForm.photo_base64 && (
                    <img src={vehicleForm.photo_base64} alt="Vehicle Preview" className="w-32 h-20 object-cover mx-auto rounded-xl border border-orange-500/50 mt-2" />
                  )}
                </div>

                <button type="submit" disabled={!vehicleForm.photo_base64} className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm hover:bg-orange-400 transition-all disabled:opacity-50">
                  Save Vehicle to Fleet
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Tour Package Modal */}
      <AnimatePresence>
        {isPackageModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-3xl p-6 relative text-white shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-orange-500 flex items-center gap-2">
                  <Package className="w-5 h-5" /> Publish Tour Package
                </h3>
                <button onClick={() => setIsPackageModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Select National Park</label>
                  <select 
                    value={packageForm.park_name} 
                    onChange={(e) => setPackageForm({...packageForm, park_name: e.target.value})} 
                    className="w-full bg-black border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500 font-bold"
                  >
                    {parksList.length === 0 ? (
                      <option value="Bandhavgarh National Park" className="bg-zinc-900">Bandhavgarh National Park</option>
                    ) : (
                      parksList.map(p => (
                        <option key={p.id} value={p.name} className="bg-zinc-900">{p.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <input type="text" placeholder="Package Title" required value={packageForm.title} onChange={(e) => setPackageForm({...packageForm, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500" />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Duration</label>
                    <input type="text" placeholder="e.g. 3 Days / 2 Nights" required value={packageForm.duration} onChange={(e) => setPackageForm({...packageForm, duration: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Hotel Star Rating</label>
                    <select value={packageForm.hotel_stars} onChange={(e) => setPackageForm({...packageForm, hotel_stars: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white">
                      <option value="3-Star Comfort Resort">3-Star Comfort Resort</option>
                      <option value="4-Star Luxury Wildlife Lodge">4-Star Luxury Wildlife Lodge</option>
                      <option value="5-Star Ultra-Luxury Resort">5-Star Ultra-Luxury Resort</option>
                    </select>
                  </div>
                </div>

                <input type="number" placeholder="Price in INR (₹)" required value={packageForm.price_inr} onChange={(e) => setPackageForm({...packageForm, price_inr: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                <textarea placeholder="Package Description" rows={3} required value={packageForm.description} onChange={(e) => setPackageForm({...packageForm, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white"></textarea>
                <input type="text" placeholder="Highlights" required value={packageForm.highlights} onChange={(e) => setPackageForm({...packageForm, highlights: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                <input type="url" placeholder="Cover Image URL" required value={packageForm.image_url} onChange={(e) => setPackageForm({...packageForm, image_url: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />

                <button type="submit" className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm hover:bg-orange-400 transition-all">
                  Publish Package to Cloud
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add National Park Modal */}
      <AnimatePresence>
        {isParkModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-950 border border-white/10 w-full max-w-md rounded-3xl p-6 relative text-white shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-orange-500 flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Add National Park
                </h3>
                <button onClick={() => setIsParkModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreatePark} className="space-y-3 text-xs">
                <input type="text" placeholder="Park Name (e.g. Satpura National Park)" required value={parkForm.name} onChange={(e) => setParkForm({...parkForm, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500" />
                <input type="text" placeholder="State (e.g. Madhya Pradesh)" required value={parkForm.state} onChange={(e) => setParkForm({...parkForm, state: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                <input type="url" placeholder="Park Image URL" required value={parkForm.image_url} onChange={(e) => setParkForm({...parkForm, image_url: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />

                <button type="submit" className="w-full bg-orange-500 text-black font-extrabold py-3 rounded-xl text-sm hover:bg-orange-400 transition-all">
                  Save National Park
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Driver Modal */}
      <AnimatePresence>
        {isDriverModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-3xl p-6 relative text-white shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-orange-500 flex items-center gap-2">
                  <UserCheck className="w-5 h-5" /> Register Safari Driver
                </h3>
                <button onClick={() => setIsDriverModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateDriver} className="space-y-3 text-xs">
                <input type="text" placeholder="Driver Full Name" required value={driverForm.name} onChange={(e) => setDriverForm({...driverForm, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500" />
                
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Experience Years" required value={driverForm.experience_years} onChange={(e) => setDriverForm({...driverForm, experience_years: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                  <input type="number" step="0.1" max="5.0" placeholder="Rating" required value={driverForm.rating} onChange={(e) => setDriverForm({...driverForm, rating: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                </div>

                <div className="border border-dashed border-white/20 p-4 rounded-xl text-center space-y-2">
                  <Upload className="w-6 h-6 text-orange-500 mx-auto" />
                  <p className="text-zinc-300 font-semibold">Upload Driver Photo</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    onChange={handleDriverPhotoUpload} 
                    className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-orange-500 file:text-black file:font-bold hover:file:bg-orange-400 cursor-pointer" 
                  />
                  {driverForm.photo_base64 && (
                    <img src={driverForm.photo_base64} alt="Driver Preview" className="w-20 h-20 object-cover mx-auto rounded-full border border-orange-500/50 mt-2" />
                  )}
                </div>

                <button type="submit" disabled={!driverForm.photo_base64} className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm hover:bg-orange-400 transition-all disabled:opacity-50">
                  Register Driver
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Block Date Modal */}
      <AnimatePresence>
        {isBlockDateModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-950 border border-red-500/30 w-full max-w-md rounded-3xl p-6 relative text-white shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                  <Ban className="w-5 h-5" /> Block / Exclude Safari Date
                </h3>
                <button onClick={() => setIsBlockDateModalOpen(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleBlockDateSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Date to Block</label>
                  <input type="date" required value={blockForm.date} onChange={(e) => setBlockForm({...blockForm, date: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Reason for Exclusion</label>
                  <input type="text" placeholder="e.g. Park Maintenance / Holiday / Private Group" required value={blockForm.reason} onChange={(e) => setBlockForm({...blockForm, reason: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                </div>

                <button type="submit" className="w-full bg-red-500 text-white font-extrabold py-3.5 rounded-xl text-sm hover:bg-red-600 transition-all">
                  Exclude Date from Booking Dropdown
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
                <input type="tel" placeholder="Customer Phone" required value={offlineForm.customer_phone} onChange={(e) => setOfflineForm({...offlineForm, customer_phone: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                <input type="email" placeholder="Customer Email" required value={offlineForm.customer_email} onChange={(e) => setOfflineForm({...offlineForm, customer_email: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">National Park</label>
                    <select value={offlineForm.park_name} onChange={(e) => setOfflineForm({...offlineForm, park_name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white">
                      {parksList.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Safari Slot</label>
                    <select value={offlineForm.safari_slot} onChange={(e) => setOfflineForm({...offlineForm, safari_slot: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white">
                      <option value="Morning Safari">Morning Safari</option>
                      <option value="Evening Safari">Evening Safari</option>
                      <option value="Full Day / Both Safaris">Full Day / Both</option>
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

                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Amount Paid in INR (₹)" required value={offlineForm.amount_paid_inr} onChange={(e) => setOfflineForm({...offlineForm, amount_paid_inr: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                  <input type="number" placeholder="Balance Due (₹)" required value={offlineForm.balance_due_inr} onChange={(e) => setOfflineForm({...offlineForm, balance_due_inr: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white" />
                </div>

                <div className="border border-dashed border-white/20 p-3 rounded-xl text-center space-y-1">
                  <p className="text-zinc-300 font-semibold">Attach ID Copy</p>
                  <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, "id_proof_base64")} className="block w-full text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-orange-500 file:text-black file:font-bold" />
                </div>

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
