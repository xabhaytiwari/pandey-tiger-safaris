"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitBooking } from "../../lib/api";
import { Calendar, CheckCircle2, MessageSquare, Phone, CreditCard } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function BookingWizard({ packages = [], cars = [], availability = [] }: any) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    package_id: packages[0]?.id || 1,
    car_id: cars[0]?.id || 1,
    booking_date: availability[0]?.date || "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    guests_count: 2,
  });
  const [submitted, setSubmitted] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Load Razorpay Checkout JS SDK dynamically
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("razorpay-sdk")) {
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitBooking(formData);
    setSubmitted(true);
  };

  const selectedPkg = packages.find((p: any) => p.id === formData.package_id) || { title: "Bandhavgarh Safari", price_inr: 28500 };
  const selectedCar = cars.find((c: any) => c.id === formData.car_id)?.name || "Safari Jeep";

  // Trigger Razorpay Payment Popup
  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_inr: selectedPkg.price_inr || 28500,
          booking_id: formData.customer_name + "_" + Date.now(),
        }),
      });
      const orderData = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_demo",
        amount: orderData.amount,
        currency: "INR",
        name: "Pandey Tiger Safaris",
        description: selectedPkg.title,
        order_id: orderData.order_id,
        handler: function (response: any) {
          setPaymentSuccess(true);
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
        alert("Razorpay payment gateway initialized in demo mode.");
        setPaymentSuccess(true);
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `*NEW SAFARI BOOKING REQUEST*\n\n` +
    `*Guest:* ${formData.customer_name}\n` +
    `*Phone:* ${formData.customer_phone}\n` +
    `*Package:* ${selectedPkg.title}\n` +
    `*Vehicle:* ${selectedCar}\n` +
    `*Date:* ${formData.booking_date}\n` +
    `*Guests:* ${formData.guests_count}`
  );

  const whatsappUrl = `https://wa.me/919425331205?text=${whatsappText}`;

  return (
    <section id="booking" className="py-12 bg-black text-white">
      <div className="max-w-3xl mx-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-center text-white mb-2">Guided Safari Booking</h2>
        <p className="text-zinc-400 text-center text-sm mb-8">Reserve your Bandhavgarh tiger safari in 3 easy steps</p>

        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 text-xs font-semibold uppercase tracking-wider">
          <span className={step >= 1 ? "text-orange-500 font-bold" : "text-zinc-600"}>1. Package & Vehicle</span>
          <span className={step >= 2 ? "text-orange-500 font-bold" : "text-zinc-600"}>2. Pick Date</span>
          <span className={step >= 3 ? "text-orange-500 font-bold" : "text-zinc-600"}>3. Guest Details</span>
        </div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Booking Saved to Cloud!</h3>
              <p className="text-zinc-400 text-sm max-w-md mx-auto">
                Package: <strong>{selectedPkg.title}</strong> (₹{selectedPkg.price_inr?.toLocaleString("en-IN")})
              </p>
            </div>

            {paymentSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-sm font-bold">
                ✓ Online Payment Confirmed via Razorpay!
              </div>
            ) : (
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-8 py-4 rounded-full transition-all text-sm shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
              >
                <CreditCard className="w-5 h-5" />
                {paymentLoading ? "Initializing Gateway..." : `Pay ₹${selectedPkg.price_inr?.toLocaleString("en-IN")} via UPI / Cards`}
              </button>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all text-sm shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" /> Send WhatsApp Alert
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
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Choose Tour Package</label>
                    <select
                      value={formData.package_id}
                      onChange={(e) => setFormData({ ...formData, package_id: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                    >
                      {packages.map((pkg: any) => (
                        <option key={pkg.id} value={pkg.id} className="bg-zinc-900">{pkg.title} — ₹{pkg.price_inr?.toLocaleString("en-IN")}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Choose Transfer Vehicle</label>
                    <select
                      value={formData.car_id}
                      onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                    >
                      {cars.map((car: any) => (
                        <option key={car.id} value={car.id} className="bg-zinc-900">{car.name} ({car.category})</option>
                      ))}
                    </select>
                  </div>

                  <button type="button" onClick={() => setStep(2)} className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-xl transition-all text-sm hover:bg-orange-400">
                    Next: Select Safari Date &rarr;
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Select Available Date</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availability.map((item: any) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setFormData({ ...formData, booking_date: item.date })}
                        className={`p-3 rounded-xl border text-center transition-all text-xs font-medium ${
                          formData.booking_date === item.date
                            ? "bg-orange-500 text-black font-bold border-orange-500 shadow-md"
                            : "bg-black border-white/10 hover:border-white/30 text-zinc-300"
                        }`}
                      >
                        <Calendar className="w-4 h-4 mx-auto mb-1" />
                        {item.date}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="w-1/2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 py-3.5 rounded-xl text-sm font-semibold">Back</button>
                    <button type="button" onClick={() => setStep(3)} disabled={!formData.booking_date} className="w-1/2 bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm disabled:opacity-50">
                      Next: Contact Details &rarr;
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
                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={() => setStep(2)} className="w-1/2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 py-3.5 rounded-xl text-sm font-semibold">Back</button>
                    <button type="submit" className="w-1/2 bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm">Confirm Safari Request</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        )}
      </div>
    </section>
  );
}
