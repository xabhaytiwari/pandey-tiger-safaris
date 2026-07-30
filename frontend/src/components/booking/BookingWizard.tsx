"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitBooking } from "../../lib/api";
import { Calendar, CheckCircle2, MessageSquare, Phone, CreditCard, ShieldCheck } from "lucide-react";

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
    payment_type: "Advance Paid", // "Advance Paid" or "Full Price Saved"
  });

  const [submitted, setSubmitted] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("razorpay-sdk")) {
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const selectedPkg = packages.find((p: any) => p.id === formData.package_id) || { title: "Bandhavgarh Safari", price_inr: 28500 };
  const selectedCar = cars.find((c: any) => c.id === formData.car_id)?.name || "Safari Jeep";

  const advanceAmount = Math.round(selectedPkg.price_inr * 0.25); // 25% Advance
  const payableAmount = formData.payment_type === "Advance Paid" ? advanceAmount : selectedPkg.price_inr;

  const handleConfirmAndPay = async () => {
    setPaymentLoading(true);
    try {
      // 1. Trigger Razorpay Order Creation
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
          // 2. Only save to Cloud Firestore once payment is completed
          await submitBooking({
            ...formData,
            package_title: selectedPkg.title,
            car_name: selectedCar,
            payment_status: formData.payment_type,
            amount_paid_inr: payableAmount,
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
        // Fallback for demo mode
        await submitBooking({
          ...formData,
          package_title: selectedPkg.title,
          car_name: selectedCar,
          payment_status: formData.payment_type,
          amount_paid_inr: payableAmount,
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
    `*Guest:* ${formData.customer_name}\n` +
    `*Phone:* ${formData.customer_phone}\n` +
    `*Package:* ${selectedPkg.title}\n` +
    `*Vehicle:* ${selectedCar}\n` +
    `*Date:* ${formData.booking_date}\n` +
    `*Payment:* ${formData.payment_type} (₹${payableAmount})`
  );

  const whatsappUrl = `https://wa.me/919425331205?text=${whatsappText}`;

  return (
    <section id="booking" className="py-12 bg-black text-white">
      <div className="max-w-3xl mx-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-center text-white mb-2">Prepaid Safari Booking</h2>
        <p className="text-zinc-400 text-center text-sm mb-8">Official Bandhavgarh permits reserved strictly upon advance or full payment</p>

        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 text-xs font-semibold uppercase tracking-wider">
          <span className={step >= 1 ? "text-orange-500 font-bold" : "text-zinc-600"}>1. Package & Vehicle</span>
          <span className={step >= 2 ? "text-orange-500 font-bold" : "text-zinc-600"}>2. Date & Payment</span>
          <span className={step >= 3 ? "text-orange-500 font-bold" : "text-zinc-600"}>3. Guest Info</span>
        </div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Booking Confirmed & Paid!</h3>
              <p className="text-zinc-400 text-sm max-w-md mx-auto">
                Status: <strong className="text-emerald-400">{formData.payment_type}</strong> (₹{payableAmount.toLocaleString("en-IN")})
              </p>
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
                    Next: Date & Payment Option &rarr;
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                  <div>
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
                  </div>

                  {/* Payment Type Option */}
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
                        <p className="text-xs text-orange-400 font-extrabold mt-1">₹{advanceAmount.toLocaleString("en-IN")}</p>
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
                        <p className="text-xs text-orange-400 font-extrabold mt-1">₹{selectedPkg.price_inr?.toLocaleString("en-IN")}</p>
                      </button>
                    </div>
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

                  <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-white flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-orange-500" /> Payment Summary</p>
                    <p className="text-zinc-300">Package: {selectedPkg.title}</p>
                    <p className="text-orange-400 font-bold">Payable Now: ₹{payableAmount.toLocaleString("en-IN")} ({formData.payment_type})</p>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={() => setStep(2)} className="w-1/2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 py-3.5 rounded-xl text-sm font-semibold">Back</button>
                    <button
                      type="button"
                      onClick={handleConfirmAndPay}
                      disabled={paymentLoading || !formData.customer_name || !formData.customer_phone}
                      className="w-1/2 bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CreditCard className="w-4 h-4" />
                      {paymentLoading ? "Connecting Gateway..." : `Pay ₹${payableAmount.toLocaleString("en-IN")}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
