"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Key, Phone, Calendar, User, Mail, CheckCircle2, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [authStep, setAuthStep] = useState<"login" | "2fa" | "authenticated">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inputOtp, setInputOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [customReqs, setCustomReqs] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Check existing session
  useEffect(() => {
    const isAuthed = sessionStorage.getItem("admin_authed");
    if (isAuthed === "true") {
      setAuthStep("authenticated");
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const bookingsSnap = await getDocs(collection(db, "bookings"));
      const customSnap = await getDocs(collection(db, "custom_packages"));

      setBookings(bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCustomReqs(customSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  // Step 1: Handle Strict Username & Password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Strict Credentials Check
    if (username === "dinesh_pandey" && password === "PandeyTiger@2026#") {
      setLoading(true);

      // Generate 6-digit random 2FA OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);

      // Trigger OTP dispatch to singhabhaytiwari@gmail.com
      try {
        await fetch("/api/admin/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp: newOtp }),
        });
        setAuthStep("2fa");
      } catch (err) {
        setError("Failed to dispatch 2FA email");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Invalid Admin Username or Password");
    }
  };

  // Step 2: Handle 2FA Verification
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (inputOtp === generatedOtp) {
      sessionStorage.setItem("admin_authed", "true");
      setAuthStep("authenticated");
      fetchData();
    } else {
      setError("Incorrect 2FA Code. Check singhabhaytiwari@gmail.com");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authed");
    setAuthStep("login");
    setUsername("");
    setPassword("");
    setInputOtp("");
  };

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-12">
      {/* 1. Login & 2FA Gatekeepers */}
      {authStep !== "authenticated" && (
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900/60 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl backdrop-blur-2xl space-y-6 text-white">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
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
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 text-sm"
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
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold py-3.5 rounded-xl transition-all text-sm hover:bg-zinc-200 disabled:opacity-50">
                  {loading ? "Authenticating & Dispatching 2FA..." : "Sign In to Admin"}
                </button>
              </form>
            )}

            {authStep === "2fa" && (
              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-300">
                  2FA Verification Code sent to: <strong className="text-white block mt-0.5">singhabhaytiwari@gmail.com</strong>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Enter 6-Digit 2FA Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value)}
                    className="w-full bg-black/60 border border-amber-500/50 text-amber-400 font-mono tracking-widest text-center text-xl rounded-xl p-3.5 focus:outline-none"
                  />
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3.5 rounded-xl transition-all text-sm">
                  Verify 2FA & Unlock Dashboard
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* 2. Authenticated Dashboard View */}
      {authStep === "authenticated" && (
        <div className="space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 2FA Verified Access
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-1">Live Safari Bookings</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-full">
                Owner: <strong>Dinesh Pandey</strong>
              </span>
              <button onClick={handleLogout} className="bg-white/10 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 border border-white/10 px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-all">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>

          {dataLoading ? (
            <div className="text-center py-12 text-zinc-500">Loading Cloud Firestore records...</div>
          ) : (
            <div className="space-y-12">
              {/* Standard Bookings */}
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
        </div>
      )}
    </main>
  );
}
