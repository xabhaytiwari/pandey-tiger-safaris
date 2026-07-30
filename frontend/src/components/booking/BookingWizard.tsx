"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitBooking, fetchFromAPI } from "../../lib/api";
import { auth, onAuthStateChanged } from "../../lib/firebase";
import AuthModal from "../auth/AuthModal";
import { 
  Calendar as CalendarIcon, CheckCircle2, MessageSquare, Phone, CreditCard, ShieldCheck, 
  Users, Upload, Globe, User, MapPin, Info, Lock, LogIn, Sun, Sunset, Clock, AlertTriangle
} from "lucide-react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function BookingWizard({ packages = [], cars = [], initialPark }: any) {
  const [step, setStep] = useState(1);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [parks, setParks] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedParkName, setSelectedParkName] = useState<string>(initialPark || "Bandhavgarh National Park");

  const [formData, setFormData] = useState({
    park_name: initialPark || "Bandhavgarh National Park",
    package_id: packages[0]?.id || "",
    car_id: cars[0]?.id || "",
    booking_date: new Date().toISOString().split("T")[0],
    safari_slot: "Morning Safari",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    guests_count: 2,
    nationality: "Indian",
    id_proof_type: "Aadhaar Card",
    id_proof_base64: "",
    payment_type: "Advance Paid",
    agreed_to_terms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (initialPark) {
      setSelectedParkName(initialPark);
      setFormData((prev) => ({ ...prev, park_name: initialPark }));
    }
  }, [initialPark]);

  useEffect(() => {
    async function loadInitialData() {
      const [pkData, bdData] = await Promise.all([
        fetchFromAPI("/parks"),
        fetchFromAPI("/blocked_dates"),
      ]);
      setParks(pkData || []);
      if (Array.isArray(bdData)) {
        setBlockedDates(bdData.map((b: any) => b.date));
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setFormData((prev) => ({
          ...prev,
          customer_name: user.displayName || prev.customer_name,
          customer_email: user.email || prev.customer_email,
        }));
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("razorpay-sdk")) {
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const filteredPackages = packages.filter((p: any) => !p.park_name || p.park_name === selectedParkName);
  const selectedPkg = filteredPackages.find((p: any) => p.id === formData.package_id) || filteredPackages[0] || { title: "National Park Safari", price_inr: 28500 };
  
  const selectedCarObj = cars.find((c: any) => c.id === formData.car_id) || cars[0] || { name: "Safari Jeep", capacity: 6 };
  const selectedCarName = selectedCarObj.name;
  const singleCarCap = selectedCarObj.capacity || 6;

  const requiredVehicleCount = singleCarCap > 0 ? Math.ceil(formData.guests_count / singleCarCap) : 1;
  const suitableCars = cars.filter((c: any) => c.capacity === 0 || c.capacity >= formData.guests_count);

  const foreignerSurcharge = formData.nationality === "Non-Indian" ? formData.guests_count * 4500 : 0;
  const totalPriceINR = (selectedPkg.price_inr || 28500) + foreignerSurcharge;

  const advanceAmount = Math.round(totalPriceINR * 0.25);
  const payableAmount = formData.payment_type === "Advance Paid" ? advanceAmount : totalPriceINR;
  const balanceDueINR = totalPriceINR - payableAmount;

  const get365AvailableDates = () => {
    const list = [];
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];

      if (!blockedDates.includes(dateStr)) {
        const formattedLabel = d.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric"
        });
        list.push({ dateStr, formattedLabel });
      }
    }
    return list;
  };

  const availableDatesList = get365AvailableDates();

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, id_proof_base64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmAndPay = async () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!formData.agreed_to_terms) {
      alert("Please agree to the MP Forest Department non-refundable permit rules to proceed.");
      return;
    }

    setPaymentLoading(true);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_inr: payableAmount,
          booking_id: formData.customer_name + "_" + Date.now(),
        }),
      });
      const orderData = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_demo",
        amount: orderData.amount,
        currency: "INR",
        name: "Pandey Tiger Safaris",
        description: `${selectedPkg.title} (${formData.payment_type})`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          await submitBooking({
            ...formData,
            park_name: selectedParkName,
            package_title: selectedPkg.title,
            car_name: `${requiredVehicleCount}x ${selectedCarName}`,
            vehicle_count: requiredVehicleCount,
            total_price_inr: totalPriceINR,
            payment_status: formData.payment_type,
            amount_paid_inr: payableAmount,
            balance_due_inr: balanceDueINR,
            user_uid: currentUser.uid,
            razorpay_payment_id: response.razorpay_payment_id || "demo_pay_id",
          });
          setPaymentSuccess(true);
          setSubmitted(true);
        },
        prefill: {
          name: formData.customer_name,
          email: formData.customer_email,
          contact: formData.customer_phone,
        },
        theme: {
          color: "#f59e0b",
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await submitBooking({
          ...formData,
          park_name: selectedParkName,
          package_title: selectedPkg.title,
          car_name: `${requiredVehicleCount}x ${selectedCarName}`,
          vehicle_count: requiredVehicleCount,
          total_price_inr: totalPriceINR,
          payment_status: formData.payment_type,
          amount_paid_inr: payableAmount,
          balance_due_inr: balanceDueINR,
          user_uid: currentUser.uid,
          razorpay_payment_id: "demo_pay_id",
        });
        setPaymentSuccess(true);
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `*NEW PREPAID SAFARI BOOKING*\n\n` +
    `*Park:* ${selectedParkName}\n` +
    `*Slot:* ${formData.safari_slot}\n` +
    `*Guest:* ${formData.customer_name}\n` +
    `*Phone:* ${formData.customer_phone}\n` +
    `*Travelers:* ${formData.guests_count} Persons\n` +
    `*Nationality:* ${formData.nationality} (${formData.id_proof_type})\n` +
    `*Package:* ${selectedPkg.title}\n` +
    `*Vehicle:* ${requiredVehicleCount}x ${selectedCarName}\n` +
    `*Date:* ${formData.booking_date}\n` +
    `*Paid:* ₹${payableAmount} | *Balance Due:* ₹${balanceDueINR}`
  );

  const whatsappUrl = `https://wa.me/919425331205?text=${whatsappText}`;

  return (
    <section id="booking" className="py-12 bg-black text-white">
      <div className="max-w-3xl mx-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-center text-white mb-2">Prepaid Safari Booking</h2>
        <p className="text-zinc-400 text-center text-sm mb-8">Official park permits reserved strictly upon ID verification & prepayment</p>

        {!currentUser && (
          <div className="bg-orange-500/10 border border-orange-500/40 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white text-sm">Sign In Required to Reserve Permits</h4>
                <p className="text-zinc-400 text-xs">Please sign in with Google or Email before submitting your booking.</p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-5 py-2.5 rounded-full text-xs transition-all shadow-lg shadow-orange-500/20 flex items-center gap-1.5 whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" /> Sign In to Continue
            </button>
          </div>
        )}

        {currentUser && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-2xl text-xs text-emerald-400 flex items-center gap-2 mb-8">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Signed in as <strong>{currentUser.displayName || currentUser.email}</strong>
          </div>
        )}

        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 text-xs font-semibold uppercase tracking-wider">
          <span className={step >= 1 ? "text-orange-500 font-bold" : "text-zinc-600"}>1. Park & Vehicle</span>
          <span className={step >= 2 ? "text-orange-500 font-bold" : "text-zinc-600"}>2. Date & Plan</span>
          <span className={step >= 3 ? "text-orange-500 font-bold" : "text-zinc-600"}>3. ID Proof & Pay</span>
        </div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Booking Confirmed & Paid!</h3>
              <p className="text-zinc-400 text-sm max-w-md mx-auto">
                Park: <strong>{selectedParkName}</strong> | Vehicles: <strong>{requiredVehicleCount}x {selectedCarName}</strong>
              </p>
              <div className="bg-zinc-900 p-4 rounded-2xl border border-white/10 max-w-md mx-auto text-xs space-y-1">
                <p className="text-emerald-400 font-bold">Amount Paid Now: ₹{payableAmount.toLocaleString("en-IN")} ({formData.payment_type})</p>
                {balanceDueINR > 0 && (
                  <p className="text-amber-400 font-extrabold">Balance Due Upon Arrival: ₹{balanceDueINR.toLocaleString("en-IN")}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all text-sm shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" /> Send WhatsApp Confirmation
              </a>
              <a
                href="tel:9425331205"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all text-sm border border-white/10"
              >
                <Phone className="w-4 h-4 text-orange-500" /> Call +91 9425331205
              </a>
            </div>
          </motion.div>
        ) : (
          <div>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-500" /> Select National Park
                    </label>
                    <select
                      value={selectedParkName}
                      onChange={(e) => {
                        setSelectedParkName(e.target.value);
                        setFormData({ ...formData, park_name: e.target.value });
                      }}
                      className="w-full bg-black border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-sm font-bold"
                    >
                      {parks.map((park: any) => (
                        <option key={park.id} value={park.name} className="bg-zinc-900">{park.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-orange-500" /> Choose Safari Timing Slot
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, safari_slot: "Morning Safari" })}
                        className={`p-3.5 rounded-xl border text-left transition-all text-xs font-bold flex flex-col justify-between ${
                          formData.safari_slot === "Morning Safari"
                            ? "bg-orange-500 text-black border-orange-500"
                            : "bg-black border-white/15 text-zinc-300"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 mb-1"><Sun className="w-4 h-4" /> Morning Safari</span>
                        <span className="text-[10px] opacity-80">06:00 AM – 10:00 AM</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, safari_slot: "Evening Safari" })}
                        className={`p-3.5 rounded-xl border text-left transition-all text-xs font-bold flex flex-col justify-between ${
                          formData.safari_slot === "Evening Safari"
                            ? "bg-orange-500 text-black border-orange-500"
                            : "bg-black border-white/15 text-zinc-300"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 mb-1"><Sunset className="w-4 h-4" /> Evening Safari</span>
                        <span className="text-[10px] opacity-80">03:00 PM – 06:30 PM</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, safari_slot: "Full Day / Both Safaris" })}
                        className={`p-3.5 rounded-xl border text-left transition-all text-xs font-bold flex flex-col justify-between ${
                          formData.safari_slot === "Full Day / Both Safaris"
                            ? "bg-orange-500 text-black border-orange-500"
                            : "bg-black border-white/15 text-zinc-300"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 mb-1"><Clock className="w-4 h-4" /> Full Day / Both</span>
                        <span className="text-[10px] opacity-80">Morning + Evening</span>
                      </button>
                    </div>
                  </div>

                  {filteredPackages.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Choose Tour Package ({selectedParkName})</label>
                      <select
                        value={formData.package_id}
                        onChange={(e) => setFormData({ ...formData, package_id: e.target.value })}
                        className="w-full bg-black border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                      >
                        {filteredPackages.map((pkg: any) => (
                          <option key={pkg.id} value={pkg.id} className="bg-zinc-900">{pkg.title} — ₹{pkg.price_inr?.toLocaleString("en-IN")}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-orange-500" /> Number of Travelers (Persons)
                    </label>
                    <select
                      value={formData.guests_count}
                      onChange={(e) => setFormData({ ...formData, guests_count: Number(e.target.value) })}
                      className="w-full bg-black border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num} className="bg-zinc-900">{num} {num === 1 ? "Person" : "Persons"}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Choose Transfer Vehicle Model</label>
                    <select
                      value={formData.car_id}
                      onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                    >
                      {(suitableCars.length > 0 ? suitableCars : cars).map((car: any) => (
                        <option key={car.id} value={car.id} className="bg-zinc-900">{car.name} ({car.category})</option>
                      ))}
                    </select>

                    {requiredVehicleCount > 1 ? (
                      <div className="mt-2 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/30 p-3 rounded-xl flex items-center gap-2 font-bold">
                        <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>{formData.guests_count} Travelers require {requiredVehicleCount}x {selectedCarName}s to comfortably accommodate your party.</span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-medium">
                        <Info className="w-3.5 h-3.5" /> * Vehicle models shown in fleet are representative
                      </p>
                    )}
                  </div>

                  <button type="button" onClick={() => setStep(2)} className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-xl transition-all text-sm hover:bg-orange-400">
                    Next: Date Dropdown & Prepayment &rarr;
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-orange-500" /> Choose Available Date (Scrollable 365 Days)
                    </label>
                    <select
                      value={formData.booking_date}
                      onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                      className="w-full bg-black border border-orange-500/50 rounded-xl p-4 text-orange-400 font-extrabold text-sm focus:outline-none focus:border-orange-500 cursor-pointer shadow-lg"
                    >
                      {availableDatesList.map((item) => (
                        <option key={item.dateStr} value={item.dateStr} className="bg-zinc-900 text-white font-medium py-2">
                          {item.formattedLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-3">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Select Prepayment Plan</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, payment_type: "Advance Paid" })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.payment_type === "Advance Paid"
                            ? "bg-orange-500/10 border-orange-500 text-white"
                            : "bg-black border-white/10 text-zinc-400"
                        }`}
                      >
                        <p className="font-bold text-sm text-white">25% Advance Lock</p>
                        <p className="text-xs text-orange-400 font-extrabold mt-1">Pay Now: ₹{advanceAmount.toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-zinc-500 mt-1">Due on Arrival: ₹{balanceDueINR.toLocaleString("en-IN")}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, payment_type: "Full Price Saved" })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.payment_type === "Full Price Saved"
                            ? "bg-orange-500/10 border-orange-500 text-white"
                            : "bg-black border-white/10 text-zinc-400"
                        }`}
                      >
                        <p className="font-bold text-sm text-white">100% Full Payment</p>
                        <p className="text-xs text-orange-400 font-extrabold mt-1">Pay Now: ₹{totalPriceINR.toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-emerald-400 mt-1">Zero Balance Due</p>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="w-1/2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 py-3.5 rounded-xl text-sm font-semibold">Back</button>
                    <button type="button" onClick={() => setStep(3)} disabled={!formData.booking_date} className="w-1/2 bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm disabled:opacity-50">
                      Next: ID Proof & Terms &rarr;
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g. 9876543210)"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                  />

                  <div className="pt-2 border-t border-white/10 space-y-3">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Nationality & Forest Permit ID Proof</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, nationality: "Indian", id_proof_type: "Aadhaar Card" })}
                        className={`p-3 rounded-xl border text-center transition-all text-xs font-bold flex items-center justify-center gap-1.5 ${
                          formData.nationality === "Indian"
                            ? "bg-orange-500 text-black border-orange-500"
                            : "bg-black border-white/10 text-zinc-400"
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5" /> Indian (Aadhaar Card)
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, nationality: "Non-Indian", id_proof_type: "Passport" })}
                        className={`p-3 rounded-xl border text-center transition-all text-xs font-bold flex items-center justify-center gap-1.5 ${
                          formData.nationality === "Non-Indian"
                            ? "bg-orange-500 text-black border-orange-500"
                            : "bg-black border-white/10 text-zinc-400"
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5" /> Non-Indian (Passport)
                      </button>
                    </div>

                    {formData.nationality === "Non-Indian" && (
                      <p className="text-[11px] text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                        * Foreign national permit surcharge of ₹4,500/person included as per MP Forest Dept regulations.
                      </p>
                    )}

                    <div className="border border-dashed border-white/20 p-4 rounded-xl text-center space-y-2">
                      <Upload className="w-6 h-6 text-orange-500 mx-auto" />
                      <p className="text-zinc-300 text-xs font-semibold">
                        Upload {formData.nationality === "Indian" ? "Aadhaar Card" : "Passport"} Copy
                      </p>
                      <p className="text-[10px] text-zinc-500">Required by Forest Department for Gate Entry Permits</p>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        required 
                        onChange={handleIdUpload} 
                        className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-orange-500 file:text-black file:font-bold hover:file:bg-orange-400 cursor-pointer" 
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-start gap-3 bg-zinc-900/60 p-3.5 rounded-xl border border-white/10">
                    <input
                      type="checkbox"
                      id="permit_terms"
                      checked={formData.agreed_to_terms}
                      onChange={(e) => setFormData({ ...formData, agreed_to_terms: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded text-orange-500 focus:ring-orange-500 bg-black border-white/20"
                    />
                    <label htmlFor="permit_terms" className="text-[11px] text-zinc-300 leading-snug cursor-pointer">
                      I agree to <strong>MP Forest Department Rules</strong>. I understand that government safari permits are strictly non-refundable once issued.
                    </label>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-white flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-orange-500" /> Payment Summary</p>
                    <p className="text-zinc-300">Park: {selectedParkName} | Slot: {formData.safari_slot}</p>
                    <p className="text-zinc-300">Vehicles: {requiredVehicleCount}x {selectedCarName} ({formData.guests_count} Guests)</p>
                    <p className="text-orange-400 font-bold">Payable Now: ₹{payableAmount.toLocaleString("en-IN")} ({formData.payment_type})</p>
                    {balanceDueINR > 0 && <p className="text-amber-400 font-semibold">Balance Due on Arrival: ₹{balanceDueINR.toLocaleString("en-IN")}</p>}
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={() => setStep(2)} className="w-1/2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 py-3.5 rounded-xl text-sm font-semibold">Back</button>

                    {!currentUser ? (
                      <button
                        type="button"
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-1/2 bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-orange-400"
                      >
                        <LogIn className="w-4 h-4" /> Sign In to Pay ₹{payableAmount.toLocaleString("en-IN")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConfirmAndPay}
                        disabled={paymentLoading || !formData.customer_name || !formData.customer_phone || !formData.id_proof_base64 || !formData.agreed_to_terms}
                        className="w-1/2 bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-orange-400"
                      >
                        <CreditCard className="w-4 h-4" />
                        {paymentLoading ? "Connecting Gateway..." : `Pay ₹${payableAmount.toLocaleString("en-IN")}`}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={(u: any) => setCurrentUser(u)} />
    </section>
  );
}
